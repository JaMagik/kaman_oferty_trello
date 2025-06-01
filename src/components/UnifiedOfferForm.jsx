import React, { useState, useEffect } from "react";
import { generateOfferPDF } from "../utils/pdfGenerator";
import { mitsubishiBaseTables } from "../data/tables/mitsubishiTables";
import { atlanticBaseTables } from "../data/tables/atlanticTables";

const KAMAN_APP_ORIGIN = 'https://kaman-oferty-trello.vercel.app'; // zmień jeśli masz inną domenę
const allDevicesData = { ...mitsubishiBaseTables, ...atlanticBaseTables };

export default function UnifiedOfferForm() {
  const [userName, setUserName] = useState("");
  const [price, setPrice] = useState("");
  const [deviceType, setDeviceType] = useState("Mitsubishi-cylinder-PUZ");
  const [model, setModel] = useState("12 kW");
  const [availableModels, setAvailableModels] = useState([]);
  const [tank, setTank] = useState("200 L STAL NIERDZEWNA");
  const [buffer, setBuffer] = useState("Sprzęgło hydrauliczne z osprzętem");
  const [generatedPdfData, setGeneratedPdfData] = useState(null);
  const [trelloCardId, setTrelloCardId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // NOWE: accessToken i accessTokenSecret z URL/localStorage
  const [accessToken, setAccessToken] = useState("");
  const [accessTokenSecret, setAccessTokenSecret] = useState("");

  useEffect(() => {
    // MODELE
    const modelsForDevice = allDevicesData[deviceType] ? Object.keys(allDevicesData[deviceType]) : [];
    setAvailableModels(modelsForDevice);
    if (!modelsForDevice.includes(model)) setModel(modelsForDevice[0] || "");

    // CARD ID
    const params = new URLSearchParams(window.location.search);
    const cardIdFromUrl = params.get('trelloCardId');
    if (cardIdFromUrl) setTrelloCardId(cardIdFromUrl);

    // ACCESS TOKENS
    const at = params.get("accessToken");
    const ats = params.get("accessTokenSecret");

    if (at && ats) {
      localStorage.setItem("accessToken", at);
      localStorage.setItem("accessTokenSecret", ats);
      setAccessToken(at);
      setAccessTokenSecret(ats);
    } else {
      // Sprawdź czy są już w localStorage
      const lsAt = localStorage.getItem("accessToken");
      const lsAts = localStorage.getItem("accessTokenSecret");
      if (lsAt && lsAts) {
        setAccessToken(lsAt);
        setAccessTokenSecret(lsAts);
      }
    }
  }, [deviceType, model]);

  const handleGenerateAndSetPdf = async (e) => {
    e.preventDefault();
    const pdfBlob = await generateOfferPDF(price, userName, deviceType, model, tank, buffer);
    if (pdfBlob) setGeneratedPdfData(pdfBlob);
    else alert("Błąd generowania PDF.");
  };

  const handleDownloadPdf = () => {
    if (!generatedPdfData) return alert("Najpierw wygeneruj PDF!");
    const url = URL.createObjectURL(generatedPdfData);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Oferta_KAMAN_${userName.replace(/ /g, '_')}.pdf`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // NAJWAŻNIEJSZE! Zapis z tokenami
  const handleSaveToTrello = () => {
    if (!generatedPdfData) return alert("Najpierw wygeneruj PDF!");
    if (!trelloCardId) return alert("Brak ID karty Trello.");
    if (!accessToken || !accessTokenSecret) return alert("Brak accessToken – zaloguj się przez Trello!");

    setIsSaving(true);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64PdfDataUrl = reader.result;
      // WYŚLIJ NA /api/saveToTrello (BACKEND)
      try {
        const resp = await fetch("/api/saveToTrello", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cardId: trelloCardId,
            accessToken,
            accessTokenSecret,
            fileDataUrl: base64PdfDataUrl,
            fileName: `Oferta_KAMAN_${userName.replace(/ /g, '_')}.pdf`,
          })
        });
        const result = await resp.json();
        if (resp.ok) {
          alert("PDF zapisany do Trello!");
        } else {
          alert("Błąd zapisu do Trello: " + (result.message || "Nieznany błąd"));
        }
      } catch (err) {
        alert("Błąd połączenia z serwerem: " + err.message);
      } finally {
        setIsSaving(false);
      }
    };
    reader.onerror = () => {
      alert("Błąd przygotowania PDF.");
      setIsSaving(false);
    };
    reader.readAsDataURL(generatedPdfData);
  };

  // AUTORYZUJ jeśli brak tokenów
  const handleAuthTrello = () => {
    window.location.href = "/api/start";
  };

  return (
    <form className="form-container" onSubmit={handleGenerateAndSetPdf}>
      <h2>Generator Ofert KAMAN</h2>
      <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="Imię i nazwisko klienta" required />
      <input type="text" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Cena końcowa" required />

      <select value={deviceType} onChange={(e) => setDeviceType(e.target.value)}>
        {Object.keys(allDevicesData).map(type => <option key={type} value={type}>{type}</option>)}
      </select>

      <select value={model} onChange={(e) => setModel(e.target.value)} disabled={!availableModels.length}>
        {availableModels.map(m => <option key={m} value={m}>{m}</option>)}
      </select>

      <select value={tank} onChange={(e) => setTank(e.target.value)}>
        <option value="200 L STAL NIERDZEWNA">200 L STAL NIERDZEWNA</option>
        <option value="300 L STAL NIERDZEWNA">300 L STAL NIERDZEWNA</option>
      </select>

      <select value={buffer} onChange={(e) => setBuffer(e.target.value)}>
        <option value="Sprzęgło hydrauliczne z osprzętem">Sprzęgło hydrauliczne z osprzętem</option>
        <option value="Brak bufora">Brak bufora</option>
      </select>

      <button type="submit" disabled={isSaving}>Generuj PDF</button>

      {generatedPdfData && <button type="button" onClick={handleDownloadPdf} disabled={isSaving}>Pobierz PDF</button>}
      {generatedPdfData && trelloCardId && accessToken && accessTokenSecret &&
        <button type="button" onClick={handleSaveToTrello} disabled={isSaving}>
          {isSaving ? "Zapisywanie..." : "Zapisz w Trello"}
        </button>}
      {!accessToken || !accessTokenSecret ?
        <button type="button" onClick={handleAuthTrello}>Połącz z Trello</button>
        : null}
    </form>
  );
}

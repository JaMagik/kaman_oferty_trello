// src/components/UnifiedOfferForm.jsx
import React, { useState, useEffect } from "react";
import { generateOfferPDF } from "../utils/pdfGenerator";
import { mitsubishiBaseTables } from "../data/tables/mitsubishiTables";
import { atlanticBaseTables } from "../data/tables/atlanticTables";

const KAMAN_APP_ORIGIN = 'https://kaman-oferty-trello.vercel.app';

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
  const [accessToken, setAccessToken] = useState(() => localStorage.getItem("trello_token") || "");

  useEffect(() => {
    const modelsForDevice = allDevicesData[deviceType] ? Object.keys(allDevicesData[deviceType]) : [];
    setAvailableModels(modelsForDevice);
    if (!modelsForDevice.includes(model)) {
      setModel(modelsForDevice[0] || "");
    }

    const params = new URLSearchParams(window.location.search);
    const cardIdFromUrl = params.get('trelloCardId');
    if (cardIdFromUrl) {
      setTrelloCardId(cardIdFromUrl);
    }

    // Pobierz token z URL (OAuth) i zapisz go w localStorage
    const hash = window.location.hash;
    if (hash) {
      const tokenParams = new URLSearchParams(hash.substring(1));
      const token = tokenParams.get('token');
      if (token) {
        localStorage.setItem('trello_token', token);
        setAccessToken(token);
        window.location.hash = '';
      }
    }
  }, [deviceType, model]);

  const handleTrelloAuth = () => {
    const width = 600, height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
    window.open(
      `https://trello.com/1/authorize?expiration=never&name=KAMAN_APP&scope=read,write&response_type=token&key=YOUR_API_KEY&return_url=${KAMAN_APP_ORIGIN}`,
      'TrelloAuth',
      `width=${width},height=${height},left=${left},top=${top}`
    );
  };

  const handleGenerateAndSetPdf = async (e) => {
    e.preventDefault();
    const pdfBlob = await generateOfferPDF(price, userName, deviceType, model, tank, buffer);
    if (pdfBlob) {
      setGeneratedPdfData(pdfBlob);
    } else {
      alert("Wystąpił błąd podczas generowania PDF.");
    }
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

  const handleSaveToTrello = async () => {
    if (!generatedPdfData) return alert("Najpierw wygeneruj PDF!");
    if (!trelloCardId) return alert("Brak ID karty Trello.");
    if (!accessToken) return alert("Brak autoryzacji Trello.");

    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append('file', generatedPdfData, `Oferta_KAMAN_${userName.replace(/ /g, '_')}.pdf`);

      const response = await fetch(`https://api.trello.com/1/cards/${trelloCardId}/attachments?key=YOUR_API_KEY&token=${accessToken}`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Błąd: ${response.statusText}`);
      }

      alert('PDF został pomyślnie dodany do karty Trello.');
    } catch (error) {
      console.error('Błąd:', error);
      alert(`Błąd zapisu w Trello: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
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
      <button type="button" onClick={handleTrelloAuth} disabled={!!accessToken} style={{ background: !!accessToken ? "#ccc" : "#026aa7" }}>
        {!accessToken ? "Połącz z Trello" : "Połączono z Trello"}
      </button>
      {generatedPdfData && trelloCardId && <button type="button" onClick={handleSaveToTrello} disabled={isSaving || !accessToken}>
        {isSaving ? "Zapisywanie..." : "Zapisz w Trello"}
      </button>}
      {(!generatedPdfData || !trelloCardId) && <button type="button" disabled>
        Zapisz w Trello (niedostępne)
      </button>}
    </form>
  );
}

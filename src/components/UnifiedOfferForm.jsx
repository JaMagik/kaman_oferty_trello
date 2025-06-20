// jamagik/kaman_oferty_trello/kaman_oferty_trello-bfb2142551adeb7f98df4053f558f65743fcf124/src/components/UnifiedOfferForm.jsx

import React, { useState, useEffect } from "react";
import { generateOfferPDF } from "../utils/pdfGenerator";
import { mitsubishiBaseTables } from "../data/tables/mitsubishiTables";
import { atlanticBaseTables } from "../data/tables/atlanticTables";

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
  const [accessToken, setAccessToken] = useState(() => localStorage.getItem("trello_access_token") || "");
  const [accessTokenSecret, setAccessTokenSecret] = useState(() => localStorage.getItem("trello_access_token_secret") || "");

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
  }, [deviceType, model]);

  // Nasłuchuje na zmiany w localStorage po autoryzacji w popupie
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === 'trello_access_token' || event.key === 'trello_access_token_secret') {
        const token = localStorage.getItem('trello_access_token');
        const secret = localStorage.getItem('trello_access_token_secret');
        if (token && secret) {
          setAccessToken(token);
          setAccessTokenSecret(secret);
          alert("Połączono z Trello!");
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleTrelloAuth = () => {
    const width = 600, height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
    window.open(
      '/api/trelloAuth/start.js',
      'TrelloAuth',
      `width=${width},height=${height},left=${left},top=${top}`
    );
  };

  const handleGenerateAndSetPdf = async (e) => {
    e.preventDefault();
    setGeneratedPdfData(null); // Resetuj stan PDF przed nowym generowaniem
    const pdfBlob = await generateOfferPDF(price, userName, deviceType, model, tank, buffer);
    if (pdfBlob) {
      setGeneratedPdfData(pdfBlob);
    } else {
      alert("Wystąpił błąd podczas generowania PDF. Sprawdź konsolę.");
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

  const handleSaveToTrello = () => {
    // ... (reszta funkcji saveToTrello bez zmian)
     if (!generatedPdfData) return alert("Najpierw wygeneruj PDF!");
    if (!trelloCardId) {
      alert("Brak ID karty Trello. Nie można zapisać.");
      return;
    }
    if (!accessToken || !accessTokenSecret) {
      alert("Brak autoryzacji Trello. Najpierw połącz z Trello!");
      return;
    }
    setIsSaving(true);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64PdfDataUrl = reader.result;
      try {
        const res = await fetch('/api/saveToTrello.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            cardId: trelloCardId,
            accessToken,
            accessTokenSecret,
            fileDataUrl: base64PdfDataUrl,
            fileName: `Oferta_KAMAN_${userName.replace(/ /g, '_')}.pdf`,
          }),
        });
        const data = await res.json();
        setIsSaving(false);
        if (res.ok) {
          alert("PDF został zapisany w Trello!");
        } else {
          alert("Błąd zapisu w Trello: " + data.message);
        }
      } catch (error) {
        setIsSaving(false);
        alert("Błąd zapisu w Trello: " + error.message);
      }
    };
    reader.onerror = (error) => {
      alert('Błąd przygotowania PDF do wysłania.');
      setIsSaving(false);
    };
    reader.readAsDataURL(generatedPdfData);
  };

  const isAuthorized = !!accessToken && !!accessTokenSecret;
  const isReadyToSave = !!generatedPdfData && !!trelloCardId;

  return (
    <form className="form-container" onSubmit={handleGenerateAndSetPdf}>
      <h2>Generator Ofert KAMAN</h2>
      <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="Imię i nazwisko klienta" required />
      <input type="text" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Cena końcowa" required />

      <select value={deviceType} onChange={(e) => { setDeviceType(e.target.value); setGeneratedPdfData(null); }}>
        {Object.keys(allDevicesData).map(type => <option key={type} value={type}>{type}</option>)}
      </select>

      <select value={model} onChange={(e) => { setModel(e.target.value); setGeneratedPdfData(null); }} disabled={!availableModels.length}>
        {availableModels.map(m => <option key={m} value={m}>{m}</option>)}
      </select>

      <select value={tank} onChange={(e) => { setTank(e.target.value); setGeneratedPdfData(null); }}>
        <option value="200 L STAL NIERDZEWNA">200 L STAL NIERDZEWNA</option>
        <option value="300 L STAL NIERDZEWNA">300 L STAL NIERDZEWNA</option>
      </select>

      <select value={buffer} onChange={(e) => { setBuffer(e.target.value); setGeneratedPdfData(null); }}>
        <option value="Sprzęgło hydrauliczne z osprzętem">Sprzęgło hydrauliczne z osprzętem</option>
        <option value="Brak bufora">Brak bufora</option>
      </select>
      
      <button type="submit" disabled={isSaving}>Generuj PDF</button>

      {generatedPdfData && <button type="button" onClick={handleDownloadPdf} disabled={isSaving}>Pobierz PDF</button>}

      <button
        type="button"
        onClick={handleTrelloAuth}
        disabled={isAuthorized}
        style={{ background: isAuthorized ? "#4caf50" : "#026aa7", color: "white" }}
      >
        {isAuthorized ? "Połączono z Trello" : "Połącz z Trello"}
      </button>
      
      {/* Ta część jest kluczowa */}
      {isReadyToSave && (
        <button type="button" onClick={handleSaveToTrello} disabled={isSaving || !isAuthorized}>
          {isSaving ? "Zapisywanie..." : "Zapisz w Trello"}
        </button>
      )}
    </form>
  );
}
// ścieżka: src/components/UnifiedOfferForm.jsx
import React, { useState, useEffect } from "react";
import { generateOfferPDF } from "../utils/pdfGenerator";
import { mitsubishiBaseTables } from "../data/tables/mitsubishiTables";
import { atlanticBaseTables } from "../data/tables/atlanticTables";

const allDevicesData = { ...mitsubishiBaseTables, ...atlanticBaseTables };

const TRELLO_API_KEY = '0f932c28c8d97d03741c8863c2ff4afb';
const TRELLO_APP_NAME = 'KamanOfertyPowerUp';

export default function UnifiedOfferForm() {
  const [userName, setUserName] = useState("");
  const [price, setPrice] = useState("");
  const [deviceType, setDeviceType] = useState("Mitsubishi-cylinder-PUZ");
  const [model, setModel] = useState("12 kW");
  const [availableModels, setAvailableModels] = useState([]);
  const [tank, setTank] = useState("200 L STAL NIERDZEWNA");
  const [buffer, setBuffer] = useState("Sprzęgło hydrauliczne z osprzętem");

  const [trelloCardId, setTrelloCardId] = useState(null);
  const [trelloUserToken, setTrelloUserToken] = useState(null);
  const [isSavingToTrello, setIsSavingToTrello] = useState(false);
  const [generatedPdfData, setGeneratedPdfData] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const cardIdFromUrl = urlParams.get('trelloCardId');
    if (cardIdFromUrl) setTrelloCardId(cardIdFromUrl);

    const hash = window.location.hash;
    if (hash.startsWith('#token=')) {
      const token = hash.split('=')[1].split('&')[0].trim();
      setTrelloUserToken(token);
      localStorage.setItem('trelloUserToken', token);
      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      const storedToken = localStorage.getItem('trelloUserToken');
      if (storedToken) setTrelloUserToken(storedToken);
    }
  }, []);

  useEffect(() => {
    const modelsForDevice = allDevicesData[deviceType] ? Object.keys(allDevicesData[deviceType]) : [];
    setAvailableModels(modelsForDevice);
    if (!modelsForDevice.includes(model)) setModel(modelsForDevice[0] || "");
  }, [deviceType]);

  const handleGenerateAndSetPdf = async (e) => {
    e.preventDefault();
    const pdfData = await generateOfferPDF(price, userName, deviceType, model, tank, buffer);
    setGeneratedPdfData(pdfData);
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

  const handleTrelloAuth = () => {
    const returnUrl = window.location.href.split('#')[0];
    const authUrl = `https://trello.com/1/authorize?expiration=1day&name=${encodeURIComponent(TRELLO_APP_NAME)}&scope=read,write&response_type=token&key=${TRELLO_API_KEY}&return_url=${encodeURIComponent(returnUrl)}`;
    window.location.href = authUrl;
  };

  const handleSaveToTrello = () => {
    if (!generatedPdfData || !trelloCardId || !trelloUserToken) return alert("Brak danych!");
    setIsSavingToTrello(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Pdf = reader.result;
      try {
        const response = await fetch('/api/saveToTrello', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            cardId: trelloCardId,
            token: trelloUserToken,
            fileDataUrl: base64Pdf,
            fileName: `Oferta_KAMAN_${userName.replace(/ /g, '_')}.pdf`
          })
        });
        const result = await response.json();
        if (response.ok) alert("Sukces! Oferta zapisana w Trello.");
        else alert("Błąd Trello: " + result.message);
      } catch (err) {
        console.error(err); alert("Błąd sieciowy podczas zapisu do Trello.");
      } finally {
        setIsSavingToTrello(false);
      }
    };
    reader.readAsDataURL(generatedPdfData);
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
        <option>200 L STAL NIERDZEWNA</option><option>300 L STAL NIERDZEWNA</option>
      </select>

      <select value={buffer} onChange={(e) => setBuffer(e.target.value)}>
        <option>Sprzęgło hydrauliczne z osprzętem</option><option>Brak bufora</option>
      </select>

      <button type="submit">Generuj PDF</button>

      {generatedPdfData && <button type="button" onClick={handleDownloadPdf}>Pobierz PDF</button>}
      {trelloCardId && !trelloUserToken && <button onClick={handleTrelloAuth}>Autoryzuj Trello</button>}
      {trelloCardId && trelloUserToken && generatedPdfData && (
        <button onClick={handleSaveToTrello} disabled={isSavingToTrello}>
          {isSavingToTrello ? "Zapisywanie..." : "Zapisz ofertę w Trello"}
        </button>
      )}
    </form>
  );
}

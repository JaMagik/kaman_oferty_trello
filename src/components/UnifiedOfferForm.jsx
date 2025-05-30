// src/components/UnifiedOfferForm.jsx
import React, { useState, useEffect } from "react";
import { generateOfferPDF } from "../utils/pdfGenerator"; //
import { mitsubishiBaseTables } from "../data/tables/mitsubishiTables"; //
import { atlanticBaseTables } from "../data/tables/atlanticTables"; //

// Upewnij się, że ta stała odpowiada tej używanej w main.js dla targetOrigin
// Możesz ją też pobrać z process.env jeśli jest tam dostępna jako zmienna publiczna
const KAMAN_APP_ORIGIN = 'https://kaman-oferty-trello.vercel.app';

const allDevicesData = { ...mitsubishiBaseTables, ...atlanticBaseTables }; //

export default function UnifiedOfferForm() {
  const [userName, setUserName] = useState(""); //
  const [price, setPrice] = useState(""); //
  const [deviceType, setDeviceType] = useState("Mitsubishi-cylinder-PUZ"); //
  const [model, setModel] = useState("12 kW"); //
  const [availableModels, setAvailableModels] = useState([]); //
  const [tank, setTank] = useState("200 L STAL NIERDZEWNA"); //
  const [buffer, setBuffer] = useState("Sprzęgło hydrauliczne z osprzętem"); //
  const [generatedPdfData, setGeneratedPdfData] = useState(null); //
  const [trelloCardId, setTrelloCardId] = useState(null);

  useEffect(() => { //
    const modelsForDevice = allDevicesData[deviceType] ? Object.keys(allDevicesData[deviceType]) : []; //
    setAvailableModels(modelsForDevice); //
    if (!modelsForDevice.includes(model)) { //
        setModel(modelsForDevice[0] || ""); //
    }

    const params = new URLSearchParams(window.location.search);
    const cardIdFromUrl = params.get('trelloCardId');
    if (cardIdFromUrl) {
      setTrelloCardId(cardIdFromUrl);
      console.log("Trello Card ID from URL:", cardIdFromUrl);
    } else {
      console.warn("Nie znaleziono trelloCardId w URL.");
      // Można by tu spróbować odczytać z t.arg(), jeśli TrelloPowerUp.iframe() jest dostępne globalnie
      // const t = window.TrelloPowerUp?.iframe();
      // if (t) {
      //   const cardIdFromArg = t.arg('cardId');
      //   if (cardIdFromArg) setTrelloCardId(cardIdFromArg);
      // }
    }
  }, [deviceType, model]); //

  const handleGenerateAndSetPdf = async (e) => { //
    e.preventDefault(); //
    const pdfData = await generateOfferPDF(price, userName, deviceType, model, tank, buffer); //
    setGeneratedPdfData(pdfData); //
  };

  const handleDownloadPdf = () => { //
    if (!generatedPdfData) return alert("Najpierw wygeneruj PDF!"); //
    const url = URL.createObjectURL(generatedPdfData); //
    const a = document.createElement('a'); //
    a.href = url; //
    a.download = `Oferta_KAMAN_${userName.replace(/ /g, '_')}.pdf`; //
    document.body.appendChild(a); a.click(); document.body.removeChild(a); //
    URL.revokeObjectURL(url); //
  };

  const handleSaveToTrello = () => { //
    if (!generatedPdfData) { //
      alert("Najpierw wygeneruj PDF!"); //
      return; //
    }
    if (!trelloCardId) {
      alert("Brak ID karty Trello. Nie można zapisać.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64PdfDataUrl = reader.result;

      window.parent.postMessage({
        type: 'TRELLO_SAVE_PDF', // Dodajemy typ wiadomości
        pdfDataUrl: base64PdfDataUrl, // Wysyłamy PDF jako base64 data URL
        pdfName: `Oferta_KAMAN_${userName.replace(/ /g, '_')}.pdf`, //
        cardId: trelloCardId // Przekazujemy ID karty
      }, KAMAN_APP_ORIGIN); // Używamy origin aplikacji jako target dla bezpieczeństwa

      alert("Polecenie zapisu PDF wysłane do Power-Upa Trello!");
    };
    reader.onerror = (error) => {
      console.error('Błąd konwersji PDF na base64:', error);
      alert('Błąd przygotowania PDF do wysłania.');
    };
    reader.readAsDataURL(generatedPdfData); // Konwertujemy Blob na Data URL
  };

  return ( //
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
        <option>200 L STAL NIERDZEWNA</option>
        <option>300 L STAL NIERDZEWNA</option>
      </select>

      <select value={buffer} onChange={(e) => setBuffer(e.target.value)}>
        <option>Sprzęgło hydrauliczne z osprzętem</option>
        <option>Brak bufora</option>
      </select>

      <button type="submit">Generuj PDF</button>

      {generatedPdfData && <button type="button" onClick={handleDownloadPdf}>Pobierz PDF</button>}
      {generatedPdfData && <button type="button" onClick={handleSaveToTrello}>Zapisz w Trello</button>}
    </form>
  );
}
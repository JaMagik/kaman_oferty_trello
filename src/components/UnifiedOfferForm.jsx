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
      console.log("UNIFIED_FORM: Trello Card ID from URL:", cardIdFromUrl); // Dodany log
    } else {
      console.warn("UNIFIED_FORM: Nie znaleziono trelloCardId w URL.");
    }
  }, [deviceType, model]); //

  const handleGenerateAndSetPdf = async (e) => { //
    e.preventDefault(); //
    console.log("UNIFIED_FORM: Rozpoczęto generowanie PDF..."); // Dodany log
    const pdfData = await generateOfferPDF(price, userName, deviceType, model, tank, buffer); //
    if (pdfData) {
        console.log("UNIFIED_FORM: PDF wygenerowany pomyślnie (jako Blob)."); // Dodany log
        setGeneratedPdfData(pdfData); //
    } else {
        console.error("UNIFIED_FORM: Błąd podczas generowania PDF, pdfData jest null."); // Dodany log
    }
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
    console.log("UNIFIED_FORM: Kliknięto 'Zapisz w Trello'."); // Dodany log
    if (!generatedPdfData) { //
      alert("Najpierw wygeneruj PDF!"); //
      return; //
    }
    if (!trelloCardId) {
      alert("Brak ID karty Trello. Nie można zapisać.");
      console.error("UNIFIED_FORM: trelloCardId jest nullem lub niezdefiniowane w handleSaveToTrello"); // Dodany log
      return;
    }
    console.log("UNIFIED_FORM: PDF i cardId są dostępne. Rozpoczynanie konwersji do base64."); // Dodany log

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64PdfDataUrl = reader.result;
      console.log('UNIFIED_FORM: Przygotowano dane do wysłania (base64):', { // Dodany log
        type: 'TRELLO_SAVE_PDF',
        pdfDataUrlLength: base64PdfDataUrl ? base64PdfDataUrl.length : 0,
        pdfName: `Oferta_KAMAN_${userName.replace(/ /g, '_')}.pdf`,
        cardId: trelloCardId
      });
      console.log('UNIFIED_FORM: Wysyłanie postMessage do parent z targetOrigin:', KAMAN_APP_ORIGIN); // Dodany log

      window.parent.postMessage({
        type: 'TRELLO_SAVE_PDF',
        pdfDataUrl: base64PdfDataUrl,
        pdfName: `Oferta_KAMAN_${userName.replace(/ /g, '_')}.pdf`, //
        cardId: trelloCardId
      }, KAMAN_APP_ORIGIN); // Używamy origin aplikacji jako target dla bezpieczeństwa

      alert("Polecenie zapisu PDF wysłane do Power-Upa Trello!"); // Ten alert się pojawia
    };
    reader.onerror = (error) => {
      console.error('UNIFIED_FORM: Błąd konwersji PDF na base64:', error); // Zmieniony log
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
      {generatedPdfData && trelloCardId && <button type="button" onClick={handleSaveToTrello}>Zapisz w Trello</button>}
      {!trelloCardId && generatedPdfData && <button type="button" disabled title="ID karty Trello nie zostało wczytane.">Zapisz w Trello (niedostępne)</button>}
    </form>
  );
}
// src/components/UnifiedOfferForm.jsx
import React, { useState, useEffect } from "react";
import { generateOfferPDF } from "../utils/pdfGenerator";
import { mitsubishiBaseTables } from "../data/tables/mitsubishiTables";
import { atlanticBaseTables } from "../data/tables/atlanticTables";

// KAMAN_APP_ORIGIN nie jest już potrzebny do postMessage stąd
// const KAMAN_APP_ORIGIN = 'https://kaman-oferty-trello.vercel.app';

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
  const [trelloContext, setTrelloContext] = useState(null); // Do przechowywania kontekstu 't' popupa

  useEffect(() => {
    // Inicjalizacja kontekstu Trello dla popupa
    if (window.TrelloPowerUp) {
      const t = window.TrelloPowerUp.iframe();
      setTrelloContext(t);
      // Odczyt cardId przekazanego przez args w main.js
      const cardIdFromArgs = t.arg('cardId');
      if (cardIdFromArgs) {
        setTrelloCardId(cardIdFromArgs);
        console.log("UNIFIED_FORM: Trello Card ID from t.arg():", cardIdFromArgs);
      } else {
         // Fallback na parametry URL, jeśli t.arg() nie zadziała od razu
        const params = new URLSearchParams(window.location.search);
        const cardIdFromUrl = params.get('trelloCardId');
        if (cardIdFromUrl) {
            setTrelloCardId(cardIdFromUrl);
            console.log("UNIFIED_FORM: Trello Card ID from URL:", cardIdFromUrl);
        } else {
            console.warn("UNIFIED_FORM: Nie znaleziono trelloCardId ani w t.arg(), ani w URL.");
        }
      }
    } else {
        console.error("UNIFIED_FORM: TrelloPowerUp nie jest dostępne.");
    }


    const modelsForDevice = allDevicesData[deviceType] ? Object.keys(allDevicesData[deviceType]) : [];
    setAvailableModels(modelsForDevice);
    if (!modelsForDevice.includes(model)) {
        setModel(modelsForDevice[0] || "");
    }
  }, [deviceType, model]);

  const handleGenerateAndSetPdf = async (e) => {
    e.preventDefault();
    console.log("UNIFIED_FORM: Rozpoczęto generowanie PDF...");
    const pdfBlob = await generateOfferPDF(price, userName, deviceType, model, tank, buffer);
    if (pdfBlob) {
        console.log("UNIFIED_FORM: PDF wygenerowany pomyślnie (jako Blob).");
        setGeneratedPdfData(pdfBlob);
    } else {
        console.error("UNIFIED_FORM: Błąd podczas generowania PDF, pdfBlob jest null.");
        alert("Wystąpił błąd podczas generowania PDF. Sprawdź konsolę.");
    }
  };

  const handleDownloadPdf = () => {
    // ... (bez zmian)
  };

  const handleSaveToTrello = () => {
    console.log("UNIFIED_FORM: Kliknięto 'Zapisz w Trello'.");
    if (!generatedPdfData) {
      alert("Najpierw wygeneruj PDF!");
      return;
    }
    if (!trelloCardId) {
      alert("Brak ID karty Trello. Nie można zapisać.");
      console.error("UNIFIED_FORM: trelloCardId jest nullem lub niezdefiniowane w handleSaveToTrello");
      return;
    }
    if (!trelloContext) {
      alert("Błąd inicjalizacji Power-Upa w popupie. Nie można zapisać.");
      console.error("UNIFIED_FORM: trelloContext (t) jest niedostępny.");
      return;
    }

    console.log("UNIFIED_FORM: PDF i cardId są dostępne. Rozpoczynanie konwersji do base64.");
    setIsSaving(true);

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64PdfDataUrl = reader.result;
      const dataToReturn = {
        type: 'TRELLO_SAVE_PDF', // Typ do identyfikacji w main.js
        pdfDataUrl: base64PdfDataUrl,
        pdfName: `Oferta_KAMAN_${userName.replace(/ /g, '_')}.pdf`,
        cardId: trelloCardId
      };

      console.log('UNIFIED_FORM: Przygotowano dane do zwrócenia przez t.closePopup():', {
          ...dataToReturn,
          pdfDataUrlLength: base64PdfDataUrl ? base64PdfDataUrl.length : 0
      });

      // Zamykamy popup i przekazujemy dane z powrotem do main.js
      trelloContext.closePopup(dataToReturn);
      // Nie potrzebujemy już alertu tutaj, bo main.js obsłuży wynik.
      // setIsSaving(false); // main.js powinien dać znać o wyniku, a popup się zamknie.
    };
    reader.onerror = (error) => {
      console.error('UNIFIED_FORM: Błąd konwersji PDF na base64:', error);
      alert('Błąd przygotowania PDF do wysłania.');
      setIsSaving(false);
    };
    reader.readAsDataURL(generatedPdfData);
  };

  // ... (reszta JSX formularza jak poprzednio, przycisk Zapisz w Trello wywołuje handleSaveToTrello)
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
      
      {generatedPdfData && trelloCardId && trelloContext && 
        <button type="button" onClick={handleSaveToTrello} disabled={isSaving}>
          {isSaving ? "Zapisywanie..." : "Zapisz w Trello"}
        </button>
      }
      {(!generatedPdfData || !trelloCardId || !trelloContext) && 
        <button type="button" disabled title={!trelloContext ? "Błąd inicjalizacji Power-Upa" : (!trelloCardId ? "ID karty Trello nie zostało wczytane." : "Najpierw wygeneruj PDF.")}>
          Zapisz w Trello (niedostępne)
        </button>
      }
    </form>
  );
}
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
      console.log("UNIFIED_FORM: Trello Card ID from URL:", cardIdFromUrl);
    } else {
      console.warn("UNIFIED_FORM: Nie znaleziono trelloCardId w URL.");
    }

    const handleMessage = (event) => {
      if (event.origin !== KAMAN_APP_ORIGIN) return;
      const { type, status, message } = event.data;
      if (type === 'TRELLO_SAVE_PDF_RESPONSE') {
        setIsSaving(false);
        if (status === 'success') {
          alert("PDF został pomyślnie zapisany w Trello.");
          if (window.TrelloPowerUp) {
            window.TrelloPowerUp.iframe().closeModal();
          } else {
            window.close();
          }
        } else {
          alert(`Błąd podczas zapisu PDF: ${message}`);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
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
    if (!generatedPdfData) return alert("Najpierw wygeneruj PDF!");
    const url = URL.createObjectURL(generatedPdfData);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Oferta_KAMAN_${userName.replace(/ /g, '_')}.pdf`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
    console.log("UNIFIED_FORM: PDF i cardId są dostępne. Rozpoczynanie konwersji do base64.");
    setIsSaving(true);

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64PdfDataUrl = reader.result;
      console.log('UNIFIED_FORM: Przygotowano dane do wysłania (base64):', {
        type: 'TRELLO_SAVE_PDF',
        pdfDataUrlLength: base64PdfDataUrl ? base64PdfDataUrl.length : 0,
        pdfName: `Oferta_KAMAN_${userName.replace(/ /g, '_')}.pdf`,
        cardId: trelloCardId
      });
      console.log('UNIFIED_FORM: Wysyłanie postMessage do parent z targetOrigin:', KAMAN_APP_ORIGIN);

     window.TrelloPowerUp && window.TrelloPowerUp.iframe().closeModal({
  type: 'TRELLO_SAVE_PDF',
  pdfDataUrl: base64PdfDataUrl,
  pdfName: `Oferta_KAMAN_${userName.replace(/ /g, '_')}.pdf`,
  cardId: trelloCardId
});

    };
    reader.onerror = (error) => {
      console.error('UNIFIED_FORM: Błąd konwersji PDF na base64:', error);
      alert('Błąd przygotowania PDF do wysłania.');
      setIsSaving(false);
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
        <option value="200 L STAL NIERDZEWNA">200 L STAL NIERDZEWNA</option>
        <option value="300 L STAL NIERDZEWNA">300 L STAL NIERDZEWNA</option>
      </select>

      <select value={buffer} onChange={(e) => setBuffer(e.target.value)}>
        <option value="Sprzęgło hydrauliczne z osprzętem">Sprzęgło hydrauliczne z osprzętem</option>
        <option value="Brak bufora">Brak bufora</option>
      </select>

      <button type="submit" disabled={isSaving}>Generuj PDF</button>

      {generatedPdfData && <button type="button" onClick={handleDownloadPdf} disabled={isSaving}>Pobierz PDF</button>}
      {generatedPdfData && trelloCardId && <button type="button" onClick={handleSaveToTrello} disabled={isSaving}>
        {isSaving ? "Zapisywanie..." : "Zapisz w Trello"}
      </button>}
      {(!generatedPdfData || !trelloCardId) && <button type="button" disabled title={!trelloCardId ? "ID karty Trello nie zostało wczytane." : "Najpierw wygeneruj PDF."}>Zapisz w Trello (niedostępne)</button>}
    </form>
  );
}

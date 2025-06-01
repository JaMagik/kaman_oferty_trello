// src/components/UnifiedOfferForm.jsx
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

  // Pobierz modele po zmianie typu urządzenia
  useEffect(() => {
    const modelsForDevice = allDevicesData[deviceType] ? Object.keys(allDevicesData[deviceType]) : [];
    setAvailableModels(modelsForDevice);
    if (!modelsForDevice.includes(model)) {
      setModel(modelsForDevice[0] || "");
    }
  }, [deviceType]);

  // Pobierz ID karty Trello z parametru URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cardIdFromUrl = params.get('trelloCardId');
    if (cardIdFromUrl) {
      setTrelloCardId(cardIdFromUrl);
      console.log("UNIFIED_FORM: Trello Card ID from URL:", cardIdFromUrl);
    } else {
      console.warn("UNIFIED_FORM: Nie znaleziono trelloCardId w URL.");
    }
  }, []);

  // Generuj PDF
  const handleGenerateAndSetPdf = async (e) => {
    e.preventDefault();
    setGeneratedPdfData(null);
    setIsSaving(false);
    console.log("UNIFIED_FORM: Rozpoczęto generowanie PDF...");
    const pdfBlob = await generateOfferPDF(price, userName, deviceType, model, tank, buffer);
    if (pdfBlob) {
      setGeneratedPdfData(pdfBlob);
      console.log("UNIFIED_FORM: PDF wygenerowany pomyślnie (jako Blob).");
    } else {
      alert("Błąd podczas generowania PDF.");
    }
  };

  // Pobierz PDF
  const handleDownloadPdf = () => {
    if (!generatedPdfData) return alert("Najpierw wygeneruj PDF!");
    const url = URL.createObjectURL(generatedPdfData);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Oferta_KAMAN_${userName.replace(/ /g, '_')}.pdf`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Zapisz PDF do Trello (przez Power-Up API)
  const handleSaveToTrello = () => {
    if (!generatedPdfData) {
      alert("Najpierw wygeneruj PDF!");
      return;
    }
    if (!trelloCardId) {
      alert("Brak ID karty Trello. Nie można zapisać.");
      return;
    }
    setIsSaving(true);

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64PdfDataUrl = reader.result;
      // Przekazujemy PDF przez closeModal do Power-Upa
      if (window.TrelloPowerUp && window.TrelloPowerUp.iframe) {
        window.TrelloPowerUp.iframe().closeModal({
          type: "TRELLO_SAVE_PDF",
          pdfDataUrl: base64PdfDataUrl,
          pdfName: `Oferta_KAMAN_${userName.replace(/ /g, '_')}.pdf`,
          cardId: trelloCardId,
        });
      } else {
        alert("Błąd komunikacji z Trello Power-Up.");
        setIsSaving(false);
      }
    };
    reader.onerror = () => {
      alert('Błąd konwersji PDF do base64!');
      setIsSaving(false);
    };
    reader.readAsDataURL(generatedPdfData);
  };

  return (
    <form className="form-container" onSubmit={handleGenerateAndSetPdf} style={{ width: '100%', maxWidth: 700, margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center' }}>Generator Ofert KAMAN</h2>
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

      <button type="submit" disabled={isSaving} style={{ marginTop: 16, fontWeight: 'bold', fontSize: 20 }}>Generuj PDF</button>

      {generatedPdfData && (
        <>
          <button type="button" onClick={handleDownloadPdf} disabled={isSaving} style={{ marginTop: 16, fontWeight: 'bold', fontSize: 20 }}>Pobierz PDF</button>
          <button
            type="button"
            onClick={handleSaveToTrello}
            disabled={isSaving || !trelloCardId}
            style={{ marginTop: 16, fontWeight: 'bold', fontSize: 20 }}
          >
            {isSaving ? "Zapisywanie..." : "Zapisz w Trello"}
          </button>
        </>
      )}

      {(!generatedPdfData || !trelloCardId) && (
        <button
          type="button"
          disabled
          style={{ marginTop: 16, fontWeight: 'bold', fontSize: 20, opacity: 0.6 }}
          title={!trelloCardId ? "ID karty Trello nie zostało wczytane." : "Najpierw wygeneruj PDF."}
        >
          Zapisz w Trello (niedostępne)
        </button>
      )}
    </form>
  );
}

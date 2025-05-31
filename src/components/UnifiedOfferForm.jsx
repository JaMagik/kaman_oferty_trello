// src/components/UnifiedOfferForm.jsx
import React, { useState, useEffect } from "react";
import { generateOfferPDF } from "../utils/pdfGenerator";
import { mitsubishiBaseTables } from "../data/tables/mitsubishiTables";
import { atlanticBaseTables } from "../data/tables/atlanticTables";

// Upewnij się, że ta stała odpowiada KAMAN_APP_ORIGIN w main.js
// Najlepiej byłoby ją pobrać ze zmiennej środowiskowej, jeśli jest dostępna po stronie klienta
// np. import.meta.env.VITE_APP_URL_ORIGIN lub przekazać z main.js do popupu
const KAMAN_APP_ORIGIN = 'https://kaman-oferty-trello.vercel.app'; // Dostosuj, jeśli potrzeba

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
  const [isSaving, setIsSaving] = useState(false); // Dodatkowy stan do obsługi ładowania

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
      // Rozważ poinformowanie użytkownika lub zablokowanie przycisku zapisu, jeśli to krytyczne
    }
  }, [deviceType, model]);

  const handleGenerateAndSetPdf = async (e) => {
    e.preventDefault();
    console.log("UNIFIED_FORM: Rozpoczęto generowanie PDF...");
    const pdfBlob = await generateOfferPDF(price, userName, deviceType, model, tank, buffer); // Zakładamy, że zwraca Blob
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
    setIsSaving(true); // Rozpocznij ładowanie

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

      // Wysyłamy wiadomość do okna, które otworzyło ten popup.
      // Zakładamy, że `main.js` (w iframe Power-Upa) jest rodzicem lub jest w stanie przechwycić tę wiadomość.
      // Jeśli `window.opener` jest bardziej odpowiednie (np. jeśli popup jest nowym oknem a nie iframe), dostosuj.
      // W kontekście `t.popup`, `window.parent` powinno być głównym oknem Trello.
      // Komunikacja z iframe Power-Upa przez `window.parent` może być skomplikowana.
      // Rozwiązanie z `t.closePopup` i przekazaniem danych może być bardziej niezawodne.
      // Na razie zostajemy przy `postMessage`.
      if (window.parent) {
        window.parent.postMessage({
            type: 'TRELLO_SAVE_PDF',
            pdfDataUrl: base64PdfDataUrl,
            pdfName: `Oferta_KAMAN_${userName.replace(/ /g, '_')}.pdf`,
            cardId: trelloCardId
        }, KAMAN_APP_ORIGIN); // Używamy KAMAN_APP_ORIGIN - upewnij się, że main.js na to pozwala
      } else {
        console.error("UNIFIED_FORM: window.parent nie jest dostępne. Nie można wysłać wiadomości.");
        alert("Błąd komunikacji z Trello Power-Up.");
      }
      // Alert jest informacyjny, ale faktyczne potwierdzenie powinno przyjść od main.js
      // alert("Polecenie zapisu PDF wysłane do Power-Upa Trello!");
      // setIsSaving(false); // Przenieś to do momentu otrzymania odpowiedzi lub timeoutu
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
        {/* Dodaj inne opcje jeśli potrzebne */}
      </select>

      <select value={buffer} onChange={(e) => setBuffer(e.target.value)}>
        <option value="Sprzęgło hydrauliczne z osprzętem">Sprzęgło hydrauliczne z osprzętem</option>
        <option value="Brak bufora">Brak bufora</option>
        {/* Dodaj inne opcje jeśli potrzebne */}
      </select>

      <button type="submit" disabled={isSaving}>Generuj PDF</button>

      {generatedPdfData && <button type="button" onClick={handleDownloadPdf} disabled={isSaving}>Pobierz PDF</button>}
      {generatedPdfData && trelloCardId && <button type="button" onClick={handleSaveToTrello} disabled={isSaving}>
        {isSaving ? "Zapisywanie..." : "Zapisz w Trello"}
      </button>}
      {/* Przycisk Zapisz w Trello jest nieaktywny, jeśli brakuje cardId lub PDF */}
      {(!generatedPdfData || !trelloCardId) && <button type="button" disabled title={!trelloCardId ? "ID karty Trello nie zostało wczytane." : "Najpierw wygeneruj PDF."}>Zapisz w Trello (niedostępne)</button>}
    </form>
  );
}
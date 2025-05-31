// src/components/UnifiedOfferForm.jsx
import React, { useState, useEffect } from "react";
import { generateOfferPDF } from "../utils/pdfGenerator"; //
import { mitsubishiBaseTables } from "../data/tables/mitsubishiTables"; //
import { atlanticBaseTables } from "../data/tables/atlanticTables"; //

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
  const [trelloCardId, setTrelloCardId] = useState(null); //
  const [isSaving, setIsSaving] = useState(false); //
  const [trelloContext, setTrelloContext] = useState(null); //

  useEffect(() => {
    console.log("UNIFIED_FORM: useEffect - Inicjalizacja..."); //
    if (window.TrelloPowerUp) {
      console.log("UNIFIED_FORM: TrelloPowerUp jest dostępne."); //
      try {
        const t = window.TrelloPowerUp.iframe(); //
        setTrelloContext(t); //
        console.log("UNIFIED_FORM: Kontekst 't' dla popupa został ustawiony."); //

        const cardIdFromArgs = t.arg('cardId'); //
        if (cardIdFromArgs) {
          setTrelloCardId(cardIdFromArgs); //
          console.log("UNIFIED_FORM: Trello Card ID from t.arg():", cardIdFromArgs); //
        } else {
          console.warn("UNIFIED_FORM: Nie znaleziono cardId w t.arg(). Próba odczytu z URL."); //
          const params = new URLSearchParams(window.location.search); //
          const cardIdFromUrl = params.get('trelloCardId'); //
          if (cardIdFromUrl) {
            setTrelloCardId(cardIdFromUrl); //
            console.log("UNIFIED_FORM: Trello Card ID from URL (fallback):", cardIdFromUrl); //
          } else {
            console.warn("UNIFIED_FORM: Nie znaleziono trelloCardId ani w t.arg(), ani w URL."); //
          }
        }
      } catch (e) {
        console.error("UNIFIED_FORM: Błąd podczas inicjalizacji kontekstu TrelloPowerUp.iframe():", e); //
        alert("Nie udało się zainicjować integracji z Trello w tym oknie. Spróbuj zamknąć i otworzyć ponownie."); //
      }
    } else {
      console.error("UNIFIED_FORM: TrelloPowerUp nie jest dostępne! Upewnij się, że skrypt https://p.trellocdn.com/power-up.min.js jest załadowany w index.html tego popupa."); //
      alert("Krytyczny błąd: Brak biblioteki Trello Power-Up w tym oknie."); //
    }

    const modelsForDevice = allDevicesData[deviceType] ? Object.keys(allDevicesData[deviceType]) : []; //
    setAvailableModels(modelsForDevice); //
    if (!modelsForDevice.includes(model)) {
        setModel(modelsForDevice[0] || ""); //
    }
  }, [deviceType, model]);

  const handleGenerateAndSetPdf = async (e) => {
    e.preventDefault(); //
    console.log("UNIFIED_FORM: Rozpoczęto generowanie PDF..."); //
    setIsSaving(true); //
    try {
      const pdfBlob = await generateOfferPDF(price, userName, deviceType, model, tank, buffer); //
      if (pdfBlob instanceof Blob) {
          console.log("UNIFIED_FORM: PDF wygenerowany pomyślnie (jako Blob). Rozmiar:", pdfBlob.size); //
          setGeneratedPdfData(pdfBlob); //
      } else {
          console.error("UNIFIED_FORM: generateOfferPDF nie zwrócił obiektu Blob.", pdfBlob); //
          alert("Wystąpił błąd podczas generowania PDF: nieprawidłowy format danych."); //
          setGeneratedPdfData(null); //
      }
    } catch (error) {
        console.error("UNIFIED_FORM: Wyjątek podczas generowania PDF:", error); //
        alert("Wystąpił krytyczny błąd podczas generowania PDF."); //
        setGeneratedPdfData(null); //
    } finally {
        setIsSaving(false); //
    }
  };

  const handleDownloadPdf = () => {
    console.log("UNIFIED_FORM - handleDownloadPdf: Rozpoczęto. generatedPdfData:", generatedPdfData); //
    if (!generatedPdfData) {
      alert("Najpierw wygeneruj PDF!"); //
      console.log("UNIFIED_FORM - handleDownloadPdf: Brak generatedPdfData."); //
      return;
    }
    try {
      if (!(generatedPdfData instanceof Blob)) {
          console.error("UNIFIED_FORM - handleDownloadPdf: generatedPdfData nie jest obiektem Blob!", generatedPdfData); //
          alert("Błąd: Wygenerowane dane PDF nie są prawidłowym plikiem."); //
          return;
      }
      console.log("UNIFIED_FORM - handleDownloadPdf: generatedPdfData jest Blobem. Rozmiar:", generatedPdfData.size, "Typ:", generatedPdfData.type); //

      const url = URL.createObjectURL(generatedPdfData); //
      console.log("UNIFIED_FORM - handleDownloadPdf: Utworzono URL obiektu:", url); //
      const a = document.createElement('a'); //
      a.href = url; //
      a.download = `Oferta_KAMAN_${userName.replace(/ /g, '_') || 'klient'}.pdf`; //
      document.body.appendChild(a); //
      console.log("UNIFIED_FORM - handleDownloadPdf: Próba kliknięcia linku pobierania.", a); //
      a.click(); //
      document.body.removeChild(a); //
      URL.revokeObjectURL(url); //
      console.log("UNIFIED_FORM - handleDownloadPdf: Pobieranie powinno się rozpocząć."); //
    } catch (error) {
      console.error("UNIFIED_FORM - handleDownloadPdf: Błąd podczas tworzenia URL lub klikania:", error); //
      alert("Wystąpił błąd podczas próby pobrania PDF."); //
    }
  };

  const handleSaveToTrello = () => {
    console.log("UNIFIED_FORM: Kliknięto 'Zapisz w Trello'."); //
    if (!trelloCardId) {
      alert("Brak ID karty Trello. Nie można zapisać."); //
      console.error("UNIFIED_FORM: trelloCardId jest nullem lub niezdefiniowane w handleSaveToTrello"); //
      return;
    }
    if (!trelloContext) {
      alert("Błąd inicjalizacji Power-Upa w popupie. Nie można zapisać. Spróbuj odświeżyć."); //
      console.error("UNIFIED_FORM: trelloContext (t) jest niedostępny. Próba zapisu niemożliwa."); //
      return;
    }

    // ----- WERSJA TESTOWA: WYSYŁANIE SUPER MINIMALNYCH DANYCH -----
    const superMinimalData = {
        type: "SUPER_MINIMAL_TEST_V2", // Zmieniony typ dla jasności testu
        message: "To jest test v2 z UnifiedOfferForm!",
        cardId: trelloCardId, // Przekazanie cardId
        timestamp: new Date().toISOString()
    };

    console.log('UNIFIED_FORM: Próba zamknięcia popupu z SUPER MINIMALNYMI DANYMI V2:', superMinimalData); //
    setIsSaving(true); //

    try {
        trelloContext.closePopup(superMinimalData);
        console.log('UNIFIED_FORM: t.closePopup() wywołane z danymi V2.');
        // Popup powinien zostać zamknięty przez Trello. Stan 'isSaving' nie musi być tutaj resetowany,
        // ponieważ komponent zostanie odmontowany. Główny skrypt (main.js) obsłuży resztę.
    } catch (e) {
        console.error("UNIFIED_FORM: Błąd podczas wywoływania t.closePopup() z danymi V2:", e); //
        alert("Błąd przy t.closePopup() V2: " + e.message);
        setIsSaving(false); //
    }
    return; // Zakończ tutaj dla tego testu
    // ----- KONIEC WERSJI TESTOWEJ -----

    /*
    // ----- ORYGINALNA LOGIKA WYSYŁANIA PEŁNEGO PDF (do przywrócenia po testach) -----
    if (!generatedPdfData) {
      alert("Najpierw wygeneruj PDF!");
      return;
    }
    if (!(generatedPdfData instanceof Blob)) {
        console.error("UNIFIED_FORM - handleSaveToTrello: generatedPdfData nie jest obiektem Blob!", generatedPdfData);
        alert("Błąd: Wygenerowane dane PDF nie są prawidłowym plikiem do zapisu.");
        return;
    }

    console.log("UNIFIED_FORM: PDF, cardId i trelloContext są dostępne. Rozpoczynanie konwersji do base64.");
    setIsSaving(true);

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64PdfDataUrl = reader.result;
      const dataToReturn = {
        type: 'TRELLO_SAVE_PDF',
        pdfDataUrl: base64PdfDataUrl,
        pdfName: `Oferta_KAMAN_${userName.replace(/ /g, '_') || 'klient'}.pdf`,
        cardId: trelloCardId
      };

      console.log('UNIFIED_FORM: Przygotowano dane do zwrócenia przez t.closePopup():', {
          type: dataToReturn.type,
          pdfName: dataToReturn.pdfName,
          cardId: dataToReturn.cardId,
          pdfDataUrlLength: base64PdfDataUrl ? base64PdfDataUrl.length : 0
      });
      
      console.log('UNIFIED_FORM: Wywoływanie trelloContext.closePopup().');
      try {
        trelloContext.closePopup(dataToReturn);
      } catch (error) {
        console.error("UNIFIED_FORM: Błąd podczas wywoływania trelloContext.closePopup():", error);
        alert("Wystąpił błąd podczas próby zamknięcia okna i wysłania danych do Trello.");
        setIsSaving(false);
      }
    };
    reader.onerror = (error) => {
      console.error('UNIFIED_FORM: Błąd konwersji PDF na base64:', error);
      alert('Błąd przygotowania PDF do wysłania.');
      setIsSaving(false);
    };
    reader.readAsDataURL(generatedPdfData);
    // ----- KONIEC ORYGINALNEJ LOGIKI -----
    */
  };

  return (
    <form className="form-container" onSubmit={handleGenerateAndSetPdf}>
      <h2>Generator Ofert KAMAN</h2> {/* */}
      <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="Imię i nazwisko klienta" required /> {/* */}
      <input type="text" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Cena końcowa" required /> {/* */}

      <select value={deviceType} onChange={(e) => setDeviceType(e.target.value)}> {/* */}
        {Object.keys(allDevicesData).map(type => <option key={type} value={type}>{type}</option>)}
      </select>

      <select value={model} onChange={(e) => setModel(e.target.value)} disabled={!availableModels.length}> {/* */}
        {availableModels.map(m => <option key={m} value={m}>{m}</option>)}
      </select>

      <select value={tank} onChange={(e) => setTank(e.target.value)}> {/* */}
        <option value="200 L STAL NIERDZEWNA">200 L STAL NIERDZEWNA</option> {/* */}
        <option value="300 L STAL NIERDZEWNA">300 L STAL NIERDZEWNA</option> {/* */}
      </select>

      <select value={buffer} onChange={(e) => setBuffer(e.target.value)}> {/* */}
        <option value="Sprzęgło hydrauliczne z osprzętem">Sprzęgło hydrauliczne z osprzętem</option> {/* */}
        <option value="Brak bufora">Brak bufora</option> {/* */}
      </select>

      <button type="submit" disabled={isSaving}>Generuj PDF</button> {/* */}

      {generatedPdfData instanceof Blob && <button type="button" onClick={handleDownloadPdf} disabled={isSaving}>Pobierz PDF</button>} {/* */}
      
      {trelloCardId && trelloContext &&  // Usunięto generatedPdfData z warunku, aby przycisk był widoczny podczas testu
        <button type="button" onClick={handleSaveToTrello} disabled={isSaving}>
          {isSaving ? "Zapisywanie..." : "Zapisz w Trello"}
        </button>
      }
      {(!trelloCardId || !trelloContext) && 
        <button type="button" disabled title={!trelloContext ? "Błąd inicjalizacji Trello" : (!trelloCardId ? "ID karty Trello nie jest dostępne" : "Najpierw wygeneruj PDF (lub błąd)")}>
          Zapisz w Trello (niedostępne)
        </button>
      }
    </form>
  );
}
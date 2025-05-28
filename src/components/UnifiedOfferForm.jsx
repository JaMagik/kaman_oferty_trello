// ścieżka: src/components/UnifiedOfferForm.jsx

import React, { useState, useEffect } from "react";
// generateOfferPDF będzie teraz prawdopodobnie zwracać dane PDF
import { generateOfferPDF } from "../utils/pdfGenerator"; 
import { mitsubishiBaseTables } from "../data/tables/mitsubishiTables";
import { atlanticBaseTables } from "../data/tables/atlanticTables";

const allDevicesData = {
  ...mitsubishiBaseTables,
  ...atlanticBaseTables,
};

// Klucz API Trello (ten jest publiczny i używany do inicjalizacji OAuth)
const TRELLO_API_KEY = '0f932c28c8d97d03741c8863c2ff4afb'; 
// Nazwa Twojej aplikacji, jak zarejestrowana w Trello
const TRELLO_APP_NAME = 'KamanOfertyPowerUp'; // Lub inna nazwa, którą nadałeś

export default function UnifiedOfferForm() {
  const [userName, setUserName] = useState("");
  const [price, setPrice] = useState("");
  const [deviceType, setDeviceType] = useState("Mitsubishi-cylinder-PUZ");
  const [model, setModel] = useState("12 kW");
  const [availableModels, setAvailableModels] = useState([]);
  const [tank, setTank] = useState("200 L STAL NIERDZEWNA");
  const [buffer, setBuffer] = useState("Sprzęgło hydrauliczne z osprzętem");

  // Stany dla integracji z Trello
  const [trelloCardId, setTrelloCardId] = useState(null);
  const [trelloUserToken, setTrelloUserToken] = useState(null);
  const [isSavingToTrello, setIsSavingToTrello] = useState(false);
  const [generatedPdfData, setGeneratedPdfData] = useState(null); // Do przechowywania wygenerowanego PDF

  // Efekt do odczytu trelloCardId i tokena (jeśli wraca z autoryzacji)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const cardIdFromUrl = urlParams.get('trelloCardId');
    if (cardIdFromUrl) {
      setTrelloCardId(cardIdFromUrl);

       console.log("URL Aplikacji (return_url):", returnUrl);
  console.log("Pełny URL Autoryzacyjny (authUrl) wysyłany do Trello:", authUrl);
      console.log("Odczytano trelloCardId z URL:", cardIdFromUrl);
    }

    // Obsługa powrotu z autoryzacji Trello (token jest w URL hash)
    if (window.location.hash.includes("#token=")) {
      const token = window.location.hash.substring(window.location.hash.indexOf('=') + 1);
      setTrelloUserToken(token);
      console.log("Odczytano token Trello z URL hash:", token);
      // Wyczyść hash, aby nie był widoczny i nie przeszkadzał
      window.history.replaceState({}, document.title, window.location.pathname + window.location.search);
      // Możesz zapisać token w localStorage, jeśli chcesz go przechować dłużej
      // localStorage.setItem('trelloUserToken', token);
    } else {
      // Spróbuj załadować token z localStorage, jeśli istnieje
      // const storedToken = localStorage.getItem('trelloUserToken');
      // if (storedToken) {
      //   setTrelloUserToken(storedToken);
      // }
    }
  }, []);


  useEffect(() => {
    const modelsForDevice = allDevicesData[deviceType]
      ? Object.keys(allDevicesData[deviceType])
      : [];
    setAvailableModels(modelsForDevice);
    if (modelsForDevice.length > 0 && !modelsForDevice.includes(model)) {
      setModel(modelsForDevice[0]);
    } else if (modelsForDevice.length === 0) {
      setModel("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deviceType]);

  const handleGenerateAndSetPdf = async (e) => {
    if (e) e.preventDefault(); // Zapobiegaj domyślnej akcji formularza, jeśli wywołane przez onSubmit
    
    // Modyfikacja: generateOfferPDF zwraca teraz Blob lub Uint8Array
    const pdfData = await generateOfferPDF(price, userName, deviceType, model, tank, buffer); 
    if (pdfData) {
      setGeneratedPdfData(pdfData); // Zapisz dane PDF w stanie
      // Automatyczne pobieranie po wygenerowaniu (opcjonalne, jeśli masz osobny przycisk)
      // const url = URL.createObjectURL(pdfData);
      // const a = document.createElement('a');
      // a.href = url;
      // a.download = `Oferta_KAMAN_${userName.replace(/ /g, '_')}.pdf`;
      // document.body.appendChild(a);
      // a.click();
      // document.body.removeChild(a);
      // URL.revokeObjectURL(url);
      console.log("PDF wygenerowany i zapisany w stanie.");
    }
  };
  
  const handleDownloadPdf = () => {
    if (generatedPdfData) {
      const url = URL.createObjectURL(generatedPdfData);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Oferta_KAMAN_${userName.replace(/ /g, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      alert("Najpierw wygeneruj PDF!");
    }
  };


  const handleTrelloAuth = () => {
    const returnUrl = window.location.href.split('#')[0]; // URL bez hasha
    const authUrl = `https://trello.com/1/authorize?expiration=1day&name=${encodeURIComponent(TRELLO_APP_NAME)}&scope=read,write&response_type=token&key=${TRELLO_API_KEY}&return_url=${encodeURIComponent(returnUrl)}`;
    window.location.href = authUrl;
  };

  const handleSaveToTrello = async () => {
    if (!generatedPdfData) {
      alert("Najpierw wygeneruj PDF!");
      return;
    }
    if (!trelloCardId) {
      alert("Brak ID karty Trello. Otwórz aplikację z Power-Upa.");
      return;
    }
    if (!trelloUserToken) {
      alert("Brak autoryzacji Trello. Kliknij 'Autoryzuj Trello'.");
      return;
    }

    setIsSavingToTrello(true);

    // Konwersja Blob do Data URL, jeśli to potrzebne (zależne od pdfGenerator)
    // Jeśli pdfGenerator.jsx zwraca Uint8Array lub Blob, nie musisz go konwertować na DataURL
    // Wystarczy, że backend obsłuży Blob lub prześlesz jako ArrayBuffer.
    // Dla uproszczenia, jeśli generatedPdfData to Blob:
    const reader = new FileReader();
    reader.readAsDataURL(generatedPdfData);
    reader.onloadend = async () => {
        const base64Pdf = reader.result;

        try {
            const response = await fetch('/api/saveToTrello', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    cardId: trelloCardId,
                    token: trelloUserToken,
                    fileDataUrl: base64Pdf, // Wysyłamy jako Data URL
                    fileName: `Oferta_KAMAN_${userName.replace(/ /g, '_')}.pdf`
                })
            });

            if (response.ok) {
                alert("Sukces! Oferta została zapisana na karcie Trello.");
                // Możesz chcieć zamknąć okno, jeśli to popup
                // window.close(); 
            } else {
                const error = await response.json();
                alert("Błąd zapisu do Trello: " + (error.message || response.statusText));
            }
        } catch (err) {
            console.error("Błąd sieciowy przy zapisie do Trello:", err);
            alert("Wystąpił błąd sieciowy podczas zapisu do Trello.");
        } finally {
            setIsSavingToTrello(false);
        }
    };
    reader.onerror = () => {
        console.error("Błąd odczytu pliku PDF");
        alert("Błąd odczytu pliku PDF.");
        setIsSavingToTrello(false);
    };
  };

  return (
    <form className="form-container" onSubmit={handleGenerateAndSetPdf}>
      <h2>Generator Ofert KAMAN</h2>

      <label htmlFor="userName">Imię i Nazwisko Klienta:</label>
      <input id="userName" type="text" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="Podaj imię i nazwisko" required />

      <label htmlFor="price">Cena Końcowa (PLN):</label>
      <input id="price" type="text" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Podaj cenę" required />

      <label htmlFor="deviceType">Typ Urządzenia/Oferty:</label>
      <select id="deviceType" value={deviceType} onChange={(e) => setDeviceType(e.target.value)}>
        <optgroup label="Mitsubishi (Pompy Ciepła)">
          <option value="Mitsubishi-cylinder">Mitsubishi Cylinder (Standard PUD)</option>
          <option value="Mitsubishi-cylinder-PUZ">Mitsubishi Cylinder (Zubadan PUZ)</option>
          <option value="Mitsubishi-cylinder-PUZ-1F">Mitsubishi Cylinder (Zubadan PUZ 1-faz.)</option>
          <option value="Mitsubishi-hydrobox">Mitsubishi Hydrobox (Standard PUD)</option>
          <option value="Mitsubishi-hydrobox-PUZ">Mitsubishi Hydrobox (Zubadan PUZ)</option>
          <option value="Mitsubishi-hydrobox-PUZ-1F">Mitsubishi Hydrobox (Zubadan PUZ 1-faz.)</option>
          <option value="Mitsubishi-ecoinverter">Mitsubishi Ecoinverter (Cylinder)</option>
          <option value="Mitsubishi-ecoinverter-hydrobox">Mitsubishi Ecoinverter (Hydrobox)</option>
          <option value="Mitsubishi-hp">Mitsubishi Hyper Heating</option>
        </optgroup>
        <optgroup label="Mitsubishi (Klimatyzatory)">
          <option value="MITSUBISHI AY">Klimatyzator Mitsubishi AY</option>
          <option value="MITSUBISHI HR">Klimatyzator Mitsubishi HR</option>
        </optgroup>
        <optgroup label="Toshiba">
          <option value="Toshiba 3F">Toshiba (3-fazowe)</option>
          <option value="Toshiba 1F">Toshiba (1-fazowe)</option>
        </optgroup>
        <optgroup label="Atlantic">
          <option value="ATLANTIC-M-DUO">Atlantic M-Duo</option>
        </optgroup>
      </select>

      <label htmlFor="model">Model (Moc):</label>
      <select id="model" value={model} onChange={(e) => setModel(e.target.value)} disabled={availableModels.length === 0}>
        {availableModels.length > 0 ? (
          availableModels.map((modelName) => (
            <option key={modelName} value={modelName}>
              {modelName}
            </option>
          ))
        ) : (
          <option value="">Brak dostępnych modeli</option>
        )}
      </select>

      <label htmlFor="tank">Pojemność zasobnika CWU:</label>
      <select id="tank" value={tank} onChange={(e) => setTank(e.target.value)}>
        <option value="none">Brak zasobnika CWU / Zintegrowany</option>
        <option value="200 L STAL NIERDZEWNA">200 L STAL NIERDZEWNA</option>
        <option value="250 L STAL NIERDZEWNA">250 L STAL NIERDZEWNA</option>
        <option value="300 L STAL NIERDZEWNA">300 L STAL NIERDZEWNA</option>
        <option value="40L">40 L</option>
        <option value="60L">60 L</option>
        <option value="80L">80 L</option>
        <option value="100L">100 L</option>
        <option value="120L">120 L</option>
        <option value="140L">140 L</option>
        <option value="200L">200 L (standard)</option>
        <option value="300L">300 L (standard)</option>
        <option value="400L">400 L</option>
        <option value="500L">500 L</option>
        <option value="800L">800 L</option>
        <option value="1000L">1000 L</option>
      </select>

      <label htmlFor="buffer">Bufor/Sprzęgło:</label>
      <select id="buffer" value={buffer} onChange={(e) => setBuffer(e.target.value)}>
        <option value="sprzeglo">Sprzęgło hydrauliczne z osprzętem</option>
        <option value="none">Brak bufora</option>
        <option value="40-120L">Bufor 40-120 L + osprzęt</option>
        <option value="40L">Bufor 40 L + osprzęt</option>
        <option value="60L">Bufor 60 L + osprzęt</option>
        <option value="80L">Bufor 80 L + osprzęt</option>
        <option value="100L">Bufor 100 L + osprzęt</option>
        <option value="120L">Bufor 120 L + osprzęt</option>
        <option value="140L">Bufor 140 L + osprzęt</option>
        <option value="200L">Bufor 200 L + osprzęt</option>
        <option value="300L">Bufor 300 L + osprzęt</option>
        <option value="500L">Bufor 500 L + osprzęt</option>
        <option value="800L">Bufor 800 L + osprzęt</option>
        <option value="1000L">Bufor 1000 L + osprzęt</option>
      </select>

      <button type="submit"> 
        Generuj PDF
      </button>

      {generatedPdfData && (
        <button type="button" onClick={handleDownloadPdf} style={{marginTop: '10px', background: '#555'}}>
          Pobierz wygenerowany PDF
        </button>
      )}

      {/* Przyciski Trello */}
      {trelloCardId && !trelloUserToken && (
        <button type="button" onClick={handleTrelloAuth} style={{marginTop: '20px', background: '#0079BF'}}>
          Autoryzuj Trello
        </button>
      )}

      {trelloCardId && trelloUserToken && generatedPdfData && (
        <button 
          type="button" 
          onClick={handleSaveToTrello} 
          disabled={isSavingToTrello}
          style={{marginTop: '10px', background: isSavingToTrello ? '#ccc' : '#0079BF'}}
        >
          {isSavingToTrello ? "Zapisywanie..." : "Zapisz ofertę w Trello"}
        </button>
      )}
    </form>
  );
}
// ścieżka: src/components/UnifiedOfferForm.jsx

import React, { useState, useEffect } from "react";
import { generateOfferPDF } from "../utils/pdfGenerator";
import { mitsubishiBaseTables } from "../data/tables/mitsubishiTables";
import { atlanticBaseTables } from "../data/tables/atlanticTables"; // Upewnij się, że ten import jest

// Łączymy dane urządzeń - upewnij się, że atlanticBaseTables zawiera klucz 'ATLANTIC-M-DUO'
const allDevicesData = {
  ...mitsubishiBaseTables,
  ...atlanticBaseTables, 
};

export default function UnifiedOfferForm() {
  // ... (stany userName, price, deviceType, model, availableModels, tank, buffer - bez zmian na razie) ...
  // Możesz chcieć zmienić domyślny deviceType, jeśli często wybierasz Atlantic M-Duo
   const [userName, setUserName] = useState("");
  const [price, setPrice] = useState("");
  
  const [deviceType, setDeviceType] = useState("Mitsubishi-cylinder-PUZ"); 
  const [model, setModel] = useState("12 kW"); 
  const [availableModels, setAvailableModels] = useState([]);

  const [tank, setTank] = useState("200 L STAL NIERDZEWNA"); 
  const [buffer, setBuffer] = useState("Sprzęgło hydrauliczne z osprzętem");

  useEffect(() => {
    const modelsForDevice = allDevicesData[deviceType] 
      ? Object.keys(allDevicesData[deviceType]) 
      : [];
      
    setAvailableModels(modelsForDevice);

    if (modelsForDevice.length > 0) {
      if (!modelsForDevice.includes(model)) {
        setModel(modelsForDevice[0]);
      }
    } else {
      setModel(""); 
    }
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deviceType]); 

  const handleGenerate = (e) => {
    e.preventDefault();
    generateOfferPDF(price, userName, deviceType, model, tank, buffer);
  };

  return (
    <form className="form-container" onSubmit={handleGenerate}>
      <h2>Generator Ofert KAMAN</h2>

       <label htmlFor="userName">Imię i Nazwisko Klienta:</label>
      <input id="userName" type="text" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="Podaj imię i nazwisko" required />

      <label htmlFor="price">Cena Końcowa (PLN):</label>
      <input id="price" type="text" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Podaj cenę" required />

      <label htmlFor="deviceType">Typ Urządzenia/Oferty:</label>
      <select id="deviceType" value={deviceType} onChange={(e) => setDeviceType(e.target.value)}>
        {/* ... (grupy Mitsubishi i Toshiba bez zmian) ... */}
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
          {/* Jeśli Extensa AI Duo ma pozostać: */}
          {/* <option value="ATLANTIC">Atlantic Extensa AI Duo</option> */}
          <option value="ATLANTIC-M-DUO">Atlantic M-Duo</option> 
          {/* Jeśli będziesz mieć osobne definicje dla Hydrobox w atlanticTables.js:
            <option value="ATLANTIC-HYDROBOX">Atlantic Excelia AI Hydrobox</option> 
          */}
        </optgroup>
        {/* Wklej tutaj resztę swoich <optgroup> i <option> */}
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
        <option value="200 L STAL NIERDZEWNA">200 L STAL NIERDZEWNA</option> {/* Zgodne z Twoim oryginalnym plikiem */}
        <option value="250 L STAL NIERDZEWNA">250 L STAL NIERDZEWNA</option> {/* Zgodne z Twoim oryginalnym plikiem */}
        <option value="300 L STAL NIERDZEWNA">300 L STAL NIERDZEWNA</option> {/* Zgodne z Twoim oryginalnym plikiem */}
        <option value="40L">40 L</option>
        <option value="60L">60 L</option>
        <option value="80L">80 L</option>
        <option value="100L">100 L</option>
        <option value="120L">120 L</option>
        <option value="140L">140 L</option>
        <option value="200L">200 L (standard)</option> {/* Odróżnienie od stali nierdzewnej */}
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
        <option value="40-120L">Bufor 40-120 L + osprzęt</option> {/* Utrzymałem format z Twojego pliku React */}
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
    </form>
  );
}
// ścieżka: src/components/UnifiedOfferForm.jsx

import React, { useState, useEffect } from "react";
import { generateOfferPDF } from "../utils/pdfGenerator";
import { mitsubishiBaseTables } from "../data/tables/mitsubishiTables";

// TODO: W przyszłości stwórz jeden centralny obiekt z danymi wszystkich marek
const allDevicesData = mitsubishiBaseTables;

export default function UnifiedOfferForm() {
  const [userName, setUserName] = useState("");
  const [price, setPrice] = useState("");
  
  const [deviceType, setDeviceType] = useState("Mitsubishi-cylinder-PUZ");
  const [model, setModel] = useState("12 kW");
  const [availableModels, setAvailableModels] = useState([]);

  const [tank, setTank] = useState("200 L STAL NIERDZEWNA");
  const [buffer, setBuffer] = useState("Sprzęgło hydrauliczne z osprzętem");

  // JEDEN, POPRAWIONY useEffect do zarządzania logiką formularza
  useEffect(() => {
    // Krok 1: Pobierz listę modeli dla wybranego typu urządzenia
    const modelsForDevice = allDevicesData[deviceType] 
      ? Object.keys(allDevicesData[deviceType]) 
      : [];
      
    // Krok 2: Zaktualizuj listę dostępnych modeli w dropdownie
    setAvailableModels(modelsForDevice);

    // Krok 3: Sprawdź, czy aktualnie wybrany model jest na nowej liście.
    // Jeśli nie, ustaw pierwszy model z nowej listy jako aktywny, aby uniknąć błędu.
    if (modelsForDevice.length > 0 && !modelsForDevice.includes(model)) {
      setModel(modelsForDevice[0]);
    }
    
  }, [deviceType]); // Ten kod uruchomi się przy starcie ORAZ za każdym razem, gdy zmieni się `deviceType`

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
        {/* Wklej tutaj resztę swoich <optgroup> i <option> */}
      </select>

      <label htmlFor="model">Model (Moc):</label>
      <select id="model" value={model} onChange={(e) => setModel(e.target.value)} disabled={availableModels.length === 0}>
        {availableModels.map((modelName) => (
          <option key={modelName} value={modelName}>
            {modelName}
          </option>
        ))}
      </select>

      <label htmlFor="tank">Pojemność zasobnika CWU:</label>
      <select id="tank" value={tank} onChange={(e) => setTank(e.target.value)}>
        <option value="none">Brak zasobnika CWU</option>
        <option value="200 L STAL NIERDZEWNA">200 L STAL NIERDZEWNA</option>
        <option value="250 L STAL NIERDZEWNA">250 L STAL NIERDZEWNA</option>
        <option value="300 L STAL NIERDZEWNA">300 L STAL NIERDZEWNA</option>
      </select>

      <label htmlFor="buffer">Bufor/Sprzęgło:</label>
      <select id="buffer" value={buffer} onChange={(e) => setBuffer(e.target.value)}>
        <option value="sprzeglo">Sprzęgło hydrauliczne z osprzętem</option>
        <option value="none">Brak bufora</option>
        <option value="40-120L">Bufor 40-120 L + osprzęt</option>
        <option value="100L">Bufor 100 L + osprzęt</option>
      </select>

      <button type="submit">
        Generuj PDF
      </button>
    </form>
  );
}
import React, { useState } from "react";
import { generateMitsubishiZubadanCylinderOfferPDF } from "../utils/pdfGenerator";

export default function UnifiedOfferForm() {
  const [userName, setUserName] = useState("");
  const [price, setPrice] = useState("");
  const [deviceType, setDeviceType] = useState("Mitsubishi-hydrobox");
  const [model, setModel] = useState("14 kW");
  const [tank, setTank] = useState("Brak zasobnika CWU");
  const [buffer, setBuffer] = useState("Sprzęgło hydrauliczne z osprzętem");

  // NOWA funkcja do obsługi kliknięcia/generowania PDF
  const handleGenerate = (e) => {
    e.preventDefault();
    generateMitsubishiZubadanCylinderOfferPDF(
      price,
      userName,
      deviceType,
      model,
      tank,
      buffer
    );
  };

  return (
    <form className="form-container" onSubmit={handleGenerate}>
      <h2>Generator Ofert</h2>

      <label>Imię i Nazwisko:</label>
      <input
        type="text"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        placeholder="Podaj imię i nazwisko"
      />

      <label>Cena:</label>
      <input
        type="text"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="Podaj cenę"
      />

      <label>Typ oferty:</label>
      <select value={deviceType} onChange={(e) => setDeviceType(e.target.value)}>
        <option value="Mitsubishi-hydrobox">Mitsubishi-hydrobox</option>
        <option value="Mitsubishi-cylinder">Mitsubishi-cylinder</option>
        <option value="Toshiba 3F">Toshiba 3F</option>
        <option value="Toshiba 1F">Toshiba 1F</option>
        {/* Dodaj kolejne typy */}
      </select>

      <label>Model:</label>
      <select value={model} onChange={(e) => setModel(e.target.value)}>
        <option value="14 kW">14 kW</option>
        <option value="12 kW">12 kW</option>
        <option value="10 kW">10 kW</option>
        <option value="8 kW">8 kW</option>
        <option value="6 kW">6 kW</option>
        {/* Dodaj kolejne moce */}
      </select>

      <label>Pojemność zasobnika CWU:</label>
      <select value={tank} onChange={(e) => setTank(e.target.value)}>
        <option value="Brak zasobnika CWU">Brak zasobnika CWU</option>
        <option value="200 L STAL NIERDZEWNA">200 L STAL NIERDZEWNA</option>
        <option value="250 L STAL NIERDZEWNA">250 L STAL NIERDZEWNA</option>
        <option value="300 L STAL NIERDZEWNA">300 L STAL NIERDZEWNA</option>
        {/* Dodaj kolejne pojemności */}
      </select>

      <label>Pojemność bufora:</label>
      <select value={buffer} onChange={(e) => setBuffer(e.target.value)}>
        <option value="Sprzęgło hydrauliczne z osprzętem">Sprzęgło hydrauliczne z osprzętem</option>
        <option value="Brak bufora">Brak bufora</option>
        <option value="40-120 L">40-120 L</option>
        <option value="100 L">100 L</option>
        {/* Dodaj kolejne pojemności */}
      </select>

      <button type="submit">
        Generuj PDF
      </button>
    </form>
  );
}

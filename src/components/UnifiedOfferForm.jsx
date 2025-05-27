// ścieżka: src/components/UnifiedOfferForm.jsx

import React, { useState } from "react";
// Ten import POWINIEN teraz pasować do eksportu w pdfGenerator.jsx
import { generateOfferPDF } from "../utils/pdfGenerator"; 

export default function UnifiedOfferForm() {
  const [userName, setUserName] = useState("");
  const [price, setPrice] = useState("");
  
  const [deviceType, setDeviceType] = useState("Mitsubishi-cylinder-PUZ"); 
  const [model, setModel] = useState("12 kW"); 
  const [tank, setTank] = useState("200 L STAL NIERDZEWNA"); 
  const [buffer, setBuffer] = useState("Sprzęgło hydrauliczne z osprzętem"); 

  const handleGenerate = (e) => {
    e.preventDefault();
    // Wywołanie funkcji z ujednoliconą nazwą
    generateOfferPDF(
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
      <h2>Generator Ofert KAMAN</h2>

      <label htmlFor="userName">Imię i Nazwisko Klienta:</label>
      <input
        id="userName"
        type="text"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        placeholder="Podaj imię i nazwisko"
        required
      />

      <label htmlFor="price">Cena Końcowa (PLN):</label>
      <input
        id="price"
        type="text"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="Podaj cenę"
        required
      />

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
          <option value="ATLANTIC">Atlantic Extensa AI Duo</option>
          <option value="ATLANTIC-HYDROBOX">Atlantic Excelia AI Hydrobox</option>
          <option value="ATLANTIC-M-DUO">Atlantic M-Duo</option>
        </optgroup>
        <optgroup label="Viessmann">
          <option value="VIESSMANN">Viessmann Vitocal 150-A</option>
        </optgroup>
        <optgroup label="Galmet">
          <option value="GALMET-PRIMA">Galmet Prima</option>
        </optgroup>
        <optgroup label="Heiztechnik">
          <option value="HEIZTECHNIK">Heiztechnik Calla Verde Comfort</option>
        </optgroup>
         <optgroup label="NIBE">
           <option value="NIBE12">NIBE F1245 (Gruntowa)</option>
        </optgroup>
        <optgroup label="Kotły na Pellet">
            <option value="LAZAR">Lazar (Pellet)</option>
            <option value="KAMEN-KOMPAKT-LUX">Kamen Kompakt Lux (Pellet)</option>
            <option value="KAMEN-PELLET-KOMPAKT">Kamen Pellet Kompakt</option>
            <option value="KAMEN-DRX">Kamen DRX (Pellet)</option>
            <option value="Kotlospaw Slimko Plus">Kotłospaw Slimko Plus (Pellet)</option>
            <option value="Kotlospaw slimko plus niski">Kotłospaw Slimko Plus Niski (Pellet)</option>
            <option value="QMPELL">QMPELL EVO (Pellet)</option>
        </optgroup>
        <optgroup label="Kotły na Drewno/Pellet (Hybrydowe)">
            <option value="DREWKO-HYBRID">Kotłospaw Drewko Hybrid</option>
            <option value="Kotlospaw drewko plus palnik easy ROT">Kotłospaw Drewko Plus (palnik Easy ROT)</option>
            <option value="Kotlospaw drewko plus palnik REVO">Kotłospaw Drewko Plus (palnik REVO)</option>
        </optgroup>
        <optgroup label="Klimatyzatory Inne">
            <option value="ROTENSO">Rotenso</option>
            <option value="KAISAI">Kaisai</option>
            <option value="MIDEA">Midea</option>
        </optgroup>
      </select>

      <label htmlFor="model">Model (Moc):</label>
      <select id="model" value={model} onChange={(e) => setModel(e.target.value)}>
        <option value="14 kW">14 kW</option>
        <option value="13 kW">13 kW</option>
        <option value="12 kW">12 kW</option>
        <option value="11 kW">11 kW</option>
        <option value="10 kW">10 kW</option>
        <option value="9 kW">9 kW</option>
        <option value="8 kW">8 kW</option>
        <option value="6 kW">6 kW</option>
        <option value="5 kW">5 kW</option>
        <option value="4 kW">4 kW</option>
        <option value="50 kW">50 kW</option>
        <option value="35 kW">35 kW</option>
        <option value="30 kW">30 kW</option>
        <option value="25 kW">25 kW</option>
        <option value="24 kW">24 kW</option>
        <option value="22 kW/440">22 kW/440L</option>
        <option value="22 kW/240">22 kW/240L</option>
        <option value="22 kW/150">22 kW/150L</option>
        <option value="20 kW">20 kW</option>
        <option value="18 kW">18 kW</option>
        <option value="17 kW">17 kW</option>
        <option value="16 kW">16 kW</option>
        <option value="15 kW/440">15 kW/440L</option>
        <option value="15 kW/240">15 kW/240L</option>
        <option value="15 kW/150">15 kW/150L</option>
        <option value="15 kW">15 kW</option>
        <option value="11 kW/440">11 kW/440L</option>
        <option value="11 kW/240">11 kW/240L</option>
        <option value="11 kW/150">11 kW/150L</option>
        <option value="5,3 kW">5,3 kW</option>
        <option value="4,2 kW">4,2 kW</option>
        <option value="3,5 kW">3,5 kW</option>
        <option value="2,6 kW">2,6 kW</option>
        <option value="2,5 kW">2,5 kW</option>
        <option value="2,1 kW">2,1 kW</option>
        <option value="2 kW">2 kW</option>
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
// ścieżka: src/components/UnifiedOfferForm.jsx
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

  useEffect(() => {
    const modelsForDevice = allDevicesData[deviceType] ? Object.keys(allDevicesData[deviceType]) : [];
    setAvailableModels(modelsForDevice);
    if (!modelsForDevice.includes(model)) setModel(modelsForDevice[0] || "");
  }, [deviceType]);

  const handleGenerateAndSetPdf = async (e) => {
    e.preventDefault();
    const pdfData = await generateOfferPDF(price, userName, deviceType, model, tank, buffer);
    setGeneratedPdfData(pdfData);
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
    if (!generatedPdfData) {
      alert("Najpierw wygeneruj PDF!");
      return;
    }

    // 1️⃣ Stwórz tymczasowy URL z PDF (Blob)
    const pdfBlobUrl = URL.createObjectURL(generatedPdfData);

    // 2️⃣ Wyślij go do Power-Upa przez postMessage
    window.parent.postMessage({
      pdfUrl: pdfBlobUrl,
      pdfName: `Oferta_KAMAN_${userName.replace(/ /g, '_')}.pdf`
    }, '*');

    alert("PDF wysłany do Power-Upa (powinien być zapisany w Trello)!");
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
        <option>200 L STAL NIERDZEWNA</option>
        <option>300 L STAL NIERDZEWNA</option>
      </select>

      <select value={buffer} onChange={(e) => setBuffer(e.target.value)}>
        <option>Sprzęgło hydrauliczne z osprzętem</option>
        <option>Brak bufora</option>
      </select>

      <button type="submit">Generuj PDF</button>

      {generatedPdfData && <button type="button" onClick={handleDownloadPdf}>Pobierz PDF</button>}
      {generatedPdfData && <button type="button" onClick={handleSaveToTrello}>Zapisz w Trello</button>}
    </form>
  );
}

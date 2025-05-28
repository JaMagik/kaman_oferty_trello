// ścieżka: src/data/tables/index.js

import { mitsubishiBaseTables } from './mitsubishiTables';
import toshiba3FTable from './toshiba-3f';
import { atlanticBaseTables } from './atlanticTables'; // Upewnij się, że ten plik istnieje i zawiera definicje dla ATLANTIC-M-DUO

// Funkcje pomocnicze do opisu zasobnika i bufora
function getTankDescription(tankCapacity) {
  if (!tankCapacity || tankCapacity === 'none' || tankCapacity === 'Brak zasobnika CWU' || tankCapacity === 'Brak zasobnika CWU / Zintegrowany') {
    return 'Brak zasobnika ciepłej wody użytkowej';
  }
  // Upewnij się, że nazwy pojemności są spójne z tym, co jest w formularzu i co zwraca ta funkcja.
  // Przykład: '200 L STAL NIERDZEWNA'
  const cleanCapacity = String(tankCapacity).replace('-L', 'L').replace(' STAL NIERDZEWNA', '');
  return `ZASOBNIK CIEPŁEJ WODY UŻYTKOWEJ ${cleanCapacity} ZE STALI NIERDZEWNEJ`;
}

function getBufferDescription(bufferCapacity) {
  if (!bufferCapacity || bufferCapacity === 'none' || bufferCapacity === 'Brak bufora') {
    return 'Brak bufora';
  }
  if (bufferCapacity === 'sprzeglo' || bufferCapacity === 'Sprzęgło hydrauliczne z osprzętem') {
    return 'Sprzęgło hydrauliczne z osprzętem';
  }
  const cleanCapacity = String(bufferCapacity).replace('-L', 'L');
  return `Bufor (sprzęgło hydrauliczne) ${cleanCapacity} + osprzęt`;
}

export function getTableData(deviceType, model, tankCapacity, bufferCapacity) {
  console.log('[getTableData] OTRZYMANO PARAMETRY:', { deviceType, model, tankCapacity, bufferCapacity });

  let baseTableData = [];
  const deviceTypeKey = deviceType; // Używamy kopii, aby uniknąć modyfikacji oryginału, jeśli byłaby taka potrzeba

  // Pobieranie danych bazowych w zależności od deviceType i modelu
  if (deviceTypeKey.startsWith('Mitsubishi-')) {
    if (mitsubishiBaseTables && mitsubishiBaseTables[deviceTypeKey] && mitsubishiBaseTables[deviceTypeKey][model]) {
      baseTableData = JSON.parse(JSON.stringify(mitsubishiBaseTables[deviceTypeKey][model])); // Głęboka kopia
      console.log(`[getTableData] Dla Mitsubishi (${deviceTypeKey}, ${model}), ZNALEZIONO tabelę bazową.`);
    } else {
      console.warn(`[getTableData] Dla Mitsubishi (${deviceTypeKey}, ${model}), NIE ZNALEZIONO tabeli bazowej. Sprawdź klucze.`);
    }
  } else if (deviceTypeKey === 'Toshiba 3F' || deviceTypeKey === 'Toshiba 1F') {
    baseTableData = JSON.parse(JSON.stringify(toshiba3FTable)); // Głęboka kopia
    console.log(`[getTableData] Dla Toshiba (${deviceTypeKey}), załadowano toshiba3FTable.`);
  } else if (deviceTypeKey === 'ATLANTIC-M-DUO') { // Obsługa ATLANTIC-M-DUO
    if (atlanticBaseTables && atlanticBaseTables[deviceTypeKey] && atlanticBaseTables[deviceTypeKey][model]) {
      baseTableData = JSON.parse(JSON.stringify(atlanticBaseTables[deviceTypeKey][model])); // Głęboka kopia
      console.log(`[getTableData] Dla Atlantic M-Duo (${deviceTypeKey}, ${model}), ZNALEZIONO tabelę bazową.`);
    } else {
      console.warn(`[getTableData] Dla Atlantic M-Duo (${deviceTypeKey}, ${model}), NIE ZNALEZIONO tabeli bazowej. Sprawdź klucze.`);
    }
  }
  // Dodaj tutaj 'else if' dla innych głównych kategorii marek, np. 'ATLANTIC' (dla Extensa) itd.
  else {
    console.warn(`[getTableData] Nierozpoznany lub nieobsługiwany typ urządzenia: ${deviceTypeKey}.`);
  }

  if (!baseTableData || baseTableData.length === 0) {
    console.warn(`[getTableData] Brak danych bazowych dla ${deviceTypeKey} i modelu ${model}. Zwracam pustą tablicę.`);
    return [];
  }

  let finalTable = [];
  let currentNumber = 1;

  // Logika dodawania zasobnika i bufora
  const shouldAddTankRow = tankCapacity && tankCapacity !== 'none' && tankCapacity !== 'Brak zasobnika CWU' && tankCapacity !== 'Brak zasobnika CWU / Zintegrowany';
  const shouldAddBufferRow = bufferCapacity && bufferCapacity !== 'none' && bufferCapacity !== 'Brak bufora';

  const tankRowString = getTankDescription(tankCapacity);
  const bufferRowString = getBufferDescription(bufferCapacity);

  const tankRow = [' ', tankRowString, 'szt.', '1']; // Zakładamy ilość 1, jeśli dodawany
  const bufferRow = [' ', bufferRowString, 'szt.', (bufferCapacity === 'sprzeglo' ? '1' : '1')]; // Zakładamy ilość 1, jeśli dodawany

  // Określenie, po którym elemencie tabeli bazowej wstawić zasobnik/bufor
  // Dla Mitsubishi: po 2 głównych elementach (jednostka zewn. i wewn.)
  // Dla Atlantic M-Duo: po 1 głównym elemencie (jednostka Duo)
  // Dla Toshiba: traktujemy tabelę jako kompletną, chyba że chcemy modyfikować
  let insertAtIndex = -1;
  let isDuoModel = false;

  if (deviceTypeKey.startsWith('Mitsubishi-') && !deviceTypeKey.includes('AY') && !deviceTypeKey.includes('HR')) {
    insertAtIndex = 2; // Po dwóch pierwszych elementach dla Mitsubishi
  } else if (deviceTypeKey === 'ATLANTIC-M-DUO') {
    insertAtIndex = 1; // Po pierwszym elemencie dla Atlantic M-Duo
    isDuoModel = true;  // Model Duo ma zintegrowany zasobnik
  }
  // Rozważ dodanie logiki dla 'Toshiba', jeśli chcesz dynamicznie dodawać tank/buffer

  // Budowanie finalnej tabeli
  for (let i = 0; i < baseTableData.length; i++) {
    const rowCopy = [...baseTableData[i]]; // Kopia wiersza
    rowCopy[0] = String(currentNumber++); // Numeracja
    finalTable.push(rowCopy);

    if (i === insertAtIndex - 1) { // Wstawianie po elemencie o danym indeksie (index-based, czyli po drugim to i===1)
      // Dla modeli Duo nie dodajemy `tankRow` z formularza, bo jest zintegrowany
      if (shouldAddTankRow && !isDuoModel) {
        const actualTankRow = [...tankRow];
        actualTankRow[0] = String(currentNumber++);
        finalTable.push(actualTankRow);
        console.log('[getTableData] Dodano wiersz zasobnika CWU.');
      }
      if (shouldAddBufferRow) {
        const actualBufferRow = [...bufferRow];
        actualBufferRow[0] = String(currentNumber++);
        finalTable.push(actualBufferRow);
        console.log('[getTableData] Dodano wiersz bufora.');
      }
    }
  }
  
  // Jeśli tabela bazowa była krótsza niż `insertAtIndex` (np. pusta lub tylko 1 element dla Mitsubishi)
  // a tank/buffer powinny być dodane.
  if (baseTableData.length < insertAtIndex) {
      if (shouldAddTankRow && !isDuoModel && !finalTable.some(row => row[1] === tankRowString)) {
          const actualTankRow = [...tankRow];
          actualTankRow[0] = String(currentNumber++);
          finalTable.push(actualTankRow);
          console.log('[getTableData] Dodano wiersz zasobnika CWU (krótka tabela bazowa).');
      }
      if (shouldAddBufferRow && !finalTable.some(row => row[1] === bufferRowString)) {
          const actualBufferRow = [...bufferRow];
          actualBufferRow[0] = String(currentNumber++);
          finalTable.push(actualBufferRow);
          console.log('[getTableData] Dodano wiersz bufora (krótka tabela bazowa).');
      }
  }


  console.log('[getTableData] Finalna tabela przekazana do PDF:', JSON.stringify(finalTable, null, 2));
  return finalTable;
}
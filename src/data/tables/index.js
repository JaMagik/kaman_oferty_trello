// ścieżka: src/data/tables/index.js (lub tables.js)

import { mitsubishiBaseTables } from './mitsubishiTables';
import toshiba3FTable from './toshiba-3f';
// import { atlanticBaseTables } from './atlanticTables'; // Odkomentuj i stwórz pliki, jeśli potrzebujesz
// import { viessmannBaseTables } from './viessmannTables';

function getTankDescription(tankCapacity) {
  if (!tankCapacity || tankCapacity === 'none' || tankCapacity === 'Brak zasobnika CWU') {
    return 'Brak zasobnika ciepłej wody użytkowej';
  }
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
  // === DODAJ TE CONSOLE.LOG ===
  console.log('getTableData - OTRZYMANO PARAMETRY:', { deviceType, model, tankCapacity, bufferCapacity });
  if (mitsubishiBaseTables) {
    console.log('Dostępne klucze dla deviceType w mitsubishiBaseTables:', Object.keys(mitsubishiBaseTables));
    if (mitsubishiBaseTables[deviceType]) {
      console.log(`Dostępne klucze modeli dla ${deviceType} w mitsubishiBaseTables:`, Object.keys(mitsubishiBaseTables[deviceType]));
    } else {
      console.warn(`Brak definicji dla deviceType: "${deviceType}" w mitsubishiBaseTables.`);
    }
  }
  // ============================
  
  let baseTableData = [];
  let deviceTypeKey = deviceType;

  switch (deviceTypeKey) {
    case 'Mitsubishi-cylinder':
    case 'Mitsubishi-cylinder-PUZ':
    case 'Mitsubishi-cylinder-PUZ-1F':
    case 'Mitsubishi-hydrobox':
    case 'Mitsubishi-hydrobox-PUZ':
    case 'Mitsubishi-hydrobox-PUZ-1F':
    case 'Mitsubishi-ecoinverter':
    case 'Mitsubishi-ecoinverter-hydrobox':
    case 'Mitsubishi-hp':
    case 'MITSUBISHI AY':
    case 'MITSUBISHI HR':
      // Sprawdzamy, czy mitsubishiBaseTables i odpowiednie podklucze istnieją
      if (mitsubishiBaseTables && mitsubishiBaseTables[deviceTypeKey] && mitsubishiBaseTables[deviceTypeKey][model]) {
        baseTableData = mitsubishiBaseTables[deviceTypeKey][model].slice(); // .slice() aby pracować na kopii
        console.log(`Dla Mitsubishi (${deviceTypeKey}, ${model}), ZNALEZIONO tabelę bazową.`);
      } else {
        console.warn(`Dla Mitsubishi (${deviceTypeKey}, ${model}), NIE ZNALEZIONO tabeli bazowej. Sprawdź klucze.`);
        baseTableData = []; // Zwróć pustą tablicę, jeśli nie ma dopasowania
      }
      break;

    case 'Toshiba 3F':
    case 'Toshiba 1F':
      baseTableData = toshiba3FTable.slice(); 
      console.log(`Dla Toshiba (${deviceTypeKey}), załadowano toshiba3FTable.`);
      // Dla Toshiby i innych marek, jeśli nie mają dynamicznych wierszy tank/buffer w ten sam sposób co Mitsubishi,
      // poniższa logika wstawiania tank/buffer może nie być potrzebna lub wymagać dostosowania.
      // Na razie uproszczona numeracja bez dynamicznych wierszy tank/buffer.
      return baseTableData.map((row, index) => [String(index + 1), ...row.slice(1)]);

    // --- TODO: Dodaj case'y dla INNYCH PRODUCENTÓW zgodnie z ich strukturą danych ---
    // case 'ATLANTIC':
    // case 'ATLANTIC-HYDROBOX':
    // case 'ATLANTIC-M-DUO':
    //   // baseTableData = atlanticBaseTables[deviceTypeKey]?.[model]?.slice() || [];
    //   // console.log(`Dla Atlantic (${deviceTypeKey}, ${model}), znaleziono tabelę:`, baseTableData.length > 0 ? 'TAK' : 'NIE');
    //   console.warn(`Logika dla Atlantic (${deviceTypeKey}) wymaga implementacji i osobnego pliku z danymi.`);
    //   break;

    default:
      console.warn(`Nierozpoznany lub nieobsługiwany typ urządzenia: ${deviceTypeKey} w switchu.`);
      return [];
  }

  if (baseTableData.length === 0) {
    // Ten log już jest wyżej, ale można go tu powtórzyć, jeśli baseTableData jest puste po switchu
    console.warn(`Końcowy baseTableData jest pusty dla ${deviceTypeKey} i modelu ${model}.`);
    return [];
  }

  // Logika wstawiania tankRow i bufferRow (dostosuj warunek `shouldAddTankAndBuffer`)
  const tankRowString = getTankDescription(tankCapacity);
  const bufferRowString = getBufferDescription(bufferCapacity);
  const tankRowData = [' ', tankRowString, 'szt.', (tankCapacity === 'none' || tankCapacity === 'Brak zasobnika CWU') ? '0' : '1'];
  const bufferRowData = [' ', bufferRowString, 'szt.', (bufferCapacity === 'none' || bufferCapacity === 'Brak bufora' || bufferCapacity === 'sprzeglo') ? ((bufferCapacity === 'sprzeglo') ? '1' : '0') : '1'];

  let finalTable = [];
  let currentNumber = 1;
  
  // Określ, czy dla danego typu urządzenia należy dodawać dynamiczne wiersze tank/buffer
  let shouldAddTankAndBuffer = deviceTypeKey.startsWith('Mitsubishi-') &&
                              !deviceTypeKey.includes('AY') && 
                              !deviceTypeKey.includes('HR');
  // TODO: Rozbuduj ten warunek dla innych marek, jeśli to konieczne

  const fixedHeaderRowsCount = 2; // Liczba stałych wierszy przed dynamicznymi

  for (let i = 0; i < baseTableData.length; i++) {
    if (shouldAddTankAndBuffer && i === fixedHeaderRowsCount) {
      tankRowData[0] = String(currentNumber++);
      finalTable.push(tankRowData);
      bufferRowData[0] = String(currentNumber++);
      finalTable.push(bufferRowData);
    }
    finalTable.push([String(currentNumber++), ...baseTableData[i].slice(1)]);
  }
  
  // Jeśli tank i buffer miały być na końcu, a tabela bazowa była krótsza od fixedHeaderRowsCount
  if (shouldAddTankAndBuffer && baseTableData.length < fixedHeaderRowsCount) {
      let addedTank = false;
      if (baseTableData.length === 0 ) { // Jeśli tabela bazowa jest pusta, a chcemy dodać tank/buffer
        tankRowData[0] = String(currentNumber++);
        finalTable.push(tankRowData);
        addedTank = true;
        bufferRowData[0] = String(currentNumber++);
        finalTable.push(bufferRowData);
      } else if (baseTableData.length === 1 && fixedHeaderRowsCount >=1) { // Jeśli jest 1 wiersz stały
        // Tank i buffer po tym jednym
        tankRowData[0] = String(currentNumber++);
        finalTable.push(tankRowData);
        addedTank = true;
        bufferRowData[0] = String(currentNumber++);
        finalTable.push(bufferRowData);
      }
       // Jeśli fixedHeaderRowsCount to 2, a baseTableData ma 0 lub 1 element, tank i buffer są już dodane.
       // Jeśli fixedHeaderRowsCount jest np. 0 (wszystko po tank/buffer), to ta sekcja by się nie wykonała.
  } else if (shouldAddTankAndBuffer && baseTableData.length === fixedHeaderRowsCount && finalTable.length === fixedHeaderRowsCount) {
    // Jeśli baseTableData ma dokładnie tyle wierszy co fixedHeaderRowsCount, 
    // a tank/buffer nie zostały jeszcze dodane w pętli (bo pętla się zakończyła)
    tankRowData[0] = String(currentNumber++);
    finalTable.push(tankRowData);
    bufferRowData[0] = String(currentNumber++);
    finalTable.push(bufferRowData);
  }
  
  console.log('Finalna tabela przekazana do PDF:', finalTable);
  return finalTable;
}
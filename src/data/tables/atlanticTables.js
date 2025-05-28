// ścieżka: src/data/tables/atlanticTables.js

// --- Atlantic M-Duo (zintegrowany zasobnik CWU) ---
const atlanticMDuo_5kW_base = [
  ['1', 'ATLANTIC M DUO 5 KW', 'szt.', '1'], // Nazwa produktu z script.js
  // tankRow jest zintegrowany w jednostce M-Duo
  // bufferRow zostanie dodany dynamicznie przez getTableData, jeśli wybrano
  [' ', 'ELEMENTY HYDRAULICZNE I ELEKTRYCZNE DO POMPY CIEPŁA', 'kpl.', '1'],
  [' ', 'Grupa bezpieczeństwa CWU (6bar)', 'szt.', '1'], // Może być zintegrowane, ale często wymagane w dokumentacji
  [' ', 'Grupa bezpieczeństwa C.O (2.5 bar)', 'szt.', '1'],
  [' ', 'KABEL GRZEWCZY', 'kpl.', '1'],
  [' ', 'MIEDŹ CHŁODNICZA', 'kpl.', '1'],
  [' ', 'SONDA POGODOWA', 'szt.', '1'],
  [' ', 'STOJAK LUB WIESZAK POD POMPĘ CIEPŁA', 'szt.', '1'],
  [' ', 'MONTAŻ , DOJAZD , URUCHOMIENIE ORAZ SZKOLENIE UŻYTKOWNIKA', 'kpl.', '1'],
];

const atlanticMDuo_6kW_base = [
  ['1', 'ATLANTIC M DUO 6 KW', 'szt.', '1'],
  [' ', 'ELEMENTY HYDRAULICZNE I ELEKTRYCZNE DO POMPY CIEPŁA', 'kpl.', '1'],
  [' ', 'Grupa bezpieczeństwa CWU (6bar)', 'szt.', '1'],
  [' ', 'Grupa bezpieczeństwa C.O (2.5 bar)', 'szt.', '1'],
  [' ', 'KABEL GRZEWCZY', 'kpl.', '1'],
  [' ', 'MIEDŹ CHŁODNICZA', 'kpl.', '1'],
  [' ', 'SONDA POGODOWA', 'szt.', '1'],
  [' ', 'STOJAK LUB WIESZAK POD POMPĘ CIEPŁA', 'szt.', '1'],
  [' ', 'MONTAŻ , DOJAZD , URUCHOMIENIE ORAZ SZKOLENIE UŻYTKOWNIKA', 'kpl.', '1'],
];

const atlanticMDuo_8kW_base = [
  ['1', 'ATLANTIC M DUO 8 KW', 'szt.', '1'],
  [' ', 'ELEMENTY HYDRAULICZNE I ELEKTRYCZNE DO POMPY CIEPŁA', 'kpl.', '1'],
  [' ', 'Grupa bezpieczeństwa CWU (6bar)', 'szt.', '1'],
  [' ', 'Grupa bezpieczeństwa C.O (2.5 bar)', 'szt.', '1'],
  [' ', 'KABEL GRZEWCZY', 'kpl.', '1'],
  [' ', 'MIEDŹ CHŁODNICZA', 'kpl.', '1'],
  [' ', 'SONDA POGODOWA', 'szt.', '1'],
  [' ', 'STOJAK LUB WIESZAK POD POMPĘ CIEPŁA', 'szt.', '1'],
  [' ', 'MONTAŻ , DOJAZD , URUCHOMIENIE ORAZ SZKOLENIE UŻYTKOWNIKA', 'kpl.', '1'],
];

const atlanticMDuo_11kW_base = [
  ['1', 'ATLANTIC M DUO 11 KW', 'szt.', '1'],
  [' ', 'ELEMENTY HYDRAULICZNE I ELEKTRYCZNE DO POMPY CIEPŁA', 'kpl.', '1'],
  [' ', 'Grupa bezpieczeństwa CWU (6bar)', 'szt.', '1'],
  [' ', 'Grupa bezpieczeństwa C.O (2.5 bar)', 'szt.', '1'],
  [' ', 'KABEL GRZEWCZY', 'kpl.', '1'],
  [' ', 'MIEDŹ CHŁODNICZA', 'kpl.', '1'],
  [' ', 'SONDA POGODOWA', 'szt.', '1'],
  [' ', 'STOJAK LUB WIESZAK POD POMPĘ CIEPŁA', 'szt.', '1'],
  [' ', 'MONTAŻ , DOJAZD , URUCHOMIENIE ORAZ SZKOLENIE UŻYTKOWNIKA', 'kpl.', '1'],
];


export const atlanticBaseTables = {
  // ... (ewentualne inne wpisy dla Atlantic, np. 'ATLANTIC' dla Extensa AI Duo, jeśli nadal potrzebne)
  'ATLANTIC-M-DUO': { // Klucz odpowiadający 'deviceType' dla M-Duo
    '5 kW': atlanticMDuo_5kW_base,
    '6 kW': atlanticMDuo_6kW_base,
    '8 kW': atlanticMDuo_8kW_base,
    '11 kW': atlanticMDuo_11kW_base,
    // W 'script.js' nie było innych mocy dla M-Duo, w razie potrzeby dodaj tutaj.
  },
};
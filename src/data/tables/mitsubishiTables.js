// ścieżka: src/data/tables/mitsubishiTables.js

// --- Mitsubishi Cylinder (Standard - PUD/EHST) ---
const mitsubishiCylinder_standard_6kW_base = [
  ['1', 'Ecodan | Zubadan Inverter | Split | 6,0kW, 400V, R32 PUD-SHWM60YAA', 'szt.', '1'],
  ['2', 'Ecodan | moduł wew. 200 litrów | Split | grz. 6/9 kW, 3x400V | naczynie wz. 10L | grzanie EHST20D-VM60', 'szt.', '1'],
  // tankRow i bufferRow zostaną dodane dynamicznie przez getTableData
  [' ', 'ELEMENTY HYDRAULICZNE I ELEKTRYCZNE DO POMPY CIEPŁA', 'kpl.', '1'],
  [' ', 'Grupa bezpieczeństwa CWU (6bar)', 'szt.', '1'],
  [' ', 'MIEDŹ CHŁODNICZA', 'kpl.', '1'],
  [' ', 'REGULATOR BEZPRZEWODOWY MITSUBISHI PAR-WT', 'szt.', '1'],
  [' ', 'STOJAK LUB WIESZAK POD POMPĘ CIEPŁA', 'szt.', '1'],
  [' ', 'MONTAŻ , DOJAZD , URUCHOMIENIE ORAZ SZKOLENIE UŻYTKOWNIKA', 'kpl.', '1'],
];

const mitsubishiCylinder_standard_8kW_base = [
  ['1', 'Ecodan | Zubadan Inverter | Split | 8,0kW, 400V, R32 PUD-SHWM80YAA', 'szt.', '1'],
  ['2', 'Ecodan | moduł wew. 200 litrów | Split | grz. 6/9 kW, 3x400V | naczynie wz. 10L | grzanie EHSD-YM6/9D', 'szt.', '1'], // Uwaga: model jednostki wewnętrznej w Twoim starym kodzie był inny dla 8kW
  [' ', 'ELEMENTY HYDRAULICZNE I ELEKTRYCZNE DO POMPY CIEPŁA', 'kpl.', '1'],
  [' ', 'Grupa bezpieczeństwa CWU (6bar)', 'szt.', '1'],
  [' ', 'MIEDŹ CHŁODNICZA', 'kpl.', '1'],
  [' ', 'REGULATOR BEZPRZEWODOWY MITSUBISHI PAR-WT', 'szt.', '1'],
  [' ', 'STOJAK LUB WIESZAK POD POMPĘ CIEPŁA', 'szt.', '1'],
  [' ', 'MONTAŻ , DOJAZD , URUCHOMIENIE ORAZ SZKOLENIE UŻYTKOWNIKA', 'kpl.', '1'],
];

const mitsubishiCylinder_standard_10kW_base = [
  ['1', 'Ecodan | Zubadan Inverter | Split | 10,0kW, 400V, R32 PUD-SHWM100YAA', 'szt.', '1'],
  ['2', 'Ecodan | moduł wew. 200 litrów | Split | grz. 6/9 kW, 3x400V | naczynie wz. 10L | grzanie EHST20D-VM60', 'szt.', '1'],
  [' ', 'ELEMENTY HYDRAULICZNE I ELEKTRYCZNE DO POMPY CIEPŁA', 'kpl.', '1'],
  [' ', 'Grupa bezpieczeństwa CWU (6bar)', 'szt.', '1'],
  [' ', 'MIEDŹ CHŁODNICZA', 'kpl.', '1'],
  [' ', 'REGULATOR BEZPRZEWODOWY MITSUBISHI PAR-WT', 'szt.', '1'],
  [' ', 'STOJAK LUB WIESZAK POD POMPĘ CIEPŁA', 'szt.', '1'],
  [' ', 'MONTAŻ , DOJAZD , URUCHOMIENIE ORAZ SZKOLENIE UŻYTKOWNIKA', 'kpl.', '1'],
];

const mitsubishiCylinder_standard_12kW_base = [
  ['1', 'Ecodan | Zubadan Inverter | Split | 12,0kW, 400V, R32 PUD-SHWM120YAA', 'szt.', '1'],
  ['2', 'Ecodan | moduł wew. 200 litrów | Split | grz. 6/9 kW, 3x400V | naczynie wz. 10L | grzanie EHST20D-VM60', 'szt.', '1'],
  [' ', 'ELEMENTY HYDRAULICZNE I ELEKTRYCZNE DO POMPY CIEPŁA', 'kpl.', '1'],
  [' ', 'Grupa bezpieczeństwa CWU (6bar)', 'szt.', '1'],
  [' ', 'MIEDŹ CHŁODNICZA', 'kpl.', '1'],
  [' ', 'REGULATOR BEZPRZEWODOWY MITSUBISHI PAR-WT', 'szt.', '1'],
  [' ', 'STOJAK LUB WIESZAK POD POMPĘ CIEPŁA', 'szt.', '1'],
  [' ', 'MONTAŻ , DOJAZD , URUCHOMIENIE ORAZ SZKOLENIE UŻYTKOWNIKA', 'kpl.', '1'],
];

const mitsubishiCylinder_standard_14kW_base = [
  ['1', 'Ecodan | Zubadan Inverter | Split | 14,0kW, 400V, R32 PUD-SHWM140YAA', 'szt.', '1'],
  ['2', 'Ecodan | moduł wew. 300 litrów | Split | grz. 6/9 kW, 3x400V | naczynie wz. 10L | grzanie EHST20D-VM60', 'szt.', '1'],
  [' ', 'ELEMENTY HYDRAULICZNE I ELEKTRYCZNE DO POMPY CIEPŁA', 'kpl.', '1'],
  [' ', 'Grupa bezpieczeństwa CWU (6bar)', 'szt.', '1'],
  [' ', 'MIEDŹ CHŁODNICZA', 'kpl.', '1'],
  [' ', 'REGULATOR BEZPRZEWODOWY MITSUBISHI PAR-WT', 'szt.', '1'],
  [' ', 'STOJAK LUB WIESZAK POD POMPĘ CIEPŁA', 'szt.', '1'],
  [' ', 'MONTAŻ , DOJAZD , URUCHOMIENIE ORAZ SZKOLENIE UŻYTKOWNIKA', 'kpl.', '1'],
];

// --- Mitsubishi Cylinder PUZ (3-fazowy) ---
const mitsubishiCylinderPUZ_6kW_base = [
  ['1', 'Ecodan | Zubadan Inverter | Split | 6,0kW, 400V, R32 PUZ-SHWM60YAA EHST20D-YM9E', 'szt.', '1'],
  ['2', 'Ecodan | Cylinder | Split | grz. 6/9 kW, 3x400V | naczynie wz. 10L | grzanie ERST20F-YM9ED', 'szt.', '1'],
  [' ', 'ELEMENTY HYDRAULICZNE I ELEKTRYCZNE DO POMPY CIEPŁA', 'kpl.', '1'],
  [' ', 'Grupa bezpieczeństwa CWU (6bar)', 'szt.', '1'],
  [' ', 'MIEDŹ CHŁODNICZA', 'kpl.', '1'],
  [' ', 'REGULATOR BEZPRZEWODOWY MITSUBISHI PAR-WT', 'szt.', '1'],
  [' ', 'STOJAK LUB WIESZAK POD POMPĘ CIEPŁA', 'szt.', '1'],
  [' ', 'MONTAŻ , DOJAZD , URUCHOMIENIE ORAZ SZKOLENIE UŻYTKOWNIKA', 'kpl.', '1'],
];

const mitsubishiCylinderPUZ_8kW_base = [
  ['1', 'Ecodan | Zubadan Inverter | Split | 8,0kW, 400V, R32 PUZ-SHWM80YAA EHST20D-YM9E', 'szt.', '1'],
  ['2', 'Ecodan | Cylinder | Split | grz. 6/9 kW, 3x400V | naczynie wz. 10L | grzanie ERST20F-YM9ED', 'szt.', '1'],
  [' ', 'ELEMENTY HYDRAULICZNE I ELEKTRYCZNE DO POMPY CIEPŁA', 'kpl.', '1'],
  [' ', 'Grupa bezpieczeństwa CWU (6bar)', 'szt.', '1'],
  [' ', 'MIEDŹ CHŁODNICZA', 'kpl.', '1'],
  [' ', 'REGULATOR BEZPRZEWODOWY MITSUBISHI PAR-WT', 'szt.', '1'],
  [' ', 'STOJAK LUB WIESZAK POD POMPĘ CIEPŁA', 'szt.', '1'],
  [' ', 'MONTAŻ , DOJAZD , URUCHOMIENIE ORAZ SZKOLENIE UŻYTKOWNIKA', 'kpl.', '1'],
];

const mitsubishiCylinderPUZ_10kW_base = [
  ['1', 'Ecodan | Zubadan Inverter | Split | 10,0kW, 400V, R32 PUZ-SHWM100YAA EHST20D-YM9E', 'szt.', '1'],
  ['2', 'Ecodan | Cylinder | Split | grz. 6/9 kW, 3x400V | naczynie wz. 10L | grzanie ERST20F-YM9ED', 'szt.', '1'],
  [' ', 'ELEMENTY HYDRAULICZNE I ELEKTRYCZNE DO POMPY CIEPŁA', 'kpl.', '1'],
  [' ', 'Grupa bezpieczeństwa CWU (6bar)', 'szt.', '1'],
  [' ', 'MIEDŹ CHŁODNICZA', 'kpl.', '1'],
  [' ', 'REGULATOR BEZPRZEWODOWY MITSUBISHI PAR-WT', 'szt.', '1'],
  [' ', 'STOJAK LUB WIESZAK POD POMPĘ CIEPŁA', 'szt.', '1'],
  [' ', 'MONTAŻ , DOJAZD , URUCHOMIENIE ORAZ SZKOLENIE UŻYTKOWNIKA', 'kpl.', '1'],
];

const mitsubishiCylinderPUZ_12kW_base = [
  ['1', 'Ecodan | Zubadan Inverter | Split | 12,0kW, 400V, R32 PUZ-SHWM120YAA', 'szt.', '1'],
  ['2', 'Ecodan | Cylinder | Split | grz. 6/9 kW, 3x400V | naczynie wz. 10L | grzanie ERST20F-YM9E', 'szt.', '1'],
  [' ', 'ELEMENTY HYDRAULICZNE I ELEKTRYCZNE DO POMPY CIEPŁA', 'kpl.', '1'],
  [' ', 'Grupa bezpieczeństwa CWU (6bar)', 'szt.', '1'],
  [' ', 'MIEDŹ CHŁODNICZA', 'kpl.', '1'],
  [' ', 'REGULATOR BEZPRZEWODOWY MITSUBISHI PAR-WT', 'szt.', '1'],
  [' ', 'STOJAK LUB WIESZAK POD POMPĘ CIEPŁA', 'szt.', '1'],
  [' ', 'MONTAŻ , DOJAZD , URUCHOMIENIE ORAZ SZKOLENIE UŻYTKOWNIKA', 'kpl.', '1'],
];

const mitsubishiCylinderPUZ_14kW_base = [
  ['1', 'Ecodan | Zubadan Inverter | Split | 14,0kW, 400V, R32 PUZ-SHWM140YAA', 'szt.', '1'],
  ['2', 'Ecodan | Cylinder | Split | grz. 6/9 kW, 3x400V | naczynie wz. 10L | grzanie ERST20F-YM9E', 'szt.', '1'],
  [' ', 'ELEMENTY HYDRAULICZNE I ELEKTRYCZNE DO POMPY CIEPŁA', 'kpl.', '1'],
  [' ', 'Grupa bezpieczeństwa CWU (6bar)', 'szt.', '1'],
  [' ', 'MIEDŹ CHŁODNICZA', 'kpl.', '1'],
  [' ', 'REGULATOR BEZPRZEWODOWY MITSUBISHI PAR-WT', 'szt.', '1'],
  [' ', 'STOJAK LUB WIESZAK POD POMPĘ CIEPŁA', 'szt.', '1'],
  [' ', 'MONTAŻ , DOJAZD , URUCHOMIENIE ORAZ SZKOLENIE UŻYTKOWNIKA', 'kpl.', '1'],
];

// --- Mitsubishi Cylinder PUZ (1-fazowy) ---
const mitsubishiCylinderPUZ_1F_6kW_base = [
  ['1', 'Ecodan | Zubadan Inverter | Split | 6,0kW, 230V, R32 PUZ-SHWM60VAA EHST20D-YM9E', 'szt.', '1'], // *VAA oznacza 1-fazowy
  ['2', 'Ecodan | Cylinder | Split | grz. 6/9 kW (dopasować do fazy) | naczynie wz. 10L | grzanie ERST20F-YM9ED', 'szt.', '1'],
  [' ', 'ELEMENTY HYDRAULICZNE I ELEKTRYCZNE DO POMPY CIEPŁA', 'kpl.', '1'],
  // ... reszta ...
];
const mitsubishiCylinderPUZ_1F_8kW_base = [
  ['1', 'Ecodan | Zubadan Inverter | Split | 8,0kW, 230V, R32 PUZ-SHWM80VAA EHST20D-YM9E', 'szt.', '1'],
  ['2', 'Ecodan | Cylinder | Split | grz. 6/9 kW (dopasować do fazy) | naczynie wz. 10L | grzanie ERST20F-YM9ED', 'szt.', '1'],
  // ... reszta ...
];
const mitsubishiCylinderPUZ_1F_10kW_base = [
  ['1', 'Ecodan | Zubadan Inverter | Split | 10,0kW, 230V, R32 PUZ-SHWM100VAA EHST20D-YM9E', 'szt.', '1'],
  ['2', 'Ecodan | Cylinder | Split | grz. 6/9 kW (dopasować do fazy) | naczynie wz. 10L | grzanie ERST20F-YM9ED', 'szt.', '1'],
  // ... reszta ...
];
const mitsubishiCylinderPUZ_1F_12kW_base = [
  ['1', 'Ecodan | Zubadan Inverter | Split | 12,0kW, 230V, R32 PUZ-SHWM120VAA', 'szt.', '1'],
  ['2', 'Ecodan | Cylinder | Split | grz. 6/9 kW (dopasować do fazy) | naczynie wz. 10L | grzanie ERST20F-YM9E', 'szt.', '1'],
  // ... reszta ...
];

// --- Mitsubishi Hydrobox (Standard - PUD/EHSD) ---
const mitsubishiHydrobox_standard_6kW_base = [
  ['1', 'Ecodan | Zubadan Inverter | Split | 6,0kW, 400V, R32 PUD-SHWM60YAA', 'szt.', '1'],
  ['2', 'Ecodan | Hydrobox | Split | grz. 6/9 kW, 3x400V | naczynie wz. 10L | grzanie EHSD-YM6/9D', 'szt.', '1'],
  [' ', 'ELEMENTY HYDRAULICZNE I ELEKTRYCZNE DO POMPY CIEPŁA', 'kpl.', '1'],
  // ... reszta ...
];
const mitsubishiHydrobox_standard_8kW_base = [
  ['1', 'Ecodan | Zubadan Inverter | Split | 8,0kW, 400V, R32 PUD-SHWM80YAA', 'szt.', '1'],
  ['2', 'Ecodan | Hydrobox | Split | grz. 6/9 kW, 3x400V | naczynie wz. 10L | grzanie EHSD-YM6/9D', 'szt.', '1'],
  // ... reszta ...
];
const mitsubishiHydrobox_standard_10kW_base = [
  ['1', 'Ecodan | Zubadan Inverter | Split | 10,0kW, 400V, R32 PUD-SHWM100YAA', 'szt.', '1'],
  ['2', 'Ecodan | Hydrobox | Split | grz. 6/9 kW, 3x400V | naczynie wz. 10L | grzanie EHSD-YM6/9D', 'szt.', '1'],
  // ... reszta ...
];
const mitsubishiHydrobox_standard_12kW_base = [
  ['1', 'Ecodan | Zubadan Inverter | Split | 12,0kW, 400V, R32 PUD-SHWM120YAA', 'szt.', '1'],
  ['2', 'Ecodan | Hydrobox | Split | grz. 6/9 kW, 3x400V | naczynie wz. 10L | grzanie EHSD-YM6/9D', 'szt.', '1'],
  // ... reszta ...
];
const mitsubishiHydrobox_standard_14kW_base = [
  ['1', 'Ecodan | Zubadan Inverter | Split | 14,0kW, 400V, R32 PUD-SHWM140YAA', 'szt.', '1'],
  ['2', 'Ecodan | Hydrobox | Split | grz. 6/9 kW, 3x400V | naczynie wz. 10L | grzanie EHSD-YM6/9D', 'szt.', '1'],
  // ... reszta ...
];

// --- Mitsubishi Hydrobox PUZ (3-fazowy) ---
const mitsubishiHydroboxPUZ_6kW_base = [
  ['1', 'Ecodan | Zubadan Inverter | Split | 6,0kW, 400V, R32 PUZ-SHWM60YAA EHST20D-YM9E', 'szt.', '1'], // Sprawdź model jednostki wew.
  ['2', 'Ecodan | Hydrobox | Split | grz. 6/9 kW, 3x400V | naczynie wz. 10L | grzanie ERSF-YM9E', 'szt.', '1'],
  // ... reszta ...
];
const mitsubishiHydroboxPUZ_8kW_base = [
  ['1', 'Ecodan | Zubadan Inverter | Split | 8,0kW, 400V, R32 PUZ-SHWM80YAA EHST20D-YM9E', 'szt.', '1'],
  ['2', 'Ecodan | Hydrobox | Split | grz. 6/9 kW, 3x400V | naczynie wz. 10L | grzanie ERSF-YM9E', 'szt.', '1'],
  // ... reszta ...
];
const mitsubishiHydroboxPUZ_10kW_base = [
  ['1', 'Ecodan | Zubadan Inverter | Split | 10,0kW, 400V, R32 PUZ-SHWM100YAA EHST20D-YM9E', 'szt.', '1'],
  ['2', 'Ecodan | Hydrobox | Split | grz. 6/9 kW, 3x400V | naczynie wz. 10L | grzanie ERSF-YM9E', 'szt.', '1'],
  // ... reszta ...
];
const mitsubishiHydroboxPUZ_12kW_base = [
  ['1', 'Ecodan | Zubadan Inverter | Split | 12,0kW, 400V, R32 PUZ-SHWM120YAA EHST20D-YM9E', 'szt.', '1'],
  ['2', 'Ecodan | Hydrobox | Split | grz. 6/9 kW, 3x400V | naczynie wz. 10L | grzanie ERSF-YM9E', 'szt.', '1'],
  // ... reszta ...
];
const mitsubishiHydroboxPUZ_14kW_base = [
  ['1', 'Ecodan | Zubadan Inverter | Split | 14,0kW, 400V, R32 PUZ-SHWM140YAA EHST20D-YM9E', 'szt.', '1'],
  ['2', 'Ecodan | Hydrobox | Split | grz. 6/9 kW, 3x400V | naczynie wz. 10L | grzanie ERSF-YM9E', 'szt.', '1'],
  // ... reszta ...
];

// --- Mitsubishi Hydrobox PUZ (1-fazowy) ---
const mitsubishiHydroboxPUZ_1F_6kW_base = [
  ['1', 'Ecodan | Zubadan Inverter | Split | 6,0kW, 230V, R32 PUZ-SHWM60VAA EHST20D-YM9E', 'szt.', '1'],
  ['2', 'Ecodan | Hydrobox | Split | grz. 6/9 kW (dopasować do fazy) | naczynie wz. 10L | grzanie ERSF-YM9E', 'szt.', '1'],
  // ... reszta ...
];
const mitsubishiHydroboxPUZ_1F_8kW_base = [
  ['1', 'Ecodan | Zubadan Inverter | Split | 8,0kW, 230V, R32 PUZ-SHWM80VAA EHST20D-YM9E', 'szt.', '1'],
  ['2', 'Ecodan | Hydrobox | Split | grz. 6/9 kW (dopasować do fazy) | naczynie wz. 10L | grzanie ERSF-YM9E', 'szt.', '1'],
  // ... reszta ...
];
const mitsubishiHydroboxPUZ_1F_10kW_base = [
  ['1', 'Ecodan | Zubadan Inverter | Split | 10,0kW, 230V, R32 PUZ-SHWM100VAA EHST20D-YM9E', 'szt.', '1'],
  ['2', 'Ecodan | Hydrobox | Split | grz. 6/9 kW (dopasować do fazy) | naczynie wz. 10L | grzanie ERSF-YM9E', 'szt.', '1'],
  // ... reszta ...
];
const mitsubishiHydroboxPUZ_1F_12kW_base = [
  ['1', 'Ecodan | Zubadan Inverter | Split | 12,0kW, 230V, R32 PUZ-SHWM120VAA EHST20D-YM9E', 'szt.', '1'],
  ['2', 'Ecodan | Hydrobox | Split | grz. 6/9 kW (dopasować do fazy) | naczynie wz. 10L | grzanie ERSF-YM9E', 'szt.', '1'],
  // ... reszta ...
];

// --- Mitsubishi Ecoinverter (Cylinder - SUZ/EHSD) ---
const mitsubishiEcoinverter_6kW_base = [
  ['1', 'JEDNOSTKA WEWNĘTRZNA EHSD-YM9D', 'szt.', '1'],
  ['2', 'JEDNOSTKA ZEWNĘTRZNA SUZ-SWM60VA', 'szt.', '1'],
  [' ', 'ELEMENTY HYDRAULICZNE I ELEKTRYCZNE DO POMPY CIEPŁA', 'kpl.', '1'],
  [' ', 'Grupa bezpieczeństwa CWU (6bar)', 'szt.', '1'],
  [' ', 'Grupa bezpieczeństwa C.0 (2.5 bar)', 'szt.', '1'],
  [' ', 'Pompa obiegowa do instalacji grzewczej LFP ( z osprzętem )', 'szt.', '1'],
  [' ', 'MIEDŹ CHŁODNICZA', 'kpl.', '1'],
  [' ', 'REGULATOR BEZPRZEWODOWY MITSUBISHI PAR-WT', 'szt.', '1'],
  [' ', 'STOJAK LUB WIESZAK POD POMPĘ CIEPŁA', 'szt.', '1'],
  [' ', 'MONTAŻ , DOJAZD , URUCHOMIENIE ORAZ SZKOLENIE UŻYTKOWNIKA', 'kpl.', '1'],
];
const mitsubishiEcoinverter_8kW_base = [
  ['1', 'JEDNOSTKA WEWNĘTRZNA EHSD-YM9D', 'szt.', '1'],
  ['2', 'JEDNOSTKA ZEWNĘTRZNA SUZ-SWM80VA', 'szt.', '1'],
  // ... reszta jak 6kW ...
];

// --- Mitsubishi Ecoinverter (Hydrobox - SUZ/EHSD) ---
const mitsubishiEcoinverterHydrobox_6kW_base = [
  ['1', 'JEDNOSTKA WEWNĘTRZNA EHSD-YM9D', 'szt.', '1'], // W starym kodzie dla Ecoinverter-Hydrobox też było EHSD-YM9D, upewnij się, czy to poprawna jednostka wew. dla hydroboxa
  ['2', 'JEDNOSTKA ZEWNĘTRZNA SUZ-SWM60VA', 'szt.', '1'],
  // ... reszta jak Ecoinverter Cylinder, ale tank/buffer inaczej obsłużone ...
];
const mitsubishiEcoinverterHydrobox_8kW_base = [
  ['1', 'JEDNOSTKA WEWNĘTRZNA EHSD-YM9D', 'szt.', '1'],
  ['2', 'JEDNOSTKA ZEWNĘTRZNA SUZ-SWM80VA', 'szt.', '1'],
  // ... reszta ...
];

// --- Mitsubishi HP (Hyper Heating - SUZ) ---
const mitsubishiHP_4kW_base = [ // Prawdopodobnie model SUZ-SWM40VA, jeśli to Ecoinverter HP, lub PUZ-SHWM jeśli Zubadan HP
  ['1', 'JEDNOSTKA WEWNĘTRZNA MITSUBISHI SUZ HYPER HEATING 4 kW (doprecyzuj model)', 'szt.', '1'],
  ['2', 'JEDNOSTKA ZEWNĘTRZNA MITSUBISHI SUZ HYPER HEATING 4 kW (doprecyzuj model)', 'szt.', '1'],
  // ... reszta podobnie jak Ecoinverter ...
];
const mitsubishiHP_6kW_base = [
  ['1', 'JEDNOSTKA WEWNĘTRZNA MITSUBISHI SUZ HYPER HEATING 6 kW (doprecyzuj model)', 'szt.', '1'],
  ['2', 'JEDNOSTKA ZEWNĘTRZNA MITSUBISHI SUZ HYPER HEATING 6 kW (doprecyzuj model)', 'szt.', '1'],
  // ... reszta ...
];


// Główny obiekt eksportowany
export const mitsubishiBaseTables = {
  'Mitsubishi-cylinder': {
    '14 kW': mitsubishiCylinder_standard_14kW_base,
    '12 kW': mitsubishiCylinder_standard_12kW_base,
    '10 kW': mitsubishiCylinder_standard_10kW_base,
    '8 kW': mitsubishiCylinder_standard_8kW_base,
    '6 kW': mitsubishiCylinder_standard_6kW_base,
  },
  'Mitsubishi-cylinder-PUZ': {
    '14 kW': mitsubishiCylinderPUZ_14kW_base,
    '12 kW': mitsubishiCylinderPUZ_12kW_base,
    '10 kW': mitsubishiCylinderPUZ_10kW_base,
    '8 kW': mitsubishiCylinderPUZ_8kW_base,
    '6 kW': mitsubishiCylinderPUZ_6kW_base,
  },
  'Mitsubishi-cylinder-PUZ-1F': {
    '12 kW': mitsubishiCylinderPUZ_1F_12kW_base,
    '10 kW': mitsubishiCylinderPUZ_1F_10kW_base,
    '8 kW': mitsubishiCylinderPUZ_1F_8kW_base,
    '6 kW': mitsubishiCylinderPUZ_1F_6kW_base,
  },
  'Mitsubishi-hydrobox': { // To jest dla PUD/EHSD
    '14 kW': mitsubishiHydrobox_standard_14kW_base,
    '12 kW': mitsubishiHydrobox_standard_12kW_base,
    '10 kW': mitsubishiHydrobox_standard_10kW_base,
    '8 kW': mitsubishiHydrobox_standard_8kW_base,
    '6 kW': mitsubishiHydrobox_standard_6kW_base,
  },
  'Mitsubishi-hydrobox-PUZ': {
    '14 kW': mitsubishiHydroboxPUZ_14kW_base,
    '12 kW': mitsubishiHydroboxPUZ_12kW_base,
    '10 kW': mitsubishiHydroboxPUZ_10kW_base,
    '8 kW': mitsubishiHydroboxPUZ_8kW_base,
    '6 kW': mitsubishiHydroboxPUZ_6kW_base,
  },
  'Mitsubishi-hydrobox-PUZ-1F': {
    '12 kW': mitsubishiHydroboxPUZ_1F_12kW_base,
    '10 kW': mitsubishiHydroboxPUZ_1F_10kW_base,
    '8 kW': mitsubishiHydroboxPUZ_1F_8kW_base,
    '6 kW': mitsubishiHydroboxPUZ_1F_6kW_base,
  },
  'Mitsubishi-ecoinverter': { // Zakładam, że to Ecoinverter z cylindrem
    '8 kW': mitsubishiEcoinverter_8kW_base,
    '6 kW': mitsubishiEcoinverter_6kW_base,
  },
  'Mitsubishi-ecoinverter-hydrobox': {
    '8 kW': mitsubishiEcoinverterHydrobox_8kW_base,
    '6 kW': mitsubishiEcoinverterHydrobox_6kW_base,
  },
  'Mitsubishi-hp': { // Hyper Heating
    '6 kW': mitsubishiHP_6kW_base,
    '4 kW': mitsubishiHP_4kW_base,
  }
};
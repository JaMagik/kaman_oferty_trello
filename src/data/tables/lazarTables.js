// --- LAZAR tabele ofertowe ---

const lazar_11kW_150L_base = [
  ['1', 'LAZAR 11 kW/150L', 'szt.', '1'],
  [' ', 'ELEMENTY PODŁĄCZENIOWE HYDRAULICZNE ORAZ ELEKTRYCZNE', 'szt.', '1'],
  [' ', 'GRUPA BEZPIECZEŃSTWA CWU (6 BAR)', 'szt.', '1'],
  [' ', 'GRUPA BEZPIECZEŃSTWA C.O (2.5 BAR)', 'kpl.', '1'],
  [' ', 'PODŁĄCZENIE KOMINOWE', 'szt.', '1'],
  [' ', 'REGULATOR BEZPRZEWODOWY', 'szt.', '1'],
  [' ', 'MONTAŻ, DOJAZD, URUCHOMIENIE ORAZ SZKOLENIE UŻYTKOWNIKA', 'szt.', '1'],
  // tankRow i bufferRow wstawiane dynamicznie
];

const lazar_15kW_150L_base = [
  ['1', 'LAZAR 15 kW/150L', 'szt.', '1'],
  [' ', 'ELEMENTY PODŁĄCZENIOWE HYDRAULICZNE ORAZ ELEKTRYCZNE', 'szt.', '1'],
  [' ', 'GRUPA BEZPIECZEŃSTWA CWU (6 BAR)', 'szt.', '1'],
  [' ', 'GRUPA BEZPIECZEŃSTWA C.O (2.5 BAR)', 'kpl.', '1'],
  [' ', 'PODŁĄCZENIE KOMINOWE', 'szt.', '1'],
  [' ', 'REGULATOR BEZPRZEWODOWY', 'szt.', '1'],
  [' ', 'MONTAŻ, DOJAZD, URUCHOMIENIE ORAZ SZKOLENIE UŻYTKOWNIKA', 'szt.', '1'],
];

const lazar_15kW_240L_base = [
  ['1', 'LAZAR 15 kW/240L', 'szt.', '1'],
  [' ', 'ELEMENTY PODŁĄCZENIOWE HYDRAULICZNE ORAZ ELEKTRYCZNE', 'szt.', '1'],
  [' ', 'GRUPA BEZPIECZEŃSTWA CWU (6 BAR)', 'szt.', '1'],
  [' ', 'GRUPA BEZPIECZEŃSTWA C.O (2.5 BAR)', 'kpl.', '1'],
  [' ', 'PODŁĄCZENIE KOMINOWE', 'szt.', '1'],
  [' ', 'REGULATOR BEZPRZEWODOWY', 'szt.', '1'],
  [' ', 'MONTAŻ, DOJAZD, URUCHOMIENIE ORAZ SZKOLENIE UŻYTKOWNIKA', 'szt.', '1'],
];

const lazar_15kW_440L_base = [
  ['1', 'LAZAR 15 kW/440L', 'szt.', '1'],
  [' ', 'ELEMENTY PODŁĄCZENIOWE HYDRAULICZNE ORAZ ELEKTRYCZNE', 'szt.', '1'],
  [' ', 'GRUPA BEZPIECZEŃSTWA CWU (6 BAR)', 'szt.', '1'],
  [' ', 'GRUPA BEZPIECZEŃSTWA C.O (2.5 BAR)', 'kpl.', '1'],
  [' ', 'PODŁĄCZENIE KOMINOWE', 'szt.', '1'],
  [' ', 'REGULATOR BEZPRZEWODOWY', 'szt.', '1'],
  [' ', 'MONTAŻ, DOJAZD, URUCHOMIENIE ORAZ SZKOLENIE UŻYTKOWNIKA', 'szt.', '1'],
];

const lazar_22kW_150L_base = [
  ['1', 'LAZAR 22 kW/150L', 'szt.', '1'],
  [' ', 'ELEMENTY PODŁĄCZENIOWE HYDRAULICZNE ORAZ ELEKTRYCZNE', 'szt.', '1'],
  [' ', 'GRUPA BEZPIECZEŃSTWA CWU (6 BAR)', 'szt.', '1'],
  [' ', 'GRUPA BEZPIECZEŃSTWA C.O (2.5 BAR)', 'kpl.', '1'],
  [' ', 'PODŁĄCZENIE KOMINOWE', 'szt.', '1'],
  [' ', 'REGULATOR BEZPRZEWODOWY', 'szt.', '1'],
  [' ', 'MONTAŻ, DOJAZD, URUCHOMIENIE ORAZ SZKOLENIE UŻYTKOWNIKA', 'szt.', '1'],
];

const lazar_22kW_240L_base = [
  ['1', 'LAZAR 22 kW/240L', 'szt.', '1'],
  [' ', 'ELEMENTY PODŁĄCZENIOWE HYDRAULICZNE ORAZ ELEKTRYCZNE', 'szt.', '1'],
  [' ', 'GRUPA BEZPIECZEŃSTWA CWU (6 BAR)', 'szt.', '1'],
  [' ', 'GRUPA BEZPIECZEŃSTWA C.O (2.5 BAR)', 'kpl.', '1'],
  [' ', 'PODŁĄCZENIE KOMINOWE', 'szt.', '1'],
  [' ', 'REGULATOR BEZPRZEWODOWY', 'szt.', '1'],
  [' ', 'MONTAŻ, DOJAZD, URUCHOMIENIE ORAZ SZKOLENIE UŻYTKOWNIKA', 'szt.', '1'],
];

const lazar_22kW_440L_base = [
  ['1', 'LAZAR 22 kW/440L', 'szt.', '1'],
  [' ', 'ELEMENTY PODŁĄCZENIOWE HYDRAULICZNE ORAZ ELEKTRYCZNE', 'szt.', '1'],
  [' ', 'GRUPA BEZPIECZEŃSTWA CWU (6 BAR)', 'szt.', '1'],
  [' ', 'GRUPA BEZPIECZEŃSTWA C.O (2.5 BAR)', 'kpl.', '1'],
  [' ', 'PODŁĄCZENIE KOMINOWE', 'szt.', '1'],
  [' ', 'REGULATOR BEZPRZEWODOWY', 'szt.', '1'],
  [' ', 'MONTAŻ, DOJAZD, URUCHOMIENIE ORAZ SZKOLENIE UŻYTKOWNIKA', 'szt.', '1'],
];

const lazar_11kW_240L_base = [
  ['1', 'LAZAR 11 kW/240L', 'szt.', '1'],
  [' ', 'ELEMENTY PODŁĄCZENIOWE HYDRAULICZNE ORAZ ELEKTRYCZNE', 'szt.', '1'],
  [' ', 'GRUPA BEZPIECZEŃSTWA CWU (6 BAR)', 'szt.', '1'],
  [' ', 'GRUPA BEZPIECZEŃSTWA C.O (2.5 BAR)', 'kpl.', '1'],
  [' ', 'PODŁĄCZENIE KOMINOWE', 'szt.', '1'],
  [' ', 'REGULATOR BEZPRZEWODOWY', 'szt.', '1'],
  [' ', 'MONTAŻ, DOJAZD, URUCHOMIENIE ORAZ SZKOLENIE UŻYTKOWNIKA', 'szt.', '1'],
];

const lazar_11kW_440L_base = [
  ['1', 'LAZAR 11 kW/440L', 'szt.', '1'],
  [' ', 'ELEMENTY PODŁĄCZENIOWE HYDRAULICZNE ORAZ ELEKTRYCZNE', 'szt.', '1'],
  [' ', 'GRUPA BEZPIECZEŃSTWA CWU (6 BAR)', 'szt.', '1'],
  [' ', 'GRUPA BEZPIECZEŃSTWA C.O (2.5 BAR)', 'kpl.', '1'],
  [' ', 'PODŁĄCZENIE KOMINOWE', 'szt.', '1'],
  [' ', 'REGULATOR BEZPRZEWODOWY', 'szt.', '1'],
  [' ', 'MONTAŻ, DOJAZD, URUCHOMIENIE ORAZ SZKOLENIE UŻYTKOWNIKA', 'szt.', '1'],
];

export const lazarBaseTables = {
  'LAZAR': {
    '11 kW/150': lazar_11kW_150L_base,
    '11 kW/240': lazar_11kW_240L_base,
    '11 kW/440': lazar_11kW_440L_base,
    '15 kW/150': lazar_15kW_150L_base,
    '15 kW/240': lazar_15kW_240L_base,
    '15 kW/440': lazar_15kW_440L_base,
    '22 kW/150': lazar_22kW_150L_base,
    '22 kW/240': lazar_22kW_240L_base,
    '22 kW/440': lazar_22kW_440L_base,
  }
};

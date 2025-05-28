// ścieżka: src/data/tables/pdfTemplateSets.js

/**
 * UWAGA:
 * Poniższe ścieżki to propozycja struktury folderów. Musisz stworzyć te foldery
 * wewnątrz `public/pdf_templates/` i umieścić w nich odpowiednie pliki PDF.
 * Nazwy plików (1_okladka.pdf, 3_katalog.pdf, itd.) są również sugerowane dla zachowania spójności.
 * Strona z ceną i tabelą (strona nr 2) jest generowana dynamicznie i nie wymaga szablonu.
 */

// Centralna ścieżka do wspólnego pliku kontaktowego, aby unikać duplikacji.
const commonContactPage = '/pdf_templates/common/5_kontakt.pdf';

// Domyślny zestaw szablonów, jeśli żaden inny nie pasuje (np. dla nowo dodanej opcji w formularzu)
const defaultTemplatePaths = [
  '/pdf_templates/common/1_okladka.pdf',
  '/pdf_templates/common/3_katalog_PUZ.pdf',
  '/pdf_templates/common/4_opcje.pdf',
  commonContactPage,
];

export const pdfTemplateSets = {
  // --- MITSUBISHI (Pompy Ciepła) ---
  'Mitsubishi-cylinder': [
    '/pdf_templates/mitsubishi/standard-cylinder/1_okladka.pdf',
    '/pdf_templates/mitsubishi/standard-cylinder/2_opcje_dodatkowe.pdf',
     '/pdf_templates/mitsubishi/standard-cylinder/3.1_wewnetrzna_zubadan_ds.pdf',
    '/pdf_templates/mitsubishi/standard-cylinder/3.2_wewnetrzna_zubadan_ds.pdf',
     '/pdf_templates/mitsubishi/standard-cylinder/3.3_wewnetrzna_zubadan_ds.pdf',
    '/pdf_templates/mitsubishi/standard-cylinder/4.1_cylinder_standard.pdf',
    '/pdf_templates/mitsubishi/standard-cylinder/4.2_cylinder_standard.pdf',
    '/pdf_templates/mitsubishi/standard-cylinder/4_opcje.pdf',
    commonContactPage,
  ],
  'Mitsubishi-cylinder-PUZ': [
    '/pdf_templates/mitsubishi/zubadan-cylinder/1_okladka.pdf',
        '/pdf_templates/mitsubishi/zubadan-cylinder/2_opcje_dodatkowe.pdf',
    '/pdf_templates/mitsubishi/zubadan-cylinder/3_katalog_PUZ-1.pdf',
    '/pdf_templates/mitsubishi/zubadan-cylinder/3_katalog_PUZ-2.pdf',
    '/pdf_templates/mitsubishi/zubadan-cylinder/4_opcje.pdf',
    commonContactPage,
  ],
  'Mitsubishi-cylinder-PUZ-1F': [
    '/pdf_templates/mitsubishi/zubadan-cylinder-1f/1_okladka.pdf',
    '/pdf_templates/mitsubishi/zubadan-cylinder-1f/2_opcje_dodatkowe.pdf',
   '/pdf_templates/mitsubishi/zubadan-cylinder/3_katalog_PUZ-1.pdf',
    '/pdf_templates/mitsubishi/zubadan-cylinder/3_katalog_PUZ-2.pdf',
        '/pdf_templates/mitsubishi/zubadan-cylinder-1f/4_opcje.pdf',
    commonContactPage,
  ],
  'Mitsubishi-hydrobox': [
    '/pdf_templates/mitsubishi/standard-hydrobox/1_okladka.pdf',
    '/pdf_templates/mitsubishi/standard-hydrobox/2_opcje_dodatkowe.pdf',
      '/pdf_templates/mitsubishi/standard-hydrobox/3.1_wewnetrzna_zubadan_ds.pdf',
    '/pdf_templates/mitsubishi/standard-hydrobox/3.2_wewnetrzna_zubadan_ds.pdf',
     '/pdf_templates/mitsubishi/standard-hydrobox/3.3_wewnetrzna_zubadan_ds.pdf',
    '/pdf_templates/mitsubishi/standard-hydrobox/3.1_wewnetrzna_hydrobox_ds.pdf',
    '/pdf_templates/mitsubishi/standard-hydrobox/3.2_wewnetrzna_hydrobox_ds.pdf',
    '/pdf_templates/mitsubishi/standard-hydrobox/4_opcje.pdf',
    commonContactPage,
  ],
  'Mitsubishi-hydrobox-PUZ': [
    '/pdf_templates/mitsubishi/zubadan-hydrobox/1_okladka.pdf',
    '/pdf_templates/mitsubishi/zubadan-hydrobox/2_opcje_dodatkowe.pdf',
    '/pdf_templates/mitsubishi/zubadan-hydrobox/3_katalog_PUZ-1.pdf',
    '/pdf_templates/mitsubishi/zubadan-hydrobox/3_katalog_PUZ-2.pdf',
    '/pdf_templates/mitsubishi/zubadan-hydrobox/4_opcje.pdf',
    commonContactPage,
  ],
  'Mitsubishi-hydrobox-PUZ-1F': [
    '/pdf_templates/mitsubishi/zubadan-hydrobox-1f/1_okladka.pdf',
    '/pdf_templates/mitsubishi/zubadan-hydrobox-1f/2_opcje_dodatkowe.pdf',
    '/pdf_templates/mitsubishi/zubadan-hydrobox-1f/3_katalog_PUZ-1.pdf',
    '/pdf_templates/mitsubishi/zubadan-hydrobox-1f/3_katalog_PUZ-2.pdf',
    '/pdf_templates/mitsubishi/zubadan-hydrobox-1f/4_opcje.pdf',
    commonContactPage,
  ],
  'Mitsubishi-ecoinverter': [
    '/pdf_templates/mitsubishi/ecoinverter-cylinder/1_okladka.pdf',
     '/pdf_templates/mitsubishi/ecoinverter-cylinder/2_opcje_dodatkowe.pdf',
    '/pdf_templates/mitsubishi/ecoinverter-cylinder/3.1_ecoinverter_zewnetrzna.pdf',
    '/pdf_templates/mitsubishi/ecoinverter-cylinder/3.2_ecoinverter_zewnetrzna.pdf',
    '/pdf_templates/mitsubishi/ecoinverter-cylinder/3.3_ecoinverter_wewnetrzna.pdf',
    '/pdf_templates/mitsubishi/ecoinverter-cylinder/3.4_ecoinverter_wewnetrzna.pdf',
    '/pdf_templates/mitsubishi/ecoinverter-cylinder/4_opcje.pdf',
    commonContactPage,
  ],
  'Mitsubishi-ecoinverter-hydrobox': [
    '/pdf_templates/mitsubishi/ecoinverter-hydrobox/1_okladka.pdf',
    '/pdf_templates/mitsubishi/ecoinverter-hydrobox/2_opcje_dodatkowe.pdf',
        '/pdf_templates/mitsubishi/standard-cylinder/3.1_wewnetrzna_zubadan_ds.pdf',
    '/pdf_templates/mitsubishi/standard-cylinder/3.2_wewnetrzna_zubadan_ds.pdf',
     '/pdf_templates/mitsubishi/standard-cylinder/3.3_wewnetrzna_zubadan_ds.pdf',
    '/pdf_templates/mitsubishi/ecoinverter-hydrobox/3.1_ecoinverter_zewnetrzna.pdf',
    '/pdf_templates/mitsubishi/ecoinverter-hydrobox/3.2_ecoinverter_zewnetrzna.pdf',
    '/pdf_templates/mitsubishi/ecoinverter-hydrobox/4_opcje.pdf',
    commonContactPage,
  ],
  'Mitsubishi-hp': [
    '/pdf_templates/mitsubishi/hyper-heating/1_okladka.pdf',
    '/pdf_templates/mitsubishi/hyper-heating/2_opcje_dodatkowe.pdf',
    '/pdf_templates/mitsubishi/hyper-heating/3_katalog.pdf',
    '/pdf_templates/mitsubishi/hyper-heating/4_opcje.pdf',
    commonContactPage,
  ],

  // --- MITSUBISHI (Klimatyzatory) ---
  'MITSUBISHI AY': [
    '/pdf_templates/mitsubishi-klima/ay/1_okladka.pdf',
    '/pdf_templates/mitsubishi-klima/ay/3_katalog.pdf',
    '/pdf_templates/mitsubishi-klima/ay/4_opcje.pdf',
    commonContactPage,
  ],
  'MITSUBISHI HR': [
    '/pdf_templates/mitsubishi-klima/hr/1_okladka.pdf',
    '/pdf_templates/mitsubishi-klima/hr/3_katalog.pdf',
    '/pdf_templates/mitsubishi-klima/hr/4_opcje.pdf',
    commonContactPage,
  ],
  
  // --- TOSHIBA ---
  'Toshiba 3F': [
    '/pdf_templates/toshiba/3-fazowe/1_okladka.pdf',
    '/pdf_templates/toshiba/3-fazowe/3_katalog.pdf',
    '/pdf_templates/toshiba/3-fazowe/4_opcje.pdf',
    commonContactPage,
  ],
  'Toshiba 1F': [
    '/pdf_templates/toshiba/1-fazowe/1_okladka.pdf',
    '/pdf_templates/toshiba/1-fazowe/3_katalog.pdf',
    '/pdf_templates/toshiba/1-fazowe/4_opcje.pdf',
    commonContactPage,
  ],

  // --- ATLANTIC ---
  'ATLANTIC': [ // Atlantic Extensa AI Duo
    '/pdf_templates/atlantic/extensa-ai-duo/1_okladka.pdf',
    '/pdf_templates/atlantic/extensa-ai-duo/3_katalog.pdf',
    '/pdf_templates/atlantic/extensa-ai-duo/4_opcje.pdf',
    commonContactPage,
  ],
  'ATLANTIC-HYDROBOX': [ // Atlantic Excelia AI Hydrobox
    '/pdf_templates/atlantic/excelia-ai-hydrobox/1_okladka.pdf',
    '/pdf_templates/atlantic/excelia-ai-hydrobox/3_katalog.pdf',
    '/pdf_templates/atlantic/excelia-ai-hydrobox/4_opcje.pdf',
    commonContactPage,
  ],
  'ATLANTIC-M-DUO': [ // Atlantic M-Duo
    '/pdf_templates/atlantic/m-duo/1_okladka.pdf',
     '/pdf_templates/mitsubishi/ecoinverter-hydrobox/2_opcje_dodatkowe.pdf',
    '/pdf_templates/atlantic/m-duo/3.1_atlantic_m_duo.pdf',
    '/pdf_templates/atlantic/m-duo/3.2_atlantic_m_duo.pdf',
    '/pdf_templates/atlantic/m-duo/4_opcje.pdf',

    commonContactPage,
  ],

  // --- VIESSMANN ---
  'VIESSMANN': [ // Viessmann Vitocal 150-A
    '/pdf_templates/viessmann/vitocal-150-a/1_okladka.pdf',
    '/pdf_templates/viessmann/vitocal-150-a/3_katalog.pdf',
    '/pdf_templates/viessmann/vitocal-150-a/4_opcje.pdf',
    commonContactPage,
  ],

  // --- GALMET ---
  'GALMET-PRIMA': [
    '/pdf_templates/galmet/prima/1_okladka.pdf',
    '/pdf_templates/galmet/prima/3_katalog.pdf',
    '/pdf_templates/galmet/prima/4_opcje.pdf',
    commonContactPage,
  ],

  // --- HEIZTECHNIK ---
  'HEIZTECHNIK': [
    '/pdf_templates/heiztechnik/calla-verde-comfort/1_okladka.pdf',
    '/pdf_templates/heiztechnik/calla-verde-comfort/3_katalog.pdf',
    '/pdf_templates/heiztechnik/calla-verde-comfort/4_opcje.pdf',
    commonContactPage,
  ],

  // --- NIBE ---
  'NIBE12': [ // NIBE F1245 (Gruntowa)
    '/pdf_templates/nibe/f1245-gruntowa/1_okladka.pdf',
    '/pdf_templates/nibe/f1245-gruntowa/3_katalog.pdf',
    '/pdf_templates/nibe/f1245-gruntowa/4_opcje.pdf',
    commonContactPage,
  ],

  // --- KOTŁY NA PELLET ---
  'LAZAR': [
    '/pdf_templates/kotly-pellet/lazar/1_okladka.pdf',
    '/pdf_templates/kotly-pellet/lazar/3_katalog.pdf',
    '/pdf_templates/kotly-pellet/lazar/4_opcje.pdf',
    commonContactPage,
  ],
  'KAMEN-KOMPAKT-LUX': [
    '/pdf_templates/kotly-pellet/kamen-kompakt-lux/1_okladka.pdf',
    '/pdf_templates/kotly-pellet/kamen-kompakt-lux/3_katalog.pdf',
    '/pdf_templates/kotly-pellet/kamen-kompakt-lux/4_opcje.pdf',
    commonContactPage,
  ],
  'KAMEN-PELLET-KOMPAKT': [
    '/pdf_templates/kotly-pellet/kamen-pellet-kompakt/1_okladka.pdf',
    '/pdf_templates/kotly-pellet/kamen-pellet-kompakt/3_katalog.pdf',
    '/pdf_templates/kotly-pellet/kamen-pellet-kompakt/4_opcje.pdf',
    commonContactPage,
  ],
  'KAMEN-DRX': [
    '/pdf_templates/kotly-pellet/kamen-drx/1_okladka.pdf',
    '/pdf_templates/kotly-pellet/kamen-drx/3_katalog.pdf',
    '/pdf_templates/kotly-pellet/kamen-drx/4_opcje.pdf',
    commonContactPage,
  ],
  'Kotlospaw Slimko Plus': [
    '/pdf_templates/kotly-pellet/kotlospaw-slimko-plus/1_okladka.pdf',
    '/pdf_templates/kotly-pellet/kotlospaw-slimko-plus/3_katalog.pdf',
    '/pdf_templates/kotly-pellet/kotlospaw-slimko-plus/4_opcje.pdf',
    commonContactPage,
  ],
  'Kotlospaw slimko plus niski': [
    '/pdf_templates/kotly-pellet/kotlospaw-slimko-plus-niski/1_okladka.pdf',
    '/pdf_templates/kotly-pellet/kotlospaw-slimko-plus-niski/3_katalog.pdf',
    '/pdf_templates/kotly-pellet/kotlospaw-slimko-plus-niski/4_opcje.pdf',
    commonContactPage,
  ],
  'QMPELL': [
    '/pdf_templates/kotly-pellet/qmpell-evo/1_okladka.pdf',
    '/pdf_templates/kotly-pellet/qmpell-evo/3_katalog.pdf',
    '/pdf_templates/kotly-pellet/qmpell-evo/4_opcje.pdf',
    commonContactPage,
  ],

  // --- KOTŁY HYBRYDOWE ---
  'DREWKO-HYBRID': [
    '/pdf_templates/kotly-hybrydowe/kotlospaw-drewko-hybrid/1_okladka.pdf',
    '/pdf_templates/kotly-hybrydowe/kotlospaw-drewko-hybrid/3_katalog.pdf',
    '/pdf_templates/kotly-hybrydowe/kotlospaw-drewko-hybrid/4_opcje.pdf',
    commonContactPage,
  ],
  'Kotlospaw drewko plus palnik easy ROT': [
    '/pdf_templates/kotly-hybrydowe/kotlospaw-drewko-plus-easy-rot/1_okladka.pdf',
    '/pdf_templates/kotly-hybrydowe/kotlospaw-drewko-plus-easy-rot/3_katalog.pdf',
    '/pdf_templates/kotly-hybrydowe/kotlospaw-drewko-plus-easy-rot/4_opcje.pdf',
    commonContactPage,
  ],
  'Kotlospaw drewko plus palnik REVO': [
    '/pdf_templates/kotly-hybrydowe/kotlospaw-drewko-plus-revo/1_okladka.pdf',
    '/pdf_templates/kotly-hybrydowe/kotlospaw-drewko-plus-revo/3_katalog.pdf',
    '/pdf_templates/kotly-hybrydowe/kotlospaw-drewko-plus-revo/4_opcje.pdf',
    commonContactPage,
  ],
  
  // --- KLIMATYZATORY INNE ---
  'ROTENSO': [
    '/pdf_templates/klimatyzatory-inne/rotenso/1_okladka.pdf',
    '/pdf_templates/klimatyzatory-inne/rotenso/3_katalog.pdf',
    '/pdf_templates/klimatyzatory-inne/rotenso/4_opcje.pdf',
    commonContactPage,
  ],
  'KAISAI': [
    '/pdf_templates/klimatyzatory-inne/kaisai/1_okladka.pdf',
    '/pdf_templates/klimatyzatory-inne/kaisai/3_katalog.pdf',
    '/pdf_templates/klimatyzatory-inne/kaisai/4_opcje.pdf',
    commonContactPage,
  ],
  'MIDEA': [
    '/pdf_templates/klimatyzatory-inne/midea/1_okladka.pdf',
    '/pdf_templates/klimatyzatory-inne/midea/3_katalog.pdf',
    '/pdf_templates/klimatyzatory-inne/midea/4_opcje.pdf',
    commonContactPage,
  ],
};

export function getTemplatePathsForDevice(deviceType) {
  // Zwraca zdefiniowany zestaw ścieżek lub domyślny, jeśli klucz nie zostanie znaleziony
  return pdfTemplateSets[deviceType] || defaultTemplatePaths;
}
// ścieżka: src/data/tables/pdfTemplateSets.js

// Domyślny zestaw szablonów, jeśli żaden inny nie pasuje
const defaultTemplatePaths = [
  '/pdf_templates/mitsubishi/zubadan-cylinder/1_okladka.pdf', // Zmień na ścieżkę do Twojej domyślnej okładki
  // Strona z ceną i tabelą jest generowana dynamicznie
  '/pdf_templates/mitsubishi/zubadan-cylinder/3_katalog.pdf', // Zmień na ścieżkę do domyślnego katalogu
  '/pdf_templates/mitsubishi/zubadan-cylinder/4_opcje.pdf',   // Zmień na ścieżkę do domyślnych opcji
  '/pdf_templates/mitsubishi/zubadan-cylinder/5_kontakt.pdf', // Zakładam, że kontakt może być wspólny
];

export const pdfTemplateSets = {
  // Klucze muszą DOKŁADNIE odpowiadać wartościom 'value' z <select> w UnifiedOfferForm.jsx
  'Mitsubishi-cylinder-PUZ': [
    '/pdf_templates/mitsubishi/zubadan-cylinder/1_okladka.pdf',
    '/pdf_templates/mitsubishi/zubadan-cylinder/3_katalog.pdf',
    '/pdf_templates/mitsubishi/zubadan-cylinder/4_opcje.pdf',
    '/pdf_templates/mitsubishi/zubadan-cylinder/5_kontakt.pdf',
  ],
  'Mitsubishi-cylinder': [ // Dla "standardowego" cylindra
    '/pdf_templates/mitsubishi/zubadan-cylinder/1_okladka.pdf', // Możesz użyć tych samych lub innych
    '/pdf_templates/mitsubishi/standard-cylinder/katalog_std_cyl.pdf', // Przykładowa inna ścieżka
    '/pdf_templates/mitsubishi/standard-cylinder/opcje_std_cyl.pdf',   // Przykładowa inna ścieżka
    '/pdf_templates/mitsubishi/zubadan-cylinder/5_kontakt.pdf',
  ],
  'Toshiba 3F': [
    '/pdf_templates/toshiba/okladka_toshiba_3f.pdf', // Przykładowe ścieżki dla Toshiby
    '/pdf_templates/toshiba/katalog_toshiba_3f.pdf',
    '/pdf_templates/toshiba/opcje_toshiba_3f.pdf',
    '/pdf_templates/mitsubishi/zubadan-cylinder/5_kontakt.pdf', 
  ],
  // --- Dodaj tutaj wpisy dla WSZYSTKICH pdfType z Twojego formularza ---
  // Pamiętaj o stworzeniu odpowiednich folderów i plików PDF w 'public/pdf_templates/'
  // Przykład:
  // 'VIESSMANN': [
  //   '/pdf_templates/viessmann/1_okladka.pdf',
  //   '/pdf_templates/viessmann/3_katalog.pdf',
  //   '/pdf_templates/viessmann/4_opcje.pdf',
  //   '/pdf_templates/viessmann/5_kontakt.pdf', // lub wspólny kontakt
  // ],
};

export function getTemplatePathsForDevice(deviceType) {
  return pdfTemplateSets[deviceType] || defaultTemplatePaths;
}
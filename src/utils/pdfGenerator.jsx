import { PDFDocument, rgb, degrees } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import { getTableForDeviceType } from '../data/tables';

export async function generateMitsubishiZubadanCylinderOfferPDF(
  cena,
  userName,
  deviceType,
  model,
  tank,
  buffer
) {
  if (!userName?.trim() || !String(cena).trim()) {
    alert('Uzupełnij wszystkie wymagane pola: Imię i nazwisko oraz cena!');
    return;
  }

  // Przygotuj dane tabeli
  const tableRows = getTableForDeviceType(deviceType);

  // Wczytaj czcionkę firmową (Open Sans)
  const fontBytes = await fetch('/fonts/OpenSans-Regular.ttf').then(res => res.arrayBuffer());

  // Stwórz dokument
  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);

  const font = await pdfDoc.embedFont(fontBytes);
  const fontBold = font; // Dla uproszczenia, podmień jeśli masz wersję bold

  // Strona 1: Oferta
  const page = pdfDoc.addPage([595, 842]); // A4

  // Gradient tła (delikatny)
  page.drawRectangle({
    x: 0, y: 0, width: 595, height: 842,
    color: rgb(1, 1, 1), // biały, możesz zmienić na lekki szary
  });

  // Logo (opcjonalnie)
  // const logoBytes = await fetch('/images/logo.png').then(res => res.arrayBuffer());
  // const logoImg = await pdfDoc.embedPng(logoBytes);
  // page.drawImage(logoImg, { x: 50, y: 770, width: 80, height: 38 });

  // Nagłówek – duży, czerwony
  page.drawText(`OFERTA DLA: ${userName.toUpperCase()}`, {
    x: 50,
    y: 790,
    size: 30,
    font: fontBold,
    color: rgb(0.7, 0, 0.16),
  });

  // Ustawienia tabeli
  const colX = [50, 110, 450, 520, 555];
  const colW = [55, 335, 70, 30];
  const yStart = 750;

  // Nagłówek tabeli
  page.drawRectangle({
    x: colX[0], y: yStart, width: colW.reduce((a, b) => a + b, 0), height: 27,
    color: rgb(0.6, 0, 0.15),
    borderColor: rgb(0.6, 0, 0.15),
    borderWidth: 1,
  });
  page.drawText('Nr',        { x: colX[0] + 7, y: yStart + 8, size: 14, font: fontBold, color: rgb(1, 1, 1) });
  page.drawText('Nazwa towaru', { x: colX[1] + 7, y: yStart + 8, size: 14, font: fontBold, color: rgb(1, 1, 1) });
  page.drawText('Miara',     { x: colX[2] + 7, y: yStart + 8, size: 14, font: fontBold, color: rgb(1, 1, 1) });
  page.drawText('Ilość',     { x: colX[3] + 7, y: yStart + 8, size: 14, font: fontBold, color: rgb(1, 1, 1) });

  // Pozycje tabeli
  let y = yStart - 26;
  for (let i = 0; i < tableRows.length; i++) {
    // Alternatywny kolor wiersza
    if (i % 2 === 1) {
      page.drawRectangle({
        x: colX[0], y: y, width: colW.reduce((a, b) => a + b, 0), height: 22,
        color: rgb(0.98, 0.96, 0.96),
      });
    }
    // Linie oddzielające
    page.drawLine({
      start: { x: colX[0], y: y },
      end:   { x: colX[0] + colW.reduce((a, b) => a + b, 0), y: y },
      thickness: 0.7,
      color: rgb(0.8, 0.8, 0.8),
    });
    // Komórki
    page.drawText(tableRows[i][0], { x: colX[0] + 7, y: y + 6, size: 12, font, color: rgb(0.15,0.15,0.15) });
    page.drawText(tableRows[i][1], { x: colX[1] + 7, y: y + 6, size: 12, font, color: rgb(0.15,0.15,0.15), maxWidth: colW[1] - 10 });
    page.drawText(tableRows[i][2], { x: colX[2] + 7, y: y + 6, size: 12, font, color: rgb(0.15,0.15,0.15) });
    page.drawText(tableRows[i][3], { x: colX[3] + 15, y: y + 6, size: 12, font, color: rgb(0.15,0.15,0.15) });
    y -= 22;
  }

  // Podsumowanie: Cena
  page.drawText('CENA KOŃCOWA:', {
    x: 50,
    y: y - 30,
    size: 22,
    font: fontBold,
    color: rgb(0.7, 0, 0.16),
  });
  page.drawText(`${cena} PLN`, {
    x: 260,
    y: y - 30,
    size: 22,
    font: fontBold,
    color: rgb(0.8, 0.05, 0.1),
  });

  // Zapis i pobranie
  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Oferta_${deviceType}.pdf`;
  a.click();
}

// ścieżka: src/utils/pdfGenerator.jsx

import { PDFDocument, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import { getTableData } from '../data/tables'; 
import { getTemplatePathsForDevice } from '../data/tables/pdfTemplateSets'; 

// Funkcja pomocnicza do rysowania tabeli (bez zmian)
function drawTable(page, font, tableData) {
  const startY = 750;
  let currentY = startY;
  const table = {
    x: 50, y: startY, columnWidths: [40, 350, 70, 70], headerHeight: 27, rowHeight: 22,
    lineHeight: 14, padding: { top: 8, bottom: 8, left: 7, right: 7 },
  };
  const columnPositions = [table.x];
  for (let i = 0; i < table.columnWidths.length - 1; i++) {
    columnPositions.push(columnPositions[i] + table.columnWidths[i]);
  }
  const wrapText = (text, font, size, maxWidth) => {
    if (typeof text !== 'string') { text = String(text); }
    const words = text.split(' ');
    let lines = [];
    let currentLine = words[0] || '';
    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const width = font.widthOfTextAtSize(`${currentLine} ${word}`, size);
      if (width < maxWidth) {
        currentLine += ` ${word}`;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);
    return lines;
  };
  currentY -= table.headerHeight;
  const headerTextY = currentY + table.padding.top;
  page.drawRectangle({
    x: table.x, y: currentY, width: table.columnWidths.reduce((a, b) => a + b, 0),
    height: table.headerHeight, color: rgb(0.6, 0, 0.15),
  });
  page.drawText('Nr', { x: columnPositions[0] + table.padding.left, y: headerTextY, size: 14, font, color: rgb(1, 1, 1) });
  page.drawText('Nazwa towaru', { x: columnPositions[1] + table.padding.left, y: headerTextY, size: 14, font, color: rgb(1, 1, 1) });
  page.drawText('Miara', { x: columnPositions[2] + table.padding.left, y: headerTextY, size: 14, font, color: rgb(1, 1, 1) });
  page.drawText('Ilość', { x: columnPositions[3] + table.padding.left, y: headerTextY, size: 14, font, color: rgb(1, 1, 1) });
  tableData.forEach((row, rowIndex) => {
    if (!row || row.length < 4) { console.warn('Pominięto nieprawidłowy wiersz w tableData:', row); return; }
    const textInCell = row[1] || '';
    const textLines = wrapText(textInCell, font, 12, table.columnWidths[1] - table.padding.left - table.padding.right);
    const requiredHeight = textLines.length * table.lineHeight + table.padding.top + table.padding.bottom;
    const dynamicRowHeight = Math.max(table.rowHeight, requiredHeight);
    currentY -= dynamicRowHeight;
    if (rowIndex % 2 === 1) {
      page.drawRectangle({
        x: table.x, y: currentY, width: table.columnWidths.reduce((a, b) => a + b, 0),
        height: dynamicRowHeight, color: rgb(0.98, 0.96, 0.96),
      });
    }
    const textY = currentY + dynamicRowHeight - table.padding.top - table.lineHeight + 2;
    page.drawText(String(row[0] || ''), { x: columnPositions[0] + table.padding.left, y: textY, size: 12, font, color: rgb(0.15, 0.15, 0.15) });
    page.drawText(textLines.join('\n'), { x: columnPositions[1] + table.padding.left, y: textY, size: 12, font, color: rgb(0.15, 0.15, 0.15), lineHeight: table.lineHeight });
    page.drawText(String(row[2] || ''), { x: columnPositions[2] + table.padding.left, y: textY, size: 12, font, color: rgb(0.15, 0.15, 0.15) });
    const quantityText = String(row[3] || '');
    const quantityWidth = font.widthOfTextAtSize(quantityText, 12);
    const quantityX = columnPositions[3] + (table.columnWidths[3] - quantityWidth) / 2;
    page.drawText(quantityText, { x: quantityX, y: textY, size: 12, font, color: rgb(0.15, 0.15, 0.15) });
    page.drawLine({
      start: { x: table.x, y: currentY }, end: { x: table.x + table.columnWidths.reduce((a, b) => a + b, 0), y: currentY },
      thickness: 0.7, color: rgb(0.8, 0.8, 0.8),
    });
  });
  return currentY;
}


// Główna funkcja generująca PDF
export async function generateOfferPDF( 
  cena,
  userName,
  deviceType,
  model,
  tankCapacity,
  bufferCapacity
) {
  // Sprawdzenie podstawowych danych
  if (!userName?.trim() || !String(cena).trim()) {
    alert('Uzupełnij wszystkie wymagane pola: Imię i nazwisko oraz cena!');
    return;
  }

  // --- KROK 1: DIAGNOSTYKA ---
  // Te linie pokażą w konsoli przeglądarki (F12), jakie dane są używane do wyboru szablonów.
  console.log(`[DIAGNOSTYKA] Próba znalezienia szablonów dla klucza: "${deviceType}"`);
  const selectedTemplatePaths = getTemplatePathsForDevice(deviceType);
  console.log('[DIAGNOSTYKA] Wybrane ścieżki szablonów:', selectedTemplatePaths);
  
  try {
    // --- KROK 2: WCZYTANIE PLIKÓW ---
    // Wczytanie wszystkich potrzebnych zasobów: szablonów PDF i czcionki.
    const assetBuffers = await Promise.all([
      ...selectedTemplatePaths.map(path => fetch(path).then(res => {
          if (!res.ok) throw new Error(`Nie udało się wczytać pliku szablonu PDF: ${path}. Sprawdź, czy plik istnieje w folderze 'public' i czy ścieżka jest poprawna.`);
          return res.arrayBuffer();
      })),
      fetch('/fonts/OpenSans-Regular.ttf').then(res => { 
          if (!res.ok) throw new Error(`Nie udało się wczytać czcionki OpenSans-Regular.ttf z public/fonts/`);
          return res.arrayBuffer();
      })
    ]);

    // Przygotowanie czcionki i oddzielenie szablonów od czcionki
    const fontBytes = assetBuffers.pop();
    const templatePdfBuffers = assetBuffers; 

    // --- KROK 3: TWORZENIE NOWEGO DOKUMENTU PDF ---
    const finalPdfDoc = await PDFDocument.create();
    finalPdfDoc.registerFontkit(fontkit);
    const customFont = await finalPdfDoc.embedFont(fontBytes);
    
    // 1. Dodaj okładkę (pierwszy szablon z listy)
    if (templatePdfBuffers[0]) {
      const okladkaDoc = await PDFDocument.load(templatePdfBuffers[0]);
      const copiedPages = await finalPdfDoc.copyPages(okladkaDoc, okladkaDoc.getPageIndices());
      copiedPages.forEach(page => finalPdfDoc.addPage(page));
    }

    // 2. Stwórz nową, dynamiczną stronę z tabelą i ceną
    const dynamicPage = finalPdfDoc.addPage(); 
    const tableData = getTableData(deviceType, model, tankCapacity, bufferCapacity);
    
    dynamicPage.drawText(`OFERTA DLA: ${userName.toUpperCase()}`, {
        x: 50, y: 800, size: 24, font: customFont, color: rgb(0.7, 0, 0.16),
    });

    let lastYPosAfterTable = 770; // Domyślna pozycja, jeśli nie ma tabeli
    if (tableData && tableData.length > 0) {
      lastYPosAfterTable = drawTable(dynamicPage, customFont, tableData); 
    } else {
      dynamicPage.drawText("Brak danych do wyświetlenia w tabeli dla wybranej konfiguracji.", {
        x: 50, y: 750, size: 12, font: customFont, color: rgb(0.5, 0.5, 0.5)
      });
    }
    
    dynamicPage.drawText(`CENA KOŃCOWA: ${cena} PLN brutto`, {
        x: 50, y: lastYPosAfterTable - 40, size: 18, font: customFont, color: rgb(0.7, 0, 0.16),
    });

    // 3. Dodaj resztę statycznych stron (katalog, opcje, kontakt)
    for (let i = 1; i < templatePdfBuffers.length; i++) { 
        if (templatePdfBuffers[i]) {
            const templateDoc = await PDFDocument.load(templatePdfBuffers[i]);
            const copiedPages = await finalPdfDoc.copyPages(templateDoc, templateDoc.getPageIndices());
            copiedPages.forEach(page => finalPdfDoc.addPage(page));
        }
    }
    
    // --- KROK 4: ZAPIS I POBRANIE PLIKU ---
    const pdfBytes = await finalPdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Oferta_KAMAN_${userName.replace(/ /g, '_')}.pdf`;
    document.body.appendChild(a);
a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

  } catch (error) {
    console.error('Błąd podczas generowania PDF:', error);
    alert(`Wystąpił błąd podczas generowania oferty: ${error.message}. Sprawdź konsolę deweloperską (F12).`);
  }
}
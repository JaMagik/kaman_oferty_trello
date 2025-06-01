const KAMAN_APP_URL = 'https://kaman-oferty-trello.vercel.app';

window.TrelloPowerUp.initialize({
  'card-buttons': function (t, options) {
    return [{
      icon: `${KAMAN_APP_URL}/vite.svg`,
      text: 'Generuj ofertę Kaman',
      callback: function (t_click_context) {
        return t_click_context.card('id')
          .then(function (card) {
            const cardId = card.id;
            const url = `${KAMAN_APP_URL}?trelloCardId=${cardId}`;
            return t_click_context.modal({
              url: url,
              fullscreen: true,
              title: 'Generator Ofert Kaman',
              args: { cardId }
            });
          });
      }
    }];
  }
}, {
  appName: 'Kaman Oferty Power-Up'
});

// Obsługa wiadomości z iframe (aplikacja React/Vite hostowana na Vercel)
window.addEventListener('message', function(event) {
  if (event.origin !== KAMAN_APP_URL) return; // bezpieczeństwo!

  const { type, pdfDataUrl, pdfName } = event.data;

  if (type === 'TRELLO_SAVE_PDF') {
    const t = window.TrelloPowerUp.iframe();

    t.attach({
      name: pdfName,
      url: pdfDataUrl,
      mimeType: 'application/pdf'
    })
    .then(() => {
      t.alert({
        message: 'Oferta PDF zapisana pomyślnie!',
        duration: 5,
        display: 'success'
      });
    })
    .catch((error) => {
      t.alert({
        message: `Błąd zapisu PDF: ${error.message}`,
        duration: 8,
        display: 'error'
      });
    });
  }
});

if (window.opener) {
  window.opener.postMessage({
    type: 'TRELLO_SAVE_PDF',
    pdfDataUrl: base64PdfDataUrl,
    pdfName: `Oferta_KAMAN_${userName.replace(/ /g, '_')}.pdf`,
    cardId: trelloCardId
  }, KAMAN_APP_ORIGIN);
} else {
  console.error("UNIFIED_FORM: window.opener nie jest dostępne. Nie można wysłać wiadomości.");
  alert("Błąd komunikacji z Trello Power-Up.");
}


window.TrelloPowerUp.iframe().closeModal({
  type: 'TRELLO_SAVE_PDF',
  pdfDataUrl: 'data:application/pdf;base64,...',
  pdfName: 'oferta.pdf',
});


console.log('MAIN.JS: TrelloPowerUp poprawnie zainicjalizowany.');

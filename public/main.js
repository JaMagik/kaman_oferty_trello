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
          })
          .then(function (modalReturnData) {
            // Odbierz dane z modala
            if (modalReturnData && modalReturnData.type === 'TRELLO_SAVE_PDF') {
              const { pdfDataUrl, pdfName } = modalReturnData;
              return t_click_context.attach({
                name: pdfName,
                url: pdfDataUrl,
                mimeType: 'application/pdf'
              })
              .then(() => {
                t_click_context.alert({
                  message: 'Oferta PDF zapisana w Trello!',
                  duration: 5,
                  display: 'success'
                });
              })
              .catch(err => {
                t_click_context.alert({
                  message: `Błąd zapisu: ${err.message}`,
                  duration: 8,
                  display: 'error'
                });
              });
            }
          })
          .catch(function (error) {
            console.error('MAIN.JS: Błąd w callbacku:', error);
            t_click_context.alert({
              message: `Błąd: ${error.message || 'Nieznany'}`,
              duration: 6,
              display: 'error'
            });
          });
      }
    }];
  }
}, {
  appName: 'Kaman Oferty Power-Up'
});

console.log('MAIN.JS: TrelloPowerUp poprawnie zainicjalizowany.');

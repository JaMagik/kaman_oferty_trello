// main.js
const KAMAN_APP_URL = 'https://kaman-oferty-trello.vercel.app';
const KAMAN_APP_ORIGIN = new URL(KAMAN_APP_URL).origin;

window.TrelloPowerUp.initialize({
  'card-buttons': function (t) {
    return [{
      icon: `${KAMAN_APP_URL}/vite.svg`,
      text: 'Generuj ofertę Kaman',
      callback: function (t_click_context) {
        return t_click_context.card('id')
          .then(function (card) {
            const cardId = card.id;
            const url = `${KAMAN_APP_URL}/trelloAuth/startFront?cardId=${cardId}`;
            return t_click_context.popup({
              title: 'Generator Ofert Kaman',
              url: url,
              height: 750
            });
          })
          .then(function (popupReturnData) {
            if (popupReturnData && popupReturnData.type === 'TRELLO_SAVE_PDF') {
              const { pdfDataUrl, pdfName } = popupReturnData;
              return fetch(pdfDataUrl)
                .then(res => res.blob())
                .then(blob => {
                  const file = new File([blob], pdfName, { type: 'application/pdf' });
                  return t_click_context.attach({
                    name: pdfName,
                    url: pdfDataUrl,
                    file: file,
                    mimeType: 'application/pdf'
                  });
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
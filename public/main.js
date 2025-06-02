const KAMAN_APP_URL = 'https://kaman-oferty-trello.vercel.app';

window.TrelloPowerUp.initialize({
  'card-buttons': function (t) {
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
window.addEventListener('message', async (event) => {
  if (event.origin !== KAMAN_APP_ORIGIN) return;
  const t = trelloGlobalContext;
  if (!t) return;

  const { type, accessToken, accessTokenSecret, pdfDataUrl, pdfName, cardId } = event.data || {};

  if (type === 'TRELLO_AUTH_SUCCESS' && accessToken && accessTokenSecret) {
    await t.store('member', 'private', 'authToken', accessToken);
    await t.store('member', 'private', 'authTokenSecret', accessTokenSecret);
    t.alert({ message: 'Autoryzacja Trello zakończona pomyślnie!', duration: 3, display: 'success' });
  } else if (type === 'TRELLO_SAVE_PDF' && pdfDataUrl && pdfName && cardId) {
    handleSavePdfData(t, { pdfDataUrl, pdfName, cardId });
  }
});

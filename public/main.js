// main.js
const KAMAN_APP_URL = 'https://kaman-oferty-trello.vercel.app/';
const KAMAN_APP_ORIGIN = new URL(KAMAN_APP_URL).origin;

let trelloGlobalContext = null;

console.log('START: main.js Power-Up skrypt ładowany. App URL:', KAMAN_APP_URL);

window.addEventListener('message', async (event) => {
    if (event.origin !== KAMAN_APP_ORIGIN) return;

    const t = trelloGlobalContext;
    if (!t) {
        console.error("MAIN.JS: Brak trelloGlobalContext. Nie można przetworzyć wiadomości:", event.data?.type);
        return;
    }

    const { type, accessToken, accessTokenSecret, pdfDataUrl, pdfName, cardId } = event.data || {};

    if (type === 'TRELLO_AUTH_SUCCESS' && accessToken && accessTokenSecret) {
        try {
            await t.store('member', 'private', 'authToken', accessToken);
            await t.store('member', 'private', 'authTokenSecret', accessTokenSecret);
            console.log('MAIN.JS: Tokeny Trello zapisane w storage.');
            t.alert({ message: 'Autoryzacja Trello zakończona pomyślnie!', duration: 3, display: 'success' });
        } catch (storeError) {
            console.error('MAIN.JS: Błąd podczas zapisywania tokenów Trello:', storeError);
            t.alert({ message: 'Nie udało się zapisać tokenów autoryzacyjnych.', duration: 5, display: 'error' });
        }
    } else if (type === 'TRELLO_SAVE_PDF' && pdfDataUrl && pdfName && cardId) {
        try {
            const storedToken = await t.get('member', 'private', 'authToken');
            const storedTokenSecret = await t.get('member', 'private', 'authTokenSecret');

            if (!storedToken || !storedTokenSecret) {
                t.alert({ message: 'Brak autoryzacji. Proszę najpierw autoryzować Power-Up.', duration: 8, display: 'error' });
                return;
            }

            const response = await fetch(`${KAMAN_APP_URL}api/saveToTrello`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cardId, accessToken: storedToken, accessTokenSecret: storedTokenSecret, fileDataUrl: pdfDataUrl, fileName: pdfName })
            });

            const responseText = await response.text();
            if (response.ok) {
                t.alert({ message: 'Oferta PDF zapisana w Trello!', duration: 5, display: 'success' });
            } else {
                t.alert({ message: `Błąd zapisu: ${responseText || response.statusText}`, duration: 10, display: 'error' });
            }
        } catch (error) {
            console.error('MAIN.JS: Wyjątek krytyczny podczas zapisu PDF:', error);
            t.alert({ message: `Krytyczny błąd: ${error.message}`, duration: 10, display: 'error' });
        }
    } else if (type) {
        console.log('MAIN.JS: Otrzymano inną wiadomość z KAMAN_APP_ORIGIN:', event.data);
    }
});

console.log('MAIN.JS: Listener wiadomości autoryzacyjnych dodany.');

TrelloPowerUp.initialize({
    'board-buttons': function(t, options) {
        trelloGlobalContext = t;
        return [];
    },
    'card-buttons': function(t, options) {
        trelloGlobalContext = t;
        console.log('MAIN.JS: Inicjalizacja card-buttons.');
        return [{
            icon: KAMAN_APP_URL + 'vite.svg',
            text: 'Generuj ofertę Kaman',
            callback: function(t_click_context) {
                trelloGlobalContext = t_click_context;
                console.log('MAIN.JS: Callback "Generuj ofertę Kaman" wywołany.');
                return t_click_context.card('id')
                    .then(function(card) {
                        if (!card || !card.id) {
                            console.error('MAIN.JS: Nie udało się pobrać ID karty.');
                            throw new Error('Nie udało się pobrać ID karty.');
                        }
                        const cardId = card.id;
                        const url = `${KAMAN_APP_URL}?trelloCardId=${cardId}`;
                        console.log('MAIN.JS: Otwieranie popupu z URL:', url);
                        return t_click_context.popup({
                            title: 'Generator Ofert Kaman',
                            url: url,
                            height: 750,
                            args: { cardId }
                        });
                    })
                    .catch(function(error) {
                        console.error('MAIN.JS: Błąd w callbacku "Generuj ofertę Kaman" lub otwieraniu popupu:', error);
                        t_click_context.alert({ message: `Błąd: ${error.message || 'Nieznany błąd'}`, duration: 6, display: 'error' });
                    });
            }
        }];
    },
    'authorization-status': function(t, options) {
        trelloGlobalContext = t;
        return t.get('member', 'private', 'authToken')
            .then(function(authToken) {
                return { authorized: !!authToken };
            })
            .catch(err => {
                console.error("MAIN.JS: Błąd sprawdzania statusu autoryzacji:", err);
                return { authorized: false };
            });
    },
    'show-authorization': function(t, options) {
        trelloGlobalContext = t;
        return t.popup({
            title: 'Autoryzacja Kaman Oferty',
            url: `${KAMAN_APP_URL}api/trelloAuth/start`,
            height: 680,
            width: 580,
        });
    }
}, {
    appName: 'Kaman Oferty Power-Up',
    appKey: '0f932c28c8d97d03741c8863c2ff4afb'
});

console.log('MAIN.JS: TrelloPowerUp.initialize zakończone.');

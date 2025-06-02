export async function uploadAttachment(cardId, file) {
  const apiKey = 'YOUR_API_KEY';
  const apiToken = localStorage.getItem('trello_token');

  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(`https://api.trello.com/1/cards/${cardId}/attachments?key=${apiKey}&token=${apiToken}`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Błąd: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Załącznik dodany:', data);
    alert('Załącznik został pomyślnie dodany do karty Trello.');
  } catch (error) {
    console.error('Błąd:', error);
    alert(`Wystąpił błąd podczas dodawania załącznika: ${error.message}`);
  }
}

import React from "react";
import UnifiedOfferForm from "./components/UnifiedOfferForm";
import "./assets/style.css";

function App() {
  return (
    <div id="root">
      <UnifiedOfferForm />
    </div>
  );
}

useEffect(() => {
  const hash = window.location.hash;
  if (hash) {
    const params = new URLSearchParams(hash.substring(1));
    const token = params.get('token');
    if (token) {
      localStorage.setItem('trello_token', token);
      window.location.hash = '';
    }
  }
}, []);


export default App;

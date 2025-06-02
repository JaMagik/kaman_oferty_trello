import { useEffect } from "react";
export default function StartAuth() {
  useEffect(() => {
    window.location.href = "/api/start";
  }, []);
  return <div>Trwa przekierowanie do autoryzacji Trello...</div>;
}

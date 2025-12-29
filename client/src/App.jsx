import { useEffect, useState } from "react";
import { useEffect, useState } from "react";
import { apiFetch } from "./api/http";

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/api/health")
      .then(res => res.json())
      .then(data => setData(data));
  }, []);

  return (
    <div>
      <h1>FE ↔ BE DEV CONNECT</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}


//call api da bao ve
function App() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    apiFetch("/api/profile")
      .then(res => res.json())
      .then(setProfile);
  }, []);

  return (
    <pre>{JSON.stringify(profile, null, 2)}</pre>
  );
}

export default App;

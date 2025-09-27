import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import GlobalStats from "./components/GlobalStats";
import GamesList from "./components/GamesList";
import Ranking from "./components/Ranking";
import QuestionsList from "./components/QuestionsList";
import CategoriesStats from "./components/CategoriesStats";

function App() {
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    const socket = io("http://localhost:4000");

    // 📡 evento en tiempo real
    socket.on("statsUpdated", (stats) => {
      console.log("📡 statsUpdated recibido desde backend:", stats);
      setRefresh((prev) => prev + 1); // 🔄 refresca todo
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "10px" }}>🎮 Dashboard Web</h1>

      <button
        onClick={() => setRefresh((prev) => prev + 1)}
        style={{
          marginBottom: "20px",
          padding: "10px 20px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        🔄 Actualizar Dashboard
      </button>

      {/* Secciones del Dashboard */}
      <GlobalStats refresh={refresh} />
      <CategoriesStats refresh={refresh} /> {/* 👈 ahora escucha refresh */}
      <GamesList refresh={refresh} />
      <Ranking refresh={refresh} />
      <QuestionsList refresh={refresh} />
    </div>
  );
}

export default App;

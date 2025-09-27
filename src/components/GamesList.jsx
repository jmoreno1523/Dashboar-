// src/components/GamesList.jsx
import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:4000"); // ⚠️ Cambia si usas otro host/puerto

export default function GamesList({ refresh }) {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🚀 1. Función para pedir partidas activas al backend
  const fetchGames = () => {
    setLoading(true);
    fetch("http://localhost:4000/api/stats/active") // ✅ endpoint correcto
      .then((res) => {
        if (!res.ok) throw new Error("Error al cargar partidas activas");
        return res.json();
      })
      .then((data) => {
        setGames(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  };

  // 🚀 2. Cargar al inicio y cada vez que cambie refresh
  useEffect(() => {
    fetchGames();
  }, [refresh]);

  // 🚀 3. Escuchar cambios en tiempo real desde el backend
  useEffect(() => {
    socket.on("statsUpdated", () => {
      fetchGames();
    });

    return () => {
      socket.off("statsUpdated");
    };
  }, []);

  // 🚀 4. Renderizado condicional
  if (loading) return <p>Cargando partidas...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div
      style={{
        border: "1px solid gray",
        padding: "20px",
        borderRadius: "10px",
        marginTop: "20px",
      }}
    >
      <h2>🎮 Partidas Activas</h2>
      {games.length === 0 ? (
        <p>No hay partidas activas en este momento</p>
      ) : (
        <ul>
          {games.map((game) => (
            <li key={game._id} style={{ margin: "10px 0" }}>
              <strong>ID:</strong> {game._id} <br />
              <strong>Jugadores conectados:</strong>{" "}
              {game.players?.length || 0}
              <br />
              {/* 🔹 Lista de jugadores */}
              {game.players?.length > 0 && (
                <ul style={{ marginLeft: "20px" }}>
                  {game.players.map((p, idx) => (
                    <li key={`${game._id}-player-${idx}`}>
                      {p.name || "Jugador sin nombre"}{" "}
                      {p.status === "eliminated" ? "❌" : "✅"}
                    </li>
                  ))}
                </ul>
              )}
              <strong>Estado:</strong> {game.status}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

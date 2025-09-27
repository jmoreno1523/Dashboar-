import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:4000"); // ⚠️ ajusta si usas otro host/puerto

export default function GlobalStats({ refresh }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🚀 1. Función para pedir estadísticas al backend
  const fetchStats = () => {
    setLoading(true);
    fetch("http://localhost:4000/api/stats") // ✅ endpoint correcto
      .then((res) => {
        if (!res.ok) {
          throw new Error("Error al cargar estadísticas");
        }
        return res.json();
      })
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  };

  // 🚀 2. Llamada inicial y cada vez que cambie refresh
  useEffect(() => {
    fetchStats();
  }, [refresh]);

  // 🚀 3. Escuchar eventos de socket.io en tiempo real
  useEffect(() => {
    socket.on("statsUpdated", () => {
      fetchStats();
    });

    return () => {
      socket.off("statsUpdated");
    };
  }, []);

  // 🚀 4. Renderizado condicional
  if (loading) return <p>Cargando estadísticas...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div
      style={{
        border: "1px solid gray",
        padding: "20px",
        borderRadius: "10px",
      }}
    >
      <h2>📊 Estadísticas Globales</h2>
      <p>Partidas jugadas: {stats.totalGames}</p>
      <p>Usuarios registrados: {stats.totalUsers}</p>
      <p>Ganadores: {stats.totalWinners}</p>

      {/* ✅ Categoría más acertada */}
      {stats.bestCategory ? (
        <p>
          Categoría más acertada:{" "}
          <strong>{stats.bestCategory.name}</strong> 🎯 (
          {(stats.bestCategory.accuracy * 100).toFixed(1)}%)
        </p>
      ) : (
        <p>No hay datos de categorías aún</p>
      )}

      {/* ✅ Resumen de categorías jugadas */}
      {stats.categories && stats.categories.length > 0 && (
        <div style={{ marginTop: "15px" }}>
          <h3>📂 Categorías jugadas</h3>
          <ul>
            {stats.categories.map((cat) => (
              <li key={cat._id}>
                {cat._id} → {cat.totalGames} partidas
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:4000"); // ⚠️ ajusta la URL de tu backend si es diferente

export default function Ranking({ refresh }) {
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🚀 1. Función para cargar ranking desde backend
  const fetchRanking = () => {
    setLoading(true);
    fetch("http://localhost:4000/api/stats/ranking") // ✅ endpoint correcto
      .then((res) => {
        if (!res.ok) throw new Error("Error al cargar ranking");
        return res.json();
      })
      .then((data) => {
        setRanking(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  };

  // 🚀 2. Cargar ranking inicial y cada vez que cambie refresh
  useEffect(() => {
    fetchRanking();
  }, [refresh]);

  // 🚀 3. Escuchar actualizaciones en tiempo real desde socket.io
  useEffect(() => {
    socket.on("statsUpdated", () => {
      // cuando se emite statsUpdated, volvemos a pedir el ranking
      fetchRanking();
    });

    return () => {
      socket.off("statsUpdated");
    };
  }, []);

  // 🚀 4. Renderizado condicional
  if (loading) return <p>Cargando ranking...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!ranking.length) return <p>No hay ranking disponible</p>;

  return (
    <div
      style={{
        border: "1px solid gray",
        padding: "20px",
        borderRadius: "10px",
        marginTop: "20px",
      }}
    >
      <h2>🏆 Ranking de Ganadores</h2>
      <table
        border="1"
        cellPadding="8"
        style={{
          marginTop: "10px",
          width: "100%",
          textAlign: "center",
          borderCollapse: "collapse",
        }}
      >
        <thead style={{ background: "#f5f5f5" }}>
          <tr>
            <th>#</th>
            <th>Jugador</th>
            <th>Victorias</th>
          </tr>
        </thead>
        <tbody>
          {ranking.map((player, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{player.username}</td>
              <td>{player.victories}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

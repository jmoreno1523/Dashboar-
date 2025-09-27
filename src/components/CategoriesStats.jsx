import { useEffect, useState } from "react";
import Card from "./Card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// 📌 Diccionario de categorías con emojis
const categoryMap = {
  science: "🔬 Ciencia",
  geography: "🌍 Geografía",
  literature: "📚 Literatura",
  history: "🏛️ Historia",
  art: "🎨 Arte",
  religion: "🙏 Religión",
  cinema: "🎬 Cine",
  technology: "💻 Tecnología",
  culture: "🌐 Cultura",
  sports: "⚽ Deportes",
  general: "📦 General",
};

export default function CategoriesStats({ refresh }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = () => {
    setLoading(true);
    fetch("http://localhost:4000/api/stats/categories")
      .then((res) => {
        if (!res.ok) throw new Error("Error al cargar categorías");
        return res.json();
      })
      .then((data) => {
        console.log("📂 Datos recibidos en CategoriesStats:", data);

        if (Array.isArray(data)) {
          setCategories(data);
        } else if (data.data && Array.isArray(data.data)) {
          setCategories(data.data);
        } else {
          console.warn("⚠️ Formato inesperado:", data);
          setCategories([]);
        }

        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  };

  // 🔄 cada vez que cambie refresh → vuelve a pedir datos
  useEffect(() => {
    fetchCategories();
  }, [refresh]);

  // 🛠️ Función para formatear nombre de categoría
  const formatCategory = (name) => {
    if (!name) return "❓ Desconocida";
    const key = name.trim().toLowerCase();
    return categoryMap[key] || name;
  };

  // 📊 Preparar datos para la gráfica
  const chartData = categories.map((cat) => ({
    name: formatCategory(cat.category),
    Partidas: cat.totalGames,
    Ganadores: cat.totalWinners,
  }));

  return (
    <Card title="📂 Estadísticas por Categoría">
      {loading && <p>Cargando categorías...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {!loading && !error && (
        <>
          {categories.length === 0 ? (
            <p>No hay categorías registradas</p>
          ) : (
            <>
              {/* 📋 Lista textual */}
              <ul>
                {categories.map((cat, index) => (
                  <li key={index}>
                    <strong>{formatCategory(cat.category)}</strong> → Partidas:{" "}
                    {cat.totalGames}, Ganadores: {cat.totalWinners}
                  </li>
                ))}
              </ul>

              {/* 📊 Gráfico de barras */}
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Partidas" fill="#8884d8" />
                  <Bar dataKey="Ganadores" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </>
          )}
        </>
      )}
    </Card>
  );
}

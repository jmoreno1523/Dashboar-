// src/components/QuestionsList.jsx
import { useEffect, useState } from "react";

export default function QuestionsList() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:4000/api/questions")
      .then((res) => {
        if (!res.ok) throw new Error("Error al cargar preguntas");
        return res.json();
      })
      .then((data) => {
        setQuestions(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Cargando preguntas...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div style={{ marginTop: "20px" }}>
      <h2 style={{ fontSize: "28px", fontWeight: "bold", display: "flex", alignItems: "center" }}>
        <span style={{ marginRight: "10px" }}>📋</span> Lista de Preguntas
      </h2>
      <ol>
        {questions.map((q, index) => (
          <li key={q._id} style={{ marginBottom: "20px" }}>
            <p style={{ fontWeight: "bold", fontSize: "18px" }}>
              {index + 1}. {q.text}
            </p>
            <ul>
              {q.options.map((opt, i) => (
                <li
                  key={i}
                  style={{
                    color: i === q.correctIndex ? "green" : "black",
                    fontWeight: i === q.correctIndex ? "bold" : "normal",
                  }}
                >
                  {opt}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </div>
  );
}


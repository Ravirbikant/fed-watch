import { useState, useEffect, useMemo } from "react";
import rawData from "./data/Sample-data.json";
import { normalizeData } from "./utils/normalize.js";
import "./App.css";

const baseData = normalizeData(rawData);
const inflationEntries = baseData.filter((d) => d.category === "Inflation");

function isInflationSpike(entry) {
  if (entry.category !== "Inflation") return false;
  const idx = inflationEntries.findIndex((d) => d.id === entry.id);
  if (idx === 0) return false;
  const prev = inflationEntries[idx - 1];
  return ((entry.value - prev.value) / prev.value) * 100 > 5;
}

function App() {
  const [data, setData] = useState(baseData);
  const [search, setSearch] = useState("");
  const [highlightInflation, setHighlightInflation] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const base = baseData[Math.floor(Math.random() * baseData.length)];
      const newEntry = {
        ...base,
        id: Date.now(),
        value: base.value * (1 + (Math.random() * 0.1 - 0.05)),
        timestamp: new Date(),
      };
      setData((prev) => [newEntry, ...prev.slice(0, 49)]);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const filtered = useMemo(() =>
    data.filter((d) => d.source.includes(search.toUpperCase())),
    [data, search]
  );

  return (
    <div className="container">
      <h1 className="header">FED WATCH</h1>
      <div className="controls">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by source..."
        />
        <button
          className={highlightInflation ? "active" : ""}
          onClick={() => setHighlightInflation((p) => !p)}
        >
          Toggle Inflation Highlight
        </button>
      </div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>SOURCE</th>
            <th>CATEGORY</th>
            <th>VALUE</th>
            <th>TIMESTAMP</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((entry) => (
            <tr
              key={entry.id}
              className={highlightInflation && isInflationSpike(entry) ? "spike" : ""}
            >
              <td>{entry.id}</td>
              <td>{entry.source}</td>
              <td>{entry.category}</td>
              <td>{entry.value}</td>
              <td>{entry.timestamp.toISOString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
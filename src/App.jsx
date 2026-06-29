import { useState, useEffect, useMemo, memo } from "react";
import rawData from "./data/Sample-data.json";
import { normalizeData } from "./utils/normalize.js";
import "./App.css";

const baseData = normalizeData(rawData);

function isInflationSpike(entry, inflationEntries) {
  if (entry.category !== "Inflation") return false;
  const idx = inflationEntries.findIndex((d) => d.id === entry.id);
  if (idx <= 0) return false;
  const prev = inflationEntries[idx - 1];
  return ((entry.value - prev.value) / prev.value) * 100 > 5;
}

function getSignal(entry, inflationEntries) {
  if (entry.category === "Inflation" && isInflationSpike(entry, inflationEntries)) return "BAD";
  if (entry.category === "Employment" && entry.value > 400000) return "GOOD";
  if (entry.category === "Rates" && entry.value > 6) return "BAD";
  return "NEUTRAL";
}

const FeedRow = memo(({ entry, inflationEntries, highlightInflation }) => {
  const signal = getSignal(entry, inflationEntries);
  return (
    <tr className={highlightInflation && isInflationSpike(entry, inflationEntries) ? "spike" : ""}>
      <td>{entry.id}</td>
      <td>{entry.source}</td>
      <td>{entry.category}</td>
      <td>{entry.value.toLocaleString()}</td>
      <td>{entry.timestamp.toISOString()}</td>
      <td>
        <span className={`badge badge-${signal.toLowerCase()}`}>{signal}</span>
      </td>
    </tr>
  );
});

function App() {
  const [data, setData] = useState(baseData);
  const [search, setSearch] = useState("");
  const [highlightInflation, setHighlightInflation] = useState(false);
  const [tick, setTick] = useState(false);

  const inflationEntries = useMemo(
    () => data.filter((d) => d.category === "Inflation"),
    [data]
  );

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
      setTick((t) => !t);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const filtered = useMemo(
    () => data.filter((d) => d.source.includes(search.toUpperCase())),
    [data, search]
  );

  return (
    <div className="container">
      <div className="header-bar">
        <div className="header-left">
          <span className={`pulse ${tick ? "pulse-on" : ""}`} />
          <h1 className="header">FED WATCH</h1>
        </div>
        <span className="live-label">LIVE</span>
      </div>
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
            <th>SIGNAL</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((entry) => (
            <FeedRow
              key={entry.id}
              entry={entry}
              inflationEntries={inflationEntries}
              highlightInflation={highlightInflation}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
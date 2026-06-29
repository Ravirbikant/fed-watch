function parseTimestamp(ts) {
  if (typeof ts === "number") return new Date(ts * 1000);
  return new Date(ts);
}

function parseValue(value) {
  if (typeof value === "number") return value;
  const cleaned = String(value).replace(/[$,]/g, "");
  if (cleaned.endsWith("B")) return parseFloat(cleaned) * 1e9;
  if (cleaned.endsWith("M")) return parseFloat(cleaned) * 1e6;
  if (cleaned.endsWith("%")) return parseFloat(cleaned);
  return parseFloat(cleaned);
}

export function normalizeData(raw) {
  return raw.map((entry) => ({
    ...entry,
    source: entry.source.toUpperCase(),
    value: parseValue(entry.value),
    timestamp: parseTimestamp(entry.timestamp),
  }));
}
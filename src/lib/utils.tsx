import React from "react";

export function highlightMatch(
  text: string,
  query: string
): React.ReactNode {
  const q = query.trim().toLowerCase();
  if (!q) return text;
  
  const idx = text.toLowerCase().indexOf(q);
  if (idx === -1) return text;

  return (
    <>
      {text.slice(0, idx)}
      <mark>{text.slice(idx, idx + q.length)}</mark>
      {text.slice(idx + q.length)}
    </>
  );
}

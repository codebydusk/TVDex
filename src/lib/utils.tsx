import React from "react";

export function highlightMatch(
  text: string,
  query: string
): React.ReactNode {
  if (!query) return text;
  const q = query.toLowerCase();
  const idx = text.toLowerCase().indexOf(q);
  if (idx === -1) return text;

  return (
    <>
      {text.slice(0, idx)}
      <mark>{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  );
}

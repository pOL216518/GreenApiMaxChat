import styles from './Avatar.module.css';

const PALETTE = ['#4f6bff', '#8b4dff', '#00a3ff', '#ff6b6b', '#ff9f1c', '#2fa36b', '#e056fd'];

function colorFor(title: string): string {
  let hash = 0;
  for (const char of title) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return PALETTE[hash % PALETTE.length] ?? PALETTE[0] ?? '#4f6bff';
}

function initialsFor(title: string): string {
  const letters = title.replace(/[^\p{L}\p{N}\s]/gu, '').trim();
  const words = letters.split(/\s+/).filter(Boolean);
  if (words.length >= 2) return `${words[0]?.[0] ?? ''}${words[1]?.[0] ?? ''}`.toUpperCase();
  return letters.slice(0, 2).toUpperCase() || '?';
}

export function Avatar({ title }: { title: string }) {
  return (
    <span className={styles.avatar} style={{ background: colorFor(title) }} aria-hidden>
      {initialsFor(title)}
    </span>
  );
}

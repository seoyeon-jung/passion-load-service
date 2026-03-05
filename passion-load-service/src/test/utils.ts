export const uuid = (n = 1) =>
  `${String(n).padStart(8, '0')}-1111-1111-1111-111111111111`;

export const iso = (s: string) => new Date(s).toISOString();

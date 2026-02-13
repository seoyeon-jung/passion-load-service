export const toYyyyMmDd = (date: Date): string => date.toISOString().slice(0, 10);
export const fromYyyyMmDd = (date: string): Date => new Date(`${date}T00:00:00.000Z`);
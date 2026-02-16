import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import utc from 'dayjs/plugin/utc';

dayjs.extend(customParseFormat);
dayjs.extend(utc);

// yyy-mm-dd 문자열 => Date
export function fromYyyyMmDd(input: string): Date {
  const d = dayjs.utc(input, 'YYYY-MM-DD', true);
  if (!d.isValid()) {
    throw new Error(`Invalid date format (expected YYYY-MM-DD): ${input}`);
  }
  return d.toDate();
}

// Date => yyy-mm-dd 문자열
export function toYyyyMmDd(date: Date): string {
  return dayjs.utc(date).format('YYYY-MM-DD');
}
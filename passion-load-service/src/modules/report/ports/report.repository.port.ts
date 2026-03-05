import { Report, ReportStatus } from '../domain/report.model';

export type CreateReportInput = {
  id: string;
  orgId: string;
  studentId: string;
  sessionId: string | null;

  fromAt: Date;
  toAt: Date;

  summary: string;
  analysis: unknown | null;
};

export type SaveReportResultInput = {
  orgId: string;
  id: string;

  resultUrl: string | null;
  fileId: string | null;
};

export type MarkReportSentInput = {
  orgId: string;
  id: string;
  sentAt: Date;
};

export type ListReportsQuery = {
  orgId: string;

  studentId?: string;
  sessionId?: string;
  status?: ReportStatus;

  fromAt?: Date;
  toAt?: Date;
};

export interface ReportRepositoryPort {
  create(input: CreateReportInput): Promise<Report>;
  findById(id: string): Promise<Report | null>;
  list(query: ListReportsQuery): Promise<Report[]>;
  saveResult(input: SaveReportResultInput): Promise<Report>;
  markSent(input: MarkReportSentInput): Promise<Report>;
}

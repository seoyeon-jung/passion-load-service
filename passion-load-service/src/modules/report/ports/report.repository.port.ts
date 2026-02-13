import { Report } from "../report.model";

export type CreateReportInput = {
    id: string;
    orgId: string;
    studentId: string;
    sessionId?: string | null;

    summary: string;
    analysis?: unknown | null;
}

export type ReportQuery = {
  orgId: string;
  studentId?: string;
  sessionId?: string;
};

export interface ReportRepositoryPort {
    create(input: CreateReportInput): Promise<Report>;
    list(filter: ReportQuery): Promise<Report[]>;
    findById(id: string): Promise<Report | null>;
}
export type ReportStatus = 'REQUESTED' | 'GENERATED' | 'SENT';

export type Report = {
  id: string;
  orgId: string;
  studentId: string;
  sessionId?: string;

  fromAt: Date;
  toAt: Date;

  resultUrl?: string;
  fileId?: string;

  status: ReportStatus;
  sentAt?: Date;

  summary: string;
  analysis?: unknown; // AI 분석 결과(JSON)

  createdAt: Date;
  updatedAt: Date;
};

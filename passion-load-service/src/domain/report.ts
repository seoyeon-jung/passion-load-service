export type Report = {
    id: string;
    orgId: string;
    studentId: string;
    sessionId?: string;

    summary: string;
    analysis?: unknown; // AI 분석 결과(JSON)

    createdAt: Date;
}
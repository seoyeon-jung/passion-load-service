/* 학생 제출 */

import { SubmissionStatus } from "@prisma/client";

export type Submission = {
    id: string;
    orgId: string;
    assignmentId: string;
    studentId: string;

    content?: string; // 자소서, 계획표 내용 등
    payload?: unknown; // AI 결과, JSON

    status: SubmissionStatus;

    createdAt: Date;
    updatedAt: Date;
}
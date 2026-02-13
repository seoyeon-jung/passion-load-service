import { AssignmentType } from "../../common/types/enums";

// 공통 필드
export type AssignmentBase = {
  id: string;
  orgId: string;

  studentId: string;

  assignmentDate: string; // yyyy-mm-dd

  type: AssignmentType;

  createdAt: Date;
  updatedAt: Date;
};

/**
 * TASK (과제)
 * 반드시 sesionId 가 있어야 함
 * 하루에 여러개 가능하므로 콘텐츠가 필요
 */
export type TaskAssignment = AssignmentBase & {
  type: AssignmentType.TASK;
  sessionId: string;

  title: string;
  description?: string;

  dueAt?: Date; // 제출 마감이 있는 경우

  incompletionReason?: string; // 미완료 사유
};

/**
 * DAILY_CHECK (점검)
 * sessionId X
 */
export type DailyCheckAssignment = AssignmentBase & {
  type: AssignmentType.DAILY_CHECK;

  sessionId?: never;

  checked: boolean;
  contactMade: boolean;
  memo?: string;
};

export type DailyAssignment = TaskAssignment | DailyCheckAssignment;

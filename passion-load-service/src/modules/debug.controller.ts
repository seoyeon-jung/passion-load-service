import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Query,
} from '@nestjs/common';

import {
  SESSION_REPOSITORY,
  ASSIGNMENT_REPOSITORY,
  SUBMISSION_REPOSITORY,
  FEEDBACK_REPOSITORY,
  REPORT_REPOSITORY,
} from './persistence.tokens';

import type { SessionRepositoryPort } from './session/ports/session.repository.port';
import type { AssignmentRepositoryPort } from './assignment/ports/assignment.repository.port';
import type { SubmissionRepositoryPort } from './submission/ports/submission.repository.port';
import type { FeedbackRepositoryPort } from './feedback/ports/feedback.repository.port';
import type { ReportRepositoryPort } from './report/ports/report.repository.port';

import { AssignmentType } from '@common/types/enums';

@Controller('/debug')
export class DebugController {
  constructor(
    @Inject(SESSION_REPOSITORY)
    private readonly sessions: SessionRepositoryPort,
    @Inject(ASSIGNMENT_REPOSITORY)
    private readonly assignments: AssignmentRepositoryPort,
    @Inject(SUBMISSION_REPOSITORY)
    private readonly submissions: SubmissionRepositoryPort,
    @Inject(FEEDBACK_REPOSITORY)
    private readonly feedbacks: FeedbackRepositoryPort,
    @Inject(REPORT_REPOSITORY) private readonly reports: ReportRepositoryPort
  ) {}

  // --- Session ---
  @Post('/sessions')
  createSession(@Body() body: any) {
    return this.sessions.create(body);
  }

  @Get('/sessions/:id')
  getSession(@Param('id') id: string) {
    return this.sessions.findById(id);
  }

  // --- Assignment (TASK) ---
  @Post('/assignments/task')
  createTask(@Body() body: any) {
    return this.assignments.createTask(body);
  }

  // --- Daily check upsert ---
  @Post('/assignments/daily-check')
  upsertDailyCheck(@Body() body: any) {
    return this.assignments.upsertDailyCheck(body);
  }

  @Get('/assignments')
  listAssignments(
    @Query('orgId') orgId: string,
    @Query('studentId') studentId?: string,
    @Query('sessionId') sessionId?: string,
    @Query('date') date?: string,
    @Query('type') type?: AssignmentType
  ) {
    return this.assignments.list({ orgId, studentId, sessionId, date, type });
  }

  // --- Submission ---
  @Post('/submissions/upsert')
  upsertSubmission(@Body() body: any) {
    return this.submissions.upsert(body);
  }

  // --- Feedback ---
  @Post('/feedbacks')
  createFeedback(@Body() body: any) {
    return this.feedbacks.create(body);
  }

  // --- Report ---
  @Post('/reports')
  createReport(@Body() body: any) {
    return this.reports.create(body);
  }

  @Get('/reports/:id')
  getReport(@Param('id') id: string) {
    return this.reports.findById(id);
  }
}

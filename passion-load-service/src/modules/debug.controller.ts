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
  SUBMISSION_REPOSITORY,
  FEEDBACK_REPOSITORY,
  REPORT_REPOSITORY,
  TASK_REPOSITORY,
  DAILY_CHECK_REPOSITORY,
} from './persistence.tokens';

import type { SessionRepositoryPort } from './session/ports/session.repository.port';
import type { SubmissionRepositoryPort } from './submission/ports/submission.repository.port';
import type { FeedbackRepositoryPort } from './feedback/ports/feedback.repository.port';
import type { ReportRepositoryPort } from './report/ports/report.repository.port';

import type {
  DailyCheckRepositoryPort,
  TaskRepositoryPort,
} from './assignment/ports/assignment.repository.port';

@Controller('/debug')
export class DebugController {
  constructor(
    @Inject(SESSION_REPOSITORY)
    private readonly sessions: SessionRepositoryPort,
    @Inject(TASK_REPOSITORY)
    private readonly tasks: TaskRepositoryPort,
    @Inject(DAILY_CHECK_REPOSITORY)
    private readonly dailyChecks: DailyCheckRepositoryPort,
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
    return this.tasks.createTask(body);
  }

  // --- Daily check upsert ---
  @Post('/assignments/daily-check')
  upsertDailyCheck(@Body() body: any) {
    return this.dailyChecks.upsertDailyCheck(body);
  }

  @Get('/assignments')
  listAssignments(
    @Query('orgId') orgId: string,
    @Query('studentId') studentId?: string,
    @Query('sessionId') sessionId?: string,
    @Query('date') date?: string,
    @Query('type') type?: 'TASK' | 'DAILY_CHECK'
  ) {
    if (type === 'DAILY_CHECK') {
      return this.dailyChecks.listDailyChecks({ orgId, studentId, date });
    }
    return this.tasks.listTasks({ orgId, studentId, sessionId, date });
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

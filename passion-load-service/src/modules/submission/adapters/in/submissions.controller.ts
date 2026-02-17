import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { RolesGuard } from '@common/guards/roles.guard';
import { SubmissionService } from '@modules/submission/submissions.service';
import { Roles } from '@common/decorators/roles.decorator';
import { OrgId } from '@common/decorators/org-id.decorator';
import { ListSubmissionQueryDto, UpsertSubmissionDto } from './submissions.dto';

@ApiTags('submissions')
@ApiSecurity('org')
@ApiSecurity('role')
@ApiSecurity('user')
@UseGuards(RolesGuard)
@Controller('/api/v1/passion-load/submissions')
export class SubmissionController {
  constructor(private readonly service: SubmissionService) {}

  @ApiOperation({ summary: 'Upsert submission' })
  @ApiCreatedResponse({ description: 'Upserted submission' })
  @ApiForbiddenResponse({ description: 'Need TEACHER/ADMIN' })
  @Roles('TEACHER', 'ADMIN')
  @Post()
  upsert(@OrgId() orgId: string, @Body() dto: UpsertSubmissionDto) {
    return this.service.upsert(orgId, dto);
  }

  @ApiOperation({
    summary: 'List submissions (filters: assignmentId | studentId | date)',
  })
  @ApiOkResponse({ description: 'Submission list' })
  @ApiBadRequestResponse({ description: 'At least one filter required' })
  @Roles('TEACHER', 'ADMIN')
  @Get()
  list(@OrgId() orgId: string, @Query() query: ListSubmissionQueryDto) {
    return this.service.list(orgId, query);
  }
}

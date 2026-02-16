import {
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { RolesGuard } from '@common/guards/roles.guard';
import { SubmissionService } from '@modules/submission/submissions.service';
import { Roles } from '@common/decorators/roles.decorator';
import { OrgId } from '@common/decorators/org-id.decorator';
import { UpsertSubmissionDto } from './submissions.dto';

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
}

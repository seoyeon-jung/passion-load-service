import { OrgId } from '@common/decorators/org-id.decorator';
import { Roles } from '@common/decorators/roles.decorator';
import { RolesGuard } from '@common/guards/roles.guard';
import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import {
  ListDailyChecksQueryDto,
  UpsertDailyCheckDto,
} from './daily-checks.dto';
import { DailyCheckService } from '@modules/assignment/daily-check.service';

@ApiTags('daily-checks')
@ApiSecurity('org')
@ApiSecurity('role')
@ApiSecurity('user')
@UseGuards(RolesGuard)
@Controller('/api/v1/passion-load/daily-checks')
export class DailyChecksController {
  constructor(private readonly service: DailyCheckService) {}

  @ApiOperation({ summary: 'Upsert DAILY_CHECK (studentId + date)' })
  @ApiCreatedResponse({ description: 'Upserted daily check' })
  @ApiBadRequestResponse({ description: 'Validation error' })
  @Roles('TEACHER', 'ADMIN')
  @Post()
  upsert(@OrgId() orgId: string, @Body() dto: UpsertDailyCheckDto) {
    return this.service.upsertDailyCheck(orgId, dto);
  }

  @ApiOperation({ summary: 'List DAILY_CHECK (filters: date | studentId)' })
  @ApiOkResponse({ description: 'Daily check list' })
  @ApiBadRequestResponse({ description: 'At least one filter required' })
  @Roles('TEACHER', 'ADMIN')
  @Get()
  list(@OrgId() orgId: string, @Query() query: ListDailyChecksQueryDto) {
    return this.service.listDailyChecks(orgId, query);
  }
}

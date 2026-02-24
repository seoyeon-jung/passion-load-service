import { OrgId } from "@common/decorators/org-id.decorator";
import { Roles } from "@common/decorators/roles.decorator";
import { RolesGuard } from "@common/guards/roles.guard";
import { AssignmentService } from "@modules/assignment/assignments.service";
import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { ApiBadRequestResponse, ApiCreatedResponse, ApiOperation, ApiSecurity, ApiTags } from "@nestjs/swagger";
import { UpsertDailyCheckDto } from "./daily-checks.dto";

@ApiTags('daily-checks')
@ApiSecurity('org')
@ApiSecurity('role')
@ApiSecurity('user')
@UseGuards(RolesGuard)
@Controller('/api/v1/passion-load/daily-checks')
export class DailyChecksController {
  constructor(private readonly service: AssignmentService) {}

  @ApiOperation({ summary: 'Upsert DAILY_CHECK (studentId + date)' })
  @ApiCreatedResponse({ description: 'Upserted daily check' })
  @ApiBadRequestResponse({ description: 'Validation error' })
  @Roles('TEACHER', 'ADMIN')
  @Post()
  upsert(@OrgId() orgId: string, @Body() dto: UpsertDailyCheckDto) {
    return this.service.upsertDailyCheck(orgId, dto);
  }
}
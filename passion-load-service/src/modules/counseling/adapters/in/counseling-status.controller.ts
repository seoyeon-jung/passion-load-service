import { OrgId } from '@common/decorators/org-id.decorator';
import { Roles } from '@common/decorators/roles.decorator';
import { RolesGuard } from '@common/guards/roles.guard';
import { CounselingService } from '@modules/counseling/counseling.service';
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { CounselingStatusQueryDto } from './counseling.dto';

@ApiTags('counseling-status')
@ApiSecurity('org')
@ApiSecurity('role')
@ApiSecurity('user')
@UseGuards(RolesGuard)
@Controller('/api/v1/passion-load/counseling-status')
export class CounselingStatusController {
  constructor(private readonly service: CounselingService) {}

  @ApiOperation({
    summary: 'Counseling status (LMS proxy: students + questions)',
  })
  @ApiOkResponse({ description: 'Counseling status list' })
  @Roles('TEACHER', 'ADMIN')
  @Get()
  list(@OrgId() orgId: string, @Query() query: CounselingStatusQueryDto) {
    return this.service.getStatus(orgId, query.studentId);
  }
}

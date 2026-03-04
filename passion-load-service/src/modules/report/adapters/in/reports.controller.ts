import { OrgId } from '@common/decorators/org-id.decorator';
import { Roles } from '@common/decorators/roles.decorator';
import { RolesGuard } from '@common/guards/roles.guard';
import { ReportsService } from '@modules/report/reports.service';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import {
  CreateReportDto,
  ListReportsQueryDto,
  SaveReportResultDto,
} from './reports.dto';

@ApiTags('reports')
@ApiSecurity('org')
@ApiSecurity('role')
@ApiSecurity('user')
@UseGuards(RolesGuard)
@Controller('/api/v1/passion-load/reports')
export class ReportsController {
  constructor(private readonly service: ReportsService) {}

  @ApiOperation({ summary: 'Create report request' })
  @ApiCreatedResponse({ description: 'Created report' })
  @ApiBadRequestResponse({ description: 'Validation error' })
  @ApiForbiddenResponse({ description: 'Need TEACHER/ADMIN' })
  @Roles('TEACHER', 'ADMIN')
  @Post()
  create(@OrgId() orgId: string, @Body() dto: CreateReportDto) {
    return this.service.create(orgId, dto);
  }

  @ApiOperation({ summary: 'Get report by id' })
  @ApiParam({ name: 'id' })
  @ApiOkResponse({ description: 'Report' })
  @ApiForbiddenResponse({ description: 'Need TEACHER/ADMIN' })
  @Roles('TEACHER', 'ADMIN')
  @Get('/:id')
  get(@OrgId() orgId: string, @Param('id') id: string) {
    return this.service.get(orgId, id);
  }

  @ApiOperation({ summary: 'List reports (period overlap)' })
  @ApiOkResponse({ description: 'Report list' })
  @ApiBadRequestResponse({ description: 'At least one filter required' })
  @ApiForbiddenResponse({ description: 'Need TEACHER/ADMIN' })
  @Roles('TEACHER', 'ADMIN')
  @Get()
  list(@OrgId() orgId: string, @Query() query: ListReportsQueryDto) {
    return this.service.list(orgId, query);
  }

  @ApiOperation({ summary: 'Save report result (url/fileId)' })
  @ApiParam({ name: 'id' })
  @ApiOkResponse({ description: 'Updated report' })
  @ApiBadRequestResponse({ description: 'resultUrl or fileId required' })
  @ApiForbiddenResponse({ description: 'Need TEACHER/ADMIN' })
  @Roles('TEACHER', 'ADMIN')
  @Patch('/:id/result')
  saveResult(
    @OrgId() orgId: string,
    @Param('id') id: string,
    @Body() dto: SaveReportResultDto
  ) {
    return this.service.saveResult(orgId, id, dto);
  }

  @ApiOperation({ summary: 'Send report (trigger)' })
  @ApiParam({ name: 'id' })
  @ApiOkResponse({ description: 'Sent report' })
  @ApiForbiddenResponse({ description: 'Need TEACHER/ADMIN' })
  @Roles('TEACHER', 'ADMIN')
  @Post('/:id/send')
  send(@OrgId() orgId: string, @Param('id') id: string) {
    return this.service.send(orgId, id);
  }
}

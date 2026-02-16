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

import { OrgId } from '@common/decorators/org-id.decorator';
import { Roles } from '@common/decorators/roles.decorator';
import { RolesGuard } from '@common/guards/roles.guard';

import {
  CreateTaskAssignmentDto,
  ListTaskAssignmentsQueryDto,
  UpdateTaskAssignmentDto,
} from './assignments.dto';
import { AssignmentService } from '@modules/assignment/assignments.service';

@ApiTags('assignments')
@ApiSecurity('org')
@ApiSecurity('role')
@ApiSecurity('user')
@UseGuards(RolesGuard)
@Controller('/api/v1/passion-load/assignments')
export class AssignmentsController {
  constructor(private readonly service: AssignmentService) {}

  @ApiOperation({ summary: 'Create TASK assignment' })
  @ApiCreatedResponse({ description: 'Created TASK assignment' })
  @ApiForbiddenResponse({ description: 'Need TEACHER/ADMIN' })
  @ApiBadRequestResponse({ description: 'Validation error / session mismatch' })
  @Roles('TEACHER', 'ADMIN')
  @Post()
  createTask(@OrgId() orgId: string, @Body() dto: CreateTaskAssignmentDto) {
    return this.service.createTask(orgId, dto);
  }

  @ApiOperation({ summary: 'Get TASK assignment by id' })
  @ApiParam({ name: 'id', description: 'Assignment UUID' })
  @ApiOkResponse({ description: 'TASK assignment' })
  @Get('/:id')
  get(@OrgId() orgId: string, @Param('id') id: string) {
    return this.service.getTask(orgId, id);
  }

  @ApiOperation({
    summary: 'List TASK assignments (org scope, optional filters)',
  })
  @ApiOkResponse({ description: 'TASK assignment list' })
  @Get()
  list(@OrgId() orgId: string, @Query() query: ListTaskAssignmentsQueryDto) {
    return this.service.listTasks(orgId, query);
  }

  @ApiOperation({ summary: 'Update TASK assignment' })
  @ApiParam({ name: 'id', description: 'Assignment UUID' })
  @ApiOkResponse({ description: 'Updated TASK assignment' })
  @ApiForbiddenResponse({ description: 'Need TEACHER/ADMIN' })
  @Roles('TEACHER', 'ADMIN')
  @Patch('/:id')
  update(
    @OrgId() orgId: string,
    @Param('id') id: string,
    @Body() dto: UpdateTaskAssignmentDto
  ) {
    return this.service.updateTask(orgId, id, dto);
  }
}

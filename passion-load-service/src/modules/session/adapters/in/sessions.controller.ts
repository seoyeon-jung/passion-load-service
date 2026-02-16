import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { SessionService } from '../../session.service';
import { OrgId } from '@common/decorators/org-id.decorator';
import {
  CreateSessionDto,
  UpdateSessionDto,
  UpdateSessionStatusDto,
} from './sessions.dto';
import { RolesGuard } from '@common/guards/roles.guard';
import { Roles } from '@common/decorators//roles.decorator';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiSecurity,
} from '@nestjs/swagger';
import { SessionResponseDto } from './sessions.response.dto';

@ApiTags('sessions')
@ApiSecurity('org')
@ApiSecurity('role')
@ApiSecurity('user')
@UseGuards(RolesGuard)
@Controller('/api/v1/passion-load/sessions')
export class SessionsController {
  constructor(private readonly service: SessionService) {}

  @ApiOperation({ summary: 'Create session' })
  @ApiCreatedResponse({
    description: 'Created session',
    type: SessionResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Validation error (date format etc.)' })
  @ApiForbiddenResponse({ description: 'Need TEACHER/ADMIN' })
  @Roles('TEACHER', 'ADMIN')
  @Post()
  create(@OrgId() orgId: string, @Body() dto: CreateSessionDto) {
    return this.service.create(orgId, dto);
  }

  @ApiOperation({ summary: 'Get session by id' })
  @ApiParam({ name: 'id', description: 'Session UUID' })
  @ApiOkResponse({ description: 'Session', type: SessionResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid UUID / bad request' })
  @Get('/:id')
  get(@OrgId() orgId: string, @Param('id') id: string) {
    return this.service.get(orgId, id);
  }

  @ApiOperation({ summary: 'List sessions by organization' })
  @ApiOkResponse({ description: 'Session list', type: [SessionResponseDto] })
  @Get()
  list(@OrgId() orgId: string) {
    return this.service.list(orgId);
  }

  @ApiOperation({ summary: 'Update session (title/date)' })
  @ApiParam({ name: 'id', description: 'Session UUID' })
  @ApiOkResponse({ description: 'Updated session', type: SessionResponseDto })
  @ApiBadRequestResponse({ description: 'Validation error (date format etc.)' })
  @ApiForbiddenResponse({ description: 'Need TEACHER/ADMIN' })
  @Roles('TEACHER', 'ADMIN')
  @Patch('/:id')
  update(
    @OrgId() orgId: string,
    @Param('id') id: string,
    @Body() dto: UpdateSessionDto
  ) {
    return this.service.update(orgId, id, dto);
  }

  @ApiOperation({
    summary: 'Update session status (PLANNED -> ACTIVE -> DONE)',
  })
  @ApiParam({ name: 'id', description: 'Session UUID' })
  @ApiOkResponse({ description: 'Updated session', type: SessionResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid status transition' })
  @ApiForbiddenResponse({ description: 'Need TEACHER/ADMIN' })
  @Roles('TEACHER', 'ADMIN')
  @Patch('/:id/status')
  updateStatus(
    @OrgId() orgId: string,
    @Param('id') id: string,
    @Body() dto: UpdateSessionStatusDto
  ) {
    return this.service.updateStatus(orgId, id, dto.status);
  }
}

import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { OrgId } from '@common/decorators/org-id.decorator';
import { Roles } from '@common/decorators/roles.decorator';
import { RolesGuard } from '@common/guards/roles.guard';
import { StudentNoteService } from '@modules/student-note/student-note.service';
import {
  UpsertStudentNoteDto,
  ListStudentNoteQueryDto,
} from './student-note.dto';

@ApiTags('student-notes')
@ApiSecurity('org')
@ApiSecurity('role')
@ApiSecurity('user')
@UseGuards(RolesGuard)
@Controller('/api/v1/passion-load/student-notes')
export class StudentNoteController {
  constructor(private readonly service: StudentNoteService) {}

  @ApiOperation({ summary: '학생 톡 기록 저장 (날짜+학생 기준 upsert)' })
  @ApiCreatedResponse({ description: 'Upserted student note' })
  @ApiBadRequestResponse({ description: 'Validation error' })
  @Roles('TEACHER', 'ADMIN')
  @Post()
  upsert(@OrgId() orgId: string, @Body() dto: UpsertStudentNoteDto) {
    return this.service.upsert(orgId, dto);
  }

  @ApiOperation({
    summary: '학생 톡 기록 조회 (studentId 또는 date 필터 필수)',
  })
  @ApiOkResponse({ description: 'Student note list' })
  @ApiBadRequestResponse({ description: 'At least one filter required' })
  @Roles('TEACHER', 'ADMIN')
  @Get()
  list(@OrgId() orgId: string, @Query() query: ListStudentNoteQueryDto) {
    return this.service.list(orgId, query);
  }
}

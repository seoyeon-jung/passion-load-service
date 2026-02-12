// 테스트용 엔드포인트 [추후 삭제 예정]

import { Controller, Get, Inject, Param } from '@nestjs/common';
import type { LmsClient } from './common/clients/lms/lms.client';
import { LMS_CLIENT } from './common/clients/lms/lms.token';

@Controller('lms')
export class LmsDebugController {
  constructor(@Inject(LMS_CLIENT) private readonly lms: LmsClient) {}

  @Get(':orgId/teachers')
  getTeachers(@Param('orgId') orgId: string) {
    return this.lms.getTeachersByOrganization(orgId);
  }

  @Get(':orgId/students')
  getStudents(@Param('orgId') orgId: string) {
    return this.lms.getStudentsByOrganization(orgId);
  }
}

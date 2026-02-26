import { Module } from '@nestjs/common';
import { LmsHttpAdapter } from './lms.http.adapter';
import { LMS_CLIENT } from './lms.token';
import { LmsMockAdapter } from './lms.mock.adapter';

@Module({
  providers: [
    {
      provide: LMS_CLIENT,
      useClass: process.env.LMS_MOCK === 'true' ? LmsMockAdapter : LmsHttpAdapter,
    },
  ],
  exports: [LMS_CLIENT],
})
export class LmsModule {}

import { Module } from '@nestjs/common';
import { LmsHttpAdapter } from './lms.http.adapter';
import { LMS_CLIENT } from './lms.token';

@Module({
  providers: [
    {
      provide: LMS_CLIENT,
      useClass: LmsHttpAdapter,
    },
  ],
  exports: [LMS_CLIENT],
})
export class LmsModule {}

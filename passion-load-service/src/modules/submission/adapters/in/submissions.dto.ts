import { SubmissionStatus } from '@common/types/enums';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  ValidateIf,
} from 'class-validator';

export class UpsertSubmissionDto {
  @ApiProperty({ example: 'b7e61e3c-8c2e-4c9e-9e1e-123456789abc' })
  @IsUUID()
  assignmentId!: string;

  @ApiProperty({ example: 'LMS_STUDENT_0001' })
  @IsString()
  @MaxLength(100)
  studentId!: string;

  @ApiProperty({ enum: SubmissionStatus, example: SubmissionStatus.DONE })
  @IsEnum(SubmissionStatus)
  status!: SubmissionStatus;

  @ApiPropertyOptional({ example: '컨디션 난조' })
  @ValidateIf((o) => o.status === SubmissionStatus.HOLD)
  @IsString()
  @IsNotEmpty()
  reason?: string;

  @ApiPropertyOptional({ example: '2/20까지 보충 예정' })
  @IsOptional()
  @IsString()
  scheduleNote?: string;
}

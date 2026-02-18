import { SubmissionStatus } from '@common/types/enums';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
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

export class ListSubmissionQueryDto {
  @ApiPropertyOptional({ example: 'a09a4529-5e30-49b7-80c4-142313d8a2df' })
  @IsOptional()
  @IsUUID()
  assignmentId?: string;

  @ApiPropertyOptional({ example: 'LMS_STUDENT_0001' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  studentId?: string;

  @ApiPropertyOptional({ example: '2026-02-16' })
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  date?: string;
}

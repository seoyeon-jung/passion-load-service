import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DailyAssignmentStatus } from '@prisma/client';
import {
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
} from 'class-validator';

export class CreateTaskAssignmentDto {
  @ApiProperty({
    example: '64aedc13-27eb-41c1-aee8-89694b6aa04d',
    description: 'Session UUID',
  })
  @IsString()
  @MaxLength(100)
  sessionId!: string;

  @ApiProperty({
    example: '33333333-3333-3333-3333-333333333333',
    description: 'Student UUID (LMS)',
  })
  @IsString()
  @MaxLength(100)
  studentId!: string;

  @ApiProperty({ example: '수학 과제', maxLength: 100 })
  @IsString()
  @MaxLength(100)
  title!: string;

  @ApiProperty({ example: '교재 p.10~12 풀기' })
  @IsString()
  body!: string;

  @ApiProperty({ example: '2026-02-16', description: 'yyyy-mm-dd' })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'assignmentDate must be yyyy-mm-dd',
  })
  assignmentDate!: string;

  @ApiPropertyOptional({
    example: '2026-02-17',
    description: 'yyyy-mm-dd (optional)',
  })
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'dueDate must be yyyy-mm-dd' })
  dueDate?: string;

  // 선택: 상태/사유/추가필드(원하면 요청에서 받도록)
  @ApiPropertyOptional({ enum: DailyAssignmentStatus })
  @IsOptional()
  @IsEnum(DailyAssignmentStatus)
  status?: DailyAssignmentStatus;

  @ApiPropertyOptional({ example: null })
  @IsOptional()
  @IsString()
  incompletionReason?: string | null;

  @ApiPropertyOptional({ example: null })
  @IsOptional()
  @IsString()
  subject?: string | null;

  @ApiPropertyOptional({ example: null })
  @IsOptional()
  @IsString()
  categoryType?: string | null;

  @ApiPropertyOptional({ example: null })
  @IsOptional()
  @IsString()
  difficulty?: string | null;

  @ApiPropertyOptional({ example: 30 })
  @IsOptional()
  estimatedMinutes?: number | null;
}

export class UpdateTaskAssignmentDto {
  @ApiPropertyOptional({ example: '제목 수정', maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  title?: string | null;

  @ApiPropertyOptional({ example: '본문 수정' })
  @IsOptional()
  @IsString()
  body?: string | null;

  @ApiPropertyOptional({ example: '2026-02-18', description: 'yyyy-mm-dd' })
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  dueDate?: string | null;

  @ApiPropertyOptional({ enum: DailyAssignmentStatus })
  @IsOptional()
  @IsEnum(DailyAssignmentStatus)
  status?: DailyAssignmentStatus;

  @ApiPropertyOptional({ example: null })
  @IsOptional()
  @IsString()
  incompletionReason?: string | null;

  @ApiPropertyOptional({ example: null })
  @IsOptional()
  @IsString()
  subject?: string | null;

  @ApiPropertyOptional({ example: null })
  @IsOptional()
  @IsString()
  categoryType?: string | null;

  @ApiPropertyOptional({ example: null })
  @IsOptional()
  @IsString()
  difficulty?: string | null;

  @ApiPropertyOptional({ example: 45 })
  @IsOptional()
  estimatedMinutes?: number | null;
}

export class ListTaskAssignmentsQueryDto {
  @ApiPropertyOptional({ example: '64aedc13-27eb-41c1-aee8-89694b6aa04d' })
  @IsOptional()
  @IsUUID()
  sessionId?: string;

  @ApiPropertyOptional({ example: '33333333-3333-3333-3333-333333333333' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  studentId?: string;

  @ApiPropertyOptional({ example: '2026-02-16', description: 'yyyy-mm-dd' })
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  date?: string;
}

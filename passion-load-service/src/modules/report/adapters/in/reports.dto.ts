import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export enum ReportStatusDto {
  REQUESTED = 'REQUESTED',
  GENERATE = 'GENERATED',
  SENT = 'SENT',
}

export class CreateReportDto {
  @ApiProperty({
    description: '학생 UUID',
    example: 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
  })
  @IsString()
  studentId!: string;

  @ApiPropertyOptional({
    description: '세션 UUID',
    example: 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
  })
  @IsOptional()
  @IsUUID()
  sessionId?: string;

  @ApiProperty({
    description: '리포트 커버 시작(ISO)',
    example: '2026-03-01T00:00:00.000Z',
  })
  @IsDateString()
  fromAt!: string;

  @ApiProperty({
    description: '리포트 커버 끝(ISO)',
    example: '2026-03-07T23:59:59.999Z',
  })
  @IsDateString()
  toAt!: string;

  @ApiProperty({ description: '요약 텍스트' })
  @IsString()
  summary!: string;

  @ApiPropertyOptional({
    description: 'AI 분석 결과(JSON)',
    type: 'object',
    additionalProperties: true,
  })
  @IsOptional()
  analysis?: unknown;
}

export class SaveReportResultDto {
  @ApiPropertyOptional({ example: 'https://.../report.pdf' })
  @IsOptional()
  @IsString()
  resultUrl?: string;

  @ApiPropertyOptional({ example: 'file_123' })
  @IsOptional()
  @IsString()
  fileId?: string;
}

export class ListReportsQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  studentId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  sessionId?: string;

  @ApiPropertyOptional({ description: '커버 기간 시작(ISO)' })
  @IsOptional()
  @IsDateString()
  fromAt?: string;

  @ApiPropertyOptional({ description: '커버 기간 끝(ISO)' })
  @IsOptional()
  @IsDateString()
  toAt?: string;

  @ApiPropertyOptional({ enum: ReportStatusDto })
  @IsOptional()
  @IsEnum(ReportStatusDto)
  status?: ReportStatusDto;
}

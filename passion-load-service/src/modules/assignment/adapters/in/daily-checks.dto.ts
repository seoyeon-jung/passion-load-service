import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

export class UpsertDailyCheckDto {
  @ApiProperty({ example: 'student_123', description: 'LMS student id' })
  @IsString()
  @MaxLength(100)
  studentId!: string;

  @ApiProperty({ example: '2026-02-24', description: 'yyyy-mm-dd' })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'date must be yyyy-mm-dd' })
  date!: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  checked!: boolean;

  @ApiProperty({ example: false })
  @IsBoolean()
  contactMade!: boolean;

  @ApiPropertyOptional({ example: '연락 시도했으나 부재' })
  @IsOptional()
  @IsString()
  checkMemo?: string | null;
}

export class ListDailyChecksQueryDto {
  @ApiPropertyOptional({ example: '2026-02-24', description: 'yyyy-mm-dd' })
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  date?: string;

  @ApiPropertyOptional({ example: 'student_123' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  studentId?: string;
}

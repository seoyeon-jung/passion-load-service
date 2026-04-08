import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class UpsertStudentNoteDto {
  @ApiProperty({ example: 'student_123' })
  @IsString()
  studentId!: string;

  @ApiProperty({ example: '2026-05-27' })
  @IsDateString()
  date!: string;

  @ApiProperty({
    example: '수학 문제집 30p 완료했습니다. 영어 단어는 조금 부족해요.',
  })
  @IsString()
  content!: string;
}

export class ListStudentNoteQueryDto {
  @ApiPropertyOptional({ example: 'student_123' })
  @IsOptional()
  @IsString()
  studentId?: string;

  @ApiPropertyOptional({ example: '2026-05-27' })
  @IsOptional()
  @IsDateString()
  date?: string;
}

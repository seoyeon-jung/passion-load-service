import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateFeedbackDto {
  @ApiProperty({ example: 'student_123' })
  @IsString()
  studentId!: string;

  @ApiPropertyOptional({ example: 'a09a4529-5e30-49b7-80c4-142313d8a2df' })
  @IsOptional()
  @IsUUID()
  assignmentId?: string;

  @ApiProperty({
    maxLength: 250,
    example: '오늘 과제 수행이 좋아요. 다음 단계로 넘어가도 됩니다.',
  })
  @IsString()
  @MaxLength(250)
  content!: string;
}

export class ListFeedbackQueryDto {
  @ApiPropertyOptional({ example: 'student_123' })
  @IsOptional()
  @IsString()
  studentId?: string;

  @ApiPropertyOptional({ example: 'a09a4529-5e30-49b7-80c4-142313d8a2df' })
  @IsOptional()
  @IsUUID()
  assignmentId?: string;
}

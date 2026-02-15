import {
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';
import { SessionStatus } from '../../../../common/types/enums';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSessionDto {
  @ApiProperty({ example: '2주차 세션', maxLength: 100 })
  @IsString()
  @MaxLength(100)
  title!: string;

  @ApiProperty({ example: '2026-02-16', description: 'yyyy-mm-dd' })
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  date!: string;
}

export class UpdateSessionDto {
  @ApiPropertyOptional({ example: '제목 수정' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  title?: string;

  @ApiPropertyOptional({ example: '2026-02-17', description: 'yyyy-mm-dd' })
  @IsOptional()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  date?: string;
}

export class UpdateSessionStatusDto {
  @ApiProperty({ example: 'ACTIVE', enum: SessionStatus })
  @IsEnum(SessionStatus)
  status!: SessionStatus;
}

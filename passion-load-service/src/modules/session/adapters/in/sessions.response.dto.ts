import { ApiProperty } from '@nestjs/swagger';
import { SessionStatus } from '../../../../common/types/enums';

export class SessionResponseDto {
  @ApiProperty({ example: '1de46e1a-2850-4842-8042-c620f58f9233' })
  id!: string;

  @ApiProperty({ example: '11111111-1111-1111-1111-111111111111' })
  orgId!: string;

  @ApiProperty({ example: '2주차 세션' })
  title!: string;

  @ApiProperty({ example: '2026-02-16' })
  date!: string;

  @ApiProperty({ enum: SessionStatus, example: SessionStatus.PLANNED })
  status!: SessionStatus;

  @ApiProperty({ example: '2026-02-15T11:22:35.963Z' })
  createdAt!: string;

  @ApiProperty({ example: '2026-02-15T11:22:35.963Z' })
  updatedAt!: string;
}

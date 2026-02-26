import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, MaxLength } from "class-validator";

export class CounselingStatusQueryDto {
    @ApiPropertyOptional({ example: 'student_123' })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    studentId?: string;
}

export class CounselingStatusItemDto {
    @ApiProperty()
    studentId!: string;

    @ApiProperty()
    name!: string;

    @ApiPropertyOptional()
    email?: string;

    @ApiProperty()
    questionsCount!: number;

    @ApiPropertyOptional()
    lastQuestionAt?: string;

    @ApiPropertyOptional()
    lastQuestionContent?: string;
}
import { IsEnum, IsOptional, IsString, Matches, MaxLength } from "class-validator";
import { SessionStatus } from "../../../../common/types/enums";

export class CreateSesionDto {
    @IsString()
    @MaxLength(100)
    title!: string;

    @IsString()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'date must be yyyy-mm-dd' })
    date!: string; // yyyy-mm-dd
}

export class UpdateSessionDto {
    @IsOptional()
    @IsString()
    @MaxLength(100)
    title?: string;

    @IsOptional()
    @IsString()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'date must be yyyy-mm-dd' })
    date?: string; // yyyy-mm-dd
}

export class UpdateSessionStatusDto {
    @IsEnum(SessionStatus)
    status!: SessionStatus;
}
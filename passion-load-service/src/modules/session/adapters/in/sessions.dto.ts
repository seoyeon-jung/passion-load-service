import { IsString, Matches, MaxLength } from "class-validator";

export class CreateSesionDto {
    @IsString()
    @MaxLength(100)
    title!: string;

    @IsString()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'date must be yyyy-mm-dd' })
    date!: string; // yyyy-mm-dd
}
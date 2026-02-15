import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { SessionService } from "../../session.service";
import { OrgId } from "../../../../common/decorators/org-id.decorator";
import { CreateSesionDto } from "./sessions.dto";

@Controller('/api/v1/passion-load/sessions')
export class SessionsController {
    constructor(private readonly service: SessionService) {}

    @Post()
    create(@OrgId() orgId: string, @Body() dto: CreateSesionDto) {
        return this.service.create(orgId, dto);
    }

    @Get('/:id')
    get(@OrgId() orgId: string, @Param('id') id: string) {
        return this.service.get(orgId, id);
    }

    @Get()
    list(@OrgId() orgId: string) {
        return this.service.list(orgId);
    }
}
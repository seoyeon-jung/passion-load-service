import { Body, Controller, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { SessionService } from "../../session.service";
import { OrgId } from "../../../../common/decorators/org-id.decorator";
import { CreateSesionDto, UpdateSessionDto, UpdateSessionStatusDto } from "./sessions.dto";
import { RolesGuard } from "../../../../common/guards/roles.guard";
import { Roles } from "../../../../common/decorators/roles.decorator";

@UseGuards(RolesGuard)
@Controller('/api/v1/passion-load/sessions')
export class SessionsController {
    constructor(private readonly service: SessionService) {}

    @Roles('TEACHER', 'ADMIN')
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

    @Roles('TEACHER', 'ADMIN')
    @Patch('/:id')
    update(
        @OrgId() orgId: string,
        @Param('id') id: string,
        @Body() dto: UpdateSessionDto,
    ) {
        return this.service.update(orgId, id, dto);
    }
    
    @Roles('TEACHER', 'ADMIN')
    @Patch('/:id/status')
    updateStatus(
        @OrgId() orgId: string,
        @Param('id') id: string,
        @Body() dto: UpdateSessionStatusDto,
    ) {
        return this.service.updateStatus(orgId, id, dto.status);
    }
}
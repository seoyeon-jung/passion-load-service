import { BadRequestException, createParamDecorator, ExecutionContext } from "@nestjs/common";

export const OrgId = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest() as any;
    const orgId = req.organizationId;

    if (!orgId) throw new BadRequestException('x-organization-id header is required');

    return orgId as string
})
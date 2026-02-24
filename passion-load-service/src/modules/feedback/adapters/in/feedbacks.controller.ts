import { OrgId } from '@common/decorators/org-id.decorator';
import { Roles } from '@common/decorators/roles.decorator';
import { RolesGuard } from '@common/guards/roles.guard';
import type { RequestContext } from '@common/types/request-context';
import { FeedbacksService } from '@modules/feedback/feedback.service';
import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { CreateFeedbackDto, ListFeedbackQueryDto } from './feedback.dto';

@ApiTags('feedback')
@ApiSecurity('org')
@ApiSecurity('role')
@ApiSecurity('user')
@UseGuards(RolesGuard)
@Controller('/api/v1/passion-load/feedback')
export class FeedbacksController {
  constructor(private readonly service: FeedbacksService) {}

  @ApiOperation({ summary: 'Create feedback (<= 250 chars)' })
  @ApiCreatedResponse({ description: 'Created feedback' })
  @ApiBadRequestResponse({ description: 'Validation error / content too long' })
  @Roles('TEACHER', 'ADMIN')
  @Post()
  create(
    @OrgId() orgId: string,
    @Req() req: RequestContext,
    @Body() dto: CreateFeedbackDto
  ) {
    return this.service.create(orgId, req.user?.id, dto);
  }

  @ApiOperation({
    summary: 'List feedback (filters: studentId | assignmentId)',
  })
  @ApiOkResponse({ description: 'Feedback list' })
  @ApiBadRequestResponse({ description: 'At least one filter required' })
  @Roles('TEACHER', 'ADMIN')
  @Get()
  list(@OrgId() orgId: string, @Query() query: ListFeedbackQueryDto) {
    return this.service.list(orgId, query);
  }
}

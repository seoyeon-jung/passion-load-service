import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '@common/prisma/prisma.service';

@Controller()
export class HealthController {
  // prisma 주입해서 테스트 [추후 필요시 삭제]
  constructor(private readonly prisma: PrismaService) {}

  @Get('health')
  async getHealth() {
    await this.prisma.$queryRaw`SELECT 1`;
    return { ok: true };
  }
}

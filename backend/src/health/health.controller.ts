import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/**
 * HealthController provides a simple health check endpoint for the API
 *
 * This controller exposes a GET /health endpoint that can be used by monitoring tools
 * or load balancers to verify that the backend service is running.
 *
 * @controller health
 *
 * @example
 * ```typescript
 * // Health check
 * GET /health
 * // Response: { status: 'ok' }
 * ```
 */
@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Health check endpoint
   *
   * Returns a simple status object indicating the API is running.
   *
   * @returns An object with a status property set to 'ok'
   */
  @Get()
  async checkHealth() {
    const dbStatus = await this.prisma.checkConnection();
    return {
      status: 'ok',
      database: dbStatus ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString(),
    };
  }
} 

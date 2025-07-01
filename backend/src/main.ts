import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

/**
 * Bootstrap function to create and configure the NestJS application
 * 
 * This function initializes the NestJS application with the following configurations:
 * - Enables CORS for cross-origin requests
 * - Sets up global validation pipe for request validation
 * - Configures global prefix for API routes
 * 
 * @returns Promise<void> - Resolves when the application is successfully started
 * 
 * @example
 * ```typescript
 * bootstrap().then(() => {
 *   console.log('Application is running on port 3000');
 * });
 * ```
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for cross-origin requests
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:8081', 'http://localhost:19006'],
    credentials: true,
  });
  
  // Set up global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Strip properties that don't have decorators
    forbidNonWhitelisted: true, // Throw errors if non-whitelisted values are provided
    transform: true, // Transform payloads to be objects typed according to their DTO classes
  }));
  
  // Set global prefix for all routes
  app.setGlobalPrefix('api');
  
  // Add request logging middleware
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  });
  
  const port = process.env.PORT || 3000;
  await app.listen(port);
  // Application is running
}

bootstrap().catch((err) => console.error('Failed to start server:', err));

import app from './app.js';
import { env } from './config/env.js';
import { connectDB } from './config/db.js';
import { initCronJobs } from './services/cron.service.js';

const startServer = async () => {
  try {
    // 1. Connect to MongoDB
    await connectDB();

    // 2. Initialize cron background tasks
    initCronJobs();

    // 3. Start listening on configured port
    const server = app.listen(env.PORT, () => {
      console.log(`🚀 Billora Backend API listening at http://localhost:${env.PORT}/ [${env.NODE_ENV}]`);
      console.log(`🔗 API Index:  http://localhost:${env.PORT}/api/v1`);
      console.log(`🩺 Health:     http://localhost:${env.PORT}/health`);
    });

    // Graceful Shutdown handling
    const handleShutdown = (signal: string) => {
      console.log(`\n⚠️ Received ${signal}. Shutting down gracefully...`);
      server.close(() => {
        console.log('✅ Server closed.');
        process.exit(0);
      });
    };

    process.on('SIGINT', () => handleShutdown('SIGINT'));
    process.on('SIGTERM', () => handleShutdown('SIGTERM'));
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

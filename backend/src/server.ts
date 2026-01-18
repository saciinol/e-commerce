import cron from 'node-cron';
import app from './app.js';
import { config } from './config/environment.js';
import { logger } from './utils/logger.js';
import { TokenService } from './services/token.service.js';

const PORT = config.port || 3000;

const server = app.listen(PORT, () => {
	console.log(`Server running on port ${PORT} in ${config.nodeEnv} mode`);

  // run daily at 2 am
	cron.schedule('0 2 * * *', async () => {
		logger.info('Running token cleanup job');
		await TokenService.cleanupExpiredTokens();
	});
});

process.on('SIGTERM', () => {
	logger.info('SIGTERM signal received: closing HTTP server');
	server.close(() => {
		logger.info('HTTP server closed');
	});
});

process.on('unhandledRejection', (reason: Error) => {
	logger.error('Unhandled Rejection', reason);
	server.close(() => process.exit(1));
});

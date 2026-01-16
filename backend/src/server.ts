import app from './app.js';
import { config } from './config/environment.js';
import { logger } from './utils/logger.js';

const PORT = config.port || 3000;

const server = app.listen(PORT, () => {
	console.log(`Server running on port ${PORT} in ${config.nodeEnv} mode`);
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

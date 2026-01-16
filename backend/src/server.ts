import app from './app.js';
import { config } from './config/environment.js';

const PORT = config.port || 3000;

const server = app.listen(PORT, () => {
	console.log(`Server running on port ${PORT} in ${config.nodeEnv} mode`);
});

process.on('SIGTERM', () => {
	// logger.info
	server.close(() => {
		//logger.info
	});
});

process.on('unhandledRejection', (reason: Error) => {
	// logger.error
	server.close(() => process.exit(1));
});

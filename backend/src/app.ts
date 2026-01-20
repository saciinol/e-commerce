import express, { Application } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';

import { errorLogger, requestLogger } from './middleware/logger.middleware.js';
import { errorMiddleware } from './middleware/error.middleware.js';
import routes from './routes/index.js';

const app: Application = express();

app.use(helmet());
app.use(
	cors({
		origin: process.env.ALLOWED_ORIGINS?.split(','),
		credentials: true,
	}),
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(compression());

app.use(requestLogger);

app.use(cookieParser());

app.get('/health', (req, res) => {
	res.status(200).json({
		status: 'ok',
		timestamp: new Date().toISOString(),
	});
});

app.use('/api', routes);

app.use(errorLogger);

app.use(errorMiddleware);

export default app;

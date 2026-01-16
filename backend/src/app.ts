import express, { Application } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';

import { requestLogger } from './middleware/logger.middleware.js';

const app: Application = express();

app.use(helmet());
app.use(
	cors({
		origin: 'http://localhost:5173',
	})
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(compression());

app.use(requestLogger);

app.get('/health', (req, res) => {
	res.status(200).json({
		status: 'ok',
		timestamp: new Date().toISOString(),
	});
});

// api routes

// error logging

// error handling

export default app;

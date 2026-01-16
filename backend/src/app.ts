import express, { Application } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';

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

// requestLogger

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

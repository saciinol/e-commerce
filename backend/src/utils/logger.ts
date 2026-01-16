import winston from 'winston';
import { config } from '../config/environment.js';

const levels = {
	error: 0,
	warn: 1,
	info: 2,
	debug: 3,
};

const colors = {
	error: 'red',
	warn: 'yellow',
	info: 'green',
	debug: 'blue',
};

winston.addColors(colors);

const devFormat = winston.format.combine(
	winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
	winston.format.errors({ stack: true }),
	winston.format.colorize({ all: true }),
	winston.format.printf((info) => {
		const { timestamp, level, message, ...meta } = info;
		const metaString = Object.keys(meta).length ? `\n${JSON.stringify(meta, null, 2)}` : '';
		return `${timestamp} ${level}: ${message}${metaString}`;
	})
);

const prodFormat = winston.format.combine(
	winston.format.timestamp(),
	winston.format.errors({ stack: true }),
	winston.format.json()
);

const isDevelopment = config.nodeEnv === 'development';

export const logger = winston.createLogger({
	level: config.logLevel,
	levels,
	format: isDevelopment ? devFormat : prodFormat,
	transports: [
		new winston.transports.Console(),
		new winston.transports.File({ filename: 'logs/error.log', level: 'error', maxsize: 5242880, maxFiles: 5 }),
		new winston.transports.File({ filename: 'logs/combined.log', maxsize: 5242880, maxFiles: 5 }),
	],
});

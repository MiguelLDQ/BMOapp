"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = () => ({
    port: parseInt(process.env.PORT || '3000', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
    database: {
        url: process.env.DATABASE_URL,
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'change-me',
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    },
    groq: {
        apiKey: process.env.GROQ_API_KEY || '',
    },
    firebase: {
        serviceAccount: process.env.FIREBASE_SERVICE_ACCOUNT || '',
        databaseURL: process.env.FIREBASE_DATABASE_URL || '',
    },
});
//# sourceMappingURL=configuration.js.map
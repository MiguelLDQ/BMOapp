declare const _default: () => {
    port: number;
    nodeEnv: string;
    database: {
        url: string;
    };
    jwt: {
        secret: string;
        expiresIn: string;
    };
    groq: {
        apiKey: string;
    };
    cleanup: {
        secret: string;
    };
    firebase: {
        serviceAccount: string;
        databaseURL: string;
    };
};
export default _default;

import { PrismaService } from '../prisma.service';
import { FirebaseService } from '../firebase.service';
export declare class ChatCleanupService {
    private prisma;
    private firebase;
    private readonly logger;
    constructor(prisma: PrismaService, firebase: FirebaseService);
    cleanupDaily(): Promise<{
        success: boolean;
        deletedMessages: any;
        timestamp: string;
    }>;
}

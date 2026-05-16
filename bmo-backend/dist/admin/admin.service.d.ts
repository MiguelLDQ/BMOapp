import { PrismaService } from '../prisma.service';
import { FirebaseService } from '../firebase.service';
import { BanUserDto, ResolveReportDto } from './admin.dto';
export declare class AdminService {
    private prisma;
    private firebase;
    constructor(prisma: PrismaService, firebase: FirebaseService);
    listUsers(search?: string): Promise<any>;
    banUser(targetUserId: string, dto: BanUserDto): Promise<{
        message: string;
    }>;
    unbanUser(targetUserId: string): Promise<{
        message: string;
    }>;
    promoteToAdmin(targetUserId: string): Promise<{
        message: string;
    }>;
    listReports(status?: string): Promise<any>;
    resolveReport(reportId: string, dto: ResolveReportDto): Promise<{
        message: string;
    }>;
    deleteMessage(messageId: string): Promise<{
        message: string;
    }>;
    getDashboard(): Promise<{
        totalUsers: any;
        bannedUsers: any;
        pendingReports: any;
        totalMessages: any;
    }>;
}

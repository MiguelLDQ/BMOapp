import { AdminService } from './admin.service';
import { BanUserDto, ResolveReportDto } from './admin.dto';
export declare class AdminController {
    private adminService;
    constructor(adminService: AdminService);
    getDashboard(): Promise<{
        success: boolean;
        data: {
            totalUsers: any;
            bannedUsers: any;
            pendingReports: any;
            totalMessages: any;
        };
    }>;
    listUsers(search?: string): Promise<{
        success: boolean;
        data: any;
    }>;
    banUser(userId: string, dto: BanUserDto): Promise<{
        message: string;
        success: boolean;
    }>;
    unbanUser(userId: string): Promise<{
        message: string;
        success: boolean;
    }>;
    promoteToAdmin(userId: string): Promise<{
        message: string;
        success: boolean;
    }>;
    listReports(status?: string): Promise<{
        success: boolean;
        data: any;
    }>;
    resolveReport(reportId: string, dto: ResolveReportDto): Promise<{
        message: string;
        success: boolean;
    }>;
    deleteMessage(messageId: string): Promise<{
        message: string;
        success: boolean;
    }>;
}

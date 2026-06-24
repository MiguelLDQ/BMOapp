import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service';
import { RegisterDto, LoginDto } from './auth.dto';
export declare class AuthService {
    private prisma;
    private jwt;
    constructor(prisma: PrismaService, jwt: JwtService);
    register(dto: RegisterDto): Promise<{
        user: any;
        token: string;
    }>;
    login(dto: LoginDto): Promise<{
        user: {
            id: any;
            name: any;
            email: any;
            avatar: any;
            role: any;
        };
        token: string;
    }>;
    updateMe(userId: string, dto: {
        name: string;
    }): Promise<any>;
}

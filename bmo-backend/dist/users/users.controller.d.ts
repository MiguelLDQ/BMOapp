import { UsersService } from './users.service';
import { UpdateProfileDto } from './users.dto';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    getProfile(userId: string): Promise<{
        success: boolean;
        data: any;
    }>;
    updateProfile(userId: string, dto: UpdateProfileDto): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
}

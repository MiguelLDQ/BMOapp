import { PrismaService } from '../prisma.service';
import { CreateEstrelasDto } from './estrelas.dto';
export declare class EstrelasService {
    private prisma;
    constructor(prisma: PrismaService);
    send(dto: CreateEstrelasDto): Promise<any>;
    receive(): Promise<any>;
}

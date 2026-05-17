import { EstrelasService } from './estrelas.service';
import { CreateEstrelasDto } from './estrelas.dto';
export declare class EstrelasController {
    private estrelasService;
    constructor(estrelasService: EstrelasService);
    send(dto: CreateEstrelasDto): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    receive(): Promise<{
        success: boolean;
        data: any;
    }>;
}

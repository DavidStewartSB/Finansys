import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Category} from './Pages/categories/shared/category.model';


export class InMemoryDataBase implements InMemoryDbService {
    createDb() {
        const categories: Category [] = [
        {id: 1, name: 'Moradia', description: 'Pagamentos de contas da casa'},
        {id: 2, name: 'Saúde', description: 'Planos de saúde/remédios'},
        {id: 3, name: 'Lazer', description: 'Cinema, Parques, praia'},
        {id: 4, name: 'Salário', description: 'Recebimento de Salário'},
        {id: 5, name: 'Freelas', description: 'Trabalhos como freelancer'}
        ];

        return { categories };
    }
}

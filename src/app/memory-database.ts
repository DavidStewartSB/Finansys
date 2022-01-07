import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Category} from './Pages/categories/shared/category.model';
import { Entry } from './Pages/entries/shared/entry.model';


export class InMemoryDataBase implements InMemoryDbService {
    createDb() {
        const categories: Category [] = [
        {id: 1, name: 'Moradia', description: 'Pagamentos de contas da casa'},
        {id: 2, name: 'Saúde', description: 'Planos de saúde/remédios'},
        {id: 3, name: 'Lazer', description: 'Cinema, Parques, praia'},
        {id: 4, name: 'Salário', description: 'Recebimento de Salário'},
        {id: 5, name: 'Freelas', description: 'Trabalhos como freelancer'}
        ];

        const entries: Entry[] = [
        {id: 1, name: 'Gás de Cozinha', categoryId: categories[0].id, category: categories[0],
        paid: true, date: '14/10/2021', amount: '79,80', type: 'revenue', description: 'Ta caro'} as Entry,

        {id: 2, name: 'Suplementos', categoryId: categories[1].id, category: categories[1],
        paid: true, date: '14/10/2021', amount: '10,60', type: 'revenue', description: 'Ta caro'} as Entry,

        {id: 3, name: 'Salário na empresa X', categoryId: categories[4].id, category: categories[4],
        paid: true, date: '14/10/2021', amount: '10,60', type: 'revenue', description: 'Ta caro'} as Entry,

        {id: 4, name: 'Aluguel de carro', categoryId: categories[0].id, category: categories[0],
        paid: false, date: '14/10/2021', amount: '10,60', type: 'expense', description: 'Ta caro'} as Entry,

        {id: 5, name: 'Bombas', categoryId: categories[1].id, category: categories[1],
        paid: true, date: '14/10/2021', amount: '10,60', type: 'revenue', description: 'Ta caro'} as Entry,

        {id: 6, name: 'Video Game', categoryId: categories[2].id, category: categories[2],
        paid: true, date: '14/10/2021', amount: '10,60', type: 'revenue', description: 'Ta caro'} as Entry,

        {id: 11, name: 'Uber', categoryId: categories[4].id, category: categories[4],
        paid: false, date: '14/10/2021', amount: '10,60', type: 'expense', description: 'Ta caro'} as Entry,

        {id: 12, name: 'Aluguel', categoryId: categories[0].id, category: categories[0],
        paid: false, date: '14/10/2021', amount: '400,60', type: 'expense', description: 'Vencimento dia 13'} as Entry,

        {id: 13, name: 'Conta de Luz', categoryId: categories[0].id, category: categories[0],
        paid: true, date: '14/10/2021', amount: '100,60', type: 'revenue', description: 'Vencimento dia 13'} as Entry,

        {id: 14, name: 'Pix do emprestimo', categoryId: categories[0].id, category: categories[0],
        paid: true, date: '14/10/2021', amount: '500,60', type: 'revenue', description: 'Pago dia 02'} as Entry,

        {id: 19, name: 'Netflix', categoryId: categories[3].id, category: categories[3],
        paid: false, date: '14/10/2021', amount: '49,90', type: 'expense', description: 'Vencimento dia 16'} as Entry,

        {id: 21, name: 'Jogo de PC', categoryId: categories[1].id, category: categories[2],
        paid: true, date: '14/10/2021', amount: '55,60', type: 'revenue', description: 'Night Hollow'} as Entry,

        {id: 22, name: 'GymPass', categoryId: categories[2].id, category: categories[2],
        paid: false, date: '14/10/2021', amount: '59,90', type: 'expense', description: 'Vencimento dia 20'} as Entry,

        {id: 23, name: 'Cinema', categoryId: categories[1].id, category: categories[1],
        paid: true, date: '14/10/2021', amount: '10,60', type: 'revenue', description: 'Ta caro'} as Entry,

        {id: 44, name: 'Uber', categoryId: categories[2].id, category: categories[2],
        paid: true, date: '14/10/2021', amount: '10,60', type: 'revenue', description: 'Ta caro'} as Entry,

        {id: 55, name: 'Zoologico', categoryId: categories[3].id, category: categories[3],
        paid: true, date: '14/10/2021', amount: '20,60', type: 'revenue', description: 'Aniversário da Beatriz'} as Entry
        ];

        return { categories, entries };
    }
}

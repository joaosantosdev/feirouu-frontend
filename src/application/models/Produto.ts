import { ProdutoChaveEtiqueta } from './ProdutoChaveEtiqueta';
export class Produto {
    public id: number;
    public nome: string;
    public descricao: string;
    public valorCompra: any;
    public valorVenda: any;
    public status: number;
    public chavesEtiquetas: ProdutoChaveEtiqueta[];
}
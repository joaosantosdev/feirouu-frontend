import { Endereco } from './Endereco';
export class Loja {
    public id: number;
    public nome: string = '';
    public email: string = '';
    public telefone: string = '';
    public descricao: string = '';
    public endereco: Endereco = new Endereco();
}
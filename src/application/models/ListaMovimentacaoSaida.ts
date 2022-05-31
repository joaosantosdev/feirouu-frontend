import { Cliente } from './Cliente';
import MovimentacaoSaida from './MovimentacaoSaida';

export default class ListaMovimentacaoSaida {
    public cliente: Cliente;
    public saidas: MovimentacaoSaida[];

    constructor(cliente: Cliente, saidas: MovimentacaoSaida[]) {
        this.cliente = cliente;
        this.saidas = saidas;
    }
}
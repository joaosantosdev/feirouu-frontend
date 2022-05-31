import MovimentacaoDevolucao from './MovimentacaoDevolucao';

export default class ListaMovimentacaoDevolucao {
    public devolucoes: MovimentacaoDevolucao[];

    constructor(devolucoes: MovimentacaoDevolucao[]) {
        this.devolucoes = devolucoes;
    }
}
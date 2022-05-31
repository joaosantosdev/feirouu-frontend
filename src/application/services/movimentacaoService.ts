import { api } from 'boot/axios';
import MovimentacaoEntrada from '../models/MovimentacaoEntrada';
import ListaMovimentacaoSaida from '../models/ListaMovimentacaoSaida';
import ListaMovimentacaoDevolucao from '../models/ListaMovimentacaoDevolucao';

class MovimentacaoService {
    public async registrarEntrada(lojaId: number, produtoId: number, movimentacao: MovimentacaoEntrada) {
        return await api.post(`/lojas/${lojaId}/produtos/${produtoId}/entradas`, movimentacao);
    }

    public async registrarSaidas(lojaId: number, ListaMovimentacaoSaida: ListaMovimentacaoSaida) {
        return await api.post(`/lojas/${lojaId}/movimentacoes/saidas`, ListaMovimentacaoSaida);
    }

    public async registrarDevolucoes(lojaId: number, listaMovimentacaoDevolucao: ListaMovimentacaoDevolucao) {
        return await api.post(`/lojas/${lojaId}/movimentacoes/devolucoes`, listaMovimentacaoDevolucao);
    }

    public async obterSaidasPorClienteCpfLojaId(lojaId: number, cpf: string) {
        return await api.get(`/lojas/${lojaId}/clientes/${cpf}/saidas`);
    }

    public async obterEntradasDisponiveis(lojaId: number, produtoId: number) {
        return await api.get(`/lojas/${lojaId}/produtos/${produtoId}/entradas`);
    }
    public async obterQuantidadeDisponivelSaida(lojaId: number, produtoId: number) {
        return await api.get(`/lojas/${lojaId}/produtos/${produtoId}/quantidade-disponivel-saida`);
    }
    public async obterRelatorioVendas(lojaId: number, dataInicial: string, dataFinal: string) {
        return await api.get(`/lojas/${lojaId}/relatorio/vendas?dataInicial=${dataInicial}&dataFinal=${dataFinal}`);
    }
}
const movimentacaoService = new MovimentacaoService();
export default movimentacaoService;
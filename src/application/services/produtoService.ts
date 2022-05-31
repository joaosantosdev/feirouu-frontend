import { api } from 'boot/axios';
import { Produto } from '../models/Produto';
import { Paginacao } from '../models/Paginacao';


class ProdutoService {

    public async cadastrar(lojaId: number, produto: Produto) {
        return await api.post(`/lojas/${lojaId}/produtos`, produto);
    }


    public async atualizar(lojaId: number, produto: Produto) {
        return await api.put(`/lojas/${lojaId}/produtos/${produto.id}`, produto);
    }

    public async buscar(lojaId: number, params = {}) {
        let paramsText = '';
        Object.keys(params).forEach(key => {
            paramsText += `${key}=${params[key] as string}&`;
        });
        return await api.get(`/lojas/${lojaId}/produtos?${paramsText}`);
    }

    public async temMovimentacoes(produtoId: number, lojaId: number) {
        return await api.get(`/lojas/${lojaId}/produtos/${produtoId}/verificar-movimentacoes`);
    }

    public async excluir(produtoId: number, lojaId: number) {
        return await api.delete(`/lojas/${lojaId}/produtos/${produtoId}`);
    }

    public async obterPorLoja(lojaId: string) {
        return await api.get(`/lojas/${lojaId}/produtos/todos`, {
            withCredentials: false
        });
    }

}

const produtoService = new ProdutoService();
export default produtoService;
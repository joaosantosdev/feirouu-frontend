import { api } from 'boot/axios';
import { Loja } from '../models/Loja';


class LojaService {
    public async cadastrar(loja: Loja) {
        return await api.post('/lojas', loja);
    }

    public async atualizar(loja: Loja) {
        return await api.put(`/lojas/${loja.id}`, loja);
    }

    public async obterLojaPorId(id: number) {
        return await api.get(`/lojas/${id}`);
    }

    public async obterLojas() {
        return await api.get(`/lojas`, {
            withCredentials: false
        });
    }
}

const lojaService = new LojaService();
export default lojaService;
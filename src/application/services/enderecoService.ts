import { api } from 'boot/axios';

class EnderecoService {
    public async obterEstados() {
        return await api.get('/estados');
    }
    public async obterCidadePorEstado(id: number) {
        return await api.get(`/estados/${id}/cidades`);
    }
}
const enderecoService = new EnderecoService();
export default enderecoService;
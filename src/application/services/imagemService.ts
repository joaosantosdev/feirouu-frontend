import { api } from 'boot/axios';

class ImagemService {
    public async salvar(data: FormData) {
        return await api.post('/imagens', data);
    }
    public async excluir(id: number, tipo: number) {
        return await api.delete(`/imagens?id=${id}&tipo=${tipo}`);
    }
}

const imagemService = new ImagemService();
export default imagemService;
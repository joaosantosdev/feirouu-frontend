import { api } from 'boot/axios';

class ConfirmacaoEmailService {
    public async enviar(email: string, redefinicao: boolean = false) {
        return await api.get(`/codigo-verificacao/${email}?redefinicao=${String(redefinicao)}`);
    }
}

export default new ConfirmacaoEmailService();
import { api } from 'boot/axios';
import { UsuarioCadastro } from '../models/UsuarioCadastro';
import { UsuarioAutenticar } from '../models/UsuarioAutenticar';
import RedefinicaoSenha from '../models/RedefinicaoSenha';


class UsuarioService {
    public async cadastrar(usuario: UsuarioCadastro) {
        return await api.post('/usuarios', usuario);
    }

    public async autenticar(usuario: UsuarioAutenticar) {
        return await api.post('/login', usuario);
    }

    public async obterUsuarioAutenticado() {
        return await api.get('/usuarios/autenticado');
    }

    public async atualizar(usuario: UsuarioCadastro) {
        return await api.put('/usuarios/autenticado', usuario);
    }

    public async redefinirSenha(redefinicaoSenha: RedefinicaoSenha) {
        return await api.post('/usuarios/redefinir-senha', redefinicaoSenha);
    }
}

export default new UsuarioService();
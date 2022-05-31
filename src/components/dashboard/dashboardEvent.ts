export default class DashboardEvent {
    static logout = {
        call: null as any,
        notify() {
            if (this.call) {
                this.call();
            }
        }
    };
    static exibirNotificacao = {
        call: null as any,
        disparar(mensagem: string, tipoMensagem: string = 'sucesso') {
            if (this.call) {
                this.call(mensagem, tipoMensagem);
            }
        }
    };
    static obterUsuarioAutenticado = {
        call: null as any,
        async disparar() {
            if (this.call) {
                await this.call();
            }
        }
    }
    static atualizarUsuarioInfo = {
        call: null as any,
        async disparar(usuarioInfo) {
            if (this.call) {
                await this.call(usuarioInfo);
            }
        }
    }

}
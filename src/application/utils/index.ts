import { UsuarioInfo } from '../models/usuarioInfo';
import DashboardEvent from '../../components/dashboard/dashboardEvent';
export class Utils {
    public static temErro(errors: object): boolean {
        return Object.keys(errors).length > 0;
    }
    public static guardarToken(token: string): void {
        localStorage.setItem('token', token);
    }
    public static limparToken() {
        localStorage.removeItem('token');
    }
    public static limparUsuarioInfo() {
        localStorage.removeItem('usuarioInfo');
    }
    public static obterToken(): string {
        return localStorage.getItem('token') as string;
    }
    public static guardarUsuarioInfo(usuarioInfo: UsuarioInfo): void {
        localStorage.setItem('usuarioInfo', JSON.stringify(usuarioInfo));
    }
    public static obterUsuarioInfo(): UsuarioInfo {
        return JSON.parse(localStorage.getItem('usuarioInfo') as string) as UsuarioInfo;
    }
    public static exibirMensagemError(erro: any) {
        const mensagem: string = erro.response.data.mensagem;
        DashboardEvent.exibirNotificacao.disparar(mensagem, 'erro');
    }
    public static exibirError(mensagem: string) {
        DashboardEvent.exibirNotificacao.disparar(mensagem, 'erro');
    }
    public static exibirMensagem(mensagem: string, tipo = 'sucesso') {
        DashboardEvent.exibirNotificacao.disparar(mensagem, tipo);
    }
    public static exibirMensagemAviso(mensagem: string) {
        DashboardEvent.exibirNotificacao.disparar(mensagem, 'aviso');
    }
    public static adicionarZero(value: number): string {
        return value <= 9 ? `0${value}` : `${value}`;
    }

    public static get status(): any {
        return {
            ativo: {
                label: 'Ativo',
                value: 1
            },
            inativo: {
                label: 'Inativo',
                value: 2
            }
        };
    }

    public static relogioEmail(timestampCriacao: number, callback: any) {
        const calculoRelogio = () => {
            const VALIDADE = 600000;

            const timestampValidade = timestampCriacao + VALIDADE;
            const timestampRestante = timestampValidade - Date.now();

            const data = new Date(timestampRestante);

            const adicionarZero = (valor: number) => {
                return valor <= 9 ? `0${valor}` : `${valor}`;
            };
            const tempoCodigoVerificacao = `${adicionarZero(
                data.getMinutes()
            )}:${adicionarZero(data.getSeconds())}`;

            callback(tempoCodigoVerificacao);
        };
        calculoRelogio();
        return setInterval(calculoRelogio, 1000);
    }

    public static dataBr(data) {
        const datas = data.toISOString().slice(0, 10).split('-') as any[];
        return datas.reverse().join('/');
    }

    public static dataStrParaDate(data: string) {
        const datas = data.split('/');
        return new Date(datas.reverse().join('-'));
    }
    public static dateParaDataSQL(data: Date) {
        return data.toISOString().slice(0, 10);
    }
}
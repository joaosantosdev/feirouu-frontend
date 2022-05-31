export class Paginacao {
    public pagina: number;
    public ordenarPor: string;
    public porPagina: number;
    public direcao: string;
    public totalGeral: number;
    public total: number;
    public quantidadePagina: number;

    constructor(pagina: number, ordenarPor: string, porPagina: number = 24, direcao: string = 'ASC') {
        this.pagina = pagina;
        this.ordenarPor = ordenarPor;
        this.porPagina = porPagina;
        this.direcao = direcao;
    }

    public obterQuantidadePagina() {
        return Math.ceil(this.totalGeral / this.total);
    }
}
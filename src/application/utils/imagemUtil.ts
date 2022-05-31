
export default class ImagemUtil {
    public static obterUrl(id: number, tipo: number) {
        return `${process.env.BASE_URL}/imagens?id=${id}&tipo=${tipo}`;
    }
}
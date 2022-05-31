import { RouteRecordRaw } from 'vue-router';
import Dashboard from '../components/dashboard/Dashboard.vue';
import AutenticarPage from '../pages/autenticar/AutenticarPage.vue';
import LojaPage from '../pages/loja/LojaPage.vue';
import ProdutoPage from '../pages/produto/ProdutoPage.vue';
import ProdutoEntradaPage from '../pages/produto/ProdutoEntradaPage.vue';
import ProdutoSaidaPage from '../pages/produto/ProdutoSaidaPage.vue';
import ProdutoDevolucaoPage from '../pages/produto/ProdutoDevolucaoPage.vue';
import PerfilPage from '../pages/perfil/PerfilPage.vue';
import RelatorioVendasPage from '../pages/relatorio/RelatorioVendasPage.vue';
import HomePage from '../pages/visitante/HomePage.vue';
import LojaProdutosPage from '../pages/visitante/LojaProdutosPage.vue';

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        component: Dashboard,
        children: [
            {
                name: 'Perfil',
                component: PerfilPage,
                path: '/perfil'
            },
            {
                name: 'Loja',
                component: LojaPage,
                path: '/loja'
            },
            {
                name: 'Produto',
                component: ProdutoPage,
                path: '/produto'
            },
            {
                name: 'ProdutoEntrada',
                component: ProdutoEntradaPage,
                path: '/produto/entrada'
            },
            {
                name: 'ProdutoSaida',
                component: ProdutoSaidaPage,
                path: '/produto/saida'
            },
            {
                name: 'ProdutoDevolucao',
                component: ProdutoDevolucaoPage,
                path: '/produto/devolucao'
            },
            {
                name: 'RelatorioVendas',
                component: RelatorioVendasPage,
                path: '/relatorio/vendas'
            }
        ],
    },
    {
        name: 'Login',
        component: AutenticarPage,
        path: '/login'
    }
    ,
    {
        name: 'HomePage',
        component: HomePage,
        path: '/feiras'
    }, {
        name: 'LojaProdutos',
        component: LojaProdutosPage,
        path: '/loja/produtos'
    }

];

export default routes;

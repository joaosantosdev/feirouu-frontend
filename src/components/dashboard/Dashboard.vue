<template>
  <q-layout data-cy="dashboard" view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleDrawer"
        />
        <q-toolbar-title class="title-header">
          <div>{{ tituloAtivado }}</div>
          <div>
            <q-icon name="logout" @click="logout" class="cursor-pointer" />
          </div>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="isOpenDrawer" show-if-above :width="250">
      <q-scroll-area
        style="
          height: calc(100% - 150px);
          margin-top: 150px;
          border-right: 1px solid #ddd;
        "
      >
        <q-list>
          <div v-for="(item, index) of itens" :key="index" class="">
            <q-item>
              <q-item-section>
                <q-item-label>{{ item.titulo }}</q-item-label>
                <q-item
                  v-for="(subItem, indexSub) of item.subItens"
                  :key="indexSub"
                  clickable
                  @click="goPage(subItem)"
                >
                  <q-item-section avatar>
                    <q-icon :name="subItem.icon" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ subItem.titulo }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-item-section>
            </q-item>
            <q-separator />
          </div>
        </q-list>
      </q-scroll-area>

      <q-img
        class="absolute-top"
        src="https://cdn.quasar.dev/img/material.png"
        style="height: 150px"
      >
        <div class="absolute-bottom bg-transparent">
          <q-avatar v-if="imgUsuario" size="56px" class="q-mb-sm">
            <img @error="imagemErro" v-if="imgUsuario" :src="imgUsuario" />
          </q-avatar>
          <div class="text-weight-bold">{{ usuarioInfo.nome }}</div>
          <div>{{ usuarioInfo.email }}</div>
        </div>
      </q-img>
    </q-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import DashboardEvent from './dashboardEvent';
import { Utils } from 'src/application/utils';
import { useQuasar } from 'quasar';
import usuarioService from 'src/application/services/usuarioService';
import { UsuarioInfo } from 'src/application/models/usuarioInfo';
import ImagemUtil from 'src/application/utils/imagemUtil';
import TipoImagem from 'src/application/models/TipoImagem';

interface SubItemMenu {
  titulo: string;
  idRota: string;
  ativado: boolean;
  icon: string;
  path: string;
  beforeFunction?: any;
}

interface ItemMenu {
  subItens: SubItemMenu[];
  titulo: string;
}

let itens: ItemMenu[] = [
  {
    titulo: 'Menu',
    subItens: [
      {
        titulo: 'Perfil',
        icon: 'account_circle',
        idRota: 'Perfil',
        path: '#/perfil',
        ativado: false,
      },
      {
        titulo: 'Loja',
        icon: 'business',
        idRota: 'Loja',
        path: '#/loja',
        ativado: false,
      },
      {
        titulo: 'Relatório de vendas',
        icon: 'description',
        idRota: 'RelatorioVendas',
        path: '#/relatorio/vendas',
        ativado: false,
        beforeFunction: 'validarLojaCadastrada',
      },
    ],
  },
  {
    titulo: 'Produto',
    subItens: [
      {
        titulo: 'Cadastro / Listagem',
        icon: 'inventory_2',
        idRota: 'Produto',
        path: '#/produto',
        ativado: false,
        beforeFunction: 'validarLojaCadastrada',
      },
      {
        titulo: 'Entrada',
        icon: 'shopping_cart_checkout',
        idRota: 'ProdutoEntrada',
        path: '#/produto/entrada',
        ativado: false,
        beforeFunction: 'validarLojaCadastrada',
      },
      {
        titulo: 'Saída',
        icon: 'point_of_sale',
        idRota: 'ProdutoSaida',
        path: '#/produto/saida',
        ativado: false,
        beforeFunction: 'validarLojaCadastrada',
      },
      {
        titulo: 'Devolução',
        icon: 'receipt',
        idRota: 'ProdutoDevolucao',
        path: '#/produto/devolucao',
        ativado: false,
        beforeFunction: 'validarLojaCadastrada',
      },
    ],
  },
];
export default defineComponent({
  name: 'Dashboard',
  components: {},
  setup() {
    const $q = useQuasar();
    return {
      exibirNotificacao(message: string, tipo = 'sucesso') {
        const tipos = {
          aviso: 'yellow',
          sucesso: 'green',
          erro: 'red',
        };
        $q.notify({
          position: 'top',
          message: message,
          color: tipos[tipo],
        });
      },
    };
  },
  created() {
    DashboardEvent.logout.call = () => this.logout();
    DashboardEvent.exibirNotificacao.call = this.exibirNotificacao;
    DashboardEvent.obterUsuarioAutenticado.call = async () => {
      await usuarioService.obterUsuarioAutenticado().then((response) => {
        this.usuarioInfo = response.data as UsuarioInfo;
        DashboardEvent.atualizarUsuarioInfo.disparar(this.usuarioInfo);
        Utils.guardarUsuarioInfo(this.usuarioInfo as UsuarioInfo);
      });
    };
    DashboardEvent.atualizarUsuarioInfo.call = (usuarioInfo) => {
      this.imgUsuario = null;
      this.usuarioInfo = usuarioInfo;
      setTimeout(() => {
        this.imgUsuario = ImagemUtil.obterUrl(
          Utils.obterUsuarioInfo().id,
          TipoImagem.USUARIO
        );
      }, 1);
    };
    DashboardEvent.obterUsuarioAutenticado.disparar();
  },
  data: function () {
    let titulo = 'Loja';
    const itensSidebar = itens.map((itemMenu) => {
      itemMenu.subItens = itemMenu.subItens.map((subItem) => {
        subItem.ativado = subItem.path === location.hash;

        if (subItem.ativado) {
          titulo = subItem.titulo;
        }
        return subItem;
      });
      return itemMenu;
    });
    return {
      isOpenDrawer: false,
      tituloAtivado: titulo,
      itens: itensSidebar,
      imgUsuario: null as any,
      usuarioInfo: {} as any,
    };
  },
  methods: {
    imagemErro() {
      this.imgUsuario = null;
    },
    toggleDrawer() {
      this.isOpenDrawer = !this.isOpenDrawer;
    },
    goPage(subItem: SubItemMenu) {
      const funcoes = {
        validarLojaCadastrada: () => {
          if (!Utils.obterUsuarioInfo().lojaId) {
            Utils.exibirMensagemAviso(
              'Loja não cadastrada, por favor cadastre sua loja.'
            );
            return false;
          }
          return true;
        },
      };

      if (subItem.beforeFunction && !funcoes[subItem.beforeFunction]()) {
        return;
      }

      this.itens = this.itens.map((itemMenu: ItemMenu) => {
        itemMenu.subItens = itemMenu.subItens.map((item) => {
          item.ativado = subItem.path === item.path;
          return item;
        });
        return itemMenu;
      });
      this.tituloAtivado = subItem.titulo;
      this.$router.push({ name: subItem.idRota });
    },
    logout() {
      Utils.limparToken();
      Utils.limparUsuarioInfo();
      this.$router.push({ name: 'Login' });
    },
  },
});
</script>
<style lang='scss' scoped>
.title-header {
  display: flex;
  justify-content: space-between;
}
</style>
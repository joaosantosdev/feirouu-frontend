<template>
  <div>
    <div class="row">
      <div class="col-12 q-mb-md">
        <q-table
          title="Produtos"
          selection="single"
          class="tabela-produtos"
          v-model:selected="produtoSelecionadoLista"
          :rows="listaProdutos"
          :columns="tabelaProdutos.colunas"
          hide-selected-banner
          @update:selected="produtoSelecionadoEvento"
          rows-per-page-label="Por página"
          v-model:pagination="paginacaoTabela"
          :rows-per-page-options="[5, 10, 20]"
          @request="atualizarPaginacao"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core';
import { Paginacao } from 'src/application/models/Paginacao';
import { Produto } from 'src/application/models/Produto';
import { Utils } from 'src/application/utils';
import tabelaProdutos from './tabelaProdutos';
import produtoService from '../../application/services/produtoService';
import { ProdutoChaveEtiqueta } from 'src/application/models/ProdutoChaveEtiqueta';
import { TabelaEvento } from './TabelaEvento';

export default defineComponent({
  name: 'PesquisaProduto',
  props: {
    tabela: {} as any,
    status: {
      default: `1`,
    },
  },
  created() {
    this.pesquisarProdutos();
    TabelaEvento.desmarcar.fun = () => {
      this.produtoSelecionadoLista = [];
    };
    TabelaEvento.pesquisar.fun = () => {
      this.pesquisarProdutos();
    };
  },
  data: () => {
    return {
      paginacao: new Paginacao(1, 'nome', 5),
      tabelaProdutos: tabelaProdutos,
      listaProdutos: [],
      produtoSelecionadoLista: [],
      totalPaginas: 0,
      produto: new Produto(),
      chavesEtiquetas: [] as ProdutoChaveEtiqueta[],
    };
  },
  computed: {
    produtoEstaSelecionado(): boolean {
      return this.produtoSelecionadoLista.length > 0;
    },
    produtoSelecionado(): Produto {
      return this.produtoSelecionadoLista[0] as Produto;
    },
    paginacaoTabela() {
      return {
        page: this.paginacao.pagina,
        rowsNumber: this.paginacao.totalGeral,
        rowsPerPage: this.paginacao.porPagina,
        sortBy: this.paginacao.ordenarPor,
        descending: this.paginacao.direcao !== 'ASC',
      };
    },
  },
  methods: {
    pesquisarProdutos() {
      produtoService
        .buscar(Utils.obterUsuarioInfo().lojaId, {
          ...this.paginacao,
          pagina: this.paginacao.pagina - 1,
          status: JSON.stringify(this.status),
        })
        .then((response) => {
          this.listaProdutos = response.data.dados;
          this.paginacao.totalGeral = response.data.totalGeral;
          this.paginacao.total = response.data.total;
        });
    },
    produtoSelecionadoEvento() {
      if (this.produtoEstaSelecionado) {
        this.produto = { ...this.produtoSelecionado };
        this.produto.valorCompra = parseFloat(
          this.produtoSelecionado.valorCompra as string
        ).toFixed(2);
        this.produto.valorVenda = parseFloat(
          this.produtoSelecionado.valorVenda as string
        ).toFixed(2);
        this.chavesEtiquetas = this.produto.chavesEtiquetas;
        this.$emit('produtoSelecionado', this.produto);
      } else {
        this.$emit('produtoDeselecionado', this.produto);
      }
    },
    atualizarPaginacao({ pagination }: any) {
      this.paginacao.pagina = pagination.page;
      this.paginacao.porPagina = pagination.rowsPerPage;
      this.paginacao.direcao =
        pagination.descending && pagination.sortBy ? 'DESC' : 'ASC';
      this.paginacao.ordenarPor = pagination.sortBy || 'nome';
      this.pesquisarProdutos();
    },
  },
});
</script>
<style lang="scss" scoped>
.tabela-produtos {
}
</style>
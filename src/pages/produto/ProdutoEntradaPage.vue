<template>
  <div>
    <div class="q-pa-md">
      <h6 class="text-h6 titulo">Informações do produto</h6>

      <PesquisaProduto
        @produtoSelecionado="produtoSelecionadoEvento"
        @produtoDeselecionado="limpar"
      />
    </div>
    <q-form class="q-pa-md loja" @submit.prevent="salvar">
      <div class="row">
        <div class="col content-img q-mb-md q-pr-md">
          <div class="img-label">
            <img
              class="no-image"
              v-if="!imgProduto"
              src="../../assets/upload.png"
            />
            <img
              @error="imagemErro"
              class="img"
              v-if="imgProduto"
              :src="imgProduto"
            />
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col q-mb-md q-pr-md">
          <q-input
            v-model="movimentacao.quantidade"
            label="Quantidade"
            :disable="!produto.id"
            mask="########"
            reverse-fill-mask
            :error="erros.quantidade != null"
            :error-message="erros.quantidade"
            maxlength="20"
          />
        </div>
      </div>
      <div class="row" v-for="(item, index) in chavesEtiquetas" :key="index">
        <div class="col q-mb-md q-pr-md">
          <q-input
            v-model="valoresEtiquetas[index].valor"
            :label="item.nome"
            :error="erros.valoresEtiquetas[index] != null"
            :error-message="erros.valoresEtiquetas[index]"
            maxlength="20"
          />
        </div>
      </div>
      <div class="row">
        <div class="col-12 col-md-3 q-mb-md q-mr-md">
          <q-btn type="submit" class="full-width" color="primary">
            Salvar
          </q-btn>
        </div>
      </div>
    </q-form>
  </div>
</template>

<script lang="ts">
import { Produto } from 'src/application/models/Produto';
import { ProdutoChaveEtiqueta } from 'src/application/models/ProdutoChaveEtiqueta';
import { defineComponent } from 'vue';
import PesquisaProduto from '../../components/pesquisa-produto/PesquisaProduto.vue';
import MovimentacaoValorEtiqueta from '../../application/models/MovimentacaoValorEtiqueta';
import MovimentacaoEntrada from '../../application/models/MovimentacaoEntrada';
import validar from '../../application/validators/validar';
import { movimentacaoEntradaValidator } from '../../application/validators/movimentacaoValidator';
import { Utils } from 'src/application/utils';
import movimentacaoService from '../../application/services/movimentacaoService';
import { TabelaEvento } from 'src/components/pesquisa-produto/TabelaEvento';
import ImagemUtil from 'src/application/utils/imagemUtil';
import TipoImagem from 'src/application/models/TipoImagem';

export default defineComponent({
  components: { PesquisaProduto },
  setup() {},
  data: () => {
    return {
      produto: new Produto(),
      erros: {
        valoresEtiquetas: [] as string[],
      },
      chavesEtiquetas: [] as ProdutoChaveEtiqueta[],
      valoresEtiquetas: [] as MovimentacaoValorEtiqueta[],
      movimentacao: new MovimentacaoEntrada(),
      imgProduto: null as any,
    };
  },
  methods: {
    produtoSelecionadoEvento(produto: Produto) {
      this.produto = produto;

      this.imgProduto = ImagemUtil.obterUrl(produto.id, TipoImagem.PRODUTO);

      this.chavesEtiquetas = produto.chavesEtiquetas;
      this.valoresEtiquetas = this.chavesEtiquetas.map((item) => {
        return {
          produtoChaveEtiquetaId: item.id,
          valor: '',
        } as MovimentacaoValorEtiqueta;
      });
    },
    limpar() {
      this.produto = new Produto();
      this.chavesEtiquetas = [];
      this.valoresEtiquetas = [];
      this.movimentacao = new MovimentacaoEntrada();
      this.erros = {
        valoresEtiquetas: [] as string[],
      };
      TabelaEvento.desmarcar.disparar();
      this.imgProduto = null;
    },
    async salvar() {
      this.erros = await validar(
        movimentacaoEntradaValidator,
        this.movimentacao
      );

      this.valoresEtiquetas.forEach((item, index) => {
        if (item.valor.trim() == '') {
          if (!this.erros.valoresEtiquetas) {
            this.erros.valoresEtiquetas = [];
          }
          this.erros.valoresEtiquetas[index] = 'é um campo obrigatório';
        }
      });

      if (!Utils.temErro(this.erros)) {
        this.erros.valoresEtiquetas = [];
        this.movimentacao.valoresEtiquetas = this.valoresEtiquetas;

        const usuarioInfo = Utils.obterUsuarioInfo();
        movimentacaoService
          .registrarEntrada(
            usuarioInfo.lojaId,
            this.produto.id,
            this.movimentacao
          )
          .then(() => {
            Utils.exibirMensagem('Entrada de produto realizada com sucesso.');
            this.limpar();
          })
          .catch((erro) => Utils.exibirMensagemError(erro));
      }
    },
  },
});
</script>
<style lang="scss" scoped>
.content-img {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
</style>
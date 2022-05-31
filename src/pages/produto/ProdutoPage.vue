<template>
  <div>
    <q-form class="q-pa-md loja" @submit.prevent="validarProduto">
      <div class="row">
        <div class="col content-img q-mb-md q-pr-md">
          <label class="img-label">
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
            <input
              @error="imagemErro"
              ref="imgProduto"
              type="file"
              @change="selecionarImagem($event)"
            />
          </label>
        </div>
      </div>
      <div class="row">
        <div
          class="col flex q-mb-md q-pr-md justify-center items-center d-flex"
        >
          <q-btn type="button" @click="excluirImagem" color="negative"
            >Remover</q-btn
          >
        </div>
      </div>
      <div class="row">
        <div class="col q-mb-md q-pr-md">
          <q-input
            v-model="produto.nome"
            label="Nome"
            :error="erros.nome != null"
            :error-message="erros.nome"
            maxlength="50"
          />
        </div>
        <div class="col q-mb-md q-pl-md">
          <q-select
            :error="erros.status != null"
            :error-message="erros.status"
            input-debounce="0"
            v-model="status"
            :options="listaStatus"
            label="Status"
          />
        </div>
      </div>
      <div class="row">
        <div class="col q-mb-md q-pr-md">
          <q-input
            v-model="produto.valorCompra"
            label="Valor de compra"
            mask="#.##"
            fill-mask="0"
            reverse-fill-mask
            :error="erros.valorCompra != null"
            :error-message="erros.valorCompra"
          />
        </div>
        <div class="col q-mb-md q-pl-md">
          <q-input
            v-model="produto.valorVenda"
            label="Valor de venda"
            mask="#.##"
            fill-mask="0"
            reverse-fill-mask
            :error="erros.valorVenda != null"
            :error-message="erros.valorVenda"
          />
        </div>
      </div>
      <div class="row">
        <div class="col-12 q-mb-md">
          <q-input
            v-model="produto.descricao"
            label="Descrição"
            :error="erros.descricao != null"
            :error-message="erros.descricao"
            maxlength="50"
          />
        </div>
        <div class="col-6 q-mb-md">
          <q-input
            v-model="nomeEtiqueta"
            :error="erros.nomeEtiqueta != null"
            :error-message="erros.nomeEtiqueta"
            maxlength="20"
            label="Nome da etiqueta"
          />
        </div>
        <div class="col q-md-md items-end q-pr-md">
          <q-btn
            class="btn-etiqueta-add"
            color="primary"
            @click="adicionarProdutoEtiqueta"
            :icon="editandoEtiqueta ? 'done' : 'add'"
          />
          <q-btn
            class="btn-etiqueta-add"
            color="negative"
            @click="limparProdutoEtiqueta"
            icon="clear"
          />
        </div>
      </div>
      <div class="row">
        <div class="col q-mb-md">
          <q-btn
            color="white"
            v-for="(item, index) in chavesEtiquetas"
            :class="`etiqueta ${index != 0 ? 'mr15' : 'mr15'}`"
            :key="index"
            @click.prevent="editarProdutoEtiqueta(item)"
            text-color="primary"
            :label="item.nome"
          >
            <q-badge
              v-if="!produtoEstaSelecionado"
              color="negative"
              floating
              @click.prevent="removerProdutoEtiqueta(item)"
              >x</q-badge
            >
          </q-btn>
        </div>
      </div>
      <div class="row">
        <div class="q-mb-md q-mr-md">
          <q-btn type="submit" color="primary"> Salvar </q-btn>
        </div>
        <div class="q-mb-md q-mr-md">
          <q-btn @click="limparFormulario" color="primary"> Limpar </q-btn>
        </div>
        <div class="q-mb-md">
          <q-btn
            v-if="produto.id && !temMovimentacoes"
            @click="excluirProduto"
            color="negative"
          >
            Excluir
          </q-btn>
        </div>
      </div>
    </q-form>
    <div class="row q-pa-md">
      <div class="col">
        <PesquisaProduto
          :status="statusPesquisa"
          @produtoSelecionado="produtoSelecionadoEvento"
          @produtoDeselecionado="limparFormulario"
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import DashboardEvent from 'src/components/dashboard/dashboardEvent';
import { Produto } from '../../application/models/Produto';
import { ProdutoChaveEtiqueta } from 'src/application/models/ProdutoChaveEtiqueta';
import { Utils } from 'src/application/utils';
import validar from '../../application/validators/validar';
import { produtoValidator } from '../../application/validators/produtoValidator';
import produtoService from '../../application/services/produtoService';
import PesquisaProduto from '../../components/pesquisa-produto/PesquisaProduto.vue';
import { TabelaEvento } from 'src/components/pesquisa-produto/TabelaEvento';
import ImagemUtil from '../../application/utils/imagemUtil';
import TipoImagem from '../../application/models/TipoImagem';
import imagemService from '../../application/services/imagemService';

export default defineComponent({
  components: { PesquisaProduto },
  name: 'ProdutoPage',
  setup() {
    return {};
  },
  data: () => {
    return {
      produto: new Produto(),
      erros: {},
      valor: 123,
      exibirNotificacao: DashboardEvent.exibirNotificacao,
      chavesEtiquetas: [] as ProdutoChaveEtiqueta[],
      nomeEtiqueta: '',
      editandoEtiqueta: false,
      nomeAntigo: '',
      produtoEstaSelecionado: false,
      temMovimentacoes: false,
      listaStatus: Object.values(Utils.status as object),
      status: Utils.status.ativo,
      statusPesquisa: `${Utils.status.ativo.value as string},${
        Utils.status.inativo.value as string
      }`,
      imgProduto: null as any,
      imgFileProduto: null as any,
    };
  },

  methods: {
    async validarProduto() {
      this.produto.chavesEtiquetas = this.chavesEtiquetas;
      this.produto.status = this.status.value;

      this.erros = await validar(produtoValidator, this.produto);

      if (this.chavesEtiquetas.length == 0) {
        this.erros['nomeEtiqueta'] = 'Deve ter pelo menos 1 etiqueta.';
      }

      if (!Utils.temErro(this.erros)) {
        this.salvar(this.produto);
      }
    },
    selecionarImagem(event) {
      const file: Blob = event.target.files[0];
      this.limparInputImagem();
      if (FileReader && file) {
        var reader = new FileReader();
        reader.onload = () => {
          this.imgProduto = reader.result as any;
        };
        reader.readAsDataURL(file);
        this.imgFileProduto = file;
      }
    },
    imagemErro() {
      this.imgProduto = null;
    },
    limparInputImagem() {
      this.imgProduto = null;
      (this.$refs.imgProduto as any).value = null;
    },
    excluirImagem() {
      this.limparInputImagem();
      if (this.produto.id) {
        imagemService.excluir(this.produto.id, TipoImagem.PRODUTO);
      }
    },
    salvar(produto: Produto) {
      const cadastrarOuAtualizar = !this.produtoEstaSelecionado
        ? 'cadastrar'
        : 'atualizar';

      produtoService[cadastrarOuAtualizar](
        Utils.obterUsuarioInfo().lojaId,
        produto
      )
        .then(async (response) => {
          this.limparFormulario();
          Utils.exibirMensagem('Produto salvo com sucesso.');
          TabelaEvento.pesquisar.disparar();
          if (this.imgFileProduto) {
            const data = new FormData();
            data.set('imagem', this.imgFileProduto as Blob);
            data.set('tipo', `${TipoImagem.PRODUTO}`);
            const id = produto.id ? produto.id : (response.data.id as number);
            data.set('id', `${id}`);
            await imagemService.salvar(data);
            this.limparInputImagem();
          }
        })
        .catch((erro) => Utils.exibirMensagemError(erro));
    },
    adicionarProdutoEtiqueta() {
      if (this.nomeEtiqueta == '') {
        this.erros['nomeEtiqueta'] = 'Campo obrigatório';
        return;
      }

      const listaRepetidos = this.chavesEtiquetas.filter((item) => {
        let nomesIguais =
          item.nome.toLowerCase() == this.nomeEtiqueta.toLowerCase();
        if (
          nomesIguais &&
          this.editandoEtiqueta &&
          item.nome.toLowerCase() === this.nomeAntigo.toLowerCase()
        ) {
          nomesIguais = false;
        }
        return nomesIguais;
      });

      if (listaRepetidos.length > 0) {
        this.erros['nomeEtiqueta'] = 'Não pode ter etiquetas com o mesmo nome';
        return;
      }
      if (this.chavesEtiquetas.length == 5 && !this.editandoEtiqueta) {
        return Utils.exibirMensagem('Número máximo de etiqueta atingido.');
      }
      if (this.editandoEtiqueta) {
        this.chavesEtiquetas = this.chavesEtiquetas.map((item) => {
          if (item.nome.toLowerCase() == this.nomeAntigo.toLowerCase()) {
            item.nome = this.nomeEtiqueta;
          }
          return item;
        });
      } else {
        const etiqueta = new ProdutoChaveEtiqueta();
        etiqueta.nome = this.nomeEtiqueta;
        this.chavesEtiquetas.push(etiqueta);
      }

      this.erros['nomeEtiqueta'] = null;
      this.nomeEtiqueta = '';
      this.editandoEtiqueta = false;
    },
    editarProdutoEtiqueta(item: any) {
      this.nomeEtiqueta = item.nome;
      this.nomeAntigo = item.nome;
      this.editandoEtiqueta = true;
    },
    limparProdutoEtiqueta() {
      this.nomeEtiqueta = '';
      this.editandoEtiqueta = false;
    },
    removerProdutoEtiqueta(etiqueta: any) {
      if (this.editandoEtiqueta) {
        return Utils.exibirError('Cancela a ediçao da etiqueta.');
      }
      this.chavesEtiquetas = this.chavesEtiquetas.filter(
        (item) => item.nome != etiqueta.nome
      );
    },
    limparFormulario() {
      this.produto = new Produto();
      this.chavesEtiquetas = [];
      this.nomeEtiqueta = '';
      this.nomeAntigo = '';
      this.erros = {};
      this.produtoEstaSelecionado = false;
      this.status = Utils.status.ativo;
      TabelaEvento.desmarcar.disparar();
      this.limparInputImagem();
    },
    produtoSelecionadoEvento(produto: Produto) {
      produtoService
        .temMovimentacoes(produto.id, Utils.obterUsuarioInfo().lojaId)
        .then((response) => {
          this.temMovimentacoes = response.data;
          this.produto = produto;
          this.status =
            produto.status == Utils.status.ativo.value
              ? Utils.status.ativo
              : Utils.status.inativo;
          this.chavesEtiquetas = produto.chavesEtiquetas;
          this.produtoEstaSelecionado = true;
          this.imgProduto = ImagemUtil.obterUrl(produto.id, TipoImagem.PRODUTO);
        });
    },
    excluirProduto() {
      produtoService
        .excluir(this.produto.id, Utils.obterUsuarioInfo().lojaId)
        .then(() => {
          Utils.exibirMensagem('Produto excluído com sucesso');
          TabelaEvento.pesquisar.disparar();
          this.limparFormulario();
        })
        .catch((erro) => Utils.exibirMensagemError(erro));
    },
  },
});
</script>
<style lang="scss">
.titulo {
  color: $grey-9;
}
.btn-etiqueta-add {
  margin-top: 20px;
  margin-left: 10px;
}
.mr15 {
  margin-right: 15px;
}
.etiqueta {
  cursor: pointer;
  margin-bottom: 10px;
}
.btn-pesquisar {
  margin-top: 20px;
}
.img-label {
  width: 200px;
  height: 200px;
  border-radius: 5px;
  background-color: #ececec;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.img-label .img {
  width: 200px;
  height: 200px;
  border-radius: 5px;
}
.img-label input {
  display: none;
}
.content-img {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
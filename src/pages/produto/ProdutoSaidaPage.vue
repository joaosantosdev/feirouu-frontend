<template>
  <div>
    <q-form class="q-pa-md loja" @submit.prevent="registrarSaidas">
      <h6 class="text-h6 titulo">Informações do cliente</h6>

      <div class="row">
        <div class="col q-mb-md q-pr-md">
          <q-input
            v-model="cliente.nome"
            label="Nome"
            :error="errosCliente.nome != null"
            :error-message="errosCliente.nome"
            maxlength="50"
          />
        </div>
        <div class="col q-mb-md q-pl-md">
          <q-input
            v-model="cliente.cpf"
            label="CPF"
            :error="errosCliente.cpf != null"
            :error-message="errosCliente.cpf"
            maxlength="11"
          />
        </div>
      </div>
      <div class="row">
        <div class="col q-mb-md q-pr-md">
          <q-input
            v-model="cliente.email"
            label="Email"
            :error="errosCliente.email != null"
            :error-message="errosCliente.email"
            maxlength="50"
          />
        </div>
        <div class="col q-mb-md q-pl-md">
          <q-input
            v-model="cliente.telefone"
            label="Telefone"
            :error="errosCliente.telefone != null"
            :error-message="errosCliente.telefone"
            maxlength="11"
          />
        </div>
      </div>

      <h6 class="text-h6 titulo">Informações do produto</h6>
      <PesquisaProduto
        :tabela="tabela"
        @produtoSelecionado="produtoSelecionadoEvento"
        @produtoDeselecionado="limpar"
      />
      <div class="row">
        <div class="col q-mb-md q-pr-md">
          <q-input
            disable
            readonly
            v-model="quantidadeDisponivel.valor"
            label="Quantidade Disponível"
            maxlength="20"
          />
        </div>
      </div>
      <div class="row">
        <div class="col q-mb-md q-pr-md">
          <q-input
            v-model="movimentacao.quantidade"
            label="Quantidade"
            mask="########"
            :disable="desabilitarCampos"
            reverse-fill-mask
            :error="erros.quantidade != null"
            :error-message="erros.quantidade"
            maxlength="20"
          />
        </div>
        <div class="col q-mb-md q-pr-md">
          <q-input
            v-model="movimentacao.valorDesconto"
            label="Valor de desconto"
            mask="#.##"
            :disable="desabilitarCampos"
            fill-mask="0"
            reverse-fill-mask
            :error="erros.valorDesconto != null"
            :error-message="erros.valorDesconto"
          />
        </div>
      </div>
      <div class="row">
        <div class="col q-mb-md q-pr-md">
          <q-input
            v-model="valorTotal"
            label="Valor total"
            mask="#.##"
            readonly
            :disable="desabilitarCampos"
            fill-mask="0"
            reverse-fill-mask
          />
        </div>
      </div>
      <div class="row">
        <div class="col-12 col-md-3 q-mb-md q-mr-md">
          <q-btn
            type="submit"
            color="primary q-mr-md"
            :disable="desabilitarCampos"
          >
            Registrar
          </q-btn>
          <q-btn color="primary" @click="limparGeral"> Limpar </q-btn>
        </div>
      </div>
    </q-form>
  </div>
</template>

<script lang="ts">
import { Produto } from 'src/application/models/Produto';
import { defineComponent } from 'vue';
import PesquisaProduto from '../../components/pesquisa-produto/PesquisaProduto.vue';
import validar from '../../application/validators/validar';
import { movimentacaoSaidaValidator } from '../../application/validators/movimentacaoValidator';
import { Utils } from 'src/application/utils';
import movimentacaoService from '../../application/services/movimentacaoService';
import { Cliente } from '../../application/models/Cliente';
import MovimentacaoSaida from '../../application/models/MovimentacaoSaida';
import ListaMovimentacaoSaida from '../../application/models/ListaMovimentacaoSaida';
import { clienteValidator } from '../../application/validators/clienteValidator';
import { TabelaEvento } from 'src/components/pesquisa-produto/TabelaEvento';

export default defineComponent({
  components: { PesquisaProduto },
  name: 'ProdutoSaidaPage',
  setup() {},
  data: () => {
    return {
      produto: new Produto(),
      errosCliente: {},
      erros: {},
      cliente: new Cliente(),
      movimentacao: new MovimentacaoSaida(),
      tabela: {
        desmarcar: null as any,
      },
      quantidadeDisponivel: {
        valor: 0,
      },
    };
  },
  computed: {
    valorTotal() {
      let valorDesconto = this.movimentacao.valorDesconto || 0;
      const valorVenda = this.produto.valorVenda || 0;
      const quantidade = this.movimentacao.quantidade || 0;
      const valorSemDesconto = valorVenda * quantidade;
      if (valorDesconto > valorSemDesconto) {
        valorDesconto = valorSemDesconto;
      }
      const total = quantidade * valorVenda - valorDesconto;
      return total.toFixed(2);
    },
    desabilitarCampos() {
      return !this.produto.id || this.quantidadeDisponivel.valor == 0;
    },
  },
  methods: {
    produtoSelecionadoEvento(produto: Produto) {
      this.produto = produto;
      movimentacaoService
        .obterQuantidadeDisponivelSaida(
          Utils.obterUsuarioInfo().lojaId,
          produto.id
        )
        .then((response) => {
          this.quantidadeDisponivel.valor = response.data;
        });
    },
    limpar() {
      this.produto = new Produto();
      this.movimentacao = new MovimentacaoSaida();
      this.erros = {};
      TabelaEvento.desmarcar.disparar();
    },
    limparGeral() {
      this.limpar();
      this.cliente = new Cliente();
      this.errosCliente = {};
    },
    async registrarSaidas() {
      console.log('aq');
      this.erros = await validar(movimentacaoSaidaValidator, this.movimentacao);

      this.errosCliente = await validar(clienteValidator, this.cliente);

      if (!Utils.temErro(this.erros) && !Utils.temErro(this.errosCliente)) {
        const usuarioInfo = Utils.obterUsuarioInfo();
        this.movimentacao.produtoId = this.produto.id;

        const total = this.movimentacao.quantidade * this.produto.valorVenda;
        if (this.movimentacao.valorDesconto > total) {
          this.movimentacao.valorDesconto = total;
        }

        movimentacaoService
          .registrarSaidas(
            usuarioInfo.lojaId,
            new ListaMovimentacaoSaida(this.cliente, [this.movimentacao])
          )
          .then(() => {
            Utils.exibirMensagem('Saída de produto realizada com sucesso.');
            this.limpar();
          })
          .catch((erro) => Utils.exibirMensagemError(erro));
      }
    },
  },
});
</script>
<style lang="scss" >
</style>
<template>
  <div>
    <q-form class="q-pa-md loja" @submit.prevent="registrarDevolucoes">
      <h6 class="text-h6 titulo">Informações do cliente</h6>

      <div class="row">
        <div class="col q-mb-md">
          <q-input v-model="cpf" label="CPF" maxlength="11" />
        </div>
        <div class="col q-mb-md">
          <q-btn
            color="primary"
            class="btn-pesquisar-cliente"
            @click="pesquisarSaidas"
          >
            Pesquisar
          </q-btn>
        </div>
      </div>

      <h6 class="text-h6 titulo">Movimentações</h6>
      <div>
        <div class="row">
          <div class="col-12 q-mb-md">
            <q-table
              title=""
              selection="single"
              v-model:selected="movimentacaoSelecionadaLista"
              :rows="listaMovimentacoes"
              :columns="tabela.colunas"
              @update:selected="movimentacaoSelecionadaEvento"
              hide-selected-banner
              rows-per-page-label="Por página"
              :rows-per-page-options="[5, 10, 20]"
            />
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col q-mb-md q-pr-md">
          <q-input
            v-model="movimentacao.quantidade"
            label="Quantidade"
            mask="########"
            :disable="!movimentacao.movimentacaoReferenciaId"
            reverse-fill-mask
            :error="erros.quantidade != null"
            :error-message="erros.quantidade"
            maxlength="20"
          />
        </div>
      </div>
      <div class="row">
        <div class="col-12 col-md-3 q-mb-md q-mr-md">
          <q-btn type="submit" color="primary q-mr-md"> Registrar </q-btn>
          <q-btn color="primary" @click="limpar"> Limpar </q-btn>
        </div>
      </div>
    </q-form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Utils } from 'src/application/utils';
import movimentacaoService from '../../application/services/movimentacaoService';
import tabelaMovimentacaoDevolucao from './tabelaMovimentacaoDevolucao';
import MovimentacaoDevolucao from '../../application/models/MovimentacaoDevolucao';
import validar from '../../application/validators/validar';
import { movimentacaoDevolucaoValidator } from '../../application/validators/movimentacaoValidator';
import ListaMovimentacaoDevolucao from 'src/application/models/ListaMovimentacaoDevolucao';

export default defineComponent({
  components: {},
  name: 'ProdutoDevolucaoPage',
  setup() {},
  data: () => {
    return {
      erros: {},
      cpf: '',
      tabela: tabelaMovimentacaoDevolucao,
      listaMovimentacoes: [],
      movimentacaoSelecionadaLista: [],
      movimentacao: new MovimentacaoDevolucao(),
    };
  },
  methods: {
    pesquisarSaidas() {
      this.limpar();
      movimentacaoService
        .obterSaidasPorClienteCpfLojaId(
          Utils.obterUsuarioInfo().lojaId,
          this.cpf
        )
        .then((response) => {
          this.listaMovimentacoes = response.data.map((item) => {
            const data = new Date(item.dataHora as string);

            const dataFormatada = `${Utils.adicionarZero(
              data.getDate()
            )}/${Utils.adicionarZero(data.getMonth())}/${data.getFullYear()} `;

            const horaFormatada = `${Utils.adicionarZero(
              data.getHours()
            )}:${Utils.adicionarZero(data.getMinutes())} `;

            return {
              ...item,
              dataHora: dataFormatada + ' ' + horaFormatada,
            };
          });
        });
    },
    async registrarDevolucoes() {
      this.erros = await validar(
        movimentacaoDevolucaoValidator,
        this.movimentacao
      );

      if (!Utils.temErro(this.erros)) {
        const usuarioInfo = Utils.obterUsuarioInfo();
        movimentacaoService
          .registrarDevolucoes(
            usuarioInfo.lojaId,
            new ListaMovimentacaoDevolucao([this.movimentacao])
          )
          .then(() => {
            Utils.exibirMensagem('Devolução realizada com sucesso.');
            this.pesquisarSaidas();
          })
          .catch((erro) => Utils.exibirMensagemError(erro));
      }
    },
    limpar() {
      this.movimentacao = new MovimentacaoDevolucao();
      this.movimentacaoSelecionadaLista = [];
    },
    movimentacaoSelecionadaEvento() {
      if (this.movimentacaoSelecionadaLista.length > 0) {
        const item: any = this.movimentacaoSelecionadaLista[0];
        this.movimentacao.movimentacaoReferenciaId = item.id;
        return;
      }
    },
  },
});
</script>
<style lang="scss" >
.btn-pesquisar-cliente {
  margin-top: 20px;
  margin-left: 10px;
}
</style>
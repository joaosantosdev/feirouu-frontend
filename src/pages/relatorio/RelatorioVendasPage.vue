<template>
  <div class="q-pa-md">
    <div class="row">
      <div class="col-12 q-pr-md col-md-6">
        <q-input
          label="Data inicial"
          mask="##/##/####"
          v-model="periodo.inicial"
        />
      </div>
      <div class="col-12 col-md-6">
        <q-input label="Data final" mask="##/##/####" v-model="periodo.final" />
      </div>
    </div>
    <q-btn
      label="Pesquisar"
      @click="pesquisar"
      class="q-mt-md"
      color="primary"
    />

    <div class="relatorio">
      <div class="header">
        <div class="titulo">Produto</div>
        <div class="titulo">Quantidade</div>
        <div class="titulo">Valor de compra</div>
        <div class="titulo">Valor de venda</div>
        <div class="titulo">Desconto</div>
        <div class="titulo">Preço final de venda</div>
        <div class="titulo">Lucro</div>
      </div>
      <div class="body" v-for="(item, index) of dadosRelatorio" :key="index">
        <div class="titulo">{{ item.nome }}</div>
        <div class="titulo">{{ item.quantidade }}</div>
        <div class="titulo">{{ item.valorCompra }}</div>
        <div class="titulo">{{ item.valorVenda }}</div>
        <div class="titulo">{{ item.valorDesconto }}</div>
        <div class="titulo">{{ item.precoFinal }}</div>
        <div class="titulo">{{ item.lucro }}</div>
      </div>
    </div>
    <div class="total">Lucro total: R$ {{ lucroTotal }}</div>
    <div class="total">Total de vendas: R$ {{ totalVendas }}</div>
    <div class="total">Quantidade total vendida: {{ qtdVendas }}</div>
  </div>
</template>
<script lang="ts">
import { Utils } from 'src/application/utils';
import { defineComponent } from 'vue';
import movimentacaoService from '../../application/services/movimentacaoService';

export default defineComponent({
  name: 'RelatorioVendasPage',
  created() {},
  data: () => {
    return {
      periodo: {
        inicial: Utils.dataBr(new Date()),
        final: Utils.dataBr(new Date()),
      },
      dadosRelatorio: [] as any[],
    };
  },
  methods: {
    pesquisar() {
      const copiaPeriodo = { ...this.periodo };
      const periodo = {
        inicial: Utils.dataStrParaDate(copiaPeriodo.inicial),
        final: Utils.dataStrParaDate(copiaPeriodo.final),
      };
      if (
        isNaN(periodo.inicial.getMonth()) ||
        isNaN(periodo.final.getMonth())
      ) {
        Utils.exibirMensagem('Informe um período valido.', 'erro');
        return;
      }

      if (periodo.inicial.getTime() > periodo.final.getTime()) {
        Utils.exibirMensagem(
          'Período inicial deve ser menor que o final.',
          'erro'
        );
        return;
      }

      movimentacaoService
        .obterRelatorioVendas(
          Utils.obterUsuarioInfo().lojaId,
          Utils.dateParaDataSQL(periodo.inicial),
          Utils.dateParaDataSQL(periodo.final)
        )
        .then((response) => {
          this.dadosRelatorio = response.data.map((item) => {
            return {
              ...item,
              lucro:
                item.valorVenda * item.quantidade -
                item.valorDesconto -
                item.quantidade * item.valorCompra,
              precoFinal:
                item.quantidade * item.valorVenda - item.valorDesconto,
            };
          });
        });
    },
  },
  computed: {
    lucroTotal() {
      let total = 0;
      for (let item of this.dadosRelatorio) {
        total += item.lucro;
      }
      return total;
    },
    totalVendas() {
      let total = 0;
      for (let item of this.dadosRelatorio) {
        total += item.precoFinal;
      }
      return total;
    },
    qtdVendas() {
      let total = 0;
      for (let item of this.dadosRelatorio) {
        total += item.quantidade;
      }
      return total;
    },
  },
});
</script>
<style lang="scss">
.relatorio {
  display: flex;
  flex-direction: column;
  border: 1px solid #c2c2c2;
  margin-top: 10px;
}
.relatorio .header,
.body {
  display: flex;
  flex-direction: row;
}
.relatorio .header .body,
.titulo {
  display: flex;
  justify-content: start;
  align-items: center;
  padding: 10px 5px 10px 5px;

  width: 100%;
}
.relatorio .header .titulo {
  font-weight: bold;
}
.total {
  margin-top: 10px;
  font-size: 15px;
}
</style>
<template>
  <div>
    <q-toolbar class="bg-primary text-white shadow-2">
      <q-toolbar-title class="title-header">
        <div>Feirouu - Produtos</div>
      </q-toolbar-title>
    </q-toolbar>
    <div class="q-pa-md">
      <div class="row" v-for="(row, index) of produtosGroups" :key="index">
        <div
          class="col-12 col-md-4 q-mt-md q-pa-md content-card"
          v-for="(produto, indexCol) of row"
          :key="indexCol"
        >
          <q-card class="my-card" style="flex: 1; cursor: pointer">
            <img
              v-if="!imagensErros[produto.id]"
              :src="getImagem(produto)"
              @error="imagemErro(produto)"
            />
            <img
              v-if="imagensErros[produto.id]"
              src="https://cdn.quasar.dev/img/material.png"
            />

            <q-card-section>
              <div class="text-h6">{{ produto.nome }}</div>
              <div class="text-subtitle2">
                Valor: R$ {{ produto.valorVenda }}
              </div>
            </q-card-section>

            <q-card-section class="q-pt-none">
              {{ produto.descricao }}
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import TipoImagem from 'src/application/models/TipoImagem';
import lojaService from 'src/application/services/lojaService';
import { Utils } from 'src/application/utils';
import ImagemUtil from 'src/application/utils/imagemUtil';
import { defineComponent } from 'vue';
import produtoService from '../../application/services/produtoService';

export default defineComponent({
  name: 'LojaProdutosPage',
  created() {
    const lojaStr = this.$router.currentRoute.value.params.loja as string;
    if (lojaStr == null) {
      this.$router.push({ name: 'HomePage' });
      return;
    }
    this.loja = JSON.parse(lojaStr);

    produtoService.obterPorLoja(this.loja.id as string).then((response) => {
      this.produtosGroups = this.chunk(response.data, 3);
    });
  },
  data: () => {
    return {
      periodo: {
        inicial: Utils.dataBr(new Date()),
        final: Utils.dataBr(new Date()),
      },
      produtosGroups: [],
      imagensErros: {},
      loja: null as any,
    };
  },
  methods: {
    chunk(array: any, size: number) {
      var myArray = [] as any;
      for (var i = 0; i < array.length; i += size) {
        myArray.push(array.slice(i, i + size));
      }
      return myArray;
    },
    getImagem(item: any) {
      return ImagemUtil.obterUrl(item.id as number, TipoImagem.PRODUTO);
    },
    imagemErro(loja) {
      this.imagensErros[loja.id] = true;
    },
  },
});
</script>
<style lang="scss">
.content-card {
  display: flex;
  flex-direction: column;
}
</style>
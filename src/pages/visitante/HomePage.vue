<template>
  <div>
    <q-toolbar class="bg-primary text-white shadow-2">
      <q-toolbar-title class="title-header">
        <div>Feirouu - Lojas</div>
      </q-toolbar-title>
    </q-toolbar>
    <div class="q-pa-md">
      <div class="row" v-for="(row, index) of lojasGroups" :key="index">
        <div
          class="col-12 col-md-4 q-mt-md q-pa-md content-card"
          v-for="(loja, indexCol) of row"
          :key="indexCol"
        >
          <q-card
            @click="irLojaProdutos(loja)"
            class="my-card"
            style="flex: 1; cursor: pointer"
          >
            <img
              v-if="!imagensErros[loja.id]"
              :src="getImagem(loja)"
              @error="imagemErro(loja)"
            />
            <img
              v-if="imagensErros[loja.id]"
              src="https://cdn.quasar.dev/img/material.png"
            />

            <q-card-section>
              <div class="text-h6">{{ loja.nome }}</div>
              <div class="text-subtitle2">Telefone: {{ loja.telefone }}</div>
            </q-card-section>

            <q-card-section class="q-pt-none">
              {{ loja.descricao }}
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

export default defineComponent({
  name: 'HomePage',
  created() {
    lojaService.obterLojas().then((response) => {
      this.lojasGroups = this.chunk(response.data.data, 3);
    });
  },
  data: () => {
    return {
      periodo: {
        inicial: Utils.dataBr(new Date()),
        final: Utils.dataBr(new Date()),
      },
      dadosRelatorio: [] as any[],
      lojasGroups: [],
      imagensErros: {},
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
      return ImagemUtil.obterUrl(item.id as number, TipoImagem.LOJA);
    },
    imagemErro(loja) {
      this.imagensErros[loja.id] = true;
    },
    irLojaProdutos(loja) {
      this.$router.push({
        name: 'LojaProdutos',
        params: {
          loja: JSON.stringify(loja),
        },
      });
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
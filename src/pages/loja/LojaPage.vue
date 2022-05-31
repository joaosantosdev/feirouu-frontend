<template>
  <q-form class="q-pa-md loja" @submit.prevent="validarLoja">
    <div class="row">
      <div class="col content-img q-mb-md q-pr-md">
        <label class="img-label">
          <img class="no-image" v-if="!imgLoja" src="../../assets/upload.png" />
          <img @error="imagemErro" class="img" v-if="imgLoja" :src="imgLoja" />
          <input
            @error="imagemErro"
            ref="imgLoja"
            type="file"
            @change="selecionarImagem($event)"
          />
        </label>
      </div>
    </div>
    <div class="row">
      <div class="col flex q-mb-md q-pr-md justify-center items-center d-flex">
        <q-btn type="button" @click="removerImagem" color="negative"
          >Remover</q-btn
        >
      </div>
    </div>
    <h6 class="text-h6 titulo">Perfil da Loja</h6>
    <div class="row">
      <div class="col">
        <q-input
          v-model="loja.nome"
          label="Nome"
          :error="erros.nome != null"
          :error-message="erros.nome"
          maxlength="50"
          class="q-mb-md"
        />
      </div>
    </div>
    <div class="row">
      <div class="col q-pr-md">
        <q-input
          v-model="loja.email"
          label="Email"
          :error="erros.email != null"
          :error-message="erros.email"
          maxlength="150"
          class="q-mb-md"
        />
      </div>
      <div class="col q-pl-md">
        <q-input
          v-model="loja.telefone"
          label="Telefone"
          :error="erros.telefone != null"
          :error-message="erros.telefone"
          mask="###########"
          maxlength="11"
          class="q-mb-md"
        />
      </div>
    </div>
    <div class="row">
      <div class="col">
        <q-input
          v-model="loja.descricao"
          label="Descrição"
          :error="erros.descricao != null"
          :error-message="erros.descricao"
          maxlength="300"
          class="q-mb-md"
          type="textarea"
          autogrow
        />
      </div>
    </div>
    <h6 class="text-h6 titulo">Endereço da Loja</h6>
    <div class="row">
      <div class="col q-mb-lg q-pr-md">
        <q-select
          @filter="filtrarEstados"
          @update:model-value="pesquisarCidades"
          use-input
          :error="errosEndereco.estadoId != null"
          :error-message="errosEndereco.estadoId"
          input-debounce="0"
          v-model="estado"
          :options="listaEstados"
          label="Estados"
        />
      </div>
      <div class="col q-pl-lg q-mb-md">
        <q-select
          @filter="filtrarCidades"
          use-input
          :error="errosEndereco.cidadeId != null"
          :error-message="errosEndereco.cidadeId"
          input-debounce="0"
          v-model="cidade"
          :options="listaCidades"
          label="Cidade"
        />
      </div>
    </div>
    <div class="row">
      <div class="col q-pr-md">
        <q-input
          v-model="endereco.bairro"
          label="Bairro"
          :error="errosEndereco.bairro != null"
          :error-message="errosEndereco.bairro"
          maxlength="100"
          class="q-mb-md"
        />
      </div>
      <div class="col q-pl-md">
        <q-input
          v-model="endereco.rua"
          label="Rua"
          :error="errosEndereco.rua != null"
          :error-message="errosEndereco.rua"
          maxlength="100"
          class="q-mb-md"
        />
      </div>
    </div>
    <div class="row">
      <div class="col q-pr-md">
        <q-input
          v-model="endereco.cep"
          label="Cep"
          :error="errosEndereco.cep != null"
          :error-message="errosEndereco.cep"
          maxlength="11"
          class="q-mb-md"
          autogrow
        />
      </div>
      <div class="col q-pl-md">
        <q-input
          v-model="endereco.numero"
          label="Número"
          :error="errosEndereco.numero != null"
          :error-message="errosEndereco.numero"
          maxlength="11"
          class="q-mb-md"
        />
      </div>
    </div>

    <div class="row">
      <div class="col">
        <q-input
          v-model="endereco.complemento"
          label="Complemento"
          :error="errosEndereco.complemento != null"
          :error-message="errosEndereco.complemento"
          maxlength="100"
          class="q-mb-md"
        />
      </div>
    </div>

    <q-btn type="submit" class="full-width" color="primary"> Cadastrar </q-btn>
  </q-form>
</template>
<script lang="ts">
import { Endereco } from 'src/application/models/Endereco';
import { Loja } from 'src/application/models/Loja';
import { defineComponent } from 'vue';
import enderecoService from '../../application/services/enderecoService';
import validar from '../../application/validators/validar';
import { enderecoValidator } from '../../application/validators/enderecoValidator';
import { lojaValidator } from '../../application/validators/lojaValidator';
import { Utils } from 'src/application/utils';
import lojaService from '../../application/services/lojaService';
import DashboardEvent from 'src/components/dashboard/dashboardEvent';
import imagemService from '../../application/services/imagemService';
import TipoImagem from 'src/application/models/TipoImagem';
import ImagemUtil from 'src/application/utils/imagemUtil';

export default defineComponent({
  name: 'LojaPage',
  created() {
    enderecoService
      .obterEstados()
      .then((response) => {
        this.estados = response.data.map((item: any) => ({
          label: item.nome,
          value: item.id,
        }));
        this.listaEstados = [...this.estados];
        this.pesquisarLoja();
      })
      .catch((erro) => {});
  },
  data: () => {
    return {
      listaEstados: [],
      estados: [],
      cidades: [],
      listaCidades: [],
      loja: new Loja(),
      endereco: new Endereco(),
      erros: {},
      errosEndereco: {},
      estado: null as any,
      cidade: null as any,
      exibirNotificacao: DashboardEvent.exibirNotificacao,
      imgLoja: null as any,
      imgFileLoja: null as any,
    };
  },
  methods: {
    selecionarImagem(event) {
      const file: Blob = event.target.files[0];
      this.removerImagem();
      if (FileReader && file) {
        var reader = new FileReader();
        reader.onload = () => {
          this.imgLoja = reader.result as any;
        };
        reader.readAsDataURL(file);
        this.imgFileLoja = file;
      }
    },
    imagemErro() {
      this.imgLoja = null;
    },
    removerImagem() {
      this.imgLoja = null;
      (this.$refs.imgLoja as any).value = null;
      if (this.loja.id) {
        imagemService.excluir(this.loja.id, TipoImagem.LOJA);
      }
    },
    async validarLoja() {
      this.erros = await validar(lojaValidator, this.loja);

      if (this.cidade) {
        this.endereco.cidadeId = this.cidade.value;
      }

      this.errosEndereco = await validar(enderecoValidator, {
        ...this.endereco,
        estadoId: this.estado?.value,
      });
      if (!Utils.temErro(this.erros) && !Utils.temErro(this.errosEndereco)) {
        this.loja.endereco = this.endereco;
        this.loja.id = Utils.obterUsuarioInfo().lojaId;
        this.salvar(this.loja);
      }
    },
    filtrarEstados(val: string, update: any): void {
      update(() => {
        if (val === '' || val == null) {
          this.listaEstados = [...this.estados];
          return;
        }
        this.listaEstados = this.estados.filter((item: any) =>
          item.label.toLowerCase().includes(val.toLowerCase())
        );
      });
    },
    filtrarCidades(val: string, update: any): void {
      update(() => {
        if (val === '' || val == null) {
          this.listaCidades = [...this.cidades];
          return;
        }
        this.listaCidades = this.cidades.filter((item: any) =>
          item.label.toLowerCase().includes(val.toLowerCase())
        );
      });
    },
    async pesquisarCidades(item: any) {
      this.cidade = null;
      await enderecoService
        .obterCidadePorEstado(item.value as number)
        .then((response) => {
          this.cidades = response.data.map((item: any) => ({
            label: item.nome,
            value: item.id,
          }));
          this.listaCidades = [...this.cidades];
        });
    },
    salvar(loja: Loja) {
      const cadastrarOuAtualizar = loja.id ? 'atualizar' : 'cadastrar';
      lojaService[cadastrarOuAtualizar](loja)
        .then(async (response) => {
          DashboardEvent.exibirNotificacao.disparar('Loja salva com sucesso.');
          if (this.imgFileLoja) {
            const data = new FormData();
            data.set('imagem', this.imgFileLoja as Blob);
            data.set('tipo', `${TipoImagem.LOJA}`);
            const id = loja.id ? loja.id : (response.data.id as number);
            data.set('id', `${id}`);
            await imagemService.salvar(data);
          }
          await DashboardEvent.obterUsuarioAutenticado.disparar();
          if (!loja.id) {
            this.pesquisarLoja();
          }
        })
        .catch((erro) => Utils.exibirMensagemError(erro));
    },
    pesquisarLoja() {
      if (Utils.obterUsuarioInfo().lojaId) {
        lojaService
          .obterLojaPorId(Utils.obterUsuarioInfo().lojaId)
          .then(async (response) => {
            this.loja = response.data.data[0] as Loja;

            this.imgLoja = ImagemUtil.obterUrl(this.loja.id, TipoImagem.LOJA);

            this.endereco = this.loja.endereco;

            this.estado = this.estados.filter(
              (item: any) => item.value == this.loja.endereco.estadoId
            )[0];

            await this.pesquisarCidades(this.estado);

            this.cidade = this.cidades.filter(
              (item: any) => item.value == this.loja.endereco.cidadeId
            )[0];
          })
          .catch((erro) => Utils.exibirMensagemError(erro));
      }
    },
  },
});
</script>
<style lang="scss">
.titulo {
  color: $grey-9;
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
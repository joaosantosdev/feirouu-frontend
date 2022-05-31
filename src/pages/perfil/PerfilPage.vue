<template>
  <q-form class="q-pa-md loja" @submit.prevent="abrirCodigoVerificacao">
    <div class="row">
      <div class="col content-img q-mb-md q-pr-md">
        <label class="img-label">
          <img
            class="no-image"
            v-if="!imgUsuario"
            src="../../assets/user_128x128.png"
          />
          <img
            @error="imagemErro"
            class="img"
            v-if="imgUsuario"
            :src="imgUsuario"
          />
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
        <q-btn type="button" @click="excluirImagem" color="negative"
          >Remover</q-btn
        >
      </div>
    </div>
    <q-input
      v-model="usuario.nome"
      aria-errormessage="a"
      label="Nome"
      data-cy="input-signup-name"
      :error="erros.nome != null"
      :error-message="erros.nome"
      maxlength="50"
      class="q-mb-md"
    />
    <q-input
      v-model="usuario.email"
      label="Email"
      maxlength="100"
      class="q-mb-md"
      data-cy="input-signup-email"
      :error="erros.email != null"
      :error-message="erros.email"
    />
    <q-input
      v-model="usuario.telefone"
      label="Telefone"
      type="number"
      class="q-mb-md"
      data-cy="input-signup-telefone"
      :error="erros.telefone != null"
      :error-message="erros.telefone"
    />
    <q-input
      v-model="usuario.senha"
      label="Senha"
      type="password"
      data-cy="input-signup-password"
      maxlength="100"
      class="q-mb-md"
      :error="erros.senha != null"
      :error-message="erros.senha"
    />
    <q-input
      v-model="rSenha"
      label="Repetir senha"
      type="password"
      data-cy="input-signup-password"
      maxlength="100"
      class="q-mb-md"
      :error="erros.rSenha != null"
      :error-message="erros.rSenha"
    />
    <q-dialog v-model="exibirCampoCodigoVerificacao" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Email - Código de verificação</div>
          <div class="text">
            Tempo de validade: {{ tempoCodigoVerificacao }}
          </div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-input
            maxlength="7"
            data-cy="input-dialog-codigo-verificacao"
            :error="erros.codigoVerificacao != null"
            :error-message="erros.codigoVerificacao"
            v-model="usuario.codigoVerificacao"
            autofocus
          />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn
            data-cy="btn-close-dialog-anonymous-url"
            flat
            label="Fechar"
            @click="fecharCodigoVerificao"
          />
          <q-btn
            flat
            label="Salvar"
            data-cy="btn-create-anonymous-url"
            @click="salvar"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-btn type="submit" class="full-width" color="primary"> salvar </q-btn>
  </q-form>
</template>
<script lang="ts">
import { useQuasar } from 'quasar';
import { UsuarioCadastro } from 'src/application/models/UsuarioCadastro';
import confirmacaoEmailService from 'src/application/services/confirmacaoEmailService';
import usuarioService from 'src/application/services/usuarioService';
import { Utils } from 'src/application/utils';
import { codigoVerificacaoValidator } from 'src/application/validators/UsuarioValidator';
import { defineComponent } from 'vue';
import validar from '../../application/validators/validar';
import { usuarioAtualizacaoValidator } from '../../application/validators/UsuarioValidator';
import TipoImagem from 'src/application/models/TipoImagem';
import imagemService from '../../application/services/imagemService';
import ImagemUtil from 'src/application/utils/imagemUtil';
import DashboardEvent from 'src/components/dashboard/dashboardEvent';

interface Erros {
  nome: string;
  senha: string;
  rSenha: string;
  email: string;
  telefone: string;
  codigoVerificacao: string;
}

export default defineComponent({
  name: 'PerfilPage',
  setup() {
    const $q = useQuasar();
    return {
      exibirNotificacao(message: string, error = false) {
        $q.notify({
          position: 'top',
          message: message,
          color: error ? 'red' : 'green',
          attrs: {
            'data-cy': error ? 'dialog-error' : 'dialog-success',
          },
        });
      },
    };
  },
  created() {
    this.pesquisarUsuario();
  },
  data: () => {
    return {
      usuario: new UsuarioCadastro(),
      rSenha: '',
      emailAntigo: '',
      erros: {} as Erros,
      exibirCampoCodigoVerificacao: false,
      tempoCodigoVerificacao: '00:00',
      relogio: {} as NodeJS.Timer,
      imgUsuario: null as any,
      imgFileUsuario: null as any,
    };
  },
  methods: {
    salvar(precisaValidar = false) {
      if (precisaValidar) {
        this.validarFormulario();
      } else {
        this.erros = validar(codigoVerificacaoValidator, this.usuario);
      }

      if (!Utils.temErro(this.erros)) {
        usuarioService
          .atualizar(this.usuario)
          .then(async () => {
            this.usuario = new UsuarioCadastro();
            this.rSenha = '';
            this.exibirNotificacao('Usuário atualizado com sucesso.');
            await this.salvarImagem();
            this.pesquisarUsuario();
          })
          .catch((erro: any) => Utils.exibirMensagemError(erro));
      }
    },
    async salvarImagem() {
      if (this.imgFileUsuario) {
        const data = new FormData();
        data.set('imagem', this.imgFileUsuario as Blob);
        data.set('tipo', `${TipoImagem.USUARIO}`);
        data.set('id', `${Utils.obterUsuarioInfo().id}`);
        await imagemService.salvar(data);
      }
    },
    async validarFormulario() {
      const usuario = {
        ...this.usuario,
        rSenha: this.rSenha,
      } as any;
      if (!this.usuario.senha) {
        delete usuario['senha'];
        delete usuario['rSenha'];
      }
      this.erros = await validar(usuarioAtualizacaoValidator, usuario);

      if (
        (usuario.senha || usuario.rSenha) &&
        !this.erros.rSenha &&
        this.rSenha != this.usuario.senha
      ) {
        this.erros.rSenha = 'Senhas não correspondem';
      }
    },
    async abrirCodigoVerificacao() {
      if (
        this.emailAntigo.trim().toLowerCase() ==
        this.usuario.email.trim().toLowerCase()
      ) {
        this.salvar(true);
        return;
      }

      await this.validarFormulario();

      if (!Utils.temErro(this.erros)) {
        confirmacaoEmailService
          .enviar(this.usuario.email)
          .then((response) => {
            const timestampCriacao: number = response.data.timestapCriacao;
            this.relogio = Utils.relogioEmail(timestampCriacao, (val) => {
              this.tempoCodigoVerificacao = val;
            });
            this.exibirCampoCodigoVerificacao = true;
          })
          .catch((erro) => {
            const mensagem: string = erro.response.data.mensagem;
            this.exibirNotificacao(mensagem, true);
          });
      }
    },
    fecharCodigoVerificao() {
      this.usuario.codigoVerificacao = '';
      this.exibirCampoCodigoVerificacao = false;
      clearInterval(this.relogio);
    },
    pesquisarUsuario() {
      usuarioService.obterUsuarioAutenticado().then((response) => {
        this.usuario = response.data;
        this.imgUsuario = ImagemUtil.obterUrl(
          Utils.obterUsuarioInfo().id,
          TipoImagem.USUARIO
        );

        DashboardEvent.atualizarUsuarioInfo.disparar({ ...this.usuario });

        this.emailAntigo = response.data.email;
      });
    },
    selecionarImagem(event) {
      const file: Blob = event.target.files[0];
      this.limparInputImagem();
      if (FileReader && file) {
        var reader = new FileReader();
        reader.onload = () => {
          this.imgUsuario = reader.result as any;
        };
        reader.readAsDataURL(file);
        this.imgFileUsuario = file;
      }
    },
    imagemErro() {
      this.imgUsuario = null;
    },
    limparInputImagem() {
      this.imgUsuario = null;
      (this.$refs.imgLoja as any).value = null;
    },
    excluirImagem() {
      this.limparInputImagem();
      imagemService.excluir(Utils.obterUsuarioInfo().id, TipoImagem.USUARIO);
    },
  },
});
</script>
<style lang="scss" scoped>
.titulo {
  color: $grey-9;
}
.img-label {
  width: 200px;
  height: 200px;
  border-radius: 100%;
  background-color: #ececec;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.img-label .img {
  width: 200px;
  height: 200px;
  border-radius: 100%;
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
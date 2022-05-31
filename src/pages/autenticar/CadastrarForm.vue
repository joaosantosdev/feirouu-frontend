<template>
  <q-form class="q-pa-md signup" @submit.prevent="abrirCodigoVerificacao">
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
      mask="###########"
      maxlength="11"
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
    <q-btn
      type="submit"
      class="full-width"
      data-cy="btn-create-user"
      color="primary"
    >
      Criar
    </q-btn>
    <a @click="entrar" class="cursor-pointer q-mt-md text-secondary mobile">
      Entrar
    </a>
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
            label="Criar"
            data-cy="btn-create-anonymous-url"
            @click="cadastrar"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-form>
</template>

<script lang='ts'>
import { defineComponent } from 'vue';
import { useQuasar } from 'quasar';
import { UsuarioCadastro } from 'src/application/models/UsuarioCadastro';
import {
  cadastroValidator,
  codigoVerificacaoValidator,
} from '../../application/validators/UsuarioValidator';
import validar from '../../application/validators/validar';
import { Utils } from '../../application/utils/index';
import usuarioService from '../../application/services/usuarioService';
import confirmacaoEmailService from '../../application/services/confirmacaoEmailService';

interface Erros {
  nome: string;
  senha: string;
  rSenha: string;
  email: string;
  telefone: string;
  codigoVerificacao: string;
}

export default defineComponent({
  name: 'CadastrarForm',
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
  data: function () {
    return {
      usuario: new UsuarioCadastro(),
      rSenha: '',
      erros: {} as Erros,
      exibirCampoCodigoVerificacao: false,
      tempoCodigoVerificacao: '00:00',
      relogio: {} as NodeJS.Timer,
    };
  },
  methods: {
    entrar() {
      this.$emit('entrar');
    },
    cadastrar() {
      this.erros = validar(codigoVerificacaoValidator, this.usuario);
      if (!Utils.temErro(this.erros)) {
        usuarioService
          .cadastrar(this.usuario)
          .then(() => {
            this.usuario = new UsuarioCadastro();
            this.rSenha = '';
            this.exibirNotificacao('Usuário cadastrado com sucesso.');
          })
          .catch((erro: any) => {
            const mensagem: string = erro.response.data.mensagem;
            this.exibirNotificacao(mensagem, true);
          });
      }
    },
    async abrirCodigoVerificacao() {
      this.erros = await validar(cadastroValidator, {
        ...this.usuario,
        rSenha: this.rSenha,
      });

      if (!this.erros.rSenha && this.rSenha != this.usuario.senha) {
        this.erros.rSenha = 'Senhas não correspondem';
      }
      if (!Utils.temErro(this.erros)) {
        confirmacaoEmailService
          .enviar(this.usuario.email)
          .then((response) => {
            const timestampCriacao: number = response.data.timestapCriacao;
            this.ativarRelogioCodigoVerificacao(timestampCriacao);
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
    ativarRelogioCodigoVerificacao(timestampCriacao: number) {
      const calculoRelogio = () => {
        const VALIDADE = 600000;

        const timestampValidade = timestampCriacao + VALIDADE;
        const timestampRestante = timestampValidade - Date.now();

        const data = new Date(timestampRestante);

        const adicionarZero = (valor: number) => {
          return valor <= 9 ? `0${valor}` : `${valor}`;
        };
        this.tempoCodigoVerificacao = `${adicionarZero(
          data.getMinutes()
        )}:${adicionarZero(data.getSeconds())}`;
      };
      calculoRelogio();
      this.relogio = setInterval(calculoRelogio, 1000);
    },
  },
});
</script>

<style lang='scss' scoped>
.signup {
  width: 100%;
  overflow: auto;
}
</style>
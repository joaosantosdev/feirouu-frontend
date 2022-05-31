<template>
  <q-form class="q-pa-md signup" @submit.prevent="autenticar">
    <q-input
      v-model="usuario.email"
      data-cy="input-signin-email"
      label="Email"
      maxlength="100"
      class="q-mb-md"
      :error="erros.email != null"
      :error-message="erros.email"
    />
    <q-input
      v-model="usuario.senha"
      label="Senha"
      data-cy="input-signin-password"
      type="password"
      maxlength="100"
      class="q-mb-md"
      :error="erros.senha != null"
      :error-message="erros.senha"
    />
    <q-btn type="submit" class="full-width flex" color="primary">
      Entrar
    </q-btn>
    <a
      @click="abrirRedefinicaoSenha"
      class="cursor-pointer flex justify-center q-mt-md text-secondary"
    >
      Esqueceu sua senha ?
    </a>
    <a @click="criarConta" class="cursor-pointer q-mt-md text-secondary mobile">
      Criar conta
    </a>
    <q-dialog v-model="exibirRedefinicaoSenha" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Redefinição de senha</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-input
            label="Email"
            maxlength="100"
            :error="errosRedefinicao.email != null"
            :error-message="errosRedefinicao.email"
            v-model="redefinicaoSenha.email"
            autofocus
          />
          <q-input
            v-model="redefinicaoSenha.senha"
            label="Senha"
            type="password"
            maxlength="100"
            class="q-mb-md"
            :error="errosRedefinicao.senha != null"
            :error-message="errosRedefinicao.senha"
          />
          <q-input
            v-model="rSenha"
            label="Repetir senha"
            type="password"
            maxlength="100"
            class="q-mb-md"
            :error="errosRedefinicao.rSenha != null"
            :error-message="errosRedefinicao.rSenha"
          />
          <q-input
            label="Código de verificação"
            maxlength="7"
            :disable="!codigoEnviado"
            :error="errosRedefinicao.codigoVerificacao != null"
            :error-message="errosRedefinicao.codigoVerificacao"
            v-model="redefinicaoSenha.codigoVerificacao"
            autofocus
          />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Fechar" @click="fecharRedefinicaoSenha" />
          <q-btn
            flat
            :label="codigoEnviado ? 'Redefinir' : 'Enviar código'"
            data-cy="btn-create-anonymous-url"
            @click="redefinirSenha(!codigoEnviado)"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-form>
</template>

<script lang='ts'>
import { defineComponent } from 'vue';
import { useQuasar } from 'quasar';
import { UsuarioAutenticar } from 'src/application/models/UsuarioAutenticar';
import validar from '../../application/validators/validar';
import {
  autenticarValidator,
  redefinicaoSenhaValidator,
} from '../../application/validators/UsuarioValidator';
import { Utils } from 'src/application/utils';
import usuarioService from 'src/application/services/usuarioService';
import confirmacaoEmailService from 'src/application/services/confirmacaoEmailService';
import RedefinicaoSenha from 'src/application/models/RedefinicaoSenha';

export default defineComponent({
  name: 'EntrarForm',
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
      usuario: {
        email: '',
        senha: '',
      } as UsuarioAutenticar,
      erros: {} as UsuarioAutenticar,
      errosRedefinicao: {} as any,
      exibirRedefinicaoSenha: false,
      redefinicaoSenha: new RedefinicaoSenha(),
      codigoEnviado: false,
      rSenha: '',
    };
  },
  methods: {
    criarConta() {
      this.$emit('cadastrar');
    },
    async autenticar(): Promise<void> {
      this.erros = await validar(autenticarValidator, this.usuario);
      if (!Utils.temErro(this.erros)) {
        usuarioService.autenticar(this.usuario).then((response) => {
          if (response) {
            Utils.guardarToken(response.headers.authorization as string);
            this.$router.replace({ name: 'Perfil' });
          } else {
            this.exibirNotificacao('Email ou/e senha incorreta.', true);
          }
        });
      }
    },
    async redefinirSenha(enviarCodigo: boolean) {
      this.exibirRedefinicaoSenha = true;

      this.errosRedefinicao = await validar(redefinicaoSenhaValidator, {
        ...this.redefinicaoSenha,
        rSenha: this.rSenha,
      });

      if (
        !this.errosRedefinicao.rSenha &&
        this.rSenha != this.redefinicaoSenha.senha
      ) {
        this.errosRedefinicao.rSenha = 'Senhas não correspondem';
      }

      if (!Utils.temErro(this.errosRedefinicao as object)) {
        if (enviarCodigo) {
          confirmacaoEmailService
            .enviar(this.redefinicaoSenha.email, true)
            .then(() => {
              ('Código de verificação enviado para o email.');
              this.codigoEnviado = true;
            })
            .catch((erro) => {
              const mensagem: string = erro.response.data.mensagem;
              this.exibirNotificacao(mensagem, true);
            });
          return;
        }

        usuarioService
          .redefinirSenha(this.redefinicaoSenha)
          .then((response) => {
            this.exibirNotificacao(
              'Redefinição de senha realizada com sucesso.'
            );
            this.fecharRedefinicaoSenha();
          })
          .catch((erro) => {
            const mensagem: string = erro.response.data.mensagem;
            this.exibirNotificacao(mensagem, true);
          });
      }
    },
    fecharRedefinicaoSenha() {
      this.exibirRedefinicaoSenha = false;
      this.errosRedefinicao = {};
      this.redefinicaoSenha = new RedefinicaoSenha();
    },
    abrirRedefinicaoSenha() {
      this.exibirRedefinicaoSenha = true;
    },
  },
});
</script>

<style lang='scss' scoped>
.signup {
  width: 100%;
}
</style>

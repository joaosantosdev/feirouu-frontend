<template>
  <div class="container-login">
    <div class="content-form">
      <div class="right">
        <h2 class="text-white text-center">Feirouu</h2>
        <a
          @click="cadastrarOuEntrar"
          :data-cy="isCadastrar ? 'btn-nav-signin' : 'btn-nav-signup'"
          class="cursor-pointer text-white"
        >
          {{ isCadastrar ? 'Entrar' : 'Criar conta' }}
        </a>
      </div>
      <div class="left">
        <h3 class="text-primary text-center mobile">Feirouu</h3>

        <CadastrarForm @entrar="cadastrarOuEntrar" v-if="isCadastrar" />
        <EntrarForm @cadastrar="cadastrarOuEntrar" v-else />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import EntrarForm from './EntrarForm.vue';
import CadastrarForm from './CadastrarForm.vue';

export default defineComponent({
  name: 'LoginPage',
  components: { CadastrarForm, EntrarForm },
  data: () => {
    return {
      isCadastrar: false,
    };
  },
  methods: {
    cadastrarOuEntrar(): void {
      this.isCadastrar = !this.isCadastrar;
    },
  },
});
</script>

<style lang="scss">
.container-login {
  position: fixed;
  display: flex;
  width: 100%;
  height: 100%;
  background-color: $grey-1;
  justify-content: center;
  align-items: center;
  .content-form {
    width: 800px;
    height: 550px;
    background: #fff;
    display: flex;
    flex-direction: row;
    @media screen and (max-width: 800px) {
      height: 95%;
      width: 95%;
    }
    .left,
    .right {
      display: flex;
      width: 400px;
      height: 100%;
    }
    .right {
      background-color: $primary;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      @media screen and (max-width: 800px) {
        display: none;
      }
    }
    .left {
      flex-direction: column;
      justify-content: center;
      align-items: center;
      @media screen and (max-width: 800px) {
        width: 100%;
      }
    }
    .text-create-anonymous {
      position: absolute;
      bottom: 30px;
      @media screen and (max-width: 800px) {
        bottom: 30px;
      }
    }
    .mobile {
      display: none;
      @media screen and (max-width: 800px) {
        display: flex;
        justify-content: center;
      }
    }
  }
}
</style>
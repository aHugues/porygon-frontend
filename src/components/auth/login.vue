<template>
  <div class='login-form md-card'>

    <form novalidate @submit.prevent="validateLogin">
      <div class="md-layout-item md-size-100">
        <md-field :class="getValidationClass('login')">
          <label for="login">{{ $ml.get('auth').login }}</label>
            <md-input name="login" id="login" v-model="login"/>
            <span class="md-error" v-if="!$v.login.required">
              {{ $ml.get('auth').login_required }}
            </span>
        </md-field>

        <md-field :class="getValidationClass('password')">
          <label for="password">{{ $ml.get('auth').password }}</label>
            <md-input name="password" id="password" v-model="password" type="password"/>
            <span class="md-error" v-if="!$v.password.required">
              {{ $ml.get('auth').password_required }}
            </span>
        </md-field>

        <div class="login-button-wrapper">
          <md-button class="md-raised md-primary" type="input">
            <md-icon>login</md-icon> {{ $ml.get('auth').send_login }}
          </md-button>
        </div>
      </div>
    </form>

    <md-snackbar :md-active.sync="errored">
     <span>{{ $ml.get('error').login_error }}</span>
   </md-snackbar>

  </div>
</template>

<script>

import axios from 'axios';
import { validationMixin } from 'vuelidate';
import { required } from 'vuelidate/lib/validators';
import config from '../../config';
import requests from '../../utils/requests';

export default {
  name: 'Login',
  mixins: [validationMixin],
  computed: {
    environment() { return process.env.NODE_ENV; },
    authBaseUrl() { return config[this.environment].authBaseUrl; },
  },
  data() {
    return {
      login: '',
      password: '',
      errored: false,
    };
  },
  validations: {
    login: {
      required,
    },
    password: {
      required,
    },
  },
  methods: {
    sendLogin() {
      const options = requests.buildOptions();

      axios({
        method: 'post',
        url: `${this.authBaseUrl}/login`,
        headers: options.headers,
        withCredentials: options.withCredentials,
        data: {
          login: this.login,
          password: this.password,
        },
      })
        .then((response) => {
          this.errored = false;
          localStorage.setItem('vue-user-firstname', response.data.firstName);
          localStorage.setItem('vue-user-lastname', response.data.lastName);
          // localStorage.setItem('vue-user-url', 'https://google.com');
          this.$router.back();
        })
        .catch((error) => {
          console.error(error);
          this.errored = true;
        });
    },
    getValidationClass(fieldName) {
      const field = fieldName === 'login' ? this.$v.login : this.$v.password;
      return {
        'md-invalid': field.$invalid && field.$dirty,
      };
    },
    validateLogin() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        this.sendLogin();
      }
    },
  },
};
</script>

<style lanc="scss" scoped>
  .login-form {
    width: 80%;
    margin: auto;
    margin-top: 200px;
    padding: 10px;
  }
</style>

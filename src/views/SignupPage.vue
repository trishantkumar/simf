<template>
  <section class="section-container">
    <v-row class="signin">
      <v-col cols="8" class="left">
        <h1>Hi Welcome, Please register yourself</h1>
      </v-col>
      <v-col cols="4" class="right">
        <h2>SIGNUP</h2>
        <validation-observer ref="observer">
          <v-form @submit.prevent="submit">
              <v-text-field
                v-model="username"
                :error-messages="errors"
                label="User Name"
                required
                outlined
                dark
                filled
                dense
              ></v-text-field>
            <validation-provider v-slot="{ errors }" name="Name" rules="required|email">
              <v-text-field
                v-model="email"
                :error-messages="errors"
                label="Email"
                required
                outlined
                dark
                filled
                dense
              ></v-text-field>
            </validation-provider>
            <validation-provider v-slot="{ errors }" name="email" rules="required">
              <v-text-field
                v-model="password"
                :error-messages="errors"
                label="Password"
                :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="showPass = !showPass"
                required
                outlined
                dense
                dark
                filled
                :type="showPass ? 'text' : 'password'"
              ></v-text-field>
            </validation-provider>
            <div class="text-center">
              <v-btn class="signin-btn" type="submit" rounded color="white" dark>
                Sign Up
              </v-btn>
            </div>
          </v-form>
        </validation-observer>
      </v-col>
    </v-row>
  </section>
</template>
<script>
import axios from "axios";
import { required, email } from 'vee-validate/dist/rules'
import { extend, ValidationProvider, setInteractionMode, ValidationObserver } from 'vee-validate'

setInteractionMode('eager')

extend('required', {
  ...required,
  message: '{_field_} can not be empty'
})

extend('email', {
  ...email,
  message: 'Email must be valid'
})

export default {
  components: {
    ValidationProvider,
    ValidationObserver
  },
  data: () => ({
    username:'',
    email: '',
    password: null,
    showPass: false
  }),
  computed: {
    params() {
      return {
        username: this.username,
        email: this.email,
        password: this.password,
      }
    }
  },
  methods: {
    async submit() {
      const valid = await this.$refs.observer.validate()
      if (valid) {
        this.signup(this.params)
      }
    },
    signup(data) {
        let apiURL = 'http://localhost:4000/user/signup';
        axios.post(apiURL, data).then((result) => {
            if(result.data.statusText == 'OK') {
                alert("Sucessfully Registered!")
            }
        }).catch(error => {
          console.log(error)
        });
    },
    clear() {
      this.username = ''
      this.email = ''
      this.password = null
      this.$refs.observer.reset()
    }
  }
}
</script>
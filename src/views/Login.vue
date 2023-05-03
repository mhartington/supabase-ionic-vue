<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Login</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="ion-padding">
        <h1>Supabase + Ionic Vue</h1>
        <p>Sign in via magic link with your email below</p>
      </div>
      <ion-list :inset="true">
        <form @submit.prevent="handleLogin">
          <ion-item>
            <ion-input
              labelPlacement="stacked"
              label="Email"
              v-model="email"
              name="email"
              autocomplete="email"
              type="email"
            ></ion-input>
          </ion-item>
          <div class="ion-text-center">
            <ion-button type="submit" fill="clear">Login</ion-button>
          </div>
        </form>
      </ion-list>
      <p>{{ email }}</p>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { supabase } from "../supabase";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  toastController,
  loadingController,
} from "@ionic/vue";
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "LoginPage",
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
  },
  setup() {
    const email = ref("");
    const handleLogin = async () => {
      const loader = await loadingController.create({});
      const toast = await toastController.create({ duration: 5000 });

      try {
        await loader.present();
        const { error } = await supabase.auth.signIn({ email: email.value });

        if (error) throw error;

        toast.message = "Check your email for the login link!";
        await toast.present();
      } catch (error: any) {
        toast.message = error.error_description || error.message;
        await toast.present();
      } finally {
        await loader.dismiss();
      }
    };
    return { handleLogin, email };
  },
});
</script>

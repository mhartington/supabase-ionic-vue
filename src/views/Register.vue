<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-title>Register</ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content>
            <div class="ion-padding">
                <h1>Supabase + Ionic Vue</h1>
                <p>Register</p>
            </div>
            <ion-list inset="true">
                <form @submit.prevent="handleRegister">
                    <ion-item>
                        <ion-label position="stacked">Email</ion-label>
                        <ion-input v-model="email" name="email" autocomplete type="email"></ion-input>
                    </ion-item>
                    <ion-item>
                        <ion-label position="stacked">Password</ion-label>
                        <ion-input v-model="password" name="password" autocomplete type="password"></ion-input>
                    </ion-item>
                    <div class="ion-text-center">
                        <ion-button type="submit" fill="clear">Register</ion-button>
                    </div>
                </form>
                <div class="ion-text-center">
                    <ion-button shape="round" color="primary" href="/login">Login</ion-button>
                </div>
            </ion-list>
            <p>{{ email }}</p>
        </ion-content>

    </ion-page>
</template>

<script lang="ts">
import { supabase } from '../supabase';
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
} from '@ionic/vue';
import { defineComponent, ref } from 'vue';

export default defineComponent({
    name: 'RegisterPage',
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
        const email = ref('');
        const password = ref('');
        const handleRegister = async () => {

            const loader = await loadingController.create({});
            const toast = await toastController.create({ duration: 5000 });

            try {
                await loader.present();
                const { error } = await supabase.auth.signUp({ email: email.value, password: password.value });

                if (error) throw error;

                toast.message = 'Loggedin successfully';
                await toast.present();

            } catch (error: any) {

                toast.message = error.error_description || error.message;
                await toast.present();

            } finally {

                await loader.dismiss();

            }
        };
        return { handleRegister, email, password };
    },
});
</script>

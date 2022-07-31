<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Account</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <avatar v-model:path="profile.avatar_url" @upload="updateProfile"></avatar>
      <form @submit.prevent="updateProfile">
        <ion-item>
          <ion-label>
            <p>Email</p>
            <p>{{ session?.user?.email }}</p>
          </ion-label>
        </ion-item>

        <ion-item>
          <ion-label position="stacked">Name</ion-label>
          <ion-input
            type="text"
            name="username"
            v-model="profile.username"
          ></ion-input>
        </ion-item>

        <ion-item>
          <ion-label position="stacked">Website</ion-label>
          <ion-input
            type="url"
            name="website"
            v-model="profile.website"
          ></ion-input>
        </ion-item>
        <div class="ion-text-center">
          <ion-button fill="clear" type="submit">Update Profile</ion-button>
        </div>
      </form>

      <div class="ion-text-center">
        <ion-button fill="clear" @click="signOut">Log Out</ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { store } from '@/store';
import { supabase } from '@/supabase';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  toastController,
  loadingController,
  IonInput,
  IonItem,
  IonButton,
  IonLabel,
} from '@ionic/vue';
import { User } from '@supabase/supabase-js';
import { defineComponent, onMounted, ref } from 'vue';
import Avatar from '../components/Avatar.vue';
import { useRouter } from "vue-router";
export default defineComponent({
  name: 'AccountPage',
  components: {
    Avatar,
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonInput,
    IonItem,
    IonButton,
    IonLabel,
  },
  setup() {
    const session = ref(supabase.auth.session());
    const router = useRouter();
    const profile = ref({
      username: '',
      website: '',
      avatar_url: '',
    });
    const user = store.user as User;
    async function getProfile() {
      const loader = await loadingController.create({});
      const toast = await toastController.create({ duration: 5000 });
      await loader.present();
      try {
        const { data, error, status } = await supabase
          .from('profiles')
          .select(`username, website, avatar_url`)
          .eq('id', user.id)
          .single();

        if (error && status !== 406) throw error;

        if (data) {
          console.log(data)
          profile.value = {
            username: data.username,
            website: data.website,
            avatar_url: data.avatar_url,
          };
        }
      } catch (error: any) {
        toast.message = error.message;
        await toast.present();
      } finally {
        await loader.dismiss();
      }
    }

    const updateProfile = async () => {
      const loader = await loadingController.create({});
      const toast = await toastController.create({ duration: 5000 });
      try {
        await loader.present();
        const updates = {
          id: user.id,
          ...profile.value,
          updated_at: new Date(),
        };
        //
        const { error } = await supabase.from('profiles').upsert(updates, {
          returning: 'minimal', // Don't return the value after inserting
        });
        //
        if (error) throw error;
      } catch (error: any) {
        toast.message = error.message;
        await toast.present();
      } finally {
        await loader.dismiss();
      }
    };

    async function signOut() {
      const loader = await loadingController.create({});
      const toast = await toastController.create({ duration: 5000 });
      await loader.present();
      try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        else router.push('/login'); 
      } catch (error: any) {
        toast.message = error.message;
        await toast.present();
      } finally {
        await loader.dismiss();
      }
    }

    onMounted(() => {
      getProfile();
    });
    return { signOut, profile, session, updateProfile };
  },
});
</script>

<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script lang="ts">
import { IonApp, IonRouterOutlet, useIonRouter } from '@ionic/vue';
import { defineComponent } from 'vue';

import { store } from './store';
import { supabase } from './supabase';

export default defineComponent({
  name: 'App',
  components: {
    IonApp,
    IonRouterOutlet
  },
  setup(){
    const router = useIonRouter();
    store.user = supabase.auth.user() ?? {};
    supabase.auth.onAuthStateChange((_, session) => {
      store.user = session?.user ?? {}
      if(session?.user) {
        router.replace('/account');
      }
    })
  }
});
</script>

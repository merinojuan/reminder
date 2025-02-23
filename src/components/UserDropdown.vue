<template>
  <div class="dropdown dropdown-end">
    <div tabindex="0" role="button" class="btn btn-circle btn-ghost rounded-btn">
      <!-- <div v-if="$user?.photoURL" class="avatar">
        <div class="w-10 rounded-full">
          <img :src="$user.photoURL" />
        </div>
      </div> -->
      <svg class="w-6 h-6 fill-current" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" stroke-width="2" d="M7 17v1a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1a3 3 0 0 0-3-3h-4a3 3 0 0 0-3 3Zm8-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
      </svg>
    </div>
    <ul
      tabindex="0"
      class="menu dropdown-content bg-base-200 rounded-box z-[1] mt-4 w-56 p-2 shadow"
    >
      <li v-if="!$user" @click="login">
        <a>
          <svg class="w-6 h-6 fill-current" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
            <path fill-rule="evenodd" d="M12.037 21.998a10.313 10.313 0 0 1-7.168-3.049 9.888 9.888 0 0 1-2.868-7.118 9.947 9.947 0 0 1 3.064-6.949A10.37 10.37 0 0 1 12.212 2h.176a9.935 9.935 0 0 1 6.614 2.564L16.457 6.88a6.187 6.187 0 0 0-4.131-1.566 6.9 6.9 0 0 0-4.794 1.913 6.618 6.618 0 0 0-2.045 4.657 6.608 6.608 0 0 0 1.882 4.723 6.891 6.891 0 0 0 4.725 2.07h.143c1.41.072 2.8-.354 3.917-1.2a5.77 5.77 0 0 0 2.172-3.41l.043-.117H12.22v-3.41h9.678c.075.617.109 1.238.1 1.859-.099 5.741-4.017 9.6-9.746 9.6l-.215-.002Z" clip-rule="evenodd"/>
          </svg>
          <span class="ps-3">Ingresar con Google</span>
        </a>
      </li>
      <li v-else @click="logout">
        <a>
          <svg class="w-6 h-6 fill-current" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
            <path d="M5.027 10.9a8.729 8.729 0 0 1 6.422-3.62v-1.2A2.061 2.061 0 0 1 12.61 4.2a1.986 1.986 0 0 1 2.104.23l5.491 4.308a2.11 2.11 0 0 1 .588 2.566 2.109 2.109 0 0 1-.588.734l-5.489 4.308a1.983 1.983 0 0 1-2.104.228 2.065 2.065 0 0 1-1.16-1.876v-.942c-5.33 1.284-6.212 5.251-6.25 5.441a1 1 0 0 1-.923.806h-.06a1.003 1.003 0 0 1-.955-.7A10.221 10.221 0 0 1 5.027 10.9Z"/>
          </svg>
          <span class="ps-3">Cerrar sesión</span>
        </a>
      </li>
    </ul>
  </div>
</template>

<script setup>
  import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
  import { auth } from '@fb/client';
  import { user } from '@src/store';
  import { useStore } from '@nanostores/vue';

  const $user = useStore(user);

  async function login() {
		try {
			await signInWithPopup(auth, new GoogleAuthProvider());
		} catch (error) {
			// console.error('Error signing in: ', error);
		}
	};

  async function logout() {
    try {
      await signOut(auth);
    } catch (error) {
      // console.error('Error signing out: ', error);
    }
  }
</script>

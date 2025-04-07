<template>
  <div class="dropdown dropdown-end">
    <div ref="dropdown-button" class="btn btn-circle btn-ghost rounded-btn" tabindex="0" role="button" aria-label="Abrir opciones de usuario">
      <div v-if="$user?.photoURL" class="avatar">
        <div class="w-6 rounded-full">
          <img :src="$user.photoURL" />
        </div>
      </div>
      <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" >
        <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
        <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
      </svg>
    </div>
    <ul
      tabindex="0"
      class="menu dropdown-content bg-base-200 rounded-box z-[1] mt-4 w-56 p-2 shadow"
    >
      <li v-if="!$user" @click="dropdownAction('login')">
        <button aria-label="Ingresar con Google">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20.945 11a9 9 0 1 1 -3.284 -5.997l-2.655 2.392a5.5 5.5 0 1 0 2.119 6.605h-4.125v-3h7.945z" />
          </svg>
          <span class="ps-3">Ingresar con Google</span>
        </button>
      </li>
      <li v-else @click="dropdownAction('logout')">
        <button aria-label="Cerrar sesión">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
            <path d="M7 6a7.75 7.75 0 1 0 10 0" />
            <path d="M12 4l0 8" />
          </svg>
          <span class="ps-3">Cerrar sesión</span>
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup>
  import { useTemplateRef } from 'vue';
  import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
  import { auth } from '@fb/client';
  import { user } from '@src/store';
  import { useStore } from '@nanostores/vue';

  const dropdownButton = useTemplateRef('dropdown-button');
  const $user = useStore(user);

  function dropdownAction(action) {
		dropdownButton.value.focus();
    dropdownButton.value.blur();
    setTimeout(() => {
      if (action === 'login') this.login();
      if (action === 'logout') this.logout();
    }, 200);
	}

  async function login() {
		try {
			await signInWithPopup(auth, new GoogleAuthProvider());
		} catch (error) {
			// console.error('Error signing in: ', error);
		}
	}

  async function logout() {
    try {
      await signOut(auth);
    } catch (error) {
      // console.error('Error signing out: ', error);
    }
  }
</script>

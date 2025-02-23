<template>
  <div v-if="!$user">
    <slot />
  </div>
</template>

<script setup>
  import { user } from '@src/store';
  import { useStore } from '@nanostores/vue';

  const $user = useStore(user);
</script>
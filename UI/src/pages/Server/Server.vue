<template>
  <ServerDetail
    :server="{
      id: route.params.id,
    }"
  />
</template>

<script setup lang="ts">
import ServerDetail from "@components/ServerDetail/ServerDetail.vue";
import { useRoute } from "vue-router";
const route = useRoute();
</script>

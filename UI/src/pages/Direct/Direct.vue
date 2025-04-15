<template>
  <DirectDetail :friend="{
    id: route.params.id,
  }" />
</template>

<script setup lang="ts">
import DirectDetail from "@components/DirectDetail/DirectDetail.vue";
import { useRoute } from "vue-router";

const route = useRoute();
</script>

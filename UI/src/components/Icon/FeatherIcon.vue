<template>
    <span 
      class="feather-icon" 
      v-html="iconSVG"
      :style="{
        width: size + 'px',
        height: size + 'px',
        color: color
      }"
    ></span>
  </template>
  
  <script setup lang="ts">
  import feather from 'feather-icons'
  import { computed } from 'vue'
  
  const props = defineProps({
    name: {
      type: String,
      required: true,
    },
    size: {
      type: [Number, String],
      default: 24
    },
    color: {
      type: String,
      default: 'currentColor'
    },
    strokeWidth: {
      type: [Number, String],
      default: 2
    }
  })
  
  const iconSVG = computed(() => {
    return feather.icons[props.name].toSvg({
      width: props.size,
      height: props.size,
      color: props.color,
      'stroke-width': props.strokeWidth,
      class: 'feather-icon-content'
    })
  })
  </script>
  
  <style>
  .feather-icon {
    display: inline-flex;
    vertical-align: middle;
  }
  .feather-icon-content {
    display: block;
  }
  </style>
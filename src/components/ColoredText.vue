<template>
  <span>
    <template v-for="(part, index) in coloredParts" :key="index">
      <span :style="{ color: part.color }">{{ part.text }}</span>
    </template>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  text: string;
}>();

const coloredParts = computed(() => {
  const parts = [];
  let currentText = props.text;
  let currentColor = '#FFFFFF'; // Default color

  while (currentText.length > 0) {
    const colorMatch = currentText.match(/\^([0-9A-F]{8})/i);
    if (colorMatch) {
      // Add the text before the color code
      if (colorMatch.index! > 0) {
        parts.push({
          text: currentText.substring(0, colorMatch.index),
          color: currentColor
        });
      }
      // Update the current color - use the first 6 digits for RGB
      const colorCode = colorMatch[1];
      currentColor = '#' + colorCode.substring(0, 6); // Use first 6 digits for RGB
      // Remove the color code and the text before it
      currentText = currentText.substring(colorMatch.index! + colorMatch[0].length);
    } else {
      // No more color codes, add the remaining text
      parts.push({
        text: currentText,
        color: currentColor
      });
      break;
    }
  }

  return parts;
});
</script> 
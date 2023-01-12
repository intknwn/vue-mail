<template>
  <div class="modal">
    <div class="overlay" @click="$emit('closeModal')"></div>
    <div class="modal-card">
      <slot />
    </div>
  </div>
</template>

<script>
import useKeyDown from "@/composable/use-keydown";

export default {
  setup(props, { emit }) {
    useKeyDown({
      Escape: () => emit("closeModal"),
    });
  },
};
</script>

<style lang="scss" scoped></style>

<template>
  <div class="bulk-action-bar">
    <div class="checkbox">
      <input
        type="checkbox"
        :checked="allSelected"
        :class="{ 'partial-check': someSelected }"
        @click="bulkSelect"
      />
    </div>
    <div class="buttons">
      <button @click="selection.markRead()" :disabled="selection.hasRead()">Mark Read</button>
      <button @click="selection.markUnread()" :disabled="selection.hasUnread()">Mark Unread</button>
      <button @click="selection.archive()" :disabled="!selection.emails.size">Archive</button>
    </div>
  </div>
</template>

<script>
import { computed } from "vue";
import useSelection from "@/composable/use-selection";

export default {
  setup(props) {
    const selection = useSelection();
    const allSelected = computed(
      () => selection.emails.size && selection.emails.size === props.emails.length
    );
    const someSelected = computed(() => !!selection.emails.size && !allSelected.value);
    const bulkSelect = () => {
      if (allSelected.value) {
        selection.clear();
        return;
      }

      selection.addAll(props.emails);
    };

    return {
      selection,
      bulkSelect,
      allSelected,
      someSelected,
    };
  },
  props: {
    emails: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped></style>

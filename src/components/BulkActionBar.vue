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
      <button @click="archiveHandler" :disabled="!selection.emails.size">
        {{ archiveButtonCaption }}
      </button>
    </div>
  </div>
</template>

<script>
import { computed } from "vue";
import useSelection from "@/composable/use-selection";
import { VIEWS } from "@/const.js";

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

    const archiveHandler = () =>
      props.view === VIEWS.INBOX ? selection.archive() : selection.archive(false);

    return {
      selection,
      bulkSelect,
      allSelected,
      someSelected,
      archiveHandler,
    };
  },
  props: {
    emails: {
      type: Array,
      required: true,
    },
    view: {
      type: String,
      required: true,
    },
  },
  computed: {
    archiveButtonCaption() {
      return this.view === "inbox" ? "Archive" : "Move to Inbox";
    },
  },
};
</script>

<style lang="scss" scoped></style>

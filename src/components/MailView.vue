<template>
  <div class="email-display">
    <div>
      <button @click="toggleArchived">
        {{ email.archived ? "Move to Inbox (a)" : "Archive (a)" }}
      </button>
      <button @click="toggleRead">{{ email.read ? "Mark Unread (r)" : "Mark Read (r)" }}</button>
      <button @click="readOlder">Older (j)</button>
      <button @click="readNewer">Newer (k)</button>
    </div>
    <h2 class="mb-0">
      Subject: <strong>{{ email.subject }}</strong>
    </h2>
    <div>
      <em>From {{ email.from }} on {{ formattedDate }}</em>
    </div>
    <div v-html="formattedBody" />
  </div>
</template>

<script>
import { format } from "date-fns";
import { marked } from "marked";
import useKeyDown from "@/composable/use-keydown";

export default {
  setup(props, { emit }) {
    const toggleRead = () => emit("updateEmail", { toggleRead: true });
    const toggleArchived = () => emit("updateEmail", { toggleArchived: true });
    const readOlder = () => emit("updateEmail", { older: true });
    const readNewer = () => emit("updateEmail", { newer: true });

    useKeyDown({
      a: toggleArchived,
      r: toggleRead,
      j: readOlder,
      k: readNewer,
    });

    return { toggleRead, toggleArchived, readOlder, readNewer };
  },
  props: {
    email: {
      type: Object,
      required: true,
    },
  },
  computed: {
    formattedDate() {
      return format(new Date(this.email.sentAt), "MMM do yyyy");
    },
    formattedBody() {
      return marked.parse(this.email.body);
    },
  },
};
</script>

<style lang="scss" scoped></style>

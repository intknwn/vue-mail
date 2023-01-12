<template>
  <BulkActionBar :emails="emails" />
  <table class="mail-table">
    <tbody>
      <tr v-for="email in emails" :key="email.id" :class="['clickable', { read: email.read }]">
        <td>
          <input
            type="checkbox"
            @click="selection.toggle(email)"
            :checked="selection.emails.has(email)"
          />
        </td>
        <td @click="readEmail(email)">{{ email.from }}</td>
        <td @click="readEmail(email)">
          <p>
            <strong>{{ email.subject }}</strong> — {{ email.body }}
          </p>
        </td>
        <td @click="readEmail(email)">{{ formatDate(email.sentAt) }}</td>
        <td><button @click="archiveEmail(email)">Archive</button></td>
      </tr>
    </tbody>
  </table>
  <ModalView v-if="openedEmail" @closeModal="openedEmail = null">
    <MailView :email="openedEmail" @updateEmail="updateEmail" />
  </ModalView>
</template>

<script>
import { ref } from "vue";
import { format } from "date-fns";
import EMailService from "@/services/email/";
import MailView from "@/components/MailView.vue";
import ModalView from "@/components/ModalView.vue";
import BulkActionBar from "@/components//BulkActionBar.vue";
import useSelection from "@/composable/use-selection";

export default {
  async setup() {
    const { data: emails } = await EMailService.getEmails();
    const openedEmail = ref(null);

    return { unprocessedEmails: ref(emails), selection: useSelection(), openedEmail };
  },
  components: {
    MailView,
    ModalView,
    BulkActionBar,
  },
  methods: {
    formatDate(date) {
      return format(new Date(date), "MMM do yyyy");
    },
    readEmail(email) {
      this.openedEmail = email;
      return EMailService.readEmail(email);
    },
    archiveEmail(email) {
      email.archived = !email.archived;
      return EMailService.archiveEmail(email);
    },
    updateEmail(changes) {
      const email = this.openedEmail;
      const index = this.emails.indexOf(email);

      const Updates = {
        toggleArchived: () => {
          email.archived = !email.archived;
          EMailService.updateEmail(email);
        },
        toggleRead: () => {
          email.read = !email.read;
          EMailService.updateEmail(email);
        },
        older: () => (this.openedEmail = this.emails[index + 1]),
        newer: () => (this.openedEmail = this.emails[index - 1]),
      };

      Object.keys(changes).forEach((key) => Updates[key]());
    },
  },
  computed: {
    emails() {
      return this.unprocessedEmails
        .sort((e1, e2) => (e1.sentAt < e2.sentAt ? 1 : -1))
        .filter((e) => !e.archived);
    },
  },
};
</script>

<style lang="scss" scoped></style>

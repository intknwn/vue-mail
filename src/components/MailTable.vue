<template>
  <table class="mail-table">
    <tbody>
      <tr
        v-for="email in currentEmails"
        :key="email.id"
        :class="['clickable', { read: email.read }]"
        @click="readEmail(email)"
      >
        <td><input type="checkbox" /></td>
        <td>{{ email.from }}</td>
        <td>
          <p>
            <strong>{{ email.subject }}</strong> — {{ email.body }}
          </p>
        </td>
        <td>{{ formatDate(email.sentAt) }}</td>
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

export default {
  async setup() {
    const res = await EMailService.getEmails();
    const emails = ref(res.data);
    const openedEmail = ref(null);

    return { emails, openedEmail };
  },
  components: {
    MailView,
    ModalView,
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
      return EMailService.archiveEmail(email);
    },
    updateEmail(changes) {
      const email = this.openedEmail;
      const index = this.currentEmails.indexOf(email);

      const Updates = {
        toggleArchived: () => {
          email.archived = !email.archived;
          EMailService.updateEmail(email);
        },
        toggleRead: () => {
          email.read = !email.read;
          EMailService.updateEmail(email);
        },
        older: () => (this.openedEmail = this.currentEmails[index + 1]),
        newer: () => (this.openedEmail = this.currentEmails[index - 1]),
      };

      Object.keys(changes).forEach((key) => Updates[key]());
    },
  },
  computed: {
    sortedEmails() {
      return this.emails.sort((e1, e2) => (e1.sentAt < e2.sentAt ? 1 : -1));
    },
    currentEmails() {
      return this.sortedEmails.filter((e) => !e.archived);
    },
  },
};
</script>

<style lang="scss" scoped></style>

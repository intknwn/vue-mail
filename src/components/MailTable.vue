<template>
  <div class="buttons">
    <button :disabled="view !== VIEWS.ARCHIVED" @click="selectView(VIEWS.INBOX)">Inbox</button>
    <button :disabled="view !== VIEWS.INBOX" @click="selectView(VIEWS.ARCHIVED)">Archived</button>
  </div>
  <BulkActionBar :emails="emails" :view="view" />
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
        <td>
          <button @click="archiveEmail(email)">
            {{ view === VIEWS.INBOX ? "Archive" : "Move to Inbox" }}
          </button>
        </td>
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
import { VIEWS } from "@/const.js";

export default {
  async setup() {
    const { data: emails } = await EMailService.getEmails();
    const openedEmail = ref(null);

    return {
      VIEWS,
      view: ref(VIEWS.INBOX),
      unprocessedEmails: ref(emails),
      selection: useSelection(),
      openedEmail,
    };
  },
  components: {
    MailView,
    ModalView,
    BulkActionBar,
  },
  methods: {
    selectView(view) {
      this.view = view;
      this.selection.clear();
    },
    formatDate(date) {
      return format(new Date(date), "MMM do yyyy");
    },
    readEmail(email) {
      this.openedEmail = email;
      email.read = true;
      return EMailService.updateEmail(email);
    },
    archiveEmail(email) {
      email.archived = !email.archived;
      return EMailService.updateEmail(email);
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
      const sorted = this.unprocessedEmails.sort((e1, e2) => (e1.sentAt < e2.sentAt ? 1 : -1));

      return this.view === this.VIEWS.INBOX
        ? sorted.filter((e) => !e.archived)
        : sorted.filter((e) => e.archived);
    },
  },
};
</script>

<style lang="scss" scoped></style>

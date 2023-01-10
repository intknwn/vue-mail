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
</template>

<script>
import { format } from "date-fns";
import axios from "axios";
import EMailService from "@/services/email/";

export default {
  async setup() {
    const { data: emails } = await EMailService.getEmails();
    await new Promise((resolve) => setTimeout(resolve, 2000));

    return { emails };
  },
  methods: {
    formatDate(date) {
      return format(new Date(date), "MMM do yyyy");
    },
    readEmail(email) {
      return EMailService.readEmail(email);
    },
    archiveEmail(email) {
      return EMailService.archiveEmail(email);
    },
  },
  computed: {
    sortedEmails() {
      return this.emails.sort((e1, e2) => e1.sentAt < e2.sentAt);
    },
    currentEmails() {
      return this.sortedEmails.filter((e) => !e.archived);
    },
  },
};
</script>

<style lang="scss" scoped></style>

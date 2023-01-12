import axios from "axios";

const URL = "http://localhost";
const PORT = 3004;
const BASE_URL = `${URL}:${PORT}/`;

const api = axios.create({
  baseURL: BASE_URL,
});

export default {
  getEmails() {
    return api.get("/emails");
  },
  updateEmail(email) {
    return api.put(`/emails/${email.id}`, email);
  },
  bulkEmailUpdate(emails) {
    return Promise.all[emails.map((email) => this.updateEmail(email))];
  },
};

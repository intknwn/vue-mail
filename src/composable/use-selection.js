import { reactive, ref } from "vue";
import EMailService from "@/services/email";

const emails = reactive(new Set());

const useSelection = () => {
  const toggle = (email) => (emails.has(email) ? emails.delete(email) : emails.add(email));
  const clear = () => emails.clear();
  const addAll = (all) => {
    all.forEach((item) => emails.add(item));
  };
  const updateSelection = (updates = {}) => {
    const [prop, value] = Object.entries(updates)[0];
    const emailsToUpdate = [];

    emails.forEach((email) => {
      if (email[prop] === value) return;

      email[prop] = value;
      emailsToUpdate.push(email);
    });

    EMailService.bulkEmailUpdate(emailsToUpdate);
  };

  const markRead = () => updateSelection({ read: true });
  const markUnread = () => updateSelection({ read: false });
  const archive = () => {
    updateSelection({ archived: true });
    clear();
  };

  const hasRead = () => [...emails].every((email) => email.read);
  const hasUnread = () => [...emails].every((email) => !email.read);

  return {
    emails,
    toggle,
    clear,
    addAll,
    markRead,
    markUnread,
    archive,
    hasRead,
    hasUnread,
  };
};

export default useSelection;

import { onBeforeUnmount } from "vue";

export default (keyBindings) => {
  const keys = Object.keys(keyBindings);

  const onKeyDown = ({ key }) => {
    if (keys.includes(key)) {
      keyBindings[key]();
    }
  };

  window.addEventListener("keydown", onKeyDown);
  onBeforeUnmount(() => window.removeEventListener("keydown", onKeyDown));
};

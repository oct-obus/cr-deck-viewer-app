export default {
  getString: async () => {
    try {
      return await navigator.clipboard.readText();
    } catch {
      return '';
    }
  },
  setString: (text) => {
    try { navigator.clipboard.writeText(text); } catch {}
  },
};

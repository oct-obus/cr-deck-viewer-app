const store = {};
export default {
  getItem: async (key) => store[key] || null,
  setItem: async (key, value) => { store[key] = value; },
  removeItem: async (key) => { delete store[key]; },
};

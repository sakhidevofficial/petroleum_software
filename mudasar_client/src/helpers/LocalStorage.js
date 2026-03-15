const KEYS = {
  TOKEN: "TOKEN",
  USER: "USER",
};

const get = (key, isString = false) => {
  if (isString) return localStorage.getItem(key);
  else return JSON.parse(localStorage.getItem(key));
};

const set = (key, value, isString = false) => {
  if (isString) return localStorage.setItem(key, value);
  else return localStorage.setItem(key, JSON.stringify(value));
};

const LocalStorage = {
  getToken: () => get(KEYS.TOKEN, true),
  setToken: (value) => set(KEYS.TOKEN, value, true),
  getUser: () => get(KEYS.USER),
  setUser: (user) => set(KEYS.USER, user),
  clear: () => localStorage.clear(),
};

export default LocalStorage;

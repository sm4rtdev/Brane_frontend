export const getFromLocal = (key) => {
  return JSON.parse(window.localStorage.getItem(key));
};

export const updateLocal = (key, data) => {
  window.localStorage.setItem(key, JSON.stringify(data));
};

export const removeFromLocal = (key) => {
  window.localStorage.removeItem(key);
};

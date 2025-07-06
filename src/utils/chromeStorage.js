export const chromeStorage = {
  get: async (key, defaultValue, storageArea = "local") => {
    const keyObj = defaultValue === undefined ? key : { [key]: defaultValue };
    const items = await chrome.storage[storageArea].get(keyObj);
    return items[key];
  },

  set: async (key, value, storageArea = "local") => {
    await chrome.storage[storageArea].set({ [key]: value });
  },

  remove: async (key, storageArea = "local") => {
    await chrome.storage[storageArea].remove(key);
  },

  clear: async (storageArea = "local") => {
    await chrome.storage[storageArea].clear();
  },
};

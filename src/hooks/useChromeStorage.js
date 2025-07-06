import { useCallback, useEffect, useState } from "react";

import { chromeStorage } from "@/utils/chromeStorage";

const useChromeStorage = (key, initialValue, storageArea = "local") => {
  const [INITIAL_VALUE] = useState(() =>
    typeof initialValue === "function" ? initialValue() : initialValue
  );
  const [STORAGE_AREA] = useState(storageArea);
  const [state, setState] = useState(INITIAL_VALUE);
  const [isSaved, setIsSaved] = useState(true);
  const [error, setError] = useState("");
  const [isStorageLoaded, setIsStorageLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await chromeStorage.get(key, INITIAL_VALUE, STORAGE_AREA);
        setState(res);
        setIsSaved(true);
        setError("");
      } catch (error) {
        setIsSaved(false);
        setError(error.message || "Storage error");
      } finally {
        setIsStorageLoaded(true);
      }
    })();
  }, [key, INITIAL_VALUE, STORAGE_AREA]);

  const updateValue = useCallback(
    async (newValue) => {
      const toStore =
        typeof newValue === "function" ? newValue(state) : newValue;

      try {
        await chromeStorage.set(key, toStore, STORAGE_AREA);
        setIsSaved(true);
        setError("");
      } catch (error) {
        setState(toStore);
        setIsSaved(false);
        setError(error.message || "Storage error");
      }
    },
    [STORAGE_AREA, key, state]
  );

  useEffect(() => {
    const onChange = (changes, areaName) => {
      if (areaName === STORAGE_AREA && key in changes) {
        const change = changes[key];
        const isValueStored = "newValue" in change;

        if (isValueStored) {
          setState(change.newValue);
        } else {
          setState(INITIAL_VALUE);
        }

        setIsSaved(isValueStored);
        setError("");
      }
    };

    chrome.storage.onChanged.addListener(onChange);
    return () => {
      chrome.storage.onChanged.removeListener(onChange);
    };
  }, [key, STORAGE_AREA, INITIAL_VALUE]);

  return [state, updateValue, isSaved, error, isStorageLoaded];
};

export default useChromeStorage;

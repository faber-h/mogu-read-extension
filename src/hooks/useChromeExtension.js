import { useCallback } from "react";

export const useChromeExtension = () => {
  const getCurrentTab = useCallback(() => {
    return new Promise((resolve) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        resolve(tabs[0] || null);
      });
    });
  }, []);

  const isValidTab = useCallback((tab) => {
    if (!tab) return false;
    const url = tab.url || "";
    return (
      !url.startsWith("chrome://") && !url.startsWith("chrome-extension://")
    );
  }, []);

  const executeScript = useCallback(async (tabId, func) => {
    return new Promise((resolve, reject) => {
      chrome.scripting.executeScript({ target: { tabId }, func }, (results) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else {
          resolve(results);
        }
      });
    });
  }, []);

  const injectContentScript = useCallback(
    async (tabId, files = ["content.js"]) => {
      return new Promise((resolve, reject) => {
        chrome.scripting.executeScript(
          { target: { tabId }, files },
          (results) => {
            if (chrome.runtime.lastError) {
              reject(new Error(chrome.runtime.lastError.message));
            } else {
              resolve(results);
            }
          }
        );
      });
    },
    []
  );

  const sendMessage = useCallback(
    async (message) => {
      const tab = await getCurrentTab();

      if (!isValidTab(tab)) {
        throw new Error("Invalid tab or URL");
      }

      const tabId = tab.id;

      try {
        const isInjected = await executeScript(
          tabId,
          () => !!window.moguReadState
        );
        const alreadyInjected = isInjected?.[0]?.result;

        if (!alreadyInjected) {
          await injectContentScript(tabId);
        }

        return new Promise((resolve, reject) => {
          chrome.tabs.sendMessage(tabId, message, (response) => {
            if (chrome.runtime.lastError) {
              reject(new Error(chrome.runtime.lastError.message));
            } else {
              resolve(response);
            }
          });
        });
      } catch (error) {
        console.warn("메시지 전송 실패:", error.message);
        throw error;
      }
    },
    [getCurrentTab, isValidTab, executeScript, injectContentScript]
  );

  const sendMessageSafely = useCallback(
    async (message, onError) => {
      try {
        return await sendMessage(message);
      } catch (error) {
        console.warn("메시지 전송 실패:", error.message);
        if (onError) onError(error);
        return null;
      }
    },
    [sendMessage]
  );

  return {
    getCurrentTab,
    isValidTab,
    executeScript,
    injectContentScript,
    sendMessage,
    sendMessageSafely,
  };
};

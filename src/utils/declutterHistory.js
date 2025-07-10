// declutterStorage.js

import { chromeStorage } from "./chromeStorage";

export const DECLUTTER_PAGE_KEY = "moguread_decluttered_pages";

export const savePage = async (page) => {
  try {
    const existing = await chromeStorage.get(DECLUTTER_PAGE_KEY, []);
    const newHistory = [page, ...existing].slice(0, 1000);
    await chromeStorage.set(DECLUTTER_PAGE_KEY, newHistory);
    return newHistory;
  } catch (error) {
    console.error("페이지 저장 실패:", error);
    throw error;
  }
};

export const saveSentences = async (sentences) => {
  try {
    if (!Array.isArray(sentences)) {
      throw new Error("sentences는 배열이어야 합니다.");
    }

    const existingPages = await chromeStorage.get(DECLUTTER_PAGE_KEY, []);
    const updatedPages = [...sentences, ...existingPages].slice(0, 1000);

    await chromeStorage.set(DECLUTTER_PAGE_KEY, updatedPages);
    return updatedPages;
  } catch (error) {
    console.error("선택된 문장 저장 실패:", error);
    throw error;
  }
};

export const getPages = async () => {
  try {
    return await chromeStorage.get(DECLUTTER_PAGE_KEY, []);
  } catch (error) {
    console.error("페이지 조회 실패:", error);
    throw error;
  }
};

export const deletePage = async (pageId) => {
  try {
    const pages = await chromeStorage.get(DECLUTTER_PAGE_KEY, []);
    const filtered = pages.filter((page) => page.id !== pageId);
    await chromeStorage.set(DECLUTTER_PAGE_KEY, filtered);
    return filtered;
  } catch (error) {
    console.error("페이지 삭제 실패:", error);
    throw error;
  }
};

export const deletePagesByUrl = async (url) => {
  try {
    const pages = await chromeStorage.get(DECLUTTER_PAGE_KEY, []);
    const filtered = pages.filter((page) => page.url !== url);
    await chromeStorage.set(DECLUTTER_PAGE_KEY, filtered);
    return filtered;
  } catch (error) {
    console.error("URL별 페이지 삭제 실패:", error);
    throw error;
  }
};

export const clearAllPages = async () => {
  try {
    await chromeStorage.remove(DECLUTTER_PAGE_KEY);
  } catch (error) {
    console.error("전체 페이지 삭제 실패:", error);
    throw error;
  }
};

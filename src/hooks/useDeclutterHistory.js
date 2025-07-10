import { useCallback } from "react";

import {
  DECLUTTER_PAGE_KEY,
  savePage as savePageToStorage,
  saveSentences as saveSentencesToStorage,
  deletePage as deletePageFromStorage,
  deletePagesByUrl as deletePagesByUrlFromStorage,
  clearAllPages as clearAllPagesFromStorage,
} from "@/utils/declutterHistory";
import { extractDomain } from "@/utils/extractDomain";

import { useChromeExtension } from "./useChromeExtension";
import useChromeStorage from "./useChromeStorage";

export function useDeclutterHistory() {
  const [pages, setPages, isSaved, error, isStorageLoaded] = useChromeStorage(
    DECLUTTER_PAGE_KEY,
    []
  );

  const { getCurrentTab } = useChromeExtension();

  const savePage = useCallback(
    async ({ cleanedContent, id }) => {
      try {
        const tab = await getCurrentTab();
        if (!tab) throw new Error("현재 탭 정보를 가져올 수 없습니다.");

        const page = {
          id,
          url: tab.url,
          title: tab.title || "-",
          domain: extractDomain(tab.url),
          cleanedContent,
          savedAt: Date.now(),
        };

        const updated = await savePageToStorage(page);
        setPages(updated);
        return page;
      } catch (error) {
        console.error("페이지 저장 중 오류:", error);
        throw error;
      }
    },
    [getCurrentTab, setPages]
  );

  const saveSentences = useCallback(
    async (sentences) => {
      try {
        const tab = await getCurrentTab();
        if (!tab) throw new Error("현재 탭 정보를 가져올 수 없습니다.");

        const sentencesWithMeta = sentences.map((sentence) => ({
          ...sentence,
          url: tab.url,
          title: tab.title || "-",
          domain: extractDomain(tab.url),
          savedAt: Date.now(),
        }));

        const updated = await saveSentencesToStorage(sentencesWithMeta);
        setPages(updated);
        return updated;
      } catch (error) {
        console.error("선택된 문장 저장 중 오류:", error);
        throw error;
      }
    },
    [getCurrentTab, setPages]
  );

  const removePage = useCallback(
    async (pageId) => {
      try {
        const updated = await deletePageFromStorage(pageId);
        setPages(updated);
        return updated;
      } catch (error) {
        console.error("페이지 삭제 중 오류:", error);
        throw error;
      }
    },
    [setPages]
  );

  const removePagesByUrl = useCallback(
    async (url) => {
      try {
        const updated = await deletePagesByUrlFromStorage(url);
        setPages(updated);
        return updated;
      } catch (error) {
        console.error("URL별 페이지 삭제 중 오류:", error);
        throw error;
      }
    },
    [setPages]
  );

  const clearAllPages = useCallback(async () => {
    try {
      await clearAllPagesFromStorage();
      setPages([]);
    } catch (error) {
      console.error("전체 페이지 삭제 중 오류:", error);
      throw error;
    }
  }, [setPages]);

  const getPagesByUrl = useCallback(
    (url) => {
      return pages.filter((page) => page.url === url);
    },
    [pages]
  );

  return {
    pages,
    isSaved,
    error,
    isStorageLoaded,
    savePage,
    saveSentences,
    removePage,
    removePagesByUrl,
    clearAllPages,
    getPagesByUrl,
  };
}

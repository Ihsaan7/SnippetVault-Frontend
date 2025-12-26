/* eslint-disable react-refresh/only-export-components */
import { useState, createContext, useContext } from "react";
import apiConfig from "../utils/axios";

const SnippetContext = createContext();

export const SnippetProvider = ({ children }) => {
  const [snippets, setSnippets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 6,
    totalPages: 1,
  });

  const createSnippet = async (formData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiConfig.post("/snippets/create", formData);
      if (response && response.data && response.data.data) {
        setSnippets((prev) => [response.data.data, ...prev]);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Creating snippet failed!");
      console.error("FRONTEND_CREATE_CONTEXT");
    } finally {
      setIsLoading(false);
    }
  };

  const getSnippets = async ({
    page = 1,
    limit = 6,
    search = "",
    tags = [],
    language = "",
    from = "",
    to = "",
  } = {}) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiConfig.get("/snippets", {
        params: {
          page,
          limit,
          search,
          tags: Array.isArray(tags) ? tags.join(",") : tags,
          language,
          from,
          to,
        },
      });
      if (response && response.data && response.data.data.snippets) {
        setSnippets(response.data.data.snippets);
        if (response.data.data.pagination) {
          setPagination(response.data.data.pagination);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || "Snippet fetching failed!");
      console.error("FRONTEND_FETCHING-ALL_CONTEXT");
    } finally {
      setIsLoading(false);
    }
  };

  const getAllTags = async () => {
    try {
      const response = await apiConfig.get("/snippets/tags");
      return response?.data?.data?.tags || [];
    } catch (err) {
      console.error("FRONTEND_TAGS_FETCH_CONTEXT", err);
      return [];
    }
  };

  const getTagStats = async () => {
    try {
      const response = await apiConfig.get("/snippets/tags/stats");
      return response?.data?.data?.stats || [];
    } catch (err) {
      console.error("FRONTEND_TAGS_STATS_FETCH_CONTEXT", err);
      return [];
    }
  };

  const getSnippetByID = async (snippetID) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiConfig.get(`/snippets/${snippetID}`);
      if (response && response.data && response.data.data) {
        return response.data.data;
      }
    } catch (err) {
      setError(err.response?.data?.message || "SnippetByID fetching failed!");
      console.error("FRONTEND_FETCHING-BY-ID_CONTEXT");
    } finally {
      setIsLoading(false);
    }
  };

  const updateSnippet = async (snippetID, formData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiConfig.put(`/snippets/${snippetID}`, formData);
      if (response && response.data && response.data.data) {
        setSnippets((prev) =>
          prev.map((s) => (s._id === snippetID ? response.data.data : s))
        );
      }
    } catch (err) {
      setError(err.response?.data?.message || "Update snippet failed!");
      console.error("FRONTEND_UPDATE_CONTEXT");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSnippet = async (snippetID) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiConfig.delete(`/snippets/${snippetID}`);
      if (response && response.data && response.data.success) {
        setSnippets((prev) => prev.filter((s) => s._id !== snippetID));
      }
    } catch (err) {
      setError(err.response?.data?.message || "Deleting snippet failed!");
      console.error("FRONTEND_DELETE_CONTEXT");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFavorite = async (snippetID) => {
    try {
      const response = await apiConfig.post(`/snippets/${snippetID}/favorite`);
      const data = response?.data?.data;

      if (data?.snippetID) {
        setSnippets((prev) =>
          prev.map((s) =>
            s._id === data.snippetID
              ? {
                  ...s,
                  isFavorited: data.isFavorited,
                  favoriteCount: data.favoriteCount,
                }
              : s
          )
        );
      }

      return data;
    } catch (err) {
      console.error("FRONTEND_TOGGLE_FAVORITE_CONTEXT", err);
      throw err;
    }
  };

  const getFavoriteSnippets = async ({ page = 1, limit = 10 } = {}) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiConfig.get("/snippets/favorites", {
        params: { page, limit },
      });

      if (response?.data?.data?.snippets) {
        setSnippets(response.data.data.snippets);
        if (response.data.data.pagination) setPagination(response.data.data.pagination);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Fetching favorites failed!");
      console.error("FRONTEND_FETCH_FAVORITES_CONTEXT", err);
    } finally {
      setIsLoading(false);
    }
  };

  const getPublicSnippets = async ({
    page = 1,
    limit = 10,
    search = "",
    tags = [],
    language = "",
    from = "",
    to = "",
  } = {}) => {
    try {
      const response = await apiConfig.get("/snippets/public", {
        params: {
          page,
          limit,
          search,
          tags: Array.isArray(tags) ? tags.join(",") : tags,
          language,
          from,
          to,
        },
      });
      return response?.data?.data;
    } catch (err) {
      console.error("FRONTEND_PUBLIC_SNIPPETS_CONTEXT", err);
      throw err;
    }
  };

  const getPublicSnippetByID = async (snippetID) => {
    try {
      const response = await apiConfig.get(`/snippets/public/${snippetID}`);
      return response?.data?.data;
    } catch (err) {
      console.error("FRONTEND_PUBLIC_SNIPPET_BY_ID_CONTEXT", err);
      throw err;
    }
  };

  const forkPublicSnippet = async (snippetID) => {
    try {
      const response = await apiConfig.post(`/snippets/${snippetID}/fork`);
      return response?.data?.data;
    } catch (err) {
      console.error("FRONTEND_FORK_SNIPPET_CONTEXT", err);
      throw err;
    }
  };

  const getSnippetStats = async () => {
    try {
      const response = await apiConfig.get("/snippets/stats");
      return response?.data?.data;
    } catch (err) {
      console.error("FRONTEND_SNIPPET_STATS_CONTEXT", err);
      throw err;
    }
  };

  return (
    <SnippetContext.Provider
      value={{
        pagination,
        snippets,
        isLoading,
        error,
        createSnippet,
        getSnippetByID,
        getSnippets,
        getAllTags,
        getTagStats,
        toggleFavorite,
        getFavoriteSnippets,
        getPublicSnippets,
        getPublicSnippetByID,
        forkPublicSnippet,
        getSnippetStats,
        updateSnippet,
        deleteSnippet,
      }}
    >
      {children}
    </SnippetContext.Provider>
  );
};

export const useSnippet = () => {
  const context = useContext(SnippetContext);
  if (!context) {
    throw new Error("useSnippet must be used within SnippetProvider");
  }
  return context;
};

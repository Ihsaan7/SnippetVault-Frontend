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
        setSnippets([response.data.data, ...snippets]);
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
        setSnippets(
          snippets.map((s) => (s._id === snippetID ? response.data.data : s))
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
        setSnippets(snippets.filter((s) => s._id !== snippetID));
      }
    } catch (err) {
      setError(err.response?.data?.message || "Deleting snippet failed!");
      console.error("FRONTEND_DELETE_CONTEXT");
    } finally {
      setIsLoading(false);
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

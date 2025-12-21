import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export function SnippetForm() {
  const [formData, setFormData] = useState({
    title: "",
    code: "",
    codeLanguage: "",
    tags: [],
    description: "",
    isPublic: "",
  });
  const { isLoading, error, user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  const handleChange = (e) => {};
}

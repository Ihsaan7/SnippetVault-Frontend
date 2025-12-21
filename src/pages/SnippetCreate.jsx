import { SnippetForm } from "../components/snippets/SnippetForm";
import { useNavigate } from "react-router-dom";

export default function SnippetCreate() {
  const navigate = useNavigate();

  return <SnippetForm onSuccess={() => navigate("/dashboard")} />;
}

import { useState } from "react";
import QueryProcessor from "../utils/QueryProcessor";

export default function Home() {
  const [query, setQuery] = useState<string>("");

  return (
    <div>
      <h1>Mi estudio IA para fotos sameso!!</h1>
      <p>Escribe tu prompt para editar tus imágenes:</p>
      <input
        type="text"
        value={query}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setQuery(e.target.value)
        }
      />
      <div>
        {QueryProcessor(query) == "" ? "No Match" : QueryProcessor(query)}
      </div>
    </div>
  );
}

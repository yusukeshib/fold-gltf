import { useState } from "react";
import { downloadBlob, browse } from "./utils";
import { convertFoldToGltf } from "./converter";

function App() {
  const [error, setError] = useState("");
  const handleClick = async () => {
    try {
      setError("");
      const file = await browse({});
      const blob = await convertFoldToGltf(file);
      downloadBlob("export.gltf", blob);
    } catch (err) {
      setError(err instanceof Error ? err.message : `${err}`);
    }
  };

  return (
    <>
      <p className="read-the-docs">
        Open your FOLD file, it generates your GLTF file with animation.
      </p>
      <button onClick={handleClick}>Browse</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </>
  );
}

export default App;

import { useEffect, useRef, useState } from "react";
import { downloadBlob, browse } from "./utils";
import { Converter, createConverter } from "./converter";

function App() {
  const [loaded, setLoaded] = useState<
    | { type: "unloaded" }
    | { type: "loaded"; converter: Converter }
    | { type: "error"; error: string }
  >({ type: "unloaded" });

  const load = async () => {
    try {
      setLoaded({ type: "unloaded" });
      const file = await browse({ accept: ".fold" });
      const converter = await createConverter(file);
      setLoaded({ type: "loaded", converter });
    } catch (err) {
      const error = err instanceof Error ? err.message : `${err}`;
      setLoaded({ type: "error", error });
    }
  };

  const download = async () => {
    if (loaded.type === "loaded") {
      const blob = await loaded.converter.exportGLTF();
      downloadBlob("export.gltf", blob);
    }
  };

  return (
    <>
      <p>
        <button onClick={load}>Load FOLD file</button>
      </p>
      {loaded.type === "error" && (
        <p style={{ color: "red" }}>{loaded.error}</p>
      )}
      {loaded.type === "loaded" && (
        <>
          <Preview converter={loaded.converter} />
          <p>
            <button onClick={download}>Download GLTF</button>
          </p>
        </>
      )}
    </>
  );
}

function Preview({ converter }: { converter: Converter }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const elem = ref.current;
    if (!elem) return;

    elem.appendChild(converter.renderer.domElement);
    return () => {
      elem.removeChild(converter.renderer.domElement);
    };
  }, [converter]);

  return (
    <div
      ref={ref}
      style={{
        background: "black",
        width: converter.width,
        height: converter.height,
      }}
    />
  );
}

export default App;

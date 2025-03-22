import * as THREE from "three";
import { GLTFExporter } from "three/examples/jsm/Addons.js";
import { readText } from "./utils";

export const convertFoldToGltf = async (file: File) => {
  // Load FOLD file
  const jsonStr = await readText(file);
  const json = JSON.parse(jsonStr);

  const scene = createScene(json);

  const exporter = new GLTFExporter();

  const result = await new Promise<ArrayBuffer>((resolve, reject) => {
    exporter.parse(scene, (gltf) => resolve(gltf as ArrayBuffer), reject, {
      binary: true,
    });
  });

  return new Blob([result]);
};

function createScene(json: any) {
  const scene = new THREE.Scene();
  // TODO: Setup scene
  return scene;
}

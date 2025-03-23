import * as THREE from "three";
import { GLTFExporter } from "three/examples/jsm/Addons.js";
import { readText } from "./utils";

type Resolved<T> = T extends Promise<infer R> ? R : never;

export type Converter = Resolved<ReturnType<typeof createConverter>>;

export const createConverter = async (file: File) => {
  const jsonStr = await readText(file);
  const json = JSON.parse(jsonStr);
  const width = 640;
  const height = 480;

  // TODO:

  const scene = new THREE.Scene();
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(width, height);
  const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  camera.position.z = 5;

  const exportGLTF = async () => {
    const exporter = new GLTFExporter();

    const result = await new Promise<ArrayBuffer>((resolve, reject) => {
      exporter.parse(scene, (gltf) => resolve(gltf as ArrayBuffer), reject, {
        binary: true,
      });
    });

    return new Blob([result]);
  };

  const animate = () => {
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
  };
  renderer.setAnimationLoop(animate);

  return {
    renderer,
    exportGLTF,
    width,
    height,
  };
};

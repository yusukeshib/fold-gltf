import * as THREE from "three";
import { GLTFExporter } from "three/examples/jsm/Addons.js";
import { readText } from "./utils";

type Resolved<T> = T extends Promise<infer R> ? R : never;

export type Converter = Resolved<ReturnType<typeof createConverter>>;

export const createConverter = async (file: File) => {
  const jsonStr = await readText(file);
  const fold = JSON.parse(jsonStr);

  const width = 640;
  const height = 480;
  const scene = new THREE.Scene();
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(width, height);
  const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);

  const origami = createOrigamiFromFold(fold);
  scene.add(origami);

  // Light setup
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(5, 5, 5);
  scene.add(light);

  // Set camera position
  camera.position.z = 3;

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

// Function to convert FOLD data to Three.js scene
function createOrigamiFromFold(foldData: any): THREE.Mesh {
  // Get vertices
  const vertices = foldData.vertices_coords.map(
    (v: number[]) => new THREE.Vector3(v[0], v[1], v[2] || 0),
  );

  // Create faces
  const faces = foldData.faces_vertices;
  const geometry = new THREE.BufferGeometry();
  const positions: number[] = [];
  const normals: number[] = [];

  for (const face of faces) {
    // Process each face
    for (let i = 1; i < face.length - 1; i++) {
      const v0 = vertices[face[0]];
      const v1 = vertices[face[i]];
      const v2 = vertices[face[i + 1]];

      // Add vertex positions to buffer
      positions.push(v0.x, v0.y, v0.z, v1.x, v1.y, v1.z, v2.x, v2.y, v2.z);

      // Calculate normals
      const normal = new THREE.Vector3()
        .subVectors(v2, v1)
        .cross(new THREE.Vector3().subVectors(v0, v1))
        .normalize();
      normals.push(
        normal.x,
        normal.y,
        normal.z,
        normal.x,
        normal.y,
        normal.z,
        normal.x,
        normal.y,
        normal.z,
      );
    }
  }

  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3),
  );
  geometry.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));

  // Create material and mesh
  const material = new THREE.MeshStandardMaterial({
    color: 0xff0000,
    side: THREE.DoubleSide,
    flatShading: true,
  });
  const mesh = new THREE.Mesh(geometry, material);

  return mesh;
}

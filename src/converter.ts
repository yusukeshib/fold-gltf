import * as THREE from "three";
import { GLTFExporter } from "three/examples/jsm/Addons.js";

const scene = new THREE.Scene();

const exporter = new GLTFExporter();

exporter.parse(
  scene,
  function (gltf) {
    console.log(gltf);
  },
  function (error) {
    console.error("Failed export:", error);
  },
  {},
);

"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const ThreeScene = ({ objToRender }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 5000);
    camera.position.set(0, 600, 0); 
    camera.lookAt(0, 0, 0); 

    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    containerRef.current.appendChild(renderer.domElement);

    const topLight = new THREE.DirectionalLight(0xffffff, 1);
    topLight.position.set(300, 500, 300);
    topLight.castShadow = true;
    topLight.shadow.bias = -0.005;
    scene.add(topLight);

    const ambientLight = new THREE.AmbientLight(0x404040, 1.5);
    scene.add(ambientLight);

    const loader = new GLTFLoader();
    loader.load(
      `/${objToRender}.glb`,
      (gltf) => {
        const object = gltf.scene;

        const box = new THREE.Box3().setFromObject(object);
        const center = box.getCenter(new THREE.Vector3());
        object.position.sub(center);

        object.position.x += 180;

        scene.add(object);

        const size = box.getSize(new THREE.Vector3());
        const targetPosition = new THREE.Vector3(500, 500, 500);
        const startPosition = new THREE.Vector3(0, 1000, 0);
        const cameraTarget = center.clone();
        cameraTarget.x -= 100;

        let progress = 0;
        const animateCamera = () => {
          if (progress < 1) {
            progress += 0.008; 
            camera.position.lerpVectors(startPosition, targetPosition, progress);
            camera.lookAt(cameraTarget);
            requestAnimationFrame(animateCamera);
          }
        };

        animateCamera();
      },
      undefined,
      (error) => console.error("Error loading the model:", error)
    );

    // const controls = new OrbitControls(camera, renderer.domElement);
    // const gridHelper = new THREE.GridHelper(1000, 10); // 1000 size, 10 divisions
    // scene.add(gridHelper);

    // const axesHelper = new THREE.AxesHelper(500); // Axes with size 500
    // scene.add(axesHelper);

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      controls.dispose();
    };
  }, [objToRender]);

  return <div ref={containerRef} style={{ width: "100%", height: "100vh" }} />;
};

export default ThreeScene;


"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";

const ThreeScene = ({ objToRender }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 5000);
    camera.position.set(2000, 600, 1000); // Initial camera position
    camera.lookAt(0, 0, 0);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true; // Enable shadows
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Use soft shadows
    containerRef.current.appendChild(renderer.domElement);

    // Sunlight (Directional Light) - positioned behind the final camera target
    const sunLight = new THREE.DirectionalLight(0xffffff, 3); // Bright sunlight
    sunLight.position.set(2500, 1200, 1500); // Behind and above the ending camera position
    sunLight.castShadow = true;

    // Shadow settings
    sunLight.shadow.mapSize.width = 4096; // High resolution shadow map
    sunLight.shadow.mapSize.height = 4096;
    sunLight.shadow.bias = -0.0005; // Revert bias to avoid ripples but retain shadows

    // Adjust the shadow camera bounds for better shadow precision
    sunLight.shadow.camera.left = -800;
    sunLight.shadow.camera.right = 800;
    sunLight.shadow.camera.top = 800;
    sunLight.shadow.camera.bottom = -800;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 3000;

    scene.add(sunLight);

    // Ambient Light for global illumination
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5); // Subtle ambient light
    scene.add(ambientLight);

    // HDRI Environment Map
    const hdrLoader = new RGBELoader();
    hdrLoader.load('/test.hdr', (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      scene.environment = texture; // Set as environment map
      scene.background = texture; // Optional: Set as background
    });

    // Load the 3D model
    const loader = new GLTFLoader();
    loader.load(
      `/${objToRender}.glb`,
      (gltf) => {
        const object = gltf.scene;

        // Center the object
        const box = new THREE.Box3().setFromObject(object);
        const center = box.getCenter(new THREE.Vector3());
        object.position.sub(center);

        // Offset the model along the X-axis
        object.position.x += 180;

        // Enable shadows for the model
        object.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true; // Object casts shadows
            child.receiveShadow = true; // Object receives shadows
            child.material.metalness = 0.2; // Slightly reflective
            child.material.roughness = 0.5; // Smooth surfaces
            child.material.normalMap = child.material.normalMap || null; // Reenable normal maps
          }
        });

        scene.add(object);

        // Camera animation towards target position
        const targetPosition = new THREE.Vector3(500, 500, 500);
        const startPosition = new THREE.Vector3(3000, 1000, 600);
        const cameraTarget = center.clone();
        cameraTarget.x -= 80;

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

    // Orbit Controls for user interaction
    const controls = new OrbitControls(camera, renderer.domElement);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    // Cleanup on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      controls.dispose();
    };
  }, [objToRender]);

  return <div ref={containerRef} style={{ width: "100%", height: "100vh" }} />;
};

export default ThreeScene;

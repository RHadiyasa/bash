"use client";
import * as THREE from "three";

export const GlobeScene = (canvas) => {
  let scene, camera, renderer, earthmesh, cloudmesh, starmesh;

  const init = () => {
    if (!canvas) return console.error("Canvas not found");

    // Inisialisasi scene, camera, dan renderer
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 3;
    scene.add(camera);

    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    renderer.autoClear = false;
    renderer.setClearColor(0x000000, 0.0);

    // Inisialisasi bumi
    const earthgeometry = new THREE.SphereGeometry(0.6, 32, 32);
    const earthmaterial = new THREE.MeshPhongMaterial({
      roughness: 1,
      metalness: 0,
      map: new THREE.TextureLoader().load("/earthmap1k.jpg"),
      bumpMap: new THREE.TextureLoader().load("/earthbump.jpg"),
      bumpScale: 0.3,
    });

    earthmesh = new THREE.Mesh(earthgeometry, earthmaterial);
    earthmesh.position.set(0.75, 0, 0.5);
    scene.add(earthmesh);

    // Inisialisasi pencahayaan
    const ambientlight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientlight);

    const pointerlight = new THREE.PointLight(0xffffff, 0.9);
    pointerlight.position.set(5, 3, 5);
    scene.add(pointerlight);

    // Inisialisasi awan
    const cloudgeometry = new THREE.SphereGeometry(0.61, 32, 32);
    const cloudmaterial = new THREE.MeshPhongMaterial({
      map: new THREE.TextureLoader().load("/earthCloud.png"),
      transparent: true,
      opacity: 0.3,
    });

    cloudmesh = new THREE.Mesh(cloudgeometry, cloudmaterial);
    cloudmesh.position.set(0.75, 0, 0.5);
    scene.add(cloudmesh);

    // Inisialisasi bintang
    const stargeometry = new THREE.SphereGeometry(10, 64, 64);
    const starmaterial = new THREE.MeshBasicMaterial({
      map: new THREE.TextureLoader().load("/galaxy.png"),
      side: THREE.BackSide,
      transparent: true,
      opacity: 0.3,
    });

    starmesh = new THREE.Mesh(stargeometry, starmaterial);
    scene.add(starmesh);

    // Fungsi untuk mengubah ukuran renderer dan camera saat ukuran jendela berubah
    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", onWindowResize, false);

    // Fungsi untuk zoom in dan zoom out dengan mulus
    const onWheel = (event) => {
      const delta = Math.sign(event.deltaY);
      camera.position.z += delta * 0.1;
      if (camera.position.z < 1) camera.position.z = 1; // Membatasi zoom in
      if (camera.position.z > 10) camera.position.z = 10; // Membatasi zoom out
    };

    // Menambahkan event listener untuk wheel
    window.addEventListener("wheel", onWheel, { passive: true });

    // Animasi
    const animate = () => {
      requestAnimationFrame(animate);
      earthmesh.rotation.y -= 0.0015;
      cloudmesh.rotation.y += 0.0015;
      starmesh.rotation.y += 0.0005;
      render();
    };

    const render = () => {
      renderer.render(scene, camera);
    };

    animate();
  };

  const onResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };

  const onWheel = (event) => {
    camera.position.z += Math.sign(event.deltaY) * 0.1;
    camera.position.z = Math.max(1, Math.min(10, camera.position.z));
  };

  const animate = () => {
    requestAnimationFrame(animate);
    earthmesh.rotation.y -= 0.0015;
    cloudmesh.rotation.y += 0.0015;
    starmesh.rotation.y += 0.0005;
    renderer.render(scene, camera);
  };

  const dispose = () => {
    renderer.dispose();
    window.removeEventListener("resize", onResize);
    window.removeEventListener("wheel", onWheel);
  };

  return { init, dispose };
};

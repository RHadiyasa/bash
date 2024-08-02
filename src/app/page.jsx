"use client";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getUserDetail } from "@/modules/services/user.service";
import { Loader2 } from "lucide-react";
import useHeaderData from "@/hooks/useHeaderData";
import "./styles.css";
import { TypeAnimation } from "react-type-animation";

export default function Home() {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { logout } = useHeaderData();
  const router = useRouter();
  const canvasRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    const getUserDetails = async () => {
      try {
        const res = await getUserDetail();
        setUserData(res);
      } catch (error) {
        if (error.response && error.response.status === 403) {
          toast.success("Selamat Datang");
        } else {
          toast.error(error.message);
        }
      } finally {
        setLoading(false);
      }
    };
    getUserDetails();
  }, []);

  useEffect(() => {
    let scene, camera, renderer, earthmesh, cloudmesh, starmesh;

    const main = () => {
      const canvas = canvasRef.current;

      if (!canvas) {
        console.error("Canvas not found");
        return;
      }

      console.log("Canvas found", canvas);

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

    main();

    return () => {
      if (renderer) {
        renderer.dispose();
      }
    };
  }, []);

  const handleClick = () => {
    setLoading(true);
    if (userData) {
      router.push(`/profile/${userData._id}`);
    } else {
      logout();
      router.push("/");
    }
  };

  return (
    <div className="fullscreen">
      <div className="background">
        <canvas id="c" ref={canvasRef}></canvas>
      </div>
      <div className="foreground">
        <div className="flex items-center min-h-screen">
          <Toaster position="top-right" />
          <div className="grid text-left px-10 lg:px-32">
            <div className="text-xl font-bold">
              <TypeAnimation
                sequence={[
                  // Same substring at the start will only be typed out once, initially
                  "Mulai peduli",
                  1500,
                  "Mulai mandiri",
                  2000,
                  "Jaga bumi, mulai dari sini...",
                  4000,
                ]}
                wrapper="span"
                speed={50}
                style={{ fontSize: "1em", display: "inline-block" }}
                repeat={Infinity}
              />
            </div>
            <div className="scroll-m-20 text-6xl font-extrabold tracking-tight lg:text-7xl">
              BASH INDONESIA
            </div>
            <div>Under development</div>
            <div>
              {loading ? (
                <div className="flex items-center gap-2 animate-pulse w-40 md:w-[180px] hover:bg-black/70 hover:scale-105 mt-5">
                  <Loader2 className="animate-spin" size={18} />
                  <div className="animate-pulse">Loading...</div>
                </div>
              ) : (
                <Button
                  onClick={handleClick}
                  variant="outline"
                  className="animate-pulse w-40 md:w-[180px] bg-black/30 backdrop-blur-sm hover:bg-black/70 hover:scale-105 mt-5"
                >
                  {!userData || userData.length === 0
                    ? "Mulai Sekarang"
                    : `Go to profile ${userData.username} >>`}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

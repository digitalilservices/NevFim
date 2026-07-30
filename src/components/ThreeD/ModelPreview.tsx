"use client";

import { Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import {
  Bounds,
  OrbitControls,
  useGLTF,
} from "@react-three/drei";
import * as THREE from "three";

type ModelPreviewProps = {
  modelPath: string;
};

function FurnitureModel({
  modelPath,
}: ModelPreviewProps) {
  const { scene } = useGLTF(modelPath);

  const safeScene = useMemo(() => {
    const clone = scene.clone(true);

    clone.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) {
        return;
      }

      object.castShadow = false;
      object.receiveShadow = false;

      if (Array.isArray(object.material)) {
        object.material = object.material.map((material) => material.clone());
      } else if (object.material) {
        object.material = object.material.clone();
      }
    });

    return clone;
  }, [scene]);

  return (
    <Bounds
      fit
      clip
      observe
      margin={1.25}
    >
      <primitive object={safeScene} />
    </Bounds>
  );
}

export function ModelPreview({
  modelPath,
}: ModelPreviewProps) {
  return (
    <div className="threeDModelPreview">
      <Canvas
        camera={{
          position: [4, 3, 5],
          fov: 40,
        }}
        dpr={[1, 1.25]}
        gl={{
          antialias: true,
          powerPreference: "high-performance",
        }}
      >
        <ambientLight intensity={1.7} />

        <directionalLight
          position={[5, 7, 5]}
          intensity={1.8}
        />

        <Suspense fallback={null}>
          <FurnitureModel
            modelPath={modelPath}
          />
        </Suspense>

        <OrbitControls
          enablePan={false}
          enableZoom={false}
          enableDamping
          autoRotate
          autoRotateSpeed={0.8}
        />
      </Canvas>
    </div>
  );
}
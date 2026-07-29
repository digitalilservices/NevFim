"use client";

import { Canvas } from "@react-three/fiber";
import {
  Environment,
  OrbitControls,
} from "@react-three/drei";

export function FurniturePreview() {
  return (
    <div className="furniture3dPreview">
      <div className="furniture3dPreviewHeader">
        <div>
          <strong>Вибрана модель</strong>
          <span>3D-перегляд</span>
        </div>

        <span className="preview3dBadge">360°</span>
      </div>

      <div className="furniture3dPreviewCanvas">
        <Canvas
          shadows
          camera={{
            position: [3.8, 2.7, 4.8],
            fov: 38,
          }}
        >
          <color attach="background" args={["#3d3f42"]} />

          <ambientLight intensity={1.3} />

          <directionalLight
            position={[4, 5, 4]}
            intensity={2.2}
            castShadow
          />

          <mesh
            position={[0, 0, 0]}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[2.2, 2.4, 0.65]} />

            <meshStandardMaterial
              color="#594537"
              roughness={0.55}
            />
          </mesh>

          <Environment preset="studio" />

          <OrbitControls
            enablePan={false}
            enableDamping
            autoRotate
            autoRotateSpeed={1.4}
            minDistance={3}
            maxDistance={7}
          />
        </Canvas>
      </div>

      <p>Затисніть мишку та обертайте модель</p>
    </div>
  );
}
"use client";

import { useFrame, useLoader, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import {
  getFurniture3DPlacement,
  type Furniture3DModel,
} from "@/data/furniture3d";

type LoadedFurniture = {
  model: Furniture3DModel;
  scene: THREE.Group;
};

type RoomSceneProps = {
  addedFurniture: LoadedFurniture | null;
  mobileMode?: boolean;
};


type DecorModelProps = {
  path: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  targetSize: number;
  baseY?: number;
  fitBy?: "max" | "xz" | "height";
};

function DecorModel({
  path,
  position,
  rotation = [0, 0, 0],
  targetSize,
  baseY = 0,
  fitBy = "max",
}: DecorModelProps) {
  const gltf = useLoader(GLTFLoader, path);

  const preparedScene = useMemo(() => {
    const clone = gltf.scene.clone(true);

    clone.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;

      object.castShadow = false;
      object.receiveShadow = false;
      object.frustumCulled = true;

      if (Array.isArray(object.material)) {
        object.material = object.material.map((material) => material.clone());
      } else if (object.material) {
        object.material = object.material.clone();
      }
    });

    const originalBox = new THREE.Box3().setFromObject(clone);
    const originalSize = new THREE.Vector3();
    originalBox.getSize(originalSize);

    const basis =
      fitBy === "height"
        ? Math.max(originalSize.y, 0.001)
        : fitBy === "xz"
          ? Math.max(originalSize.x, originalSize.z, 0.001)
          : Math.max(originalSize.x, originalSize.y, originalSize.z, 0.001);

    clone.scale.setScalar(targetSize / basis);
    clone.rotation.set(rotation[0], rotation[1], rotation[2]);
    clone.updateMatrixWorld(true);

    const box = new THREE.Box3().setFromObject(clone);
    const center = new THREE.Vector3();
    box.getCenter(center);

    clone.position.x += position[0] - center.x;
    clone.position.z += position[2] - center.z;
    clone.position.y += baseY + position[1] - box.min.y;

    return clone;
  }, [gltf.scene, position, rotation, targetSize, baseY, fitBy]);

  return <primitive object={preparedScene} />;
}


const ROOM_WIDTH = 8;
const ROOM_DEPTH = 10;
const ROOM_HEIGHT = 3.4;

const EYE_HEIGHT = 1.65;
const MOVE_SPEED = 2.15;

function createGrayWoodTexture(mobileMode: boolean) {
  const canvas = document.createElement("canvas");
  const textureSize = mobileMode ? 512 : 1024;
  canvas.width = textureSize;
  canvas.height = textureSize;

  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return null;
  }

  if (mobileMode) {
    ctx.scale(0.5, 0.5);
  }

  // Основа серого дуба.
  ctx.fillStyle = "#777978";
  ctx.fillRect(0, 0, 1024, 1024);

  const plankHeight = 128;

  for (let row = 0; row < 8; row++) {
    const y = row * plankHeight;

    // Лёгкое отличие оттенка между досками.
    const shade = row % 2 === 0 ? 8 : -7;
    ctx.fillStyle = `rgb(${119 + shade}, ${121 + shade}, ${120 + shade})`;
    ctx.fillRect(0, y, 1024, plankHeight);

    // Горизонтальный стык досок.
    ctx.strokeStyle = "rgba(42, 44, 43, 0.48)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(1024, y);
    ctx.stroke();

    const offset = row % 2 === 0 ? 0 : 256;

    // Вертикальные стыки.
    for (let x = -offset; x < 1024; x += 512) {
      ctx.strokeStyle = "rgba(48, 50, 49, 0.38)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y + plankHeight);
      ctx.stroke();
    }

    // Спокойная древесная текстура.
    for (let i = 0; i < 22; i++) {
      const grainY = y + 10 + Math.random() * (plankHeight - 20);

      ctx.strokeStyle =
        i % 3 === 0
          ? "rgba(220, 220, 215, 0.055)"
          : "rgba(45, 47, 46, 0.08)";

      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(0, grainY);
      ctx.bezierCurveTo(
        250,
        grainY + Math.sin(i) * 5,
        700,
        grainY - Math.cos(i) * 5,
        1024,
        grainY,
      );
      ctx.stroke();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2.2, 3.2);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = mobileMode ? 3 : 4;

  return texture;
}

function FurnitureObject({
  furniture,
}: {
  furniture: LoadedFurniture;
}) {
  const preparedScene = useMemo(() => {
    const clone = furniture.scene.clone(true);
    const placement = getFurniture3DPlacement(furniture.model);

    clone.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) {
        return;
      }

      // Сохраняем оригинальные материалы и текстуры модели.
      object.castShadow = false;
      object.receiveShadow = false;
      object.frustumCulled = true;

      if (Array.isArray(object.material)) {
        object.material = object.material.map((material) =>
          material.clone(),
        );
      } else if (object.material) {
        object.material = object.material.clone();
      }
    });

    // Сначала определяем исходные размеры модели.
    const originalBox = new THREE.Box3().setFromObject(clone);
    const originalSize = new THREE.Vector3();
    originalBox.getSize(originalSize);

    const scaleBasis =
      placement.fitBy === "height"
        ? Math.max(originalSize.y, 0.001)
        : placement.fitBy === "xz"
          ? Math.max(originalSize.x, originalSize.z, 0.001)
          : Math.max(
              originalSize.x,
              originalSize.y,
              originalSize.z,
              0.001,
            );

    // Для вішалок и другой высокой узкой мебели fitBy="max"
    // не даёт модели стать огромной из-за маленькой глубины.
    const scale = placement.targetSize / scaleBasis;

    clone.scale.setScalar(scale);
    clone.rotation.set(
      placement.rotation[0],
      placement.rotation[1],
      placement.rotation[2],
    );
    clone.updateMatrixWorld(true);

    // После масштаба и поворота снова измеряем модель.
    const box = new THREE.Box3().setFromObject(clone);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();

    box.getSize(size);
    box.getCenter(center);

    const [offsetX, offsetY, offsetZ] = placement.position;
    const baseY = placement.baseY ?? 0;

    let targetX = offsetX;
    let targetZ = offsetZ;

    if (placement.anchor === "back-wall") {
      const backWallZ = -ROOM_DEPTH / 2;
      const gap = 0.12;

      targetZ =
        backWallZ +
        size.z / 2 +
        gap +
        offsetZ;
    }

    // Центрируем модель по X/Z в требуемой точке.
    clone.position.x += targetX - center.x;
    clone.position.z += targetZ - center.z;

    // Точно ставим нижнюю точку модели на пол.
    clone.position.y += baseY + offsetY - box.min.y;

    return clone;
  }, [furniture]);

  return <primitive object={preparedScene} />;
}

function FirstPersonController() {
  const { camera, gl } = useThree();

  const yaw = useRef(0);
  const pitch = useRef(0);
  const targetYaw = useRef(0);
  const targetPitch = useRef(0);

  const activePointerId = useRef<number | null>(null);
  const isDragging = useRef(false);
  const lastPointer = useRef({ x: 0, y: 0 });

  const forwardVector = useRef(new THREE.Vector3());
  const rightVector = useRef(new THREE.Vector3());
  const moveVector = useRef(new THREE.Vector3());

  const keys = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
  });

  useEffect(() => {
    // Стартовая позиция ровно перед мебелью.
    camera.position.set(0, EYE_HEIGHT, 4.15);

    yaw.current = 0;
    pitch.current = 0;
    targetYaw.current = 0;
    targetPitch.current = 0;

    // Важно: полностью сбрасываем возможный старый наклон камеры.
    camera.rotation.set(0, 0, 0);
    camera.rotation.order = "YXZ";

    const canvas = gl.domElement;

    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType === "mouse" && event.button !== 0) {
        return;
      }

      // Камерой управляет только палец, начавший жест на Canvas.
      // Палец на стрелке не вмешивается в поворот камеры.
      activePointerId.current = event.pointerId;
      isDragging.current = true;
      lastPointer.current = {
        x: event.clientX,
        y: event.clientY,
      };

      canvas.setPointerCapture?.(event.pointerId);
      canvas.style.cursor = "grabbing";
    };

    const onPointerMove = (event: PointerEvent) => {
      if (
        !isDragging.current ||
        activePointerId.current !== event.pointerId
      ) {
        return;
      }

      const deltaX = THREE.MathUtils.clamp(
        event.clientX - lastPointer.current.x,
        -34,
        34,
      );
      const deltaY = THREE.MathUtils.clamp(
        event.clientY - lastPointer.current.y,
        -34,
        34,
      );

      lastPointer.current = {
        x: event.clientX,
        y: event.clientY,
      };

      const sensitivity =
        event.pointerType === "touch" ? 0.00195 : 0.00245;

      targetYaw.current -= deltaX * sensitivity;
      targetPitch.current = THREE.MathUtils.clamp(
        targetPitch.current - deltaY * sensitivity,
        -0.55,
        0.55,
      );
    };

    const stopPointerDrag = (event?: PointerEvent) => {
      if (
        event &&
        activePointerId.current !== null &&
        event.pointerId !== activePointerId.current
      ) {
        return;
      }

      activePointerId.current = null;
      isDragging.current = false;
      canvas.style.cursor = "grab";
    };

    const onKeyDown = (event: KeyboardEvent) => {
      switch (event.code) {
        case "KeyW":
        case "ArrowUp":
          keys.current.forward = true;
          break;

        case "KeyS":
        case "ArrowDown":
          keys.current.backward = true;
          break;

        case "KeyA":
        case "ArrowLeft":
          keys.current.left = true;
          break;

        case "KeyD":
        case "ArrowRight":
          keys.current.right = true;
          break;
      }
    };

    const onKeyUp = (event: KeyboardEvent) => {
      switch (event.code) {
        case "KeyW":
        case "ArrowUp":
          keys.current.forward = false;
          break;

        case "KeyS":
        case "ArrowDown":
          keys.current.backward = false;
          break;

        case "KeyA":
        case "ArrowLeft":
          keys.current.left = false;
          break;

        case "KeyD":
        case "ArrowRight":
          keys.current.right = false;
          break;
      }
    };

    const onMobileMove = (event: Event) => {
      const detail = (event as CustomEvent<{
        direction: "forward" | "backward" | "left" | "right";
        active: boolean;
      }>).detail;

      if (!detail) return;
      keys.current[detail.direction] = detail.active;
    };

    canvas.style.cursor = "grab";
    canvas.style.touchAction = "none";

    window.addEventListener("nevfim-mobile-move", onMobileMove);
    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", stopPointerDrag);
    canvas.addEventListener("pointercancel", stopPointerDrag);
    window.addEventListener("blur", () => stopPointerDrag());
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    return () => {
      window.removeEventListener("nevfim-mobile-move", onMobileMove);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", stopPointerDrag);
      canvas.removeEventListener("pointercancel", stopPointerDrag);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);

      canvas.style.cursor = "default";
    };
  }, [camera, gl]);

  useFrame((_, delta) => {
    const safeDelta = Math.min(delta, 0.045);
    const rotationEase = 1 - Math.exp(-11 * safeDelta);

    yaw.current = THREE.MathUtils.lerp(
      yaw.current,
      targetYaw.current,
      rotationEase,
    );
    pitch.current = THREE.MathUtils.lerp(
      pitch.current,
      targetPitch.current,
      rotationEase,
    );

    // Всегда держим камеру ровно, без завала горизонта.
    camera.rotation.order = "YXZ";
    camera.rotation.y = yaw.current;
    camera.rotation.x = pitch.current;
    camera.rotation.z = 0;

    const forward = forwardVector.current.set(
      -Math.sin(yaw.current),
      0,
      -Math.cos(yaw.current),
    );

    const right = rightVector.current.set(
      Math.cos(yaw.current),
      0,
      -Math.sin(yaw.current),
    );

    const move = moveVector.current.set(0, 0, 0);

    if (keys.current.forward) {
      move.add(forward);
    }

    if (keys.current.backward) {
      move.sub(forward);
    }

    if (keys.current.right) {
      move.add(right);
    }

    if (keys.current.left) {
      move.sub(right);
    }

    if (move.lengthSq() > 0) {
      move.normalize().multiplyScalar(MOVE_SPEED * safeDelta);
      camera.position.add(move);
    }

    // Не позволяем выйти сквозь стены.
    const margin = 0.55;

    camera.position.x = THREE.MathUtils.clamp(
      camera.position.x,
      -ROOM_WIDTH / 2 + margin,
      ROOM_WIDTH / 2 - margin,
    );

    camera.position.z = THREE.MathUtils.clamp(
      camera.position.z,
      -ROOM_DEPTH / 2 + margin,
      ROOM_DEPTH / 2 - margin,
    );

    camera.position.y = EYE_HEIGHT;
  });

  return null;
}

export function RoomScene({
  addedFurniture,
  mobileMode = false,
}: RoomSceneProps) {
  const grayWoodTexture = useMemo(
    () => createGrayWoodTexture(mobileMode),
    [mobileMode],
  );

  const floorMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#8a8c8b",
        map: grayWoodTexture ?? undefined,
        roughness: 0.78,
        metalness: 0,
      }),
    [grayWoodTexture],
  );

  const wallMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#dedbd5",
        roughness: 0.95,
        metalness: 0,
        side: THREE.DoubleSide,
      }),
    [],
  );

  const ceilingMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#f0efec",
        roughness: 1,
        metalness: 0,
        side: THREE.DoubleSide,
      }),
    [],
  );

  return (
    <>
      <color
        attach="background"
        args={["#c8c8c6"]}
      />

      {/* Лёгкое освещение без тяжёлых люстр и теней */}
      <ambientLight intensity={mobileMode ? 0.82 : 1.05} />

      <hemisphereLight
        intensity={mobileMode ? 0.7 : 0.75}
        color="#ffffff"
        groundColor="#777777"
      />

      <directionalLight
        position={[4, 6, 3]}
        intensity={mobileMode ? 0.62 : 0.9}
      />

      {/* СЕРЫЙ ДЕРЕВЯННЫЙ ПОЛ */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        material={floorMaterial}
      >
        <planeGeometry
          args={[ROOM_WIDTH, ROOM_DEPTH]}
        />
      </mesh>

      {/* ЗАДНЯЯ СТЕНА */}
      <mesh
        position={[
          0,
          ROOM_HEIGHT / 2,
          -ROOM_DEPTH / 2,
        ]}
        material={wallMaterial}
      >
        <planeGeometry
          args={[ROOM_WIDTH, ROOM_HEIGHT]}
        />
      </mesh>

      {/* ПЕРЕДНЯЯ СТЕНА */}
      <mesh
        rotation={[0, Math.PI, 0]}
        position={[
          0,
          ROOM_HEIGHT / 2,
          ROOM_DEPTH / 2,
        ]}
        material={wallMaterial}
      >
        <planeGeometry
          args={[ROOM_WIDTH, ROOM_HEIGHT]}
        />
      </mesh>

      {/* ЛЕВАЯ СТЕНА */}
      <mesh
        rotation={[0, Math.PI / 2, 0]}
        position={[
          -ROOM_WIDTH / 2,
          ROOM_HEIGHT / 2,
          0,
        ]}
        material={wallMaterial}
      >
        <planeGeometry
          args={[ROOM_DEPTH, ROOM_HEIGHT]}
        />
      </mesh>

      {/* ПРАВАЯ СТЕНА */}
      <mesh
        rotation={[0, -Math.PI / 2, 0]}
        position={[
          ROOM_WIDTH / 2,
          ROOM_HEIGHT / 2,
          0,
        ]}
        material={wallMaterial}
      >
        <planeGeometry
          args={[ROOM_DEPTH, ROOM_HEIGHT]}
        />
      </mesh>

      {/* ПОТОЛОК */}
      <mesh
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, ROOM_HEIGHT, 0]}
        material={ceilingMaterial}
      >
        <planeGeometry
          args={[ROOM_WIDTH, ROOM_DEPTH]}
        />
      </mesh>

      {/* Декоративные GLB отключены на телефоне:
          они занимали много памяти и могли перезапускать Safari. */}
      {!mobileMode && (
        <>
          <DecorModel
            path="/models/room/decor/table.glb"
            position={[3.0, 0, -4.15]}
            rotation={[0, -0.08, 0]}
            targetSize={1.85}
            fitBy="xz"
          />

          <DecorModel
            path="/models/room/decor/picture.glb"
            position={[3.0, 0, -4.12]}
            rotation={[0, -0.08, 0]}
            targetSize={0.95}
            baseY={1.02}
            fitBy="max"
          />

          <DecorModel
            path="/models/room/decor/plant.glb"
            position={[-3.15, 0, -4.1]}
            rotation={[0, 0.18, 0]}
            targetSize={1.55}
            fitBy="height"
          />
        </>
      )}

      {/* Мебель фиксированно и ровно возле задней стены */}
      {addedFurniture && (
        <FurnitureObject
          key={addedFurniture.model.id}
          furniture={addedFurniture}
        />
      )}

      <FirstPersonController />
    </>
  );
}
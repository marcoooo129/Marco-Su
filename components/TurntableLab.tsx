"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Html, OrbitControls, useCursor, useGLTF } from "@react-three/drei";
import { motion, useReducedMotion } from "motion/react";
import * as THREE from "three";
import { cn } from "@/utils/cn";

const MODEL_URL = "/models/turntable-low.glb";

// 混元低模把组件重新合成了一个 mesh，但唱盘与唱臂仍占据稳定的局部坐标区域。
// 这里在运行时按三角形重组，不改写用户下载的源文件。
const RECORD_CENTER = new THREE.Vector3(-0.1250315, 0.0223755, 0);
const TONEARM_PIVOT = new THREE.Vector3(0.327879, -0.2212, -0.247);
const TONEARM_LIFT_AXIS = new THREE.Vector3(0.83, 0.56, 0).normalize();

type GeometryBucket = "static" | "record" | "tonearm";

type ComponentBounds = {
  min: THREE.Vector3;
  max: THREE.Vector3;
};

function classifyComponent({ min, max }: ComponentBounds): GeometryBucket {
  const size = max.clone().sub(min);
  const center = min.clone().add(max).multiplyScalar(0.5);

  // 唱盘由数层同心、扁平的大型几何岛组成。以完整岛为单位分类，避免切开机身大面。
  const isRecord =
    size.x > 0.55 &&
    size.x < 0.76 &&
    size.y > 0.55 &&
    size.y < 0.76 &&
    Math.abs(center.x - RECORD_CENTER.x) < 0.04 &&
    Math.abs(center.y - RECORD_CENTER.y) < 0.04 &&
    min.z < -0.14;

  // 唱臂与唱头位于唱盘上方。固定底座的圆盘较低，因此保留在 static 中。
  const isTonearm =
    center.x > 0.04 &&
    center.x < 0.39 &&
    center.y > -0.31 &&
    center.y < 0.18 &&
    max.z < -0.212;

  if (isRecord) return "record";
  if (isTonearm) return "tonearm";
  return "static";
}

function createGeometrySubset(source: THREE.BufferGeometry, vertexIndices: number[]) {
  const subset = new THREE.BufferGeometry();

  for (const [name, attribute] of Object.entries(source.attributes)) {
    const values = new Float32Array(vertexIndices.length * attribute.itemSize);

    for (let outputIndex = 0; outputIndex < vertexIndices.length; outputIndex += 1) {
      const sourceIndex = vertexIndices[outputIndex];
      for (let component = 0; component < attribute.itemSize; component += 1) {
        values[outputIndex * attribute.itemSize + component] = attribute.array[
          sourceIndex * attribute.itemSize + component
        ] as number;
      }
    }

    subset.setAttribute(name, new THREE.BufferAttribute(values, attribute.itemSize, attribute.normalized));
  }

  subset.computeBoundingBox();
  subset.computeBoundingSphere();
  return subset;
}

function splitGeometry(source: THREE.BufferGeometry) {
  const positions = source.getAttribute("position");
  const sourceIndex = source.getIndex();
  const buckets: Record<GeometryBucket, number[]> = {
    static: [],
    record: [],
    tonearm: [],
  };

  if (!sourceIndex) {
    for (let vertex = 0; vertex < positions.count; vertex += 3) {
      buckets.static.push(vertex, vertex + 1, vertex + 2);
    }
  } else {
    const parent = new Int32Array(positions.count);
    const rank = new Uint8Array(positions.count);
    for (let vertex = 0; vertex < positions.count; vertex += 1) parent[vertex] = vertex;

    const find = (value: number) => {
      let root = value;
      while (parent[root] !== root) root = parent[root];
      while (parent[value] !== value) {
        const next = parent[value];
        parent[value] = root;
        value = next;
      }
      return root;
    };

    const union = (left: number, right: number) => {
      let leftRoot = find(left);
      let rightRoot = find(right);
      if (leftRoot === rightRoot) return;
      if (rank[leftRoot] < rank[rightRoot]) [leftRoot, rightRoot] = [rightRoot, leftRoot];
      parent[rightRoot] = leftRoot;
      if (rank[leftRoot] === rank[rightRoot]) rank[leftRoot] += 1;
    };

    for (let offset = 0; offset < sourceIndex.count; offset += 3) {
      const a = sourceIndex.getX(offset);
      const b = sourceIndex.getX(offset + 1);
      const c = sourceIndex.getX(offset + 2);
      union(a, b);
      union(b, c);
    }

    const components = new Map<number, ComponentBounds & { vertices: number[] }>();
    for (let vertex = 0; vertex < positions.count; vertex += 1) {
      const root = find(vertex);
      const point = new THREE.Vector3(positions.getX(vertex), positions.getY(vertex), positions.getZ(vertex));
      const component = components.get(root) ?? {
        min: new THREE.Vector3(Infinity, Infinity, Infinity),
        max: new THREE.Vector3(-Infinity, -Infinity, -Infinity),
        vertices: [],
      };
      component.min.min(point);
      component.max.max(point);
      components.set(root, component);
    }

    for (let offset = 0; offset < sourceIndex.count; offset += 3) {
      const a = sourceIndex.getX(offset);
      const b = sourceIndex.getX(offset + 1);
      const c = sourceIndex.getX(offset + 2);
      components.get(find(a))?.vertices.push(a, b, c);
    }

    for (const component of components.values()) {
      buckets[classifyComponent(component)].push(...component.vertices);
    }
  }

  const result = {
    staticGeometry: createGeometrySubset(source, buckets.static),
    recordGeometry: createGeometrySubset(source, buckets.record),
    tonearmGeometry: createGeometrySubset(source, buckets.tonearm),
  };
  return result;
}

function LoadingModel() {
  return (
    <Html center>
      <div className="flex w-48 flex-col gap-3 rounded-lg border border-white/10 bg-neutral-950 p-4 text-xs text-neutral-300 shadow-lg">
        <div className="h-2 animate-pulse rounded-full bg-white/15" />
        <span>正在载入唱片机…</span>
      </div>
    </Html>
  );
}

type TurntableModelProps = {
  playing: boolean;
  reducedMotion: boolean;
  onToggle: () => void;
};

function TurntableModel({ playing, reducedMotion, onToggle }: TurntableModelProps) {
  const { scene } = useGLTF(MODEL_URL);
  const recordPivotRef = useRef<THREE.Group>(null);
  const tonearmYawRef = useRef<THREE.Group>(null);
  const tonearmLiftRef = useRef<THREE.Group>(null);
  const speedRef = useRef(0);
  const yawRef = useRef(0.17);
  const liftRef = useRef(0.1);
  const phaseRef = useRef(2);
  const previousPlayingRef = useRef(playing);
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  const sourceMesh = useMemo(() => {
    const meshes: THREE.Mesh[] = [];
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) meshes.push(child as THREE.Mesh);
    });
    const mesh = meshes[0];
    if (!mesh) throw new Error("唱片机模型中没有可用网格");
    return mesh;
  }, [scene]);

  const geometries = useMemo(() => splitGeometry(sourceMesh.geometry), [sourceMesh]);
  const material = sourceMesh.material as THREE.Material;

  useEffect(
    () => () => {
      geometries.staticGeometry.dispose();
      geometries.recordGeometry.dispose();
      geometries.tonearmGeometry.dispose();
    },
    [geometries],
  );

  useFrame((_, delta) => {
    const recordPivot = recordPivotRef.current;
    const tonearmYaw = tonearmYawRef.current;
    const tonearmLift = tonearmLiftRef.current;
    if (!recordPivot || !tonearmYaw || !tonearmLift) return;

    if (previousPlayingRef.current !== playing) {
      previousPlayingRef.current = playing;
      phaseRef.current = 0;
    }
    phaseRef.current += delta;

    const transitionSpeed = reducedMotion ? 30 : 5.5;
    const targetSpeed = playing ? 3.49 : 0;
    speedRef.current = THREE.MathUtils.damp(speedRef.current, targetSpeed, 3.8, delta);
    recordPivot.rotation.z -= speedRef.current * delta;

    // 播放：先横移到唱片外圈，再落针。停止：先抬针，再移回唱臂架。
    const canLower = playing && phaseRef.current > (reducedMotion ? 0 : 0.72);
    const canReturn = !playing && phaseRef.current > (reducedMotion ? 0 : 0.34);
    const targetYaw = playing || !canReturn ? 0 : 0.17;
    const targetLift = canLower ? 0.012 : 0.1;

    yawRef.current = THREE.MathUtils.damp(yawRef.current, targetYaw, transitionSpeed, delta);
    liftRef.current = THREE.MathUtils.damp(liftRef.current, targetLift, transitionSpeed, delta);
    tonearmYaw.rotation.z = yawRef.current;
    tonearmLift.quaternion.setFromAxisAngle(TONEARM_LIFT_AXIS, liftRef.current);
  });

  const nodeQuaternion = sourceMesh.quaternion.clone();
  const nodePosition = sourceMesh.position.clone();
  const nodeScale = sourceMesh.scale.clone();

  return (
    <group
      position={nodePosition}
      quaternion={nodeQuaternion}
      scale={nodeScale}
      onClick={(event) => {
        event.stopPropagation();
        onToggle();
      }}
      onPointerOver={(event) => {
        event.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
    >
      <mesh geometry={geometries.staticGeometry} material={material} castShadow receiveShadow />

      <group ref={recordPivotRef} position={RECORD_CENTER}>
        <mesh
          geometry={geometries.recordGeometry}
          material={material}
          position={[-RECORD_CENTER.x, -RECORD_CENTER.y, -RECORD_CENTER.z]}
          castShadow
          receiveShadow
        />
        {/* 原始唱片标签没有文字，增加一个克制的小标记，便于观察真实转速。 */}
        <mesh position={[0.09, 0, -0.202]}>
          <circleGeometry args={[0.011, 20]} />
          <meshBasicMaterial color="#352f27" side={THREE.DoubleSide} />
        </mesh>
      </group>

      <group ref={tonearmYawRef} position={TONEARM_PIVOT} rotation={[0, 0, 0.17]}>
        <group ref={tonearmLiftRef}>
          <mesh
            geometry={geometries.tonearmGeometry}
            material={material}
            position={[-TONEARM_PIVOT.x, -TONEARM_PIVOT.y, -TONEARM_PIVOT.z]}
            castShadow
          />
        </group>
      </group>
    </group>
  );
}

function TurntableScene({ playing, reducedMotion, onToggle }: TurntableModelProps) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [1.2, 0.82, 1.32], fov: 34, near: 0.1, far: 20 }}
      shadows
      gl={{ antialias: true, alpha: true }}
    >
      <color attach="background" args={["#111113"]} />
      <ambientLight intensity={1.25} />
      <directionalLight position={[2.5, 3.5, 2]} intensity={3.2} castShadow shadow-mapSize={[1024, 1024]} />
      <directionalLight position={[-2, 1.4, -1.5]} intensity={1.2} color="#d9e7ff" />

      <Suspense fallback={<LoadingModel />}>
        <group position={[0, -0.02, 0]} scale={1.55}>
          <TurntableModel playing={playing} reducedMotion={reducedMotion} onToggle={onToggle} />
        </group>
        <ContactShadows position={[0, -0.005, 0]} opacity={0.48} scale={3} blur={2.4} far={2} />
      </Suspense>

      <OrbitControls
        makeDefault
        target={[0, 0.19, 0]}
        enablePan={false}
        enableDamping
        minDistance={1.15}
        maxDistance={3.1}
        minPolarAngle={0.42}
        maxPolarAngle={1.42}
      />
    </Canvas>
  );
}

export function TurntableLab() {
  const [playing, setPlaying] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const toggle = () => setPlaying((current) => !current);

  return (
    <main className="relative min-h-dvh overflow-hidden bg-neutral-950 text-neutral-100">
      <header className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between gap-6 px-5 py-5 sm:px-8 sm:py-7">
        <div>
          <p className="text-xs text-emerald-400">Prototype 01</p>
          <h1 className="mt-2 max-w-xl text-balance font-display text-2xl font-bold sm:text-4xl">
            Turntable interaction lab
          </h1>
          <p className="mt-2 max-w-lg text-pretty text-xs leading-5 text-neutral-400 sm:text-sm">
            拖动改变视角，滚轮缩放；点击唱片机或下方按钮切换播放状态。
          </p>
        </div>
        <div className="hidden text-right text-xs leading-5 text-neutral-500 sm:block">
          <p>低模：5,644 tris</p>
          <p>贴图：2K embedded</p>
        </div>
      </header>

      <section className="h-dvh min-h-[640px]" aria-label="交互式唱片机三维预览">
        <TurntableScene
          playing={playing}
          reducedMotion={Boolean(prefersReducedMotion)}
          onToggle={toggle}
        />
      </section>

      <div className="absolute inset-x-0 bottom-0 z-10 flex justify-center px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
        <div className="flex w-full max-w-md items-center justify-between gap-4 rounded-xl border border-white/10 bg-neutral-900 p-3 shadow-lg sm:p-4">
          <div aria-live="polite" className="min-w-0">
            <p className="truncate text-sm font-medium">{playing ? "正在播放" : "等待播放"}</p>
            <p className="mt-1 truncate text-xs text-neutral-500">
              {playing ? "33⅓ RPM · 唱臂已落下" : "唱臂已抬起 · 唱盘静止"}
            </p>
          </div>

          <motion.button
            type="button"
            aria-pressed={playing}
            onClick={toggle}
            whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
            transition={{ duration: 0.12, ease: "easeOut" }}
            className={cn(
              "focus-ring inline-flex shrink-0 items-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold transition-colors duration-150",
              playing
                ? "bg-neutral-100 text-neutral-950 hover:bg-white"
                : "bg-emerald-500 text-neutral-950 hover:bg-emerald-400",
            )}
          >
            {playing ? (
              <svg className="size-4" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                <path d="M3 2.5h3.5v11H3zm6.5 0H13v11H9.5z" />
              </svg>
            ) : (
              <svg className="size-4" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                <path d="M4 2.2v11.6L13 8z" />
              </svg>
            )}
            {playing ? "停止" : "播放"}
          </motion.button>
        </div>
      </div>
    </main>
  );
}

useGLTF.preload(MODEL_URL);

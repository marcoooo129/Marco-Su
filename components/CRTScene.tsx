"use client";

import { Suspense, useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, useGLTF, useProgress } from "@react-three/drei";
import * as THREE from "three";
import { site } from "@/data/site";

const MODEL_URL = "/models/crt-tv.glb";
// 屏幕贴片标定探针的开关：window.__crtProbe() 需要时改为 true
const DEBUG_SCREEN = false;

// 模型包围盒（已按 glTF 世界轴换算）：宽 0.648 / 高 0.701 / 屏幕面朝 +Z
// 由场景内射线探针实测：面框前沿 z≈0.28，屏幕玻璃内凹到 z≈0.24
const SCREEN = {
  width: 0.537,
  height: 0.446,
  centerX: -0.014,
  centerY: 0.484,
  z: 0.272,
};

// 静止时的构图偏移：电视缩小后落在地平线上（hero-floor 在视口 58% 处），推进时收敛到 0
const REST_OFFSET = { x: 0, y: 0.166 };

// 滚动前 22% 是停留区：吸收从开场页带过来的滚轮惯性，电视保持不动
const DEAD_ZONE = 0.22;

function diveAmount(rawProgress: number) {
  return Math.max(0, (rawProgress - DEAD_ZONE) / (1 - DEAD_ZONE));
}

type SceneProps = {
  progressRef: MutableRefObject<number>;
  theme: "dark" | "light";
  onThemeToggle: () => void;
};

// 主题旋钮在模型上的位置（外层 group 坐标，屏幕中心为原点）
const KNOB_POS: [number, number, number] = [-0.182, -0.401, 0.31];

// 鼠标进入这块区域（归一化坐标，电视机身 + 标注一圈）时电视回正并停住。
// 必须"回正"而不是"冻结"：冻结会保持进禁区前的偏转姿态，机身歪着，
// 焊在上面的旋钮按钮也跟着歪到别处，照样点不中。
const NO_TILT_ZONE = { x: 0.2, yMin: -0.38, yMax: 0.36 };
// 边界迟滞，防止光标在边缘反复进出导致抖动
const ZONE_HYSTERESIS = 1.18;

function ScreenSurface() {
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);
  const [projectIndex, setProjectIndex] = useState(0);

  const { canvas, ctx, texture } = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 856;
    const ctx = canvas.getContext("2d")!;
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return { canvas, ctx, texture };
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setProjectIndex((current) => (current + 1) % site.projects.length);
    }, 2800);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => () => texture.dispose(), [texture]);

  useEffect(() => {
    const project = site.projects[projectIndex];
    const { width: w, height: h } = canvas;

    ctx.clearRect(0, 0, w, h);

    // CRT 开口是圆角的，裁掉四角免得盖住面框内沿
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(0, 0, w, h, 92);
    ctx.clip();

    ctx.fillStyle = "#05070a";
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = "#74e0a0";
    ctx.font = "500 30px 'IBM Plex Mono', monospace";
    ctx.fillText("MARCO_OS", 74, 104);
    ctx.fillStyle = "#21a35c";
    ctx.beginPath();
    ctx.arc(w - 86, 94, 9, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "rgba(140, 226, 172, 0.75)";
    ctx.font = "400 26px 'IBM Plex Mono', monospace";
    ctx.fillText(`PROJECT ${project.number}`, 74, h / 2 - 62);

    ctx.fillStyle = "#eaffef";
    ctx.font = "700 76px 'Space Mono', monospace";
    ctx.fillText(project.title, 74, h / 2 + 18);

    ctx.fillStyle = "rgba(132, 219, 165, 0.62)";
    ctx.font = "400 25px 'IBM Plex Mono', monospace";
    ctx.fillText(project.category, 74, h / 2 + 66);

    ctx.fillStyle = "#74e0a0";
    ctx.font = "400 27px 'IBM Plex Mono', monospace";
    ctx.fillText(`> open /work/${project.slug}`, 74, h - 96);

    // CRT 扫描线
    ctx.fillStyle = "rgba(0, 0, 0, 0.20)";
    for (let y = 0; y < h; y += 4) ctx.fillRect(0, y, w, 2);
    // 屏幕四周的暗角
    const vignette = ctx.createRadialGradient(w / 2, h / 2, h * 0.32, w / 2, h / 2, h * 0.78);
    vignette.addColorStop(0, "rgba(0,0,0,0)");
    vignette.addColorStop(1, "rgba(0,0,0,0.55)");
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();

    texture.needsUpdate = true;
  }, [projectIndex, canvas, ctx, texture]);

  return (
    <mesh position={[SCREEN.centerX, SCREEN.centerY, SCREEN.z]}>
      <planeGeometry args={[SCREEN.width, SCREEN.height]} />
      <meshBasicMaterial ref={materialRef} map={texture} transparent opacity={1} toneMapped={false} />
    </mesh>
  );
}

function CRTModel({ progressRef, theme, onThemeToggle }: SceneProps) {
  const { scene } = useGLTF(MODEL_URL);
  const groupRef = useRef<THREE.Group>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const inZoneRef = useRef(false);

  // 用 window 级监听而不是 R3F 的 pointer：光标压在旋钮按钮（DOM 元素）上时
  // canvas 收不到 pointermove，R3F 的 pointer 会停在过期值，禁区判定就失灵了
  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  const model = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    return clone;
  }, [scene]);

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group) return;

    const dive = diveAmount(progressRef.current);
    // 推进屏幕时收敛跟随，避免镜头漂移；停留区内正常跟随鼠标
    const damp = Math.max(0, 1 - dive * 3.2);
    // 鼠标在电视范围内时目标角度归零：电视平滑转回正面并停住，
    // 旋钮按钮就稳稳待在它看起来该在的位置，能正常点中
    const m = mouse.current;
    const grow = inZoneRef.current ? ZONE_HYSTERESIS : 1;
    inZoneRef.current =
      Math.abs(m.x) < NO_TILT_ZONE.x * grow &&
      m.y > NO_TILT_ZONE.yMin * grow &&
      m.y < NO_TILT_ZONE.yMax * grow;

    const targetY = inZoneRef.current ? 0 : m.x * 0.52 * damp;
    const targetX = inZoneRef.current ? 0 : -m.y * 0.26 * damp;

    const ease = 1 - Math.pow(0.0015, delta);
    group.rotation.y += (targetY - group.rotation.y) * ease;
    group.rotation.x += (targetX - group.rotation.x) * ease;

    // 缩放绕屏幕中心发生（内层已把屏幕中心移到原点），
    // 同时把初始构图的偏移收敛到 0，镜头就始终锁着屏幕。
    // dive≈0.9 时屏幕刚好铺满视口，随后交给故障转场
    group.scale.setScalar(1 + dive * 8);
    group.position.x = REST_OFFSET.x * (1 - dive);
    group.position.y = REST_OFFSET.y * (1 - dive);
    group.position.z = dive * 0.35;
  });

  return (
    <group ref={groupRef} position={[REST_OFFSET.x, REST_OFFSET.y, 0]}>
      <group position={[-SCREEN.centerX, -SCREEN.centerY, 0]}>
        <primitive object={model} name="crt-model" />
        <ScreenSurface />
      </group>
      {/* 标注挂在旋钮的 3D 位置上，随电视一起旋转缩放 */}
      <Html transform position={KNOB_POS} scale={0.113} zIndexRange={[12, 11]} style={{ pointerEvents: "none" }}>
        <div className="knob-anchor">
          <button
            type="button"
            className="knob-hit focus-ring"
            onClick={onThemeToggle}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
            aria-pressed={theme === "light"}
            data-cursor="GO"
          />
          <div className="knob-note" aria-hidden="true">
            <svg viewBox="0 0 96 52" role="presentation">
              <path d="M94 48C56 48 38 40 26 14" />
              <path d="M32 20l-6-6-5 7" />
            </svg>
            <span>Switch Day ’N’ Night</span>
          </div>
        </div>
      </Html>
    </group>
  );
}

function ScreenProbe() {
  const { camera, scene } = useThree();

  useEffect(() => {
    (window as unknown as Record<string, unknown>).__crtState = () => {
      const model = scene.getObjectByName("crt-model");
      const inner = model?.parent;
      const outer = inner?.parent;
      const plane = inner?.children.find((c) => c.type === "Mesh" && c !== model);
      const sc = plane ? plane.getWorldPosition(new THREE.Vector3()) : null;
      return JSON.stringify({
        outer: outer && {
          pos: outer.position.toArray().map((n) => +n.toFixed(3)),
          rot: outer.rotation.toArray().slice(0, 3).map((n) => +(n as number).toFixed(3)),
          scale: +outer.scale.x.toFixed(3),
        },
        inner: inner?.position.toArray().map((n) => +n.toFixed(3)),
        screenWorld: sc?.toArray().map((n) => +n.toFixed(3)),
        camera: camera.position.toArray().map((n) => +n.toFixed(3)),
      });
    };

    if (!DEBUG_SCREEN) return;
    (window as unknown as Record<string, unknown>).__crtProbe = () => {
      const raycaster = new THREE.Raycaster();
      const target = scene.getObjectByName("crt-model");
      if (!target) return "no model";

      const group = target.parent!;
      const hits: { x: number; y: number; p: THREE.Vector3 }[] = [];
      const N = 96;
      for (let iy = 0; iy <= N; iy++) {
        for (let ix = 0; ix <= N; ix++) {
          const nx = (ix / N) * 2 - 1;
          const ny = (iy / N) * 2 - 1;
          raycaster.setFromCamera(new THREE.Vector2(nx, ny), camera);
          const hit = raycaster.intersectObject(target, true)[0];
          // 转成 group 局部坐标，贴片就是挂在 group 下的
          if (hit) hits.push({ x: nx, y: ny, p: group.worldToLocal(hit.point.clone()) });
        }
      }
      if (!hits.length) return "no hits";

      const bands: Record<string, { n: number; x0: number; x1: number; y0: number; y1: number }> = {};
      for (const h of hits) {
        const key = (Math.round(h.p.z * 50) / 50).toFixed(2);
        const b = (bands[key] ??= { n: 0, x0: 9, x1: -9, y0: 9, y1: -9 });
        b.n += 1;
        b.x0 = Math.min(b.x0, h.p.x);
        b.x1 = Math.max(b.x1, h.p.x);
        b.y0 = Math.min(b.y0, h.p.y);
        b.y1 = Math.max(b.y1, h.p.y);
      }
      const rows = Object.entries(bands)
        .sort((a, b) => Number(b[0]) - Number(a[0]))
        .map(([z, b]) => `z=${z} n=${b.n} x[${b.x0.toFixed(3)},${b.x1.toFixed(3)}] y[${b.y0.toFixed(3)},${b.y1.toFixed(3)}]`);
      // 用同一套变换报出模型包围盒，作为判读基准
      const worldBox = new THREE.Box3().setFromObject(target);
      const lo = group.worldToLocal(worldBox.min.clone());
      const hi = group.worldToLocal(worldBox.max.clone());
      return JSON.stringify({
        totalHits: hits.length,
        groupPos: group.position.toArray(),
        modelBoxInSameSpace: {
          x: [+lo.x.toFixed(4), +hi.x.toFixed(4)],
          y: [+lo.y.toFixed(4), +hi.y.toFixed(4)],
          z: [+lo.z.toFixed(4), +hi.z.toFixed(4)],
        },
        bands: rows,
      });
    };
  }, [camera, scene]);

  return null;
}

// 相机随视口比例调整：竖屏（手机）时电视更容易被左右裁切，
// 按宽高比把相机往后拉，保证电视完整入镜、四周留白匀称
function ResponsiveCamera() {
  const { camera, size } = useThree();
  useEffect(() => {
    const aspect = size.width / Math.max(1, size.height);
    // 横屏 ~6.5；越竖（aspect 越小）越往后拉
    const z = aspect >= 1 ? 6.5 : 6.5 + (1 - aspect) * 5.4;
    camera.position.set(0, 0, z);
    camera.updateProjectionMatrix();
  }, [camera, size.width, size.height]);
  return null;
}

function Lighting() {
  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[2.4, 3.4, 3.2]} intensity={2.6} castShadow />
      <directionalLight position={[-3, 1.6, 1.4]} intensity={0.65} color="#cfd8e6" />
      <directionalLight position={[0, 1.2, -3.4]} intensity={1.1} color="#aab6c8" />
      <pointLight position={[0, 0.15, 1.5]} intensity={0.5} color="#8fd8a8" />
    </>
  );
}

function LoadingOverlay() {
  const { active, progress } = useProgress();
  const [dismissed, setDismissed] = useState(false);
  const started = useRef(false);

  useEffect(() => {
    if (active) {
      started.current = true;
      return;
    }
    // 加载还没开始时 active 也是 false，别急着收起提示
    if (!started.current) return;
    const timer = window.setTimeout(() => setDismissed(true), 620);
    return () => window.clearTimeout(timer);
  }, [active]);

  if (dismissed) return null;

  return (
    <div className={`crt-loading ${active ? "" : "is-done"}`} aria-hidden="true">
      <span className="crt-loading-bar">
        <i style={{ transform: `scaleX(${Math.max(0.02, progress / 100)})` }} />
      </span>
      <span className="crt-loading-label">BOOTING MARCO_OS — {Math.round(progress)}%</span>
    </div>
  );
}

export default function CRTScene({ progressRef, theme, onThemeToggle }: SceneProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  // 电视离开视口就暂停整个 WebGL 渲染循环，不再空转烧 GPU
  const [frameloop, setFrameloop] = useState<"always" | "never">("always");

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const observer = new IntersectionObserver(
      ([entry]) => setFrameloop(entry.isIntersecting ? "always" : "never"),
      { rootMargin: "200px" },
    );
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // 容器挂载瞬间若测到 0 尺寸，R3F 会停在 300x150 的默认画布且不初始化场景，
    // 而容器本身尺寸没再变过，ResizeObserver 也不会触发。这里主动重测直到对上。
    const stage = stageRef.current;
    if (!stage) return;

    let tries = 0;
    const nudge = () => {
      const canvas = stage.querySelector("canvas");
      const ok =
        canvas &&
        stage.clientWidth > 0 &&
        Math.abs(canvas.clientWidth - stage.clientWidth) <= 1;
      if (ok || tries > 20) return;
      tries += 1;
      window.dispatchEvent(new Event("resize"));
      timer = window.setTimeout(nudge, 100);
    };
    let timer = window.setTimeout(nudge, 0);

    const observer = new ResizeObserver(() => window.dispatchEvent(new Event("resize")));
    observer.observe(stage);

    return () => {
      window.clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="crt-stage" ref={stageRef}>
      <LoadingOverlay />
      <Canvas
        className="crt-canvas"
        frameloop={frameloop}
        dpr={[1, 2]}
        shadows={false}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 6.5], fov: 34 }}
      >
        <ResponsiveCamera />
        <Lighting />
        <Suspense fallback={null}>
          <CRTModel progressRef={progressRef} theme={theme} onThemeToggle={onThemeToggle} />
          <ScreenProbe />
        </Suspense>
      </Canvas>
    </div>
  );
}

useGLTF.preload(MODEL_URL);

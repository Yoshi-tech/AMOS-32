import React, { useState, useEffect, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import { BufferGeometry } from "three"; // ✅ Explicitly import BufferGeometry
import "./MiniVisualizer.css";

// ✅ Define prop types for ModelPreview
interface ModelPreviewProps {
  modelPath: string;
}

const ModelPreview: React.FC<ModelPreviewProps> = ({ modelPath }) => {
  const [geometry, setGeometry] = useState<BufferGeometry | null>(null);

  useEffect(() => {
    if (!modelPath) return;
    const loader = new STLLoader();
    loader.load(modelPath, (geo) => {
      geo.center();
      setGeometry(geo);
    });
  }, [modelPath]);

  return geometry ? (
    <mesh scale={[10, 10, 10]}>
      <primitive attach="geometry" object={geometry} />
      <meshStandardMaterial color="lightblue" />
    </mesh>
  ) : null;
};

// ✅ Define prop types for MiniVisualizer
interface MiniVisualizerProps {
  modelPath: string;
}

const MiniVisualizer: React.FC<MiniVisualizerProps> = ({ modelPath }) => {
  return (
    <div className="mini-visualizer-container">
      <Canvas className="mini-visualizer" camera={{ position: [0, 0, 3] }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[2, 2, 2]} intensity={1} />
          <OrbitControls enableZoom={true} />
          <ModelPreview modelPath={modelPath} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default MiniVisualizer;

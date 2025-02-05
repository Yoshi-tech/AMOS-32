import React, {
  useState,
  useEffect,
  useRef,
  Suspense,
  useCallback,
} from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Edges } from "@react-three/drei";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import * as THREE from "three";

const DEFAULT_MODEL_PATH = "/models/base_model.stl";

// ✅ Define model type
interface Model {
  id: number;
  position: [number, number, number];
  scale: [number, number, number];
  selected: boolean;
  rotation: [number, number, number];
  modelPath: string;
}

// ✅ Define props for Visualizer
interface VisualizerProps {
  selectedModel: string | null;
}

const Visualizer: React.FC<VisualizerProps> = ({ selectedModel }) => {
  // ✅ Use correct type for models state
  const [models, setModels] = useState<Model[]>([]);
  const [unit, setUnit] = useState<"m" | "cm" | "in">("m");
  const [showPopup, setShowPopup] = useState<boolean>(false);

  const handleAddModel = () => {
    setModels((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        position: [prev.length * 2, 1, 0],
        scale: [2, 2, 2],
        selected: false,
        rotation: [0, 0, 0],
        modelPath: selectedModel || DEFAULT_MODEL_PATH,
      },
    ]);
  };

  const handleDeleteModel = (id: number) => {
    setModels((prev) => prev.filter((model) => model.id !== id));
  };

  const convertScale = (value: number | string, targetUnit: string): string => {
    const meterValue = parseFloat(value as string);
    if (targetUnit === "cm") return (meterValue * 100).toFixed(2);
    if (targetUnit === "in") return (meterValue * 39.37).toFixed(2);
    return meterValue.toFixed(2);
  };

  const handleScaleChange = (id: number, axis: number, value: string) => {
    let convertedValue = parseFloat(value);
    if (unit === "cm") convertedValue /= 100;
    if (unit === "in") convertedValue /= 39.37;

    setModels((prev) =>
      prev.map((model) =>
        model.id === id
          ? {
              ...model,
              scale: model.scale.map((s, i) =>
                i === axis ? Math.max(0.01, convertedValue) : s
              ) as [number, number, number],
            }
          : model
      )
    );
  };

  return (
    <div id="visualizer-container" style={{ display: "flex", position: "relative" }} tabIndex={0}>
      {/* Sidebar Controls */}
      <div style={sidebarStyle}>
        <h1>Model Controls</h1>
        <label>
          Unit:
          <select value={unit} onChange={(e) => setUnit(e.target.value as "m" | "cm" | "in")} style={selectStyle}>
            <option value="m">Meters (m)</option>
            <option value="cm">Centimeters (cm)</option>
            <option value="in">Inches (in)</option>
          </select>
        </label>
        <button onClick={handleAddModel} style={buttonStyle}>Add Model</button>

        {models.map((model) => (
          <div key={model.id} style={modelControlStyle}>
            <h3>Model {model.id}</h3>
            <button onClick={() => handleDeleteModel(model.id)} style={deleteButtonStyle}>Remove</button>
            {["X", "Y", "Z"].map((axis, i) => (
              <label key={axis}>
                {axis} Scale ({unit}):
                <input
                  type="number"
                  step="0.1"
                  value={convertScale(model.scale[i], unit)}
                  onChange={(e) => handleScaleChange(model.id, i, e.target.value)}
                  style={inputStyle}
                />
              </label>
            ))}
          </div>
        ))}
      </div>

      {/* Popup Notification */}
      {showPopup && <div style={popupStyle}>Use arrow keys to move models</div>}

      {/* 3D Visualizer */}
      <div style={{ flex: 1 }}>
        <Canvas shadows camera={{ position: [5, 5, 10], fov: 60 }}>
          <Suspense fallback={null}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 10]} castShadow />
            <Models models={models} setModels={setModels} setShowPopup={setShowPopup} />
            <OrbitControls enablePan={true} enableRotate={true} />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
};

// ✅ Models Component (Handles Movement & Selection)
interface ModelsProps {
  models: Model[];
  setModels: React.Dispatch<React.SetStateAction<Model[]>>;
  setShowPopup: React.Dispatch<React.SetStateAction<boolean>>;
}

const Models: React.FC<ModelsProps> = ({ models, setModels, setShowPopup }) => {
  const handleModelClick = (id: number) => {
    setModels((prev) =>
      prev.map((model) => ({
        ...model,
        selected: model.id === id,
      }))
    );
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3000);
  };

  return models.map((model) => (
    <DraggableModel key={model.id} model={model} onClick={() => handleModelClick(model.id)} />
  ));
};

// ✅ Draggable Model (Loads STL Models)
interface DraggableModelProps {
  model: Model;
  onClick: () => void;
}

const DraggableModel: React.FC<DraggableModelProps> = ({ model, onClick }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [geometry, setGeometry] = useState<THREE.BufferGeometry | null>(null);

  useEffect(() => {
    const loader = new STLLoader();
    loader.load(model.modelPath, (loadedGeometry) => {
      loadedGeometry.center();
      setGeometry(loadedGeometry);
    });
  }, [model.modelPath]);

  return (
    <mesh ref={meshRef} position={model.position} scale={model.scale} castShadow onClick={onClick}>
      {geometry && <bufferGeometry attach="geometry" {...geometry} />}
      <meshStandardMaterial color={model.selected ? "orange" : "lightblue"} />
      {model.selected && <Edges scale={1.05} threshold={15} color="yellow" />}
    </mesh>
  );
};
// 🎨 UI Styles
const sidebarStyle: React.CSSProperties =  {
  width: "300px",
  height: "100vh",
  overflowY: "auto",
  backgroundColor: "#2f2f2f", // ✅ Dark gray sidebar
  padding: "20px",
  color: "#d3d3d3", // ✅ Light gray text for readability
};

const modelControlStyle: React.CSSProperties =  {
  marginBottom: "15px",
  padding: "10px",
  border: "1px solid #64c261", // ✅ Green accent border
  borderRadius: "5px",
  backgroundColor: "#3a3a3a", // ✅ Slightly lighter dark gray background
  color: "#d3d3d3", // ✅ Light gray text for readability
};

const buttonStyle: React.CSSProperties =  {
  backgroundColor: "#64c261", // ✅ Green buttons
  padding: "10px 15px",
  color: "white", // ✅ White text for contrast
  fontSize: "16px",
  cursor: "pointer",
  borderRadius: "5px",
  border: "none",
  marginBottom: "10px",
  display: "block",
  width: "100%",
  transition: "background 0.3s ease",
};

buttonStyle[":hover"] = {
  backgroundColor: "#4e7f4c", // ✅ Darker green on hover
};

const deleteButtonStyle: React.CSSProperties =  {
  backgroundColor: "#e74c3c", // ✅ Red for delete actions
  padding: "5px 10px",
  color: "white",
  cursor: "pointer",
  borderRadius: "5px",
  border: "none",
  marginBottom: "5px",
  width: "100%",
  transition: "background 0.3s ease",
};

deleteButtonStyle[":hover"] = {
  backgroundColor: "#c0392b", // ✅ Darker red on hover
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "8px",
  margin: "5px 0",
  border: "1px solid #555", // ✅ Darker border to blend with dark theme
  borderRadius: "4px",
  backgroundColor: "#1e1e1e", // ✅ Dark input background
  color: "#d3d3d3", // ✅ Light gray text for readability
  fontSize: "16px",
};

const selectStyle: React.CSSProperties = {
  width: "100%",
  padding: "8px",
  margin: "5px 0",
  border: "1px solid #555", // ✅ Darker border
  borderRadius: "4px",
  backgroundColor: "#1e1e1e", // ✅ Dark dropdown background
  color: "#d3d3d3", // ✅ Light gray text
  fontSize: "16px",
};

const popupStyle: React.CSSProperties =  {
  position: "absolute",
  top: "20px",
  left: "50%",
  transform: "translateX(-50%)",
  backgroundColor: "#3a3a3a", // ✅ Dark background for contrast
  color: "#d3d3d3", // ✅ Light text for readability
  padding: "10px 20px",
  borderRadius: "5px",
  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)", // ✅ Soft shadow
  zIndex: 1000,
  fontSize: "14px",
};

export default Visualizer;

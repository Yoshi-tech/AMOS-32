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

const Visualizer = ({ selectedModel }) => {
  const [models, setModels] = useState([]);
  const [unit, setUnit] = useState("m");
  const [showPopup, setShowPopup] = useState(false);

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

  const handleDeleteModel = (id) => {
    setModels((prev) => prev.filter((model) => model.id !== id));
  };

  const convertScale = (value, targetUnit) => {
    const meterValue = parseFloat(value);
    if (targetUnit === "cm") return (meterValue * 100).toFixed(2);
    if (targetUnit === "in") return (meterValue * 39.37).toFixed(2);
    return meterValue.toFixed(2);
  };

  const handleScaleChange = (id, axis, value) => {
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
              ),
            }
          : model
      )
    );
  };

  return (
    <div
      id="visualizer-container"
      style={{ display: "flex", position: "relative" }}
      tabIndex={0}
    >
      {/* Sidebar Controls */}
      <div style={sidebarStyle}>
        <h1>Model Controls</h1>
        <label style={{ display: "block", marginBottom: "10px" }}>
          Unit:
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            style={selectStyle}
          >
            <option value="m">Meters (m)</option>
            <option value="cm">Centimeters (cm)</option>
            <option value="in">Inches (in)</option>
          </select>
        </label>
        <button onClick={handleAddModel} style={buttonStyle}>
          Add Model
        </button>

        {models.map((model) => (
          <div key={model.id} style={modelControlStyle}>
            <h3>Model {model.id}</h3>
            <button
              onClick={() => handleDeleteModel(model.id)}
              style={deleteButtonStyle}
            >
              Remove
            </button>

            <label>
              X Scale ({unit}):
              <input
                type="number"
                step="0.1"
                value={convertScale(model.scale[0], unit)}
                onChange={(e) => handleScaleChange(model.id, 0, e.target.value)}
                style={inputStyle}
              />
            </label>
            <label>
              Y Scale ({unit}):
              <input
                type="number"
                step="0.1"
                value={convertScale(model.scale[1], unit)}
                onChange={(e) => handleScaleChange(model.id, 1, e.target.value)}
                style={inputStyle}
              />
            </label>
            <label>
              Z Scale ({unit}):
              <input
                type="number"
                step="0.1"
                value={convertScale(model.scale[2], unit)}
                onChange={(e) => handleScaleChange(model.id, 2, e.target.value)}
                style={inputStyle}
              />
            </label>
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
            <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
              <planeGeometry args={[100, 100]} />
              <meshStandardMaterial color="#e0e0e0" />
            </mesh>
            <Models
              models={models}
              setModels={setModels}
              setShowPopup={setShowPopup}
            />
            <OrbitControls enablePan={true} enableRotate={true} />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
};

// ✅ Models Component (Handles Movement & Selection)
const Models = ({ models, setModels, setShowPopup }) => {
  const { gl } = useThree();
  const selectedModel = models.find((model) => model.selected);

  const handleKeyDown = useCallback(
    (event) => {
      if (!selectedModel) return;

      const movementSpeed = event.shiftKey ? 0.5 : 0.2;
      const [x, y, z] = selectedModel.position;

      const newPosition = {
        ArrowUp: [x, Math.max(y, 0), z - movementSpeed], // ✅ Prevent sinking
        ArrowDown: [x, Math.max(y, 0), z + movementSpeed],
        ArrowLeft: [x - movementSpeed, Math.max(y, 0), z],
        ArrowRight: [x + movementSpeed, Math.max(y, 0), z],
      }[event.key];

      if (newPosition) {
        setModels((prev) =>
          prev.map((model) =>
            model.id === selectedModel.id
              ? { ...model, position: newPosition }
              : model
          )
        );
      }
    },
    [selectedModel, setModels]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const handleModelClick = (id) => {
    setModels((prev) =>
      prev.map((model) =>
        model.id === id
          ? { ...model, selected: true }
          : { ...model, selected: false }
      )
    );
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3000);
  };

  return models.map((model) => (
    <DraggableModel
      key={model.id}
      model={model}
      onClick={() => handleModelClick(model.id)}
    />
  ));
};

// ✅ Draggable Model (Loads STL Models)
const DraggableModel = ({ model, onClick }) => {
  const meshRef = useRef();
  const [geometry, setGeometry] = useState(null);

  useEffect(() => {
    const loader = new STLLoader();
    loader.load(model.modelPath, (loadedGeometry) => {
      loadedGeometry.center(); // ✅ Center the model

      const boundingBox = new THREE.Box3().setFromBufferAttribute(
        loadedGeometry.attributes.position
      );
      const size = new THREE.Vector3();
      boundingBox.getSize(size);

      const maxDimension = Math.max(size.x, size.y, size.z);
      const normalizedScale = 2 / maxDimension;
      model.scale = [normalizedScale, normalizedScale, normalizedScale];

      // ✅ Adjust Y position to sit on ground
      const yOffset = boundingBox.min.y * normalizedScale;
      model.position[1] = -yOffset;

      setGeometry(loadedGeometry);
    });
  }, [model.modelPath]);

  return (
    <mesh
      ref={meshRef}
      position={model.position}
      scale={model.scale}
      castShadow
      onClick={onClick}
      //rotation={[-Math.PI / 2, 0, 0]}
    >
      {geometry && <bufferGeometry attach="geometry" {...geometry} />}
      <meshStandardMaterial color={model.selected ? "orange" : "lightblue"} />
      {model.selected && <Edges scale={1.05} threshold={15} color="yellow" />}
    </mesh>
  );
};

// 🎨 UI Styles
const sidebarStyle = {
  width: "300px",
  height: "100vh",
  overflowY: "auto",
  backgroundColor: "#2f2f2f", // ✅ Dark gray sidebar
  padding: "20px",
  color: "#d3d3d3", // ✅ Light gray text for readability
};

const modelControlStyle = {
  marginBottom: "15px",
  padding: "10px",
  border: "1px solid #64c261", // ✅ Green accent border
  borderRadius: "5px",
  backgroundColor: "#3a3a3a", // ✅ Slightly lighter dark gray background
  color: "#d3d3d3", // ✅ Light gray text for readability
};

const buttonStyle = {
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

const deleteButtonStyle = {
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

const inputStyle = {
  width: "100%",
  padding: "8px",
  margin: "5px 0",
  border: "1px solid #555", // ✅ Darker border to blend with dark theme
  borderRadius: "4px",
  backgroundColor: "#1e1e1e", // ✅ Dark input background
  color: "#d3d3d3", // ✅ Light gray text for readability
  fontSize: "16px",
};

const selectStyle = {
  width: "100%",
  padding: "8px",
  margin: "5px 0",
  border: "1px solid #555", // ✅ Darker border
  borderRadius: "4px",
  backgroundColor: "#1e1e1e", // ✅ Dark dropdown background
  color: "#d3d3d3", // ✅ Light gray text
  fontSize: "16px",
};

const popupStyle = {
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

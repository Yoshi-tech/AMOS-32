import React from "react";
import MiniVisualizer from "./MiniVisualizer"; // ✅ Import Mini Visualizer
import "./Catalogue.css";

const Catalogue = ({ setActivePage, setSelectedModel }) => {
  const items = [
    {
      id: 1,
      title: "Video Game Case",
      description: "A sleek case for organizing your game collection.",
      model: "/models/nintendo_game_box.stl", // ✅ Explicit Model Path
    },
    {
      id: 2,
      title: "Office Supplies",
      description: "Keep your desk clutter-free with this organizer.",
      model: "/models/office_supplies_box.stl", // ✅ Explicit Model Path
    },
    {
      id: 3,
      title: "Bookshelf",
      description: "A modern bookshelf with modular design.",
      model: "/models/bookshelf_box.stl", // ✅ Explicit Model Path
    },
  ];

  return (
    <div className="catalogue-container">
      <h1>Catalogue</h1>
      <p>Click a model to view it in full detail:</p>
      <div className="catalogue-grid">
        {items.map((item) => (
          <div
            className="catalogue-item"
            key={item.id}
            onClick={() => {
              setSelectedModel(item.model); // ✅ Pass the explicit model path
              setActivePage("visualizer"); // ✅ Navigate to the Visualizer
            }}
          >
            {/* ✅ Mini Visualizer for each model */}
            <MiniVisualizer modelPath={item.model} />
            <div className="catalogue-info">
              <h2>{item.title}</h2>
              <p>{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Catalogue;

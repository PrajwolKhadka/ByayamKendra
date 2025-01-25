import React, { useState } from "react";
import "../css/suggestions.css";

const suggest = () => {
  const items = [
    { id: 1, title: "Workout A", description: "Details about Workout A" },
    { id: 2, title: "Workout B", description: "Details about Workout B" },
    { id: 3, title: "Workout C", description: "Details about Workout C" },
    { id: 4, title: "Workout D", description: "Details about Workout D" },
  ];

  const [selectedItem, setSelectedItem] = useState(null);

  return (
    <div className="container-suggest">
      <div className="sidebar-suggest">
        {items.map((item) => (
          <div
            key={item.id}
            className={`sidebar-suggest-item ${
              selectedItem?.id === item.id ? "active" : ""
            }`}
            onClick={() => setSelectedItem(item)}
          >
            {item.title}
          </div>
        ))}
      </div>
      <div className="main-content-suggest">
        {selectedItem ? (
          <div className="details-suggest">
            <h2>{selectedItem.title}</h2>
            <p>{selectedItem.description}</p>
          </div>
        ) : (
          <div className="placeholder-suggest">Select an item to view details</div>
        )}
      </div>
    </div>
  );
};

export default suggest;

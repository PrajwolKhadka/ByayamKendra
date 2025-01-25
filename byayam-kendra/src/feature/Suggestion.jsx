import React, { useState } from "react";
import "../css/suggestions.css";
import {items} from './suggestionData.jsx'

const suggest = () => {
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
            {selectedItem.description.split("\n").map((line, index) => (
            <p key={index}>{line}</p>
            ))}
            {selectedItem.works.length > 0 && (
            <div className="workout-details">
                {selectedItem.works.map((work, index) => (
                <div key={index} className="day-details">
                    <h3>{work.day}</h3>
                    {work.exercises.map((exercise, idx) => (
                    <div key={idx} className="exercise">
                        <img src={exercise.image} alt={exercise.name} className="exercise-image" loading="lazy"/>
                        <p>{exercise.name} - {exercise.sets} sets</p>
                    </div>
                    ))}
                </div>
                ))}
            </div>
            )}
        </div> 
        ) : (
          <div className="placeholder-suggest">Select an item to view details</div>
        )}
      </div>
    </div>
  );
};

export default suggest;

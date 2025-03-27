import React, { useState } from "react";
import "./Buildings.css";
import { Link } from "react-router-dom";

const buildingData = [
  {
    id: 1,
    name: "228 Albert St",
    images: [
      "https://via.placeholder.com/500x300?text=Albert+St+1",
      "https://via.placeholder.com/500x300?text=Albert+St+2",
      "https://via.placeholder.com/500x300?text=Albert+St+3",
    ],
    price: "$2,132.00 - $3,444.00",
    description: `
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum molestie, 
      ex non accumsan faucibus, lectus ipsum ultrices arcu, non blandit ligula 
      tortor nec neque. Pellentesque habitant morbi tristique senectus et netus 
      et malesuada fames ac turpis egestas.
    `,
  },
  {
    id: 2,
    name: "King Street Tower",
    images: [
      "https://via.placeholder.com/500x300?text=King+St+Tower+1",
      "https://via.placeholder.com/500x300?text=King+St+Tower+2",
    ],
    price: "$1,800.00 - $2,500.00",
    description: `
      Phasellus venenatis nisi lorem, id gravida nisl dapibus id. Nullam sagittis 
      sapien a purus ullamcorper, eu lacinia mi hendrerit. Suspendisse potenti. 
      Mauris interdum imperdiet mauris a feugiat.
    `,
  },
  {
    id: 3,
    name: "UPlus Waterloo",
    images: [
      "https://via.placeholder.com/500x300?text=UPlus+1",
      "https://via.placeholder.com/500x300?text=UPlus+2",
      "https://via.placeholder.com/500x300?text=UPlus+3",
      "https://via.placeholder.com/500x300?text=UPlus+4",
    ],
    price: "$2,000.00 - $2,900.00",
    description: `
      Integer sed aliquet tellus, non viverra magna. Etiam vel ligula leo. Cras 
      sodales congue leo. Praesent malesuada, lorem id dictum auctor, felis magna 
      ultricies arcu, sit amet aliquam sapien nisl a nisi.
    `,
  },
];

function Buildings() {
  const [selectedBuildingId, setSelectedBuildingId] = useState(buildingData[0].id);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Identify the selected building object
  const selectedBuilding = buildingData.find((b) => b.id === selectedBuildingId);

  // Switch building
  const handleSelectBuilding = (id) => {
    setSelectedBuildingId(id);
    setCurrentImageIndex(0);
  };

  // Carousel: previous image
  const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? selectedBuilding.images.length - 1 : prev - 1
    );
  };

  // Carousel: next image
  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === selectedBuilding.images.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="buildings-page">
      {/* Left Panel: Building List */}
      <div className="building-list">
        <h2>All Buildings</h2>
        <ul>
          {buildingData.map((building) => (
            <li
              key={building.id}
              onClick={() => handleSelectBuilding(building.id)}
              className={building.id === selectedBuildingId ? "active" : ""}
            >
              {building.name}
            </li>
          ))}
        </ul>
      </div>

      {/* Right Panel: Building Details + Carousel */}
      <div className="building-details">
        <div className="carousel">
          <button className="arrow-btn arrow-left" onClick={handlePrevImage}>
            ⟨
          </button>
          <img
            src={selectedBuilding.images[currentImageIndex]}
            alt={selectedBuilding.name}
            className="building-img"
          />
          <button className="arrow-btn arrow-right" onClick={handleNextImage}>
            ⟩
          </button>
        </div>

        <h3 className="building-name">{selectedBuilding.name}</h3>
        <p className="building-price">{selectedBuilding.price}</p>
        <p className="building-desc">{selectedBuilding.description}</p>

        <span className="nav-item">
          <Link to={`/listing-details/${selectedBuilding.id}`}>
            <button>See more</button>
          </Link>
        </span>
      </div>
    </div>
  );
}

export default Buildings;

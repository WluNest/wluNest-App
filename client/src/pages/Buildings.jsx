import React, { useState } from "react";
import "./Buildings.css";

// 1. Carousel Class - Handles image navigation logic immutably
class Carousel {
  constructor(images = [], currentIndex = 0) {
    this.images = [...images]; // Create defensive copy
    this.currentIndex = currentIndex;
  }

  next() {
    const newIndex = (this.currentIndex + 1) % this.images.length;
    return new Carousel(this.images, newIndex); // Return new instance
  }

  prev() {
    const newIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    return new Carousel(this.images, newIndex); // Return new instance
  }

  getCurrentImage() {
    return this.images[this.currentIndex];
  }

  getCurrentIndex() {
    return this.currentIndex;
  }

  getTotalImages() {
    return this.images.length;
  }
}

// 2. Building Class - Encapsulates building data and behavior
class Building {
  constructor({ id, name, images = [], price, description }) {
    this.id = id;
    this.name = name;
    this.carousel = new Carousel(images); // Composition
    this.price = price;
    this.description = description;
  }

  // Returns a snapshot of current building details
  getDetails() {
    return {
      id: this.id,
      name: this.name,
      currentImage: this.carousel.getCurrentImage(),
      imagePosition: `${this.carousel.getCurrentIndex() + 1}/${this.carousel.getTotalImages()}`,
      price: this.price,
      description: this.description
    };
  }

  // Returns new Building instance with updated carousel state
  navigateToNextImage() {
    const newBuilding = new Building({
      id: this.id,
      name: this.name,
      images: this.carousel.images,
      price: this.price,
      description: this.description
    });
    newBuilding.carousel = this.carousel.next();
    return newBuilding;
  }

  // Returns new Building instance with updated carousel state
  navigateToPrevImage() {
    const newBuilding = new Building({
      id: this.id,
      name: this.name,
      images: this.carousel.images,
      price: this.price,
      description: this.description
    });
    newBuilding.carousel = this.carousel.prev();
    return newBuilding;
  }
}

// 3. Building Factory - Creates consistent building instances
const createBuilding = (buildingData) => {
  return new Building({
    id: buildingData.id,
    name: buildingData.name,
    images: buildingData.images,
    price: buildingData.price,
    description: buildingData.description
  });
};


// BuildingList - Pure presentational component
const BuildingList = ({ buildings, selectedId, onSelect }) => (
  <div className="building-list">
    <h2>Available Buildings</h2>
    <ul>
      {buildings.map((building) => (
        <li
          key={building.id}
          onClick={() => onSelect(building.id)}
          className={building.id === selectedId ? "active" : ""}
          aria-current={building.id === selectedId ? "true" : "false"}
        >
          {building.name}
          <span className="price-badge">{building.price.split(" - ")[0]}</span>
        </li>
      ))}
    </ul>
  </div>
);

// BuildingDetails 
const BuildingDetails = ({ building, onPrev, onNext }) => {
  const details = building.getDetails();
  return (
    <div className="building-details">
      <div className="carousel-container">
        <div className="carousel">
          <button 
            className="arrow-btn arrow-left" 
            onClick={onPrev}
            aria-label="Previous image"
          >
            ⟨
          </button>
          <div className="image-container">
            <img
              src={details.currentImage}
              alt={`${details.name} - ${details.imagePosition}`}
              className="building-img"
            />
            <div className="image-counter">{details.imagePosition}</div>
          </div>
          <button 
            className="arrow-btn arrow-right" 
            onClick={onNext}
            aria-label="Next image"
          >
            ⟩
          </button>
        </div>
      </div>
      <div className="building-info">
        <h3 className="building-name">{details.name}</h3>
        <p className="building-price">{details.price}</p>
        <p className="building-desc">{details.description}</p>
        <button className="contact-btn">Contact Property</button>
      </div>
    </div>
  );
};

// 5. Main Buildings Component
function Buildings() {
  // Initialize building objects using factory
  const initialBuildings = [
    createBuilding({
      id: 1,
      name: "228 Albert St",
      images: [
        "https://via.placeholder.com/800x500?text=Albert+St+1",
        "https://via.placeholder.com/800x500?text=Albert+St+2",
        "https://via.placeholder.com/800x500?text=Albert+St+3",
      ],
      price: "$2,132.00 - $3,444.00",
      description: `Modern high-rise with excellent amenities including gym, pool, and 24/7 security. Located in the heart of downtown with easy access to public transit.`,
    }),
    createBuilding({
      id: 2,
      name: "King Street Tower",
      images: [
        "https://via.placeholder.com/800x500?text=King+St+Tower+1",
        "https://via.placeholder.com/800x500?text=King+St+Tower+2",
      ],
      price: "$1,800.00 - $2,500.00",
      description: `Luxury living with panoramic city views. Features include concierge service, rooftop terrace, and smart home technology. Pet-friendly with on-site dog park.`,
    }),
    createBuilding({
      id: 3,
      name: "UPlus Waterloo",
      images: [
        "https://via.placeholder.com/800x500?text=UPlus+1",
        "https://via.placeholder.com/800x500?text=UPlus+2",
        "https://via.placeholder.com/800x500?text=UPlus+3",
        "https://via.placeholder.com/800x500?text=UPlus+4",
      ],
      price: "$2,000.00 - $2,900.00",
      description: `Student-focused housing with study lounges, high-speed internet, and all-inclusive utilities. Bike storage and laundry facilities on every floor.`,
    }),
  ];

  // State management
  const [buildings, setBuildings] = useState(initialBuildings);
  const [selectedBuildingId, setSelectedBuildingId] = useState(initialBuildings[0].id);

  // Find the currently selected building
  const selectedBuilding = buildings.find(b => b.id === selectedBuildingId);

  // Event handlers
  const handleSelectBuilding = (id) => {
    setSelectedBuildingId(id);
  };

  const handlePrevImage = () => {
    setBuildings(prevBuildings => 
      prevBuildings.map(building => 
        building.id === selectedBuildingId 
          ? building.navigateToPrevImage() 
          : building
      )
    );
  };

  const handleNextImage = () => {
    setBuildings(prevBuildings => 
      prevBuildings.map(building => 
        building.id === selectedBuildingId 
          ? building.navigateToNextImage() 
          : building
      )
    );
  };

  return (
    <div className="buildings-page">
      <header className="buildings-header">
        <h1>Student Housing Options</h1>
        <p>Browse our available properties in the Waterloo area</p>
      </header>
      
      <div className="buildings-container">
        <BuildingList 
          buildings={buildings} 
          selectedId={selectedBuildingId} 
          onSelect={handleSelectBuilding} 
        />
        <BuildingDetails 
          building={selectedBuilding}
          onPrev={handlePrevImage}
          onNext={handleNextImage}
        />
      </div>
    </div>
  );
}

export default Buildings;

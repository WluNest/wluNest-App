import React from 'react';
import "./Buildings";
import { useParams } from "react-router-dom";
import "./ListingDetails.css";

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
    bookingUrl: "https://www.example.com/book/228-albert-st",
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
    bookingUrl: "https://www.example.com/book/king-st-tower",
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
    bookingUrl: "https://www.example.com/book/uplus-waterloo",
  },
];

function ListingDetails() {
  const { id } = useParams();
  const listing = buildingData.find((l) => l.id === parseInt(id));

  if (!listing) {
    return <div>Property not found</div>;
  }

  return (
    <div className="listing-details">
      <h2>{listing.name}</h2>
      <p>{listing.price}</p>
      <p>{listing.description}</p>

      <div className="listing-images">
        {listing.images.map((image, index) => (
          <img key={index} src={image} alt={`Property ${listing.name}`}></img>
        ))}
      </div>

      {/* button to redirect users to external website */}
      <a href={listing.bookingUrl} target="_blank" rel='noopener noreferrer'>
        <button>Book Now</button>
      </a>
    </div>
  );
}

export default ListingDetails;
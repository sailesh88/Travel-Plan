import React, { useEffect, useState, useRef } from "react";
import { GoogleMap, Polygon } from "@react-google-maps/api";

// css
import "../assets/home.css";

const options = {
  fillColor: "lightblue",
  fillOpacity: 1,
  strokeColor: "red",
  strokeOpacity: 1,
  strokeWeight: 2,
  clickable: false,
  draggable: false,
  editable: false,
  geodesic: false,
  zIndex: 1,
};

const Home = (props) => {
  const [locations, setLocations] = useState([]);
  let googleRef = useRef();

  useEffect(() => {
    setLocations(...[], props.data);
  }, []);

  return (
    <div className="content">
      <GoogleMap
        mapContainerClassName="App-map"
        center={{ lat: 25.774, lng: -80.19 }}
        zoom={12}
        ref={googleRef}
      >
        <Polygon paths={locations} options={options} />
      </GoogleMap>
    </div>
  );
};

export default Home;

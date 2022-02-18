import React, { useState, useEffect } from "react";
import Map, { Marker, Popup } from "react-map-gl";
import FmdGoodIcon from "@mui/icons-material/FmdGood";
import axios from "axios";
import { format } from "timeago.js";
import StarIcon from "@mui/icons-material/Star";
import "mapbox-gl/dist/mapbox-gl.css";
import "./App.css";
import Register from "./components/Register";
import Login from "./components/Login";

const App = () => {
  const [pins, setPins] = useState([]);
  const myStorage = window.localStorage;
  const [currentUsername, setCurrentUsername] = useState(
    myStorage.getItem("user")
  );
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [showPopup, setShowPopup] = useState(true);
  const [newPlace, setNewPlace] = useState(null);
  const [title, setTitle] = useState(null);
  const [desc, setDesc] = useState(null);
  const [rating, setRating] = useState(null);
  const [showRegister, setShowRegister] = useState(null);
  const [showLogin, setShowLogin] = useState(null);
  const [viewport, setViewport] = useState({
    latitude: 47.040182,
    longitude: 17.071727,
    zoom: 4,
  });

  const handleMarkerClick = (id, lat, long) => {
    setCurrentPlaceId(id);
  };

  const handleLogout = () => {
    setCurrentUsername(null);
    myStorage.removeItem("user");
  };

  const handleAddClick = (e) => {
    const coordinates = e.lngLat;
    setNewPlace({
      lat: coordinates.lat,
      long: coordinates.lng,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPin = {
      username: currentUsername,
      title,
      desc,
      rating,
      lat: newPlace.lat,
      long: newPlace.long,
    };

    try {
      const res = await axios.post("/pins", newPin);
      setPins([...pins, res.data]);
      setNewPlace(null);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const getPins = async () => {
      try {
        const res = await axios.get("/pins");
        setPins(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getPins();
  }, []);

  return (
    <div className="App">
      <Map
        onDblClick={handleAddClick}
        mapboxAccessToken="pk.eyJ1IjoibmVzaGF0a2hvcnNhbmRpIiwiYSI6ImNrenFieTZoOTA1dWIydXFrb3Jsamwzb3QifQ.144t_WCTdjYMV3r4yiIxYw"
        initialViewState={{
          latitude: 37.7577,
          longitude: -122.4376,
          zoom: 4,
        }}
        style={{ width: "100vw", height: "100vh" }}
        mapStyle="mapbox://styles/mapbox/streets-v9"
      >
        {pins.map((p) => (
          <>
            <Marker
              longitude={p.long}
              latitude={p.lat}
              offsetLeft={-3.5 * viewport.zoom}
              offsetTop={-7 * viewport.zoom}
            >
              <FmdGoodIcon
                onClick={() => {
                  if (showPopup === false) {
                    setShowPopup(true);
                  } else setShowPopup(false);

                  handleMarkerClick(p._id, p.lat, p.long);
                }}
                style={{
                  fontSize: 7 * viewport.zoom,
                  color:
                    currentUsername === p.username ? "tomato" : "slateblue",
                  cursor: "pointer",
                }}
              />
            </Marker>
            {p._id === currentPlaceId && showPopup === true ? (
              <Popup
                longitude={p.long}
                latitude={p.lat}
                anchor="left"
                // x  onClose={() => setCurrentPlaceId(null)}
              >
                <div className="card">
                  <label>Place</label>
                  <h4 className="place">{p.title}</h4>
                  <label>Review</label>
                  <p className="desc">{p.desc}</p>
                  <label>Rating</label>
                  <div className="stars">
                    {Array(p.rating).fill(<StarIcon className="star" />)}
                  </div>
                  <label>Information</label>
                  <span className="username">
                    Created by <b>{p.username}</b>
                  </span>
                  <span className="date">{format(p.createdAt)}</span>
                </div>
              </Popup>
            ) : (
              ""
            )}
            {newPlace !== null ? (
              <>
                <Marker
                  longitude={p.long}
                  latitude={p.lat}
                  offsetLeft={-3.5 * viewport.zoom}
                  offsetTop={-7 * viewport.zoom}
                >
                  <FmdGoodIcon
                    style={{
                      fontSize: 7 * viewport.zoom,
                      color: "tomato",
                      cursor: "pointer",
                    }}
                  />
                </Marker>
                <Popup
                  longitude={newPlace.long}
                  latitude={newPlace.lat}
                  anchor="left"
                  onClose={() => setNewPlace(null)}
                >
                  <div>
                    <form onSubmit={handleSubmit}>
                      <label>Title</label>
                      <input
                        placeholder="Enter title"
                        onChange={(e) => setTitle(e.target.value)}
                      />
                      <label>Review</label>
                      <textarea
                        placeholder="Tell us something about this place"
                        onChange={(e) => setDesc(e.target.value)}
                      />
                      <label>Rating</label>
                      <select onChange={(e) => setRating(e.target.value)}>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                      </select>
                      <button className="submitButton" type="submit">
                        Add Pin
                      </button>
                    </form>
                  </div>
                </Popup>
              </>
            ) : (
              ""
            )}
          </>
        ))}
        {currentUsername ? (
          <button className="button logout" onClick={handleLogout}>
            Log out
          </button>
        ) : (
          <div className="buttons">
            <button className="button login" onClick={() => setShowLogin(true)}>
              Log in
            </button>
            <button
              className="button register"
              onClick={() => setShowRegister(true)}
            >
              Register
            </button>
          </div>
        )}
        {showRegister && <Register setShowRegister={setShowRegister} />}
        {showLogin && (
          <Login
            setShowLogin={setShowLogin}
            setCurrentUsername={setCurrentUsername}
            myStorage={myStorage}
          />
        )}
      </Map>
    </div>
  );
};

export default App;

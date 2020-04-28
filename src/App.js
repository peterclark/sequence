import React from "react";
import Deck from "./components/Deck/Deck";
import "./App.css";

function App() {
  return (
    <div className="App">
      <div className="playingCards fourColours faceImages">
        <Deck display="faces" placement="table" shuffle colored={false} />
      </div>
    </div>
  );
}

export default App;

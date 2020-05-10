import React, { useState, useEffect, useMemo } from "react";
import Sequence from "./components/Sequence/Sequence";
import * as db from "./services/firestore";
import useGameId from "./hooks/useGameId";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import { size, get, values, uniqueId } from "lodash";
import "./App.scss";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [userId, setUserId] = useState();
  const [userName, setUserName] = useState();
  const [game, setGame] = useState();
  const [gameId, setGameId] = useGameId("gameId");

  const validName = useMemo(() => size(userName) > 2, [userName]);
  const players = useMemo(() => (game ? game.players : []), [game]);
  const player = useMemo(() => get(game, `players.${userId}`), [game, userId]);

  const handleStartGame = () => {
    db.startGame(userId, userName)
      .then((doc) => {
        setGameId(doc.id);
        console.log(`${userName} started game ${doc.id}`);
      })
      .catch((error) => console.log(error));
  };

  const handleJoinGame = () => {
    db.joinGame(gameId, userId, userName)
      .then(() => {
        console.log(`${userName} joined game ${gameId}`);
      })
      .catch((error) => console.log(error));
  };

  const onGameUpdate = (data) => {
    setGame(data);
    console.log("game updated...", data);
  };

  const handleTypeName = (e) => {
    setUserName(e.target.value);
  };

  useEffect(() => {
    db.authenticateAnonymously()
      .then((userAuth) => {
        setUserId(userAuth.user.uid);
        if (gameId) {
          db.getGame(gameId)
            .then((game) => {
              if (game.exists) {
                db.subscribeToGame(gameId, onGameUpdate);
              } else {
                console.log(`Game ${gameId} does not exist.`);
              }
            })
            .catch(() => console.log("error getting game"));
        }
      })
      .catch(() => console.log("error authenticating"));
    return () => console.log("clean up");
  }, [gameId, setGameId]);

  if (!game) {
    return (
      <div className="App">
        <InputGroup className="mb-3">
          <FormControl
            size="lg"
            placeholder="Enter your name..."
            className="NameInput"
            onChange={handleTypeName}
          />
          <InputGroup.Append>
            <Button onClick={handleStartGame} disabled={!validName}>
              Start Game
            </Button>
          </InputGroup.Append>
        </InputGroup>
      </div>
    );
  }

  if (!player) {
    return (
      <div className="App">
        <InputGroup className="mb-3">
          <FormControl
            size="lg"
            placeholder="Enter your name..."
            className="NameInput"
            onChange={handleTypeName}
          />
          <InputGroup.Append>
            <Button onClick={handleJoinGame} disabled={!validName}>
              Join Game
            </Button>
          </InputGroup.Append>
        </InputGroup>
      </div>
    );
  }

  return (
    <div className="App">
      <div className="TopPanel">
        <div className="TopPlayer">
          {values(players).map((p) => (
            <span key={uniqueId("player-")}>{p.name} </span>
          ))}
        </div>
      </div>
      <div className="MainPanel">
        <div className="LeftPanel">
          <div className="player">Todo</div>
        </div>
        <Sequence game={game} gameId={gameId} userId={userId} />
        <div className="RightPanel">
          <div className="player">Todo</div>
        </div>
      </div>
      <div className="BottomPanel">
        <div className="player">Todo</div>
      </div>
    </div>
  );
}

export default App;

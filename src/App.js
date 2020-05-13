import React, { useState, useEffect, useMemo } from "react";
import Sequence from "./components/Sequence/Sequence";
import * as db from "./services/firestore";
import useGameId from "./hooks/useGameId";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import classNames from "classnames";
import {
  size,
  get,
  values,
  keyBy,
  inRange,
  sample,
  keys,
  isNumber,
} from "lodash";
import "./App.scss";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [userId, setUserId] = useState();
  const [userName, setUserName] = useState();
  const [game, setGame] = useState();
  const [gameId, setGameId] = useGameId("gameId");

  const validName = useMemo(() => size(userName) > 2, [userName]);
  const players = useMemo(() => (game ? values(game.players) : []), [game]);
  const playerMap = useMemo(() => keyBy(players, "position"), [players]);
  const isMinSeated = useMemo(
    () => size(values(players).filter((p) => isNumber(p.position))) > 1,
    [players]
  );
  const player = useMemo(() => get(game, `players.${userId}`), [game, userId]);
  const mySeat = useMemo(() => get(player, "position"), [player]);
  const isSeated = useMemo(() => inRange(mySeat, 5), [mySeat]);
  const { isActive, createdBy } = useMemo(() => game || {}, [game]);
  const isHost = useMemo(() => createdBy && createdBy === userId, [
    createdBy,
    player,
    userId,
  ]);

  const seats = [
    { position: 0, team: "success" },
    { position: 1, team: "primary" },
    { position: 2, team: "danger" },
    { position: 3, team: "success" },
    { position: 4, team: "primary" },
    { position: 5, team: "danger" },
  ];

  useMemo(() => console.log(playerMap), [playerMap]);

  const handleCreateGame = () => {
    db.createGame(userId, userName)
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

  const handleStartGame = () => {
    const startingPlayer = sample(keys(playerMap));
    db.startGame(gameId, startingPlayer.id).then(() =>
      console.log("game starting...")
    );
  };

  const onGameUpdate = (data) => {
    setGame(data);
    console.log("game updated...", data);
  };

  const handleTypeName = (e) => {
    setUserName(e.target.value);
  };

  const handleTakeSeat = (position, team) => {
    if (isSeated) return;
    db.takeSeat(gameId, userId, position, team);
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
            <Button onClick={handleCreateGame} disabled={!validName}>
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
        {seats.map(({ position, team }) => (
          <div className="Seat" key={`seat-${position}`}>
            {playerMap[position] && (
              <div className="SeatedPlayer">
                <i className={`fas fa-2x fa-life-ring text-${team}`} />
                <span>{playerMap[position].name}</span>
              </div>
            )}
            {!playerMap[position] && !isActive && (
              <Button
                className="TakeSeatButton"
                variant={team}
                disabled={isSeated}
                onClick={() => handleTakeSeat(position, team)}
              >
                <i className="fas fa-2x fa-chair" />
              </Button>
            )}
          </div>
        ))}
      </div>
      <div className={classNames("MainPanel", { isActive })}>
        {isMinSeated && isHost && !isActive && (
          <Button
            className="StartButton"
            variant="success"
            onClick={handleStartGame}
          >
            <i className="fa fa-lg fa-power-off" />
          </Button>
        )}
        <Sequence game={game} gameId={gameId} userId={userId} />
      </div>
    </div>
  );
}

export default App;

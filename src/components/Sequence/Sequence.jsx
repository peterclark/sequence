import React, { useMemo } from "react";
import * as db from "../../services/firestore";
import { uniqueId } from "lodash";
import { Card } from "../Card";
import { get, values, sortBy, indexOf } from "lodash";
import classNames from "classnames";
import "./Sequence.scss";

const Sequence = (props) => {
  const { game, gameId, userId } = props;

  const { board: moves = {}, players } = useMemo(() => game || {}, [game]);
  const me = useMemo(() => players[userId], [players, userId]);
  const myCards = useMemo(() => get(me, "cards") || [], [me]);

  // Two Eyed Jacks are Wild
  const hasTwoEyedJack = useMemo(
    () => myCards.includes("J♣") || myCards.includes("J♦"),
    [myCards]
  );
  // One Eyed Jacks Remove
  const hasOneEyedJack = useMemo(
    () => myCards.includes("J♠") || myCards.includes("J♥"),
    [myCards]
  );
  const playersByPosition = useMemo(() => sortBy(values(players), "position"), [
    players,
  ]);
  const currentPlayerId = useMemo(
    () =>
      get(
        values(players).find((p) => p.isActive),
        "id"
      ),
    [players]
  );

  const nextPlayerId = useMemo(() => {
    const playerOrder = playersByPosition.map((p) => p.id);
    const currentPlayerIndex = indexOf(playerOrder, currentPlayerId);
    const nextPlayerIndex = (currentPlayerIndex + 1) % playerOrder.length;
    return playerOrder[nextPlayerIndex];
  }, [players]);

  const board = [
    ["JB", "2♠", "3♠", "4♠", "5♠", "6♠", "7♠", "8♠", "9♠", "JL"],
    ["6♣", "5♣", "4♣", "3♣", "2♣", "A♥", "K♥", "Q♥", "T♥", "T♠"],
    ["7♣", "A♠", "2♦", "3♦", "4♦", "5♦", "6♦", "7♦", "9♥", "Q♠"],
    ["8♣", "K♠", "6♣", "5♣", "4♣", "3♣", "2♣", "8♦", "8♥", "K♠"],
    ["9♣", "Q♠", "7♣", "6♥", "5♥", "4♥", "A♥", "9♦", "7♥", "A♠"],
    ["T♣", "T♠", "8♣", "7♥", "2♥", "3♥", "K♥", "T♦", "6♥", "2♦"],
    ["Q♣", "9♠", "9♣", "8♥", "9♥", "T♥", "Q♥", "Q♦", "5♥", "3♦"],
    ["K♣", "8♠", "T♣", "Q♣", "K♣", "A♣", "A♦", "K♦", "4♥", "4♦"],
    ["A♣", "7♠", "6♠", "5♠", "4♠", "3♠", "2♠", "2♥", "3♥", "5♦"],
    ["JL", "A♦", "K♦", "Q♦", "T♦", "9♦", "8♦", "7♦", "6♦", "JB"],
  ];

  const handlePlaceToken = (coord, card) => {
    if (!me.isActive) return;
    db.placeToken(
      gameId,
      game,
      coord,
      me.team,
      currentPlayerId,
      nextPlayerId,
      card
    ).then(() => console.log(`token placed at ${coord}`));
  };

  const handleRemoveToken = (coord, card) => {
    if (!me.isActive || !hasOneEyedJack) return;
    db.removeToken(
      gameId,
      game,
      coord,
      currentPlayerId,
      nextPlayerId,
      card
    ).then(() => console.log(`token removed at ${coord}`));
  };

  return (
    <div className={classNames("Sequence", { Active: me.isActive })}>
      {board.map((row, x) => (
        <div
          className="playingCards faceImages fourColours"
          key={uniqueId("row")}
        >
          <ul className="table">
            {row.map((card, y) => (
              <li key={uniqueId(`row-${card}`)}>
                <Card
                  canTake={
                    me.isActive && (myCards.includes(card) || hasTwoEyedJack)
                  }
                  canRemove={me.isActive && hasOneEyedJack}
                  data={card}
                  coord={[x, y]}
                  token={get(moves, `${x}.${y}`)}
                  onPlaceToken={handlePlaceToken}
                  onRemoveToken={handleRemoveToken}
                />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default Sequence;

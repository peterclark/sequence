import React, { useState, useMemo } from "react";
import { Card } from "../Card";
import { flatten, sampleSize, take } from "lodash";
import classNames from "classnames";

const Deck = (props) => {
  const [suits] = useState(["♣", "♦", "♥", "♠"]);
  const [ranks] = useState([2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K", "A"]);
  const {
    colored = true,
    display = "faces",
    rotate = false,
    placement = "table",
    count = 52,
    shuffle = false,
  } = props;

  const deck = useMemo(
    () =>
      flatten(
        suits.map((suit) =>
          ranks.map((rank) => {
            return {
              suit,
              rank,
            };
          })
        )
      ),
    [suits, ranks]
  );

  const cards = useMemo(() => {
    return shuffle ? sampleSize(deck, count) : take(deck, count);
  }, [count, shuffle]);

  const displayClass = useMemo(() => {
    return {
      faces: "faceImages",
      simple: "simpleCards",
      text: "inText",
    }[display];
  }, [display]);

  const deckClass = useMemo(() => {
    return classNames(
      "playingCards",
      displayClass,
      { fourColours: colored },
      { rotateHand: rotate }
    );
  }, [colored, rotate, displayClass]);

  return (
    <div className={deckClass}>
      <ul className={placement}>
        {cards.map(({ suit, rank }) => (
          <li key={`${rank}${suit}`}>
            <Card suit={suit} rank={rank} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Deck;

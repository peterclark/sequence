import React, { useState, useMemo } from "react";
import { Card, Joker } from "../Card";
import { flatten, sampleSize, take } from "lodash";
import classNames from "classnames";

const Deck = (props) => {
  const [suits] = useState(["♣", "♦", "♥", "♠"]);
  const [ranks] = useState([2, 3, 4, 5, 6, 7, 8, 9, "T", "J", "Q", "K", "A"]);
  const {
    colored = true,
    display = "faces",
    rotate = false,
    placement = "table",
    count = props.jokers ? 54 : 52,
    shuffle = false,
    jokers = false,
  } = props;

  const deck = useMemo(() => {
    const regular = flatten(
      suits.map((suit) =>
        ranks.map((rank) => {
          return {
            suit,
            rank,
          };
        })
      )
    );
    if (jokers) {
      regular.push({ joker: "big" });
      regular.push({ joker: "little" });
    }
    return regular;
  }, [suits, ranks, jokers]);

  const cards = useMemo(() => {
    return shuffle ? sampleSize(deck, count) : take(deck, count);
  }, [shuffle, count, deck]);

  const displayClass = useMemo(() => {
    return {
      faces: "faceImages",
      simple: "simpleCards",
      text: "inText",
    }[display];
  }, [display]);

  const deckClass = useMemo(() => {
    return classNames(
      "Deck",
      "playingCards",
      displayClass,
      { fourColours: colored },
      { rotateHand: rotate }
    );
  }, [colored, rotate, displayClass]);

  return (
    <div className={deckClass}>
      <ul className={placement}>
        {cards.map(({ suit, rank, joker }) =>
          joker ? (
            <li key={`joker-${joker}`}>
              <Joker big={joker === "big"} small={joker === "little"} />
            </li>
          ) : (
            <li key={`${rank}${suit}`}>
              <Card suit={suit} rank={rank} />
            </li>
          )
        )}
      </ul>
    </div>
  );
};

export default Deck;

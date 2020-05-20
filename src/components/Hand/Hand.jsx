import React, { useMemo } from "react";
import { BackCard, HandCard } from "../Card/Card";
import { range, size } from "lodash";
import "./Hand.scss";

const Hand = ({ cards = [], mine, isActive }) => {
  const numberOfCards = useMemo(() => size(cards) || 6, [cards]);

  return (
    <div className="playingCards faceImages fourColours Hand">
      {(!mine || !isActive) && (
        <ul className="deck">
          {range(numberOfCards).map((c) => (
            <BackCard key={`card-${c}`} />
          ))}
        </ul>
      )}

      {mine && isActive && (
        <ul className="hand">
          {cards.map((card) => (
            <HandCard data={card} key={`card-${card}`} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default Hand;

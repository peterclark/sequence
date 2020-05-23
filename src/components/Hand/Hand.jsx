import React, { useMemo } from "react";
import { BackCard, HandCard } from "../Card/Card";
import { range, size, uniqueId } from "lodash";
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
        <ul className="hand MyHand">
          {cards.map((card) => (
            <HandCard data={card} key={uniqueId("card-")} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default Hand;

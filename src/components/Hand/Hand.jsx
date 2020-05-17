import React from "react";
import { BackCard, HandCard } from "../Card/Card";
import { range } from "lodash";
import "./Hand.scss";

const Hand = ({ cards = [], mine, isActive }) => {
  console.log(cards, mine);
  return (
    <div className="playingCards faceImages fourColours rotateHand Hand">
      {(!mine || !isActive) && (
        <ul className="hand">
          {range(5).map((c) => (
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

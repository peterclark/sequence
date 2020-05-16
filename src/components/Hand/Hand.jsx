import React from "react";
import { BackCard, HandCard } from "../Card/Card";
import { range } from "lodash";
import "./Hand.scss";

const Hand = ({ cards = [], mine }) => {
  console.log(cards, mine);
  return (
    <div className="playingCards faceImages rotateHand Hand">
      {!mine && (
        <ul className="hand">
          {range(5).map((c) => (
            <BackCard key={`card-${c}`} />
          ))}
        </ul>
      )}

      {mine && (
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

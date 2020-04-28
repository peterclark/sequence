import React, { useMemo } from "react";
import classNames from "classnames";
import { toLower } from "lodash";
import "./cards.css";

const Card = (props) => {
  const rank = useMemo(() => props.rank, [props.rank]);
  const suit = useMemo(() => props.suit, [props.suit]);
  const suitClass = useMemo(() => {
    return {
      "♣": "clubs",
      "♦": "diams",
      "♥": "hearts",
      "♠": "spades",
    }[props.suit];
  }, [props.suit]);

  const handleSelectCard = (card) => console.log(`clicked ${card}`);

  return (
    <a
      href="#"
      className={classNames("card", `rank-${toLower(rank)}`, suitClass)}
      onClick={() => handleSelectCard(`${rank}${suit}`)}
    >
      <span className="rank">{rank}</span>
      <span className="suit">{suit}</span>
    </a>
  );
};

export default Card;

import React, { useMemo } from "react";
import classNames from "classnames";
import { toLower, isString } from "lodash";
import "./cards.css";
import "./Card.scss";

const Card = (props) => {
  const { coord, data, token, onPlaceToken, canTake } = props;

  const rank = useMemo(() => (isString(data) ? data[0] : props.rank), [
    props,
    data,
  ]);
  const suit = useMemo(() => (isString(data) ? data[1] : props.suit), [
    props,
    data,
  ]);

  const suitClass = useMemo(() => {
    return {
      "♣": "clubs",
      "♦": "diams",
      "♥": "hearts",
      "♠": "spades",
    }[suit];
  }, [suit]);

  const numberRank = useMemo(() => {
    return rank === "T" ? "10" : rank;
  }, [rank]);
  const rankClass = useMemo(() => toLower(`rank-${numberRank}`), [numberRank]);

  if (data === "JB") return <Joker big />;
  if (data === "JL") return <Joker little />;
  return (
    <a
      href={`#${data}`}
      className={classNames("Card", "card", rankClass, suitClass, data, {
        Token: token,
        canTake,
      })}
      onClick={() => canTake && onPlaceToken(coord)}
    >
      <span className="rank">{numberRank}</span>
      <span className="suit">{suit}</span>
      <i className={classNames("fas fa-life-ring", token)} />
    </a>
  );
};

const Joker = ({ big }) => {
  const size = big ? "big" : "little";
  return (
    <span className={classNames("card", size, "joker")} href={`#${size}`}>
      <span className="rank">{big ? "+" : "-"}</span>
      <span className="suit">Joker</span>
    </span>
  );
};

const BackCard = () => {
  return (
    <li>
      <span className="card back">*</span>
    </li>
  );
};

const HandCard = ({ data }) => {
  const [rank, suit] = data.split("");

  const suitClass = {
    "♣": "clubs",
    "♦": "diams",
    "♥": "hearts",
    "♠": "spades",
  }[suit];

  const numberRank = rank === "T" ? "10" : rank;
  const rankClass = toLower(`rank-${numberRank}`);
  return (
    <li className={classNames("card", rankClass, suitClass, data)}>
      <span className="rank">{numberRank}</span>
      <span className="suit">{suit}</span>
    </li>
  );
};

export { Joker, Card, BackCard, HandCard };

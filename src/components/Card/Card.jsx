import React, { useMemo } from "react";
import classNames from "classnames";
import { toLower, isString } from "lodash";
import "./cards.css";
import "./Card.scss";

const Card = (props) => {
  const { coord, data, token, onPlaceToken } = props;

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
      href="#"
      className={classNames("Card", "card", rankClass, suitClass, data, {
        Token: token,
      })}
      onClick={() => onPlaceToken(coord)}
    >
      <span className="rank">{numberRank}</span>
      <span className="suit">{suit}</span>
      <i className={classNames("fas fa-circle", token)} />
    </a>
  );
};

const Joker = ({ big }) => {
  return (
    <span
      className={classNames("card", big ? "big" : "little", "joker")}
      href="#"
    >
      <span className="rank">{big ? "+" : "-"}</span>
      <span className="suit">Joker</span>
    </span>
  );
};

export { Joker, Card };

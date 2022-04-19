import React from "react";
import Card from "../Card/Card";
import './CardDeck.scss';

export interface CardDeckProps {}


export function CardDeck(props: CardDeckProps) {
  const cardsValues = [0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89];
  const cards = cardsValues.map(value => {
    return <li key={value} className="CardDeck-item" ><Card key={value} value={value} onClick={() => {}}/></li>
  })
  return (
    <div className='CardDeck-container'>
      <ul className='CardDeck-subcontainer'>
        {cards}
      </ul>
    </div>
  );
}

export default CardDeck;

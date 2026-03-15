import { Card } from "./interfaces";
import confettiImg from "../assets/img/ui-elements/confetti.png";

export const cardTemplate = (card: Card, basePath: string, theme: string): string => {
  return `
  <button class="card" data-card-name=${card.name}>
                  <div class="card__inner">
                    <div class="card__face card__face--front">
                      <img src="${basePath}assets/img/cards/${theme}/${theme}_card_back.png" />
                    </div>
                    <div class="card__face card__face--back">
                      <img src="${basePath}assets/img/cards/${theme}/${card.img}" />
                    </div>
                  </div>
                </button>
  `;
};

export const gameOverTemplate = (scoreBlue: number, scoreOrange: number, winner: string): string => {
  return `
      <div class="winner__overlay">
        <img class="confetti" src="${confettiImg}" alt="" />
        <span class="winner__title">The winner is</span>
        <span class="winner__player winner--color-${winner}">${winner.toUpperCase()} PLAYER</span>
        <div class="winner__icon winner--bg-${winner}"></div>
        <a href="index.html" class="button button--small button--exit">Back to start</a>
      </div>
      <div class="game-over__container">
        <h1 class="game-over__title">GAME OVER</h1>
        <h2 class="game-over__subtitle">Final score</h2>
        <div class="players__container">
          <div class="player player--blue">
            <div class="player__icon player__icon--blue"></div>
            <span>Blue</span>
            <span id="score-blue">${scoreBlue}</span>
          </div>
          <div class="player player--orange">
            <div class="player__icon player__icon--orange"></div>
            <span>Orange</span>
            <span id="score-orange">${scoreOrange}</span>
          </div>
        </div>
      </div>
  `;
};

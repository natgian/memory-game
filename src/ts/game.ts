import "../styles/main.scss";
import { GameSettings, Card, FlippedCard } from "./interfaces";
import themeData from "../assets/data/themes.json";
import { updateSpanText } from "./utils";
import { cardTemplate, gameOverTemplate } from "./templates";

class Game {
  basePath = import.meta.env.BASE_URL;
  currentSettings!: GameSettings;
  currentPlayer: GameSettings["player"];
  flippedCards: FlippedCard[] = [];
  matchedPairs: number = 0;
  score = {
    blue: 0,
    orange: 0,
  };

  /**
   * Initializes the game by loading settings, applying the theme and setting up the board.
   *
   */
  constructor() {
    this.getGameSettings();
    this.currentPlayer = this.currentSettings.player;
    this.applyTheme();
    this.initBoard(this.currentSettings);
  }

  /**
   * Gets the game settings from the session storage and assigns them to currentSettings.
   * If there are no game settings in the session storage it redirects the user to the settings page.
   */
  private getGameSettings(): void {
    const gameSettings = sessionStorage.getItem("gameSettings");

    if (gameSettings) {
      this.currentSettings = JSON.parse(gameSettings) as GameSettings;
    } else {
      window.location.href = "settings.html";
    }
  }

  /**
   * Applies the theme based on currentSettings.
   */
  private applyTheme(): void {
    document.body.classList.add(`theme--${this.currentSettings.theme}`);
    document.querySelector("#current-player")?.classList.add(`player__icon--${this.currentSettings.player}`);
  }

  /**
   * Initializes the game board:
   * - gets the cards based on the theme
   * - creates an array of card pairs
   * - shuffles the cards
   * - displays the cards
   *
   * @param settings - The current game settings (theme, player and board size)
   */
  private initBoard(settings: GameSettings): void {
    const cards = this.getThemeCards(settings);
    const cardPairs = this.createCardPairs(cards);
    const shuffledCards = this.shuffleCards(cardPairs);
    this.displayCards(settings, shuffledCards);
  }

  /**
   * Creates the cards on the board depending on the game settings.
   *
   * @param cardsContainer - The game board container
   * @param settings - The current game settings (theme, player and board size)
   * @param cards - The cards to use to create the board
   */
  private createCards(cardsContainer: Element, settings: GameSettings, cards: Card[]): void {
    cardsContainer.classList.add(`game__board--${settings.boardSize}`);
    cardsContainer.innerHTML = cards.map((card) => cardTemplate(card, this.basePath, settings.theme)).join("");
  }

  /**
   * Initializes the card click event listeners.
   *
   * @param cardsContainer - The game board container
   */
  private initCardListeners(cardsContainer: Element): void {
    cardsContainer.addEventListener("click", (event) => {
      const card = (event.target as HTMLElement).closest(".card") as HTMLButtonElement;
      this.handleCardClick(card);
    });
  }

  /**
   * Handles the card click.
   *
   * @param card - HTML button element
   * @returns - Does nothing if the card is invalid or two cards are already flipped
   */
  private handleCardClick(card: HTMLButtonElement): void {
    if (!card || !card.dataset.cardName) return;
    if (this.flippedCards.length >= 2) return;

    card.classList.toggle("is-flipped");
    this.flippedCards.push({ button: card, name: card.dataset.cardName });

    if (this.flippedCards.length === 2) {
      this.isMatch() ? this.handleMatch() : this.handleMismatch();
    }
  }

  /**
   * Checks if both card names match.
   *
   * @returns - True if the card names match, otherwise false
   */
  private isMatch(): boolean {
    return this.flippedCards[0].name === this.flippedCards[1].name;
  }

  /**
   * Switches the current player.
   */
  private switchPlayer(): void {
    document.querySelector("#current-player")?.classList.remove(`player__icon--${this.currentPlayer}`);
    this.currentPlayer = this.currentPlayer === "blue" ? "orange" : "blue";
    document.querySelector("#current-player")?.classList.add(`player__icon--${this.currentPlayer}`);
  }

  /**
   * Checks if the game is over.
   *
   * @returns - True if matchedPairs matches the board size, otherwise false
   */
  private isGameOver(): boolean {
    return this.matchedPairs === parseInt(this.currentSettings.boardSize) / 2;
  }

  /**
   * Updates the score table.
   */
  private updateScore(): void {
    this.score[`${this.currentPlayer}`] += 1;
    updateSpanText("#score-blue", this.score.blue.toString());
    updateSpanText("#score-orange", this.score.orange.toString());
  }

  /**
   * Handles the matching of two cards:
   * - adds an "is-matched" class
   * - empties the flippedCards array
   * - updates the score
   * - increments the matchedPairs property
   * - checks if the game is over
   */
  private handleMatch(): void {
    this.flippedCards[0].button.classList.add("is-matched");
    this.flippedCards[1].button.classList.add("is-matched");
    this.flippedCards = [];
    this.updateScore();
    this.matchedPairs++;

    if (this.isGameOver()) {
      this.handleGameOver();
    }
  }

  /**
   * Handles the mismatch of two cards by removing the "is-flipped" class, emptying the flippedCards
   * array and switching the player.
   */
  private handleMismatch(): void {
    setTimeout(() => {
      this.flippedCards[0].button.classList.toggle("is-flipped");
      this.flippedCards[1].button.classList.toggle("is-flipped");
      this.flippedCards = [];
      this.switchPlayer();
    }, 1000);
  }

  private handleGameOver(): void {
    setTimeout(() => {
      document.body.classList.add("game-over");
      const game = document.getElementById("game");
      if (!game) return;
      game.innerHTML = gameOverTemplate(this.score.blue, this.score.orange);
    }, 1000);
  }

  /**
   * Gets the card images to use depending on the theme settings.
   *
   * @param settings - The current game settings (theme, player and board size)
   * @returns - An array of card objects
   */
  private getThemeCards(settings: GameSettings): Card[] {
    const themeCards = themeData.themes[settings.theme].cards.slice(0, parseInt(settings.boardSize) / 2);
    return themeCards as Card[];
  }

  /**
   * Creates an array of card pairs.
   *
   * @param cards - The cards to duplicate to create the pairs
   * @returns - An array of card objects
   */
  private createCardPairs(cards: Card[]): Card[] {
    const cardPairs = [...cards, ...cards];
    return cardPairs;
  }

  /**
   * Shuffles the cards.
   *
   * @param cards - The cards to shuffle
   * @returns - A shuffled array of card objects
   */
  private shuffleCards(cards: Card[]) {
    const shuffledCards = [...cards];
    for (let i = shuffledCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledCards[i], shuffledCards[j]] = [shuffledCards[j], shuffledCards[i]];
    }
    return shuffledCards;
  }

  /**
   * Displays the cards on the board:
   * - Creates the cards depending on the game settings
   * - Adds click event listeners to the cards
   *
   * @param settings - The current game settings (theme, player and board size)
   * @param cards - Array of card objects to display
   */
  private displayCards(settings: GameSettings, cards: Card[]): void {
    const cardsContainer = document.querySelector(".game__board");

    if (cardsContainer) {
      this.createCards(cardsContainer, settings, cards);
      this.initCardListeners(cardsContainer);
    }
  }
}

const game = new Game();

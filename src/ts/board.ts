import { GameSettings, Card, FlippedCard } from "./interfaces";
import { cardTemplate } from "./templates";
import themeData from "../assets/data/themes.json";

export class Board {
  basePath = import.meta.env.BASE_URL;
  flippedCards: FlippedCard[] = [];
  matchedPairs: number = 0;
  onMatch?: () => void;
  onMismatch?: () => void;
  onGameOver?: () => void;

  constructor(private settings: GameSettings) {}

  /**
   * Initializes the game board:
   * - gets the cards based on the theme
   * - creates an array of card pairs
   * - shuffles the cards
   * - displays the cards
   *
   * @param settings - The current game settings (theme, player and board size)
   */
  public initBoard(): void {
    const cards = this.getThemeCards();
    const cardPairs = this.createCardPairs(cards);
    const shuffledCards = this.shuffleCards(cardPairs);
    this.displayCards(shuffledCards);
  }

  /**
   * Gets the card images to use depending on the theme settings.
   *
   * @param settings - The current game settings (theme, player and board size)
   * @returns - An array of card objects
   */
  private getThemeCards(): Card[] {
    const themeCards = themeData.themes[this.settings.theme].cards.slice(0, parseInt(this.settings.boardSize) / 2);
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
  private displayCards(cards: Card[]): void {
    const cardsContainer = document.querySelector(".game__board");

    if (cardsContainer) {
      this.createCards(cardsContainer, cards);
      this.initCardListeners(cardsContainer);
    }
  }

  /**
   * Creates the cards on the board depending on the game settings.
   *
   * @param cardsContainer - The game board container
   * @param settings - The current game settings (theme, player and board size)
   * @param cards - The cards to use to create the board
   */
  private createCards(cardsContainer: Element, cards: Card[]): void {
    cardsContainer.classList.add(`game__board--${this.settings.boardSize}`);
    cardsContainer.innerHTML = cards.map((card) => cardTemplate(card, this.basePath, this.settings.theme)).join("");
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
   * Handles the matching of two cards:
   * - adds an "is-matched" class
   * - empties the flippedCards array
   * - increments the matchedPairs property
   * - triggers the onMatch and onGameOver callbacks if applicable
   */
  private handleMatch(): void {
    this.flippedCards[0].button.classList.add("is-matched");
    this.flippedCards[1].button.classList.add("is-matched");
    this.flippedCards = [];
    this.matchedPairs++;
    this.onMatch?.();

    if (this.isGameOver()) {
      this.onGameOver?.();
    }
  }

  /**
   * Handles the mismatch of two cards by removing the "is-flipped" class, emptying the flippedCards
   * array and triggering the onMismatch callback.
   */
  private handleMismatch(): void {
    setTimeout(() => {
      this.flippedCards[0].button.classList.toggle("is-flipped");
      this.flippedCards[1].button.classList.toggle("is-flipped");
      this.flippedCards = [];
      this.onMismatch?.();
    }, 1000);
  }

  /**
   * Checks if the game is over.
   *
   * @returns - True if matchedPairs matches the board size, otherwise false
   */
  private isGameOver(): boolean {
    return this.matchedPairs === parseInt(this.settings.boardSize) / 2;
  }
}

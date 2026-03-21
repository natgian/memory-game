/**
 * Settings selected on the settings screen before the game begins.
 */
export interface StartGameSettings {
  theme: "code" | "foods";
  player: "blue" | "orange" | null;
  boardSize: "16" | "24" | "36" | null;
}

/**
 * Validated game settings after the game has started. All values are guaranteed to be set.
 */
export interface GameSettings {
  theme: "code" | "foods";
  player: "blue" | "orange";
  boardSize: "16" | "24" | "36";
}

/**
 * Represents a single memory card.
 */
export interface Card {
  /** Identifier used for matching pairs */
  name: string;
  /** Filename of the card image */
  img: string;
}

/**
 * Represents a card that has been flipped.
 */
export interface FlippedCard {
  /** The button element of the flipped card */
  button: HTMLButtonElement;
  /** Identifier used for matching pairs */
  name: string;
}

export interface StartGameSettings {
  theme: "code" | "foods";
  player: "blue" | "orange" | null;
  boardSize: "16" | "24" | "36" | null;
}

export interface GameSettings {
  theme: "code" | "foods";
  player: "blue" | "orange";
  boardSize: "16" | "24" | "36";
}

export interface Card {
  name: string;
  img: string;
}

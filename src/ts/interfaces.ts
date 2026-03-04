export interface GameSettings {
  theme: "code" | "foods";
  player: "blue" | "orange";
  boardSize: "16" | "24" | "36";
}

export interface Card {
  name: string;
  img: string;
}

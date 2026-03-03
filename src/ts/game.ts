import "../styles/main.scss";
import { GameSettings } from "./interfaces";

class Game {
  constructor() {
    this.getCurrentSettings();
  }

  private getCurrentSettings() {
    const currentSettings = sessionStorage.getItem("gameSettings");
    if (currentSettings) {
      const gameSettings = JSON.parse(currentSettings) as GameSettings;
      console.log(gameSettings);
    }
  }
}

const game = new Game();

import "../styles/main.scss";
import { GameSettings } from "./interfaces";

class Game {
  currentSettings: GameSettings = {
    theme: "code",
    player: null,
    boardSize: null,
  };

  constructor() {
    this.getGameSettings();
    this.applyTheme();
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
}

const game = new Game();

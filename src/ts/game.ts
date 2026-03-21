import "../styles/main.scss";
import { GameSettings } from "./interfaces";
import { Board } from "./board";
import { updateSpanText } from "./utils";
import { gameOverTemplate } from "./templates";

class Game {
  currentSettings!: GameSettings;
  currentPlayer: GameSettings["player"];
  board: Board;
  winner: "blue" | "orange" | "tie" = "tie";
  score = {
    blue: 0,
    orange: 0,
  };

  /**
   * Initializes the game by loading the settings, applying the theme, setting up the board with its
   * callbacks and initializing the dialog listeners.
   */
  constructor() {
    this.getGameSettings();
    this.currentPlayer = this.currentSettings.player;
    this.applyTheme();
    this.board = new Board(this.currentSettings);
    this.board.onMatch = () => this.updateScore();
    this.board.onMismatch = () => this.switchPlayer();
    this.board.onGameOver = () => this.handleGameOver();
    this.board.initBoard();
    this.initDialogListeners();
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
    this.initPlayerIcon();
  }

  /**
   * Sets the initial current player icon based on the current theme and player.
   */
  private initPlayerIcon(): void {
    const icon = document.querySelector<HTMLElement>("#current-player");
    const wrapper = document.querySelector<HTMLElement>(".player__icon__wrapper");
    if (!icon || !wrapper) return;

    if (this.currentSettings.theme === "code") {
      icon.classList.add(`player__icon--${this.currentPlayer}`);
    } else {
      icon.classList.add("player__icon--white");
      wrapper.classList.add(`player__icon__wrapper--${this.currentPlayer}`);
    }
  }

  /**
   * Switches the current player and updates the player icon accordingly.
   */
  private switchPlayer(): void {
    this.currentPlayer = this.currentPlayer === "blue" ? "orange" : "blue";
    const icon = document.querySelector<HTMLElement>("#current-player");
    const wrapper = document.querySelector<HTMLElement>(".player__icon__wrapper");
    if (!icon || !wrapper) return;

    if (this.currentSettings.theme === "code") {
      this.updateCodeThemeCurrentPlayerIcon(icon);
    } else {
      this.updateCurrentPlayerIcon(icon, wrapper);
    }
  }

  /**
   * Updates the current player icon for the "code" theme.
   *
   * @param icon - The icon element
   */
  private updateCodeThemeCurrentPlayerIcon(icon: HTMLElement): void {
    icon.classList.remove("player__icon--blue", "player__icon--orange");
    icon.classList.add(`player__icon--${this.currentPlayer}`);
  }

  /**
   * Updates the current player icon.
   *
   * @param icon - The icon element
   * @param wrapper - The wrapper element
   */
  private updateCurrentPlayerIcon(icon: HTMLElement, wrapper: HTMLElement): void {
    icon.classList.add("player__icon--white");
    wrapper.classList.remove("player__icon__wrapper--blue", "player__icon__wrapper--orange");
    wrapper.classList.add(`player__icon__wrapper--${this.currentPlayer}`);
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
   * Handles game over
   */
  private handleGameOver(): void {
    this.setWinner();

    setTimeout(() => {
      this.showFinalScore();
      setTimeout(() => {
        this.showWinnerScreen();
      }, 2000);
    }, 1000);
  }

  /**
   * Sets the winner.
   */
  private setWinner(): void {
    if (this.score.blue > this.score.orange) {
      this.winner = "blue";
    } else if (this.score.orange > this.score.blue) {
      this.winner = "orange";
    } else {
      this.winner = "tie";
    }
  }

  /**
   * Shows the winner screen.
   */
  private showWinnerScreen(): void {
    document.querySelector(".winner__overlay")?.classList.add("is-visible");
  }

  /**
   * Shows the final score.
   */
  private showFinalScore() {
    document.body.classList.add("game-over");
    const game = document.getElementById("game");
    if (!game) return;
    game.innerHTML = gameOverTemplate(this.score.blue, this.score.orange, this.winner, this.currentSettings.theme);
  }

  /**
   * Initializes the dialog event listeners for opening and closing the dialog, and quitting the game.
   */
  private initDialogListeners(): void {
    const dialog = document.querySelector<HTMLDialogElement>("dialog");
    if (!dialog) return;

    document.querySelector("#show-btn")?.addEventListener("click", () => {
      dialog.showModal();
    });

    document.querySelector("#close-btn")?.addEventListener("click", () => {
      dialog.close();
    });

    document.querySelector("#exit-game-btn")?.addEventListener("click", () => {
      sessionStorage.removeItem("gameSettings");
      window.location.href = "settings.html";
    });
  }
}

const game = new Game();

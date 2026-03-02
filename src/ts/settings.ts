import "../styles/main.scss";
import "../styles/components/_buttons.scss";

interface GameSettings {
  theme: "code" | "foods";
  player: "blue" | "orange" | null;
  boardSize: "16" | "24" | "36" | null;
}

class Settings {
  currentSettings: GameSettings = {
    theme: "code",
    player: null,
    boardSize: null,
  };

  constructor() {
    this.init();
  }

  /**
   * Initializes Event Listeners for changes an hovering.
   */
  private init(): void {
    this.initThemeOnHoverListeners();

    this.initOnChangeListener("theme", (value) => {
      this.currentSettings.theme = value as "code" | "foods";
    });

    this.initOnChangeListener("player", (value) => {
      this.currentSettings.player = value as "blue" | "orange";
    });

    this.initOnChangeListener("boardSize", (value) => {
      this.currentSettings.boardSize = value as "16" | "24" | "36";
    });
  }

  /**
   * Initializes a mouseouver and mouseout event listeners for theme labels.
   */
  private initThemeOnHoverListeners(): void {
    const themeLabels = document.querySelectorAll<HTMLLabelElement>(".settings__inputs__container fieldset:first-child label");
    themeLabels.forEach((label) => {
      label.addEventListener("mouseover", () => {
        const inputValue = label.querySelector("input")?.value;
        if (inputValue) {
          this.updateThumbnail(inputValue);
        }
      });
      label.addEventListener("mouseout", () => {
        this.updateThumbnail(this.currentSettings.theme);
      });
    });
  }

  /**
   * Initiates an event listener for input changes.
   *
   * @param name - The input group name
   * @param onChangeCallback - Callback invoked with the new value when the input changes
   */
  private initOnChangeListener(name: string, onChangeCallback: (value: string) => void): void {
    const inputs = document.querySelectorAll<HTMLInputElement>(`input[name='${name}']`);
    inputs.forEach((input) => {
      input.addEventListener("change", () => {
        onChangeCallback(input.value);
        this.updateStartButton();
        this.updateSelectionDisplay();
      });
    });
  }

  /**
   * Updates the thumbnail image depending on the current input value.
   *
   * @param inputValue - The theme value used to buidl the thumbnail image path ("code" or "foods")
   */
  private updateThumbnail(inputValue: string): void {
    const thumbnail = document.querySelector<HTMLImageElement>(".thumbnail");
    if (thumbnail) {
      thumbnail.src = `/memory-game/assets/img/thumbnails/${inputValue}_theme_thumbnail.png`;
    }
  }

  /**
   * Enables the start button when player and board size are selected, otherwise disables it.
   */
  private updateStartButton(): void {
    const startButton = document.querySelector<HTMLButtonElement>("#start-button");
    if (startButton) {
      if (this.areSettingsComplete()) {
        startButton.disabled = false;
      } else {
        startButton.disabled = true;
      }
    }
  }

  /**
   * Updates the displayed selections.
   */
  private updateSelectionDisplay(): void {
    this.updateSpanText("#selection-theme", `${this.currentSettings.theme} theme`);

    if (this.currentSettings.player) {
      this.updateSpanText("#selection-player", `${this.currentSettings.player} Player`);
    }

    if (this.currentSettings.boardSize) {
      this.updateSpanText("#selection-boardSize", `Board-${this.currentSettings.boardSize}-Cards`);
    }

    this.updateDividerDisplay();
  }

  /**
   * Toggles the divider appearance based on whether all settings are complete.
   */
  private updateDividerDisplay(): void {
    const container = document.querySelector(".settings__selection");
    container?.classList.toggle("settings--complete", this.areSettingsComplete());
  }

  /**
   * Updates the span text of the element.
   *
   * @param selector - CSS selector of the span element to update
   * @param text - Text to be updated in the span
   */
  private updateSpanText(selector: string, text: string | null): void {
    const element = document.querySelector<HTMLElement>(selector);
    if (element && text) {
      element.innerText = text;
    }
  }

  /**
   * Checks if the player and board size are set.
   *
   * @returns - True if player and board size are set, otherwise false
   */
  private areSettingsComplete(): boolean {
    return this.currentSettings.player !== null && this.currentSettings.boardSize !== null;
  }
}

const settings = new Settings();

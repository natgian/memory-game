import "../styles/main.scss";
import "../styles/components/_buttons.scss";

class Settings {
  theme: "code" | "foods";
  player: "blue" | "orange";
  boardSize: "16" | "24" | "36";

  constructor() {
    this.theme = "code";
    this.player = "blue";
    this.boardSize = "16";
    this.init();
  }

  /**
   * Initializes Event Listeners for changes an hovering.
   */
  private init(): void {
    this.initThemeOnHoverListeners();

    this.initOnChangeListener("theme", (value) => {
      this.theme = value as "code" | "foods";
    });

    this.initOnChangeListener("player", (value) => {
      this.player = value as "blue" | "orange";
    });

    this.initOnChangeListener("boardSize", (value) => {
      this.boardSize = value as "16" | "24" | "36";
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
        this.updateThumbnail(this.theme);
      });
    });
  }

  /**
   * Initiates an event listener for input changes.
   *
   * @param name - The input group name
   * @param onChange - Callback invoked with the new value when the input changes
   */
  private initOnChangeListener(name: string, onChange: (value: string) => void): void {
    const inputs = document.querySelectorAll<HTMLInputElement>(`input[name='${name}']`);
    inputs.forEach((input) => {
      input.addEventListener("change", () => {
        onChange(input.value);
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
}

const settings = new Settings();

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

  private init(): void {
    this.initThemeOnChangeListener();
    this.initThemeOnHoverListeners();
  }

  private initThemeOnHoverListeners(): void {
    const themeLabels = document.querySelectorAll<HTMLLabelElement>(".settings__inputs fieldset:first-child label");
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

  private initThemeOnChangeListener(): void {
    const themeInputs = document.querySelectorAll<HTMLInputElement>("input[name='theme']");
    themeInputs.forEach((input) => {
      input.addEventListener("change", () => {
        const inputValue = input.value as "code" | "foods";
        this.theme = inputValue;
        this.updateThumbnail(inputValue);
      });
    });
  }

  private updateThumbnail(inputValue: string): void {
    const thumbnail = document.querySelector<HTMLImageElement>(".thumbnail");
    if (thumbnail) {
      thumbnail.src = `src/assets/img/thumbnails/${inputValue}_theme_thumbnail.png`;
    }
  }
}

const settings = new Settings();

/// <reference types="youtube" />

declare module "youtube-player" {
  class Player extends YT.Player {
    on<T extends YT.PlayerEvent>(eventName: string, handler: (event: T) => void): void;
  }

  export default Player;
}

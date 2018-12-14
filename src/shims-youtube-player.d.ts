declare module "youtube-player" {
  export interface PlayerEvent {
    data: any;
  }

  class Player {
    constructor(root: Element, options: any);

    on<T extends PlayerEvent>(eventName: string, handler: (event: T) => void): void;
    loadVideoById(id: string): Promise<any>;
    playVideo(): Promise<any>;
    pauseVideo(): Promise<any>;
    getDuration(): Promise<number>;
  }

  export default Player;
}

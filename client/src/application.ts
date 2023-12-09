import "htmx.org";

import HelloWorldScene from "@/scenes/HelloWorldScene.ts";
import Phaser from "phaser";

const appElement = document.querySelector<HTMLElement>("#app")!;
const width = document.querySelector<HTMLElement>("body")!.clientWidth;
const height = document.querySelector<HTMLElement>("body")!.clientHeight;

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.WEBGL,
  parent: appElement,
  width: width,
  height: height,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { x: 0, y: 1 }
    }
  },
  scene: [HelloWorldScene]
}

export default new Phaser.Game(config)

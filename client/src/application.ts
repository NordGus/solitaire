import "htmx.org";

import HelloWorldScene from "@/scenes/HelloWorldScene.ts";
import Phaser from "phaser";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.WEBGL,
  parent: document.querySelector<HTMLElement>("#app")!,
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { x: 0, y: 1 }
    }
  },
  scene: [HelloWorldScene]
}

export default new Phaser.Game(config)

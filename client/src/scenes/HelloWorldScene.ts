import Phaser from "phaser";

export default class HelloWorldScene extends Phaser.Scene {
  constructor() {
    super("HelloWorld");
  }

  preload(): void {
    this.load.setBaseURL('https://labs.phaser.io')

    this.load.image('sky', 'assets/skies/space3.png')
    this.load.image('logo', 'assets/sprites/phaser3-logo.png')
    this.load.image('red', 'assets/particles/red.png')
  }

  create(): void {
    this.add.image(400, 300, "sky")

    const particleEmitter = this.add.particles(0, 0, "red", {
      speed: 100,
      scale: { start: 1, end: 0 },
      blendMode: Phaser.BlendModes.ADD
    })

    const logo = this.physics.add.image(400, 100, "logo")
      .setVelocity(100, 200)
      .setBounce(1, 1)
      .setCollideWorldBounds(true)

    particleEmitter.startFollow(logo)
  }
}

/* eslint-disable func-style */

let dog;

class StartScene extends Phaser.Scene {
  preload() {
    this.load.image("doggy", "assets/doggy.png");

    this.load.image("blocks", "assets/maps/blocks.png");
    this.load.image("floor", "assets/maps/floor.png");
    this.load.tilemapTiledJSON("map1", "assets/maps/map1.json");
  }

  create() {
    this.map = this.make.tilemap({ key: "map1" });
    //this.map = this.add.tilemap("map1");
    const tileset = this.map.addTilesetImage("blocks", "blocks");
    const tileset2 = this.map.addTilesetImage("floor", "floor");

    this.blocksLayer = this.map.createStaticLayer("blocks", tileset);
    this.floorLayer = this.map.createStaticLayer("floor", tileset2);

    //character loading
    this.player = this.physics.add.image(640, 640, "doggy");
    //character movment
    this.input.keyboard.on("keydown-A", () => {
      this.player.body.setVelocityX(-400);
    });

    this.input.keyboard.on("keydown-D", () => {
      this.player.body.setVelocityX(400);
    });

    this.input.keyboard.on("keydown-W", () => {
      this.player.body.setVelocityY(-400);
    });

    this.input.keyboard.on("keydown-S", () => {
      this.player.body.setVelocityY(400);
    });
  }

  update() {}
}

const config = {
  type: Phaser.CANVAS,
  width: 1024,
  height: 1024,
  physics: {
    arcade: {},
    default: "arcade"
  },
  scene: [StartScene]
};

const game = new Phaser.Game(config);

/* eslint-disable func-style */
let up;
let left;
let right;
let down;
let dog;

class StartScene extends Phaser.Scene {
  preload() {
    this.load.image("white", "assets/characters/white.png");

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
    this.player = this.physics.add.image(640, 640, "white");

    up = this.input.keyboard.addKey("W");
    left = this.input.keyboard.addKey("A");
    right = this.input.keyboard.addKey("D");
    down = this.input.keyboard.addKey("S");
  }

  update() {
    //movement for characters
    if (this.input.keyboard.checkDown(up, 0)) {
      this.player.y -= 4;
    } else if (this.input.keyboard.checkDown(left, 0)) {
      this.player.x -= 4;
    } else if (this.input.keyboard.checkDown(right, 0)) {
      this.player.x += 4;
    } else if (this.input.keyboard.checkDown(down, 0)) {
      this.player.y += 4;
    }
  }
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

/* eslint-disable func-style */
const config = {
  type: Phaser.AUTO,
  width: 1500,
  height: 1024,
  physics: {
    default: "arcade",
    arcade: { debug: false }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

const game = new Phaser.Game(config);

let up;
let left;
let right;
let down;

function preload() {
  this.load.image("white", "assets/characters/white.png");

  this.load.tilemapTiledJSON("map1", "assets/maps/map1.json");
  this.load.image("floor", "assets/maps/floor.png");
  this.load.image("blocks", "assets/maps/blocks.png");
}

function create() {
  this.socket = io("/game");
  this.map = this.add.tilemap("map1");

  let tileset = this.map.addTilesetImage("blocks", "blocks");
  let tileset2 = this.map.addTilesetImage("floor", "floor");

  this.floorLayer = this.map.createStaticLayer("floor", [tileset2], 0, 0);
  this.blocksLayer = this.map.createStaticLayer("blocks", [tileset], 0, 0);

  this.player = this.physics.add.sprite(96, 96, "white");
  //collision for world bounds
  this.player.setCollideWorldBounds(true);

  this.blocksLayer.setCollisionByProperty({ collides: true });
  this.physics.add.collider(this.player, this.blocksLayer);

  up = this.input.keyboard.addKey("W");
  left = this.input.keyboard.addKey("A");
  right = this.input.keyboard.addKey("D");
  down = this.input.keyboard.addKey("S");

  this.socket.on("playerMovement", data => {
    console.log(data);
  });
}

const speed = 200;
function update() {
  // Stop any previous movement from the last frame
  this.player.body.setVelocity(0);
  // Horizontal movement
  if (this.input.keyboard.checkDown(left, 0)) {
    this.player.body.setVelocityX(-200);
  } else if (this.input.keyboard.checkDown(right, 0)) {
    this.player.body.setVelocityX(200);
  }
  // Vertical movement
  if (this.input.keyboard.checkDown(up, 0)) {
    this.player.body.setVelocityY(-200);
  } else if (this.input.keyboard.checkDown(down, 0)) {
    this.player.body.setVelocityY(200);
  }
  // Normalize and scale the velocity so that player can't move faster along a diagonal
  this.player.body.velocity.normalize().scale(speed);
}

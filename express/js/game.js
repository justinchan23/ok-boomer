/* eslint-disable func-style */
const config = {
  type: Phaser.AUTO,
  width: 1500,
  height: 1024,
  physics: {
    default: "arcade",
    arcade: { debug: SVGComponentTransferFunctionElement }
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
  this.load.image("chests", "assets/maps/chests.png");

  this.load.spritesheet({
    key: "bomb",
    url: "assets/bombs/bomb.png",
    frameConfig: {
      frameWidth: 46,
      frameHeight: 46,
      startFrame: 0,
      endFrame: 1
    }
  });
  this.load.spritesheet({
    key: "explosion",
    url: "assets/bombs/explosion.png",
    frameConfig: {
      frameWidth: 64,
      frameHeight: 64,
      startFrame: 0,
      endFrame: 16
    }
  });
}

function create() {
  this.map = this.add.tilemap("map1");

  let blockSet = this.map.addTilesetImage("blocks", "blocks");
  let floorSet = this.map.addTilesetImage("floor", "floor");
  let chestSet = this.map.addTilesetImage("chests", "chests");

  this.blocksLayer = this.map.createStaticLayer("blocks", [blockSet], 0, 0);
  this.floorLayer = this.map.createStaticLayer("floor", [floorSet], 0, 0);
  this.chestLayer = this.map.createStaticLayer("chest", [chestSet], 0, 0);

  this.player = this.physics.add.sprite(96, 96, "white");

  //collision for world bounds
  this.player.setCollideWorldBounds(true);

  this.blocksLayer.setCollisionByProperty({ collides: true });
  this.chestLayer.setCollisionByProperty({ collides: true });

  this.physics.add.collider(this.player, this.blocksLayer);
  this.physics.add.collider(this.player, this.chestLayer);

  up = this.input.keyboard.addKey("W");
  left = this.input.keyboard.addKey("A");
  right = this.input.keyboard.addKey("D");
  down = this.input.keyboard.addKey("S");
  space = this.input.keyboard.addKey("SPACE");

  //bomb animation
  this.anims.create({
    key: "boom",
    frames: this.anims.generateFrameNumbers("bomb", { start: 0, end: 1 }),
    frameRate: 2,
    repeat: 2
  });

  //explosion animation
  this.anims.create({
    key: "fire",
    frames: this.anims.generateFrameNumbers("explosion", { start: 0, end: 16 }),
    frameRate: 16,
    repeat: 0
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

  // Spawning Bomb
  if (this.input.keyboard.checkDown(space, 99999)) {
    this.bomb = this.physics.add
      .sprite(this.player.x, this.player.y, "bomb")
      .setImmovable()
      .setScale(1.3)
      .setOrigin(0.5, 0.5);

    this.bomb.play("boom", true);

    let bomb = this.bomb;

    this.bomb.once(Phaser.Animations.Events.SPRITE_ANIMATION_COMPLETE, () => {
      bomb.destroy();

      //creating explosion animation
      this.explosion = this.physics.add
        .sprite(bomb.x, bomb.y, "fire")
        .setImmovable()
        .setScale(1)
        .setOrigin(0.5, 0.5);

      this.explosion.play("fire", true);
      let explosion = this.explosion;
      this.explosion.once(
        Phaser.Animations.Events.SPRITE_ANIMATION_COMPLETE,
        () => {
          explosion.destroy();
        }
      );
    });
    this.physics.add.collider(this.player, this.bomb);
  }
}

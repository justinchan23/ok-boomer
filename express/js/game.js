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
let space;

function preload() {
  this.load.image("white", "assets/characters/white.png");
  this.load.audio({
    key: "gamemusic",
    url: "assets/audio/music.mp3",
    config: {
      loop: true
    }
  });

  this.load.tilemapTiledJSON("map1", "assets/maps/map1.json");
  this.load.image("floor", "assets/maps/floor.png");
  this.load.image("blocks", "assets/maps/blocks.png");
  this.load.spritesheet("chest", "assets/maps/chests.png", {
    frameWidth: 64,
    frameHeight: 64
  });

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
  this.socket = io("/game");
  const music = this.sound.add("gamemusic");
  music.loop = true;
  // music.play();

  this.map = this.add.tilemap("map1");

  let blockSet = this.map.addTilesetImage("blocks", "blocks");
  let floorSet = this.map.addTilesetImage("floor", "floor");
  // let chestSet = this.map.addTilesetImage("chests", "chests");

  this.blocksLayer = this.map.createDynamicLayer("blocks", [
    blockSet,
    floorSet
  ]);
  this.blocksLayer.setCollisionByProperty({ collides: true });
  // this.chestLayer = this.map.createDynamicLayer("chest", [chestSet], 0, 0);

  this.player = this.physics.add.sprite(96, 96, "white").setSize(64, 64);
  this.chest = this.map.createFromObjects("chest", 41, { key: "chest" });

  //collision for world bounds
  this.player.setCollideWorldBounds(true);

  this.physics.add.collider(this.player, this.blocksLayer);

  const chest = this.physics.add.group(this.chest);
  this.physics.world.enable(chest);
  this.physics.add.collider(this.player, chest);
  this.chest.forEach(c => c.body.setImmovable(true));

  up = this.input.keyboard.addKey("W");
  left = this.input.keyboard.addKey("A");
  right = this.input.keyboard.addKey("D");
  down = this.input.keyboard.addKey("S");
  space = this.input.keyboard.addKey("SPACE");

  //bomb animation
  this.anims.create({
    key: "boom",
    frames: this.anims.generateFrameNumbers("bomb", { start: 0, end: 1 }),
    frameRate: 3,
    repeat: 2
  });

  //explosion animation
  this.anims.create({
    key: "fire",
    frames: this.anims.generateFrameNumbers("explosion", { start: 0, end: 16 }),
    frameRate: 30,
    repeat: 0
  });

  const movePlayer = dir => {
    this.player.body.setVelocity(0);

    if (dir === "Left") {
      this.player.body.setVelocityX(-200);
    } else if (dir === "Right") {
      this.player.body.setVelocityX(200);
    } else if (dir === "Up") {
      this.player.body.setVelocityY(-200);
    } else if (dir === "Down") {
      this.player.body.setVelocityY(200);
    }
  };

  this.socket.on("playerMovement", data => {
    console.log(data);
    movePlayer(data.move);
  });

  // Stop any previous movement from the last frame
  this.socket.on("playerMovementEnd", data => {
    this.player.body.setVelocity(0);
  });

  this.socket.on("dropBomb", data => {
    console.log(data);
  });
}

const speed = 200;

function update() {
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

  //makes sure players displays above bomb
  this.player.depth = 1;

  //calculates the center of the tile player is standing on
  const calculateCenterTileXY = playerLocation => {
    return 32 - (playerLocation % 64) + playerLocation;
  };
  // Spawning Bomb
  if (this.input.keyboard.checkDown(space, 99999)) {
    this.bomb = this.physics.add
      .sprite(
        calculateCenterTileXY(this.player.x),
        calculateCenterTileXY(this.player.y),
        "bomb"
      )
      .setImmovable()
      .setSize(64, 64);
    // .setOrigin(0.5, 0.5);

    this.bomb.play("boom", true);

    let bomb = this.bomb;

    this.bomb.once(Phaser.Animations.Events.SPRITE_ANIMATION_COMPLETE, () => {
      bomb.destroy();

      //creating explosion animation
      let bombPower = 1;
      for (let blastLength = 0; blastLength <= bombPower; blastLength++) {
        this.explosion = this.physics.add
          .sprite(bomb.x + blastLength * 64, bomb.y, "fire")
          .setImmovable();
        this.explosion.play("fire", true);
        let explosion = this.explosion;
        this.explosion.once(
          Phaser.Animations.Events.SPRITE_ANIMATION_COMPLETE,
          () => {
            explosion.destroy();
          }
        );

        function checkOverlap(sprite, explosion) {
          var boundsA = sprite.getBounds();
          var boundsB = explosion.getBounds();
          return Phaser.Geom.Rectangle.Overlaps(boundsA, boundsB);
        }
        for (chest of this.chest) {
          if (checkOverlap(chest, explosion)) {
            chest.destroy();
          }
        }
      }
      // for (let blastLength = 0; blastLength <= bombPower; blastLength++) {
      //   this.explosion = this.physics.add
      //     .sprite(bomb.x, bomb.y + blastLength * 64, "fire")
      //     .setImmovable()
      //     .setSize(64, 64);
      //   this.explosion.play("fire", true);
      //   let explosion = this.explosion;
      //   this.explosion.once(
      //     Phaser.Animations.Events.SPRITE_ANIMATION_COMPLETE,
      //     () => {
      //       explosion.destroy();
      //     }
      //   );
      // }
      // for (let blastLength = 0; blastLength <= bombPower; blastLength++) {
      //   this.explosion = this.physics.add
      //     .sprite(bomb.x - blastLength * 64, bomb.y, "fire")
      //     .setImmovable()
      //     .setSize(64, 64);
      //   this.explosion.play("fire", true);
      //   let explosion = this.explosion;
      //   this.explosion.once(
      //     Phaser.Animations.Events.SPRITE_ANIMATION_COMPLETE,
      //     () => {
      //       explosion.destroy();
      //     }
      //   );
      // }
      // for (let blastLength = 0; blastLength <= bombPower; blastLength++) {
      //   this.explosion = this.physics.add
      //     .sprite(bomb.x, bomb.y - blastLength * 64, "fire")
      //     .setImmovable()
      //     .setSize(64, 64);
      //   this.explosion.play("fire", true);
      //   let explosion = this.explosion;
      //   this.explosion.once(
      //     Phaser.Animations.Events.SPRITE_ANIMATION_COMPLETE,
      //     () => {
      //       explosion.destroy();
      //     }
      //   );
      // }
    });

    this.physics.add.collider(this.player, this.bomb);
  }
}

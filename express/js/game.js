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
  this.socket = io("/game");
  const music = this.sound.add("gamemusic");
  music.loop = true;
  // music.play();

  this.map = this.add.tilemap("map1");

  let blockSet = this.map.addTilesetImage("blocks", "blocks");
  let floorSet = this.map.addTilesetImage("floor", "floor");
  let chestSet = this.map.addTilesetImage("chests", "chests");

  this.blocksLayer = this.map.createStaticLayer("blocks", [blockSet], 0, 0);
  this.floorLayer = this.map.createStaticLayer("floor", [floorSet], 0, 0);
  this.chestLayer = this.map.createStaticLayer("chest", [chestSet], 0, 0);

  this.player = this.physics.add.sprite(96, 96, "white").setSize(64, 64);

  //collision for world bounds
  this.player.setCollideWorldBounds(true);

  this.blocksLayer.setCollisionByProperty({ collides: true });
  this.chestLayer.setCollisionByProperty({ collides: true });

  // this.physics.add.collider(this.player, this.blocksLayer);
  // this.physics.add.collider(this.player, this.chestLayer);

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

  this.socket.on("allPlayers", data => {
    console.log(data);
  });
  const movePlayer = data => {
    if (data.move === "Left") {
      this.player[data.playerId].body.setVelocityX(-200);
    } else if (data.move === "Right") {
      this.player[data.playerId].body.setVelocityX(200);
    } else if (data.move === "Up") {
      this.player[data.playerId].body.setVelocityY(-200);
    } else if (data.move === "Down") {
      this.player[data.playerId].body.setVelocityY(200);
    }

    this.player[data.playerId].body.velocity.normalize().scale(speed);
  };

  const dropBombs = data => {
    this.bomb = this.physics.add
      .sprite(
        calculateCenterTileXY(this.player[data.playerId].x),
        calculateCenterTileXY(this.player[data.playerId].y),
        "bomb"
      )
      .setImmovable()
      .setSize(64, 64)
      .setOrigin(0.5, 0.5);

    this.bomb.play("boom", true);

    let bomb = this.bomb;

    this.bomb.once(Phaser.Animations.Events.SPRITE_ANIMATION_COMPLETE, () => {
      bomb.destroy();

      // const explosionRadius = (bombXY, bombPower) => {
      //   return bombXY + bombPower;
      // };

      //creating explosion animation
      let bombPower = 50;
      for (let blastLength = 0; blastLength <= bombPower; blastLength++) {
        this.explosion = this.physics.add
          .sprite(bomb.x + blastLength * 64, bomb.y, "fire")
          .setImmovable()
          .setSize(64, 64);
        this.explosion.play("fire", true);
        let explosion = this.explosion;
        this.explosion.once(
          Phaser.Animations.Events.SPRITE_ANIMATION_COMPLETE,
          () => {
            explosion.destroy();
          }
        );
      }
      for (let blastLength = 0; blastLength <= bombPower; blastLength++) {
        this.explosion = this.physics.add
          .sprite(bomb.x, bomb.y + blastLength * 64, "fire")
          .setImmovable()
          .setSize(64, 64);
        this.explosion.play("fire", true);
        let explosion = this.explosion;
        this.explosion.once(
          Phaser.Animations.Events.SPRITE_ANIMATION_COMPLETE,
          () => {
            explosion.destroy();
          }
        );
      }
      for (let blastLength = 0; blastLength <= bombPower; blastLength++) {
        this.explosion = this.physics.add
          .sprite(bomb.x - blastLength * 64, bomb.y, "fire")
          .setImmovable()
          .setSize(64, 64);
        this.explosion.play("fire", true);
        let explosion = this.explosion;
        this.explosion.once(
          Phaser.Animations.Events.SPRITE_ANIMATION_COMPLETE,
          () => {
            explosion.destroy();
          }
        );
      }
      for (let blastLength = 0; blastLength <= bombPower; blastLength++) {
        this.explosion = this.physics.add
          .sprite(bomb.x, bomb.y - blastLength * 64, "fire")
          .setImmovable()
          .setSize(64, 64);
        this.explosion.play("fire", true);
        let explosion = this.explosion;
        this.explosion.once(
          Phaser.Animations.Events.SPRITE_ANIMATION_COMPLETE,
          () => {
            explosion.destroy();
          }
        );
      }
    });

    this.physics.add.collider(this.player, this.bomb);
  };

  this.socket.on("playerMovement", data => {
    console.log(data);
    movePlayer(data);
  });
  this.socket.on("playerMovementEnd", data => {
    this.player[data.playerId].body.setVelocity(0);
  });

  this.socket.on("dropBomb", data => {
    console.log(data);
    dropBombs(data);
  });

  this.socket.on("newPlayer", data => {
    console.log(data);
    this.player[data.playerId] = this.physics.add
      .sprite(928, 96, "white")
      .setSize(64, 64);
  });
}

const speed = 200;

function update() {
  // // Stop any previous movement from the last frame
  // // this.player.body.setVelocity(0);
  // // Horizontal movement
  // if (this.input.keyboard.checkDown(left, 0)) {
  //   this.player.body.setVelocityX(-200);
  // } else if (this.input.keyboard.checkDown(right, 0)) {
  //   this.player.body.setVelocityX(200);
  // }
  // // Vertical movement
  // if (this.input.keyboard.checkDown(up, 0)) {
  //   this.player.body.setVelocityY(-200);
  // } else if (this.input.keyboard.checkDown(down, 0)) {
  //   this.player.body.setVelocityY(200);
  // }
  // // Normalize and scale the velocity so that player can't move faster along a diagonal
  // this.player.body.velocity.normalize().scale(speed);
  // //makes sure players displays above bomb
  // this.player.depth = 1;
  // // Spawning Bomb
  // if (this.input.keyboard.checkDown(space, 99999)) {
  //   this.bomb = this.physics.add
  //     .sprite(
  //       calculateCenterTileXY(this.player.x),
  //       calculateCenterTileXY(this.player.y),
  //       "bomb"
  //     )
  //     .setImmovable()
  //     .setSize(64, 64)
  //     .setOrigin(0.5, 0.5);
  //   this.bomb.play("boom", true);
  //   let bomb = this.bomb;
  //   this.bomb.once(Phaser.Animations.Events.SPRITE_ANIMATION_COMPLETE, () => {
  //     bomb.destroy();
  //     // const explosionRadius = (bombXY, bombPower) => {
  //     //   return bombXY + bombPower;
  //     // };
  //     //creating explosion animation
  //     let bombPower = 50;
  //     for (let blastLength = 0; blastLength <= bombPower; blastLength++) {
  //       this.explosion = this.physics.add
  //         .sprite(bomb.x + blastLength * 64, bomb.y, "fire")
  //         .setImmovable()
  //         .setSize(64, 64);
  //       this.explosion.play("fire", true);
  //       let explosion = this.explosion;
  //       this.explosion.once(
  //         Phaser.Animations.Events.SPRITE_ANIMATION_COMPLETE,
  //         () => {
  //           explosion.destroy();
  //         }
  //       );
  //     }
  //     for (let blastLength = 0; blastLength <= bombPower; blastLength++) {
  //       this.explosion = this.physics.add
  //         .sprite(bomb.x, bomb.y + blastLength * 64, "fire")
  //         .setImmovable()
  //         .setSize(64, 64);
  //       this.explosion.play("fire", true);
  //       let explosion = this.explosion;
  //       this.explosion.once(
  //         Phaser.Animations.Events.SPRITE_ANIMATION_COMPLETE,
  //         () => {
  //           explosion.destroy();
  //         }
  //       );
  //     }
  //     for (let blastLength = 0; blastLength <= bombPower; blastLength++) {
  //       this.explosion = this.physics.add
  //         .sprite(bomb.x - blastLength * 64, bomb.y, "fire")
  //         .setImmovable()
  //         .setSize(64, 64);
  //       this.explosion.play("fire", true);
  //       let explosion = this.explosion;
  //       this.explosion.once(
  //         Phaser.Animations.Events.SPRITE_ANIMATION_COMPLETE,
  //         () => {
  //           explosion.destroy();
  //         }
  //       );
  //     }
  //     for (let blastLength = 0; blastLength <= bombPower; blastLength++) {
  //       this.explosion = this.physics.add
  //         .sprite(bomb.x, bomb.y - blastLength * 64, "fire")
  //         .setImmovable()
  //         .setSize(64, 64);
  //       this.explosion.play("fire", true);
  //       let explosion = this.explosion;
  //       this.explosion.once(
  //         Phaser.Animations.Events.SPRITE_ANIMATION_COMPLETE,
  //         () => {
  //           explosion.destroy();
  //         }
  //       );
  //     }
  //   });
  //   this.physics.add.collider(this.player, this.bomb);
  // }
}
//calculates the center of the tile player is standing on
const calculateCenterTileXY = playerLocation => {
  return 32 - (playerLocation % 64) + playerLocation;
};

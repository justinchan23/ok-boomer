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

this.socket.on("playerMovement", data => {
  console.log(data);
  movePlayer(data);
});

// Stop any previous movement from the last frame
this.socket.on("playerMovementEnd", data => {
  this.player[data.playerId].body.setVelocity(0);
});

this.socket.on("dropBomb", data => {
  console.log(data);
  this.bomb = this.physics.add
    .sprite(
      calculateCenterTileXY(this.player[data.playerId].x),
      calculateCenterTileXY(this.player[data.playerId].y),
      "bomb"
    )
    .setImmovable()
    .setSize(64, 64);
  // .setOrigin(0.5, 0.5);
  this.physics.add.collider(this.player[data.playerId], this.bomb);

  this.bomb.play("boom", true);

  let bomb = this.bomb;

  //destory bomb after detonation animations
  this.bomb.once(Phaser.Animations.Events.SPRITE_ANIMATION_COMPLETE, () => {
    bomb.destroy();

    //bomb power level
    let bombPower = 2;

    //directions for bombs to spread
    const explosionDirection = [
      { x: 0, y: 0 },
      { x: 0, y: -1 },
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: -1, y: 0 }
    ];

    //checks overlaps with game objects and explosions
    function checkOverlap(gameObject, explosion) {
      if (!gameObject) {
        return false;
      }
      var boundsA = gameObject.getBounds();
      var boundsB = explosion.getBounds();
      return Phaser.Geom.Rectangle.Overlaps(boundsA, boundsB);
    }

    for (const direction of explosionDirection) {
      for (let blastLength = 0; blastLength <= bombPower; blastLength++) {
        const bombX = bomb.x + direction.x * blastLength * 64;
        const bombY = bomb.y + direction.y * blastLength * 64;

        let explosion = this.physics.add.sprite(bombX, bombY, "fire").setImmovable();

        if (checkOverlap(this.player[data.playerId], explosion)) {
          this.player[data.playerId].destroy();
        }
        //break if explosion collides with walls
        if (checkOverlap(this.wallMap[`${(bombX - 32) / 64},${(bombY - 32) / 64}`], explosion)) {
          explosion.destroy();
          break;
        }

        //plays explosion animation
        explosion.play("fire", true);

        //clears the explosion after animation is complete
        explosion.once(Phaser.Animations.Events.SPRITE_ANIMATION_COMPLETE, () => {
          explosion.destroy();
        });

        //checks for explosion-chest overlap and destorys chest
        if (checkOverlap(this.chestMap[`${(bombX - 32) / 64},${(bombY - 32) / 64}`], explosion)) {
          this.chestMap[`${(bombX - 32) / 64},${(bombY - 32) / 64}`].destroy();
          delete this.chestMap[`${(bombX - 32) / 64},${(bombY - 32) / 64}`];
          break;
        }
      }
    }
  });
});

this.socket.on("newPlayer", data => {
  console.log(data);
  this.player[data.playerId] = this.physics.add.sprite(data.spawnx, data.spawny, "white").setSize(64, 64);
  this.player[data.playerId].setCollideWorldBounds(true);
  this.player[data.playerId].depth = 1;

  this.physics.add.collider(this.player[data.playerId], chest);
  this.physics.add.collider(this.player[data.playerId], wall);
});

this.socket.on("disconnect", data => {
  console.log("player leaving");
  this.player[data].destroy();
});

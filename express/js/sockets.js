const movePlayer = data => {
  //down
  if ((data.angle >= 0 && data.angle < 22.5) || (data.angle < 359 && data.angle > 337.5)) {
    this.player[data.playerId].body.setVelocityY(200);
    //right/down
  } else if (data.angle >= 22.5 && data.angle < 67.5) {
    this.player[data.playerId].body.setVelocityX(200);
    this.player[data.playerId].body.setVelocityY(200);

    //right
  } else if (data.angle >= 67.5 && data.angle < 112.5) {
    this.player[data.playerId].body.setVelocityX(200);
    //right/up
  } else if (data.angle >= 112.5 && data.angle < 157.5) {
    this.player[data.playerId].body.setVelocityX(200);
    this.player[data.playerId].body.setVelocityY(-200);

    //up
  } else if (data.angle >= 157.5 && data.angle < 202.5) {
    this.player[data.playerId].body.setVelocityY(-200);

    //up/left
  } else if (data.angle >= 202.5 && data.angle < 247.5) {
    this.player[data.playerId].body.setVelocityX(-200);
    this.player[data.playerId].body.setVelocityY(-200);

    //left
  } else if (data.angle >= 247.5 && data.angle < 292.5) {
    this.player[data.playerId].body.setVelocityX(-200);

    //down/left
  } else if (data.angle >= 292.5 && data.angle < 337.5) {
    this.player[data.playerId].body.setVelocityX(-200);
    this.player[data.playerId].body.setVelocityY(200);
  }
};

this.socket.on("playerMovement", data => {
  movePlayer(data);
});

// Stop any previous movement from the last frame
this.socket.on("playerMovementEnd", data => {
  console.log(data);
  this.player[data.playerId].body.setVelocity(0);
});

this.socket.on("dropBomb", data => {
  console.log(data);
  if (this.player[data.playerId].body) {
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

          for (const player of players) {
            if (checkOverlap(this.player[player], explosion)) {
              this.player[player].destroy();
            }
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
  }
});

this.socket.on("newPlayer", data => {
  console.log(data);
  players.push(data.playerId);
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

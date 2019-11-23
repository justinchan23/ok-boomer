/* eslint-disable func-style */
const config = {
  type: Phaser.CANVAS,
  width: 1280,
  height: 720,
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

const game = new Phaser.Game(config);

let dog;

function preload() {
  this.load.image("doggy", "assets/doggy.png");
}

function create() {
  dog = this.add.image(400, 300, "doggy");

  this.input.keyboard.on("keydown-A", () => {
    dog.x -= 4;
  });

  this.input.keyboard.on("keydown-D", () => {
    dog.x += 4;
  });

  this.input.keyboard.on("keydown-W", () => {
    dog.y -= 4;
  });

  this.input.keyboard.on("keydown-S", () => {
    dog.y += 4;
  });
}

function update() {}

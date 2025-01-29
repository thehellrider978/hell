const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: { default: 'arcade', arcade: { gravity: { y: 0 }, debug: false } },
  scene: { preload, create, update }
};

let player;
let coffeePuddles;
let speed = 0;

function preload() {
  this.load.image('chair', 'assets/chairs/red_chair.png');
  this.load.image('coffee', 'assets/obstacles/coffee.png');
  this.load.audio('sip', 'assets/sounds/sip.mp3');
}

function create() {
  // Player (Office Chair)
  player = this.physics.add.sprite(400, 500, 'chair').setScale(0.5);
  
  // Coffee Puddles (Obstacles)
  coffeePuddles = this.physics.add.group();
  this.time.addEvent({
    delay: 2000,
    callback: () => {
      const coffee = coffeePuddles.create(Phaser.Math.Between(0, 800), 0, 'coffee');
      coffee.setVelocityY(100);
    },
    loop: true
  });

  // Keyboard Controls
  cursors = this.input.keyboard.createCursorKeys();
  
  // Sound Effects
  this.sound.add('sip');
}

function update() {
  // Chair Movement (Left/Right)
  if (cursors.left.isDown) {
    player.setVelocityX(-300);
    player.angle = -15; // Lean left
  } else if (cursors.right.isDown) {
    player.setVelocityX(300);
    player.angle = 15; // Lean right
  } else {
    player.setVelocityX(0);
    player.angle = 0;
  }

  // Coffee Splash Collision
  this.physics.add.overlap(player, coffeePuddles, (chair, coffee) => {
    coffee.disableBody(true, true); // Remove coffee
    this.sound.play('sip'); // Funny "sip" sound instead of crash
    chair.setVelocityY(-200); // Chair bounces
  });
}

const game = new Phaser.Game(config);

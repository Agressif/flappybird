var bird = {
  bird: [imgs.bird0, imgs.bird1], // normal
  up_bird: [imgs.up_bird0, imgs.up_bird1], // fly up
  down_bird: [imgs.down_bird0, imgs.down_bird1], // fall down
  posX: 100,
  posY: 200,
  speed: 0,
  index: 0,
  alive: true,
  draw: function(bird) {
    ctx.drawImage(bird, this.posX, this.posY);
  },
  fly: function() {
    this.posY += this.speed;
    // Acceleration
    this.speed++;
    // dead
    if (this.posY >= 395) {
      this.speed = 0;
      this.draw(this.bird[this.index]);
      this.dead();
    }
    if (this.posY <= 0) {
      this.speed = 6;
    }
    if (this.speed > 0) {
      this.draw(this.down_bird[this.index]);
    } else if (this.speed < 0) {
      this.draw(this.up_bird[this.index]);
    } else {
      this.draw(this.bird[this.index]);
    }
    if (bird.speed > 6) {
      bird.speed = 6;
    }
  },
  // wave wings
  wingWave: function() {
    this.index++;
    if (this.index > 1) {
      this.index = 0;
    }
  },
  // dead
  dead: function() {
    this.alive = false;
  }
}
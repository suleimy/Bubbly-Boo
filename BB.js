const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const progressBar = document.querySelector("progress");
const backgroundImage = new Image();
backgroundImage.src = "https://image.ibb.co/ckQdNw/BG.png";
      
function startPage() {
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
  ctx.font = "30px Arial";
  ctx.fillStyle = "Green";
  ctx.fillText("Welcome to Bubbly Boo", 120, canvas.height / 2);
  ctx.fillText( "Click to Start! Don't let them take her hat!",  130,   350,  300,  200);
}

startPage();

canvas.addEventListener("click", gameBegins);

function gameBegins() {
  function startGame() {
    if (progressBar.value === 0) {
      progressBar.value = 100;
      Object.assign(player, { x: canvas.width / 2, y: canvas.height / 2 });
      requestAnimationFrame(drawScene);
    }
  }

  function distanceBetween(sprite1, sprite2) {
    return Math.hypot(sprite1.x - sprite2.x, sprite1.y - sprite2.y);
  }

  function haveCollided(sprite1, sprite2) {
    return distanceBetween(sprite1, sprite2) < sprite1.radius + sprite2.radius;
  }

  class Sprite {
    draw() {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
  }

  class Player extends Sprite {
    constructor(x, y, radius, speed) {
      super();
      this.image = new Image();
      this.image.src = "https://image.ibb.co/cXFHFG/Idle_1.png";
      Object.assign(this, { x, y, radius, speed });
    }
    draw() {
      ctx.drawImage(this.image, this.x - 15, this.y, 90, 90);
    }
  }

  let player = new Player(250, 150, 6, 0.07);

  class Enemy extends Sprite {
    constructor(x, y, radius, speed) {
      super();
      this.image = new Image();
      this.image.src = "https://image.ibb.co/icGDpb/Jelly_5.png";
      Object.assign(this, { x, y, radius, speed });
    }
    draw() {
      ctx.drawImage(this.image, this.x, this.y, this.radius, 70);
    }
  }

  let enemies = [
    new Enemy(80, 200, 40, 0.02),
    new Enemy(200, 250, 30, 0.01),
    new Enemy(150, 180, 62, 0.002)
  ];

  let mouse = { x: 0, y: 0 };
  document.body.addEventListener("mousemove", updateMouse);
  function updateMouse(event) {
    const { left, top } = canvas.getBoundingClientRect();
    mouse.x = event.clientX - left;
    mouse.y = event.clientY - top;
  }

  function moveToward(leader, follower, speed) {
    follower.x += (leader.x - follower.x) * speed;
    follower.y += (leader.y - follower.y) * speed;
  }

  function pushOff(c1, c2) {
    let [dx, dy] = [c2.x - c1.x, c2.y - c1.y];
    const L = Math.hypot(dx, dy);
    let distToMove = c1.radius + c2.radius - L;
    if (distToMove > 0) {
      dx /= L;
      dy /= L;
      c1.x -= dx * distToMove / 2;
      c1.y -= dy * distToMove / 2;
      c2.x += dx * distToMove / 2;
      c2.y += dy * distToMove / 2;
    }
  }

  function updateScene() {
    moveToward(mouse, player, player.speed);
    enemies.forEach(enemy => moveToward(player, enemy, enemy.speed));
    enemies.forEach((enemy, i) =>
                    pushOff(enemy, enemies[(i + 5) % enemies.length])
                   );
    enemies.forEach(enemy => {
      if (haveCollided(enemy, player)) {
        progressBar.value -= 1;
      }
    });
  }

  function clearBackground() {
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
  }

  function drawScene() {
    clearBackground();
    player.draw();
    enemies.forEach(enemy => enemy.draw());
    updateScene();
    if (progressBar.value <= 0) {
      ctx.font = "30px Times New Roman";
      ctx.fillText(
        "BooHoo Bubble You Lost, Try Again or Not",
        20,
        canvas.height / 2
      );
    } else {
      requestAnimationFrame(drawScene);
    }
  }

  canvas.addEventListener("click", startGame);
  requestAnimationFrame(drawScene);
}

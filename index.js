const introMusic = new Audio("./music/introSong.mp3");
const shootingSound = new Audio("./music/shoooting.mp3");
const killEnemySound = new Audio("./music/killEnemy.mp3");
const gameOverSound = new Audio("./music/gameOver.mp3");
const heavyWeaponSound = new Audio("./music/heavyWeapon.mp3");
const hugeWeaponSound = new Audio("./music/hugeWeapon.mp3");
introMusic.play();
const canvas = document.createElement("canvas");
document.querySelector(".myGame").appendChild(canvas);
canvas.width = innerWidth;
canvas.height = innerHeight;
const context = canvas.getContext("2d");
const lightWeaponDamage = 10;
const heavyWeaponDamage = 20;
let difficulty = 2;
const form = document.querySelector("form");
const scoreBoard = document.querySelector(".scoreBoard");
let playerScore = 0;
document.querySelector("input").addEventListener("click", (e) => {
  e.preventDefault();
  introMusic.pause();
  form.style.display = "none";
  scoreBoard.style.display = "block";
  const userValue = document.getElementById("difficulty").value;

  if (userValue === "Easy") {
    setInterval(spawnEnemy, 3000);
    return (difficulty = 3);
  }
  if (userValue === "Medium") {
    setInterval(spawnEnemy, 2400);
    return (difficulty = 5);
  }
  if (userValue === "Hard") {
    setInterval(spawnEnemy, 2000);
    return (difficulty = 7);
  }
  if (userValue === "Insane") {
    setInterval(spawnEnemy, 1700);
    return (difficulty = 10);
  }
});

const gameoverLoader = () => {
  const gameOverBanner = document.createElement("div");
  const gameOverBtn = document.createElement("button");
  const highScore = document.createElement("div");

  highScore.innerHTML = `High Score : ${
    localStorage.getItem("highScore")
      ? localStorage.getItem("highScore")
      : playerScore
  }`;

  const oldHighScore =
    localStorage.getItem("highScore") && localStorage.getItem("highScore");

  if (oldHighScore < playerScore) {
    localStorage.setItem("highScore", playerScore);
    highScore.innerHTML = `High Score: ${playerScore}`;
  }
  gameOverBtn.innerText = "Play Again";

  gameOverBanner.appendChild(highScore);

  gameOverBanner.appendChild(gameOverBtn);
  gameOverBtn.onclick = () => {
    window.location.reload();
  };

  gameOverBanner.classList.add("gameover");

  document.querySelector("body").appendChild(gameOverBanner);
};
playerPosition = {
  x: canvas.width / 2,
  y: canvas.height / 2,
};
class Player {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
  }

  draw() {
    context.beginPath();
    context.arc(
      this.x,
      this.y,
      this.radius,
      (Math.PI / 180) * 0,
      (Math.PI / 180) * 360,
      false
    );
    context.fillStyle = this.color;

    context.fill();
  }
}
class Weapon {
  constructor(x, y, radius, color, velocity, damage) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
    this.damage = damage;
  }

  draw() {
    context.beginPath();
    context.arc(
      this.x,
      this.y,
      this.radius,
      (Math.PI / 180) * 0,
      (Math.PI / 180) * 360,
      false
    );
    context.fillStyle = this.color;
    context.fill();
  }

  update() {
    this.draw();
    this.x += this.velocity.x;
    this.y += this.velocity.y;
  }
}

class HugeWeapon {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.color = "rgba(255,0,133,1)";
  }

  draw() {
    context.beginPath();
    context.fillStyle = this.color;
    context.fillRect(this.x, this.y, 200, canvas.height);
  }

  update() {
    this.draw();
    this.x += 20;
  }
}

class Enemy {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
  }

  draw() {
    context.beginPath();
    context.arc(
      this.x,
      this.y,
      this.radius,
      (Math.PI / 180) * 0,
      (Math.PI / 180) * 360,
      false
    );
    context.fillStyle = this.color;
    context.fill();
  }

  update() {
    this.draw();
    (this.x += this.velocity.x), (this.y += this.velocity.y);
  }
}
const friction = 0.98;
class Particle {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
    this.alpha = 1;
  }

  draw() {
    context.save();
    context.globalAlpha = this.aplha;
    context.beginPath();
    context.arc(
      this.x,
      this.y,
      this.radius,
      (Math.PI / 180) * 0,
      (Math.PI / 180) * 360,
      false
    );
    context.fillStyle = this.color;
    context.fill();
    context.restore();
  }

  update() {
    this.draw();
    this.velocity.x *= friction;
    this.velocity.y *= friction;

    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.alpha -= 0.01;
  }
}
const abhi = new Player(playerPosition.x, playerPosition.y, 15, "white");
const weapons = [];
const hugeWeapons = [];
const enemies = [];
const particles = [];
const spawnEnemy = () => {
  const enemySize = Math.random() * (40 - 5) + 5;
  const enemyColor = `hsl(${Math.floor(Math.random() * 360)},100%,50%)`;

  // random is Enemy Spawn position
  let random;

  // Making Enemy Location Random but only from outsize of screen
  if (Math.random() < 0.5) {
    // Making X equal to very left off of screen or very right off of screen and setting Y to any where vertically
    random = {
      x: Math.random() < 0.5 ? canvas.width + enemySize : 0 - enemySize,
      y: Math.random() * canvas.height,
    };
  } else {
    // Making Y equal to very up off of screen or very down off of screen and setting X to any where horizontally
    random = {
      x: Math.random() * canvas.width,
      y: Math.random() < 0.5 ? canvas.height + enemySize : 0 - enemySize,
    };
  }
  const myAngle = Math.atan2(
    canvas.height / 2 - random.y,
    canvas.width / 2 - random.x
  );
  const velocity = {
    x: Math.cos(myAngle) * difficulty,
    y: Math.sin(myAngle) * difficulty,
  };
  enemies.push(new Enemy(random.x, random.y, enemySize, enemyColor, velocity));
};
let animationId;
function animation() {
  animationId = requestAnimationFrame(animation);
  scoreBoard.innerHTML = `Score : ${playerScore}`;
  context.fillStyle = "rgba(49, 49, 49,0.2)";

  context.fillRect(0, 0, canvas.width, canvas.height);

  abhi.draw();
  particles.forEach((particle, particleIndex) => {
    if (particle.aplha <= 0) {
      particles.splice(particleIndex, 1);
    } else {
      particle.update();
    }
  });
  hugeWeapons.forEach((hugeWeapon, hugeWeaponIndex) => {
    if (hugeWeapon.x > canvas.width) {
      hugeWeapons.splice(hugeWeaponIndex, 1);
    } else {
      hugeWeapon.update();
    }
  });
  
  weapons.forEach((weapon, weaponIndex) => {
    weapon.update();
    if (
      weapon.x + weapon.radius < 1 ||
      weapon.y + weapon.radius < 1 ||
      weapon.x - weapon.radius > canvas.width ||
      weapon.y - weapon.radius > canvas.height
    ) {
      weapons.splice(weaponIndex, 1);
    }
  });
  enemies.forEach((enemy, enemyIndex) => {
    enemy.update();
    const distanceBetweenPlayerAndEnemy = Math.hypot(
      abhi.x - enemy.x,
      abhi.y - enemy.y
    );
    if (distanceBetweenPlayerAndEnemy - abhi.radius - enemy.radius < 1) {
      cancelAnimationFrame(animationId);
      gameOverSound.play();
      hugeWeaponSound.pause();
      shootingSound.pause();
      heavyWeaponSound.pause();
      killEnemySound.pause();
      return gameoverLoader();
    }

    hugeWeapons.forEach((hugeWeapon) => {
      const distanceBetweenHugeWeaponAndEnemy = hugeWeapon.x - enemy.x;

      if (
        distanceBetweenHugeWeaponAndEnemy <= 200 &&
        distanceBetweenHugeWeaponAndEnemy >= -200
      ) {
        playerScore += 10;
        setTimeout(() => {
          killEnemySound.play();
          enemies.splice(enemyIndex, 1);
        }, 0);
      }
    });
    weapons.forEach((weapon, weaponIndex) => {
      const distanceBetweenWeaponAndEnemy = Math.hypot(
        weapon.x - enemy.x,
        weapon.y - enemy.y
      );

      if (distanceBetweenWeaponAndEnemy - weapon.radius - enemy.radius < 1) {
        killEnemySound.play();

        if (enemy.radius > weapon.damage + 8) {
          gsap.to(enemy, {
            radius: enemy.radius - weapon.damage,
          });
          setTimeout(() => {
            weapons.splice(weaponIndex, 1);
          }, 0);
        }
        else {
          for (let i = 0; i < enemy.radius * 3; i++) {
            particles.push(
              new Particle(weapon.x, weapon.y, Math.random() * 2, enemy.color, {
                x: (Math.random() - 0.5) * (Math.random() * 7),
                y: (Math.random() - 0.5) * (Math.random() * 7),
              })
            );
          }
          playerScore += 10;
          scoreBoard.innerHTML = `Score : ${playerScore}`;
          setTimeout(() => {
            enemies.splice(enemyIndex, 1);
            weapons.splice(weaponIndex, 1);
          }, 0);
        }
      }
    });
  });
}
canvas.addEventListener("click", (e) => {
  shootingSound.play();

  const myAngle = Math.atan2(
    e.clientY - canvas.height / 2,
    e.clientX - canvas.width / 2
  );
  const velocity = {
    x: Math.cos(myAngle) * 6,
    y: Math.sin(myAngle) * 6,
  };
  weapons.push(
    new Weapon(
      canvas.width / 2,
      canvas.height / 2,
      6,
      "white",
      velocity,
      lightWeaponDamage
    )
  );
});
canvas.addEventListener("contextmenu", (e) => {
  e.preventDefault();

  if (playerScore <= 0) return;
  heavyWeaponSound.play();
  playerScore -= 2;
  scoreBoard.innerHTML = `Score : ${playerScore}`;
   const myAngle = Math.atan2(
    e.clientY - canvas.height / 2,
    e.clientX - canvas.width / 2
  );
  const velocity = {
    x: Math.cos(myAngle) * 3,
    y: Math.sin(myAngle) * 3,
  };
  weapons.push(
    new Weapon(
      canvas.width / 2,
      canvas.height / 2,
      30,
      "cyan",
      velocity,
      heavyWeaponDamage
    )
  );
});
addEventListener("keypress", (e) => {
  if (e.key === " ") {
    if (playerScore < 20) return;
    playerScore -= 20;
    scoreBoard.innerHTML = `Score : ${playerScore}`;
    hugeWeaponSound.play();
    hugeWeapons.push(new HugeWeapon(0, 0));
  }
});

addEventListener("contextmenu", (e) => {
  e.preventDefault();
});

addEventListener("resize", () => {
  window.location.reload();
});

animation();

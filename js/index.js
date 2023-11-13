import { Game } from "./game.js"
import { enemiesMove, itemGroupCollidePoint, playerMoveLimits } from "./functions.js";

function handleCollisions() {
  let enemies = itemGroupCollidePoint(game.player, game.enemies, false);

  if (enemies.length) {
    enemies.forEach((enemy) => {
      enemy.attack(game.player);
    });

    if (!game.player.isAlive()) {
      gameOver('You lose');
      return;
    }
  }

  if (!game.enemies.array.length) {
    gameOver('You win');
    return;
  }

  let uses = itemGroupCollidePoint(game.player, game.uses, false);

  if (uses.length) {
    uses.forEach((use) => {
      use.use(game.player);
      game.uses.delete(use);
    });
  }

  game.player.heats.array.forEach((heat) => {
    let enemies = itemGroupCollidePoint(heat, game.enemies, false);

    if (enemies.length) {
      enemies.forEach((enemy) => {
        enemy.health -= game.player.power;

        if (!enemy.isAlive()) {
          game.enemies.delete(enemy);
        }
      });
    }
  });
}

function gameOver(message) {
  alert(message);
}

function gameLoop() {
  game.player.move();
  enemiesMove(game.enemies, game.walls);
  playerMoveLimits(game.player, game.walls);
  handleCollisions();

  game.enemies.update(game.field);
  game.update();

  setTimeout(() => requestAnimationFrame(gameLoop), 10);
}

const game = new Game();
game.init();

gameLoop();

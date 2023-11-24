import { Game } from "./game.js"
import { enemiesMove, itemGroupCollidePoint, playerMoveLimits, isCollidePoint, heatsMove } from "./functions.js";

function handleCollisions() {
  let enemies = itemGroupCollidePoint(game.player, game.enemies);

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

  let uses = itemGroupCollidePoint(game.player, game.uses);

  if (uses.length) {
    uses.forEach((use) => {
      use.use(game.player);
      game.uses.delete(use);
    });
  }

  let healthFountains = itemGroupCollidePoint(game.player, game.healthFountains);

  if (healthFountains.length) {
    healthFountains.forEach((el) => {
      el.use(game.player);
    })
  }

  if (isCollidePoint(game.player, game.bow)) {
    game.player.weapons.push('bow');
    game.uses.delete(game.bow);
  }

  game.characters.array.forEach((character) => {
    let traps = itemGroupCollidePoint(character, game.traps);

    if (traps.length) {
      traps.forEach((trap) => {
        trap.hit(character);

        if (!character.isAlive()) {
          game.enemies.delete(character);
          game.characters.delete(character);
        }
      });
    }
  });

  if (game.player.currentWeapon === 1) {
    heatsMove(game.player.heats, game.walls, game.enemies, game.characters)
  }

  game.player.heats.array.forEach((heat) => {
    let enemies = itemGroupCollidePoint(heat, game.enemies);

    if (enemies.length) {
      enemies.forEach((enemy) => {
        heat.heat(enemy)

        if (!enemy.isAlive()) {
          game.enemies.delete(enemy);
          game.characters.delete(enemy);
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


// 
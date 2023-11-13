import { Group } from "./group.js";
import { Enemy, Player } from "./hero.js";
import { HealthPotion, Item, Sword } from "./item.js";
import { Map } from "./map.js";

const swordCount = 2
const healtPotionCount = 10
const enemyCount = 10
let currentEnemy = 0

export class Game {
  constructor() {
    const map = new Map();
    const [blockWidth, blockHeight] = map.init();
    this.map = map;

    this.blockWidth = blockWidth;
    this.blockHeight = blockHeight;

    this.enemies = new Group();
    this.swords = new Group();
    this.healthPotions = new Group();
    this.walls = new Group();
    this.uses = new Group();
  }

  init() {
    alert('Чтобы выиграть убей всех врагов!');
    this.generateEnvironment();

    const field = document.querySelector('.field');
    this.field = field;

    this.draw(field);

    this.player.control();
  }

  gameLoop(field) {}

  update() {
    this.map.update();
    this.enemies.update(this.field);
    this.uses.update(this.field);
    this.walls.update(this.field);
    this.player.update(this.field);
  }

  draw(field) {
    this.enemies.draw(field);
    this.swords.draw(field);
    this.healthPotions.draw(field);
    this.walls.draw(field);
    this.player.draw(field);
  }

  generateEnvironment() {
    this.generateEnvironmentMap();
    const map = this.map.map;

    map.forEach((row, i) => {
      row.forEach((el, j) => {
        const posX = j * this.blockWidth;
        const posY = i * this.blockHeight;
        const coef = 1.35;

        if (el === 's') {
          const sword = new Sword(posX, posY, this.blockWidth / coef, this.blockHeight / coef, 'tileSW', 5);
          this.swords.append(sword);
          this.uses.append(sword);
        } else if (el === 'hp') {
          const hp = new HealthPotion(posX, posY, this.blockWidth / coef, this.blockHeight / coef, 'tileHP', 5);
          this.healthPotions.append(hp);
          this.uses.append(hp);
        } else if (el === 'e') {
          const direction = (currentEnemy % 2 === 0) ? 'h' : 'v';
          const enemy = new Enemy(posX, posY, this.blockWidth / coef, this.blockHeight / coef, 'tileE', direction);
          currentEnemy++;
          this.enemies.append(enemy);
        } else if (el === 0) {
          const wall = new Item('wall', posX, posY, this.blockWidth, this.blockHeight, 'tileW');
          this.walls.append(wall);
        } else if (el === 'p') {
          this.player = new Player('Andrey', posX, posY, this.blockWidth / coef, this.blockHeight / coef, 'tileP');
        }
      });
    });
  }

  generateEnvironmentMap() {
    const map = this.map.map;

    for (let i = 0; i < swordCount + healtPotionCount + enemyCount + 1; i++) {
      let pos = Math.round(Math.random() * (map.length - 1));

      if (!map[pos].includes(1)) {
        i--;
        continue;
      }

      let j = Math.round(Math.random() * (map[pos].length - 1));
      while (map[pos][j] !== 1) {
        j = Math.round(Math.random() * (map[pos].length - 1));
      }

      if (i < swordCount) {
        map[pos][j] = 's';
      } else if (i < swordCount + healtPotionCount) {
        map[pos][j] = 'hp';
      } else if (i < swordCount + healtPotionCount + enemyCount) {
        map[pos][j] = 'e';
      } else {
        map[pos][j] = 'p';
      }
    }
  }
}

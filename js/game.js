import { Group } from "./group.js";
import { Enemy, Player, Friend } from "./hero.js";
import { HealthPotion, Item, Sword, Trap, HealthFountain, Bow } from "./item.js";
import { Map } from "./map.js";
import { shortestPathWithRoute, searchInMatrix } from "./a-star.js"; 

const swordCount = 2
const healtPotionCount = 10
const enemyCount = 10
const trapCount = Math.round(Math.random() * 2 + 3)
const healthFountainsCount = Math.round(Math.random() * 2 + 3)
const bowCount = 1
const friendCount = 1
let currentEnemy = 0

export class Game {
  constructor() {
    const map = new Map();
    const [blockWidth, blockHeight] = map.init();
    this.map = map;

    this.blockWidth = blockWidth;
    this.blockHeight = blockHeight;

    this.enemies = new Group();
    this.characters = new Group();
    this.swords = new Group();
    this.healthPotions = new Group();
    this.healthFountains = new Group();
    this.healthFountains = new Group();
    this.walls = new Group();
    this.uses = new Group();
    this.traps = new Group();
  }

  init() {
    alert('Чтобы выиграть убей всех врагов!');
    this.generateEnvironment();

    const field = document.querySelector('.field');
    this.field = field;

    this.draw(field);

    this.player.control();
  }

  update() {
    this.map.update();
    this.characters.update(this.field);
    this.uses.update(this.field);
    this.healthFountains.update(this.field);
    this.walls.update(this.field);
    this.traps.update(this.field);
    this.updateMap()
  }

  draw(field) {
    this.characters.draw(field);
    this.uses.draw(field);
    this.healthFountains.draw(field);
    this.walls.draw(field);
    this.traps.draw(field);
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
          const hp = new HealthPotion(posX, posY, this.blockWidth / coef, this.blockHeight / coef, 'tileHP', 10);
          this.healthPotions.append(hp);
          this.uses.append(hp);
        } else if (el === 'hf') {
          const hf = new HealthFountain(posX, posY, this.blockWidth / coef, this.blockHeight / coef, 'tileHF', 3);
          this.healthFountains.append(hf);
        } else if (el === 'e') {
          const direction = (currentEnemy % 2 === 0) ? 'h' : 'v';
          const enemy = new Enemy(posX, posY, this.blockWidth / coef, this.blockHeight / coef, 'tileE', direction);
          currentEnemy++;
          this.enemies.append(enemy);
          this.characters.append(enemy);
          map[i][j] = enemy;
        } else if (el === 0) {
          const wall = new Item('wall', posX, posY, this.blockWidth, this.blockHeight, 'tileW');
          this.walls.append(wall);
        } else if (el === 't') {
          const trap = new Trap(posX, posY, this.blockWidth / coef, this.blockHeight / coef, 'tileTR', 1);
          this.traps.append(trap);
        } else if (el === 'bow') {
          this.bow = new Bow(posX, posY, this.blockWidth / coef, this.blockHeight / coef, 'tileBOW');
          this.uses.append(this.bow);
        } else if (el === 'fr') {
          this.friend = new Friend(posX, posY, this.blockWidth / coef, this.blockHeight / coef, 'tileFR', this.enemies);
          this.characters.append(this.friend);
          map[i][j] = this.friend
        } else if (el === 'p') {
          this.player = new Player('Andrey', posX, posY, this.blockWidth / coef, this.blockHeight / coef, 'tileP');
          this.characters.append(this.player);
          map[i][j] = this.player;
        }
      });
    });
  }

  generateEnvironmentMap() {
    const map = this.map.map;

    for (let i = 0; i < swordCount + healtPotionCount + enemyCount + trapCount + healthFountainsCount + bowCount + friendCount + 1; i++) {
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
      } else if (i < swordCount + healtPotionCount + enemyCount + trapCount) {
        map[pos][j] = 't';
      } else if (i < swordCount + healtPotionCount + enemyCount + trapCount + healthFountainsCount) {
        map[pos][j] = 'hf'
      } else if (i < swordCount + healtPotionCount + enemyCount + trapCount + healthFountainsCount + bowCount) {
        map[pos][j] = 'bow'
      } else if (i < swordCount + healtPotionCount + enemyCount + trapCount + healthFountainsCount + bowCount + friendCount) {
        map[pos][j] = 'fr'
      } else {
        map[pos][j] = 'p';
      }
    }
  }

  updateMap() {
    const map = this.map.map;
    
    map.forEach((row, i) => {
      row.forEach((el, j) => {
        const posX = j * this.blockWidth;
        const posY = i * this.blockHeight;

        if (this.characters.array.includes(el)) {
          if (el.posX - posX > this.blockWidth) {
            map[i][j+1] = el
            map[i][j] = 1
          } else if (posX - el.posX > this.blockWidth) {
            map[i][j-1] = el
            map[i][j] = 1
          }
          if (el.posY - posY > this.blockHeight) {
            map[i+1][j] = el
            map[i][j] = 1
          } else if (posY - el.posY > this.blockHeight) {
            map[i-1][j] = el
            map[i][j] = 1
          }
        }
      });
    });

    const start = searchInMatrix(map, this.friend)
    const target = searchInMatrix(map, this.friend.getClosest())

    console.log(start, target)
  }
}

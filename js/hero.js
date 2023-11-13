import { Item } from "./item.js"
import { Group } from "./group.js"



export class Heat {
  constructor(posX, posY, radius) {
    this.posX = posX;
    this.posY = posY;
    this.radius = radius;
    this.item = this.createHtmlElement();
  }

  isIntersection(rectangle) {
    const closestX = Math.max(rectangle.posX, Math.min(this.posX, rectangle.posX + rectangle.width));
    const closestY = Math.max(rectangle.posY, Math.min(this.posY, rectangle.posY + rectangle.height));

    const distanceX = closestX - this.posX - this.radius / 2;
    const distanceY = closestY - this.posY - this.radius / 2;

    return Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2)) <= this.radius / 2;
  }

  createHtmlElement() {
    const heat = document.createElement('div');
    heat.classList.add('heat');
    heat.style.left = `${this.posX}px`;
    heat.style.top = `${this.posY}px`;
    heat.style.width = `${this.radius}px`;
    heat.style.height = `${this.radius}px`;

    return heat;
  }

  draw(field) {
    field.append(this.item);
  }

  drop() {
    this.item.remove();
  }
}

export class Character extends Item {
  constructor(name, posX, posY, width, height, className, power, health, speed) {
    super(name, posX, posY, width, height, className);
    this.power = power;
    this.health = health;
    this.speed = speed;
  }

  isAlive() {
    return this.health > 0;
  }
}

export class Player extends Character {
  constructor(name, posX, posY, width, height, className, power = 5, health = 100, speed = 5) {
    super(name, posX, posY, width, height, className, power, health, speed);
    this.healthMax = health;
    this.speedX = 0;
    this.speedY = 0;
    this.heat = null;
    this.heats = new Group();
  }

  createHtmlElement() {
    const item = document.createElement('div');
    item.style.backgroundSize = `${this.height}px ${this.width}px`;
    item.style.height = `${this.height}px`;
    item.style.width = `${this.width}px`;
    item.style.top = `${this.posY}px`;
    item.style.left = `${this.posX}px`;
    item.classList.add(this.className);

    const healthIndicator = document.createElement('span');
    healthIndicator.classList.add('healthIndicator');

    const el = document.createElement('span');
    healthIndicator.append(el);
    el.style.width = `${this.health * 100 / this.healthMax}%`;

    healthIndicator.style.height = '3px';
    healthIndicator.style.width = `${this.width}px`;

    item.append(healthIndicator);

    this.item = item;
    return item;
  }

  attack() {
    const heat = new Heat(this.posX - this.width, this.posY - this.height, 3 * this.width);
    this.heats.append(heat);
    setTimeout(this.delete.bind(this), 500);
  }

  delete() {
    this.heats.array.shift();
  }

  move() {
    this.posX += this.speedX;
    this.posY += this.speedY;
  }

  draw(field) {
    field.append(this.createHtmlElement());
    if (this.heats.array.length) {
      this.heats.draw(field);
    }
  }

  drop() {
    if (this.heats.array.length) {
      this.heats.drop();
    }
    this.item.remove();
  }

  update(field) {
    this.drop();
    this.draw(field);
  }

  control() {
    document.addEventListener('keydown', (event) => {
      if (event.code === 'KeyW') {
        this.speedY = -this.speed;
        this.speedX = 0;
      } else if (event.code === 'KeyA') {
        this.speedX = -this.speed;
        this.speedY = 0;
      } else if (event.code === 'KeyS') {
        this.speedY = this.speed;
        this.speedX = 0;
      } else if (event.code === 'KeyD') {
        this.speedX = this.speed;
        this.speedY = 0;
      } else if (event.code === 'Space') {
        this.attack();
      }
    });

    document.addEventListener('keyup', (event) => {
      if (event.code === 'KeyW' || event.code === 'KeyS') {
        this.speedY = 0;
      } else if (event.code === 'KeyA' || event.code === 'KeyD') {
        this.speedX = 0;
      }
    });
  }
}

export class Enemy extends Character {
  constructor(posX, posY, width, height, className, direction, power = 2, health = 50, speed = 3) {
    if (direction !== 'h' && direction !== 'v') {
      throw new Error(`Неверное указание направление персонажа: ${direction}. Доступны: 'h', 'v'.`);
    }
    super('enemy', posX, posY, width, height, className, power, health, speed);
    this.direction = direction;
  }

  attack(hero) {
    hero.health -= this.power;
  }
}

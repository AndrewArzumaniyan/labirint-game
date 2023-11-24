import { Item } from "./item.js"
import { Group } from "./group.js"



export class Heat extends Item {
  constructor(name, posX, posY, width, height, className, power) {
    super(name, posX, posY, width, height, className);
    this.power = power
  }

  draw(field) {
    field.append(this.item);
  }

  drop() {
    this.item.remove();
  }

  heat(other) {
    other.health -= this.power;
  }
}

export class Standart extends Heat {
  constructor(posX, posY, width, height, power, name='standart') {
    super(name, posX, posY, width, height, '', power)
    this.item = this.toHtml();
    this.posX = posX - width;
    this.posY = posY - height;
    this.radius = 3 * width;
    this.item = this.toHtml();
  }

  isIntersection(rectangle) {
    const closestX = Math.max(rectangle.posX, Math.min(this.posX, rectangle.posX + rectangle.width));
    const closestY = Math.max(rectangle.posY, Math.min(this.posY, rectangle.posY + rectangle.height));

    const distanceX = closestX - this.posX - this.radius / 2;
    const distanceY = closestY - this.posY - this.radius / 2;

    return Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2)) <= this.radius / 2;
  }

  toHtml() {
    const heat = document.createElement('div');
    heat.classList.add('heat');
    heat.style.left = `${this.posX}px`;
    heat.style.top = `${this.posY}px`;
    heat.style.width = `${this.radius}px`;
    heat.style.height = `${this.radius}px`;

    return heat;
  }
}

export class Arrow extends Heat {
  constructor(posX, posY, width, height, power, direction, speed, name='arrow') {
    super(name, posX, posY, width, height, 'tileAR', power);
    this.item = this.toHtml();
    this.direction = direction;
    this.speed = speed;
  }

  use(hero) {
    hero.weapons.push('bow')
  }

  toHtml() {
    const item = document.createElement('div')
    item.style.backgroundSize = `${this.height}px ${this.width}px`
    item.style.height = `${this.height}px`
    item.style.width = `${this.width}px`
    item.style.top = `${this.posY}px`
    item.style.left = `${this.posX}px`
    item.classList.add(this.className)

    this.item = item
    return item
  }

  draw(field) {
    field.append(this.toHtml());
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

  toHtml() {
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
}

export class Player extends Character {
  constructor(name, posX, posY, width, height, className, power = 5, health = 100, speed = 5) {
    super(name, posX, posY, width, height, className, power, health, speed);
    this.healthMax = health;
    this.speedX = 0;
    this.speedY = 0;
    this.heat = null;
    this.heats = new Group();
    this.weapons = ['standart'];
    this.currentWeapon = 0;
    this.direction = '';
  }

  attack() {
    if (this.currentWeapon === 0) {
      const heat = new Standart(this.posX, this.posY, this.width, this.height, this.power);
      this.heats.append(heat);
      setTimeout(this.delete.bind(this), 500);
    } if (this.currentWeapon == 1) {
      const arrow = new Arrow(this.posX, this.posY, this.width, this.height, this.power + 3, this.direction, 8)
      this.heats.append(arrow);
    }
  }

  delete() {
    this.heats.array.shift();
  }

  move() {
    this.posX += this.speedX;
    this.posY += this.speedY;
  }

  draw(field) {
    field.append(this.toHtml());
    if (this.heats.array.length) {
      this.heats.draw(field);
    }
  }

  drop() {
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
        this.direction = 'u';
      } else if (event.code === 'KeyA') {
        this.speedX = -this.speed;
        this.speedY = 0;
        this.direction = 'l';
      } else if (event.code === 'KeyS') {
        this.speedY = this.speed;
        this.speedX = 0;
        this.direction = 'd';
      } else if (event.code === 'KeyD') {
        this.speedX = this.speed;
        this.speedY = 0;
        this.direction = 'r';
      } else if (event.code === 'Space') {
        this.attack();
      } else if (event.code === 'KeyC') {
        if (this.weapons.length > 1) 
          this.currentWeapon = this.currentWeapon === 0 ? 1 : 0
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
    this.healthMax = health;
  }

  attack(hero) {
    hero.health -= this.power;
  }
}


export class Friend extends Character {
  constructor(posX, posY, width, height, className, enemies, power = 5, health = 75, speed = 5) {
    super('friend', posX, posY, width, height, className, power, health, speed);
    this.healthMax = health;
    this.enemies = enemies;
  }

  attack(enemy) {
    enemy.health -= this.power;
  }

  getClosest() {
    let distances = [];
    this.enemies.array.forEach((enemy) => {
      let distance = Math.round(Math.sqrt(Math.pow(this.posX - enemy.posX, 2) + Math.pow(this.posY - enemy.posY, 2)));
      distances.push(distance)
    });
    const argmin = distances.indexOf(Math.min(...distances));
    
    return this.enemies.array[argmin];
  }
}
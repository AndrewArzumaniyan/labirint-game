let nextId = BigInt(1);

export class Item {
  constructor(name, posX, posY, width, height, className) {
    this.id = nextId++
    this.name = name
    this.posX = posX
    this.posY = posY
    this.width = width
    this.height = height
    this.className = className
  }

  isIntersection(other) {
    if (other instanceof Item) {
      return (
        this.posX < other.posX + other.width &&
        this.posX + this.width > other.posX &&
        this.posY < other.posY + other.height &&
        this.posY + this.height > other.posY
      )
    } else if (other instanceof Heat) {
      const distanceX = Math.abs(this.posX - other.posX - other.radius / 2);
      const distanceY = Math.abs(this.posY - other.posY - other.radius / 2);

      if (distanceX > (this.width / 2 + other.radius / 2) || distanceY > (this.height / 2 + other.radius / 2)) {
        return false;
      }

      if (distanceX <= (this.width / 2) || distanceY <= (this.height / 2)) {
        return true;
      }

      const cornerDistance = Math.pow(distanceX - this.width / 2, 2) + Math.pow(distanceY - this.height / 2, 2);
      return cornerDistance <= Math.pow(other.radius / 2, 2);
    }
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
    field.append(this.toHtml())
  }

  drop() {
    this.item.remove()
  }

  update(field) {
    this.drop()
    this.draw(field)
  }
}

export class HealthPotion extends Item {
  constructor(posX, posY, width, height, className, value) {
    super('Зелье здоровья', posX, posY, width, height, className)
    this.value = value
  }

  use(hero) {
    if (hero.health + this.value > hero.maxHealth)
      hero.health = hero.maxHealth
    else
      hero.health += this.value
  }
}

export class Sword extends Item {
  constructor(posX, posY, width, height, className, value) {
    super('Меч', posX, posY, width, height, className)
    this.value = value
  }

  use(hero) {
    hero.power += this.value
  }
}
export class Group {
  constructor () {
    this.array = []
  }

  append(el) {
    this.array.push(el)
  }

  delete(el) {
    this.array = this.array.filter((e) => e.id !== el.id)
  }

  draw(field) {
    this.array.forEach((el) => {
      el.draw(field)
    })
  }

  drop() {
    this.array.forEach((item) => {
      item.drop()
    })
  }

  update(field) {
    this.drop()
    this.draw(field)
  }
}
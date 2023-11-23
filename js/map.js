const DIRECTION_HORIZONTAL = 'h';
const DIRECTION_VERTICAL = 'v';

function createRangeArray(a, b) {
  return Array.from({ length: b - a + 1 }, (_, index) => index + a);
}

function getRandomElement(array) {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

export class Map {
  constructor(width = 40, height = 24) {
    this.map = [];
    this.field = null;
    this.blockWidthPx = 0;
    this.blockHeightPx = 0;
    this.height = height;
    this.width = width;
    this.roomsVIndexes = []
    this.roomsHIndexes = []
  }

  init() {
    this.generateMap();
    this.drawMap();

    return [this.blockWidthPx, this.blockHeightPx];
  }

  generateRooms() {
    const count = Math.round(Math.random() * 5 + 5);

    for (let i = 0; i < count; i++) {
      let h = Math.round(Math.random() * 5 + 3);
      let l = Math.round(Math.random() * 5 + 3);

      let start = [Math.round(Math.random() * (this.height - 3 - h) + 1), Math.round(Math.random() * (this.width - 3 - l) + 1)];

      let flag = 1;
      for (let j = start[0]; j < start[0] + h; j++) {
        for (let k = start[1]; k < start[1] + l; k++) {
          if (this.map[j][k] > 0) {
            flag = 0;
            break;
          }
        }

        if (!flag) {
          break;
        }
      }

      if (!flag) {
        i--;
        continue;
      }

      this.roomsVIndexes = this.roomsVIndexes.concat(createRangeArray(start[0], start[0] + h - 1))
      this.roomsHIndexes = this.roomsHIndexes.concat(createRangeArray(start[1], start[1] + l - 1))
      console.log('-------')
      console.log(this.roomsHIndexes)
      console.log(this.roomsVIndexes)
      console.log('-------')
      for (let j = start[0]; j < start[0] + h; j++) {
        for (let k = start[1]; k < start[1] + l; k++) {
          this.map[j][k] = 1;
        }
      }
    }

    this.roomsHIndexes = [...new Set(this.roomsHIndexes)]
    this.roomsVIndexes = [...new Set(this.roomsVIndexes)]
    console.log(this.roomsHIndexes)
    console.log(this.roomsVIndexes)
  }

  generatePassages(direction = DIRECTION_HORIZONTAL) {
    const count = Math.round(Math.random() * 2 + 3);

    if (direction === DIRECTION_HORIZONTAL) {
      for (let k = 0; k < count; k++) {
        // const pos = Math.round(Math.random() * (this.height - 3) + 1);
        const pos = getRandomElement(this.roomsVIndexes)

        const delIndex = this.roomsVIndexes.indexOf(pos)
        this.roomsVIndexes.splice(delIndex - 2, 4)

        if (this.map[pos].every((el) => el === 1)) {
          k--;
          continue;
        }

        for (let i = 1; i < this.width - 1; i++) {
          this.map[pos][i] = 1;
        }
      }
    } else if (direction === DIRECTION_VERTICAL) {
      for (let k = 0; k < count; k++) {
        // const pos = Math.round(Math.random() * (this.width - 3) + 1);
        const pos = getRandomElement(this.roomsHIndexes)
        
        const delIndex = this.roomsHIndexes.indexOf(pos)
        this.roomsHIndexes.splice(delIndex - 2, 4)

        if (this.map.every((el) => el[pos] === 1)) {
          k--;
          continue;
        }

        for (let i = 1; i < this.height - 1; i++) {
          this.map[i][pos] = 1;
        }
      }
    } else {
      throw new Error(`Invalid direction for passages generation: ${direction}. Available directions: ${DIRECTION_HORIZONTAL}, ${DIRECTION_VERTICAL}.`);
    }
  }

  generateMap() {
    for (let i = 0; i < this.height; i++) {
      this.map.push([]);
      for (let j = 0; j < this.width; j++) {
        this.map[i].push(0);
      }
    }

    this.generateRooms();
    this.generatePassages();
    this.generatePassages(DIRECTION_VERTICAL);
  }

  generateBack() {
    const block = document.createElement('span');
    block.style.backgroundSize = `${this.blockHeightPx}px ${this.blockWidthPx}px`;
    block.style.height = `${this.blockHeightPx}px`;
    block.style.width = `${this.blockWidthPx}px`;
    block.classList.add('tile');
    return block;
  }

  drawMap() {
    const field = document.querySelector('.field');

    this.field = field;

    const heightPx = field.offsetHeight;
    const widthPx = field.offsetWidth;

    this.blockHeightPx = heightPx / this.height;
    this.blockWidthPx = widthPx / this.width;

    this.map.forEach((row) => {
      row.forEach((el) => {
        field.append(this.generateBack());
      });
    });
  }

  update() {
    this.field.innerHTML = '';
    this.map.forEach((row) => {
      row.forEach((el) => {
        this.field.append(this.generateBack());
      });
    });
  }
}

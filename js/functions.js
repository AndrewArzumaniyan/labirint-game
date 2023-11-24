export function isCollidePoint(item1, item2) { 
  return item1.isIntersection(item2);
}

export function itemGroupCollidePoint(item, group) {
  return group.array.filter(el => {
    if (isCollidePoint(item, el)) {
      return true;
    }
    return false;
  });
}

export function playerMoveLimits(player, walls) {
  let wallsCollide = itemGroupCollidePoint(player, walls);

  if (player.speedX > 0 && wallsCollide.length > 0) {
    const nearestWall = wallsCollide.reduce((nearest, wall) => {
      return (wall.posX > nearest.posX) ? wall : nearest;
    }, wallsCollide[0]);
    player.posX = Math.min(nearestWall.posX - player.width, player.posX);
  } else if (player.speedX < 0 && wallsCollide.length > 0) {
    const nearestWall = wallsCollide.reduce((nearest, wall) => {
      return (wall.posX < nearest.posX) ? wall : nearest;
    }, wallsCollide[0]);
    player.posX = Math.max(nearestWall.posX + nearestWall.width, player.posX);
  }

  wallsCollide = itemGroupCollidePoint(player, walls);

  if (player.speedY > 0 && wallsCollide.length > 0) {
    const nearestWall = wallsCollide.reduce((nearest, wall) => {
      return (wall.posY > nearest.posY) ? wall : nearest;
    }, wallsCollide[0]);
    player.posY = Math.min(nearestWall.posY - player.height, player.posY);
  } else if (player.speedY < 0 && wallsCollide.length > 0) {
    const nearestWall = wallsCollide.reduce((nearest, wall) => {
      return (wall.posY < nearest.posY) ? wall : nearest;
    }, wallsCollide[0]);
    player.posY = Math.max(nearestWall.posY + nearestWall.height, player.posY);
  }
}


export function enemiesMove(enemies, walls) {
  enemies.array.forEach(enemy => {
    if (enemy.direction === 'h') {
      enemy.posX += enemy.speed;
    } else if (enemy.direction === 'v') {
      enemy.posY += enemy.speed;
    }

    if (itemGroupCollidePoint(enemy, walls, false).length) {
      enemy.speed = -enemy.speed;
    } 
  });
}

export function heatsMove(heats, walls, enemies, characters) {
  heats.array.forEach((heat) => {
    if (heat.direction === 'u') {
      heat.posY -= heat.speed;
    } else if (heat.direction === 'd') {
      heat.posY += heat.speed;
    } else if (heat.direction === 'l') {
      heat.posX -= heat.speed;
    } else if (heat.direction === 'r') {
      heat.posX += heat.speed;
    }

    if (itemGroupCollidePoint(heat, walls).length) {
      heats.delete(heat);
    } 

    let enemiesCollide = itemGroupCollidePoint(heat, enemies);
    enemiesCollide.forEach((enemy) => {
      heat.heat(enemy);
      heats.delete(heat);

      if (!enemy.isAlive()) {
        enemies.delete(enemy);
        characters.delete(enemy);
      }
    });
  });
}

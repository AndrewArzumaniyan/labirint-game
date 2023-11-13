export function isCollidePoint(item1, item2) { 
  return item1.isIntersection(item2);
}

export function itemGroupCollidePoint(item, group, bool1) {
  return group.array.filter(el => {
    if (isCollidePoint(item, el, bool1)) {
      if (bool1) group.delete(el);
      return true;
    }
    return false;
  });
}

export function playerMoveLimits(player, walls) {
  let wallsCollide = itemGroupCollidePoint(player, walls, false, false);

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

  wallsCollide = itemGroupCollidePoint(player, walls, false, false);

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

export class InputManager {
  constructor() {
    this.keys = {};
    this.previousKeys = {};
    
    // Bind event listeners
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
  }

  handleKeyDown(event) {
    this.keys[event.code] = true;
  }

  handleKeyUp(event) {
    this.keys[event.code] = false;
  }

  update() {
    // Copy current keys to previous keys
    this.previousKeys = { ...this.keys };
  }

  isKeyPressed(keyCode) {
    return this.keys[keyCode] || false;
  }

  isKeyJustPressed(keyCode) {
    return this.keys[keyCode] && !this.previousKeys[keyCode];
  }

  isKeyJustReleased(keyCode) {
    return !this.keys[keyCode] && this.previousKeys[keyCode];
  }

  getMovementVector() {
    let x = 0;
    let y = 0;
    
    if (this.isKeyPressed('ArrowLeft') || this.isKeyPressed('KeyA')) {
      x -= 1;
    }
    if (this.isKeyPressed('ArrowRight') || this.isKeyPressed('KeyD')) {
      x += 1;
    }
    if (this.isKeyPressed('ArrowUp') || this.isKeyPressed('KeyW')) {
      y -= 1;
    }
    if (this.isKeyPressed('ArrowDown') || this.isKeyPressed('KeyS')) {
      y += 1;
    }
    
    return { x, y };
  }

  isJumpPressed() {
    return this.isKeyJustPressed('Space') || this.isKeyJustPressed('KeyW');
  }

  isAttackPressed() {
    return this.isKeyJustPressed('KeyJ');
  }

  isHeavyAttackPressed() {
    return this.isKeyJustPressed('KeyK');
  }

  isShieldPressed() {
    return this.isKeyPressed('KeyL');
  }

  isDashPressed() {
    return this.isKeyJustPressed('Shift');
  }
}

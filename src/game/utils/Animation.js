export class Animation {
  constructor(frames, frameDuration, loop = true) {
    this.frames = frames;
    this.frameDuration = frameDuration;
    this.loop = loop;
    this.currentFrameIndex = 0;
    this.timer = 0;
    this.isFinishedFlag = false;
  }

  update(deltaTime) {
    this.timer += deltaTime;
    
    if (this.timer >= this.frameDuration) {
      this.timer = 0;
      this.currentFrameIndex++;
      
      if (this.currentFrameIndex >= this.frames.length) {
        if (this.loop) {
          this.currentFrameIndex = 0;
        } else {
          this.currentFrameIndex = this.frames.length - 1;
          this.isFinishedFlag = true;
        }
      }
    }
  }

  getCurrentFrame() {
    return this.frames[this.currentFrameIndex];
  }

  isFinished() {
    return this.isFinishedFlag;
  }

  reset() {
    this.currentFrameIndex = 0;
    this.timer = 0;
    this.isFinishedFlag = false;
  }
}

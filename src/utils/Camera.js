class Camera {
  constructor(width, height) {
    this.x = 0;
    this.y = 0;
    this.width = width;
    this.height = height;
    this.target = null;
    this.smoothness = 0.6; // Smooth camera following - not too fast, not too slow
    this.zoom = 1;
    this.minZoom = 0.05;
    this.maxZoom = 5;
    this.worldWidth = 0;
    this.worldHeight = 0;
    this.fitToMap = true;
  }

  setTarget(target) {
    this.target = target;
  }

  setWorldBounds(width, height) {
    this.worldWidth = width;
    this.worldHeight = height;
  }

  fitMapToScreen(mapWidth, mapHeight) {
    if (!this.fitToMap) return;
    
    // Set zoom to 1 - no camera scaling, let map scaling handle everything
    this.zoom = 1;
    
    // Lock the zoom - no more changes allowed
    this.zoomLocked = true;
    
    // Don't set initial position - let the camera follow the player naturally
  }

  update() {
    if (!this.target) return;

    // Calculate target position (center camera on player)
    const targetX = this.target.x - (this.width / this.zoom) / 2;
    const targetY = this.target.y - (this.height / this.zoom) / 2;

    // Smooth camera movement
    this.x += (targetX - this.x) * this.smoothness;
    this.y += (targetY - this.y) * this.smoothness;

    // Restrict camera to ONLY show map boundaries - no blank spaces
    const viewWidth = this.width / this.zoom;
    const viewHeight = this.height / this.zoom;
    
    if (this.worldWidth > 0 && this.worldHeight > 0) {
      // Debug logging for camera bounds (simplified)
      // console.log('📷 Camera bounds:', {
      //   worldWidth: this.worldWidth,
      //   worldHeight: this.worldHeight,
      //   viewWidth,
      //   viewHeight,
      //   cameraX: this.x,
      //   cameraY: this.y,
      //   zoom: this.zoom
      // });
      
      // Clamp camera to exact map boundaries - no movement outside map
      this.x = Math.max(0, Math.min(this.x, this.worldWidth - viewWidth));
      this.y = Math.max(0, Math.min(this.y, this.worldHeight - viewHeight));
    }
  }

  transform(ctx) {
    ctx.save();
    ctx.translate(-this.x, -this.y);
    ctx.scale(this.zoom, this.zoom);
  }

  restore(ctx) {
    ctx.restore();
  }

  worldToScreen(worldX, worldY) {
    return {
      x: (worldX - this.x) * this.zoom,
      y: (worldY - this.y) * this.zoom
    };
  }

  screenToWorld(screenX, screenY) {
    return {
      x: screenX / this.zoom + this.x,
      y: screenY / this.zoom + this.y
    };
  }

  setZoom(zoom) {
    if (this.zoomLocked) return; // Don't allow zoom changes if locked
    this.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, zoom));
  }

  adjustZoom(delta) {
    if (this.zoomLocked) return; // Don't allow zoom changes if locked
    this.setZoom(this.zoom + delta);
  }
}

export default Camera;

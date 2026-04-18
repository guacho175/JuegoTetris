// src/inputHandler.js
// Shared input handler for hybrid controls (keyboard + touch) used by Tetris.
class InputHandler {
  constructor() {
    this.moveCallbacks = [];
    this.rotateCallbacks = [];
    this.accelerateCallbacks = [];
    this.isTouchDevice = typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0;
    this._init();
  }
  onMove(cb) { this.moveCallbacks.push(cb); }
  onRotate(cb) { this.rotateCallbacks.push(cb); }
  onAccelerate(cb) { this.accelerateCallbacks.push(cb); }
  _emitMove(dir) { this.moveCallbacks.forEach(cb => cb(dir)); }
  _emitRotate() { this.rotateCallbacks.forEach(cb => cb()); }
  _emitAccelerate() { this.accelerateCallbacks.forEach(cb => cb()); }
  _init() {
    // Keyboard
    window.addEventListener('keydown', (e) => {
      const keys = ['ArrowLeft','ArrowRight','ArrowUp','ArrowDown',' '];
      if (keys.includes(e.key)) e.preventDefault();
      switch (e.key) {
        case 'ArrowLeft': this._emitMove({x:-1,y:0}); break;
        case 'ArrowRight': this._emitMove({x:1,y:0}); break;
        case 'ArrowDown': this._emitAccelerate(); break; // soft drop
        case 'ArrowUp': this._emitRotate(); break;
        case ' ': this._emitAccelerate(); break;
      }
    });
    // Touch gestures
    if (this.isTouchDevice) {
      let startX=0,startY=0; const threshold=30;
      const onStart = (e) => { const t=e.touches[0]; startX=t.clientX; startY=t.clientY; };
      const onEnd = (e) => {
        const t=e.changedTouches[0]; const dx=t.clientX-startX; const dy=t.clientY-startY;
        if (Math.abs(dx)<threshold && Math.abs(dy)<threshold) { this._emitAccelerate(); return; }
        if (Math.abs(dx)>Math.abs(dy)) { dx>0? this._emitMove({x:1,y:0}) : this._emitMove({x:-1,y:0}); }
        else { dy>0? this._emitAccelerate() : this._emitRotate(); }
      };
      window.addEventListener('touchstart', onStart, {passive:true});
      window.addEventListener('touchend', onEnd, {passive:true});
    }
  }
}
export const inputHandler = new InputHandler();

// ==== Sprite Preview Script ====
// Erwartet ein <canvas id="preview"> im HTML

class SpritePreview {
  // initialDirection: 'down' | 'up' | 'left' | 'right'
  constructor(canvasId, spriteUrl, weaponUrl = null, frameWidth = 64, frameHeight = 64, initialDirection = 'down') {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) throw new Error('SpritePreview: Canvas mit id="' + canvasId + '" nicht gefunden!');
    this.ctx = this.canvas.getContext("2d");

    this.spriteSheet = new Image();
    this.weaponSheet = weaponUrl ? new Image() : null;

    this.spriteSheet.onerror = () => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.fillStyle = '#c00';
      this.ctx.font = '16px sans-serif';
      this.ctx.fillText('Sprite nicht gefunden!', 12, 48);
    };
    this.spriteSheet.src = spriteUrl;
    if (this.weaponSheet) this.weaponSheet.src = weaponUrl;

    this.frameWidth = frameWidth;
    this.frameHeight = frameHeight;

  // Einheitliches Richtungs-Mapping (Zeilenindex im Sheet):
  // 0 = up, 1 = left, 2 = down, 3 = right  (häufige Reihenfolge in einigen Sheets)
  // Falls dein Sheet Reihenfolge anders hat, hier anpassen.
  const dirMap = { up:0, left:1, down:2, right:3 };
  const initDirIdx = dirMap[initialDirection] !== undefined ? dirMap[initialDirection] : 2; // default down
  this.currentDir = initDirIdx;
  this.heldDir = initDirIdx; // Richtung, die aktuell gehalten wird
    this.keyDown = false;
    this.frameIndex = 0;
    this.frameCount = 3; // wird nach onload korrigiert
    this.tick = 0;
    this.tickPerFrame = 10; // Animationsgeschwindigkeit

    this.isLoaded = false;
    this.spriteSheet.onload = () => {
      this.isLoaded = true;
      // FrameCount dynamisch bestimmen (mindestens 1)
      const cols = Math.max(1, Math.floor(this.spriteSheet.naturalWidth / this.frameWidth));
      this.frameCount = Math.min(this.frameCount, cols) || cols;
      if(this.frameIndex >= this.frameCount) this.frameIndex = 0;
    };
    if(this.weaponSheet) {
      this.weaponSheet.onload = () => {
        // Prüfen ob das Overlay dieselbe Frame-Struktur hat – sonst als statisches Bild behandeln
        const wCols = Math.floor(this.weaponSheet.naturalWidth / this.frameWidth);
        const wRows = Math.floor(this.weaponSheet.naturalHeight / this.frameHeight);
        this.weaponIsSheet = wCols >= 1 && wRows >= 1 && (this.weaponSheet.naturalWidth % this.frameWidth === 0);
      };
    }

  this.initControls();
    requestAnimationFrame(() => this.loop());
  }

  initControls() {
    // Start-Richtung bleibt wie im Konstruktor gesetzt (standard: down)
    this.keyDown = false;
    // Mapping wie im Spiel: 0=up, 1=left, 2=down, 3=right
    this.heldKeys = [false, false, false, false];
    const getDir = (e) => {
      switch (e.key.toLowerCase()) {
        case "w": case "arrowup": return 0;
        case "a": case "arrowleft": return 1;
        case "s": case "arrowdown": return 2;
        case "d": case "arrowright": return 3;
        default: return null;
      }
    };
    window.addEventListener("keydown", (e) => {
      if (e.repeat) return; // Nur beim ersten Drücken reagieren
      const dir = getDir(e);
      if (dir !== null) {
        this.heldKeys[dir] = true;
        this.currentDir = dir;
      }
    });
    window.addEventListener("keyup", (e) => {
      const dir = getDir(e);
      if (dir !== null) {
        this.heldKeys[dir] = false;
        // Keine automatische Richtungsänderung mehr beim Loslassen
      }
    });
  }

  loop() {
    requestAnimationFrame(() => this.loop());
    if (!this.isLoaded) return;

    this.tick++;
    if (this.tick >= this.tickPerFrame) {
      this.tick = 0;
      this.frameIndex = (this.frameIndex + 1) % this.frameCount;
    }

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const x = (this.canvas.width - this.frameWidth) / 2;
    const y = (this.canvas.height - this.frameHeight) / 2;

  // Aktuelle Richtung anzeigen (default: down)
  // Mapping: 0=up, 1=left, 2=down, 3=right
  let dir = this.currentDir;

    // Sicherstellen, dass FrameIndex/Dir innerhalb der tatsächlichen Sheet-Größe liegen
    try {
      const maxCols = Math.max(1, Math.floor(this.spriteSheet.naturalWidth / this.frameWidth));
      const maxRows = Math.max(1, Math.floor(this.spriteSheet.naturalHeight / this.frameHeight));
      if(this.frameIndex >= maxCols) this.frameIndex = 0;
      if(dir >= maxRows) dir = 0;
      this.ctx.drawImage(
        this.spriteSheet,
        this.frameIndex * this.frameWidth,
        dir * this.frameHeight,
        this.frameWidth,
        this.frameHeight,
        x,
        y,
        this.frameWidth,
        this.frameHeight
      );
    } catch(err) {
      // Fallback: komplettes Bild mittig zeichnen
      try {
        const iw = this.spriteSheet.naturalWidth || this.frameWidth;
        const ih = this.spriteSheet.naturalHeight || this.frameHeight;
        this.ctx.drawImage(this.spriteSheet, x, y, iw, ih);
      } catch(_) {}
    }

    // Waffe-Overlay zeichnen, wenn vorhanden
    if (this.weaponSheet) {
      try {
        if(this.weaponIsSheet) {
          const wMaxCols = Math.max(1, Math.floor(this.weaponSheet.naturalWidth / this.frameWidth));
          const wMaxRows = Math.max(1, Math.floor(this.weaponSheet.naturalHeight / this.frameHeight));
          const wFrame = (this.frameIndex % wMaxCols);
          const wDir = dir < wMaxRows ? dir : 0;
          this.ctx.drawImage(
            this.weaponSheet,
            wFrame * this.frameWidth,
            wDir * this.frameHeight,
            this.frameWidth,
            this.frameHeight,
            x,
            y,
            this.frameWidth,
            this.frameHeight
          );
        } else {
          // Statisches Overlay: skaliert oder zentriert zeichnen
            const iw = this.weaponSheet.naturalWidth;
            const ih = this.weaponSheet.naturalHeight;
            const scale = Math.min(this.frameWidth/iw, this.frameHeight/ih, 1);
            const dw = iw * scale;
            const dh = ih * scale;
            this.ctx.drawImage(this.weaponSheet, x + (this.frameWidth-dw)/2, y + (this.frameHeight-dh)/2, dw, dh);
        }
      } catch(_) { /* Overlay einfach überspringen */ }
    }
  }
}
// Beispiel-Init:
// new SpritePreview("preview", "img/characters/Actor1.png", "img/characters/Sword.png");

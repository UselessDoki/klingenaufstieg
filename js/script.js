// Hübschere Truhe (Kastenform) mit flachem Deckel, Metallkanten & Glühen beim Öffnen
function drawChest(ctx, chest){
  if(!chest) return;
  const now = performance.now();
  if(chest.opened && !chest.openedAt) chest.openedAt = now;
  const r = chest.r || 22;
  const baseH = r * 1.15;     // Korpus-Höhe
  const lidTh = Math.max(8, r * 0.35); // Deckel-Dicke (flach)
  const openDur = 300; // ms bis Deckel offen
  const openT = chest.opened ? Math.min(1, (now - (chest.openedAt||0)) / openDur) : 0;
  const fadeT = chest.opened ? Math.min(1, (now - (chest.openedAt||0) - 500)/400) : 0; // nach 0.5s langsam ausblenden
  ctx.save();
  ctx.translate(chest.x, chest.y);
  if(fadeT>=1){ chest._removeAt = chest._removeAt || (now+1); ctx.restore(); return; }
  if(fadeT>0) ctx.globalAlpha *= (1 - fadeT);
  // Schatten
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.beginPath(); ctx.ellipse(0, r*1.05, r*1.15, r*0.45, 0, 0, Math.PI*2); ctx.fill();
  // Korpus (Holz-Kasten, klare Kanten)
  const bodyG = ctx.createLinearGradient(-r,0,r,0);
  bodyG.addColorStop(0,'#4e2c10');
  bodyG.addColorStop(0.5,'#7d4a19');
  bodyG.addColorStop(1,'#3f230c');
  ctx.fillStyle = bodyG;
  ctx.fillRect(-r, -baseH*0.15, r*2, baseH);
  // Holz Rillen (dezent, horizontal)
  ctx.strokeStyle='rgba(0,0,0,0.25)'; ctx.lineWidth=1;
  for(let i=1;i<=2;i++){ ctx.beginPath(); ctx.moveTo(-r+4, -baseH*0.15 + (baseH/3)*i); ctx.lineTo(r-4, -baseH*0.15 + (baseH/3)*i); ctx.stroke(); }
  // Kanten-Highlights (oben)
  ctx.strokeStyle='rgba(255,255,255,0.08)'; ctx.lineWidth=2;
  ctx.beginPath(); ctx.moveTo(-r, -baseH*0.15); ctx.lineTo(r, -baseH*0.15); ctx.stroke();
  // Metall-Ecken
  const metalG = ctx.createLinearGradient(0,-baseH,0,baseH);
  metalG.addColorStop(0,'#b59f55');
  metalG.addColorStop(0.5,'#f2e6b0');
  metalG.addColorStop(1,'#7a6832');
  ctx.fillStyle = metalG;
  const cornerW = Math.max(6, r*0.22), cornerH = Math.max(10, baseH*0.42);
  // links
  ctx.fillRect(-r-1, -baseH*0.1, cornerW, cornerH);
  // rechts
  ctx.fillRect(r-cornerW+1, -baseH*0.1, cornerW, cornerH);
  // Nieten
  ctx.fillStyle = '#d9c877';
  const rivet = (x,y)=>{ ctx.beginPath(); ctx.arc(x,y,2.2,0,Math.PI*2); ctx.fill(); };
  rivet(-r+cornerW*0.5, -baseH*0.05);
  rivet(-r+cornerW*0.5, -baseH*0.05+cornerH*0.5);
  rivet(r-cornerW*0.5, -baseH*0.05);
  rivet(r-cornerW*0.5, -baseH*0.05+cornerH*0.5);
  // Mittleres Band + Schloss
  ctx.fillStyle = metalG;
  const bandH = Math.max(10, baseH*0.2);
  ctx.fillRect(-r, -baseH*0.15 + baseH*0.5 - bandH/2, r*2, bandH);
  // Schlossplatte
  const lockW = Math.max(10, r*0.28), lockH = Math.max(10, bandH*0.85);
  ctx.fillStyle = '#2a2412'; ctx.fillRect(-lockW/2-1, -baseH*0.15 + baseH*0.5 - lockH/2, lockW+2, lockH);
  ctx.fillStyle = '#d8c777'; ctx.fillRect(-lockW/2, -baseH*0.15 + baseH*0.5 - lockH/2 + 2, lockW, lockH-4);
  // Schlüsselloch
  ctx.fillStyle = '#3a331b';
  ctx.beginPath(); ctx.arc(0, -baseH*0.15 + baseH*0.5, 2.2, 0, Math.PI*2); ctx.fill();
  ctx.fillRect(-1.2, -baseH*0.15 + baseH*0.5 + 2, 2.4, 6);
  // Deckel (flach), um Drehpunkt öffnen
  ctx.save();
  const lidPivotY = -baseH*0.15; // Oberkante Korpus
  ctx.translate(0, lidPivotY);
  const ang = -Math.PI*0.95 * easeOutCubic(openT);
  ctx.rotate(ang);
  // Deckelplatte
  const lidG = ctx.createLinearGradient(-r,0,r,0);
  lidG.addColorStop(0,'#5a3312');
  lidG.addColorStop(0.5,'#a86524');
  lidG.addColorStop(1,'#4a2b0f');
  ctx.fillStyle = lidG;
  ctx.fillRect(-r, -lidTh, r*2, lidTh);
  // Vorderkante-Glanz
  ctx.strokeStyle = 'rgba(255,255,255,'+(0.18*(1-openT))+')';
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(-r, 0); ctx.lineTo(r, 0); ctx.stroke();
  // Kleine Überlappungslippe
  ctx.fillStyle = 'rgba(0,0,0,0.2)';
  ctx.fillRect(-r, -1, r*2, 1);
  ctx.restore();
  // Inneres Leuchten beim Öffnen
  if(openT>0){
    const glow = ctx.createRadialGradient(0, -baseH*0.05, 4, 0, -baseH*0.05, r*1.2);
    glow.addColorStop(0,'rgba(255,240,170,'+(0.85*openT)+')');
    glow.addColorStop(0.35,'rgba(255,200,90,'+(0.55*openT)+')');
    glow.addColorStop(1,'rgba(255,180,40,0)');
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(0,-baseH*0.05,r*1.25,0,Math.PI*2); ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
  }
  ctx.restore();
}
function easeOutCubic(t){ return 1-Math.pow(1-t,3); }
// Segen-Konfiguration
const BLESSING = {
  id: 'blessing',
  name: 'Segen der Perfektion',
  desc: 'Alle Stats +5%, weil du alle Buffs maximiert hast!',
  icon: '✨',
  apply() { 
    // Idempotent: nur einmal anwenden
    if (window._blessingGiven) return;
    window._blessingGiven = true;
    // +5% auf zentrale skalierende Werte
    player.bossDamageMul *= 1.05;
  // Erhöhe nur die unveränderte Grundbasis, nicht eine bereits gebuffte aktuelle Geschwindigkeit
  if(typeof player.speedBase0 !== 'number') player.speedBase0 = 200;
  player.speedBase0 *= 1.05;
  player.speedBase = player.speedBase0;
  // player.speed wird im Frame-Recalc gesetzt
    player._xpBoost = (player._xpBoost||1) * 1.05;
    // Lifesteal auch leicht erhöhen (falls 0 -> kleiner Startwert)
    if (!buffs.lifesteal || buffs.lifesteal <= 0) buffs.lifesteal = 0.0005; else buffs.lifesteal *= 1.05;
    // Optional: kleiner allgemeiner Damage-Multiplikator falls vorhanden
    if (buffs.dmg) buffs.dmg *= 1.05; else buffs.dmg = 1.05;
  }
};
// Truhen-Treffer-Logik: Prüfe auf Treffer durch Spielerangriff (wie bei Gegnern)
function hitChestAt(x, y) {
  // Truhen werden nicht mehr zerstört, sondern nur durch Überlaufen geöffnet
  return false;
}
// Öffnet eine Truhe, setzt sie auf "opened" und gibt Loot
function openChest(chest) {
  if (!chest || chest.opened) return;
  chest.opened = true;
  chest.openedAt = performance.now();
  // Drop loot at chest position
  if (typeof dropLoot === 'function') {
    dropLoot(chest.x, chest.y);
  }
}
// (Duplicate older definition removed; unified shorter despawn logic above)
// Truhen-Feedback (HitFlash) updaten
const origUpdate = typeof update === 'function' ? update : null;
// Entfernt: frühere gepatchte window.update Erweiterung (Kristof Bewegung) – jetzt direkt in step integriert

// Loot-Items Definition
const LOOT_ITEMS = [
  { id: 'bossdmg', name: 'Boss-DMG', desc: 'Erhöhe deinen Schaden gegen Bosse.', icon: '👑', maxStacks: 99, apply: (count) => {
    let bonus = 0;
    for(let i=1;i<=count;i++){
      if(i<=10) bonus += 0.01;
      else if(i<=20) bonus += 0.005;
      else if(i<=30) bonus += 0.0025;
      else bonus += 0.001;
    }
    player.bossDamageMul = 1 + bonus;
  } },
  { id: 'speed', name: 'Tempo', desc: 'Erhöhe dein Bewegungstempo.', icon: '💨', maxStacks: 99, apply: (count) => {
    let bonus = 0;
    for(let i=1;i<=count;i++){
      if(i<=10) bonus += 0.01;
      else if(i<=20) bonus += 0.005;
      else if(i<=30) bonus += 0.0025;
      else bonus += 0.001;
    }
    player.speedBase = player.speedBase0 * (1 + bonus);
  } },
  { id: 'bladeregen', name: 'Blatt der Heilung', desc: 'Heilt dich jede Sekunde.', icon: '🍃', maxStacks: 99, apply: (count) => {
    let bonus = 0;
    for(let i=1;i<=count;i++){
      if(i<=10) bonus += 1;
      else if(i<=20) bonus += 0.5;
      else if(i<=30) bonus += 0.25;
      else bonus += 0.1;
    }
    player._bladeregen = bonus;
  } },
  { id: 'xp', name: 'XP-Boost', desc: 'Erhalte mehr XP.', icon: '📘', maxStacks: 99, apply: (count) => {
    let bonus = 0;
    for(let i=1;i<=count;i++){
      if(i<=10) bonus += 0.01;
      else if(i<=20) bonus += 0.005;
      else if(i<=30) bonus += 0.0025;
      else bonus += 0.001;
    }
    player._xpBoost = 1 + bonus;
  } },
  { id: 'lifesteal', name: 'Mini-Lifesteal', desc: 'Erhalte Lifesteal.', icon: '🩸', maxStacks: 99, apply: (count) => {
    let bonus = 0;
    for(let i=1;i<=count;i++){
      if(i<=10) bonus += 0.001;
      else if(i<=20) bonus += 0.0005;
      else if(i<=30) bonus += 0.00025;
      else bonus += 0.0001;
    }
    buffs.lifesteal = bonus;
  } },
  // Einzigartige Feder der Wahrheit – zählt jetzt für den Segen
  { id: 'truthfeather', name: 'Feder der Wahrheit', desc: 'Einzigartig: Alle Kernwerte +3% (Schaden vs Boss, Tempo, XP, Lifesteal Basis).', icon: '🪶', maxStacks: 1, apply: () => {
      // Multiplikative Verstärkung nach anderen Items (daher am Ende der Liste)
      player.bossDamageMul *= 1.03;
      // Speed: Basis anheben, dann aktuelle anwenden
      player.speedBase0 *= 1.03;
      player.speedBase *= 1.03;
      player.speed = player.speedBase;
      player._xpBoost = (player._xpBoost||1) * 1.03;
      if(!buffs.lifesteal || buffs.lifesteal < 0.0005) buffs.lifesteal = (buffs.lifesteal||0) + 0.0005; else buffs.lifesteal *= 1.03;
    } },
  // Feder der Wahrheit ist Spezial-Drop, nicht in Kisten
];

// Gesammelte Loot-Items (jetzt als Array von {id, count})
window.collectedLoot = window.collectedLoot || [];

// Loot droppen und vergeben
function dropLoot(x, y, specialDrop) {
  // Truth Feather nach Boss
  if(specialDrop === 'truthfeather') {
    if(!window.collectedLoot.find(l => l.id === 'truthfeather')) {
      window.collectedLoot.push({id: 'truthfeather', count: 1});
      applyAllLootEffects && applyAllLootEffects();
      showLootMessage && showLootMessage({icon: '🪶', name: 'Feder der Wahrheit'});
      // Einmalige Spezial-Nachricht animiert einfliegen & "schreibt" sich
      if(!window._truthFeatherAnnouncementShown){
        window._truthFeatherAnnouncementShown = true;
        const wrap = document.createElement('div');
        wrap.style.position = 'fixed';
        wrap.style.left = '50%';
        wrap.style.top = '32%';
        wrap.style.transform = 'translate(-50%, -80px) scale(0.92)';
        wrap.style.opacity = '0';
        wrap.style.padding = '26px 46px 30px';
        wrap.style.background = 'linear-gradient(135deg, rgba(25,25,28,0.92), rgba(15,15,18,0.92))';
        wrap.style.backdropFilter = 'blur(6px)';
        wrap.style.border = '1px solid #ffbf47aa';
        wrap.style.borderRadius = '22px';
        wrap.style.boxShadow = '0 14px 40px -10px #000e, 0 0 0 1px #000 inset, 0 0 24px -6px #ffbf4788';
        wrap.style.fontFamily = 'inherit';
        wrap.style.color = '#ffe9c4';
        wrap.style.textAlign = 'center';
        wrap.style.zIndex = 10000;
        wrap.style.pointerEvents = 'none';
        wrap.style.maxWidth = '640px';
        wrap.style.lineHeight = '1.25em';
        const title = document.createElement('div');
        title.textContent = 'The Truth?';
        title.style.fontSize = '2.4em';
        title.style.letterSpacing = '1px';
        title.style.fontWeight = '800';
        title.style.marginBottom = '10px';
        title.style.background = 'linear-gradient(90deg,#fff 0%,#ffe9b0 35%,#ffb347 70%,#ff7c1f 100%)';
        title.style.webkitBackgroundClip = 'text';
        title.style.backgroundClip = 'text';
        title.style.color = 'transparent';
        title.style.textShadow = '0 0 14px #ffbb3388, 0 0 34px #ff7c1f55';
        const body = document.createElement('div');
        body.style.fontSize = '1.15em';
        body.style.fontWeight = '600';
        body.style.minHeight = '3.6em';
        body.style.whiteSpace = 'pre-wrap';
        body.style.fontFamily = 'Consolas, monospace';
        const line1 = 'Ur life sucks!';
        const line2 = 'You know it, I know it and everyone else too';
        let idx = 0;
        let current = '';
        const full = line1 + '\n' + line2;
        function typeNext(){
          if(idx <= full.length){
            current = full.slice(0, idx);
            // Stil: zweite Zeile kursiv & goldener Akzent
            const parts = current.split('\n');
            const html = parts.map((p,i)=> i===0 ? `<span style="color:#ffddb0;">${p}</span>` : `<em style="color:#ffd27a;font-style:italic;">${p}</em>`).join('<br>');
            body.innerHTML = html + (idx<full.length && performance.now()%600<300 ? '<span style="color:#ffbf47">▌</span>' : '<span style="color:#ffbf4700">▌</span>');
            idx++;
            setTimeout(typeNext, idx < line1.length ? 38 : 32); // leicht schneller in Zeile 2
          } else {
            // Cursor nach Ende ausblenden
            setTimeout(()=>{ body.innerHTML = body.innerHTML.replace(/<span[^>]*>▌<\/span>/,''); }, 600);
            // Auto-Remove nach 4s
            setTimeout(()=>{
              wrap.style.transition = 'opacity .6s, transform .7s cubic-bezier(.6,-0.2,.4,1.2)';
              wrap.style.opacity = '0';
              wrap.style.transform = 'translate(-50%, -120px) scale(.82)';
              setTimeout(()=>wrap.remove(), 800);
            }, 4000);
          }
        }
        wrap.appendChild(title);
        wrap.appendChild(body);
        document.body.appendChild(wrap);
        requestAnimationFrame(()=>{
          wrap.style.transition = 'opacity .65s ease, transform .75s cubic-bezier(.22,1.2,.28,1)';
          wrap.style.opacity = '1';
          wrap.style.transform = 'translate(-50%, 0) scale(1)';
          typeNext();
        });
      }
    }
    window.truthFeatherEventActive = false;
    updateHUD && updateHUD();
    return;
  }
  // Effekt-Partikel am Drop-Ort
  for(let i=0;i<12;i++) particle(x + (Math.random()-0.5)*18, y + (Math.random()-0.5)*18, '#ffe600');

  // Wenn bereits ein Auswahlmenü offen ist, ignoriere weitere Drops, um Kollisionen zu vermeiden
  if (window._lootChoiceOpen) { return; }

  // Erzeuge bis zu 3 Kandidaten und öffne das Auswahlmenü
  const candidates = computeLootCandidates(3);
  if (candidates && candidates.length > 0) {
    openLootChoiceMenu(candidates);
  } else {
    // Fallback: Wenn aus irgendeinem Grund keine Kandidaten existieren, gib XP wie bisher
    grantFallbackXP();
    showLootMessage && showLootMessage({name:'Bonus-XP',icon:'⭐'});
  }
  updateHUD();
}

// Ermittelt bis zu n wählbare Loot-Karten. Nutzt LOOT_ITEMS, schließt truthfeather aus.
function computeLootCandidates(n){
  const pool = LOOT_ITEMS.filter(item => {
    if(item.id === 'truthfeather') return false; // nur spezieller Drop
    const entry = window.collectedLoot.find(l => l.id === item.id);
    return !entry || entry.count < (item.maxStacks || 10);
  });
  const result = [];
  const max = Math.min(n||3, pool.length);
  const used = new Set();
  for(let i=0;i<max;i++){
    // zufälliges einzigartiges Item wählen
    if(pool.length === 0) break;
    let idx = Math.floor(Math.random()*pool.length);
    // Sicherstellen, dass wir keine Duplikate wählen
    let tries = 0;
    while(used.has(idx) && tries < 10){ idx = Math.floor(Math.random()*pool.length); tries++; }
    used.add(idx);
    result.push(pool[idx]);
  }
  // Falls zu wenige Items übrig (alles gemaxed), fülle mit XP-Karten auf
  while(result.length < (n||3)){
    result.push({ id:'xp-fallback', name:'Bonus-XP', desc:'Erhalte zusätzliche Erfahrungspunkte.', icon:'⭐', maxStacks:Infinity });
  }
  return result;
}

// Öffnet das Auswahlmenü, pausiert das Spiel und behandelt Eingaben
function openLootChoiceMenu(candidates){
  const overlay = document.getElementById('lootChoiceOverlay');
  const wrap = document.getElementById('lootChoiceCards');
  if(!overlay || !wrap){
    // Wenn Overlay fehlt, vergib einfach erstes Item direkt
    if(candidates && candidates.length){ applyLootChoice(candidates[0]); }
    return;
  }
  window._lootChoiceOpen = true;
  const prevRunning = state && state.running;
  if(state) state.running = false;
  overlay.classList.add('show');

  // Leeren und Karten rendern
  wrap.innerHTML = '';
  candidates.forEach((cand, i) => {
    const card = document.createElement('div');
    card.className = 'card';
    const idxKey = (i+1).toString();
    card.innerHTML = `
      <div class="top"><span class="icon">${cand.icon||'❔'}</span><span class="name">${cand.name||'?'}</span></div>
      <div class="desc">${cand.desc||''}</div>
      <div class="key">${idxKey}</div>
    `;
    card.addEventListener('click', () => { doChoose(cand); });
    wrap.appendChild(card);
  });

  function onKey(e){
    if(!window._lootChoiceOpen) return;
    const k = (e.key||'').toLowerCase();
    if(k==='escape'){ e.preventDefault(); e.stopPropagation(); return; }
    if(k==='1' && candidates[0]){ e.preventDefault(); doChoose(candidates[0]); }
    else if(k==='2' && candidates[1]){ e.preventDefault(); doChoose(candidates[1]); }
    else if(k==='3' && candidates[2]){ e.preventDefault(); doChoose(candidates[2]); }
  }
  document.addEventListener('keydown', onKey, true);

  function doChoose(choice){
    document.removeEventListener('keydown', onKey, true);
    overlay.classList.remove('show');
    window._lootChoiceOpen = false;
    applyLootChoice(choice);
    if(state) state.running = (prevRunning !== false);
  }
}

// Wendet die Auswahl an: Entweder XP oder ein Loot-Item stacken
function applyLootChoice(choice){
  if(!choice) return;
  if(choice.id === 'xp-fallback'){
    grantFallbackXP();
    showLootMessage && showLootMessage({name:'Bonus-XP',icon:'⭐'});
    updateHUD && updateHUD();
    return;
  }
  // Andernfalls Item in collectedLoot erhöhen
  let entry = window.collectedLoot.find(l => l.id === choice.id);
  if(entry) entry.count++; else window.collectedLoot.push({id: choice.id, count: 1});
  applyAllLootEffects && applyAllLootEffects();
  showLootMessage && showLootMessage({icon: choice.icon, name: choice.name});
  updateHUD && updateHUD();
}

function grantFallbackXP(){
  if (typeof getEnemyXP === 'function') {
    player.xp += getEnemyXP(1, player.level, 20);
  } else {
    player.xp += 10 + 2 * (player.level || 1);
  }
}

// Simple XP calculation helper (kept globally)
function getEnemyXP(enemyType, playerLevel, baseXP) {
  let multiplier = 1;
  if (enemyType === 2) multiplier = 2.5;
  if (enemyType === 3) multiplier = 6;
  return Math.round((baseXP + playerLevel * 2) * multiplier);
}

function applyAllLootEffects() {
  // Reset alle Effekte
  player.bossDamageMul = 1;
  player.speedBase0 = player.speedBase0 || player.speed || 200;
  player.speedBase = player.speedBase0;
  player._bladeregen = 0;
  player._xpBoost = 1;
  buffs.lifesteal = 0;
  let allMaxed = true;
  for(const loot of window.collectedLoot) {
    const item = LOOT_ITEMS.find(i => i.id === loot.id);
    if(item && typeof item.apply === 'function') item.apply(loot.count);
    if(item && (loot.count < (item.maxStacks || 10))) allMaxed = false;
  }
  // Setze player.speed auf speedBase (falls nicht schon verwendet)
  player.speed = player.speedBase;
  // Segen anwenden, wenn alle maxed
  window.hasBlessing = false;
  if(allMaxed && LOOT_ITEMS.every(item => window.collectedLoot.find(l => l.id === item.id && l.count >= (item.maxStacks || 10)))) {
    BLESSING.apply();
    window.hasBlessing = true;
  }
}

// Loot-Message anzeigen
// Zeigt die gesammelten Loot-Drops als Icon-Liste unter dem HP-Menü
function showLootMessage(loot) {
  // Wenn das neue HUD existiert, delegiere an dessen Update, damit Layout/Position stimmen
  if (document.getElementById('newTopHud')) {
    if (typeof window.updateCharacterNameHUD === 'function') window.updateCharacterNameHUD();
    return;
  }
  // Fallback: Legacy-Position unter dem (alten) #playerName
  let lootBar = document.getElementById('lootBar');
  if(!lootBar) {
    const nameDiv = document.getElementById('playerName');
    lootBar = document.createElement('div');
    lootBar.id = 'lootBar';
    lootBar.style.fontSize = '1.1em';
    lootBar.style.marginTop = '2px';
    lootBar.style.color = '#ffe600';
    lootBar.style.textAlign = 'left';
    lootBar.style.position = 'fixed';
    lootBar.style.left = (nameDiv?.offsetLeft || 70) + 'px';
    lootBar.style.top = ((nameDiv?.offsetTop + nameDiv?.offsetHeight + 8) || 120) + 'px';
    lootBar.style.zIndex = 3000;
    if(nameDiv && nameDiv.parentNode) nameDiv.parentNode.insertBefore(lootBar, nameDiv.nextSibling);
    else document.body.appendChild(lootBar);
  }
  lootBar.innerHTML = '';
  window.collectedLoot.forEach(l => {
    const item = LOOT_ITEMS.find(i => i.id === l.id);
    if(item){
      const iconSpan = document.createElement('span');
      iconSpan.textContent = item.icon + (l.count>1 ? '×'+l.count : '');
      iconSpan.title = item.name + (l.count>1 ? ' (x'+l.count+')' : '') + (item.desc ? ('\n'+item.desc) : '');
      iconSpan.style.marginRight = '8px';
      iconSpan.style.fontSize = '1.25em';
      lootBar.appendChild(iconSpan);
    }
  });
}

// Heilblatt-Effekt (jetzt alle 10 Sekunden, stackbar)
setInterval(()=>{
  if(player._bladeregen && player._bladeregen > 0) {
    const heal = Math.max(1, Math.round(player.maxHp * 0.0005 * player._bladeregen));
    player.hp = Math.min(player.maxHp, player.hp + heal);
    particle(player.x, player.y, '#38e1d7');
  }
}, 10000);

// XP-Boost anwenden (bei XP-Gewinn im Code berücksichtigen)
// ...existing code...

// Funktion: Setzt die Auswahl automatisch, wenn ein bestimmtes Sprite-Sheet im Hauptmenü geladen wird
function setSelectionFromSpriteSheet(sheetPath) {
  // sheetPath z.B. "img/Fred Animation/Fred Sword/walk.png"
  if (!sheetPath) return;
  const lower = sheetPath.toLowerCase();
  // Nur automatisch initialisieren, wenn der Nutzer noch keine explizite Auswahl gespeichert hat
  if(window.__userSelectionCommitted) return;
  if (lower.includes('fred') && lower.includes('sword')) {
    window.selectedCharacter = window.selectedCharacter || 'fred';
    window.selectedWeaponId = window.selectedWeaponId || 'sword';
  } else if (lower.includes('fred') && lower.includes('dagger')) {
    window.selectedCharacter = window.selectedCharacter || 'fred';
    window.selectedWeaponId = window.selectedWeaponId || 'dagger';
  } else if (lower.includes('fred') && lower.includes('halb')) {
    window.selectedCharacter = window.selectedCharacter || 'fred';
    window.selectedWeaponId = window.selectedWeaponId || 'halbard';
  } else if (lower.includes('fred') && lower.includes('staff')) {
    window.selectedCharacter = window.selectedCharacter || 'fred';
    window.selectedWeaponId = window.selectedWeaponId || 'staff';
  } else if (lower.includes('bully') && lower.includes('sword')) {
    window.selectedCharacter = window.selectedCharacter || 'bully';
    window.selectedWeaponId = window.selectedWeaponId || 'sword';
  } else if (lower.includes('bully') && lower.includes('dagger')) {
    window.selectedCharacter = window.selectedCharacter || 'bully';
    window.selectedWeaponId = window.selectedWeaponId || 'dagger';
  } else if (lower.includes('bully') && lower.includes('halb')) {
    window.selectedCharacter = window.selectedCharacter || 'bully';
    window.selectedWeaponId = window.selectedWeaponId || 'halbard';
  } else if (lower.includes('bully') && lower.includes('staff')) {
    window.selectedCharacter = window.selectedCharacter || 'bully';
    window.selectedWeaponId = window.selectedWeaponId || 'staff';
  }
}

// Loot-Icons unter dem Namen anzeigen
const origUpdateCharacterNameHUD = window.updateCharacterNameHUD;
window.updateCharacterNameHUD = function updateCharacterNameHUDPatched() {
  if(origUpdateCharacterNameHUD) origUpdateCharacterNameHUD();
  let nameDiv = document.getElementById('playerName');
  if(nameDiv) {
    let lootBar = document.getElementById('lootBar');
    if(!lootBar) {
      lootBar = document.createElement('div');
      lootBar.id = 'lootBar';
      lootBar.style.fontSize = '1.1em';
      lootBar.style.marginTop = '2px';
      lootBar.style.color = '#ffe600';
      lootBar.style.textAlign = 'left';
      lootBar.style.position = 'fixed';
      lootBar.style.left = (nameDiv.offsetLeft || 70) + 'px';
      lootBar.style.top = ((nameDiv.offsetTop + nameDiv.offsetHeight + 8) || 120) + 'px';
      lootBar.style.zIndex = 3000;
      nameDiv.parentNode.insertBefore(lootBar, nameDiv.nextSibling);
    }
    // Charakterspezifischer Waffen-Buff
    let charBuff = null;
    if(typeof player !== 'undefined' && typeof weapons !== 'undefined') {
      const w = weapons[player.weaponIndex];
      if(w) {
        if(character === 'fred' && w.id === 'sword') charBuff = {name:'SwordGod', desc:'Fred mit Schwert: Spezial-Buff aktiviert!'};
        if(character === 'fred' && w.id === 'halbard') charBuff = {name:'HalGod', desc:'Fred mit Halberd: Spezial-Buff aktiviert!'};
  if(character === 'bully' && w.id === 'staff') charBuff = {name:'Wizard', desc:'Bully mit Stab: Spezial-Buff aktiviert!'}; // Aura entfernt, Buff bleibt
  // Vereinheitlichung: kein spezieller Bully-Dolch Buff mehr (Fairness für alle)
  // (Ehemals: if(character === 'bully' && w.id === 'dagger') charBuff = {name:'Ezio', desc:'Bully mit Dolch: Spezial-Buff aktiviert!'};
      }
    }
    let lootHtml = '';
    if(charBuff) {
      lootHtml = `<span title='${charBuff.desc}' style='margin-right:10px;font-weight:bold;color:#ffe600;font-size:1.08em;'>${charBuff.name}</span>`;
    } else {
      lootHtml = '';
    }
    lootBar.innerHTML = lootHtml;
  }
}
let bossDebugActive = false;
let bossDebugLastHp = 0;
let bossDebugLogArr = [];
function setupTestBoss() {
  
  state.enemies = [];
  
  const spawnX = typeof player !== 'undefined' ? player.x : innerWidth/2;
  const spawnY = typeof player !== 'undefined' ? player.y - 180 : innerHeight/2 - 100;
  const boss = {
    x: spawnX + 30, 
    y: spawnY - 50, 
    r: 80, 
    hp: 20000,
    maxHp: 20000,
    dmg: 40,
    boss: true,
    name: 'Kristof',
    elite: true,
    lastHitId: -1,
    type: 'runner',
    shootTimer: 1.6,
    speed: 90,
    buffs: [],
    debuffs: [],
    dmgTaken: 0,
    lastHp: 20000,
    knockbackVX: 0,
    knockbackVY: 0,
    hitCooldown: 0
  };
  state.enemies.push(boss);
  state.kristof = boss; // Referenz für Shockwave / Testmodus
  bossDebugLastHp = boss.hp;
}

window.addEventListener('DOMContentLoaded', ()=>{
  const btn = document.getElementById('testBossBtn');
  if(btn) btn.onclick = function(ev) {
    const sm = document.getElementById('startMenu'); if(sm) sm.classList.remove('show');
    TESTMODE_BOSS = true;
    bossDebugActive = true;
    state.running = true;
    state.lastTime = performance.now();
    if(ev && ev.shiftKey){
      // Legacy Dummy Boss
      setupTestBoss();
    } else {
      startKristofTestMode();
    }
    const ov = document.getElementById('bossDebugOverlay'); if(ov) ov.style.display = 'block';
  };
  const atkBtn = document.getElementById('bossAttackBtn');
  if(atkBtn) atkBtn.onclick = function() {
    if(state.enemies.length) state.enemies[0].canAttack = true;
  };
});

// Falls der Testmodus-Button aus irgendeinem Grund nicht im DOM ist oder ausgeblendet wurde, rekonstruiere ihn.
(function ensureTestBossButton(){
  function inject(){
    let btn = document.getElementById('testBossBtn');
    if(!btn){
      const startMenu = document.getElementById('startMenu');
      if(!startMenu) return false;
      const panel = startMenu.querySelector('.panel');
      if(!panel) return false;
      // Füge unterhalb des Start-Buttons ein
      const container = panel.querySelector('button#startBtn')?.parentElement || panel;
      btn = document.createElement('button');
      btn.id = 'testBossBtn';
      btn.textContent = 'Testmodus: Kristof';
      btn.style.padding = '12px 28px';
      btn.style.borderRadius = '10px';
      btn.style.background = '#38e1d7';
      btn.style.color = '#222';
      btn.style.fontWeight = '900';
      btn.style.cursor = 'pointer';
      btn.style.border = '0';
      btn.style.fontSize = '1.05em';
      btn.style.letterSpacing = '1px';
      btn.style.boxShadow = '0 2px 12px #38e1d788,0 0 0 #0000';
      container.appendChild(btn);
    }
    // Sichtbar & aktiv erzwingen
    btn.disabled = false;
    btn.style.display = 'inline-block';
    if(!btn._wired){
      btn._wired = true;
      btn.addEventListener('click', (ev)=>{
        const sm = document.getElementById('startMenu'); if(sm) sm.classList.remove('show');
        TESTMODE_BOSS = true;
        bossDebugActive = true;
        state.running = true;
        state.lastTime = performance.now();
        if(ev && ev.shiftKey){
          setupTestBoss();
        } else {
          startKristofTestMode();
        }
        const ov = document.getElementById('bossDebugOverlay'); if(ov) ov.style.display = 'block';
      });
    }
    return true;
  }
  // Mehrere Versuche (falls Startmenü verzögert aufgebaut wird)
  let tries = 0;
  const int = setInterval(()=>{
    if(inject() || ++tries>15){ clearInterval(int); }
  }, 200);
})();

// Shortcut: Im Startmenü taste "B" für Boss-Testmodus (Kristof) sofort
window.addEventListener('keydown', (e)=>{
  if(e.key === 'b' || e.key === 'B'){
    const sm = document.getElementById('startMenu');
    if(sm && sm.classList.contains('show')){
      const btn = document.getElementById('testBossBtn');
      if(btn){ btn.click(); }
    }
  }
  // R für Halberd Ult NICHT mehr auf keydown auslösen!
  if(e.key === 'r' || e.key === 'R'){
    if(e.shiftKey && typeof window.forceSpin==='function'){ window.forceSpin(); return; }
    try {
      let char = (window.selectedCharacter||'').toLowerCase();
      if(!char && typeof character === 'string') char = character.toLowerCase();
      const wArr = window.weapons;
      if(!wArr || !Array.isArray(wArr)) { showMeteorToast('weapons[] fehlt'); return; }
      if(!player){ showMeteorToast('player fehlt'); return; }
      if(player.weaponIndex==null){ showMeteorToast('kein weaponIndex'); return; }
      const w = wArr[player.weaponIndex]; if(!w) return;
      // Meteor (Staff) auf keydown (jetzt ohne Character-Gating)
      if(w.id==='staff'){
        const m = window.staffMeteor; if(!m) return;
        if(m.timer <= 0 && !m.targeting && m.state==='idle'){
          loadMeteorSprite();
          m.targeting = true;
          m.holdStart = performance.now();
          m.targetX = mouseX; m.targetY = mouseY;
          m.summonActive = true; m.summonT = 0;
          // FEHLENDER State: setze jetzt echten windup-State damit Update-Loop m.windupT verarbeitet
          m.state = 'windup';
          m.windupT = 0;
        } else {
          showMeteorToast('Meteor bereit in '+m.timer.toFixed(1)+'s oder bereits aktiv');
        }
        return;
      }
      // Andere Kombinationen: reserviert / nichts tun
    } catch(err){ console.warn('[R-Ability dispatcher error]', err); }
  }
});

// Halberd Ult: NUR auf keyup R auslösen, mit Debounce damit nur EIN Trigger pro Tastendruck!
window._halberdUltKeyHeld = false;
window.addEventListener('keydown', (e)=>{
  if((e.key==='r'||e.key==='R') && window.weapons && player && player.weaponIndex!=null){
    const w = window.weapons[player.weaponIndex];
    if(w && w.id==='halbard'){
      if(!window._halberdUltKeyHeld){
        window._halberdUltKeyHeld = true;
        // Start charge via ability trigger
        if(window.abilityRegistry && window.abilityRegistry.ult && typeof window.abilityRegistry.ult.trigger==='function'){
          window.abilityRegistry.ult.trigger();
        }
      }
    }
  }
});
window.addEventListener('keyup', (e)=>{
  if((e.key==='r'||e.key==='R') && window.weapons && player && player.weaponIndex!=null){
    const w = window.weapons[player.weaponIndex];
    if(w && w.id==='halbard'){
      if(window._halberdUltKeyHeld){
        window._halberdUltKeyHeld = false;
        try {
          if(typeof releaseHalberdCharge==='function') releaseHalberdCharge();
        } catch(err){ console.warn('[HalberdUlt][keyup error]', err); }
      }
    }
  }
});
// ===== Global Damage Floaters Aggregator (vereinheitlichte Schadenszahlen) =====
// Konfiguration pro Typ
window.damageFloaterConfig = window.damageFloaterConfig || {
  basic: { color:'#ffffff', stroke:'#000000' },
  fire:  { color:'#ff7c2a', stroke:'#3a1200' },
  poison:{ color:'#55ff55', stroke:'#003300' },
  bleed: { color:'#ff3355', stroke:'#3a0010' },
  ult:   { color:'#ffd700', stroke:'#5a4500' },
  heal:  { color:'#66ffcc', stroke:'#004d33' },
  true:  { color:'#d0d0ff', stroke:'#000044' },
  misc:  { color:'#cccccc', stroke:'#222222' }
};
// Interne Liste
if(!window.damageFloaters) window.damageFloaters = [];
// Fügt Schaden zusammen: gleicher Typ + (nahe Position) + kurze Zeitspanne -> aggregation
window.addDamageFloater = function addDamageFloater(opts){
  // opts: {x,y,amount,type,crit=false}
  if(!opts || !isFinite(opts.amount) || opts.amount<=0) return;
  const now = performance.now()/1000;
  const type = opts.type || 'misc';
  const cfg = window.damageFloaterConfig[type] || window.damageFloaterConfig.misc;
  const maxAgeCombine = 0.35; // innerhalb 350ms kombinieren
  const radiusCombine = 32; // Pixel Nähe
  let best=null; let bestScore=0;
  for(const f of window.damageFloaters){
    if(f.type!==type) continue;
    if(now - f.lastAdd > maxAgeCombine) continue;
    const dx = f.x - opts.x; const dy = f.y - opts.y; const d2 = dx*dx+dy*dy; if(d2>radiusCombine*radiusCombine) continue;
    // Score: näher + frischer bevorzugen
    const score = (maxAgeCombine - (now - f.lastAdd)) + (radiusCombine*radiusCombine - d2)*0.0005;
    if(score>bestScore){ bestScore=score; best=f; }
  }
  if(best){
    best.amount += opts.amount;
    best.txt = ''+Math.round(best.amount);
    best.life = Math.min(best.life, 0.15); // kurze Reset Animation (pop)
    best.lastAdd = now;
    if(opts.crit) best.crit = true;
    if(window.damageFloaterDebug){ console.log('[DMG+]', type, '->', best.txt); }
  } else {
    window.damageFloaters.push({
      x:opts.x, y:opts.y, baseY:opts.y, vY:-24 - Math.random()*10, amount:opts.amount, txt:''+Math.round(opts.amount),
      type, color:cfg.color, stroke:cfg.stroke, life:0, dur:1.0, crit:!!opts.crit, lastAdd:now
    });
    if(window.damageFloaterDebug){ console.log('[DMG]', type, Math.round(opts.amount)); }
  }
};
// Update + Render Hook wird später im Haupt-Render ergänzt (falls noch nicht vorhanden)

// Release logic function (single powerful sweep)
function releaseHalberdCharge(){
  const hu = window.halberdUlt; if(!hu || hu.state!=='charging') return;
    // compute final charge
  hu.chargeTime = Math.min(hu.maxCharge, (performance.now()-hu.chargeStart)/1000);
  const pct = hu.chargeTime / hu.maxCharge;
  hu.finalMultiplier = 3 + 2 * pct; // 3.0 -> 5.0
  const radius = 240 + 160 * pct; // 240 -> 400 radius scaling
  if(!state.sweeps) state.sweeps = [];
  const sid = (state._sweepId = (state._sweepId||0)+1);
  // Camera shake scaling
  if(typeof window._halberdUltShake==='undefined') window._halberdUltShake=0;
  window._halberdUltShake = 1.0 + 1.4 * pct;
  // Particles charge release
  for(let i=0;i<24;i++) particle(player.x + (Math.random()-0.5)*radius*0.6, player.y + (Math.random()-0.5)*radius*0.6, 'rgba('+Math.round(255*(0.6+pct*0.4))+','+Math.round(80+120*pct)+',0,'+(0.6+0.3*Math.random())+')');
  state.sweeps.push({ id:sid, startTime:state.time, dur:0.9, angle:0, targetAngle:Math.PI*2, radius, width:60+40*pct, color:'#b0b0b0', edgeColor:'#a80000', dmg:0, age:0, weaponIndex:player.weaponIndex, isHalberdUlt:true, halberdMultiplier:hu.finalMultiplier, halberdLifesteal:true });
  // Damage application immediate (like existing sweeps do tick elsewhere? ensure manual application here once)
  for(const e of state.enemies){
    if(e.hp>0 && Math.hypot(e.x-player.x, e.y-player.y) < radius + (e.r||0)){
      // damage
      let base = player.dmg * hu.finalMultiplier;
      if(e.boss) base *= 0.7; // keep boss reduction similar to previous
      const dmg = Math.round(base);
      e.hp -= dmg;
      e.hitFlash = 0.28;
        if(typeof window.addDamageFloater==='function'){
        window.addDamageFloater({x:e.x, y:e.y-(e.r||24), amount:dmg, type:'ult'});
      }
      // lifesteal
      if(dmg>0){
        const heal = Math.max(1, Math.round(dmg*0.10));
        player.hp = Math.min(player.maxHp||player.hp, player.hp + heal);
        // small heal particles
        for(let h=0;h<3;h++) particle(player.x+(Math.random()-0.5)*28, player.y+(Math.random()-0.5)*28, 'rgba(80,255,120,0.55)');
      }
  if(e.hp<=0){ if(e.boss) handleBossPhaseAfterDamage(e); else if(typeof window.killEnemy==='function') window.killEnemy(state.enemies.indexOf(e), e); }
    }
  }
  // set cooldown
  hu.state='cooldown';
  hu.timer = hu.cd;
  hu._autoReleased = false;
  // reset charge specific fields
  hu.chargeStart=0; hu.chargeTime=0;
}

// ================== Ability Registry & Dynamic Dispatch (Drag/Remap Vorbereitung) ==================
// Zentrales Binding-System (Basis-Version, spätere Drag&Drop Integration in abilityBar.js)
;(function initAbilityRegistry(){
  if(window.__abilityRegistryInit) return; window.__abilityRegistryInit = true;
  const reg = {};
  function define(id, def){
    // showCondition -> optional Predicate (true = anzeigen). Default immer true.
    reg[id] = Object.assign({id, trigger: ()=>{}, cdGetter:()=>0, timerGetter:()=>0, activeGetter:()=>false, readyGetter:()=>true, showCondition:()=>true, placeholder:false}, def);
  }
  // Ult-Auswahl: Meteor (Stab) oder Platzhalter; Schwert hat jetzt nur noch Passive (Mondklinge), kein Spin mehr
  // Halberd Ult NEW (Hold & Release Single Sweep)
  window.halberdUlt = {
    state: 'idle', // 'idle','charging','cooldown'
    timer: 0,      // cooldown timer
  cd: 50,        // fixed 50s after release (zuvor 30s / ursprünglich 20s)
    chargeStart: 0,
    chargeTime: 0,
    maxCharge: 5,  // seconds
    finalMultiplier: 3, // computed on release (3.0 - 5.0)
    slowFactor: 0.25, // movement speed multiplier while charging
    mitigation: 0.5,  // 50% dmg taken while charging
    // --- Leichter Sog während Aufladung ---
    pullEnabled: true,
    pullRadiusBase: 220,
    pullRadiusMax: 420,
    pullForceBase: 28,     // Pixel pro Sekunde (Basis)
    pullForceMax: 90,      // bei voller Ladung
    pullEliteFactor: 0.35, // Elite nur schwach ziehen
    pullBossFactor: 0.15,  // Bosse fast gar nicht
    pullClampDist: 42      // nicht näher als dieser Abstand an den Spieler "einsaugen"
  };

  // Dagger Execute Ult State
  window.daggerExecute = window.daggerExecute || {
    cd: 4,
    timer: 0,
    active: false,
    auto: true // auto-execute standardmäßig aktiv
  };
  // Max Reichweite für Dagger-Ult (nur Ziele innerhalb dieser Distanz gültig)
  window.daggerExecuteRange = window.daggerExecuteRange || 520;
  // Container für kurzlebige Slash-FX
  window.executeFX = window.executeFX || [];
  function pushExecuteFX(x, y, angle){
    window.executeFX.push({ x, y, a: angle||0, t:0, dur:0.25 });
  }
  function isRangedEnemy(e){
    if(!e) return false;
    if(e.type === 'ranged') return true; // Primär: explizites Typfeld
    // Fallback (ältere Gegnerobjekte), nur wenn kein type gesetzt:
    if(!('type' in e) && typeof e.shootTimer === 'number' && e.shootTimer < 9999) return true;
    return false;
  }
  function findDaggerExecuteTarget(){
    if(!Array.isArray(state.enemies)) return null;
    const range = window.daggerExecuteRange || 520;
    let best=null; let bestDist=range+1;
    for(let i=0;i<state.enemies.length;i++){
      const e = state.enemies[i];
      if(!e || e.hp<=0) continue;
      if(e.boss || e.elite) continue;
      if(!isRangedEnemy(e)) continue;
      const d = Math.hypot(e.x-player.x, e.y-player.y);
      if(d>range) continue; // außerhalb der Reichweite -> ignorieren
      if(d < bestDist){ bestDist=d; best={e, idx:i}; }
    }
    if(best && window.daggerExecuteDebug){
      console.log('[DaggerExecute][Target]', {idx: best.idx, hp: best.e.hp, type: best.e.type, dist: bestDist});
    }
    return best;
  }
  // Export für Loop Auto-Execute
  window.findDaggerExecuteTarget = findDaggerExecuteTarget;
  window.executeDaggerOnTarget = executeDaggerOnTarget;
  function executeDaggerOnTarget(target){
    const e = target.e; const idx = target.idx;
    // Teleport hinter Gegner (relativ zur aktuellen Spielerposition)
    const a = Math.atan2(player.y - e.y, player.x - e.x);
    // Partikel am Ursprungsort
    for(let i=0;i<10;i++) particle(player.x+(Math.random()-0.5)*24, player.y+(Math.random()-0.5)*24, 'rgba(255,255,255,0.6)');
    const off = (e.r||24) + (player.r||18) + 10;
    player.x = e.x - Math.cos(a)*off;
    player.y = e.y - Math.sin(a)*off;
    // Kurze I-Frames
    player.iFrames = Math.max(player.iFrames||0, 0.25);
    // Slash-FX und Treffer-Feedback
    pushExecuteFX(e.x, e.y, a + Math.PI/2);
    e.hitFlash = 0.35;
    for(let i=0;i<16;i++) particle(e.x+(Math.random()-0.5)*(e.r||20), e.y+(Math.random()-0.5)*(e.r||20), 'rgba(255,220,220,0.85)');
    // FORCED EXECUTE: entferne Schutzmechaniken & töte sofort
    e.shield = 0; e.barrier = 0; e.invulnerable = false; e.damageReduction = 0;
    // Setze HP deutlich unter 0 damit keine Post-Hit-Heal oder Clamps sie zurückholen
    e.hp = -999999;
    let killed=false;
    try {
      if(typeof handleBossPhaseAfterDamage === 'function' && e.boss){
        handleBossPhaseAfterDamage(e, idx);
      }
      if(typeof killEnemy === 'function'){
        killEnemy(idx, e);
        // Prüfen ob Slot entfernt oder markiert wurde
        if(!state.enemies[idx] || state.enemies[idx] !== e || e.hp <= 0) killed=true;
      }
    } catch(execErr){ console.warn('[DaggerExecute][forceKill] error', execErr); }
    // Fallback: Hard remove falls noch vorhanden + hp <=0
    if(!killed){
      try {
        if(state.enemies[idx] === e){ state.enemies.splice(idx,1); killed=true; }
      } catch(_r){ /* ignore */ }
    }
    if(window.daggerExecuteDebug){ console.log('[DaggerExecute] Forced kill', {killed, idx, name:e.name, boss:!!e.boss}); }
    // Cooldown setzen
    const d = window.daggerExecute; if(d){ d.timer = d.cd; d.active = false; }
    // Heal: 5% max HP wenn Fern-Normaler exekutiert wurde
    try {
      if(killed && e && !e.boss && !e.elite && isRangedEnemy(e)) {
        const healAmt = Math.max(1, Math.round((player.maxHp||player.hp||0) * 0.05));
        player.hp = Math.min(player.maxHp||player.hp, player.hp + healAmt);
        // Optionale kleine Heal Partikel
        for(let i=0;i<6;i++) particle(player.x+(Math.random()-0.5)*28, player.y+(Math.random()-0.5)*28, 'rgba(80,255,140,0.85)');
        // Optional Debug
        // console.log('[DaggerExecute][Heal]', healAmt, '->', player.hp);
      }
    } catch(_h){}
  }

  define('ult', {
    icon:'☄️',
  desc:'Ultimative Fähigkeit: Stab = Meteor (halten), Schwert = Mondklinge (passiv), Halberd = Aufladen & einzelner Rundumschlag.',
  // Immer anzeigen, Variante dynamisch (kein Spin mehr für Sword)
    showCondition(){ return true; },
    variant(){
      let char=(window.selectedCharacter||'').toLowerCase(); if(!char && typeof character==='string') char=character.toLowerCase();
      const wArr=window.weapons; let w=null; if(wArr && player && player.weaponIndex!=null) w=wArr[player.weaponIndex];
  // Sword Spin entfernt (ersetzt durch passive Mondklinge)
      // Sword Passive Tooltip (Moon Slash + Damage Scaling)
      if(w && w.id==='sword') {
        return {
          name: 'Mondklinge (passiv)',
            // Icon angepasst: Echte Sichel statt ehemaligem Speed-Buff Symbol
            icon: '🌘',
            desc: 'Schwert: +5 Schaden pro Spieler-Level. Ab Waffen-Lv 5 jeder 15. echte Treffer -> Mondschnitt, durchschneidet alle Gegner in Linie (skaliert mit Schaden).',
            available: false
        };
      }
  if(w && w.id==='staff') return {name:'Meteor (R)', icon:'☄️', desc:'Beschwöre einen mächtigen Meteor der Flächenschaden verursacht.', available:true};
      if(w && w.id==='dagger'){
        const d = window.daggerExecute || {timer:0, cd:4};
        const t = findDaggerExecuteTarget();
        const available = !!t && d.timer<=0;
  const rangeTxt = (window.daggerExecuteRange||520)+'px';
  return { name:'Sprung Exekution (R)', icon:'🗡️', desc:'Alle 4s per R: springt zum nächsten Fern-Normalgegner innerhalb '+rangeTxt+' und exekutiert ihn. Heilung: 5% max HP pro Kill.', available };
      }
      if(w && w.id==='halbard') {
        const hu = window.halberdUlt;
        const icon='🪓';
        if(hu.state==='cooldown') return {name:'Halberd Cooldown', icon, desc:'Ult lädt ('+hu.timer.toFixed(1)+'s)...', available:false};
        if(hu.state==='charging') {
          const pct = Math.min(1, hu.chargeTime/hu.maxCharge);
            const percTxt = Math.round(pct*100);
          return {name:'Aufladen ('+percTxt+'%)', icon, desc:'Halte R (bis 5s) -> Loslassen: EIN mächtiger Rundumschlag (300%-500% Schaden, Radius skaliert). 50% weniger erlittener Schaden & stark verlangsamt.', available:false};
        }
  return {name:'Halberd Aufladen (R halten)', icon, desc:'Halte bis 5s: Schaden & Radius skalieren (300% -> 500%), dann ein einziger Rundumschlag. 10% Lifesteal des verursachten Schadens. CD 50s.', available:true};
      }
      return {name:'Ult (R)', icon:'✖', desc:'Keine Ult für diese Kombination.', available:false};
    },
    // NOTE: obige Version blendet Slot komplett aus, was zu "nicht sichtbar" führte wenn Context noch nicht initialisiert.
    // Falls Problem erneut: Alternative Logik (konservativ anzeigen) unten einkommentieren und obere entfernen:
    /*
    showCondition(){
      let char=(window.selectedCharacter||'').toLowerCase(); if(!char && typeof character==='string') char=character.toLowerCase();
      const wArr=window.weapons; if(!wArr||!player||player.weaponIndex==null) return true; // solange nicht bestimmt -> anzeigen
      const w=wArr[player.weaponIndex]; if(!w) return true;
  if(w.id==='staff') return true;
  if(w.id==='sword') return false; // kein aktiver Ult-Button für Schwert
      return false; // alle anderen Waffen -> ausblenden
    },
    */
    trigger(){ try {
      let char=(window.selectedCharacter||'').toLowerCase(); if(!char && typeof character==='string') char=character.toLowerCase();
      const wArr=window.weapons; if(!wArr||!player||player.weaponIndex==null) return;
      const w=wArr[player.weaponIndex]; if(!w) return;
  // (ehem. Spin-Aufruf entfernt)
  if(w.id==='staff'){
        const m=window.staffMeteor; if(!m) return; if(m.timer<=0 && !m.targeting && m.state==='idle'){
          loadMeteorSprite(); m.targeting=true; m.holdStart=performance.now(); m.targetX=mouseX; m.targetY=mouseY; m.summonActive=true; m.summonT=0; }
      }
      if(w && w.id==='dagger'){
        const d = window.daggerExecute; if(!d) return;
        if(d.timer>0) return; // Cooldown aktiv
        const t = findDaggerExecuteTarget();
        if(!t){ if(typeof showMeteorToast==='function') showMeteorToast('Nur Fernkampf-Normalgegner in Reichweite exekutierbar.'); return; }
        // Double-check Sicherung gegen falsche Zielklassifizierung
        if(!isRangedEnemy(t.e)) { if(typeof showMeteorToast==='function') showMeteorToast('Ziel ist kein Fernkampf-Gegner.'); return; }
        executeDaggerOnTarget(t);
        return;
      }
      if(w && w.id==='halbard') {
        const hu = window.halberdUlt;
        // If idle and off cooldown -> start charging
        if(hu.state==='idle' && hu.timer<=0){
          hu.state='charging';
          hu.chargeStart = performance.now();
          hu.chargeTime = 0;
          if(typeof window._halberdUltShake==='undefined') window._halberdUltShake=0;
          window._halberdUltShake = 0.6; // small tremor start
        }
        // If already charging (rapid re-trigger ignored)
        return;
      }
    } catch(err){ console.warn('[ult trigger error]', err);} },
  cdGetter(){ let char=(window.selectedCharacter||'').toLowerCase(); const wArr=window.weapons; if(!wArr||!player) return 0; const w=wArr[player.weaponIndex];
  if(w&&w.id==='staff'&&window.staffMeteor) return window.staffMeteor.cd;
  if(w&&w.id==='halbard') return window.halberdUlt.cd;
    if(w&&w.id==='dagger') return (window.daggerExecute&&window.daggerExecute.cd)||0;
    return 0; },
  timerGetter(){ let char=(window.selectedCharacter||'').toLowerCase(); const wArr=window.weapons; if(!wArr||!player) return 0; const w=wArr[player.weaponIndex];
  if(w&&w.id==='staff'&&window.staffMeteor) return window.staffMeteor.timer;
  if(w&&w.id==='halbard') return window.halberdUlt.timer;
    if(w&&w.id==='dagger') return (window.daggerExecute&&window.daggerExecute.timer)||0;
    return 0; },
  activeGetter(){ let char=(window.selectedCharacter||'').toLowerCase(); const wArr=window.weapons; if(!wArr||!player) return false; const w=wArr[player.weaponIndex];
  if(w&&w.id==='staff'&&window.staffMeteor) return window.staffMeteor.state!=='idle';
  if(w&&w.id==='halbard') return window.halberdUlt.state==='charging';
    if(w&&w.id==='dagger') return false; // kurzer Teleport/Strike -> nicht als 'active' halten
    return false; },
  readyGetter(){ return this.timerGetter()<=0; }
  });
  define('curse', {
    icon:'⛓️',
    uiName:'Paralyse',
    desc:'Paralyse-Zone: Halten zum Zielen, loslassen für Sog + Bewegungs-Lähmung & Verwundbarkeit.',
    trigger(){ try { const c=window.curseSkill; if(!c) return; if(c.timer>0||c.targeting||c.state!=='idle') return; loadCurseSprite(); c.targeting=true; c.holdStart=performance.now(); c.targetX=mouseX; c.targetY=mouseY; } catch(e){ console.warn(e);} },
    cdGetter(){ return window.curseSkill?window.curseSkill.cd:0; }, timerGetter(){ return window.curseSkill?window.curseSkill.timer:0; }, activeGetter(){ return window.curseSkill && window.curseSkill.state!=='idle'; }, readyGetter(){ return window.curseSkill && window.curseSkill.timer<=0; }
  });
  // ================= Feuerfeld (Q) =================
  // Spezifikation: 5s Zone, 1s Ticks, -25% Movespeed im Feld (sofort weg beim Verlassen), Burn bis 3 Stacks.
  // Schaden: pro Stack 50% BaseDMG (player.dmg * buffs.dmg) pro Tick. Stacks laufen 5s einzeln aus.
  // Modus B (gewählt): Nur neu hinzugefügter Stack erhält volle Dauer; bestehende Stacks werden NICHT refreshed, wenn max erreicht.
  window.fireFieldConfig = Object.assign({
    radius: 120,
    shape: 'circle', // optional 'square'
    duration: 5,
    tickEvery: 1,
    slowPct: 0.25,
    maxStacks: 3,
    stackDuration: 5,
    dmgPerStackMul: 0.5,
    cooldown: 10,
    commitOnSecondQ: false, // entfernt Logik – bleibt für Abwärtskompat., aber ungenutzt
    showPreviewHint: false   // kein Hilfetext beim Zielen
  }, window.fireFieldConfig||{});
  /*
    Feuerfeld (Staff Q) – Zusammenfassung
    -------------------------------------------------
    Platzierung: Sofort auf Mausposition, nur Staff.
    Lebensdauer: duration (s) – standard 5s.
    Ticks: Alle tickEvery Sekunden -> fügt neuen Burn-Stack hinzu wenn Gegner im Feld & unter maxStacks.
    Schaden: pro Tick: (player.dmg * buffs.dmg) * dmgPerStackMul * (aktuelleStacks)
    Stacks: Unabhängige Einträge mit eigener Ablaufzeit (stackDuration). Mode B: Erreicht ein Gegner maxStacks, bestehende Stacks werden NICHT refreshed (nur neue bis Limit).
    Slow: Während Gegner inside markiert ist, wird jede Frame ein kurzer Slow (0.25s) via slowUntil/slowFactor erneuert; Verlassen -> Slow tickt rasch aus.
    Single Instance: Neues Feld überschreibt altes (spawnFireField ersetzt window.fireField Objekt).
    Rendering: Pulsierender Glow + Ring, Burn Stack Anzeige (🔥N) über Gegner.
    Erweiterbar: shape 'square', Balance über fireFieldConfig.
  */
  window.fireField = window.fireField || { active:false };
  function spawnFireField(x,y){
    const cfg = window.fireFieldConfig; const now = performance.now()/1000; // zurück zu stabiler Zeitbasis
    window.fireField = {
      active:true,
      x, y,
      radius: cfg.radius,
      shape: cfg.shape,
      createdAt: now,
      expire: now + cfg.duration, // fallback legacy
      tickEvery: cfg.tickEvery,
      nextTick: now, // sofort erster Tick
      slowPct: cfg.slowPct,
      maxStacks: cfg.maxStacks,
      stackDuration: cfg.stackDuration,
  dmgPerStackMul: cfg.dmgPerStackMul,
  _hardExpire: now + cfg.duration + 0.15,
      remaining: cfg.duration,
      _lastUpdateTime: now
    };
    if(window.fireFieldDebug){ console.log('[FireField] Spawn', {x,y, createdAt:now, expire:window.fireField.expire}); showMeteorToast && showMeteorToast('Feuerfeld!'); }
  }
  function addFireBurnStack(e, f, nowSec){
    if(!e._fireBurn) e._fireBurn = { stacks:0, entries:[] };
    if(e._fireBurn.stacks >= f.maxStacks) return; // Modus B: kein Refresh vorhandener Stacks
    e._fireBurn.entries.push({ expires: nowSec + f.stackDuration });
    e._fireBurn.stacks = e._fireBurn.entries.length;
  }
  function applyFireFieldDamage(e, dmg){
    if(dmg<=0) return;
    e.hp -= dmg;
    e.hitFlash = Math.max(e.hitFlash||0, 0.2);
    for(let i=0;i<3;i++) particle(e.x+(Math.random()-0.5)*(e.r||24), e.y+(Math.random()-0.5)*(e.r||24), 'rgba(255,120,40,0.85)');
    // Einheitlicher Damage Floater (Typ fire)
    if(typeof window.addDamageFloater === 'function'){
      window.addDamageFloater({x:e.x, y:e.y-(e.r||20), amount:dmg, type:'fire'});
    }
    if(e.hp<=0){ if(e.boss) handleBossPhaseAfterDamage(e); else if(typeof window.killEnemy==='function'){ const idx = state.enemies.indexOf(e); if(idx>=0) window.killEnemy(idx,e); }}
  }
  // Globale Version, damit der Game Loop sie sicher findet (vorher vermutlich in Funktions-Scope verloren)
  window.updateFireField = function updateFireField(nowSec){
    const f = window.fireField; if(!f||!f.active) return;
    const dur = window.fireFieldConfig.duration || 5;
    // Remaining über real dt updaten (robust gg. clock drift)
    const dtReal = Math.max(0, nowSec - (f._lastUpdateTime||nowSec));
    f._lastUpdateTime = nowSec;
    f.remaining -= dtReal;
    if(f.remaining <= 0 || nowSec - f.createdAt >= dur || nowSec >= f.expire || nowSec >= f._hardExpire){
      f.active=false; return;
    }
    if(Array.isArray(state.enemies)){
      // reset inside marker each frame
      for(const e of state.enemies){ if(!e||e.hp<=0) continue; if(e._fireFieldTemp){ e._fireFieldTemp.inside=false; } }
      for(const e of state.enemies){ if(!e||e.hp<=0) continue; let inside=false;
        if(f.shape==='circle') inside = Math.hypot(e.x-f.x, e.y-f.y) <= f.radius + (e.r||0);
        else inside = Math.abs(e.x-f.x)<=f.radius && Math.abs(e.y-f.y)<=f.radius;
        if(inside){
          if(!e._fireFieldTemp) e._fireFieldTemp={};
          e._fireFieldTemp.inside=true;
          if(!e._fireBurn){ addFireBurnStack(e,f,nowSec); }
        }
      }
    }
    if(nowSec >= f.nextTick){
      f.nextTick += f.tickEvery;
      if(Array.isArray(state.enemies)) for(const e of state.enemies){
        if(!e||e.hp<=0||!e._fireBurn) continue;
        const burn = e._fireBurn; const inside = !!(e._fireFieldTemp && e._fireFieldTemp.inside);
        if(inside && burn.stacks < f.maxStacks){ addFireBurnStack(e,f,nowSec); }
        // cleanup expired stacks
        burn.entries = burn.entries.filter(en=> en.expires > nowSec);
        burn.stacks = burn.entries.length;
        if(burn.stacks<=0){ delete e._fireBurn; continue; }
        const base = (player.dmg||10) * (buffs.dmg||1);
        const dmg = base * f.dmgPerStackMul * burn.stacks;
        applyFireFieldDamage(e, dmg);
        if(window.fireFieldDebug){ console.log('[FireField Tick]', {enemyHP:e.hp, stacks:burn.stacks, dmg}); }
      };
    }
    // apply slow (real integration via existing slowUntil/slowFactor system)
    if(Array.isArray(state.enemies)) for(const e of state.enemies){
      if(!e||e.hp<=0) continue;
      if(e._fireFieldTemp && e._fireFieldTemp.inside){
        // Refresh a very short slow window each frame (prevents lingering after exit)
        const nowTime = state.time || (performance.now()/1000);
        const durFrame = 0.25; // 250ms grace; removed quickly after leaving
        const targetFactor = 1 - f.slowPct; // e.g. 0.75 => 25% slow
        if(!e.slowUntil || e.slowUntil < nowTime + durFrame){ e.slowUntil = nowTime + durFrame; }
        if(e.slowFactor==null) e.slowFactor = targetFactor; else e.slowFactor = Math.min(e.slowFactor, targetFactor);
      }
    };
  }
  // Ability Eintrag ersetzt alte 'speed' Ability
  define('speed', { icon:'🔥', desc:'Feuerfeld (Q): Zone verlangsamt & verbrennt Gegner.',
    showCondition(){ // Nur anzeigen wenn aktuelle Waffe ein Stab ist
      try {
        if(!window.player || !window.weapons || window.player.weaponIndex==null) return false;
        const w = window.weapons[window.player.weaponIndex];
        return !!(w && w.id === 'staff');
      } catch(_e){ return false; }
    },
    trigger(){ try {
      if(!player) return;
      if(!window.weapons || player.weaponIndex==null) return;
      const w = window.weapons[player.weaponIndex]; if(!w || w.id!=='staff') return; // Hard Guard
      const now = performance.now()/1000;
      if(this._cdUntil && now < this._cdUntil) return;
      if(window.fireFieldTargeting && window.fireFieldTargeting.active){
        const ability = this;
        const mx = mouseX || player.x; const my = mouseY || player.y;
        if(typeof window.isWalkable==='function'){ if(!window.isWalkable(mx,my)){ showMeteorToast&&showMeteorToast('Ungültig'); return; } }
        spawnFireField(mx,my);
        ability._cdUntil = now + (window.fireFieldConfig.cooldown||10);
        window.fireFieldTargeting = null;
        if(typeof window._rebuildAbilityBar==='function') window._rebuildAbilityBar();
        return;
      }
      window.fireFieldTargeting = { active:true, started:now };
      if(typeof window._rebuildAbilityBar==='function') window._rebuildAbilityBar();
    } catch(err){ console.warn('[Feuerfeld trigger]', err); } },
    cdGetter(){ return window.fireFieldConfig.cooldown; },
    timerGetter(){ const now=performance.now()/1000; return this._cdUntil? Math.max(0,this._cdUntil-now):0; },
    activeGetter(){ return !!(window.fireField && window.fireField.active); },
    readyGetter(){ return this.timerGetter()<=0; },
    variant(){
      const f=window.fireField; const cfg=window.fireFieldConfig; if(f&&f.active){
        const remain = Math.max(0,(f.expire - performance.now()/1000)).toFixed(1);
        return { name:'Feuerfeld (aktiv)', icon:'🔥', desc:'Rest '+remain+'s | Slow '+Math.round(cfg.slowPct*100)+'% | Bis '+cfg.maxStacks+' Stacks.' };
      }
      return { name:'Feuerfeld (Q)', icon:'🔥', desc:'(Nur Stab) 5s Zone: -25% Speed, Verbrennung 50% Basisdmg/Stack/s (max 3). CD 10s.' };
    }
  });
  define('heal', { icon:'✚', uiName:'Heal', desc:'Heilimpuls (E) – heilt dich und geht auf Cooldown.',
    trigger(){
      if(window.actionKeyState && window.actionKeyState.e){
        const e = window.actionKeyState.e;
        if(e.timer<=0){
          // set cooldown
          e.timer = e.cd;
          // apply heal + particles
          if(typeof player!== 'undefined'){
            const amt = Math.round(player.maxHp*0.18);
            player.hp = Math.min(player.maxHp, player.hp + amt);
            for(let i=0;i<14;i++) particle(player.x+(Math.random()-0.5)*38, player.y+(Math.random()-0.5)*38,'#38e1d7');
          }
          // trigger heal animation (unified path)
          if(typeof healAnimState !== 'undefined'){
            healAnimState.playing = true;
            healAnimState.t = 0;
          }
          // optional HUD refresh + debug stamp
          if(typeof updateHUD === 'function') updateHUD();
          window.__lastHealTriggerTime = performance.now();
        }
      }
    },
    cdGetter(){ if(window.actionKeyState && window.actionKeyState.e) return window.actionKeyState.e.cd; return 0; },
    timerGetter(){ if(window.actionKeyState && window.actionKeyState.e) return window.actionKeyState.e.timer; return 0; },
    activeGetter(){ return false; },
    readyGetter(){ if(window.actionKeyState && window.actionKeyState.e) return window.actionKeyState.e.timer<=0; return true; }
  });
  define('dash', { icon:'⚡', uiName:'Dash', desc:'Bewegungs-Dash (2 Charges). Rechtsklick halten & loslassen.',
    trigger(){
      const rc = window.rightClickDash; if(!rc) return;
      // Start Aim nur wenn mind. 1 Charge vorhanden
      if(!rc.aim && rc.charges>0){ if(typeof beginDashAim==='function') beginDashAim(); }
    },
    cdGetter(){
      const rc = window.rightClickDash; if(!rc) return 0;
      // Cooldown pro einzelne Charge-Recharge
      return rc.recharge || 0;
    },
    timerGetter(){
      const rc = window.rightClickDash; if(!rc) return 0;
      // Zeige verbleibende Zeit bis zur nächsten Charge wenn nicht voll
      if(rc.charges < rc.maxCharges) return rc.rechargeTimer || 0;
      return 0; // Voll -> kein Overlay
    },
    activeGetter(){ return !!(window.rightClickDash && window.rightClickDash.aim); },
    readyGetter(){
      const rc = window.rightClickDash; if(!rc) return true;
      return rc.charges > 0; // Ready sobald mindestens 1 Charge
    },
    stacksGetter(){ return window.rightClickDash ? window.rightClickDash.charges : 0; }
  });
  define('basic', {
    icon:'🗡️',
    desc:'Auto-Attack (Linke Maus) – Standardangriff. Immer verfügbar.',
    trigger(){
  // --- NEUE HALBERD AUTO-SWEEP ANIMATION ---
  console.log('[DEBUG] basic.trigger() aufgerufen');
  const w = window.weapons && window.player ? window.weapons[window.player.weaponIndex] : null;
  if(w && w.id === 'halbard') {
        // Nur echte Treffer zählen -> Hit Counter
        if(typeof player._halberdHitCount !== 'number') player._halberdHitCount = 0;
        // Prüfe Treffer
        let hit = false;
        for(const e of state.enemies){
          if(e.hp>0 && Math.hypot(e.x-player.x, e.y-player.y)<(w.range||90)+(e.r||0)) { hit = true; break; }
        }
        if(hit) {
          player._halberdHitCount++;
          // Debug optional
          // console.log('[DEBUG] Halberd Hit Count:', player._halberdHitCount);
          if(player._halberdHitCount >= 30) {
            player._halberdHitCount = 0;
            // console.log('[DEBUG] Halberd SWEEP ausgelöst (30 Treffer)!');
            // EXTREM SICHTBARE SWEEP-ANIMATION!
            if(window.swordSpin && window.swordSpin.config) window.swordSpin.config.camShake = 48;
            window._halberdUltShake = 2.2;
            for(let i=0;i<60;i++) particle(player.x + (Math.random()-0.5)*220, player.y + (Math.random()-0.5)*220, 'rgba(255,255,80,0.95)');
            for(let i=0;i<40;i++) particle(player.x + (Math.random()-0.5)*340, player.y + (Math.random()-0.5)*340, 'rgba(255,255,255,0.95)');
            if(!state.sweeps) state.sweeps=[];
            const sid = ++state._sweepId;
            // EXAKT wie Ult-Phase 2 (Rundumangriff)
            const sweep = {
              id: sid,
              startTime: state.time,
              dur: 0.8, // wie Ult-Phase 2
              angle: 0,
              targetAngle: Math.PI*2,
              radius: 320,
              width: 66,
              color: '#ffb347', // wie Ult-Phase 2
              dmg: Math.round(player.dmg * (w.dmgMul || 1) * 2.2),
              age: 0,
              weaponIndex:player.weaponIndex,
              isHalberdUlt: true // MARKIERT als Ult-Sweep für Spezial-Render
            };
            state.sweeps.push(sweep);
            const range = 440;
            for(const e of state.enemies){
              if(e.hp>0 && Math.hypot(e.x-player.x, e.y-player.y)<range+(e.r||0)){
                for(let p=0;p<14;p++) particle(e.x+(Math.random()-0.5)*e.r*2.2, e.y+(Math.random()-0.5)*e.r*2.2, 'rgba(255,255,80,0.95)');
                e.hitFlash = 0.32;
              }
            }
            if(window.playSound) window.playSound('ult_sweep');
          }
        }
        return;
      }
      // ...sonst Standardangriff...
      /* TODO: Implementiere später Projektil / Nahkampfschlag */
    },
    placeholder:false,
    showCondition(){ return true; }
  });
  define('extra', { icon:'★', desc:'Zusätzlicher Slot (T) für zukünftige Fähigkeit.', placeholder:true });

  // Default Bindings (inkl. T + Maus)
  const defaultBindings = [
    {key:'lmb', ability:'basic'},
    {key:'rmb', ability:'dash'},
    {key:'q', ability:'speed'}, // Feuerfeld (Q) – vorher 'speed'
    {key:'e', ability:'heal'},
    {key:'f', ability:'curse'},
    {key:'r', ability:'ult'},
    {key:'t', ability:'extra'}
  ];
  function loadBindings(){ try { const raw=localStorage.getItem('abilityBindingsV1'); if(raw){ const arr=JSON.parse(raw); if(Array.isArray(arr)) return arr; } } catch(_){ } return JSON.parse(JSON.stringify(defaultBindings)); }
  let bindings = loadBindings();
  function saveBindings(){ try { localStorage.setItem('abilityBindingsV1', JSON.stringify(bindings)); } catch(_){ } }
  function getBindingByKey(k){ return bindings.find(b=>b.key===k); }
  function dispatchAbility(id){ const a=reg[id]; if(!a){ console.warn('Ability fehlend', id); return; } a.trigger&&a.trigger(); }
  // Expose
  window.abilities = { registry:reg, bindings, saveBindings, dispatchAbility, getBindingByKey, resetBindings:()=>{ bindings=JSON.parse(JSON.stringify(defaultBindings)); window.abilities.bindings=bindings; saveBindings(); } };

  // Keydown zentral abfangen (nur nicht wenn Input fokussiert)
  window.addEventListener('keydown', ev=>{
    if(ev.target && (ev.target.tagName==='INPUT' || ev.target.tagName==='TEXTAREA' || ev.target.isContentEditable)) return;
    const k = ev.key.toLowerCase();
    if(k==='escape' && window.fireFieldTargeting && window.fireFieldTargeting.active){
      window.fireFieldTargeting = null; if(typeof window._rebuildAbilityBar==='function') window._rebuildAbilityBar(); return; }
    // Sonderfall: R / F bereits durch alten Code? -> wir lassen neuen Handler priorisiert und entfernen später alten spezifischen Code (TODO Cleanup)
    const bind = getBindingByKey(k);
    if(bind){ dispatchAbility(bind.ability); }
  }, true);
  // Maus (LMB/RMB) -> spätere Hook in eigentlichem Attack-System, hier nur RMB Fallback wenn gebunden
  window.addEventListener('contextmenu', e=>{ const b=getBindingByKey('rmb'); if(b){ e.preventDefault(); dispatchAbility(b.ability); } });
})();

const origLoop = typeof loop === 'function' ? loop : null;
let bossDebugLoopInjected = false;
function bossDebugLoopWrapper() {
  if(bossDebugActive && state.enemies.length) {
    const boss = state.enemies[0];
    const dmg = Math.max(0, bossDebugLastHp - boss.hp);
    if(dmg > 0) {
      const ts = new Date().toLocaleTimeString('de-DE',{hour12:false}).split(':').slice(1).join(':');
      bossDebugLogArr.unshift(`[${ts}] -${dmg} HP`);
      if(bossDebugLogArr.length > 10) bossDebugLogArr.length = 10;
    }
    bossDebugLastHp = boss.hp;
    document.getElementById('bossDebugDmg').textContent = 'Schaden: ' + dmg;
    document.getElementById('bossDebugBuffs').textContent = 'Buffs: ' + (boss.buffs && boss.buffs.length ? boss.buffs.join(', ') : '-');
 
    let debuffs = boss.debuffs && boss.debuffs.length ? boss.debuffs.slice() : [];
    if(boss.daggerDot && boss.daggerDot.active && typeof boss.daggerDot.t === 'number' && typeof boss.daggerDot.dur === 'number' && boss.daggerDot.t < boss.daggerDot.dur) {
      const rest = Math.max(0, boss.daggerDot.dur - boss.daggerDot.t).toFixed(1);
      debuffs.push('DoT (' + rest + 's)');
    }
    document.getElementById('bossDebugDebuffs').textContent = 'Debuffs: ' + (debuffs.length ? debuffs.join(', ') : '-');
    document.getElementById('bossDebugLog').innerHTML = bossDebugLogArr.map(e=>`<div>${e}</div>`).join('');
  }
  if(origLoop) origLoop();
}
if(typeof loop === 'function' && !bossDebugLoopInjected) {
  bossDebugLoopInjected = true;
  window.loop = bossDebugLoopWrapper;
}

// Kristof Test Mode (vollständiger Boss mit aktuellen Mechaniken)
function startKristofTestMode(){
  state.enemies = [];
  state.projectiles = [];
  state.shockwaves = [];
  state.kristofKillsLeft = 0;
  // Boost player + weapons for meaningful test damage
  try {
    if(typeof player !== 'undefined') {
      player.level = 15;
      player.xp = getXPCum ? getXPCum(15) : 0;
      player.next = getXPReq ? getXPReq(16) : player.next;
      // Recompute derived stats
  // Test Boss Mode: erhöhter Basis-Schaden für schnellere Tests
  if(typeof player.baseDamage === 'number') player.baseDamage = 100; else player.baseDamage = 100;
      if(player.baseDamage != null && player.damagePerLevel != null){
        player.dmg = player.baseDamage + (player.level - 1) * player.damagePerLevel;
      }
      player.maxHp = Math.max(player.maxHp || 1, 600 + player.level * 40);
      player.hp = player.maxHp;
    }
    if(Array.isArray(weapons)){
      const targetWeaponLevel = 20;
      for(const w of weapons){
        if(!w) continue;
        const startLevel = w.lvl || 1;
        if(startLevel < targetWeaponLevel){
          for(let L=startLevel+1; L<=targetWeaponLevel; L++){
            w.lvl = L;
            // Evolve genau auf evolveLevel
            if(w.evolveLevel && L === w.evolveLevel && typeof w.evolve === 'function' && !w.evolved){
              try { w.evolve(w); } catch(_e){}
            }
            if(typeof w.onLevel === 'function') { try { w.onLevel(w); } catch(_e){} }
            if(L > 10 && L % 10 === 0 && typeof w.onUpgrade === 'function') { try { w.onUpgrade(w, L); } catch(_e){} }
          }
        }
        // Falls schon höher, unverändert lassen
        if(w.evolveLevel && w.lvl >= w.evolveLevel && typeof w.evolve === 'function' && !w.evolved){
          try { w.evolve(w); } catch(_e){}
        }
        if(getXPReq) w.next = getXPReq(w.lvl+1);
        if('xp' in w) w.xp = 0; // reset progress bar
      }
    }
    if(typeof buildUI === 'function') buildUI();
    if(typeof updateHUD === 'function') updateHUD();
  } catch(_ignore){}
  // spawnKristof() deaktiviert (kein automatischer Kristof-Spawn beim Start)
  // spawnKristof();
  const k = state.enemies.find(e=>e.boss && e.name==='Kristof');
  if(k && player){
    // Spawn deutlich oberhalb & leicht seitlich, nicht im Spieler
    k.x = player.x + 100;
    k.y = player.y - 260; // höher
    k.hp = k.maxHp;
  }
  // (Aufräumung) Debug-Hinweis für Kristof Testmodus entfernt
}

// Tastenkürzel: K respawned Kristof in Testmodus
window.addEventListener('keydown', e=>{ if((e.key==='k'||e.key==='K') && TESTMODE_BOSS){ startKristofTestMode(); } });

function particle(x, y, color = '#fff') {
  state.particles.push({ x, y, color, life: 0.7 + Math.random()*0.5, vx: (Math.random()-0.5)*80, vy: (Math.random()-0.5)*80 });
}

let mouseX = 0;
let mouseY = 0;
window.addEventListener('mousemove', e => {
  const rect = canvas.getBoundingClientRect();
  mouseX = e.clientX - rect.left;
  mouseY = e.clientY - rect.top;
});
// Feuerfeld Platzierungs-Interaktion
window.addEventListener('mousedown', e=>{
  try {
    if(!(window.fireFieldTargeting && window.fireFieldTargeting.active)) return;
    if(e.button===0){
      const ability = window.abilities?.registry?.['speed']; if(!ability) return;
      const now = performance.now()/1000; if(ability._cdUntil && now < ability._cdUntil) return;
      const cfg = window.fireFieldConfig; const mx = mouseX, my = mouseY;
      if(typeof window.isWalkable==='function'){ if(!window.isWalkable(mx,my)){ showMeteorToast&&showMeteorToast('Ungültig'); return; } }
      spawnFireField(mx,my);
      ability._cdUntil = now + cfg.cooldown;
      window.fireFieldTargeting = null;
      if(typeof window._rebuildAbilityBar==='function') window._rebuildAbilityBar();
      e.preventDefault();
    } else if(e.button===2){
      window.fireFieldTargeting = null; if(typeof window._rebuildAbilityBar==='function') window._rebuildAbilityBar(); e.preventDefault();
    }
  } catch(err){ console.warn('[FireField MouseDown]', err); }
}, true);
window.addEventListener('contextmenu', e=>{ if(window.fireFieldTargeting){ e.preventDefault(); } }, true);
 
let playerAnim = 'idle';
let playerAnimFrame = 0;
let playerAnimTimer = 0;
 
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
 
window.gameOverOverlay = document.getElementById('gameOver');
window.pauseOverlay = document.getElementById('pauseOverlay');

 
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);
 
let mouseDown = false;
let rightMouseDown = false;
// --- Meteor (Stab R-Fähigkeit) State ---
window.staffMeteor = {
  targeting: false,
  targetX: 0,
  targetY: 0,
  cd: 0, // Kein Cooldown mehr, Cast-Bedingung über Soul Counter
  timer: 0,
  souls: 0, // Zähler für getötete Gegner (Soul Counter)
  soulsRequired: 150, // Anzahl benötigter Kills für Meteor
  windup: 0.95, // kürzer: schnellerer Einschlag
  animT: 0,
  // Kürzere Dauer für knackigere, aber dennoch lesbare Explosion
  animDur: 2.15, // etwas länger damit Beschwörungsphase ruhiger wirkt
  state: 'idle',
  dmgMul: 18.0, // MASSIV erhöhter Schadensmultiplikator
  eliteBossBonus: 0.6, // stärkerer Bonus gegen Elite/Boss
  radius: 210, // Ursprünglicher großer Wirkungsradius wiederhergestellt
  impactDone: false,
  holdStart: 0,
  minHold: 0.15,
  windupT: 0,
  impactDelayFrac: 0.48, // Schaden etwas früher (48% des Anim-Verlaufs)
  // Pull / Sog Feature vor Impact
  pullActive: false,
  pullCaptured: [], // Array von {e, startX, startY}
  pullRadius: 180, // Ursprüngliche große Sog-Reichweite wiederhergestellt
  pullEasePow: 2.4, // je höher desto sanfter Start, stärkeres Ende
  pullSpiral: true,
  pullProgress: 0
  , spriteYOffsetFrac: -0.10 // behalte Versatz für Zentrums-Korrektur
  // --- Prozedurale Visual Parameter ---
  , procFallDur: 0.55
  , procImpactFlashDur: 0.18
  , procShockwaveDur: 0.6
  , procShockwaveMaxScale: 2.4
  , procCorePulseFreq: 1.2
  , procCorePulseAmp: 0.25
  , procTrailLife: 0.55
  , procTrailRate: 90
  , procEmberRate: 120
  , procEmberLife: 0.6
  , procEmbers: []
  , procFallTrail: []
  // Beschwörungsphase (Aufladen) ersetzt sprite summon Frames
  , summonActive: false
  , summonT: 0
  , summonDur: 0.55
  , summonParticles: []
  , summonParticleRate: 42
  , summonParticleRise: 140
  , summonParticleLife: 0.65
  , summonParticleJitterX: 26
};

// --- Curse Skill (Taste F) -------------------------------------------------
// Sheet: 960x768 (5x4). Wir verwenden NUR Reihe 2 (Index 1) mit 5 Frames (192x192)
window.curseSkill = {
  targeting:false,
  targetX:0,targetY:0,
  cd:20, // erhöhter Cooldown wegen stärkerem Effekt
  timer:0,
  windup:0.8,
  animT:0,
  // Animationsdauer war vorher 2.3 – wir nutzen jetzt eine reine Zonen-Dauer (zoneDuration)
  animDur:0.0, // Sprite-Impact Animation nicht mehr für Schaden nötig
  state:'idle',
  // Schaden entfällt komplett – dmgMul entfernt
  radius: 140, // Angepasster Wirkungsradius für Paralyse (User-Wunsch)
  // (Sprite Sheet entfernt – prozedurale Darstellung)
  impactDone:false,
  holdStart:0,
  minHold:0.10,
  windupT:0,
  impactDelayFrac:0.50,
  pullActive:false,
  pullCaptured:[],
  pullRadius: 140, // Angepasster Sog-Radius für Paralyse (User-Wunsch)
  pullEasePow:2.0,
  pullSpiral:false,
  // Neue Zonen-Parameter
  zoneActive:false,
  zoneT:0,
  zoneDuration:3.0, // 3 Sekunden aktiver Sog / Slow
  slowFactor:0.25,  // Gegner bewegen sich nur noch mit 25% Speed (=> 75% Slow)
  slowDuration:3.2  // etwas länger als Zone damit Rauslaufen noch träge ist
  , spriteYOffsetFrac: -0.05 // weniger nach oben schieben damit Kreis + Animation mittiger sind
  // --- Visueller Hit-Ring Upgrade ---
  , hitRingEnabled: true
  , hitRingGrowStart: 0.05   // ab welchem Animationsprogress (0..1) der Ring erscheint
  , hitRingFadeStart: 0.55   // ab wann er ausfadet
  , hitRingMaxScale: 1.32    // Multiplikator auf c.radius für äußeren Ring-Radius
  , hitRingLineWidth: 6      // Basis-Linienstärke
  , hitRingInnerGlow: true   // weicher Kern-Glow
  , hitRingDouble: true      // zweiter dünner Ring
  // --- Zusätzliche Offsets zur besseren Zentrierung ---
  , circleYOffsetFrac: 0     // verschiebt NUR den Ziel-/Hit Kreis relativ zu c.radius (positiv = nach unten)
  , impactExtraYOffsetFrac: 0 // zusätzlicher Y Offset NUR für die Sprite während impact (additiv zu spriteYOffsetFrac)
  // --- Prozedurale Zusatz-Parameter ---
  , procRuneCount: 7
  , procRuneInnerFrac: 0.35
  , procRuneOuterFrac: 0.78
  , procRuneSize: 18
  , procRotSpeed: 0.6   // Umdrehungen pro Sekunde
  , procRotDir: 1
  , procPulseFreq: 1.8
  , procPulseAmp: 0.07
  , procInwardParticleRate: 42
  , procInwardParticleLife: 0.9
  , procParticles: []
  , procSeed: Math.random()*1000
};
// Hinweis (Curse Alignment Live Tweaks):
// In der Browser-Konsole kannst du Feintuning machen:
//   curseSkill.circleYOffsetFrac = 0.07;   // verschiebt nur den Zielkreis nach unten
//   curseSkill.impactExtraYOffsetFrac = -0.05; // hebt die Impact-Sprite an
//   curseSkill.spriteYOffsetFrac = -0.05;  // Basisversatz für die gesamte Sprite
// Danach einfach den Spell einmal neu aktivieren. Werte persistent machen? -> Hier oben anpassen.

// (Ehemaliges loadCurseSprite entfernt – prozedurale Variante braucht keine externen Assets)
function loadCurseSprite(){ return; }

function loadMeteorSprite(){ return; }
// Maus Buttons: 0 = links, 2 = rechts
window.addEventListener('mousedown', (ev)=>{ 
  if(ev.button===0) {
    mouseDown = true;
    // LMB = Standardangriff auslösen
    if(window.abilities && typeof window.abilities.dispatchAbility === 'function') {
      window.abilities.dispatchAbility('basic');
    }
  }
  if(ev.button===2) rightMouseDown = true; 
});
window.addEventListener('mouseup', (ev)=>{ 
  if(ev.button===0) mouseDown = false; 
  if(ev.button===2) rightMouseDown = false; 
});
window.addEventListener('keyup', (e)=>{
  if(e.key==='r' || e.key==='R'){
    try {
      const m = window.staffMeteor; if(!m) return;
      if(!m.targeting) return;
      const wArr = window.weapons; if(!wArr || !Array.isArray(wArr)) { m.targeting=false; return; }
      if(!player || player.weaponIndex==null){ m.targeting=false; return; }
      const w = wArr[player.weaponIndex];
      let char = (window.selectedCharacter||'').toLowerCase();
      if(!char && typeof character === 'string') char = character.toLowerCase();
      // Nur auslösen wenn weiterhin Bully + staff
      if(!w || w.id !== 'staff' || (char!== 'bully' && char)){ m.targeting=false; return; }
      // NEU: Nur casten, wenn genug Souls
      if((m.souls||0) < (m.soulsRequired||150)){
        m.targeting = false;
        showMeteorToast('Nicht genug Seelen! ('+(m.souls||0)+'/'+(m.soulsRequired||150)+')');
        return;
      }
      const held = (performance.now() - m.holdStart)/1000;
      m.targeting = false;
      console.log('[Meteor][keyup] held='+held.toFixed(3)+'s timer='+m.timer+' state='+m.state);
      // Beschwörung endet -> Impact startet (wenn Mindesthalt erreicht)
      if(held >= m.minHold && (m.state==='idle' || m.state==='windup')){
        m.state='impact';
        m.animT = 0;
        m.impactDone = false;
        m.timer = m.cd;
        m.summonActive = false;
        m.summonBeamFlash = 1; // Flash beim Übergang
        // Impact-Position jetzt setzen (mouse release Position)
        m.targetX = mouseX; m.targetY = mouseY;
        // Pull Setup
        m.pullCaptured = []; m.pullActive = true;
        const pr2 = m.pullRadius * m.pullRadius;
        for(const eObj of state.enemies){
          if(!eObj || eObj.boss || eObj.elite) continue;
          const dx = eObj.x - m.targetX; const dy = eObj.y - m.targetY; const d2 = dx*dx + dy*dy; if(d2>pr2) continue;
          m.pullCaptured.push({e: eObj, startX: eObj.x, startY: eObj.y});
        }
        // Souls zurücksetzen
        m.souls = 0;
        if(typeof updateHUD === 'function') updateHUD();
        console.log('[Meteor] IMPACT start after summon', {x:m.targetX,y:m.targetY, captured:m.pullCaptured.length});
      } else {
        m.summonActive = false; showMeteorToast('Zu kurz gehalten (<'+m.minHold+'s)');
      }
    } catch(err){ console.warn('[Meteor][keyup error]', err); }
  }
});

// Curse Skill Input (F halten & loslassen)
window.addEventListener('keydown', (e)=>{
  if(e.key==='f' || e.key==='F'){
    try {
      const c = window.curseSkill; if(!c) return;
      if(c.timer>0 || c.targeting || c.state!=='idle') return;
  // prozedurale Curse -> kein Sheet laden
      c.targeting = true; c.holdStart = performance.now();
      c.targetX = mouseX; c.targetY = mouseY;
    } catch(err){ console.warn('[Curse][keydown error]', err); }
  }
});
window.addEventListener('keyup', (e)=>{
  if(e.key==='f' || e.key==='F'){
    try {
      const c = window.curseSkill; if(!c) return; if(!c.targeting) return;
      const held = (performance.now() - c.holdStart)/1000; c.targeting=false;
      if(held >= c.minHold && c.timer<=0 && c.state==='idle'){
        c.state='windup'; c.windupT=0; c.animT=0; c.impactDone=false; c.timer=c.cd;
        c.pullCaptured=[]; c.pullActive=true;
        const pr2=c.pullRadius*c.pullRadius;
        for(const eObj of state.enemies){
          if(!eObj || eObj.boss || eObj.elite) continue;
          const dx=eObj.x-c.targetX, dy=eObj.y-c.targetY; const d2=dx*dx+dy*dy; if(d2>pr2) continue;
          c.pullCaptured.push({e:eObj,startX:eObj.x,startY:eObj.y});
        }
        console.log('[Curse] WINDUP start captured', c.pullCaptured.length);
      }
    } catch(err){ console.warn('[Curse][keyup error]', err); }
  }
});

// Kleine Toast-Funktion speziell für Meteor Feedback
function showMeteorToast(msg){
  let t = document.getElementById('meteorToast');
  if(!t){
    t = document.createElement('div');
    t.id='meteorToast';
    t.style.position='fixed';
    t.style.top='auto';
  t.style.bottom='120px';
    t.style.left='50%';
    t.style.transform='translateX(-50%)';
    t.style.background='linear-gradient(90deg, #1a1a1a 60%, #2c1a0a 100%)';
    t.style.color='#ffe6a8';
    t.style.font='15px Montserrat,Orbitron,sans-serif';
    t.style.letterSpacing='0.5px';
    t.style.padding='10px 28px';
    t.style.border='2px solid #e6c97a';
    t.style.borderRadius='14px';
    t.style.boxShadow='0 4px 18px #000c,0 0 0 1px #0008 inset';
    t.style.zIndex='10000';
    t.style.pointerEvents='none';
    t.style.textShadow='0 2px 8px #000a';
    t.style.fontWeight='bold';
    t.style.transition='opacity .4s, bottom .3s cubic-bezier(.4,1.6,.6,1)';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.style.opacity='1';
  t.style.bottom = '120px';
  clearTimeout(t._hideTimer);
  t._hideTimer = setTimeout(()=>{ t.style.opacity='0'; t.style.bottom='100px'; }, 1700);
}

// Debug-Helfer im Fenster verfügbar machen
window.debugMeteor = function(){ console.log('staffMeteor:', JSON.parse(JSON.stringify(window.staffMeteor))); };
window.forceMeteorTarget = function(){ const m=window.staffMeteor; if(m && m.state==='idle' && !m.targeting){ m.targeting=true; m.holdStart=performance.now(); console.log('[Meteor][force] targeting ON'); } };
window.forceMeteorImpact = function(){ const m=window.staffMeteor; if(m){ m.state='impact'; m.animT=0; m.impactDone=false; console.log('[Meteor][force] impact NOW'); } };
// Kontextmenü global deaktivieren (Spielbereich)
window.addEventListener('contextmenu', (e)=>{ 
  const cnv = document.getElementById('game');
  if(cnv && cnv.contains(e.target)) { e.preventDefault(); }
});
 
const keys = new Set();
 
function showKristofCounter() {
  // Kristof Timer deaktiviert – UI entfernt
  const el = document.getElementById('kristofCounter');
  if(el) el.remove();
  // no-op
}
 
let kristofEventTextTimer = 0;
function spawnKristof() {
  if(state.enemies.some(e => e.boss && e.name === 'Kristof')) return;
  // Don't clear existing enemies anymore; we blend Kristof into current battle.
  // Find a spawn position above the player (or center fallback) and adjust if heavily crowded.
    let spawnX = typeof player !== 'undefined' ? player.x : innerWidth/2;
    let spawnY = typeof player !== 'undefined' ? player.y - 260 : innerHeight/2 - 180;
    // If too many enemies very close to intended spawn point, shift upward further.
    let attempts = 0;
    while(attempts < 8){
      const near = state.enemies.filter(e => (e.x-spawnX)**2 + (e.y-spawnY)**2 < 140*140);
      if(near.length > 10){
        spawnY -= 120; // move further up
        attempts++;
      } else break;
    }
    // Summe aktueller Waffen-Level (nur echte Waffen)
    let totalWeaponLevels = 0;
    try { if(Array.isArray(weapons)) { for(const w of weapons){ if(w && typeof w.lvl==='number') totalWeaponLevels += w.lvl; } } } catch(_){ totalWeaponLevels = 0; }
  const bonusHp = totalWeaponLevels * 5000;
  // Dynamische Grund-HP Skalierung: +50% pro bereits besiegtem Kristof (multiplikativ)
  const kristofKills = (window.kristofBossDefeated||0);
  const baseHp0 = 33600;
  const scalingMul = Math.pow(1.5, kristofKills); // 0 Kills => 1.0, 1 Kill => 1.5, 2 => 2.25, ...
  const scaledBase = Math.round(baseHp0 * scalingMul);
  const boss = {
      x: spawnX + 30,
      y: spawnY - 50,
      r: 16, // Kristof minimal größer
  hp: scaledBase + bonusHp,
  maxHp: scaledBase + bonusHp,
      dmg: 40,
      boss: true,
      name: 'Kristof',
      elite: true,
      lastHitId: -1,
      type: 'runner',
      shootTimer: 1.6,
  // Basis-Speed jetzt 20% unter dem Original (90 -> 72). Vorher bereits 10% Reduktion (81).
  speed: 72,
    vx: 0,
    vy: 0,
  playerDamageReduction: 0.30 // 30% weniger Schaden vom Spieler
  , shockwaveState: { triggered80:false, triggered40:false, active:false, seqIndex:0, seqTotal:3, invulnTimer:0, phase80Done:false, phase40Done:false, _gen:(Date.now()%100000), maxHpRef: null }
    };
    // Reset sicherstellen
    boss.invulnerable = false;
    boss._spawnAbsorbDone = false;
  state.enemies.push(boss);
  state.kristof = boss; // Referenz speichern für externe Systeme
  boss.shockwaveState.maxHpRef = boss.maxHp; // eigene Referenz – falls später geändert wird
  console.log('[Kristof] Spawn', {hp: boss.hp, maxHp: boss.maxHp, baseHp0, kristofKills, scalingMul: scalingMul.toFixed(3), bonusHp, gen: boss.shockwaveState._gen, enemies: state.enemies.length});
  // Beim Erscheinen: alle aktuellen Gegner leicht verstärken (natürliche Einbindung statt Wave-Reset)
  try {
    const dmgBuff = 1.10; // +10% Schaden
    const hpBuff  = 1.12; // +12% HP
    for(const e of state.enemies){
      if(!e || e===boss || e.boss) continue;
      if(e.maxHp){ e.maxHp *= hpBuff; }
      if(e.hp){ e.hp *= hpBuff; }
      if(e.dmg){ e.dmg *= dmgBuff; }
    }
    console.log('[Kristof] Globale Gegner-Verstärkung beim Spawn (+12% HP, +10% DMG)');
  } catch(_){ }
    // Einsaugen aller aktuellen Gegner beim Erscheinen -> Schilde (jede Spawn-Instanz eigenständig)
    setTimeout(()=>{
      if(!boss || boss._spawnAbsorbDone) return;
      const pullList = [];
      for(const e of state.enemies){
        if(!e || e===boss || e.boss || e.elite) continue; // Elite NICHT einsaugen
        e._beingPulledToKristof = true;
        e._pullStartX = e.x; e._pullStartY = e.y;
        e._pullStartTime = state.time;
        e._pullDur = 0.55 + Math.random()*0.25;
        pullList.push(e);
      }
      if(pullList.length){
        boss._pendingAbsorbCount = pullList.length;
    boss._spawnAbsorbDone = true;
        console.log('[Kristof Spawn] visueller Sog', pullList.length, 'Gegner');
      } else {
        console.log('[Kristof Spawn] keine Gegner zum Einsaugen gefunden');
      }
    }, 120);
  // Per-Frame Pull Update Hook (nur einmal anhängen)
  if(!window.__kristofPullAttached){
    window.__kristofPullAttached = true;
    (function pullUpdateLoop(){
      if(state && state.kristof){
        const k = state.kristof;
        let newlyArrived = 0;
        for(let i=state.enemies.length-1;i>=0;i--){
          const e = state.enemies[i];
          if(!e || !e._beingPulledToKristof) continue;
          const t = state.time - (e._pullStartTime||0);
          const d = e._pullDur || 0.6;
          const prog = Math.min(1, t/d);
          // Ease-In Curve
          const ease = prog*prog* (3 - 2*prog);
          e.x = e._pullStartX + (k.x - e._pullStartX) * ease;
          e.y = e._pullStartY + (k.y - e._pullStartY) * ease;
          // Spiral Effekt leicht
          const ang = (1 - prog) * 4 * Math.PI;
          const off = (1 - prog) * 28;
          e.x += Math.cos(ang) * off * 0.15;
          e.y += Math.sin(ang) * off * 0.15;
          // Partikelspur
          if(Math.random()<0.25) particle(e.x + (Math.random()-0.5)*4, e.y + (Math.random()-0.5)*4, '#ff4444');
          if(prog >= 1){
            newlyArrived++;
            // Entfernen & zählen
            state.enemies.splice(i,1);
          }
        }
        if(newlyArrived > 0){
          k.absorbShields = (k.absorbShields||0) + newlyArrived;
          // Erhöht: 200 Schild-HP pro eingesaugtem Gegner (vorher 100)
          k.absorbShieldHP = (k.absorbShieldHP||0) + newlyArrived * 200;
          if(!k._didInitialAbsorb) k._didInitialAbsorb = true;
          console.log('[Kristof] absorbiert (tick)', newlyArrived, '-> total Shields', k.absorbShields, 'HP', k.absorbShieldHP);
        }
      }
      requestAnimationFrame(pullUpdateLoop);
    })();
  }
  // Absorb-Schild Mechanik initialisieren
  boss.absorbShields = 0; // wird gleich nach Einsaugen gesetzt
  boss.absorbShieldHP = 0; // Gesamt absorbierbarer Schaden bevor echte HP sinken
  boss._didInitialAbsorb = false;
  // Gently push away nearby enemies so Kristof is visible (no hard pop / disappearance)
  for(const e of state.enemies){
    if(e === boss) continue;
    const dx = e.x - boss.x;
    const dy = e.y - boss.y;
    let dist = Math.hypot(dx,dy) || 0.0001;
    const minDist = (e.r || 16) + boss.r + 24;
    if(dist < minDist){
      const push = (minDist - dist);
      const nx = dx / dist;
      const ny = dy / dist;
      e.x += nx * push;
      e.y += ny * push;
    }
  }
  
  function spawnEliteNearBoss(bossRef) {
    for(let i=0;i<5;i++){
      const angle = Math.random() * Math.PI * 2;
      const dist = 120 + Math.random()*60;
      const x = bossRef.x + Math.cos(angle)*dist;
      const y = bossRef.y + Math.sin(angle)*dist;
      const elite = {
        x, y, r: 28, hp: 4000, maxHp: 4000, speed: 80, elite: true, lastHitId: -1, dmg: 60, type: 'runner', shootTimer: 9999, exp: 90, color: '#f0a020', knockbackVX: 0, knockbackVY: 0, hitCooldown: 0
      };
      state.enemies.push(elite);
    }
  }
  // Initial: keine sofortige Elite-Welle mehr hier (kommt nach Absorb)
  
  // Periodische Elite-Spawns deaktiviert – jetzt nur bei 50% HP Sonderwelle
  
  kristofEventTextTimer = 2.2; 
}

// Kristof Shockwave System
// Konfig
const KRISTOF_CENTER_LOCK = true; // während Sequenz in der Mitte fixiert
const KRISTOF_WAVE_SPACING = 1.4; // Sekunden zwischen Wellen
const KRISTOF_WAVE_SPEED = 420; // geringere Ausbreitungsgeschwindigkeit
const KRISTOF_JUMP_COOLDOWN = 0.35; // Spieler-Sprung-Cooldown
// Request a shockwave sequence (will force movement to center first)
function kristofStartShockSequence(boss){
  if(!boss || !boss.shockwaveState) return;
  const st = boss.shockwaveState;
  if(st.active || st.movingToCenter || st.telegraphing) return; // already in progress
  st._phaseStartHpPct = (boss.hp / boss.maxHp).toFixed(3);
  st.movingToCenter = true;
  st.targetX = innerWidth/2;
  st.targetY = innerHeight/2;
  // Für zweite (40%) Phase Center-Lock erneut aktivieren
  st.centerReleased = false;
  console.log('[Kristof] Shockwave-Sequenz angefordert -> Laufe zur Mitte');
  // kein automatischer Repeat mehr
  boss._nextShockRepeat = 0;
  // Direkt unverwundbar ab Auslösung (inkl. Lauf + Telegraph + Waves)
  boss.invulnerable = true;
  // Platzhalter bis Waves beginnen; wird in kristofBeginWaves überschrieben
  st.invulnTimer = 9999;
}

// Gegner erneut ansaugen bei jeder Shockwave-Phase (80% / 40%)
function kristofPhaseAbsorb(boss){
  if(!boss) return;
  const pullList = [];
  for(const e of state.enemies){
    if(!e || e===boss || e.boss || e.elite) continue; // Elite ausgenommen
    if(e._beingPulledToKristof) continue;
    e._beingPulledToKristof = true;
    e._pullStartTime = state.time;
    e._pullDur = 0.5 + Math.random()*0.22;
    pullList.push(e);
  }
  if(pullList.length){
    console.log('[Kristof] Phase-Absorb', pullList.length, 'Gegner');
  }
}

function kristofBeginWaves(boss){
  if(!boss || !boss.shockwaveState) return;
  const st = boss.shockwaveState;
  st.movingToCenter = false;
  st.seqIndex = 0;
  st.active = true;
  const telegraphDuration = 0.9; // Vorwarnzeit
  st.telegraphing = true;
  st.telegraphUntil = state.time + telegraphDuration;
  const totalInvuln = telegraphDuration + 2.6; // etwas länger als reine Wellen
  st.invulnTimer = totalInvuln;
  boss.invulnerable = true;
  console.log('[Kristof] Telegraph startet');
  console.log('[Kristof] PhaseStart', {gen: st._gen, trig80: st.triggered80, trig40: st.triggered40, hpPct: (boss.hp/boss.maxHp).toFixed(3)});
  // Bei Phasenstart Gegner reinziehen (zusätzlich zum Spawn-Pull)
  kristofPhaseAbsorb(boss);
  // Starte erste Welle nach Telegraph
  kristofQueueNextWave(boss, telegraphDuration);
  boss._nextShockRepeat = 0;
}
function kristofQueueNextWave(boss, delay){
  if(!boss || !boss.shockwaveState) return;
  const st = boss.shockwaveState;
  if(st.seqIndex >= st.seqTotal){ st.active=false; return; }
  const myGen = st._gen;
  const nextIndex = st.seqIndex + 1; // which wave will be spawned after delay
  const spawnDelay = (delay || 0) * 1000;
  console.log('[Kristof] Plane Wave', nextIndex, 'in', delay,'s');
  setTimeout(()=>{
    // Boss evtl. tot / entfernt
    if(!boss.shockwaveState){ console.warn('[Kristof] Wave abort (no state)'); return; }
    const st2 = boss.shockwaveState;
    if(st2._gen !== myGen){ console.warn('[Kristof] Wave abort (gen mismatch)'); return; }
    if(st2.seqIndex >= st2.seqTotal) return; // schon fertig
    st2.seqIndex++;
    // Shockwave Objekt anlegen
    const wave = {
      start: state.time, // sofort starten
      r: 0,
      width: 70,
      speed: KRISTOF_WAVE_SPEED,
      maxR: 2400,
      originX: boss.x,
      originY: boss.y,
  hit: false,
  color: '#ff2d2d',
  innerColor: '#ff0000'
    };
    state.shockwaves.push(wave);
  console.log('[Kristof] Wave', st2.seqIndex, 'gestartet', {gen: st2._gen, originX: boss.x, originY: boss.y});
    if(st2.seqIndex >= st2.seqTotal){
      // Letzte Welle -> Sequenz markiert sich als beendet; Invuln endet später wenn Timer abläuft
      st2.active = false;
    } else {
      kristofQueueNextWave(boss, KRISTOF_WAVE_SPACING);
    }
  }, spawnDelay);
}
function updateShockwaves(dt){
  for(let i=state.shockwaves.length-1;i>=0;i--){
    const sw = state.shockwaves[i];
    if(state.time < sw.start) continue;
    const age = state.time - sw.start;
    sw.r = age * sw.speed;
    if(sw.r - sw.width > sw.maxR){ state.shockwaves.splice(i,1); continue; }
    // player hit detection when ring passes
  const ox = sw.originX != null ? sw.originX : (state.kristof ? state.kristof.x : 0);
  const oy = sw.originY != null ? sw.originY : (state.kristof ? state.kristof.y : 0);
  const dist = Math.hypot(player.x - ox, player.y - oy);
    if(!sw.hit && sw.r - sw.width*0.5 <= dist && dist <= sw.r + sw.width*0.5){
      // if player is jumping at sufficient height -> dodge
      const dodge = player.isJumping && (player.jumpOffset||0) > 40; // threshold
      if(!dodge){
        const dmg = Math.round(player.maxHp * 0.20);
        if(typeof damagePlayer === 'function'){
          damagePlayer(dmg);
        } else {
          player.hp = Math.max(0, player.hp - dmg);
        }
      }
      sw.hit = true;
    }
  }
  // Kein Auto-Repeat mehr
}

// Elite Spawn bei 50% einmalig
function kristofCheckMidHP(k){
  if(!k || k._spawned50) return;
  if(k.hp / k.maxHp <= 0.50){
    k._spawned50 = true;
    // Einmalige Elite-Welle
    for(let i=0;i<7;i++){
      const ang = Math.random()*Math.PI*2; const d= 150 + Math.random()*90;
      const ex = k.x + Math.cos(ang)*d; const ey = k.y + Math.sin(ang)*d;
      state.enemies.push({x:ex,y:ey,r:28,hp:4800,maxHp:4800,speed:85,elite:true,lastHitId:-1,dmg:70,type:'runner',shootTimer:9999,exp:120,color:'#f0b030',knockbackVX:0,knockbackVY:0,hitCooldown:0});
    }
    console.log('[Kristof] 50% Elite-Welle gespawnt');
  }
}

// Zusätzliche einfache Kristof-AI im Testmodus, falls normale Loop nicht greift
setInterval(()=>{
  // Sicher: TESTMODE_BOSS kann undefiniert sein -> dann einfach nichts tun
  if(typeof TESTMODE_BOSS==='undefined' || !TESTMODE_BOSS) return;
  const k = state.kristof; if(!k) return;
  // Leicht auf Spieler zulaufen
  if(player){
    const dx = player.x - k.x; const dy = player.y - k.y; const d = Math.hypot(dx,dy) || 1;
    const sp = 60; k.x += dx/d * 0.16 * sp; k.y += dy/d * 0.16 * sp;
  }
  // Falls noch keine Welle jemals -> forcieren
  if(k.shockwaveState && !k.shockwaveState.active && !k.shockwaveState.triggered80){
    kristofStartShockSequence(k);
  k.shockwaveState.triggered80 = true;
  }
}, 500);

 
 
function kristofDeathCleanup() {
  
  
}
 
 
 
 
 
const enemySpriteSheets = {
  NormNah: {
    walk: { img: new Image(), w: 64, h: 64, frames: 6, fps: 8 },
    r: 20
  },
  NormFern: {
    walk: { img: new Image(), w: 64, h: 64, frames: 6, fps: 8 },
    r: 20
  },
  EliteNah: {
    walk: { img: new Image(), w: 64, h: 64, frames: 6, fps: 8 },
    r: 28
  },
  EliteFern: {
    walk: { img: new Image(), w: 64, h: 64, frames: 6, fps: 8 }
  }
};
enemySpriteSheets.NormNah.walk.img.src = 'img/Gegner/NormNah/walk.png';
enemySpriteSheets.NormFern.walk.img.src = 'img/Gegner/NormFern/walk_01.png';
enemySpriteSheets.NormFern.walk.w = 128;
enemySpriteSheets.NormFern.walk.h = 128;
enemySpriteSheets.EliteNah.walk.img.src = 'img/Gegner/EliteNah/walk.png';
enemySpriteSheets.EliteFern.walk.img.src = 'img/Gegner/EliteFern/walk.png';

// --- Elite Dash Attack Config ---
const ELITE_DASH_CFG = {
  telegraph: 0.75,          // länger: mehr Reaktionszeit (vorher 0.55)
  cooldownMin: 18.0,        // etwas höherer Mindest-CD (vorher 16)
  cooldownMax: 30.0,        // etwas höherer Max-CD (vorher 26)
  minDist: 140,             // etwas größer: startet nicht direkt neben Spieler
  maxDist: 560,             // leicht reduziert – weniger Fernstart
  maxDistance: 400,         // deutlich kürzer (vorher 520)
  speedMul: 5.9,            // langsamer (vorher 7.5)
  recover: 0.70,            // längere Erholungsphase (vorher 0.55)
  dmgFactor: 0.35,          // Basis-Schaden für Elite Dashes (Kristof bekommt eigene Reduktion darunter)
  kristofDmgFactor: 0.22,   // Kristof Dash Multiplikator auf e.dmg
  kristofHpPctCap: 0.14,    // Maximaler Anteil an player.maxHp für EINEN Dash-Treffer (14%)
  touchIFrame: 0.45,        // etwas längere IFrames für Spieler nach Treffer
  grazeWindow: 0.22         // Zeit kurz vor Impact in der Spieler leichter ausweicht (für künftige Feinlogik)
};

function getEnemySpriteSheet(e) {
  if(e.elite && e.type==='ranged') return enemySpriteSheets.EliteFern.walk;
  if(e.elite) return enemySpriteSheets.EliteNah.walk;
  if(e.type==='ranged') return enemySpriteSheets.NormFern.walk;
  return enemySpriteSheets.NormNah.walk;
}

function drawEnemy(ctx, e, frame=0) {
  if(window.TESTMODE && !e.boss && !e.elite && e.hp > 1) e.hp = 1;
  const sheet = getEnemySpriteSheet(e); 
  if(!sheet.img.complete || sheet.img.naturalWidth === 0) return;
  let dir = 'down';
  if(typeof player !== 'undefined') {
    const dx = player.x - e.x;
    const dy = player.y - e.y;
    if(Math.abs(dx) > Math.abs(dy)) {
      dir = dx > 0 ? 'right' : 'left';
    } else {
      dir = dy > 0 ? 'down' : 'up';
    }
  }
  const rows = ["up","left","down","right"];
  const rowIdx = rows.indexOf(dir);
  const f = frame % sheet.frames;
  ctx.save();
  ctx.imageSmoothingEnabled = false;
  let scale = 1;
  // Größere Gegner
  if(e.elite && !e.type?.includes('ranged')) scale = 1.45;
  else if(e.type==='ranged' || e.type==='melee') scale = 1.25;
  if(e.boss && (e.name === 'Kristof' || e.name === 'The Truth')) scale = 2.2;
  const drawW = Math.round(sheet.w * scale);
  const drawH = Math.round(sheet.h * scale);
  if(e.hitFlash && e.hitFlash > 0) {
    ctx.filter = 'brightness(2.2) drop-shadow(0 0 36px #ff0000) drop-shadow(0 0 24px #ff2222) drop-shadow(0 0 8px #ff0000)';
    ctx.globalAlpha = 0.88;
  }
  ctx.drawImage(sheet.img, f*sheet.w, (rowIdx>=0?rowIdx:2)*sheet.h, sheet.w, sheet.h, Math.round(e.x-drawW/2), Math.round(e.y-drawH/2), drawW, drawH);
  ctx.filter = 'none';
  ctx.globalAlpha = 1;
  ctx.restore();
  // --- Debuff Overlay (Stun / Vulnerable) ---
  try {
    const now = state.time || 0;
    if(e.stunUntil && now < e.stunUntil){
      ctx.save();
      ctx.globalAlpha = 0.55;
      ctx.fillStyle = 'rgba(255,255,90,0.5)';
      ctx.beginPath(); ctx.arc(e.x, e.y, (e.r||20)*1.15, 0, Math.PI*2); ctx.fill();
      ctx.restore();
    }
    if(e.vulnUntil && now < e.vulnUntil){
      ctx.save();
      const tPulse = (performance.now()/250)%1;
      const a = 0.35 + 0.25*Math.sin(tPulse*Math.PI*2);
      ctx.globalAlpha = a;
      ctx.strokeStyle = '#ff2d75';
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(e.x, e.y, (e.r||20)*1.35, 0, Math.PI*2); ctx.stroke();
      ctx.restore();
    }
  } catch(_err){}
  // Telegraph-Anzeige für Elite-Dash
  if(e.elite && e.dashState === 'telegraph' && typeof e.dashAngle === 'number'){
    try {
      const len = e._dashPreviewDist || 260;
      ctx.save();
      const pulse = 0.55 + 0.45 * Math.sin(performance.now()/90);
      ctx.globalAlpha = pulse;
      ctx.lineWidth = 6;
      ctx.strokeStyle = '#ffcc33';
      ctx.beginPath();
      ctx.moveTo(e.x, e.y);
      ctx.lineTo(e.x + Math.cos(e.dashAngle)*len, e.y + Math.sin(e.dashAngle)*len);
      ctx.stroke();
      // kleiner Zielkreis
      ctx.beginPath();
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#ff9326';
      ctx.arc(e.x + Math.cos(e.dashAngle)*len, e.y + Math.sin(e.dashAngle)*len, 12, 0, Math.PI*2);
      ctx.stroke();
      ctx.restore();
    } catch(_err){}
  }
  // Kurzer Streifen beim aktiven Dash
  if(e.elite && e.dashState === 'dash' && typeof e.dashAngle === 'number'){
    try {
      ctx.save();
      ctx.globalAlpha = 0.35;
      ctx.fillStyle = '#ffaa33';
      const tail = Math.min(160, (e.dashSpeed||0)*0.18);
      ctx.beginPath();
      const ax = Math.cos(e.dashAngle), ay = Math.sin(e.dashAngle);
      const px = -ay, py = ax;
      ctx.moveTo(e.x + px*14, e.y + py*14);
      ctx.lineTo(e.x - px*14, e.y - py*14);
      ctx.lineTo(e.x - ax*tail - px*6, e.y - ay*tail - py*6);
      ctx.lineTo(e.x - ax*tail + px*6, e.y - ay*tail + py*6);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    } catch(_err){}
  }
  if(e.boss && (e.name === 'Kristof' || e.name === 'The Truth')) {
  const nw = state.enemies[state.enemies.length-1];
  if(nw && nw.elite && nw.type==='runner'){ nw.dashState='idle'; nw.dashCooldown = 2 + Math.random()*2; }
    ctx.save();
    ctx.globalAlpha = 0.95;
    const barW = 64, barH = 8;
    const barX = e.x - barW/2, barY = e.y - e.r - 24;
    ctx.fillStyle = '#222';
    ctx.fillRect(barX, barY, barW, barH);
    let hpRatio = Math.max(0, Math.min(1, e.hp / e.maxHp));
    ctx.fillStyle = '#e74c3c';
    ctx.fillRect(barX, barY, barW * hpRatio, barH);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.strokeRect(barX, barY, barW, barH);
    ctx.font = 'bold 15px Arial';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#fff';
    ctx.fillText(e.name, e.x, barY - 6);
    ctx.restore();
  }
}
 
const DEATH_W = 64, DEATH_H = 64;
const DEATH_FRAMES = 6; 
const deathImg = new Image();
const eliteNahDeathImg = new Image();
deathImg.src = "img/Fred Animation/Fred Sword/hurt.png";
eliteNahDeathImg.src = "img/Gegner/EliteNah/hurt.png";
let deathFrame = 0;
let isDying = false;
let finishedDying = false;
// Konfiguration: Wenn false -> sofortiges Game Over ohne Todesanimation
window.ENABLE_DEATH_ANIMATION = false;

function getDeathFrame(frameIndex) {
  const col = Math.max(0, Math.min(DEATH_FRAMES - 1, frameIndex|0));
  return { sx: col * DEATH_W, sy: 0, sw: DEATH_W, sh: DEATH_H };
}
function drawSpriteFeet(ctx, img, r, feetX, feetY, scale=1) {
  const dw = Math.round(r.sw * scale);
  const dh = Math.round(r.sh * scale);
  const dx = Math.round(feetX - dw/2);
  const dy = Math.round(feetY - dh);   
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(img, r.sx, r.sy, r.sw, r.sh, dx, dy, dw, dh);
}
function startDeath() {
  if(!window.ENABLE_DEATH_ANIMATION){
    // Sofort beenden statt animieren
    die();
    return;
  }
  isDying = true; finishedDying = false; deathFrame = 0; updateDeath._t = 0;
}
function updateDeath(dtMs) {
  if (!isDying || finishedDying) return;
  updateDeath._t = (updateDeath._t || 0) + dtMs;
  if (updateDeath._t >= 333) { 
    updateDeath._t = 0;
    deathFrame++;
    if (deathFrame >= DEATH_FRAMES) {
      deathFrame = DEATH_FRAMES - 1;
      finishedDying = true;
      // Automatisch Game Over finalisieren, falls noch nicht ausgelöst
      if(!state.dead && typeof die === 'function') {
        die();
      }
    }
  }
}
function renderDeath(ctx, feetX, feetY, isEliteNah) {
  const img = isEliteNah ? eliteNahDeathImg : deathImg;
  if (!img.complete || img.naturalWidth === 0) return;
  const r = getDeathFrame(deathFrame);
  drawSpriteFeet(ctx, img, r, feetX, feetY, 1.5);
}
// Fehlende die()-Funktion (wird nach Todesanimation aufgerufen)
function die(){
  if(state.dead) return;
  state.dead = true;
  isDying = false;
  finishedDying = true;
  // Versuche zuerst vorhandenes HTML Overlay (#gameOver) zu nutzen, sonst dynamisch erstellen (#gameOverOverlay)
  let ov = document.getElementById('gameOver') || document.getElementById('gameOverOverlay');
  const usedExisting = !!ov && ov.id === 'gameOver';
  if(!ov){
    try {
      ov = document.createElement('div');
      ov.id = 'gameOverOverlay';
      ov.className = 'overlay show';
      ov.style.position='fixed';
      ov.style.inset='0';
      ov.style.background='rgba(0,0,0,0.78)';
      ov.style.display='flex';
      ov.style.flexDirection='column';
      ov.style.alignItems='center';
      ov.style.justifyContent='center';
      ov.style.fontFamily='Cinzel, Orbitron, serif';
      ov.style.zIndex='99999';
      ov.style.color='#eee';
      ov.innerHTML = '<h1 style="margin:0 0 24px;font-size:64px;letter-spacing:3px;color:#e6c97a;text-shadow:0 0 18px #000,0 0 22px #e6c97a88">GAME OVER</h1>'+
        '<div id="gameOverScore" style="font-size:28px;margin-bottom:32px;color:#ffe600;text-shadow:0 2px 8px #000,0 0 8px #ffe60088;">Score: 0</div>'+
        '<button id="restartBtnDyn" style="padding:16px 40px;font-size:20px;font-weight:700;background:linear-gradient(135deg,#7a38e1,#5238e1);border:0;border-radius:14px;cursor:pointer;color:#fff;letter-spacing:1px;box-shadow:0 4px 18px -4px #000a,0 0 0 1px #000 inset;">Neustart</button>';
      document.body.appendChild(ov);
      const rbd = document.getElementById('restartBtnDyn');
      if(rbd) rbd.onclick = ()=>{ if(typeof window.restart==='function') window.restart(); };
    } catch(err){ console.warn('[GameOver Overlay Erstellung fehlgeschlagen]', err); }
  }
  // Zusätzliche Sicherheits-Schicht: Falls overlay existiert aber durch CSS (z.B. fehlende .show) unsichtbar bleibt -> hart sichtbar machen
  function forceVisible(el){
    if(!el) return;
    el.classList.add('show');
    el.style.visibility = 'visible';
    el.style.opacity = '1';
    el.style.pointerEvents = 'auto';
    // Wenn das Overlay bereits die Standard-Klasse .overlay besitzt, NICHT auf flex umstellen
    const hasOverlayClass = el.classList && el.classList.contains('overlay');
    if(!el.style.display || el.style.display==='none'){
      // Standard Layout für vorhandene Overlays: grid (entspricht CSS .overlay)
      el.style.display = hasOverlayClass ? 'grid' : 'flex';
    }
    if(hasOverlayClass){
      // Sicherstellen, dass grid wirklich zentriert (falls Styles überschrieben wurden)
      el.style.placeItems = 'center';
    } else {
      // Fallback-Overlay (dyn) sauber mittig
      el.style.alignItems='center';
      el.style.justifyContent='center';
      if(!el.style.flexDirection) el.style.flexDirection='column';
    }
    if(!el.style.background || el.style.background==='rgba(5,6,9,0.0)') el.style.background='rgba(5,6,9,0.65)';
    el.style.zIndex = '99999';
  }
  if(ov){
    // Falls vorhandenes Overlay (#gameOver) genutzt wird -> nur Klasse hinzufügen
    if(ov.classList && !ov.classList.contains('show')) ov.classList.add('show');
    // Prüfen ob effektiv sichtbar; falls nicht -> erzwingen
    const cs = window.getComputedStyle ? getComputedStyle(ov) : null;
    if(!cs || cs.display==='none' || parseFloat(cs.opacity||'1') < 0.1){
      forceVisible(ov);
    } else {
      ov.style.visibility = 'visible';
      // vorhandenes #gameOver sollte grid bleiben
      if(!ov.style.display) ov.style.display = ov.classList.contains('overlay') ? 'grid' : 'flex';
      if(ov.classList.contains('overlay')) ov.style.placeItems='center';
    }
  }
  // Score aktualisieren
  try {
    const scoreDiv = document.getElementById('gameOverScore');
    if(scoreDiv) scoreDiv.textContent = 'Score: '+ (typeof liveScore!=='undefined'? liveScore: 0);
  } catch(e) { /* ignore */ }
  window.gameOverOverlay = ov; // Referenz vereinheitlichen
  // Spiel anhalten
  state.running = false;
  if(window.__gameRaf){ cancelAnimationFrame(window.__gameRaf); window.__gameRaf = null; }
  console.log('[Player] gestorben -> Game Over ausgelöst');
  // Letztes Debugging: Marker ins DOM setzen für visuelle Prüfung
  if(!document.getElementById('gameOverDebugFlag')){
    const f=document.createElement('div');
    f.id='gameOverDebugFlag';
    f.textContent='[GAME OVER ACTIVE]';
    f.style.position='fixed';
    f.style.bottom='8px';
    f.style.left='8px';
    f.style.background='#c00';
    f.style.color='#fff';
    f.style.font='bold 12px monospace';
    f.style.padding='4px 8px';
    f.style.zIndex='100000';
    f.style.boxShadow='0 0 8px #000';
    document.body.appendChild(f);
  }
}
 
const fredSlashImg = new Image();
fredSlashImg.src = "img/Fred Animation/Fred Sword/slash_oversize.png";
const FRED_SLASH_W = 192;
const FRED_SLASH_H = 192;
const FRED_SLASH_COLS = 6;
const FRED_SLASH_ROWS = 4;
const FRED_SLASH_ROW = { up:0, left:1, down:2, right:3 };
function getFredSlashFrame(direction, frame) {
  
  const row = FRED_SLASH_ROW[direction] ?? 0;
  const col = frame % FRED_SLASH_COLS;
  return { sx: col*FRED_SLASH_W, sy: row*FRED_SLASH_H, sw: FRED_SLASH_W, sh: FRED_SLASH_H };
}

 
function drawFredSlash(ctx, playerX, playerY, direction, frame) {
  const f = getFredSlashFrame(direction, frame);
  if (fredSlashImg.complete && fredSlashImg.naturalWidth > 0) {
    ctx.save();
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(fredSlashImg, f.sx, f.sy, f.sw, f.sh, Math.floor(playerX - f.sw/2), Math.floor(playerY - f.sh/2), f.sw, f.sh);
    ctx.restore();
  }
}


 
let fredAnimState = "idle"; 
let fredDirection = "down";
let fredSlashDirection = "down"; 
let fredSlashAngle = 0; 
let fredFrame = 0;
let fredLastTick = 0;
 
function awardXP(amount) {
  console.log('[awardXP entry]', 'player:', player, 'amount:', amount);
  if (typeof player !== 'undefined') {
  amount = amount * 1.4; 
  player.xp = (player.xp || 0) + amount;
    while (player.xp >= player.next) {
      player.xp -= player.next;
      playerLevelUp();
    }
    console.log('[EXP]', 'xp:', player.xp, 'next:', player.next, 'level:', player.level);
    updateHUD();
  }
}
const kinds = ['range','dmg','speed','cooldown'];

 
let liveScore = 0;
function showLiveScore() {
  // Deaktiviert: Overlay nicht mehr anzeigen
  const el = document.getElementById('liveScoreOverlay');
  if(el) el.style.display='none';
}
// showLiveScore initial nicht mehr aufrufen
(()=>{
  
  
  
  function updateLiveScoreHUD() {}
  function updatePlayerVelocity() {
    
    let vx = 0, vy = 0;
      if(keys.has('a') || keys.has('arrowleft')) vx -= 1; 
      if(keys.has('d') || keys.has('arrowright')) vx += 1; 
      if(keys.has('w') || keys.has('arrowup')) vy -= 1; 
      if(keys.has('s') || keys.has('arrowdown')) vy += 1; 
      if(!window.TESTMODE) {
        if(vx !== 0 && vy !== 0) { vx *= Math.SQRT1_2; vy *= Math.SQRT1_2; }
      }
    
    if(vx !== 0 && vy !== 0) { vx *= Math.SQRT1_2; vy *= Math.SQRT1_2; }
    player.vx = vx * player.speed * (buffs.speed||1);
    player.vy = vy * player.speed * (buffs.speed||1);
  }
  
  
  const frameW = 64;
  const frameH = 64;
  const framesPerDir = 9; 
  const directions = ["up", "left", "down", "right"];
  function getFrameCoords(direction, frame) {
    const dirIndex = directions.indexOf(direction);
    const x = frame * frameW;
    const y = dirIndex * frameH;
    return {x, y, w: frameW, h: frameH};
  }
  const spriteBasePaths = {
    fred: './img/fred',
    bully: {
      sword: './img/Bully Animation/Bully Sword',
      staff: './img/Bully Animation/Bully Staff',
      dagger: './img/Bully Animation/Bully Dagger',
      halberd: './img/Bully Animation/Bully Halberd'
    }
  };


  
  const spriteAnimations = {
    fred: {
      walk: [],
      idle: [],
      dead: [],
      attack: [],
      hurt: {
        img: new Image(),
        w: 64,
        h: 64,
        frames: 6,
        fps: 12
      }
    },
    bully: {
      walk: [],
      idle: [],
      dead: [],
  attack: [] 
    },
    
  };
  
  spriteAnimations.fred.hurt.img.src = 'img/Fred Animation/Fred Sword/hurt.png';



  function loadSpriteSequence(targetArr, basePath, prefix, count, customNames) {
    for(let i=1; i<=count; i++) {
      const img = new Image();
      if(customNames) {
        img.src = `${basePath}/${customNames[i-1]}`;
      } else {
        img.src = `${basePath}/${prefix} (${i}).png`;
      }
      targetArr.push(img);
    }
  }

  
  
  
  // Dynamisches Laden abhängig von Bully-Waffe
  function loadBullySheets(weaponId){
    if(!weaponId) weaponId = 'sword';
    let key;
    if(/staff/i.test(weaponId)) key='staff';
    else if(/dagger/i.test(weaponId)) key='dagger';
    else if(/halb|halberd/i.test(weaponId)) key='halberd';
    else key='sword';
    if(spriteAnimations.bully._currentKey === key) return; // bereits geladen
    spriteAnimations.bully._currentKey = key;
    const base = spriteBasePaths.bully[key];
    spriteAnimations.bully.walkSheet = new Image();
    spriteAnimations.bully.walkSheet.src = base + '/walk.png';
    spriteAnimations.bully.idleSheet = new Image();
    spriteAnimations.bully.idleSheet.src = base + '/idle.png';
    spriteAnimations.bully.hurtSheet = new Image();
    spriteAnimations.bully.hurtSheet.src = base + '/hurt.png';
  }
  // Initial (standard) laden
  loadBullySheets('sword');


 
let playerLastDir = 'down'; 
let playerLastMove = {x:0, y:1};

  
  let lastRestart = 0;
  addEventListener('keydown', e=>{
      const k = e.key.toLowerCase();
// Dolch-DoT-Mechanik
let lastDaggerDotTime = 0;
function throwDaggerDot() {
  const now = performance.now();
  if(now - lastDaggerDotTime < 400) return; // Spam-Schutz
  lastDaggerDotTime = now;
  // Richtung bestimmen (letzte Bewegung oder Maus)
  let dirX = playerLastMove.x, dirY = playerLastMove.y;
  if(typeof mouseX === 'number' && typeof mouseY === 'number') {
    const dx = mouseX - player.x, dy = mouseY - player.y;
    if(Math.abs(dx) + Math.abs(dy) > 2) {
      const len = Math.hypot(dx,dy);
      dirX = dx/len; dirY = dy/len;
    }
  }
  // Projektil erzeugen
  const speed = 700;
  const proj = {
    x: player.x,
    y: player.y,
    vx: dirX * speed,
    vy: dirY * speed,
    r: 10,
    color: '#f7c948',
    dmg: 0, // kein Sofortschaden
    range: 520,
    traveled: 0,
    pierce: 0,
    type: 'daggerDot',
    hit: false
  };
  state.projectiles.push(proj);
}
  keys.add(k);
      if(k==='escape'){
        const startOpen = !!document.getElementById('startMenu')?.classList.contains('show');
        const gameOverVisible = !!(document.getElementById('gameOver') && getComputedStyle(document.getElementById('gameOver')).display !== 'none');
        const lootOpen = !!window._lootChoiceOpen;
        if(!startOpen && !gameOverVisible && !lootOpen){
          togglePause();
        }
        e.preventDefault();
      }
      // Restart verlegt auf Shift+R (normales R = Spin). Alte Funktion hier entfernt.
      if(k==='r' && e.shiftKey){
        const active = document.activeElement;
        if(active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA')) return;
        const now = Date.now();
        if(now - lastRestart > 1000){
          restart();
          lastRestart = now;
          return; // Verhindert gleichzeitiges Auslösen anderer R-Aktionen
        } else {
          console.log('Restart gesperrt (Cooldown)');
          return;
        }
      }
      // Space: Jump statt Angriff
      if(k===' ') {
        console.log('[Jump] Space pressed');
        e.preventDefault();
        if(!player.isJumping && !player.jumpCooldown){
          startPlayerJump();
          console.log('[Jump] startPlayerJump triggered');
        } else {
          console.log('[Jump] ignored (jumping or cooldown)', player.isJumping, player.jumpCooldown);
        }
      }
  if(k==='q'){ console.log('[Key] Q pressed'); if(window.triggerAbilityQ) window.triggerAbilityQ(); }
  if(k==='e'){ console.log('[Key] E pressed'); if(window.triggerAbilityE) window.triggerAbilityE(); }
  
  
  
  
  
    });

// Dolch-DoT-Update in Game Loop
function updateDaggerDots(dt) {
  for(const e of state.enemies) {
    if(e && e.daggerDot) {
      // Entferne DoT sofort, wenn Gegner tot ist
      if(e.hp <= 0) {
        e.daggerDot = undefined;
        continue;
      }
      // Unterstützt jetzt mehrere Stacks: Struktur { stacks: [ {t,dur,dmg} , ... ], max:3 }
      if(Array.isArray(e.daggerDot.stacks)){
        for(let i=e.daggerDot.stacks.length-1;i>=0;i--){
          const st = e.daggerDot.stacks[i];
          st.t += dt;
          if(st.t >= st.dur){ e.daggerDot.stacks.splice(i,1); continue; }
          const tick = st.dmg / st.dur * dt;
          e.hp -= tick;
          if(typeof window.addDamageFloater==='function'){
            window.addDamageFloater({x:e.x, y:e.y-(e.r||24), amount:tick, type:'poison'});
          }
          if(TESTMODE_BOSS && e.boss){
            console.log(`[Boss-Debug] DoT-Tick(Stack${i+1}/${e.daggerDot.stacks.length}): -${tick.toFixed(2)} HP t:${st.t.toFixed(2)}/${st.dur}`);
          }
          // Leichter Gift-Partikel Effekt pro Tick
          if(Math.random()<0.11) particle(e.x + (Math.random()-0.5)*e.r*1.0, e.y + (Math.random()-0.5)*e.r*1.0, 'rgba(60,255,120,0.08)');
        }
        if(e.daggerDot.stacks.length===0){ e.daggerDot = undefined; }
      } else {
        // Fallback alte Struktur (wird entfernt sobald ausgelaufen)
        if(typeof e.daggerDot.t === 'number' && typeof e.daggerDot.dur === 'number') {
          e.daggerDot.t += dt;
          if(e.daggerDot.t >= e.daggerDot.dur) {
            e.daggerDot = undefined;
          } else if(e.daggerDot.active) {
            const tick = e.daggerDot.dmg / e.daggerDot.dur * dt;
            e.hp -= tick;
            if(typeof window.addDamageFloater==='function'){
              window.addDamageFloater({x:e.x, y:e.y-(e.r||24), amount:tick, type:'poison'});
            }
            if(Math.random()<0.16) particle(e.x + (Math.random()-0.5)*e.r*1.1, e.y + (Math.random()-0.5)*e.r*1.1, 'rgba(60,255,120,0.06)');
          }
        }
      }
    }
  }
}

// Temp Speed Buff Tick (from E ability placeholder)
// (alter temporärer Speedbuff für E entfernt)

// Jump System (Spacebar)
function startPlayerJump(){
  player.isJumping = true;
  player.jumpT = 0;
  player.jumpDur = 0.55; // kürzer
  player.jumpHeight = 120; // Pixel visueller Offset (unverändert)
  player.jumpCooldown = player.jumpCooldown || 0; // ensure defined
  player.jumpCooldown = KRISTOF_JUMP_COOLDOWN; // deutlich kürzerer Cooldown für Boss-Pattern
  player.jumpIFrames = 0.5; // Unverwundbarkeit beim Absprung/Peak
  player.iFrames = Math.max(player.iFrames||0, player.jumpIFrames);
}
function updatePlayerJump(dt){
  if(typeof player.jumpCooldown === 'number' && player.jumpCooldown>0){
    player.jumpCooldown -= dt; if(player.jumpCooldown < 0) player.jumpCooldown = 0;
  }
  if(!player.isJumping) { player.jumpOffset = 0; player.visualY = player.y; return; }
  player.jumpT += dt;
  const t = player.jumpT / player.jumpDur;
  if(t >= 1){
    player.isJumping = false;
    player.jumpOffset = 0;
    player.effectiveR = player.r; // restore
    return;
  }
  const arc = 4 * t * (1 - t); // Parabel 0..1..0
  player.jumpOffset = arc * player.jumpHeight;
  player.effectiveR = player.r * (t < 0.5 ? 0.45 : 0.65); // kleinerer Hitbox während Luft
  // Sichtbarer Hop: temporär y anheben (nur Anzeige – Kollisionslogik nutzt jumpOffset bereits für Schatten)
  player.visualY = player.y - player.jumpOffset * 0.6;
}
// --- Dash Update & Render (injected) ---
if(!window.__dashInjected){
  window.__dashInjected = true;
  window.updatePlayerDash = function(dt){
    if(!player.isDashing) return;
    player.dashTime += dt;
    const rc = window.rightClickDash;
    const tRaw = player.dashTime / player.dashDur;
    const t = Math.min(1, tRaw);
  // Ease In-Out (langsamer Start, schnelleres Ende)
  const eased = t<0.5 ? 2*t*t : 1-2*(1-t)*(1-t);
    if(rc){
      const nx = rc.startX + (rc.targetX - rc.startX) * eased;
      const ny = rc.startY + (rc.targetY - rc.startY) * eased;
      player.x = nx; player.y = ny;
    }
    player.dashTrail = player.dashTrail || [];
    player.dashTrail.push({x:player.x,y:player.y});
  if(player.dashTrail.length>40) player.dashTrail.shift(); // längerer Trail
    if(t >= 1){
      player.isDashing = false;
      for(let i=0;i<14;i++) particle(player.x + (Math.random()-0.5)*22, player.y + (Math.random()-0.5)*22, 'rgba(100,200,255,0.55)');
      if(window.DEBUG_DASH){ console.log('[Dash] end', {x:player.x,y:player.y}); }
    }
  };
  window.renderPlayerDashTrail = function(ctx){
    if(!player.dashTrail) return;
    ctx.save();
    for(let i=0;i<player.dashTrail.length;i++){
      const tr = player.dashTrail[i];
      const a = i / player.dashTrail.length;
      ctx.globalAlpha = a * 0.55;
      const r = player.r*(0.9+0.4*a);
      const g = ctx.createRadialGradient(tr.x,tr.y,0,tr.x,tr.y,r*2.1);
      g.addColorStop(0,'rgba(120,240,255,0.85)');
      g.addColorStop(0.4,'rgba(80,200,255,0.32)');
      g.addColorStop(1,'rgba(40,120,200,0)');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(tr.x,tr.y,r*2,0,Math.PI*2); ctx.fill();
    }
    ctx.restore();
  };
  // Q: temporärer Movement-Speed Buff (+40% für 3s, CD 6s)
  window.triggerAbilityQ = function(){
    if(!triggerActionKeyCD('q')) return;
  // (Ehem. Q Speed Aktivierung entfernt)
    player.speedGlowTimer = 0.35;
    for(let i=0;i<18;i++) particle(player.x + (Math.random()-0.5)*34, player.y + (Math.random()-0.5)*34, 'rgba(255,230,80,0.9)');
  };
  // Dash jetzt als natürliche Bewegung (Easing) mit 2 Charges
  window.rightClickDash = {
    charges: 2,
    maxCharges: 2,
    recharge: 6.0,
    rechargeTimer: 0,
    aim: false,
    aimStart: 0,
    minHold: 0.04,
    maxDist: 400,         // kürzer für klareren Dash-Eindruck
    dashDuration: 0.28,   // etwas länger -> wirkt weniger wie Teleport
    iFrameDuring: 0.24,   // leicht kürzer als Gesamtdauer
    cooldown: 0.0,
    lastDash: 0,
    targetX: 0,
    targetY: 0,
    startX: 0,
    startY: 0
  };
  function beginDashAim(){
    const rc = window.rightClickDash; if(!rc) return;
    if(rc.aim || player.isDashing) return;
    if(rc.charges <= 0) return;
    rc.aim = true; rc.aimStart = performance.now();
    rc.targetX = mouseX; rc.targetY = mouseY;
  }
  function cancelDashAim(){
    const rc = window.rightClickDash; if(!rc) return;
    rc.aim = false;
  }
  function commitDashAim(){
    const rc = window.rightClickDash; if(!rc || !rc.aim) return;
    const held = (performance.now() - rc.aimStart)/1000;
    rc.aim = false;
    if(held < rc.minHold) return;
    if(player.isDashing) return;
    if(rc.charges <= 0) return;
    rc.charges--;
    if(rc.charges < rc.maxCharges && rc.rechargeTimer<=0) rc.rechargeTimer = rc.recharge;
    // Ziel berechnen
    let tx = mouseX, ty = mouseY;
    const dx = tx - player.x; const dy = ty - player.y; let dist = Math.hypot(dx,dy);
    if(dist < 4){ return; } // zu klein -> ignoriere Verbrauch
    if(dist > rc.maxDist){ const s = rc.maxDist / dist; tx = player.x + dx*s; ty = player.y + dy*s; dist = rc.maxDist; }
    rc.targetX = tx; rc.targetY = ty;
    rc.startX = player.x; rc.startY = player.y;
    // Start Effekte
    for(let i=0;i<18;i++) particle(player.x + (Math.random()-0.5)*26, player.y + (Math.random()-0.5)*26, 'rgba(120,240,255,0.75)');
    player.isDashing = true;
    player.dashTime = 0;
    player.dashDur = rc.dashDuration;
    player.dashVX = (tx - rc.startX) / rc.dashDuration; // Basis-Vektor (wird per Easing moduliert)
    player.dashVY = (ty - rc.startY) / rc.dashDuration;
    player.iFrames = Math.max(player.iFrames||0, rc.iFrameDuring);
    rc.lastDash = performance.now();
    if(window.DEBUG_DASH){ console.log('[Dash] start', {from:{x:rc.startX,y:rc.startY}, to:{x:tx,y:ty}, dist:dist.toFixed(1), dur:rc.dashDuration}); }
  }
  window.addEventListener('mousedown', ev=>{ if(ev.button===2){ beginDashAim(); } });
  window.addEventListener('mouseup', ev=>{ if(ev.button===2){ commitDashAim(); } });
  window.addEventListener('contextmenu', ev=>{ if(window.rightClickDash?.aim){ ev.preventDefault(); commitDashAim(); } });
  // Recharge Tick erweitern um Aim-Abbruch wenn ESC
  window.addEventListener('keydown', ev=>{ if(ev.key==='Escape' && window.rightClickDash?.aim){ cancelDashAim(); } });
}

// Action Key Cooldowns (visual)
// Q = Speedbuff (CD 6s), E = Heilung (CD 6s)
window.actionKeyState = {
  q: { cd: 6, timer: 0 },
  e: { cd: 6, timer: 0 }
};

// Heilungs-Animations SpriteSheet laden (192x192 pro Frame)
const healAnim = {
  img: (()=>{ 
    const i=new Image(); 
    // Primärpfad mit URL-Encoding für Leerzeichen
    const p1 = 'img/Animation%20Fähigkeiten/Heilung/Recovery.png';
    // Alternativ: Unencoded (falls lokal via File-URL geladen wird und Browser automatisch mapped)
    const p2 = 'img/Animation Fähigkeiten/Heilung/Recovery.png';
    i.onload = ()=>{ healAnim._loaded = true; console.log('[HealAnim] geladen', i.src, i.naturalWidth+'x'+i.naturalHeight); };
    i.onerror = ()=>{
      if(!healAnim._triedAlt){
        healAnim._triedAlt = true;
        console.warn('[HealAnim] Primärpfad fehlgeschlagen, versuche alternativen Pfad');
        i.src = p2;
      } else {
        console.error('[HealAnim] Beide Pfade fehlgeschlagen');
      }
    };
    i.src = p1;
    return i; })(),
  w:192, h:192, frames: 30, fps: 24, cols:5, rows:6
};
let healAnimState = { playing:false, t:0 };

// ---------------------------------
// Poison Status Animation (grüne Aura)
// SpriteSheet: img/State/StatePoison.png
// Annahmen:
//  - Quadratische Frames
//  - Alle Frames in einer Zeile ODER in mehreren Zeilen mit gleicher Framebreite
//  - Wird geloopt solange Entity vergiftet ist (e.daggerDot aktiv)
// ---------------------------------
const poisonStateAnim = {
  img: (() => {
    const im = new Image();
    const p = 'img/State/StatePoison.png';
    im.onload = () => {
      const w = im.naturalWidth, h = im.naturalHeight;
      // Feste Struktur laut Vorgabe: 5 Spalten x 3 Reihen, 192x192 pro Frame -> 15 Frames
      poisonStateAnim.loaded = true;
      poisonStateAnim.fw = 192;
      poisonStateAnim.fh = 192;
      poisonStateAnim.cols = 5;
      poisonStateAnim.rows = 3;
      poisonStateAnim.frames = 15;
      // Optional: Validierung / Warnung falls Sheetgröße nicht passt
      if(w !== poisonStateAnim.fw * poisonStateAnim.cols || h !== poisonStateAnim.fh * poisonStateAnim.rows){
        console.warn('[PoisonAnim] Erwartete Größe', (poisonStateAnim.fw * poisonStateAnim.cols)+'x'+(poisonStateAnim.fh * poisonStateAnim.rows),'aber erhalten', w+'x'+h);
      }
      console.log('[PoisonAnim] geladen', w+'x'+h, 'frames=15 (5x3)');
    };
    im.onerror = () => console.warn('[PoisonAnim] Laden fehlgeschlagen:', p);
    im.src = p;
    return im;
  })(),
  fw:192,
  fh:192,
  frames:15,
  fps:14, // leicht flotter für Status
  cols:5,
  rows:3,
  loaded:false
};
let poisonAnimTime = 0; // globaler Zeit-Akkumulator für Loop

// Prüft ob eine Entity vergiftet ist (nutzt aktuelles daggerDot System)
function isEntityPoisoned(e){
  if(!e) return false;
  // Neues Stack-basiertes System
  if(e.daggerDot){
    if(Array.isArray(e.daggerDot.stacks) && e.daggerDot.stacks.length>0) return true;
    if(e.daggerDot.active && typeof e.daggerDot.t==='number' && typeof e.daggerDot.dur==='number' && e.daggerDot.t < e.daggerDot.dur) return true;
  }
  return false;
}

function updatePoisonAnim(dt){
  poisonAnimTime += dt;
}

// Helper zum Aktualisieren der Heilungsanimation (wird pro Frame in draw() aufgerufen)
function updateHealAnim(dt){
  if(!healAnimState.playing) return;
  healAnimState.t += dt;
  const frameDur = 1 / healAnim.fps;
  const total = healAnim.frames * frameDur;
  if(healAnimState.t >= total){ healAnimState.playing = false; }
}

function triggerActionKeyCD(key){
  const st = window.actionKeyState[key];
  if(!st) return false;
  if(st.timer>0) return false;
  st.timer = st.cd;
  return true;
}

// Heilung bleibt auf E
window.triggerAbilityE = function(){
  if(!triggerActionKeyCD('e')) return;
  player.hp = Math.min(player.maxHp, player.hp + Math.round(player.maxHp*0.05));
  for(let i=0;i<14;i++) particle(player.x + (Math.random()-0.5)*36, player.y + (Math.random()-0.5)*36, '#58ff9d');
  if(typeof updateHUD==='function') updateHUD();
  // Animation triggern
  healAnimState.playing = true; healAnimState.t = 0;
  window.__lastHealTriggerTime = performance.now();
  console.log('[HealAbility] triggered',{hp:player.hp, max:player.maxHp});
};

// (Ehemaliger Sword-Spin Code entfernt – ersetzt durch passive Mondklinge. Falls später eine neue aktive Schwertfähigkeit
// benötigt wird, kann dieser Abschnitt als Platzhalter genutzt werden.)

// --- Dynamische Gegner-Skalierung & Logging Config (global) ---
if(!window.enemyScalingConfig){
  window.enemyScalingConfig = {
    baseHpLevelFactor: 32,
    baseHpTimeFactor: 1.4,
    eliteHpMul: 2.8,
    normalHpMul: 1.15,
    dmgLevelFactor: 0.70,
    dmgTimeFactor: 0.18,
    enableDmgProgression: true,
    dmgProgressionPerMinute: 0.08,
    hpProgressionPerMinute: 0.18,
    minDamageAfterAll: 1,
    partialBoss: 0.25,
    partialNormal: 0.45,
    logSpawns: true,
    logDamage: true,
    logPartial: true
  };
}
window.__enemyScaleLastMinuteCheck = window.__enemyScaleLastMinuteCheck || 0;

function trySwordSpin(){
  const spin = window.swordSpin;
  const wArr = window.weapons;
  if(!wArr || !Array.isArray(wArr) || !player || player.weaponIndex==null) return;
  const w = wArr[player.weaponIndex];
  if(!w) return;
  // Nur ausführen wenn aktuelle Waffe Schwert UND Charakter Fred ist (case-insensitive)
  if(((w.id||'')+"").toLowerCase() !== 'sword'){ 
    if(typeof showMeteorToast==='function') showMeteorToast('Wirbel braucht Schwert');
    return; 
  }
  let ch = (window.selectedCharacter||'').toLowerCase();
  if(!ch && typeof character === 'string') ch = character.toLowerCase();
  if(ch !== 'fred'){ if(typeof showMeteorToast==='function') showMeteorToast('Wirbel nur mit Fred + Schwert'); return; }
  // Hinweis: spinSlashSprite Loader lädt ausschließlich Freds oversize Sheet.
  if(!window._spinSlashSprite.ready){ window.loadSpinSprite && window.loadSpinSprite(); }
  if(spin.active){ return; }
  if(spin.timer>0){ return; }
  // Falls Charakter inzwischen gewechselt hat und Sprite noch nicht korrekt ist -> neu versuchen
  if(window._spinSlashSprite && !window._spinSlashSprite.ready){ window.loadSpinSprite && window.loadSpinSprite(); }
  // Start
  spin.active = true;
  spin.t = 0;
  spin.tickTimer = 0;
  spin.angle = 0;
  spin.visTimer = 0; // Timer für optische Slash-Erzeugung
  spin.timer = spin.cd; // set CD sofort
  player.iFrames = Math.max(player.iFrames||0, 0.25);
  // Optische Startpartikel
  for(let i=0;i<28;i++){
    const a = Math.random()*Math.PI*2;
    const r = 18 + Math.random()* w.range * 0.6;
    particle(player.x + Math.cos(a)*r, player.y + Math.sin(a)*r, 'rgba(255,240,150,0.85)');
  }
  // Kurzer Glow für HUD Feedback
  player.speedGlowTimer = Math.max(player.speedGlowTimer||0, 0.25);
  window.__lastSpinStart = performance.now();
  // Kurz sichtbarer Text via particle hack
  particle(player.x, player.y-30, 'rgba(255,255,255,0.95)');
  // Opening Shockwave vorbereiten (nur im clean Stil)
  if(spin.config && spin.config.style==='clean'){
    const cfg = spin.config;
    const wObj = weapons[player.weaponIndex];
    const baseRangeRaw = wObj.range * (cfg.sizeMul||1.25);
    const baseRange = Math.min(cfg.maxBase||300, baseRangeRaw) * (buffs.range||1);
    spin.fx.shock = { age:0, life:cfg.shockwaveLife||0.2, baseR: baseRange*0.55, maxR: baseRange * (cfg.shockwaveMaxR||1.15) };
    spin.fx.trails.length = 0;
  }
}

// (Aufräumung) Alte Queue-Mechanik für frühen Tastendruck entfernt.

// Global alias sicherstellen
window.trySwordSpin = window.trySwordSpin || trySwordSpin;

// Debug-Hilfsfunktion: Spin erzwingen (ignoriert Charakter/Waffe/CD) für Tests
window.forceSpin = function(){
  if(!window.swordSpin){ console.warn('forceSpin: swordSpin Objekt fehlt'); return; }
  const spin = window.swordSpin;
  spin.active = true; spin.t = 0; spin.tickTimer = 0; spin.timer = 0; spin.animT = 0; spin.visTimer = 0;
  console.log('[forceSpin] Spin forciert');
};

function updateSwordSpin(dt){
  const spin = window.swordSpin; if(!spin) return;
  if(spin.timer>0){ spin.timer -= dt; if(spin.timer<0) spin.timer=0; }
  if(!spin.active) return;
  spin.t += dt;
  spin.animT = (spin.animT||0) + dt;
  spin.tickTimer += dt;
  spin.visTimer += dt;
  // (Auto-Schub entfernt) Spin verschiebt den Spieler nicht mehr selbstständig.
  // Spieler bewegt sich nur noch durch normales Movement / Eingaben.
  // Drehwinkel erhöhen (nur visuell verwendbar falls Rendering darauf reagiert)
  // Dynamischer Rotationsspeed mit sanftem Ramp-In / Ramp-Out
  const cfg = spin.config || {};
  const pct = spin.t / spin.dur;
  const ri = Math.max(0.01, cfg.rampIn||0.15);
  const ro = Math.max(0.01, cfg.rampOut||0.2);
  let speedMul = 1;
  if(pct < ri){ // Beschleunigen
    const x = pct/ri; speedMul = 0.35 + 0.65 * (x*x); // easeIn
  } else if(pct > 1-ro){ // Abbremsen
    const x = (pct-(1-ro))/ro; speedMul = 1 - (x*x*0.65); // easeOut
  }
  const baseSpinSpeed = (cfg.spinSpeed||4.4);
  spin.angle += dt * Math.PI * 2 * baseSpinSpeed * speedMul;
  // Tick Schaden
  while(spin.tickTimer >= spin.tickInt){
    spin.tickTimer -= spin.tickInt;
    doSwordSpinDamage();
  }
  if(spin.t >= spin.dur){
    spin.active = false;
  }
  // FX Updates (clean Stil)
  if(spin.active && spin.config){
    // Shockwave
    if(spin.fx.shock){
      spin.fx.shock.age += dt;
      if(spin.fx.shock.age >= spin.fx.shock.life) spin.fx.shock = null;
    }
    // Trails (verblassende Winkelpositionen)
    const trails = spin.fx.trails;
    // Füge alle ~1 Frame eine Trail-Position hinzu
    trails.push({ang: spin.angle, life:0, max:0.25});
    for(let i=trails.length-1;i>=0;i--){
      const tr = trails[i]; tr.life += dt; if(tr.life>=tr.max) trails.splice(i,1);
    }
    // Sparks
    const rate = (spin.config.sparkRate||0)*dt;
    for(let i=0;i<rate;i++) if(Math.random()<rate){
      const ang = Math.random()*Math.PI*2;
      spin.fx.sparks.push({x:player.x, y:player.y, vx:Math.cos(ang)*(80+Math.random()*120), vy:Math.sin(ang)*(80+Math.random()*120), t:0, life:spin.config.sparkLife||0.35});
    }
    for(let i=spin.fx.sparks.length-1;i>=0;i--){
      const s = spin.fx.sparks[i]; s.t+=dt; s.x+=s.vx*dt; s.y+=s.vy*dt; s.vx*= (1-2*dt); s.vy*= (1-2*dt);
      if(s.t>=s.life) spin.fx.sparks.splice(i,1);
    }
    // Kamera Shake leicht
    if(cfg.camShake){
      const mag = (cfg.camShake||0)* (0.4 + 0.6*Math.sin(spin.t*32));
      spin.cam.sx = (Math.random()-0.5)*mag;
      spin.cam.sy = (Math.random()-0.5)*mag;
    }
  }
}

function doSwordSpinDamage(){
  const w = weapons[player.weaponIndex];
  if(!w || ((w.id||'')+"").toLowerCase() !== 'sword') return;
  const spin = window.swordSpin; if(!spin || !spin.active) return;
  // Begrenze Radius klar (nicht zu groß). Falls w.range unrealistisch hoch ist, clampen.
  const cfg = spin.config || { sizeMul:1.25, maxBase:300 };
  const baseRangeRaw = w.range * (cfg.sizeMul||1.25);
  const baseRange = Math.min(cfg.maxBase||300, baseRangeRaw);
  const radius = baseRange * 0.9 * (buffs.range||1);
  const rSq = (radius+26)*(radius+26); // kleiner Puffer; nutze squared Distance für Performance
  const baseDmg = player.dmg * w.dmgMul * 0.45 * (buffs.dmg||1); // etwas weiter reduziert damit nicht map-wide wirkt
  let hits=0;
  // Tracke bereits getroffene IDs diesen Tick (falls Gegner-Referenzen dupliziert werden)
  spin._hitTickId = (spin._hitTickId||0)+1;
  const markId = spin._hitTickId;
  for(let i=state.enemies.length-1;i>=0;i--){
    const e = state.enemies[i];
    if(!e || e.hp<=0) continue;
    // Schnelle Eliminierung: bounding square first
    const dx = e.x - player.x; const dy = e.y - player.y;
    const dsq = dx*dx + dy*dy;
    if(dsq > rSq) continue;
    const er = (e.r||12);
    // Exakter Kreischeck
    if(Math.hypot(dx,dy) < radius + er){
      if(e._lastSpinHit === markId) continue; // schon getroffen in diesem Tick
      e._lastSpinHit = markId;
      let final = baseDmg;
      if(e.boss) final *= (player.bossDamageMul||1);
      if(e.boss && e.dmgReduction) final *= (1 - e.dmgReduction);
      if(e.name === 'Kristof' && e.playerDamageReduction) final *= (1 - e.playerDamageReduction);
  e.hp -= final;
  if(typeof window.addDamageFloater==='function'){ window.addDamageFloater({x:e.x, y:e.y-(e.r||24), amount:final, type:'basic'}); }
      hits++;
      if(Math.random()<0.45) particle(e.x + (Math.random()-0.5)*er, e.y + (Math.random()-0.5)*er, 'rgba(255,210,110,0.75)');
      if(e.hp<=0){ if(e.boss) handleBossPhaseAfterDamage(e, i); else killEnemy(i, e); }
    }
  }
  // Deutlich sichtbarerer Kreis (weniger Random-Glitzer -> klarer Bereich)
  // Entfernt alte graue Kreis-Partikel; optional: kleine Funken nur bei Treffern
  if(hits>0){
    for(let s=0;s<Math.min(6,hits);s++){
      const ang = Math.random()*Math.PI*2;
      const rr = (radius*0.4) + Math.random()*radius*0.55;
      particle(player.x + Math.cos(ang)*rr, player.y + Math.sin(ang)*rr, 'rgba(255,230,150,0.55)');
    }
  }
}

// Rendering Hook für Spin (erweiterte visuelle Effekte)
const _oldRenderPlayer = window.renderPlayer;
window.renderPlayer = function(ctx){
  const sp = window.swordSpin;
  // Basisfigur nur zeichnen wenn entweder kein Spin aktiv ist oder Charakter nicht versteckt werden soll
  const hide = sp && sp.active && sp.config && sp.config.hideCharacterDuringSpin;
  if(!hide){
    try {
      const chSel = (window.selectedCharacter||'').toLowerCase();
      if(chSel !== 'bully'){
        if(_oldRenderPlayer) _oldRenderPlayer(ctx);
      }
    } catch(err){ if(_oldRenderPlayer) _oldRenderPlayer(ctx); }
  }
  // Alte integrierte Spin-Visuals entfernt -> komplette Darstellung erfolgt jetzt in drawSpinOverlay()
};

// Separates Overlay pass to ensure visibility even if base renderPlayer path not used elsewhere
function drawSpinOverlay(ctx){
  const spin = window.swordSpin; if(!spin || !spin.active) return;
  const w = weapons[player.weaponIndex]; if(!w || ((w.id||'')+"").toLowerCase()!=='sword') return;
  let ch = (window.selectedCharacter||'').toLowerCase();
  if(!ch && typeof character === 'string') ch = character.toLowerCase();
  if(ch !== 'fred') return; // Fallback-kompatibel
  const sprite = window._spinSlashSprite;
  const cfg = spin.config || {}; const style = cfg.style || 'clean';
  const baseRangeRaw = w.range * (cfg.sizeMul||1.25);
  const baseRange = Math.min(cfg.maxBase||300, baseRangeRaw) * (buffs.range||1);
  const pct = spin.t / spin.dur;
  // Kamera Shake Offset anwenden (nur für Overlays) -> spätere Zentralisierung möglich
  if(spin.cam){ ctx.save(); ctx.translate(spin.cam.sx||0, spin.cam.sy||0); }
  // LEGACY (alter Effekt)
  if(style === 'legacy'){
    const radius = baseRange * 0.78;
    const count = 5;
    const angBase = spin.t * Math.PI * 2 * 3.6;
    ctx.save(); ctx.translate(player.x, player.y); ctx.globalCompositeOperation='lighter';
    const ringPulse = 0.4 + Math.sin(performance.now()*0.008 + spin.t*6)*0.25;
    const ringR = (w.range||120)*0.9;
    const g = ctx.createRadialGradient(0,0, ringR*0.3, 0,0, ringR*1.15);
    g.addColorStop(0,'rgba(255,240,180,0.35)'); g.addColorStop(0.55,'rgba(255,200,90,0.18)'); g.addColorStop(1,'rgba(255,160,40,0.0)');
    ctx.globalAlpha = 0.65 * (1-pct*0.6); ctx.fillStyle=g; ctx.beginPath(); ctx.arc(0,0, ringR*1.15,0,Math.PI*2); ctx.fill();
    ctx.globalAlpha = 0.9 * (1-pct*0.6); ctx.lineWidth = 5 + ringPulse*3; ctx.strokeStyle='rgba(255,220,120,0.85)';
    ctx.beginPath(); ctx.arc(0,0, ringR,0,Math.PI*2); ctx.stroke();
    ctx.save(); const arcAng = angBase * 0.6; const sweep = Math.PI * 0.65; ctx.rotate(arcAng);
    ctx.globalAlpha = 0.55 * (1-pct*0.7); ctx.beginPath(); ctx.arc(0,0, ringR+18,-sweep/2,sweep/2); ctx.arc(0,0, ringR-18, sweep/2,-sweep/2,true);
    ctx.fillStyle='rgba(255,210,120,0.55)'; ctx.fill(); ctx.globalAlpha=0.9*(1-pct*0.7); ctx.lineWidth=3.5; ctx.strokeStyle='rgba(255,255,255,0.85)';
    ctx.beginPath(); ctx.arc(0,0, ringR+18,-sweep/2,sweep/2); ctx.stroke(); ctx.beginPath(); ctx.arc(0,0, ringR-18,-sweep/2,sweep/2); ctx.stroke(); ctx.restore();
    for(let i=0;i<count;i++){
      const rel=i/count; const ang=angBase + rel*Math.PI*2; const xOff=Math.cos(ang)*radius; const yOff=Math.sin(ang)*radius; ctx.save(); ctx.translate(xOff,yOff); ctx.rotate(ang+Math.PI*0.5);
      let frameRaw=0; if(sprite&&sprite.ready&&sprite.frames>1){ const burst=0.30; const tNorm=spin.t/spin.dur; if(tNorm<burst){ const local=tNorm/burst; frameRaw=Math.min(sprite.frames-1,Math.floor(local*sprite.frames)); } else frameRaw=sprite.frames-1; }
      const scale=0.60*(0.95+Math.sin(spin.t*12+i)*0.05); const alpha=0.80*(1-pct*0.85);
      if(sprite&&sprite.ready){ const fw=sprite.fw, fh=sprite.fh; ctx.globalAlpha=alpha; ctx.drawImage(sprite.img, frameRaw*fw,0,fw,fh, -fw*scale/2,-fh*scale/2, fw*scale, fh*scale); }
      else { ctx.globalAlpha=alpha; const len=110*scale; const halfW=26*scale; ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(len,halfW); ctx.lineTo(len,-halfW); ctx.closePath(); ctx.fillStyle='rgba(250,250,255,0.9)'; ctx.fill(); }
      ctx.restore();
    }
    ctx.restore();
    // leichter Vollbild Flash
    ctx.save(); ctx.globalAlpha=0.06*(1-pct); ctx.fillStyle='#ffe9c0'; ctx.fillRect(0,0,innerWidth,innerHeight); ctx.restore();
    return;
  }
  // CLEAN Stil (hollow arcs Variante)
  const sweepCount = cfg.slashCount || 4;
  // Konsistenter Winkel aus updateSwordSpin (nutzt spin.angle)
  const angBase = spin.angle;
  const scaleVis = cfg.visualScale || 1;
  const coreR = ((player.r||28) + 14) * scaleVis;
  const ringR = baseRange * 0.92 * scaleVis;
  const sweepArcW = (cfg.arcWidth||60) * scaleVis;
  const hollow = !!cfg.hollow;
  const innerCut = Math.max(0.2, Math.min(0.9, cfg.innerCut==null?0.55:cfg.innerCut));
  ctx.save(); ctx.translate(player.x, player.y); ctx.globalCompositeOperation='lighter';
  // Öffnungs-Schockwelle
  if(spin.fx.shock){
    const sh = spin.fx.shock; const sPct = Math.min(1, sh.age / sh.life);
    const rr = sh.baseR + (sh.maxR - sh.baseR) * (0.15 + 0.85*sPct);
    const alpha = 0.85 * (1 - sPct);
    ctx.save(); ctx.globalAlpha = alpha;
    ctx.lineWidth = (cfg.shockwaveLineW||8) * (1 - sPct*0.35);
    ctx.strokeStyle = cfg.colorRing || '#ffb347';
    ctx.beginPath(); ctx.arc(0,0, rr, 0, Math.PI*2); ctx.stroke();
    ctx.globalAlpha *= 0.55; ctx.lineWidth *= 0.55; ctx.strokeStyle = '#fff';
    ctx.beginPath(); ctx.arc(0,0, rr*0.82, 0, Math.PI*2); ctx.stroke();
    ctx.restore();
  }
  // Kern Glow (bei hollow etwas dezenter & kleiner, Mitte bleibt transparent)
  if(!hollow){
    const corePulse = 0.25 + Math.sin(spin.t*14)*0.25;
    const grd = ctx.createRadialGradient(0,0, coreR*0.25, 0,0, coreR*1.65);
    grd.addColorStop(0, (cfg.colorCore||'#d0d0d0')+'cc');
    grd.addColorStop(0.5,(cfg.colorCore||'#d0d0d0')+'33');
    grd.addColorStop(1,'rgba(255,255,255,0)');
    ctx.globalAlpha = 0.70 * (1 - pct*0.55);
    ctx.fillStyle = grd; ctx.beginPath(); ctx.arc(0,0, coreR* (1.15 + corePulse*0.35), 0, Math.PI*2); ctx.fill();
  } else {
    // Kleiner ringförmiger Glow nur am Rand des inneren Cut
    const innerR = coreR * innerCut;
    ctx.save();
    ctx.globalAlpha = 0.38 * (1-pct*0.7);
    const g2 = ctx.createRadialGradient(0,0, innerR*0.92, 0,0, innerR*1.25);
    g2.addColorStop(0,'rgba(255,255,255,0)');
    g2.addColorStop(0.55,(cfg.colorCore||'#d0d0d0')+'55');
    g2.addColorStop(1,'rgba(255,255,255,0)');
    ctx.fillStyle = g2;
    ctx.beginPath(); ctx.arc(0,0, innerR*1.3, 0, Math.PI*2); ctx.fill();
    ctx.restore();
  }
  if(cfg.bladeMode){
    const bladeLen = ringR * 0.95;
    const bladeWide = Math.min(32*scaleVis, bladeLen*0.22);
    const bladeInner = coreR * innerCut * 0.85;
    const baseAng = angBase;
    // Afterimages
    const afterN = Math.max(0, cfg.bladeAfterImages|0);
    for(let a=afterN; a>=0; a--){
      const frac = a/(afterN+1);
      const ang = baseAng - frac * 0.55;
      const fade = (1-frac) * (1 - pct*0.65);
      ctx.save();
      ctx.rotate(ang);
      // Blade Form (leicht gekrümmt)
      ctx.beginPath();
      ctx.moveTo(bladeInner, -bladeWide*0.15);
      ctx.lineTo(bladeLen*0.78, -bladeWide*0.42);
      ctx.lineTo(bladeLen, 0);
      ctx.lineTo(bladeLen*0.78, bladeWide*0.42);
      ctx.lineTo(bladeInner, bladeWide*0.15);
      ctx.closePath();
      ctx.globalAlpha = 0.55 * fade;
      ctx.fillStyle = (cfg.colorMain||'#c8c8c8');
      ctx.fill();
      // Kanten
      ctx.globalAlpha = 0.85 * fade;
      ctx.lineWidth = 2.2;
      ctx.strokeStyle = (cfg.colorAccent||'#f5f5f5');
      ctx.stroke();
      // Mittelglanz
      ctx.globalAlpha = 0.30 * fade;
      ctx.lineWidth = 1.2;
      ctx.strokeStyle = 'rgba(255,255,255,0.55)';
      ctx.beginPath();
      ctx.moveTo(bladeInner+6, -bladeWide*0.18);
      ctx.quadraticCurveTo(bladeLen*0.55, -bladeWide*0.48, bladeLen*0.92, -bladeWide*0.05);
      ctx.stroke();
      ctx.restore();
    }
    // kleiner Pivot-Ring
    ctx.save();
    ctx.globalAlpha = 0.35 * (1-pct*0.8);
    ctx.fillStyle = (cfg.colorCore||'#d0d0d0');
    ctx.beginPath(); ctx.arc(0,0, coreR*innerCut*0.9, 0, Math.PI*2); ctx.fill();
    ctx.globalAlpha *= 0.55;
    ctx.strokeStyle = (cfg.colorAccent||'#f5f5f5'); ctx.lineWidth=2;
    ctx.beginPath(); ctx.arc(0,0, coreR*innerCut*0.9, 0, Math.PI*2); ctx.stroke();
    ctx.restore();
  } else {
    // Haupt-Sweeps vorherige Logik (hollow Bögen oder Keile)
    for(let i=0;i<sweepCount;i++){
      const rel = i / sweepCount;
      const ang = angBase + rel * Math.PI*2;
      const fade = 1 - pct*0.78;
      const localPulse = 0.9 + Math.sin(spin.t*16 + i)*0.07;
      const innerR = hollow ? coreR * innerCut : coreR * 0.55;
      const outerR = ringR * 0.97;
      const halfArc = 0.22;
      ctx.save(); ctx.rotate(ang); ctx.beginPath();
      if(hollow){
        ctx.arc(0,0, outerR, -halfArc, halfArc);
        ctx.arc(0,0, innerR, halfArc, -halfArc, true);
        ctx.closePath(); ctx.globalAlpha = 0.42 * fade; ctx.fillStyle = (cfg.colorMain||'#c8c8c8'); ctx.fill();
        ctx.globalAlpha = 0.85 * fade; ctx.lineWidth = 2.2 * (0.9 + localPulse*0.15); ctx.strokeStyle = (cfg.colorAccent||'#f5f5f5');
        ctx.beginPath(); ctx.arc(0,0, outerR, -halfArc, halfArc); ctx.stroke();
        ctx.globalAlpha = 0.55 * fade; ctx.strokeStyle='rgba(255,255,255,0.35)'; ctx.beginPath(); ctx.arc(0,0, innerR, -halfArc, halfArc); ctx.stroke();
      } else {
        ctx.moveTo(innerR, -sweepArcW*0.15);
        ctx.lineTo(outerR, -sweepArcW*localPulse*0.55);
        ctx.lineTo(outerR*0.985, 0);
        ctx.lineTo(outerR, sweepArcW*localPulse*0.55);
        ctx.lineTo(innerR, sweepArcW*0.15);
        ctx.closePath(); ctx.globalAlpha = 0.48 * fade; ctx.fillStyle=(cfg.colorMain||'#c8c8c8'); ctx.fill();
        ctx.globalAlpha = 0.8 * fade; ctx.lineWidth=2.2; ctx.strokeStyle=(cfg.colorAccent||'#f5f5f5'); ctx.stroke();
      }
      ctx.restore();
    }
  }
  // Trails (aus gespeicherten Winkeln)
  if(spin.fx && spin.fx.trails && cfg.trailLines){
    for(const tr of spin.fx.trails){
      const tt = tr.life / tr.max; const alpha = (0.30 * (1-tt)) * (1 - pct*0.75);
      if(alpha <= 0) continue;
      const ang = tr.ang;
      ctx.save(); ctx.rotate(ang);
      ctx.globalAlpha = alpha * (cfg.fadeTail||0.55);
      ctx.strokeStyle = (cfg.colorAccent||'#f5f5f5');
      ctx.lineWidth = 3.2 * (1-tt);
      ctx.beginPath(); ctx.moveTo(coreR*innerCut*1.05,0); ctx.lineTo(ringR*0.88,0); ctx.stroke();
      ctx.restore();
    }
  }
  // Außenring dezent
  ctx.globalAlpha = 0.22 * (1-pct);
  ctx.lineWidth = 2.6;
  ctx.strokeStyle = (cfg.colorMain||'#c8c8c8');
  ctx.beginPath(); ctx.arc(0,0, ringR, 0, Math.PI*2); ctx.stroke();
  ctx.restore();
  // (Entfernt) ehemals cfg.debug Label
  // Stark sichtbarer Debug-Kreis falls nichts anderes auffällt
  // Leichter globaler Flash
  ctx.save(); ctx.globalAlpha = 0.04 * (1-pct); ctx.fillStyle = (cfg.colorCore||'#ffecc0'); ctx.fillRect(0,0,innerWidth,innerHeight); ctx.restore();
  // Sparks zeichnen (oberhalb aber vor globalem Flash sinnvoll)
  if(spin.fx && spin.fx.sparks && spin.fx.sparks.length){
    for(const s of spin.fx.sparks){
      const lt = s.t / s.life; const fade = 1 - lt;
      ctx.save();
      ctx.globalAlpha = 0.55 * fade;
      ctx.fillStyle = cfg.sparkColor || '#ffe2a8';
      ctx.beginPath(); ctx.arc(s.x, s.y, 4 + 10*(1-fade)*fade, 0, Math.PI*2); ctx.fill();
      ctx.globalAlpha = 0.35 * fade; ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(s.x, s.y, 2 + 6*(1-fade), 0, Math.PI*2); ctx.fill();
      ctx.restore();
    }
  }
  if(spin.cam){ ctx.restore(); }
}

// (Aufräumung) Entfernte debugSpinDraw Funktion

// (Entfernt) Separater R-Listener für Spin – jetzt vereinheitlicht im globalen R-Dispatcher weiter oben.

// (Alter Speedbuff-E-Spell entfernt; Dash-Implementierung weiter oben aktiv)

function updateActionKeyUI(dt){
  const qFill = document.getElementById('actionQCd');
  const eFill = document.getElementById('actionECd');
  const qDesc = document.getElementById('actionQDesc');
  if(!window.actionKeyState) return;
  // Q Speedbuff normaler CD
  const q = window.actionKeyState.q; if(q){
    const prev = q.timer;
    if(q.timer>0){ q.timer -= dt; if(q.timer<0) q.timer=0; if(qFill){ qFill.style.width = ((q.cd - q.timer)/q.cd*100).toFixed(1)+'%'; qFill.style.opacity='1'; } }
    if(q.timer===0 && prev>0 && qFill){ qFill.parentElement.animate([{filter:'brightness(1)'},{filter:'brightness(1.6)'},{filter:'brightness(1)'}],{duration:650}); }
    if(q.timer===0 && qFill){ qFill.style.width='100%'; qFill.style.opacity='0.95'; }
    if(qDesc){ if(!qDesc.textContent.toLowerCase().includes('tempo')) qDesc.textContent = 'Tempo +40% (3s)'; }
  }
  // Rechtsklick-Dash recharge separat
  const rc = window.rightClickDash; if(rc){
    if(rc.charges < rc.maxCharges){
      rc.rechargeTimer -= dt; if(rc.rechargeTimer <= 0){ rc.charges++; if(rc.charges < rc.maxCharges) rc.rechargeTimer = rc.recharge; else rc.rechargeTimer = 0; }
    }
    // Optional: HUD Tooltip an Q-Icon anhängen damit Spieler Info hat
    const qIcon = document.getElementById('actionQIcon');
    if(qIcon){ qIcon.title = `Rechtsklick Dash: ${rc.charges}/${rc.maxCharges}`; }
    const rcCd = document.getElementById('rcDashCd');
    const rcDesc = document.getElementById('rcDashDesc');
    if(rcCd){
      if(rc.charges >= rc.maxCharges){
        rcCd.style.width = '100%';
        rcCd.style.opacity = '0.95';
      } else {
        const prog = 1 - (rc.rechargeTimer / rc.recharge);
        rcCd.style.width = (prog*100).toFixed(1)+'%';
        rcCd.style.opacity = '1';
      }
    }
    if(rcDesc){
      let full = '●'.repeat(rc.charges);
      let empty = '○'.repeat(rc.maxCharges - rc.charges);
      rcDesc.textContent = `Charges ${full}${empty}`;
    }
  }
  // E Heilung
  const e = window.actionKeyState.e; if(e){
    const prev = e.timer;
    if(e.timer>0){ e.timer -= dt; if(e.timer<0) e.timer=0; if(eFill){ eFill.style.width = ((e.cd - e.timer)/e.cd*100).toFixed(1)+'%'; eFill.style.opacity='1'; } }
    if(e.timer===0 && prev>0 && eFill){ eFill.parentElement.animate([{filter:'brightness(1)'},{filter:'brightness(1.6)'},{filter:'brightness(1)'}],{duration:650}); }
    if(e.timer===0 && eFill){ eFill.style.width='100%'; eFill.style.opacity='0.95'; }
  }
  // R (Dagger Exekution) Cooldown ticken
  if(window.daggerExecute && window.daggerExecute.timer>0){
    window.daggerExecute.timer -= dt;
    if(window.daggerExecute.timer < 0) window.daggerExecute.timer = 0;
  }
  // Verfall temporärer Speedbuffs
  // Wende aktiven Speedbuff auf player.speed an (Basis * buffs.speed * temporär)
  if(player){
    // Stelle sicher, dass Basisgeschwindigkeit existiert und NICHT aus bereits gebuffter player.speed stammt
    if(typeof player.speedBase0 !== 'number') player.speedBase0 = 200;
    if(typeof player.speedBase !== 'number') player.speedBase = player.speedBase0;
    const base = player.speedBase; // unveränderte Basis
    let mul = (buffs.speed||1);
    // Temporärer Speedbuff von Q (Tempo +40% für 3s)
    // Q Speed temporärer Buff entfällt
    player.speed = base * mul;
    if(player.speed > 750) player.speed = 750; // Hard Cap
  }
}

    addEventListener('keyup', e=>keys.delete(e.key.toLowerCase()));
    
    

  const buffs = { range:1, dmg:1, speed:1, cooldown:1, lifesteal:0.003 };
  window.buffs = buffs;
  const BUFF_MAX = 1.5;
  function clampBuffs(){
    buffs.range = Math.min(BUFF_MAX, buffs.range);
    buffs.dmg = Math.min(BUFF_MAX, buffs.dmg);
    // Einheitliches Speed-Cap (Buff-Faktor) für alle
    buffs.speed = Math.min(BUFF_MAX, Math.max(0.5, buffs.speed));
    buffs.cooldown = Math.max(0.5, buffs.cooldown);
    buffs.lifesteal = Math.min(0.03, Math.max(0, buffs.lifesteal));
  }

    const enemyScale = { hp:1, dmg:1, spd:1 };

    const weapons = [

  { id:'sword', name:'Schwert', type:'slash', color:'#c73be6', dmgMul:1.0, range:64, arc:2.1, cooldown:0.50, lvl:1, xp:0, next:90, evolveLevel:5, evolved:false, // cooldown erhöht (vorher 0.36)
    evolve(w){ w.evolved=true; w.name='Blutklinge'; w.dmgMul*=1.25; w.arc+=0.25; w.range+=14; w.cooldown*=0.9; },
    onLevel(w){ w.dmgMul*=1.08; w.range+=4; w.cooldown*=0.98; },
    onUpgrade(w, milestone) {
      // Neue Meilensteine: 15 & 25
      if(milestone === 15) { w.arc += 0.3; w.dmgMul *= 1.18; }
      else if(milestone === 25) { w.cooldown *= 0.85; w.range += 20; w.dmgMul *= 1.10; }
    }
  },
  { id:'dagger', name:'Dolch', type:'slash', color:'#f7c948', dmgMul:0.7, range:44, arc:2.4, cooldown:0.20, lvl:1, xp:0, next:80, evolveLevel:5, evolved:false,
    evolve(w){ w.evolved=true; w.name='Assassinenklinge'; w.cooldown*=0.72; w.multi=2; },
    onLevel(w){ w.dmgMul*=1.07; w.range+=3; },
    onUpgrade(w, milestone) {
      if(milestone === 15) { w.multi = (w.multi||2) + 1; w.cooldown *= 0.92; }
      else if(milestone === 25) { w.dmgMul *= 1.25; w.range += 10; }
    }
  },
  { id:'halbard', name:'Halbarde', type:'slash', color:'#3be67a', dmgMul:1.6, range:86, arc:2.2, cooldown:0.55, lvl:1, xp:0, next:110, evolveLevel:5, evolved:false,
    evolve(w){ w.evolved=true; w.name='Dämmerbrecher'; w.knock=300; w.dmgMul*=1.2; },
    onLevel(w){ w.dmgMul*=1.10; w.range+=6; w.cooldown*=0.97; },
    onUpgrade(w, milestone) {
      if(milestone === 15) { w.knock = (w.knock||300) + 100; w.dmgMul *= 1.15; }
      else if(milestone === 25) { w.range += 30; w.cooldown *= 0.90; }
    }
  },
  { id:'staff', name:'Stab', type:'projectile', color:'#ff7c1f', dmgMul:1.1, range:420, arc:1.8, cooldown:0.456, lvl:1, xp:0, next:90, evolveLevel:5, evolved:false,
    evolve(w){ w.evolved=true; w.name='Feuerstab'; w.dmgMul*=1.25; w.arc+=0.25; w.range+=30; w.cooldown*=0.9; },
    onLevel(w){ w.dmgMul*=1.08; w.range+=8; w.cooldown*=0.98; },
    onUpgrade(w, milestone) {
      if(milestone === 15) { w.arc += 0.4; w.dmgMul *= 1.15; }
      else if(milestone === 25) { w.cooldown *= 0.85; w.range += 40; }
    }
  },
  { id:'bolt', name:'', type:'projectile', color:'#ff3b6b', dmgMul:1.035, range:420, speed:640, cooldown:0.40, pierce:Infinity, lvl:1, xp:0, next:100, evolveLevel:5, evolved:false,
    evolve(w){ w.evolved=true; w.name=''; w.explode=100; },
    onLevel(w){ w.dmgMul*=1.06; w.speed+=30; w.range+=20; },
    onUpgrade(w, milestone) {
      if(milestone === 15) { w.explode = (w.explode||100) + 60; w.dmgMul *= 1.12; }
      else if(milestone === 25) { w.speed += 100; w.range += 60; }
    }
  }
];

// Export weapons global (falls vorher nicht gesetzt)
if(!window.weapons) window.weapons = weapons;


  const state = { running:true, dead:false, time:0, lastTime:performance.now(), spawnTimer:0, spawnInterval:1.4, enemies:[], particles:[], projectiles:[], slashes:[], enemyShots:[], _slashId:0, _sweepId:0, spawnMultiplier:1, fredBladeTimer:0, fredBladeRot:0, autoWeaponSpin:false, autoWeaponSpinTimer:0, bossAlive:false, metaStage: 1, aoes:[], sweeps:[], absorbing: [], kristofKillsLeft: 100, chests: [],
    // Kristof Spawn Gates: Mindest-Spielzeit & Mindest-Kills bevor Counter-Spawn erlaubt ist
    kristofMinTime: 60, // Sekunden (anpassbar)
    kristofMinKills: 25 // absolute Spieler-Kills (player.kills)
  };
  // Moon Slash Counter (nur für Sword Hits)
  window.moonSlashCounter = 0;
  // Globale Tuning-Parameter für Mondklinge (Crescent)
  window.MOONSLASH_TUNING = window.MOONSLASH_TUNING || {
    speed: 1050,
    range: 880,
    radius: 72,
    thickness: 12,
    arc: Math.PI * 0.95,
    trailLife: 0.40,
    trailMax: 18,
    colorInner: '#ffffff',
    colorOuter: '#6bd3ff',
    // Zusätzliche Klinge ab höherem Waffenlevel
    doubleWaveUnlockLvl: 15,
    doubleWaveOffsetDeg: 8, // kleiner Winkelversatz
    doubleWaveDmgMul: 0.7
  };

  function spawnMoonSlash(originX, originY, angleRad, weaponLevel){
    const CFG = window.MOONSLASH_TUNING || {};
    const speed = CFG.speed ?? 1050;
    const range = CFG.range ?? 880;
    // Damage Skalierung: Basis 1.2 * player.dmg * (1 + 0.015*(lvl-5) für lvl>=5)
    const scaleLvl = Math.max(0, (weaponLevel||0) - 5);
    const dmgMul = 1.2 * (1 + 0.015 * scaleLvl);
    const baseDmg = player.dmg || 10;
    const finalDmg = baseDmg * dmgMul;
    const vx = Math.cos(angleRad) * speed;
    const vy = Math.sin(angleRad) * speed;
    const primary = {
      type:'moonSlash', x:originX, y:originY, vx, vy, r:20, dmg: finalDmg, traveled:0, range, pierce: Infinity,
      life:0, maxLife: range / speed, angle: angleRad, trail:[],
      colorOuter: CFG.colorOuter || '#6bd3ff', colorInner: CFG.colorInner || '#ffffff',
      crescentRadius: CFG.radius ?? 72,
      crescentThickness: CFG.thickness ?? 12,
      crescentArc: CFG.arc ?? (Math.PI*0.95),
      trailLife: CFG.trailLife ?? 0.40,
      trailMax: CFG.trailMax ?? 18
    };
    state.projectiles.push(primary);
    // Optionale zweite Sichel bei hohem Waffenlevel
    if((weaponLevel||0) >= (CFG.doubleWaveUnlockLvl ?? 999)){
      const off = ((CFG.doubleWaveOffsetDeg ?? 8) * Math.PI) / 180;
      const a2 = angleRad + off;
      const vx2 = Math.cos(a2) * speed;
      const vy2 = Math.sin(a2) * speed;
      const secondary = {
        ...primary,
        x: originX, y: originY, vx: vx2, vy: vy2, angle: a2,
        dmg: finalDmg * (CFG.doubleWaveDmgMul ?? 0.7)
      };
      state.projectiles.push(secondary);
    }
    if(window.DEBUG_MOON) console.log('[MoonSlash] spawn', { finalDmg, weaponLevel, dmgMul, cfg: CFG });
  }
  state.shockwaves = [];
  window.state = state;



  
  let character = 'default'; 

  
  const defaultPlayer = { 
    x:innerWidth/2, y:innerHeight/2, r:10, speed:200, hp:100, maxHp:100, dmg:25 * 1.1, kills:0, level:1, xp:0, next:50, iFrames:0, weaponIndex:0, cooldown:0, bossDamageMul: 1,
    explosionDebuff: false, explosionDebuffTimer: 0,
  eliteKillBuff: false, eliteKillBuffTimer: 0,
  // ehemalige Speedbuff-Variablen entfernt
  };

  
  const bullyPlayer = {
  x:innerWidth/2, y:innerHeight/2, r:10, speed:200, hp:100, maxHp:100, dmg:25 * 1.1 * 3, kills:0, level:1, xp:0, next:50, iFrames:0, weaponIndex:0, cooldown:0, bossDamageMul: 1,
    explosionDebuff: false, explosionDebuffTimer: 0,
    eliteKillBuff: false, eliteKillBuffTimer: 0,
  // auraTimer entfernt
  permanentDamageDebuff: true,
  // ehemalige Speedbuff-Variablen entfernt
  };

  
  window.player = Object.assign({}, defaultPlayer);

    const unlockLevel = [1,1,1,1,1];
    const isUnlocked = i => player.level >= unlockLevel[i];

  
  const WEAPON_MAX_LEVEL = 30; // neuer Hard Cap für Waffen
  const XP_PER_LEVEL = 30;
  const WEAPON_XP_PER_LEVEL = 30; // Basis pro Level vor Multiplikator
  const WEAPON_XP_DIFFICULTY = 5; // 5x schwerer
  
  const WEAPON_XP_SCALE = 1.0; // Zurückgesetzt: normale Waffen-XP (vorher 5.0 = 500%)
  const MAX_META_STAGE = 50; 
  function getWeaponLevelCap(){ return 30; } // fester Cap
  function allWeaponsMaxed(){ return weapons.every(w => (w.fred ? false : w.lvl >= getWeaponLevelCap())); }

  
  function getPlayerLevelCap(){ return Infinity; }

  
    
    function transformBoltToKristof(){
  return; 
    }

    function clampAll(){ clampBuffs(); }

    function everythingMaxed(){ return buffs.range >= BUFF_MAX && buffs.dmg >= BUFF_MAX && buffs.speed >= BUFF_MAX && buffs.cooldown <= 0.5; }


  // (Alte doppelte restart-Version entfernt – vereinheitlicht unten)
  // ...existing code...
// Patch: Normale Nah-Gegner (type: 'runner', !elite) größer machen
const oldSpawnEnemy = window.spawnEnemy;
window.spawnEnemy = function(type, ...args) {
  const e = oldSpawnEnemy ? oldSpawnEnemy(type, ...args) : null;
  if(!e) return e;
  // DMG-Buff für alle Gegner
  if(typeof e.dmg === 'number') e.dmg = Math.round(e.dmg * 1.15); // z.B. 15% mehr Schaden
  // HP-Buff für Elite und Bosse
  if(e.elite || e.boss) {
    if(typeof e.hp === 'number') e.hp = Math.round(e.hp * 1.3);
    if(typeof e.maxHp === 'number') e.maxHp = Math.round(e.maxHp * 1.3);
  }
  if(e.type === 'runner' && !e.elite) e.r = 20;
  return e;
}
    
    // stepBullyAura entfernt

    function togglePause(){ if(state.dead) return; state.running=!state.running; pauseOverlay.classList.toggle('show',!state.running); state.lastTime=performance.now(); }
    function resumeGame(){
      if(state.dead) return;
      if(window._lootChoiceOpen) return; // nicht entpausen, solange Auswahl zwingend ist
      const ov = window.pauseOverlay || document.getElementById('pauseOverlay');
      state.running = true;
      if(ov) ov.classList.remove('show');
      state.lastTime = performance.now();
    }

    // Pause-Overlay Buttons verdrahten (Weiter/Neustart)
    (function wirePauseOverlayButtons(){
      const resume = document.getElementById('resumeBtn');
      if(resume && !resume.__wired){
        resume.__wired = true;
        resume.addEventListener('click', (e)=>{
          e.preventDefault();
          // Wenn das Loot-Auswahlmenü offen ist, nicht entpausen
          if(window._lootChoiceOpen) return;
          if(typeof resumeGame === 'function') resumeGame();
        });
      }
      const restartBtn = document.getElementById('restartBtn1');
      if(restartBtn && !restartBtn.__wired){
        restartBtn.__wired = true;
        restartBtn.addEventListener('click', (e)=>{
          e.preventDefault();
          if(typeof restart === 'function') restart();
        });
      }
    })();

    function buildUI(){
      weaponSlots.innerHTML='';
      weapons.forEach((w,i)=>{
        if(w.id === 'bolt') return; // verstecken
        let el;
        const unlocked=isUnlocked(i);
        const isActive = (i===player.weaponIndex);
        let cls = 'slot' + (unlocked?'' :' locked') + (isActive ?' active' : (state.bossAlive ? ' locked' : ''));
        el = document.createElement('div');
        el.style.cursor = 'default';
        el.className = cls;
        el.textContent = `${i+1}. ${w.name}  (Lv ${w.lvl}${w.evolved?'★':''})`;
        if(w.color){
          el.style.borderColor = w.color;
          el.style.boxShadow = 'none';
          if(isActive){
            el.style.background = w.color.replace(')',',0.07)').replace('rgb','rgba');
            el.style.boxShadow = 'none';
          }else{
            el.style.background = 'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(0,0,0,0.02))';
            el.style.boxShadow = 'none';
          }
        }
        weaponSlots.appendChild(el);
          // Redraw preview when weapon changes in menu
          if(document.getElementById('startMenu')?.classList.contains('show')) {
            el.onclick = () => { player.weaponIndex = i; drawCharacterPreview(); };
          }
      });
      updateBuffTags();
      if (typeof weaponNameTxt !== 'undefined' && weaponNameTxt) {
        weaponNameTxt.textContent = weapons[player.weaponIndex].name + (weapons[player.weaponIndex].kristof ? ' ★' : '');
      }
      if(typeof updateLiveScore==='function') updateLiveScore();
      showKristofCounter();
    }

    function updateBuffTags(){
      // Robust gegen fehlende alte Container (#buffTags existiert im neuen Layout evtl. nicht mehr)
      let buffsContainer = document.getElementById('buffTagsBuffs');
      let buffTags = document.getElementById('buffTags');
      // Falls alter buffTags Container fehlt aber Code erwartet ihn für Debuffs -> Dummy anlegen (unsichtbar)
      if(!buffTags){
        buffTags = document.createElement('div');
        buffTags.id = 'buffTags';
        buffTags.style.display = 'none';
        document.body.appendChild(buffTags);
      }
      if (buffsContainer) {
        buffsContainer.innerHTML = '';
      }

      
  // Entfernt: frühere -10% Schaden Malus für bestimmte Charakter/Waffen-Kombinationen.
      
      // Neue spezifische Buff-Anzeigen:
      // Fred (character === 'default'): Sword/Halbarde => +15% Schaden (SwordGod / HelGod)
      // Bully: Dagger/Staff => +20% Attack Speed (Ezio / Wizard)
      // Fred besonderer Lernpfad: Dagger/Staff zuerst Schwäche (-30% Schaden) bis Waffen-Lv 25, danach Meisterschaft (+40%).
  // Bully besonderer Lernpfad: Sword/Halbarde zuerst Schwäche (-30% Schaden) bis Waffen-Lv 25, danach Meisterschaft (+40%).
      if (typeof player.weaponIndex === 'number' && weapons[player.weaponIndex]) {
        const w = weapons[player.weaponIndex];
        // Fred Damage Buff
        if (character === 'default' && (w.id === 'sword' || w.id === 'halbard')) {
          if (buffsContainer && !Array.from(buffsContainer.children).some(e => e.textContent === 'SwordGod' || e.textContent === 'HelGod')) {
            const t = document.createElement('div');
            t.className = 'tag';
            t.textContent = (w.id === 'sword') ? 'SwordGod' : 'HelGod';
            t.title = '+15% Schaden';
            t.style.background = 'linear-gradient(90deg,#ffe600,#ffb347)';
            t.style.color = '#222';
            buffsContainer.appendChild(t);
          }
        }
        // Fred Lern-Debuff / Meister-Buff für Dolch & Stab
        if (character === 'default' && (w.id === 'dagger' || w.id === 'staff')) {
          // Entferne evtl. alte Tags (wenn mehrfach gewechselt) wird ohnehin neu gerendert
          const hasNoob = Array.from(buffsContainer.children).some(e => e.textContent === (w.id==='dagger'?'Dagger Noob':'Stab Noob'));
          const hasMaster = Array.from(buffsContainer.children).some(e => e.textContent === (w.id==='dagger'?'Absoluter Assassine':'Der Weise'));
          if (w.lvl < 25) {
            if (!hasNoob && !hasMaster) {
              const t = document.createElement('div');
              t.className = 'tag';
              t.textContent = (w.id === 'dagger') ? 'Dagger Noob' : 'Stab Noob';
              t.title = '-30% Schaden bis Waffen-Lv 25';
              t.style.background = 'linear-gradient(90deg,#ff7373,#ffa8a8)';
              t.style.color = '#222';
              buffsContainer.appendChild(t);
            }
          } else {
            if (!hasMaster) {
              const t = document.createElement('div');
              t.className = 'tag';
              t.textContent = (w.id === 'dagger') ? 'Absoluter Assassine' : 'Der Weise';
              t.title = '+40% Schaden (Meisterschaft)';
              t.style.background = 'linear-gradient(90deg,#ffe600,#ffdd55)';
              t.style.color = '#222';
              buffsContainer.appendChild(t);
            }
          }
        }
        // Bully Attack Speed Buff
        if (character === 'bully' && (w.id === 'dagger' || w.id === 'staff')) {
          if (buffsContainer && !Array.from(buffsContainer.children).some(e => e.textContent === 'Ezio' || e.textContent === 'Wizard')) {
            const t = document.createElement('div');
            t.className = 'tag';
            t.textContent = (w.id === 'dagger') ? 'Ezio' : 'Wizard';
            t.title = '+20% Angriffstempo';
            t.style.background = 'linear-gradient(90deg,#ffe600,#ffb347)';
            t.style.color = '#222';
            buffsContainer.appendChild(t);
          }
        }
        // Bully Lern-Debuff / Meister-Buff für Sword & Halbard
        if (character === 'bully' && (w.id === 'sword' || w.id === 'halbard')) {
          const hasNoob = Array.from(buffsContainer.children).some(e => e.textContent === (w.id==='sword'?'Sword Noob':'Halbarde Noob'));
            const masteryName = (w.id === 'sword') ? 'Klingenkaiser' : 'Sturmschnitter';
          const hasMaster = Array.from(buffsContainer.children).some(e => e.textContent === masteryName);
          if (w.lvl < 25) {
            if (!hasNoob && !hasMaster) {
              const t = document.createElement('div');
              t.className = 'tag';
              t.textContent = (w.id === 'sword') ? 'Sword Noob' : 'Halbarde Noob';
              t.title = '-30% Schaden bis Waffen-Lv 25';
              t.style.background = 'linear-gradient(90deg,#ff7373,#ffa8a8)';
              t.style.color = '#222';
              buffsContainer.appendChild(t);
            }
          } else {
            if (!hasMaster) {
              const t = document.createElement('div');
              t.className = 'tag';
              t.textContent = masteryName;
              t.title = '+40% Schaden (Meisterschaft)';
              t.style.background = 'linear-gradient(90deg,#ffe600,#ffdd55)';
              t.style.color = '#222';
              buffsContainer.appendChild(t);
            }
          }
        }
      }
      
  if (buffTags) buffTags.innerHTML = '';

      
      
      if (buffs.lifesteal && buffs.lifesteal > 0.003) {
        const t = document.createElement('div'); t.className = 'tag';
        t.textContent = 'Lifesteal';
        t.title = 'Du heilst dich bei jedem Kill um einen Teil deines Max-HP.';
        t.style.background = 'linear-gradient(90deg,#38e1d7,#6bf78a)';
        t.style.color = '#222';
        if (buffsContainer) buffsContainer.appendChild(t);
      }
      if (buffs.range && buffs.range !== 1) {
        const t = document.createElement('div'); t.className = 'tag';
        t.textContent = 'Reichweite erhöht';
        t.title = `Deine Waffen haben aktuell ${buffs.range.toFixed(2)}x Reichweite.`;
        t.style.background = 'linear-gradient(90deg,#38e1d7,#6bf78a)';
        t.style.color = '#222';
        if (buffsContainer) buffsContainer.appendChild(t);
      }
      if (buffs.dmg && buffs.dmg !== 1) {
        const t = document.createElement('div'); t.className = 'tag';
        t.textContent = 'Schaden erhöht';
        t.title = `Dein Schaden ist aktuell um den Faktor ${buffs.dmg.toFixed(2)} erhöht.`;
        t.style.background = 'linear-gradient(90deg,#38e1d7,#6bf78a)';
        t.style.color = '#222';
        if (buffsContainer) buffsContainer.appendChild(t);
      }
      if (buffs.speed && buffs.speed !== 1) {
        const t = document.createElement('div'); t.className = 'tag';
        t.textContent = 'Tempo erhöht';
        t.title = `Dein Bewegungstempo ist aktuell um den Faktor ${buffs.speed.toFixed(2)} erhöht.`;
        t.style.background = 'linear-gradient(90deg,#38e1d7,#6bf78a)';
        t.style.color = '#222';
        if (buffsContainer) buffsContainer.appendChild(t);
      }
      if (buffs.cooldown && buffs.cooldown !== 1) {
        const t = document.createElement('div'); t.className = 'tag';
        t.textContent = 'Cooldown reduziert';
        t.title = `Deine Waffen haben aktuell ${buffs.cooldown.toFixed(2)}x Cooldown.`;
        t.style.background = 'linear-gradient(90deg,#38e1d7,#6bf78a)';
        t.style.color = '#222';
        if (buffsContainer) buffsContainer.appendChild(t);
      }
      if(player.eliteKillBuff){
        const t=document.createElement('div'); t.className='tag';
        t.textContent = 'Elite-Buff';
        t.title = '+10% Schaden, +15% XP für kurze Zeit nach Elite-Kill.';
        t.style.background = 'linear-gradient(90deg,#38e1d7,#6bf78a)';
        t.style.color = '#222';
        if (buffsContainer) buffsContainer.appendChild(t);
      }

      
      
      if(character === 'bully' && buffTags) {
        const t1 = document.createElement('div'); t1.className = 'tag';
        t1.textContent = 'Tempo verringert';
        t1.title = 'Bully bewegt sich 50% langsamer (nur Bonusgeschwindigkeit).';
        t1.style.background = '#c73b3b'; t1.style.color = '#fff';
        try { buffTags.appendChild(t1); } catch(_e){}
      }
      if(player.explosionDebuff && buffTags){
        const t=document.createElement('div'); t.className='tag';
        t.textContent = 'Schaden erhöht';
        t.title = 'Du erhältst 10% mehr Schaden durch den Explosions-Debuff.';
        t.style.background = '#c73b3b';
        t.style.color = '#fff';
        try { buffTags.appendChild(t); } catch(_e){}
      }
      
    }

  // Spielername global
  window.playerDisplayName = '';
  window.kristofBossDefeated = 0;
  window.updateCharacterNameHUD = function updateCharacterNameHUD() {
    const newHud = document.getElementById('newTopHud');
    let nameDiv = document.getElementById('playerName');
    const nameEl = document.getElementById('hudPlayerName');
    if(newHud || nameDiv || nameEl) {
      let stars = '';
      if(window.kristofBossDefeated && window.kristofBossDefeated > 0) {
        const total = window.kristofBossDefeated;
        const cap = 5;
        const shown = Math.min(cap, total);
        stars = ' ' + '★'.repeat(shown);
        if(total > cap) stars += ' x' + total;
      }
      const displayName = (window.playerDisplayName || (typeof character!== 'undefined' && character === 'bully' ? 'Bully (Vampir)' : 'Fred'));
      // Update legacy hidden name (for compatibility) and new HUD name
      if(nameDiv) nameDiv.textContent = displayName + stars;
      if(nameEl) nameEl.textContent = displayName;

      // LootBar unter der Ident-Sektion des neuen HUD oder unter dem alten Namen anzeigen
      let lootBar = document.getElementById('lootBar');
      if (!lootBar) {
        lootBar = document.createElement('div');
        lootBar.id = 'lootBar';
        lootBar.style.fontSize = '0.98em';
        lootBar.style.marginTop = '7px';
        lootBar.style.color = '#ffe600';
        lootBar.style.textAlign = 'left';
      }
      if (newHud) {
        // Füge die Lootbar unterhalb des Ident-Blocks ein
        const ident = newHud.querySelector('.hud-block.ident');
        if (ident && lootBar.parentNode !== ident) {
          lootBar.style.position = 'relative';
          lootBar.style.left = '0';
          lootBar.style.top = '0';
          lootBar.style.width = '100%';
          lootBar.style.zIndex = '1';
          ident.appendChild(lootBar);
        }
      } else if (nameDiv) {
        if (lootBar.parentNode !== nameDiv) {
          lootBar.style.position = 'absolute';
          lootBar.style.left = '0';
          lootBar.style.top = 'calc(100% + 4px)';
          lootBar.style.width = '100%';
          lootBar.style.zIndex = '1';
          nameDiv.style.position = 'relative';
          nameDiv.appendChild(lootBar);
        }
      }
      if(window.collectedLoot && window.collectedLoot.length > 0) {
        let lootHtml = window.collectedLoot.map(l => {
          const item = LOOT_ITEMS.find(i => i.id === l.id);
          let tooltip = '';
          if(item) {
            if(item.id === 'truthfeather') {
              // Für normale title-Tooltips nicht genutzt – eigener Tooltip unten.
              tooltip = `${item.name}: ${item.desc}`;
            } else {
              tooltip = `${item.name} (${l.count}/10): ${item.desc}`;
            }
          }
          if(item && item.id === 'truthfeather') {
            if(!window._truthFeatherTooltipCSS){
              window._truthFeatherTooltipCSS = true;
              const style = document.createElement('style');
              style.textContent = `
                .loot-item.truthfeather { position:relative; }
                #truthFeatherFloatingTip { position:fixed; top:0; left:0; transform:translate(-9999px,-9999px); background:rgba(20,20,20,0.95); color:#ffe9c4; padding:10px 14px 12px; border:1px solid #ffbf47aa; border-radius:12px; font-size:0.82rem; line-height:1.15rem; width:210px; pointer-events:none; box-shadow:0 8px 22px -6px #000c,0 0 0 1px #000 inset; font-weight:500; z-index:10000; opacity:0; transition:opacity .12s; }
                #truthFeatherFloatingTip em { color:#ffd27a; font-style:italic; display:block; margin-top:6px; }
                #truthFeatherFloatingTip strong { color:#fff; font-weight:700; display:block; margin-bottom:2px; }
              `;
              document.head.appendChild(style);
              // Erzeuge globalen Tooltip Container
              const tip = document.createElement('div');
              tip.id = 'truthFeatherFloatingTip';
              tip.innerHTML = `<strong>The Truth?</strong>Ur life sucks!<em>You know it, I know it and everyone else too</em>`;
              document.body.appendChild(tip);
              window._showTruthFeatherTip = (target)=>{
                const rect = target.getBoundingClientRect();
                const tipEl = document.getElementById('truthFeatherFloatingTip');
                if(!tipEl) return;
                const pad = 6;
                let x = rect.left;
                let y = rect.top - pad - tipEl.offsetHeight;
                if(y < 4) y = rect.bottom + pad; // falls kein Platz oben
                if(x + tipEl.offsetWidth > window.innerWidth - 6) x = window.innerWidth - tipEl.offsetWidth - 6;
                tipEl.style.transform = `translate(${Math.round(x)}px,${Math.round(y)}px)`;
                tipEl.style.opacity = '1';
              };
              window._hideTruthFeatherTip = ()=>{
                const tipEl = document.getElementById('truthFeatherFloatingTip');
                if(tipEl){ tipEl.style.opacity='0'; tipEl.style.transform='translate(-9999px,-9999px)'; }
              };
            }
            const countBadge = `<span style='position:absolute;bottom:-6px;right:-4px;font-size:0.72em;color:#ffe600;font-weight:bold;'>${l.count>1?l.count:''}</span>`;
            return `<span class='loot-item truthfeather' onmouseenter='window._showTruthFeatherTip(this)' onmouseleave='window._hideTruthFeatherTip()' style='margin-right:7px;opacity:0.95;font-size:1em;cursor:help;position:relative;'>${item.icon}${countBadge}</span>`;
          }
          return `<span title='${tooltip}' style='margin-right:7px;opacity:0.90;font-size:1em;cursor:help;position:relative;'>${item ? item.icon : ''}<span style='position:absolute;bottom:-6px;right:-4px;font-size:0.72em;color:#ffe600;font-weight:bold;'>${l.count>1?l.count:''}</span></span>`;
        }).join('');
        if(window.hasBlessing) {
          lootHtml += `<span title='${BLESSING.name}: ${BLESSING.desc}' style='margin-right:7px;opacity:1;font-size:1.12em;cursor:help;position:relative;color:#ffe600;'>${BLESSING.icon}</span>`;
        }
        lootBar.innerHTML = lootHtml;
        lootBar.style.display = '';
      } else {
        lootBar.innerHTML = '';
        lootBar.style.display = 'none';
      }
    }
  }
  window.updateHUD = function updateHUD(){
    window.updateCharacterNameHUD();
  const hpP = Math.round(Math.max(0, (player.hp/player.maxHp)*100));
  const xpP = Math.round(Math.max(0, Math.min(100, (player.xp/player.next)*100)));
  const hpFill = document.getElementById('hpFill');
  const expBarFill = document.getElementById('expBarFill');
  const hpPercent = document.getElementById('hpPercent');
  const lvlTxt = document.getElementById('lvl');
  const killsTxt = document.getElementById('kills');
  const dmgTxt = document.getElementById('dmg');
  const spdTxt = document.getElementById('spd');
  const rateTxt = document.getElementById('rate');
  const weaponNameTxt = document.getElementById('weaponName');
  if(hpFill) hpFill.style.width = hpP + '%';
  // Ghost (Nachlauf) Logik
  (function(){
    // Sicherstellen, dass TESTMODE_BOSS existiert, um ReferenceErrors zu vermeiden
    if(typeof window!== 'undefined' && typeof TESTMODE_BOSS === 'undefined'){
      window.TESTMODE_BOSS = false;
    }
    // Fallback Stub: checkChestPickup falls durch Refactor entfernt
    if(typeof window.checkChestPickup !== 'function'){
      window.checkChestPickup = function(){
        if(!window.state || !player || !state.chests) return;
        for(let i=state.chests.length-1;i>=0;i--){
          const c = state.chests[i]; if(!c || c.opened) continue;
          const dx = player.x - c.x; const dy = player.y - c.y; const dist = Math.hypot(dx,dy);
          if(dist < (player.r + (c.r||22))){
            openChest(c);
          }
        }
        // Aufgeräumte Truhen entfernen
        for(let i=state.chests.length-1;i>=0;i--){
          const c = state.chests[i]; if(c && c._removeAt && performance.now() > c._removeAt){ state.chests.splice(i,1); }
        }
      };
    }
    // Fallback XP Requirement Funktion falls entfernt: leichte Kurve -> Basis 100, moderates Wachstum
    if(typeof window.getXPReq !== 'function'){
      window.getXPReq = function(level){
        if(level<=1) return 0;
        // Quadratisch leicht ansteigend + kleiner linearer Anteil
        return Math.round(100 + (level-1)*55 + (level-1)*(level-1)*18);
      };
    }
    // Demo-Truhen spawnen (frühe Sichtprüfung) – nur einmal beim Laden
    if(window.state && !window.__demoChestsSpawned){
      window.state.chests = window.state.chests || [];
      const baseX = 0, baseY = 0;
      for(let i=0;i<3;i++){
        window.state.chests.push({x:baseX + i*90, y:baseY + 120, r:22, opened:false});
      }
      window.__demoChestsSpawned = true;
    }
    const ghost = document.getElementById('hpFillGhost');
    const bar = hpFill && hpFill.parentElement;
    if(!ghost || !hpFill || !bar) return;
    if(!bar.__hpFX){
      bar.__hpFX = { ghostPct: hpP, lastReal: hpP, lastHpValue: player.hp, lastUpdate: performance.now() };
    }
    const fx = bar.__hpFX;
    const now = performance.now();
    const dt = (now - fx.lastUpdate) / 1000;
    fx.lastUpdate = now;
    const real = hpP;
    // Detect Heal / Damage
    if(real > fx.lastReal){
      // Heal -> schnelle Angleichen + Heal Flash
      fx.ghostPct = real; // sofort hoch
      if(!bar.classList.contains('heal-flash')){
        bar.classList.add('heal-flash');
        setTimeout(()=>bar.classList.remove('heal-flash'), 850);
      }
    } else if(real < fx.lastReal){
      // Damage -> langsam hinterherziehen + Damage Flash
      if(!bar.classList.contains('dmg-flash')){
        bar.classList.add('dmg-flash');
        setTimeout(()=>bar.classList.remove('dmg-flash'), 450);
      }
      // Lerp ghost langsam runter
      const fallSpeed = 25; // % pro Sekunde maximaler Abbau
      fx.ghostPct = Math.max(real, fx.ghostPct - fallSpeed * dt);
    }
    fx.lastReal = real;
    ghost.style.width = (fx.ghostPct) + '%';

    // Low HP Schwelle
    if(real <= 30){ bar.classList.add('low'); }
    else { bar.classList.remove('low'); }

    // Edge Spark bewegen
    const spark = document.getElementById('hpEdgeSpark');
    if(spark){
      if(real <= 0 || real >= 100){ spark.style.display='none'; }
      else {
        spark.style.display='block';
        spark.style.left = 'calc(' + real + '% - 4px)';
      }
    }
  })();
  if(expBarFill) expBarFill.style.width = xpP + '%';
  if(hpPercent) hpPercent.textContent = hpP + '%';
  if(lvlTxt) lvlTxt.textContent = player.level;
  if(killsTxt) killsTxt.textContent = player.kills;
  if(dmgTxt) dmgTxt.textContent = Math.round(player.dmg * (buffs.dmg||1));
  if(spdTxt) spdTxt.textContent = Math.round(player.speed); // player.speed enthält bereits alle Buffs
  if(rateTxt) rateTxt.textContent = (state.spawnInterval||1.2).toFixed(2) + 's';
  if(weaponNameTxt) weaponNameTxt.textContent = weapons[player.weaponIndex].name + (weapons[player.weaponIndex].kristof ? ' ★' : '');


      
      const corner = document.querySelector('.cornerTips');
      if(state.bossAlive){
        const color = state.bossPhaseRequiredColor || '#fff';
        const req = weapons.find(w=>w.color===color);
        const bossText = `<div style="display:flex;align-items:center;gap:8px;"><div style="width:18px;height:18px;border-radius:4px;background:${color};border:2px solid #0008;"></div><div>Boss-Phase: nutze ${req?req.name:'die passende Waffe'}</div></div>`;
        
        const boss = state.enemies.find(en=>en.boss);
        let extra = '';
        if(boss){
          if(boss.minionsAliveCount && boss.minionsAliveCount>0){
            extra = `<div style="margin-top:6px;font-weight:700;color:#ffd27a;">Elites: ${boss.minionsAliveCount} — Boss unverwundbar</div>`;
          } else if(boss.invulnerable){
            extra = `<div style="margin-top:6px;font-weight:700;color:#ff8a8a;">Boss vorübergehend unverwundbar</div>`;
          }
        }
        corner.innerHTML = bossText + extra;
      } else { corner.textContent = '' }
    }

    function selectWeapon(i){ if(!isUnlocked(i)) return; player.weaponIndex=i; player.cooldown=0; buildUI(); updateHUD(); }
    function nextWeapon(){ let i=player.weaponIndex; for(let s=0;s<weapons.length;s++){ i=(i+1)%weapons.length; if(isUnlocked(i)) return selectWeapon(i);} }
    function prevWeapon(){ let i=player.weaponIndex; for(let s=0;s<weapons.length;s++){ i=(i-1+weapons.length)%weapons.length; if(isUnlocked(i)) return selectWeapon(i);} }

  window.playerLevelUp = function playerLevelUp(){
      
      const playerCap = getPlayerLevelCap();
  

      const oldDmg = player.dmg; const oldSpd = player.speed;
      player.level++;
  // HP Skalierung bleibt, Schaden jetzt linear, Speed linear
      if(window.TESTMODE) {
        player.maxHp += 50 + Math.floor(player.level*6);
        player.hp = Math.min(player.maxHp, player.hp + 60);
        state.spawnInterval = Math.max(0.42, state.spawnInterval - 0.06);
      } else {
        player.maxHp += 10 + Math.floor(player.level*1.2);
        player.hp = Math.min(player.maxHp, player.hp + 12);
        state.spawnInterval = Math.max(0.6, state.spawnInterval - 0.02);
      }
  // Lineares Speed-Wachstum: Basis 200 (Level 1). Für Level 2-10: +5 pro Level, ab Level 11: +2 pro Level.
      const lvl = player.level;
      let bonus = 0;
      if(lvl > 1) {
        const firstPhaseLevels = Math.min(lvl-1, 9); // Levels 2..10
        bonus += firstPhaseLevels * 5; // +5 je Level bis einschließlich 10
        const remaining = Math.max(0, (lvl-1) - 9); // ab Level 11
        bonus += remaining * 2; // +2 je weiteres Level
      }
      // Setze absolute Geschwindigkeit (ignoriert frühere Multiplikatoren)
  // Basisgeschwindigkeit ohne temporäre Buffs berechnen
  const newBaseSpeed = 200 + bonus;
  // Sword Passive Bonus vorbereiten (additiv vor Weapon Multipliers)
  let swordPassiveBonus = 0;
  try {
    const activeW = (window.weapons && player && window.weapons[player.weaponIndex]) ? window.weapons[player.weaponIndex] : null;
    if(activeW && activeW.id === 'sword') {
      swordPassiveBonus = player.level * 5; // +5 pro Spieler-Level
    }
  } catch(e){ /* ignore */ }
  player._swordPassiveBonus = swordPassiveBonus;
  // Wenn gerade ein temporärer Speedbuff aktiv ist, merken wir ihn und setzen die sichtbare Geschwindigkeit erst nach Recalc unten
  player.speed = newBaseSpeed;
      // XP für nächstes Level nach neuer Kurve
      player.next = getXPReq(player.level+1);
      player.speed = Math.min(player.speed, 750);
  // Lineare Schaden-Neuberechnung nach dem Speed-Update
  if(typeof player.baseDamage !== 'number') player.baseDamage = 40; // Reduziert (vorher 50)
  if(typeof player.damagePerLevel !== 'number') player.damagePerLevel = 4; // 20% weniger Skalierung (vorher 5)
  // Progressive Schadens-Dämpfung (Variante C): Frühe Levels volle Skalierung, später abnehmende Grenzwerte
  (function applyProgressiveDamageDampening(){
    const lvlNow = player.level;
    const basePer = player.damagePerLevel; // Grund-Inkrement pro Level (hier 4)
    // Effektive Summe der Level-Inkremente manuell statt einfache (lvl-1)*basePer
    let effectiveBonus = 0;
    for(let L=2; L<=lvlNow; L++) {
      let mul = 1;
      if(L >= 21) mul = 0.25; // sehr geringe Zuwächse spät
      else if(L >= 16) mul = 0.40; // mittlere Reduktion
      else if(L >= 11) mul = 0.60; // frühe Dämpfung
      // Level 2..10 => mul=1 (volle Skalierung)
      effectiveBonus += basePer * mul;
    }
    player.dmg = player.baseDamage + effectiveBonus + (player._swordPassiveBonus||0);
    player._dmgDampInfo = {level:lvlNow, effectiveBonus, basePer};
  })();
  // EnemyScale DMG nur leicht mitwachsen lassen (optional): hier neutral lassen
  const dmgGain = player.dmg/oldDmg; enemyScale.dmg *= 1; // keine progressive Verstärkung
      const spdGain = player.speed/oldSpd; enemyScale.spd *= (1 + (spdGain-1)*0.10);
  // Aktualisiere Basisgeschwindigkeit für Loot-Buffs (wird von Tempo-Loot als Ausgang genommen)
  player.speedBase0 = newBaseSpeed;
  // Loot-Effekte neu anwenden damit Tempo-Loot auf neue Basis skaliert statt Basis zu überschreiben
  if(typeof applyAllLootEffects === 'function') applyAllLootEffects();
  buildUI(); updateHUD();
  
  
    }

    function addWeaponXP(idx, amount){
      let w = weapons[idx != null ? idx : player.weaponIndex];
      if(!w) return;
      amount = amount * WEAPON_XP_SCALE;
      if(window.TESTMODE) amount *= 3;
      if(w.lvl >= getWeaponLevelCap()) return;
      w.xp += Math.floor(amount);
      if(!w.next) w.next = WEAPON_XP_PER_LEVEL * WEAPON_XP_DIFFICULTY;
      while(w.xp >= w.next && w.lvl < getWeaponLevelCap()){
        w.xp -= w.next;
        w.lvl++;
        // Evolution bei Level 5 (vereinheitlicht)
        if(w.lvl === w.evolveLevel && typeof w.evolve === 'function' && !w.evolved) {
          w.evolve(w);
        }
        // Neue Meilensteine 15 & 25
        if((w.lvl === 15 || w.lvl === 25) && typeof w.onUpgrade === 'function') {
          w.onUpgrade(w, w.lvl);
        }
        if(typeof w.onLevel === 'function') w.onLevel(w);
        if(w.lvl >= getWeaponLevelCap()) {
          w.xp = 0;
          w.next = Infinity;
          break;
        } else {
          const baseReq = WEAPON_XP_PER_LEVEL + Math.floor(w.lvl*2.5);
          w.next = baseReq * WEAPON_XP_DIFFICULTY;
        }
      }
      buildUI();
    }

    function triggerAttack(){
  if(player.cooldown>0) return;
  if(player.canAttack===false) return;
      
      playerAnim = 'attack';
      playerAnimFrame = 0;
      playerAnimTimer = 0;
      player.canAttack = false;
      const w = weapons[player.weaponIndex];
      const ang = Math.atan2(mouseY-player.y, mouseX-player.x);
      
      let slashDir;
      const deg = (ang * 180 / Math.PI + 360) % 360;
      if (deg >= 45 && deg < 135) {
        slashDir = "down";
      } else if (deg >= 135 && deg < 225) {
        slashDir = "left";
      } else if (deg >= 225 && deg < 315) {
        slashDir = "up";
      } else {
        slashDir = "right";
      }
      fredSlashDirection = slashDir;
      fredSlashAngle = ang;
      
      // Nur permanenter Speedbuff beeinflusst Angriffscooldown; temporärer Q Buff NICHT
      let speedBuff = buffs.speed || 1;
      let dmgBuff = buffs.dmg || 1;
      if(w.id === 'dagger') {
        speedBuff = 1 + (speedBuff - 1) * 0.75;
        dmgBuff = 1 + (dmgBuff - 1) * 0.75;
      }
      
      // Neue Buff-Regeln:
      // Fred: +15% Schaden mit Schwert oder Halbarde
      if (character === 'default' && (w.id === 'sword' || w.id === 'halbard')) {
        dmgBuff *= 1.15;
      }
      // Fred Dagger/Staff Lernkurve: bis Waffen-Lv 25 -30% Schaden, ab 25 +40%
      if (character === 'default' && (w.id === 'dagger' || w.id === 'staff')) {
        if (w.lvl < 25) dmgBuff *= 0.70; else dmgBuff *= 1.40;
      }
      // Bully: +20% Attack Speed mit Dolch oder Stab (wir reduzieren Cooldown um 20%)
      let attackSpeedMul = 1; // <1 bedeutet schnellerer Cooldown
      if (character === 'bully' && (w.id === 'dagger' || w.id === 'staff')) {
        attackSpeedMul *= 0.80; // 20% schneller
      }
      // Bully Sword/Halbard Lernkurve: bis Waffen-Lv 25 -30% Schaden, ab 25 +40%
      if (character === 'bully' && (w.id === 'sword' || w.id === 'halbard')) {
        if (w.lvl < 25) dmgBuff *= 0.70; else dmgBuff *= 1.40;
      }
  const cd = Math.max(0.06, w.cooldown * attackSpeedMul * (buffs.cooldown||1) / speedBuff);
      player.cooldown = cd;
      if(w.id === 'staff') {
        
        let count = 1;
        if(w.lvl >= 10) count = 5;
        else if(w.lvl >= 7) count = 3;
        else if(w.lvl >= 3) count = 2;
  const spread = count > 1 ? 0.18 : 0; 
        for(let i=0;i<count;i++) {
          const offset = spread * (i - (count-1)/2);
          const fireball = {
            x: player.x,
            y: player.y,
            vx: Math.cos(ang + offset) * 520,
            vy: Math.sin(ang + offset) * 520,
            r: 8, // smaller, crisper fireball radius (was 18)
            color: '#ff7c1f',
            type: 'fireball',
            seed: Math.random()*Math.PI*2,
            dmg: player.dmg * w.dmgMul * (buffs.dmg||1) * dmgBuff,
            range: 420,
            traveled: 0,
            pierce: 1,
            piercedCount: 0,
            explode: 60,
            trail: [],
            trailColor: true,
            weaponIndex: player.weaponIndex
          };
          state.projectiles.push(fireball);
        }
        for(let i=0;i<8;i++) particle(player.x, player.y, '#ffb347');
        
        
        
        
      } else if(w.type==='projectile'){
        spawnProjectile(w, ang);
      } else {
        // Immer einen Slash erzeugen, egal ob Fred oder Bully
  const duration = 0.16;
  const id1=++state._slashId;
  const visualArc = (95 * Math.PI) / 180; 
  const hitArc = visualArc * 1.15; 
  const slash={ start:state.time, dur:duration, angle:fredSlashAngle, range: w.range*(buffs.range||1), arc:hitArc, color:w.color, width:14, id:id1, weaponIndex:player.weaponIndex, dmgBuff: dmgBuff };
  state.slashes.push(slash);
  console.log('Slash erzeugt:', { character, weapon: w.id, angle: fredSlashAngle, x: player.x, y: player.y });
        // Schwert-Doppelschlag ab Level 3
        if(w.id === 'sword' && w.lvl >= 3) {
          let scale = 0.25; // 75% weniger
          if(w.lvl >= 5) scale = 0.4;
          if(w.lvl >= 7) scale = 0.5;
          if(w.lvl >= 10) scale = 0.6;
          if(w.lvl >= 15) scale = 0.65 + 0.05 * Math.floor((w.lvl-10)/5); // ab lvl 15 alle 5 lvl +5%
          // Cap: max 2x Schaden (200%)
          if(scale > 2) scale = 2;
          const id2 = ++state._slashId;
          const doubleSlash = Object.assign({}, slash, {
            id: id2,
            start: state.time + 0.08, // leicht verzögert
            dmgScale: scale,
            angle: fredSlashAngle + 0.13 // kleiner Versatz für optischen Effekt
          });
          state.slashes.push(doubleSlash);
        }
        // Graue Partikel entlang des Arcs (außer bei Stab), für alle Charaktere
        if(w.id !== 'staff') {
          const arcStart = fredSlashAngle - hitArc/2;
          const arcEnd = fredSlashAngle + hitArc/2;
          const steps = 12;
          for(let i=0;i<=steps;i++) {
            const t = i/steps;
            const angle = arcStart + (arcEnd-arcStart)*t;
            const px = player.x + Math.cos(angle) * (w.range*(buffs.range||1));
            const py = player.y + Math.sin(angle) * (w.range*(buffs.range||1));
            particle(px, py, '#cccccc');
          }
        }
        if(w.multi && !state.bossAlive){
          const id2=++state._slashId;
          const s2=Object.assign({},slash,{ id:id2, angle: fredSlashAngle+0.35, start: state.time+0.06, width:12, dmgScale: 0.5 });
          state.slashes.push(s2);
        }
        // ...Halberd auto-sweep logic removed...
        // Dolch Spezial: Nach jedem 10. Treffer Projektil mit DoT für alle Gegner in Linie
        if(w.id === 'dagger'){
          w.attackCounter = (w.attackCounter || 0) + 1;
          let hitsNeeded = 10;
          if(w.lvl >= 3) hitsNeeded = 7;
          if(w.attackCounter >= hitsNeeded){
            w.attackCounter = 0;
            // Projektil(e) erzeugen
            const speed = 900;
            let numDaggers = 1;
            if(w.lvl >= 7) numDaggers = 2;
            for(let d=0; d<numDaggers; d++) {
              let angle = fredSlashAngle;
              if(numDaggers === 2) angle += (d === 0 ? -0.12 : 0.12); // leichter Spread bei 2 Daggers
              const proj = {
                x: player.x,
                y: player.y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                r: 10,
                color: '#f7c948',
                dmg: 0,
                range: 700,
                traveled: 0,
                pierce: 99, // durchdringt alle
                type: 'daggerDotPierce',
                hitEnemies: new Set(),
                trail: [],
                dotDmgBonus: w.lvl >= 10 ? 1.25 : 1.0
              };
              state.projectiles.push(proj);
            }
          }
        }
      }
    }

    function spawnProjectile(w, ang){
  if(w.id === 'bolt'){
  
  
  let lines = Math.min(10, Math.max(1, Math.floor(w.lvl || 1)));
  
  if(w.kristof && w.kristofStage) { lines = Math.min(40, lines * Math.max(1, w.kristofStage)); }
  const count = lines;
  const baseDmg = player.dmg * w.dmgMul * (buffs.dmg||1) * dmgBuff;
        const per = baseDmg / Math.sqrt(count);
        const speedBase = w.speed || 480;
        
        const moving = Math.abs(player.vx||0) > 2 || Math.abs(player.vy||0) > 2;
        
        const centerAng = Math.atan2(mouseY-player.y, mouseX-player.x);
        
        const baseSpread = moving ? 0.06 : Math.min(1.6, 0.12 * Math.sqrt(count));
        const spread = baseSpread;
        for(let i=0;i<count;i++){
          
          const slot = (i - (count-1)/2);
          const a = centerAng + (spread * slot) / Math.max(1, (count-1)/2);
          const speed = speedBase;
          const vx = Math.cos(a) * speed;
          const vy = Math.sin(a) * speed;
          
          
          const defaultPierce = Math.max(1, Math.floor(count * 0.6));
          const initialPierce = (w.kristof ? (w.kristofStage || 1) : (w.pierce != null ? w.pierce : defaultPierce));
          const proj = { x:player.x, y:player.y, vx, vy, r:6, color:w.color, dmg: per, range:w.range, traveled:0, pierce: initialPierce, piercedCount: 0, explode:w.explode||0, trail:[], weaponIndex:player.weaponIndex, ricochet: (w.kristof ? (w.kristofStage || 0) : 0) };
          state.projectiles.push(proj);
        }
  particle(player.x,player.y,'#cccccc');
        return;
      }
      const speed=w.speed; const vx=Math.cos(ang)*speed, vy=Math.sin(ang)*speed;
      // Rekonstruiere dmgBuff analog zu triggerAttack (vereinfachte Wiederholung)
      let projDmgBuff = 1;
      if (character === 'default' && (w.id === 'sword' || w.id === 'halbard')) projDmgBuff *= 1.15;
      if (character === 'default' && (w.id === 'dagger' || w.id === 'staff')) {
        projDmgBuff *= (w.lvl < 25 ? 0.70 : 1.40);
      }
      if (character === 'bully' && (w.id === 'sword' || w.id === 'halbard')) {
        projDmgBuff *= (w.lvl < 25 ? 0.70 : 1.40);
      }
      const proj={ x:player.x, y:player.y, vx, vy, r:6, color:w.color, dmg: player.dmg*w.dmgMul*(buffs.dmg||1)*projDmgBuff, range:w.range, traveled:0, pierce:w.pierce||0, explode:w.explode||0, trail:[] , weaponIndex:player.weaponIndex, ricochet:0};
  state.projectiles.push(proj); particle(player.x,player.y,'#cccccc');
    }

    function spawnWerewolf(){
  if(state.bossAlive) return;
  
  const weaponOnlyExists = state.enemies.some(e => e.type === 'weaponOnly');
  const margin=40; const side=Math.floor(Math.random()*4); let x,y;
  if(side===0){ x = -margin; y = Math.random() * innerHeight; }
  if(side===1){ x = innerWidth + margin; y = Math.random() * innerHeight; }
  if(side===2){ y = -margin; x = Math.random() * innerWidth; }
  if(side===3){ y = innerHeight + margin; x = Math.random() * innerWidth; }
  const rangedCount = state.enemies.filter(e=>e.type==='ranged').length;
  const typeRoll = Math.random(); let type='runner';
  // +30% mehr Chance auf ranged: 0.28 * 1.3 = 0.364
  // Brute Anteil bleibt gleich (weiter +0.28) -> neuer Schwellenwert 0.364 + 0.28 = 0.644
  if(typeRoll < 0.364 && rangedCount < Math.max(2, Math.floor(player.level/6))) type='ranged';
  else if(typeRoll < 0.644) type='brute';
  
  if(Math.random() < 0.15 && !weaponOnlyExists) {
    type = 'weaponOnly';
  }
    const eliteProb = Math.min(0.01 + player.level*0.002, 0.06);
    const elite = Math.random() < eliteProb;
    
    const baseHp = (type==='brute'? 160: (type==='runner'? 80: 92)) * (type==='weaponOnly' ? 0.5 : 0.7);
    let baseSpd = (type==='runner'? 118: (type==='brute'? 72: 88));
    
    if(type==='ranged' && !elite) baseSpd *= 0.8;
    
    
    let baseDmg = (type==='weaponOnly' ? 120 : (type==='brute'? 44: (type==='runner'? 24: 26)));
    if(type==='ranged' && !elite) {
      baseDmg *= 1.2;
      
      const maxRangedDmg = Math.round(player.maxHp * 0.05);
      if(baseDmg > maxRangedDmg) baseDmg = maxRangedDmg;
    }
    
    let hpMul = 1.0, dmgMul = 1.0;
    if(elite && type!=='ranged') { hpMul = 1.5; dmgMul = 1.2; }
  // --- Neue Skalierungsformeln ---
  const cfg = window.enemyScalingConfig || {};
  const levelHpAdd = player.level * (cfg.baseHpLevelFactor || 18);
  const timeHpAdd  = state.time * (cfg.baseHpTimeFactor || 0.5);
  const eliteMulBase = elite ? (cfg.eliteHpMul || 2.6) : (cfg.normalHpMul || 1.1);
  const hpBase = (baseHp + levelHpAdd + timeHpAdd) * eliteMulBase * enemyScale.hp * hpMul;

  const levelDmgAdd = player.level * (cfg.dmgLevelFactor || 3.0);
  const timeDmgAdd  = state.time * (cfg.dmgTimeFactor || 0);
  const eliteDmgMul = elite ? 1.6 : 1;
  let mobDmg = (baseDmg + levelDmgAdd + timeDmgAdd) * eliteDmgMul * enemyScale.dmg * 1.20 * dmgMul;
  if(type==='weaponOnly') mobDmg *= 1.5; 
  const e={ x,y,r: elite?18:14, hp:hpBase, maxHp:hpBase, speed:(baseSpd + player.level*6 + Math.random()*16)*(elite?1.10:1)*enemyScale.spd, elite, lastHitId:-1, dmg: mobDmg, type, shootTimer: 1.5 + Math.random()*1.5 };
  if(cfg.logSpawns){
    console.log('[Spawn]', {type, elite, lvl: player.level, time: state.time.toFixed(1), baseHp, levelHpAdd: levelHpAdd.toFixed?levelHpAdd.toFixed(1):levelHpAdd, timeHpAdd: timeHpAdd.toFixed?timeHpAdd.toFixed(1):timeHpAdd, hpScale: enemyScale.hp.toFixed(3), finalHp: Math.round(hpBase), baseDmg, levelDmgAdd: levelDmgAdd.toFixed?levelDmgAdd.toFixed(2):levelDmgAdd, timeDmgAdd: timeDmgAdd.toFixed?timeDmgAdd.toFixed(2):timeDmgAdd, dmgScale: enemyScale.dmg.toFixed(3), finalDmg: mobDmg.toFixed(1)});
  }
  e.knockbackVX = 0;
  e.knockbackVY = 0;
  e.hitCooldown = 0;
  if(elite && type==='runner'){
    e.dashState = 'idle';
    e.dashCooldown = 2.5 + Math.random()*2.5;
  }
  if(elite && type!=='ranged') e.exp = 90; 
  if(elite && type!=='ranged') e.spawnTime = performance.now();
    
    if (e.elite || e.type === 'ranged' || e.type === 'weaponOnly') {
      e.speed *= 0.9;
    }
    if(type==='weaponOnly') {
      
      e.color = e.type==='ranged' ? '#39ff14' : (e.elite ? '#f0a020' : '#3be67a');
  e.explodesOnTouch = true; 
    } else {
      
      e.color = e.elite ? '#f0a020' : (e.type==='ranged' ? '#39ff14' : '#3be67a');
    }
    state.enemies.push(e); if(state.enemies.length>260) state.enemies.shift();
 
setInterval(()=>{
setInterval(()=>{
  if(state.running && !state.dead){
    
    const eliteNahAlive = state.enemies.some(e => e.elite && e.type === 'runner');
    if(eliteNahAlive) return;
    const margin=40;
    let x, y;
    const side=Math.floor(Math.random()*4);
    if(side===0){ x = -margin; y = Math.random() * innerHeight; }
    if(side===1){ x = innerWidth + margin; y = Math.random() * innerHeight; }
    if(side===2){ y = -margin; x = Math.random() * innerWidth; }
    if(side===3){ y = innerHeight + margin; x = Math.random() * innerWidth; }
    
  const eliteE={ x, y, r:18, hp:4000, maxHp:4000, speed:80, elite:true, lastHitId:-1, dmg:60, type:'runner', shootTimer: 9999, exp: 90, spawnTime: performance.now() };
  eliteE.color = '#f0a020';
  state.enemies.push(eliteE);
  if(state.enemies.length>260) state.enemies.shift();
  }
}, 15000);
  if(state.running && !state.dead){
    
    const eliteNahAlive = state.enemies.some(e => e.elite && e.type === 'runner');
    if(eliteNahAlive) return;
    const margin=40;
    let x, y;
    const side=Math.floor(Math.random()*4);
    if(side===0){ x = -margin; y = Math.random() * innerHeight; }
    if(side===1){ x = innerWidth + margin; y = Math.random() * innerHeight; }
    if(side===2){ y = -margin; x = Math.random() * innerWidth; }
    if(side===3){ y = innerHeight + margin; x = Math.random() * innerWidth; }
    
    const e={ x, y, r:18, hp:4000, maxHp:4000, speed:80, elite:true, lastHitId:-1, dmg:60, type:'runner', shootTimer: 9999 };
    e.color = '#f0a020';
    state.enemies.push(e);
    if(state.enemies.length>260) state.enemies.shift();
  }
}, 15000);
}

    function enemyShoot(e){
      const ang = Math.atan2(player.y-e.y, player.x-e.x);
      const sp = 220 + player.level*8;
      let baseShotDmg = 16 + player.level * 2.5;
      if(e.boss) baseShotDmg *= 1.2;
      baseShotDmg = Math.round(baseShotDmg * (enemyScale.dmg || 1));
      
      if(e.type === 'ranged' && !e.elite && !e.boss) {
        const maxRangedDmg = Math.round(player.maxHp * 0.05);
        if(baseShotDmg > maxRangedDmg) baseShotDmg = maxRangedDmg;
        
        if(Math.random() < 0.25) return;
      }
      const shot = { x: e.x, y: e.y, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp, r: 4, dmg: baseShotDmg, life: 3, sourceIsBoss: !!e.boss };
      state.enemyShots.push(shot);
    }







    
    function handleBossPhaseAfterDamage(e, idx){
      
      if(!e || !e.boss) {
        
        if(e && e.hp <= 0){ if(idx!=null) killEnemy(idx, e); else { const i = state.enemies.indexOf(e); if(i>=0) killEnemy(i,e); } }
        return;
      }
  
  if(e.hp > 0) return; 
  
  if(idx!=null) killEnemy(idx, e); else { const i = state.enemies.indexOf(e); if(i>=0) killEnemy(i,e); }

 
 
 
 
 
setTimeout(() => {
  
}, 0);
  
  if(e.boss && e.name === 'Kristof') {
    ctx.save();
    ctx.globalAlpha = 0.95;
    const barW = 64, barH = 8;
    const barX = e.x - barW/2, barY = e.y - e.r - 24;
    ctx.fillStyle = '#222';
    ctx.fillRect(barX, barY, barW, barH);
    ctx.fillStyle = e.invulnerable ? '#aaa' : '#e74c3c';
  ctx.fillStyle = '#e74c3c';
    const hpRatio = Math.max(0, Math.min(1, e.hp / e.maxHp));
    ctx.fillRect(barX, barY, barW * hpRatio, barH);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.strokeRect(barX, barY, barW, barH);
    ctx.font = 'bold 15px Arial';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#fff';
    ctx.fillText('Kristof', e.x, barY - 6);
    ctx.restore();
  }
      if(!e || !e.boss || !e.phasePools) {
        
        if(e && e.hp <= 0){ if(idx!=null) killEnemy(idx, e); else { const i = state.enemies.indexOf(e); if(i>=0) killEnemy(i,e); } }
        return;
      }
      
  if(e.hp > 0) return; 
      
      if(e.currentPhase < e.phasePools.length - 1){
        e.currentPhase++;
        e.maxHp = e.phasePools[e.currentPhase];
        e.hp = e.maxHp;
        
        if(e.phases && e.phases[e.currentPhase]) state.bossPhaseRequiredColor = e.phases[e.currentPhase].color;
        
        spawnPhaseSpecials(e);
        
  for(let p=0;p<18;p++) particle(e.x + (Math.random()-0.5)*e.r*3, e.y + (Math.random()-0.5)*e.r*3, '#cccccc');
        
      } else {
        
        if(idx!=null) killEnemy(idx, e); else { const i=state.enemies.indexOf(e); if(i>=0) killEnemy(i,e); }
      }
    }




    function lifestealOnKill(){
      if(!buffs.lifesteal || buffs.lifesteal <= 0) return;
      const heal = Math.max(1, Math.round(player.maxHp * buffs.lifesteal));
      player.hp = Math.min(player.maxHp, player.hp + heal);
      updateHUD();
    }

  function restart(){
      // --- Vereinheitlichte Restart-Logik (übernimmt Auswahl aus Startmenü) ---
      // Spielername (neues Input im Startmenü) übernehmen falls noch nicht gesetzt
      if (!window.playerDisplayName) {
        const nameInput = document.getElementById('playerNameInputStart') || document.getElementById('playerNameInput');
        if(nameInput && nameInput.value.trim()) window.playerDisplayName = nameInput.value.trim();
      }

      // Defaults falls keine Auswahl gespeichert wurde
      if(!window.selectedCharacter) window.selectedCharacter = 'fred';
      if(!window.selectedWeaponId) window.selectedWeaponId = 'sword';
      const charVal = (window.selectedCharacter||'fred').toLowerCase();
      const weaponVal = (window.selectedWeaponId||'sword').toLowerCase();

      // Charakter anwenden
      if(charVal === 'bully') {
        character = 'bully';
        Object.assign(player, bullyPlayer);
        buffs.lifesteal = 0.005;
        buffs.range=1; buffs.dmg=1; buffs.speed=1; buffs.cooldown=1; clampBuffs();
        window.bullyFrame = 0; window.bullyLastTick = 0; window.bullyAnimState = 'idle'; window.bullyDirection = 'down';
  player.baseDamage = 40; // Erzwinge neue Basis bei Restart
  player.damagePerLevel = 4;
        player.dmg = player.baseDamage + (player.level-1)*player.damagePerLevel;
      } else {
        // Für Fred muss intern "default" stehen, damit Rendering-Code greift
        character = 'default';
        Object.assign(player, defaultPlayer);
        buffs.lifesteal=0.003; buffs.range=1; buffs.dmg=1; buffs.speed=1; buffs.cooldown=1; clampBuffs();
  player.baseDamage = 40;
  player.damagePerLevel = 4;
        player.dmg = player.baseDamage + (player.level-1)*player.damagePerLevel;
      }

      // Gewählte Waffe aktiv setzen
      const chosenIdx = weapons.findIndex(w => w.id.toLowerCase() === weaponVal);
      player.weaponIndex = chosenIdx >= 0 ? chosenIdx : 0;

      // Reset Waffen-Status
      weapons.forEach(w=>{ w.lvl=1; w.xp=0; w.next=XP_PER_LEVEL; w.evolved=false; delete w.multi; delete w.knock; delete w.ticks; delete w.explode; delete w.kristof; delete w.kristofStage; delete w.kristofActivated; });
      weapons.forEach(w => { w.attackCounter = 0; });

      // Skalierungen zurücksetzen
      enemyScale.hp=1; enemyScale.dmg=1; enemyScale.spd=1;

      // Spiel-State zurücksetzen
      Object.assign(state,{
  running:true, dead:false, time:0, lastTime:performance.now(), spawnTimer:0, spawnInterval:1.2, enemies:[], particles:[], projectiles:[], slashes:[], powerups:[], enemyShots:[], _slashId:0, spawnMultiplier:1, kristofBladeTimer:0, kristofBladeRot:0, autoWeaponSpin:false, autoWeaponSpinTimer:0, bossAlive:false, kristofKillsLeft: 100,
  // Kristof Spawn Gates auch für dieses Reset-Objekt übernehmen
  kristofMinTime: 60,
  kristofMinKills: 25,
        chests: []
      });
      state.aoes = []; state.sweeps = []; state._sweepId = 0;

      // --- Zusätzliche vollständige Drop/Loot Bereinigung ---
      // Alle temporären / laufzeitgenerierten Container sicher leeren
      try {
        state.powerups = []; // (falls anderswo gelesen)
        state.chests = [];
        state.enemyShots = [];
        state.projectiles = [];
        state.slashes = [];
        state.particles = [];
        state.enemies = [];
        if(state.aoes) state.aoes.length = 0;
        if(state.sweeps) state.sweeps.length = 0;
      } catch(err){ console.warn('[restart cleanup arrays]', err); }

      // Aktive Loot Effekte zurücksetzen (gesammelte Items verwerfen für neuen Run)
      if(Array.isArray(window.collectedLoot)) window.collectedLoot.length = 0;
      // Falls Effekte persistent Buffs gesetzt haben -> neu anwenden (hier einfach buff Reset schon oben gemacht)

      // Entferne evtl. sichtbar gelassene Loot-Nachrichten
      try {
        const msgs = document.querySelectorAll('.loot-msg');
        msgs.forEach(m=> m.remove());
      } catch(e){ /* ignore */ }

      // Offene Timeout/Interval-Handles optional später tracken (TODO: Falls nötig Liste pflegen)


  // Score zurücksetzen
  if(typeof liveScore !== 'undefined') liveScore = 0;
  if(typeof showLiveScore === 'function') showLiveScore();
  // Overlays schließen & HUD aktualisieren (mit Existenz-Checks)
  if(typeof pauseOverlay !== 'undefined' && pauseOverlay) pauseOverlay.classList.remove('show');
      if(typeof gameOverOverlay !== 'undefined' && gameOverOverlay){
        gameOverOverlay.classList.remove('show');
        gameOverOverlay.style.display='none';
        gameOverOverlay.style.visibility='hidden';
      }
      const dynGO = document.getElementById('gameOverOverlay');
      if(dynGO){
        dynGO.classList.remove('show');
        dynGO.style.display='none';
        dynGO.style.visibility='hidden';
      }
  const scoreDiv = document.getElementById('gameOverScore');
  if(scoreDiv) scoreDiv.textContent = 'Score: 0';
      // Todes-Flags zurücksetzen
      if(typeof isDying !== 'undefined') isDying = false;
      if(typeof finishedDying !== 'undefined') finishedDying = false;
      if(typeof deathFrame !== 'undefined') deathFrame = 0;
      buildUI();
      updateHUD();
      showKristofCounter();
  // Loop wieder anwerfen
  if(!state.running){ state.running = true; }
  if(!window.__gameRaf){ window.__gameRaf = requestAnimationFrame(gameLoop); }
    }
  // Fallback gameLoop Definition (falls weiter unten überschrieben wird)
  if(typeof window.gameLoop !== 'function'){
    window.gameLoop = function(ts){
      try{
        if(!state.running){ window.__gameRaf = requestAnimationFrame(window.gameLoop); return; }
        const now = performance.now();
        const dt = Math.min(0.05, (now - state.lastTime)/1000);
        state.lastTime = now;
        // Update Kernsysteme
        if(typeof step==='function') step(dt);
        if(typeof draw==='function') draw();
      }catch(err){ console.error('[Fallback gameLoop error]', err); }
      window.__gameRaf = requestAnimationFrame(window.gameLoop);
    };
  }
  // Restart global verfügbar machen für Inline-Handler im HTML
  if(typeof window !== 'undefined') window.restart = restart;
  // restartPreserve entfernt – einheitliche Restart-Logik
    function damagePlayer(d){
  const cfg = window.enemyScalingConfig || {};
  let original = d;
  let factors = [];
  if(player.explosionDebuff){ d *= 1.10; factors.push('explosionDebuff*1.10'); }
  if(player.permanentDamageDebuff){ d *= 1.10; factors.push('permanentDamageDebuff*1.10'); }
  if(player.eliteKillBuff){ d *= 0.91; factors.push('eliteKillBuff*0.91'); }
      // Halberd charge mitigation (50%)
      const hu = window.halberdUlt; if(hu && hu.state==='charging'){ d *= (1 - (hu.mitigation||0.5)); factors.push('halberdChargeMitigation'); }
  if(d < (cfg.minDamageAfterAll||1)) { factors.push('clamped'); d = cfg.minDamageAfterAll||1; }
  if(player.iFrames>0) return; 
  const before = player.hp;
  player.hp -= d; 
  if(cfg.logDamage) console.log('[PlayerDamage]', {raw: original, final: d, factors, before, after: player.hp, max: player.maxHp, time: state.time.toFixed(2)});
  player.iFrames = 0.35; 
  for(let i=0;i<10;i++) particle(player.x,player.y,'#cccccc'); 
  if(player.hp<=0){
    player.hp=0;
    console.warn('[PlayerDeath]', {time: state.time.toFixed(2), lastDamage: d, before, kristof: state.kristof?{hp:state.kristof.hp, phase: state.kristof.shockwaveState}:null});
    
    state.enemies = [];
    if(window.ENABLE_DEATH_ANIMATION){
      startDeath();
    } else {
      die();
    }
  }
  updateHUD();
    }

    
// Startmenü und alte Charakterauswahl entfernt – Spiel startet direkt
  let live = document.getElementById('liveScore');
  if(live) live.style.display = 'none';
  
  setTimeout(() => {
    const btn = document.getElementById('mainMenuBtn');
    if(btn) {
      btn.onclick = () => {
        if(window.gameOverOverlay) window.gameOverOverlay.classList.remove('show');
        
               
        const startMenu = document.getElementById('startMenu');
        if(startMenu) startMenu.classList.add('show');
        const charMenu = document.getElementById('characterMenu');
        if(charMenu) charMenu.style.display = '';
        const charInfo = document.getElementById('charInfoBox');
        if(charInfo) charInfo.style.display = 'block';
        restart();
        const scoreDiv = document.getElementById('gameOverScore');
        if(scoreDiv) scoreDiv.textContent = 'Score: 0';
      };
    }
  }, 0);

    function angleDiff(a,b){ let d = a - b; while(d > Math.PI) d -= 2*Math.PI; while(d < -Math.PI) d += 2*Math.PI; return d; }

    // Fallback: Truhen-Drop Logik (Falls frühere Version entfernt wurde)
    function maybeDropChest(enemy){
      try{
        if(!enemy || enemy.boss || enemy.type==='weaponOnly') return; // keine Kisten von Bossen/Spezial
        state.chestTimer = state.chestTimer || 0;
        // Basis-Chance je nach Gegnertyp leicht unterschiedlich
        if(typeof window.CHEST_DROP_GLOBAL_SCALE !== 'number') window.CHEST_DROP_GLOBAL_SCALE = 0.5; // -50% global
        let base = enemy.elite ? 0.25 : 0.04; // 25% Elite, 4% normal (vor Skalierung)
        base *= window.CHEST_DROP_GLOBAL_SCALE;
        if(enemy.type==='ranged') base *= 1.15;
        if(Math.random() < base){
          state.chests = state.chests || [];
          state.chests.push({x:enemy.x,y:enemy.y,r:18,opened:false,spawnAt:performance.now()});
        }
      }catch(err){ console.warn('maybeDropChest error',err); }
    }

  function killEnemy(idx, e, weaponIndexForXP){
  // Meteor Soul Counter: Jeder Kill (außer Boss) zählt eine Soul
  if(window.staffMeteor && e && !e.boss) {
    window.staffMeteor.souls = (window.staffMeteor.souls || 0) + 1;
    if(window.staffMeteor.souls > window.staffMeteor.soulsRequired) window.staffMeteor.souls = window.staffMeteor.soulsRequired;
    if(typeof updateHUD === 'function') updateHUD();
  }
  // Expose globally so early-defined abilities (e.g., halberd release) can call it safely
  if(typeof window!=='undefined') window.killEnemy = killEnemy;
  liveScore += (e && e.boss) ? 200 : (e && e.elite) ? 50 : (e && e.type==='weaponOnly') ? 30 : 10;
  showLiveScore();
  if(e && e.elite && state.bossAlive) {
    const heal = Math.round(player.maxHp * 0.025);
    player.hp = Math.min(player.hp + heal, player.maxHp);
    if(typeof particle === 'function') for(let i=0;i<6;i++) particle(player.x, player.y, '#38e1d7');
    if(typeof updateHUD==='function') updateHUD();
  }
  if(e && e.boss) {
    if(typeof addScore==='function') addScore('boss');
    // Guard: nur einmal pro Boss-Objekt zählen
    if(!e._defeatCounted){
      e._defeatCounted = true;
      window.kristofBossDefeated = (window.kristofBossDefeated||0) + 1;
      if(typeof window.updateCharacterNameHUD === 'function') window.updateCharacterNameHUD();
    }
    // Waves +50%, Gegner kommen 20% schneller
  // Statt Spawnrate-Modifikation: globale Progression via Skalierung etwas erhöhen
  enemyScale.hp *= 1.10; // +10% zukünftige Basis-HP
  enemyScale.dmg *= 1.10; // +10% zukünftiger Basis-Schaden
  console.log('[Kristof] Niederlage -> zukünftige Gegner +10% HP & DMG (kumulativ)');
  }
  else if(e && e.type==='weaponOnly') { if(typeof addScore==='function') addScore('special'); }
  else if(e && e.elite) { if(typeof addScore==='function') addScore('elite'); }
  else { if(typeof addScore==='function') addScore('kill'); }
    if(typeof addScore==='function') {
      const ms = [5,10,20,30,50,100];
      if(ms.includes(player.level)) addScore('level', player.level);
    }
    let w = weapons[idx != null ? idx : player.weaponIndex];
    if(w && typeof addScore==='function') {
      const ms = [3,5,7,10];
      if(ms.includes(w.lvl+1)) addScore('weaponLevel', w.lvl+1);
    }
      if(!state.enemies[idx]) return;
      if(e && e.type === 'weaponOnly' && e.elite && !e.explodesOnTouch){
        player.eliteKillBuff = true;
        player.eliteKillBuffTimer = 5.0;
        buildUI();
        updateHUD();
        const allBaseMax = weapons.every(w => !w.kristof && w.lvl >= getWeaponLevelCap());
        if(allBaseMax && !state.bossAlive){
          setTimeout(()=>{ if(!state.bossAlive) spawnMetaBoss('weaponsMax'); }, 100);
        }
      }
  if(e && !e.boss && !e.bossMinion && !e._kristofTokenDropped) {
    const kristofDecrement = 1;
    state.kristofKillsLeft = Math.max(0, state.kristofKillsLeft - kristofDecrement);
    showKristofCounter();
    if(state.kristofKillsLeft === 0 && !state.enemies.some(en => en.boss && en.name === 'Kristof')) {
      const timeGateOk = (state.time >= (state.kristofMinTime||0));
      const killGateOk = (player.kills >= (state.kristofMinKills||0));
      if(!timeGateOk || !killGateOk){
        // Counter erreicht, aber Gate(s) nicht erfüllt -> Counter bleibt auf 0 stehen bis erfüllt
        if(!state._kristofGateLogOnce){
          state._kristofGateLogOnce = true;
          console.log('[Kristof][GateHold] Counter=0 aber Gates nicht erfüllt', {time: state.time.toFixed(1), timeGateOk, kills: player.kills, killGateOk, needTime: state.kristofMinTime, needKills: state.kristofMinKills});
        }
      } else if(!state._kristofSpawnQueued){
        state._kristofSpawnQueued = true;
        console.log('[Kristof][SpawnQueue] Bedingungen erfüllt (Counter + Gates). Spawne in 1.5s...');
        setTimeout(()=>{
          if(!state.enemies.some(en => en.boss && en.name === 'Kristof')){
            console.log('[Kristof][Spawn] Starte Spawn (Gates frei)');
            try { spawnKristof(); state.bossAlive = true; } catch(err){ console.warn('[Kristof][SpawnError]', err); }
          }
        }, 1500);
      }
    }
    e._kristofTokenDropped = true;
  }
  // Truhen-Drop prüfen
  maybeDropChest(e);
  // Direkter Drop der Feder der Wahrheit NUR von normalen Fernkampf-Gegnern (nicht Elite, nicht Boss)
  if(e && e.type === 'ranged' && !e.elite && !e.boss && !window.collectedLoot.find(l=>l.id==='truthfeather')) {
    // Skalierende Dropchance: Basis 0.01% (0.0001) + pro vollen 10er-Schritt im höchsten Waffenlevel +0.5 Prozentpunkte.
    // Beispiel: Lvl 0-9 => 0.01%, 10-19 => 0.51%, 20-29 => 1.01% usw.
    // Nutzerbeispiel nannte 1.1% bei Lvl 20 -> mathematisch wären es 1.01%; wir behalten hier die exakte Formel.
    if(!window.getTruthFeatherChance){
      window.getTruthFeatherChance = function(){
        // Ermittle höchstes aktuelles Waffenlevel (anstatt Summe) – progressionstreibend und klar.
        let highest = 0;
        try { if(Array.isArray(weapons)) for(const w of weapons){ if(w && typeof w.lvl==='number' && w.lvl>highest) highest = w.lvl; } } catch(_){ highest = 0; }
        const tiers = Math.floor(highest / 10); // 0 bei 0..9, 1 bei 10..19, 2 bei 20..29 ...
        const base = 0.0001;      // 0.01%
        const perTier = 0.005;    // +0.5 Prozentpunkte pro 10er Block
        let chance = base + tiers * perTier;
        // Cap exakt bei dem Wert, der bei Waffen-Max-Level (aktuell 30 => 3 Tiers) erreicht wird: 0.0001 + 3*0.005 = 0.0151 (1.51%)
        let maxCapLvl = 30;
        try { if(typeof getWeaponLevelCap === 'function') maxCapLvl = getWeaponLevelCap(); } catch(_){ /* fallback 30 */ }
        const maxTiers = Math.floor(maxCapLvl / 10);
        const CAP = base + maxTiers * perTier; // dynamisch falls später Cap erhöht wird
        if(chance > CAP) chance = CAP;
        return { chance, highest, tiers };
      }
    }
    const { chance: FEATHER_CHANCE, highest, tiers } = window.getTruthFeatherChance();
    if(Math.random() < FEATHER_CHANCE){
      dropLoot(e.x, e.y, 'truthfeather');
      console.log('[TruthFeather] Drop! Chance=', FEATHER_CHANCE.toFixed(6), 'highestWeaponLevel=', highest, 'tier=', tiers);
    } else if(!window._lastFeatherTierLogged || window._lastFeatherTierLogged !== tiers) {
      // Logge einmal wenn ein neuer Tier erreicht wurde, zur Transparenz beim Balancing
      window._lastFeatherTierLogged = tiers;
      console.log('[TruthFeather] Neuer Tier', tiers, 'highestWeaponLevel=', highest, 'aktuelle Chance=', FEATHER_CHANCE.toFixed(6));
    }
  }
  state.enemies.splice(idx,1);
  player.kills++;
  try{
    const idxForXP = (weaponIndexForXP != null) ? weaponIndexForXP : player.weaponIndex;
    if(window.TESTMODE) {
      let anyChanged = false;
      for (let w of weapons) {
        if (w.lvl < getWeaponLevelCap()) {
          w.lvl = getWeaponLevelCap();
          w.xp = 0;
          w.next = Math.max(w.next + 6, Math.floor(w.next * 1.25));
          if (w.onLevel) w.onLevel(w);
          if(!w.evolved && w.lvl>=w.evolveLevel){ if(w.evolve) w.evolve(w); }
          anyChanged = true;
        }
      }
      if (anyChanged) {
        buildUI();
        updateHUD();
        const allBaseMax = weapons.every(w => !w.kristof && w.lvl >= getWeaponLevelCap());
        if(allBaseMax && !state.bossAlive){
          setTimeout(()=>{ if(!state.bossAlive) spawnMetaBoss('weaponsMax'); }, 100);
        }
      }
    } else {
      const weaponXpBase = Math.max(1, Math.round(8 + player.level * 0.8));
      let wxp = weaponXpBase;
      if(e && e.type === 'weaponOnly') wxp = Math.round(weaponXpBase * 2.0);
      else if(e && e.boss) wxp = Math.round(weaponXpBase * 3.0);
      wxp = Math.max(1, Math.floor(wxp * 0.25));
      wxp = Math.round(wxp * 1.2); // +20% Waffen-XP
      addWeaponXP(idxForXP, wxp);
    }
  }catch(err){ /* safe guard */ }
  const baseAward = 14 + Math.random()*6 + player.level*1.4;
  let award = baseAward;
  if(e && e.boss) award = baseAward;
  else if(e && e.type === 'weaponOnly') award = Math.round(baseAward * 2.2);
  else award = Math.round(baseAward * 1.15);
  award = Math.round(award * 1.2); // +20% normale XP
  if(player.eliteKillBuff) award = Math.round(award * 1.15);
  console.log('[awardXP call]', 'award:', award, 'player:', player);
  awardXP(award);
      lifestealOnKill();

    if(e && e.boss){
        
        state.dead = false; state.bossAlive = false; state.autoWeaponSpin = false;
        for(let i=0;i<40;i++) particle(player.x + (Math.random()-0.5)*240, player.y + (Math.random()-0.5)*240, '#cccccc');


  state.metaStage = Math.min(MAX_META_STAGE, (state.metaStage||1) + 1);

  // Wellengröße nach jedem Kristof um 30% erhöhen
  state.spawnMultiplier = (state.spawnMultiplier || 1) * 1.3;
  // Gegner werden nach jedem Kristof um 20% stärker (HP und Schaden)
  // Multiplikator bleibt immer auf aktuellem Wert, wird weiter multipliziert
  if(!enemyScale) enemyScale = {hp:1, dmg:1};
  // Angepasste Skalierung: Kristof # Einfluss abmildern und early game langsamer
  const kristofsDown = (window.kristofBossDefeated||0);
  // Umkehr: Anfang stark, später schwächer -> Multiplikator sinkt nach Zeit & Kristof-Kills
  const t = state.time || 0; // Sekunden
  const timePhase = Math.min(1, t / 300); // nach 5 Min ausgesteuert
  const earlyBoostHp = 1.40; // starker Start
  const earlyBoostDmg = 1.30;
  // Lineare Interpolation hin zu 0.85 (HP) / 0.80 (DMG) am Ende der Kurve
  const lateFactorHp = 0.85;
  const lateFactorDmg = 0.80;
  const baseHpMul = earlyBoostHp + (lateFactorHp - earlyBoostHp) * timePhase;
  const baseDmgMul = earlyBoostDmg + (lateFactorDmg - earlyBoostDmg) * timePhase;
  // Zusätzlicher Absenker je Kristof-Kill
  const kristofDecayHp = 1 - Math.min(0.06 * (kristofsDown||0), 0.36); // max -36%
  const kristofDecayDmg = 1 - Math.min(0.055 * (kristofsDown||0), 0.33);
  enemyScale.hp = (enemyScale.hp || 1) * baseHpMul * kristofDecayHp;
  enemyScale.dmg = (enemyScale.dmg || 1) * baseDmgMul * kristofDecayDmg;

        if(state.metaStage >= MAX_META_STAGE){
          state.running = false; state.dead = true; state.bossAlive = false;
          const panel = document.createElement('div'); panel.className = 'panel'; panel.innerHTML = `<h1>Spiel geschafft!</h1><p>Du hast Meta-Stufe ${state.metaStage} besiegt — das Spiel ist gewonnen.</p><div class="btns"><button id="restartWin">Nochmal spielen</button></div>`;
          const overlay = document.createElement('div'); overlay.className = 'overlay show'; overlay.appendChild(panel); document.body.appendChild(overlay);
          document.getElementById('restartWin').onclick = ()=>{ overlay.remove(); restart(); };
          return;
        }

  // Kristof besiegt: Counter wird jedes Mal um 100 erhöht
  state.kristofKillsLeft = (state.kristofKillsLeft || 0) + 100;
  // Im Testmodus auch das Levelcap erhöhen (korrekt zählen)
  if(window.TESTMODE) {
    window.kristofKillsTestmode = (typeof window.kristofKillsTestmode === 'number' ? window.kristofKillsTestmode : 0) + 1;
    // Waffenlevel einzeln hochzählen, damit alle Upgrades/Effekte ausgelöst werden
    const newCap = 10 + window.kristofKillsTestmode * 5;
    weapons.forEach(w => {
      while(w.lvl < newCap) {
        w.lvl++;
        if(w.lvl === w.evolveLevel && typeof w.evolve === 'function' && !w.evolved) w.evolve(w);
        if(w.lvl > 10 && w.lvl % 10 === 0 && typeof w.onUpgrade === 'function') w.onUpgrade(w, w.lvl);
        if(typeof w.onLevel === 'function') w.onLevel(w);
      }
      w.next = XP_PER_LEVEL + Math.floor(w.lvl*2.5);
    });
  }

  // Entfernt: Zurücksetzen des spawnMultiplier (wird nicht mehr benötigt)
  // Post-Kristof globale Skalierung etwas abflachen
  // Nach Kristof weitere Abschwächung statt Verstärkung
  enemyScale.hp *= 0.93;
  enemyScale.dmg *= 0.92;
        weapons.forEach(w=>{ w.next = XP_PER_LEVEL; w.lvl = Math.min(w.lvl, getWeaponLevelCap()); });
        buildUI(); updateHUD();

        state.running = true;
        buildUI(); updateHUD();
  // Nach Kristof NICHT mehr Speed oder Damage (inkl. Boss-DMG-Multiplikator) zurücksetzen.
  // Ursprünglich wurde hier _bossFightBonus und bossDamageMul auf 1.0 gesetzt.
  // Das entfernen wir, damit angesammelte Werte erhalten bleiben.
  // if(player._bossFightBonus){ player._bossFightBonus = 1.0; player.bossDamageMul = 1.0; }
        state.spawnInterval = 1.4;
        return;
      }

  if(e.elite){
  const drops = 2 + (Math.random()<0.4?1:0);
  for(let n=0;n<drops;n++){
  }
      } else {

      }



      
      if(e && e.type === 'weaponOnly' && state.bossAlive){
        
    player._bossFightBonus = (player._bossFightBonus || 1.0) * 1.015;
    player.bossDamageMul = player._bossFightBonus;
  for(let i=0;i<8;i++) particle(player.x + (Math.random()-0.5)*60, player.y + (Math.random()-0.5)*60, '#cccccc');
      }
    }

  function explode(x,y,r,dmg,weaponIndex){
    // Robust explosive AoE: guard against undefined enemies during concurrent mutations
    try {
      for(let i=0;i<14;i++) particle(x,y,'#cccccc');
      if(!state.enemies || !Array.isArray(state.enemies) || state.enemies.length===0) return;
      for(let j=state.enemies.length-1;j>=0;j--){
        const e = state.enemies[j];
        if(!e || typeof e.x!== 'number' || typeof e.y!=='number') continue; // skip holes / invalid
        const er = (e.r||0);
        const d = Math.hypot(e.x - x, e.y - y);
        if(d < r + er){
          const dealt = dmg * (1 - d / (r + er));
          let finalExpl = dealt * (e.boss ? (player.bossDamageMul||1) : 1);
          if(e.boss && e.dmgReduction) finalExpl *= (1 - e.dmgReduction);
          if(e.name === 'Kristof' && e.playerDamageReduction) finalExpl *= (1 - e.playerDamageReduction);
          e.hp -= finalExpl;
          if(typeof window.addDamageFloater==='function'){
            window.addDamageFloater({x:e.x, y:e.y-(e.r||24), amount:finalExpl, type:'basic'});
          }
          if(e.hp <= 0){
            if(e.boss) handleBossPhaseAfterDamage(e, j); else killEnemy(j, e);
          }
        }
      }
    } catch(err){
      if(!window.__explodeErrorLogged){
        console.warn('[explode] error suppressed:', err);
        window.__explodeErrorLogged = true; // log only once to avoid spam
      }
    }
  }

    const phase_count = 5;
let current_phase = 1;
const phase_hp = [100, 100, 100, 100, 100];
let current_hp = phase_hp[0];

    function step(dt){
      // --- Minute-basierte Skalierung (Progression) ---
      try {
        const cfg = window.enemyScalingConfig;
        if(cfg){
          window.__enemyScaleLastMinuteCheck = window.__enemyScaleLastMinuteCheck || 0;
          const curMin = Math.floor(state.time/60);
          if(curMin > window.__enemyScaleLastMinuteCheck){
            const diff = curMin - window.__enemyScaleLastMinuteCheck;
            window.__enemyScaleLastMinuteCheck = curMin;
            // Multiplikative Erhöhung für jede verstrichene Minute (falls mehrere übersprungen wurden beim Pause etc.)
            const hpMul = Math.pow(1+cfg.hpProgressionPerMinute, diff);
            const dmgMul = Math.pow(1+cfg.dmgProgressionPerMinute, diff);
            enemyScale.hp *= hpMul;
            if(cfg.enableDmgProgression) enemyScale.dmg *= dmgMul;
            if(cfg.logSpawns) console.log('[EnemyScaling][MinuteTick]', {minute: curMin, diff, hpMul: hpMul.toFixed(3), dmgMul: dmgMul.toFixed(3), newHpScale: enemyScale.hp.toFixed(3), newDmgScale: enemyScale.dmg.toFixed(3)});
          }
        }
      } catch(err){ console.warn('[EnemyScaling][MinuteTick][Error]', err); }
      // --- Meteor Update ---
      try {
        const m = window.staffMeteor;
        if(m){
          if(m.timer>0){ m.timer -= dt; if(m.timer<0) m.timer=0; }
          if(m.targeting){ m.targetX = mouseX; m.targetY = mouseY; }
          if(m.summonActive && m.targeting && (m.state==='idle' || m.state==='windup')){
            // Während Beschwörung über Spieler laufen lassen
            m.summonT += dt;
            // Fallback: Falls state versehentlich idle geblieben ist -> windup restaurieren
            if(m.state==='idle'){ m.state='windup'; m.windupT = m.summonT; }
            // Summon Partikel erzeugen & updaten
            try {
              const rate = (m.summonParticleRate||0) * (m.summonParticleScale||1);
              const spawnNeed = rate * dt;
              m._summonSpawnAcc = (m._summonSpawnAcc||0) + spawnNeed;
              const cx = player.x; const cy = player.y - player.r*0.4;
              const drawR = m.radius * 1.9; // wie in drawMeteor
              while(m._summonSpawnAcc >= 1){
                m._summonSpawnAcc -= 1;
                const px = cx + (Math.random()-0.5) * (m.summonParticleJitterX||24);
                const py = cy + (Math.random()*drawR*0.15) - drawR*0.05;
                const life = (m.summonParticleLife||0.6) * (0.7 + Math.random()*0.6);
                const vy = (m.summonParticleRise||120) * (0.85 + Math.random()*0.3);
                const vx = (Math.random()-0.5) * 18;
                const rad = 4 + Math.random()*8;
                const shade = Math.random();
                m.summonParticles.push({x:px,y:py,vx,vy,t:0,life,rad,shade});
              }
              for(let i=m.summonParticles.length-1;i>=0;i--){
                const p = m.summonParticles[i];
                p.t += dt;
                p.y -= p.vy * dt;
                p.x += p.vx * dt * 0.5;
                p.rad *= (1 + 0.4*dt);
                if(p.t >= p.life) m.summonParticles.splice(i,1);
              }
            } catch(ex){ /* ignore summon particle errors */ }
            // Frames bleiben 0..2 (loopt falls summonLoop)
          } else if(m.state === 'windup'){
            m.windupT += dt;
            if(!m._dbgLoggedWindup){ console.log('[Meteor][update] windup ticking'); m._dbgLoggedWindup=true; }
            // Pull Bewegung anwenden
            if(m.pullActive && m.pullCaptured && m.pullCaptured.length){
              const prog = Math.min(1, m.windupT / m.windup);
              const ease = Math.pow(prog, m.pullEasePow||2.2);
              for(let i=m.pullCaptured.length-1;i>=0;i--){
                const obj = m.pullCaptured[i]; const e = obj.e; if(!e || e.hp<=0){ m.pullCaptured.splice(i,1); continue; }
                // Zielpunkt etwas oszillierend für lebendigeren Effekt
                const tx = m.targetX + Math.sin(prog*6 + i)*8*(1-prog);
                const ty = m.targetY + Math.cos(prog*5 + i)*8*(1-prog);
                e.x = obj.startX + (tx - obj.startX) * ease;
                e.y = obj.startY + (ty - obj.startY) * ease;
                if(m.pullSpiral){
                  const spin = (1 - prog) * 3.5 * Math.PI;
                  const off = (1 - prog) * 32;
                  e.x += Math.cos(spin + i)*off*0.12;
                  e.y += Math.sin(spin + i)*off*0.12;
                }
                if(Math.random() < 0.18){
                  particle(e.x + (Math.random()-0.5)*6, e.y + (Math.random()-0.5)*6, 'rgba(200,100,255,0.45)');
                }
              }
            }
            if(m.windupT >= m.windup){
              m.state='impact';
              m.animT = 0;
              // Pull bleibt logisch aktiv als "Hold" bis Schaden durch ist
              m.pullActive = true; // jetzt Hold-Phase
              console.log('[Meteor][update] IMPACT start (Hold-Phase)');
              // Vor-Impact Partikel
              for(let i=0;i<28;i++){
                const a = Math.random()*Math.PI*2;
                const r = Math.random()*m.radius*0.35;
                particle(m.targetX + Math.cos(a)*r, m.targetY + Math.sin(a)*r, 'rgba(255,210,120,0.85)');
              }
            }
          } else if(m.state === 'impact'){
            m.animT += dt;
            const delayFrac = typeof m.impactDelayFrac==='number'? m.impactDelayFrac : 0.5;
            // Halte Gegner im Zentrum bis Schaden ausgelöst (sanftes Re-Einziehen + Dämpfung)
            if(m.pullActive && !m.impactDone && m.pullCaptured && m.pullCaptured.length){
              const holdProg = Math.min(1, m.animT / (m.animDur * delayFrac));
              for(let i=m.pullCaptured.length-1;i>=0;i--){
                const obj = m.pullCaptured[i]; const e = obj.e; if(!e || e.hp<=0){ m.pullCaptured.splice(i,1); continue; }
                // Ziehe leicht Richtung Mitte, skaliere Distanz herunter
                const dx = m.targetX - e.x; const dy = m.targetY - e.y;
                e.x += dx * 2.2 * dt; // sanftes zentrieren
                e.y += dy * 2.2 * dt;
                // Minimale zufällige Zitterbewegung für Effekt
                e.x += (Math.random()-0.5) * 6 * (1-holdProg);
                e.y += (Math.random()-0.5) * 6 * (1-holdProg);
                if(Math.random()<0.12){ particle(e.x+(Math.random()-0.5)*4, e.y+(Math.random()-0.5)*4, 'rgba(140,80,255,0.35)'); }
              }
            }
            if(!m.impactDone && m.animT >= m.animDur * delayFrac){
              if(!window.player){ m.state='done'; return; }
              m.impactDone = true;
              console.log('[Meteor][update] DELAY REACHED -> DEAL DAMAGE (t='+m.animT.toFixed(2)+'/'+m.animDur+')');
              // Kern-Schock Partikel beim tatsächlichen Schaden
              for(let i=0;i<36;i++){
                const a=Math.random()*Math.PI*2; const r=Math.random()*m.radius*0.55;
                particle(m.targetX+Math.cos(a)*r, m.targetY+Math.sin(a)*r, 'rgba(255,160,70,'+(0.35+Math.random()*0.5)+')');
              }
              const baseDmg = player.dmg * (buffs.dmg||1) * m.dmgMul;
              const r2 = m.radius*m.radius;
              for(let i=state.enemies.length-1;i>=0;i--){
                const e = state.enemies[i];
                const dx = e.x - m.targetX; const dy = e.y - m.targetY; const d2 = dx*dx+dy*dy; if(d2>r2) continue;
                const dist = Math.sqrt(d2);
                let dmg = baseDmg * (e.boss ? (player.bossDamageMul||1) : 1);
                const falloff = 0.55 + 0.45*(1 - dist/m.radius);
                dmg *= falloff;
                // 20% mehr Schaden falls bereits verwundbar
                if(e.vulnUntil && (state.time||0) < e.vulnUntil) dmg *= 1.2;
                if(e.elite || e.boss){ dmg *= (1 + (m.eliteBossBonus||0)); }
                e.hp -= dmg;
                if(typeof window.addDamageFloater==='function'){ window.addDamageFloater({x:e.x, y:e.y-(e.r||24), amount:dmg, type:'basic'}); }
                // Debuffs: Stun (1s) außer Boss, Vulnerability 5s (refresh, nicht stackbar)
                const now = state.time||0;
                if(!e.boss){ e.stunUntil = Math.max(e.stunUntil||0, now + 1.0); }
                e.vulnUntil = Math.max(e.vulnUntil||0, now + 5.0);
                for(let p=0;p<12;p++) particle(e.x,e.y,'#ffb05a');
                if(e.hp<=0){ if(e.boss) handleBossPhaseAfterDamage(e,i); else killEnemy(i,e); }
              }
              // Hold Phase beenden nach Schaden
              m.pullActive = false;
              if(m.pullCaptured) m.pullCaptured.length = 0;
            }
            if(m.animT >= m.animDur){ m.state='done'; }
            // Flash Effekt langsam abbauen
            if(m.summonBeamFlash>0){
              m.summonBeamFlash -= (m.summonBeamFlashDecay||2.5) * dt;
              if(m.summonBeamFlash < 0) m.summonBeamFlash = 0;
            }
          } else if(m.state === 'done'){
            m.state='idle'; m.animT = 0;
            m._dbgLoggedWindup = false;
          }
        }
      } catch(err){ console.warn('[Meteor][UpdateError]', err); }
      // --- Curse Update ---
      try {
        const c = window.curseSkill; if(c){
          if(c.timer>0){ c.timer -= dt; if(c.timer<0) c.timer=0; }
          if(c.targeting){ c.targetX = mouseX; c.targetY = mouseY; }
          if(c.state==='windup'){
            c.windupT += dt;
            if(c.pullActive && c.pullCaptured.length){
              const prog = Math.min(1, c.windupT / c.windup);
              const ease = Math.pow(prog, c.pullEasePow||2.0);
              for(let i=c.pullCaptured.length-1;i>=0;i--){
                const obj = c.pullCaptured[i]; const e=obj.e; if(!e || e.hp<=0){ c.pullCaptured.splice(i,1); continue; }
                const tx = c.targetX; const ty = c.targetY;
                e.x = obj.startX + (tx - obj.startX)*ease;
                e.y = obj.startY + (ty - obj.startY)*ease;
                if(Math.random()<0.12) particle(e.x+(Math.random()-0.5)*4, e.y+(Math.random()-0.5)*4, 'rgba(160,80,255,0.35)');
              }
            }
            if(c.windupT >= c.windup){
              c.state='impact'; c.animT=0; // Hold bis Schaden
              console.log('[Curse] IMPACT start');
            }
          } else if(c.state==='impact'){
            // Impact Phase wird jetzt zu einer Zone-Aktivierung ohne Schaden
            if(!c.zoneActive){
              c.zoneActive = true; c.zoneT = 0; c.animT = 0; c.impactDone = true; // impactDone damit alter Pfad nicht erneut triggert
            }
            // Laufzeit der Zone
            c.zoneT += dt;
            const r2 = c.radius * c.radius;
            // Kontinuierlicher Zug + Slow für alle Gegner im Radius
            for(const e of state.enemies){
              if(e.hp<=0) continue;
              const dx = c.targetX - e.x; const dy = c.targetY - e.y; const d2 = dx*dx+dy*dy; if(d2>r2) continue;
              // Inward Pull (leicht, damit nicht instant Zentrum)
              const dist = Math.sqrt(d2)||1;
              const pullStrength = 140; // Pixel pro Sek in Richtung Zentrum
              const vx = (dx/dist) * pullStrength * dt;
              const vy = (dy/dist) * pullStrength * dt;
              e.x += vx; e.y += vy;
              // Slow anwenden / verlängern
              const now = state.time||0;
              e.slowUntil = Math.max(e.slowUntil||0, now + c.slowDuration);
              e.slowFactor = Math.min(e.slowFactor||1, c.slowFactor); // niedrigster Wert gewinnt
              if(Math.random()<0.10) particle(e.x+(Math.random()-0.5)*6, e.y+(Math.random()-0.5)*6, 'rgba(120,60,220,0.45)');
            }
            if(c.zoneT >= c.zoneDuration){
              c.zoneActive=false; c.state='done';
            }
          } else if(c.state==='done'){
            c.state='idle'; c.animT=0; c.windupT=0; c._dbgLoggedWindup=false; c.impactDone=false;
          }
        }
      } catch(err){ console.warn('[Curse][UpdateError]', err); }
      // --- Feuerfeld Update (Tick & Slow Integration) ---
      try {
        if(window.fireField && window.fireField.active){
          if(typeof window.updateFireField === 'function'){
            window.updateFireField(performance.now()/1000);
          } else if(!window.__fireFieldFnMissingLogged){
            console.warn('[FireField] updateFireField nicht verfügbar');
            window.__fireFieldFnMissingLogged = true;
          }
        }
      } catch(err){ if(!window.__fireFieldErrOnce){ console.warn('[FireField][UpdateError]', err); window.__fireFieldErrOnce=true; } }
  // Jump Update
  updatePlayerJump(dt);
  if(typeof updatePlayerDash==='function') updatePlayerDash(dt);
  // updateSwordSpin entfernt (Spin deaktiviert)
      // Boss Test Modus: Erzwinge hohen Schaden (Basis 100) dauerhaft
      if(TESTMODE_BOSS && typeof player !== 'undefined') {
        const targetBase = 400; // erhöht für Testmodus
        if(player.baseDamage == null || player.baseDamage < targetBase) player.baseDamage = targetBase;
        if(player.damagePerLevel != null) {
          const desired = player.baseDamage + (player.level - 1) * player.damagePerLevel;
          if(player.dmg < desired) player.dmg = desired;
        } else if(player.dmg < targetBase) {
          player.dmg = targetBase;
        }
      }
  // Testmodus: Logge Boss-Schaden, Debuffs, DoTs in die Konsole
  // Update dagger DoT ticks for all enemies
  updateDaggerDots(dt);
  // Kristof-spezifische Schadens- & Phasenlogik unabhängig von Position im enemies-Array
  if(state.kristof){
    const k = state.kristof;
    if(!state.enemies.includes(k) && k.hp>0){
      console.warn('[Kristof] Fallback: fehlte in enemies[], füge wieder hinzu');
      state.enemies.push(k);
    }
    if(typeof k._lastHp !== 'number') k._lastHp = k.hp;
  if(k.hp < k._lastHp){
      let incoming = k._lastHp - k.hp;
      let absorbed = 0;
      // Schild zuerst verrechnen, damit Phasen-Trigger nicht rückgängig gemacht werden
      if(incoming > 0 && k.absorbShieldHP > 0){
        if(k.invulnerable){
          // kompletter Schaden negiert
          k.hp = k._lastHp; incoming = 0;
        } else {
          if(k.absorbShieldHP >= incoming){
            k.absorbShieldHP -= incoming; absorbed = incoming; incoming = 0; k.hp = k._lastHp; // HP bleibt gleich
          } else {
            absorbed = k.absorbShieldHP; incoming -= k.absorbShieldHP; k.absorbShieldHP = 0; k.absorbShields = 0; k.hp = k._lastHp - incoming; console.log('[Kristof] Schild zerstört');
          }
        }
      }
      if(k.invulnerable && incoming > 0){
        // während Invuln kein HP-Verlust
        k.hp = k._lastHp; incoming = 0;
      }
      // Caps (nach Schild + Invuln) anwenden
      if(incoming > 0){
        const stCap = k.shockwaveState;
        if(stCap && !stCap.phase80Done){
          const capHp = Math.ceil(k.maxHp * 0.80);
            if(k.hp < capHp){ k.hp = capHp; }
        } else if(stCap && stCap.phase80Done && !stCap.phase40Done){
          const capHp2 = Math.ceil(k.maxHp * 0.40);
            if(k.hp < capHp2){ k.hp = capHp2; }
        }
      }
      const finalLoss = k._lastHp - k.hp;
      if(finalLoss>0 || absorbed>0){
        console.log(`[Kristof-Debug] Schaden eingehend=${(incoming+absorbed).toFixed(1)} absorbiert=${absorbed.toFixed(1)} realHPVerlust=${finalLoss.toFixed(1)} -> ${(k.hp/k.maxHp*100).toFixed(1)}%`);
      }
      // Threshold-Check nur wenn realer HP-Verlust stattfand
      if(finalLoss>0 && k.shockwaveState && !k.shockwaveState.movingToCenter && !k.shockwaveState.active && !k.shockwaveState.telegraphing){
        const refMax = k.shockwaveState.maxHpRef || k.maxHp;
        const hpPct = k.hp / refMax;
        if(!k.shockwaveState.triggered80 && hpPct <= 0.80){
          k.shockwaveState.triggered80 = true; kristofStartShockSequence(k);
        } else if(!k.shockwaveState.triggered40 && hpPct <= 0.40){
          k.shockwaveState.triggered40 = true; kristofStartShockSequence(k);
        }
      }
    }
    // Sicherstellen dass _lastHp nicht unter HP fällt (keine doppelten Verluste)
    if(k.invulnerable && k.hp < k._lastHp){ k.hp = k._lastHp; }
    k._lastHp = k.hp;
    // Frame-basierter Fallback: falls durch hohen Burst direkt unter 40% gefallen und 2. Phase noch nicht getriggert
    const st = k.shockwaveState;
    if(st && !st.movingToCenter && !st.active && !st.telegraphing){
      const refMax2 = st.maxHpRef || k.maxHp;
      const hpPct2 = k.hp / refMax2;
      if(!st.triggered80 && hpPct2 <= 0.80){
        st.triggered80 = true; kristofStartShockSequence(k);
      } else if(st.triggered80 && !st.triggered40 && hpPct2 <= 0.40){
        st.triggered40 = true; kristofStartShockSequence(k);
      } else if(!st.triggered80 && hpPct2 <= 0.40){
        // Direkt unter 40% gefallen: erst 80%-Phase erzwingen, 40% Phase danach
        st.triggered80 = true; kristofStartShockSequence(k);
        st._needsSecondAfterFirst = true; // Marker für nachträgliche 40%-Phase
      }
    }
    // Nach Ende der ersten Sequenz sofort zweite starten falls Marker gesetzt & HP <=40
    if(st && st._needsSecondAfterFirst && !st.active && !st.movingToCenter && !st.telegraphing && !k.invulnerable){
      if(k.hp / (st.maxHpRef||k.maxHp) <= 0.40){
        st._needsSecondAfterFirst = false;
        if(!st.triggered40){ st.triggered40 = true; kristofStartShockSequence(k); }
      }
    }
  }
  // Kristof Center-Move & Telegraph direkt hier (statt gepatchtes global update nutzen)
  if(state.kristof && state.kristof.shockwaveState){
    const k = state.kristof; const st = k.shockwaveState;
  kristofCheckMidHP(k);
    if(st.movingToCenter){
      const tx = st.targetX, ty = st.targetY; if(typeof tx==='number' && typeof ty==='number'){
        const dx = tx - k.x, dy = ty - k.y; const dist = Math.hypot(dx,dy)||1;
  // Schnellerer Run zur Mitte: Basis * 2.1 + leichte Beschleunigung je Distanz
  const centerSpeed = (k.speed||90) * 2.1;
  const accel = Math.min(2.5, dist / 240); // etwas mehr Schub wenn weit weg
  const mv = Math.min(dist, centerSpeed * (1+accel*0.4) * dt);
        k.x += dx/dist * mv; k.y += dy/dist * mv;
        if(!st._debugMoveLog){ console.log('[Kristof] move tick', Math.round(k.x), Math.round(k.y), 'dist', Math.round(dist)); st._debugMoveLog=true; }
        if(dist < 10){
          if(KRISTOF_CENTER_LOCK){ k.x = tx; k.y = ty; k.vx = 0; k.vy = 0; }
          kristofBeginWaves(k);
        }
      }
      k.radialTimer = Math.max(k.radialTimer, 0.25);
    }
    if(st.telegraphing && state.time >= st.telegraphUntil){
      st.telegraphing = false;
    }
    // Center-Lock aktiv halten
    if(KRISTOF_CENTER_LOCK && !st.centerReleased && !st.movingToCenter && (st.active || st.telegraphing)){
      if(st.targetX && st.targetY){ k.x = st.targetX; k.y = st.targetY; k.vx=0; k.vy=0; }
    }
    // Invuln Timer runterzählen
    if(st.invulnTimer!=null && st.invulnTimer>0){
      st.invulnTimer -= dt;
      if(st.invulnTimer<=0){ st.invulnTimer=0; }
    }
    // Ende der Sequenz -> Verwundbarkeit zurück & wieder bewegen
    if(!st.active && !st.movingToCenter && !st.telegraphing && k.invulnerable && st.invulnTimer===0){
      k.invulnerable = false;
      // Markiere welche Phase beendet wurde
      if(st.triggered80 && !st.phase80Done && !st.triggered40){ st.phase80Done = true; }
      if(st.triggered40 && !st.phase40Done){ st.phase40Done = true; }
      st.centerReleased = true;
      k._resumeChase = true;
      // Kleiner kurzer Speed-Burst nach Phase, fällt weich zurück
      k._phaseChaseBoost = 1.25; // +25% Anfang
      k._phaseChaseBoostTimer = 2.4; // über ~2.4s auf 1.0 runterblenden
      console.log('[Kristof] PhaseEnd', {gen: st._gen, phase80Done: st.phase80Done, phase40Done: st.phase40Done, hpPct: (k.hp/k.maxHp).toFixed(3)});
    }
    // Einfaches Follow nach Ende
    if(st.centerReleased && k._resumeChase && player){
      const dx = player.x - k.x; const dy = player.y - k.y; const d = Math.hypot(dx,dy)||1;
      let sp = k.speed || 90;
      if(k._phaseChaseBoostTimer && k._phaseChaseBoostTimer>0){
        k._phaseChaseBoostTimer -= dt;
        if(k._phaseChaseBoostTimer < 0) k._phaseChaseBoostTimer = 0;
        const t = 1 - (k._phaseChaseBoostTimer / 2.4); // 0 -> 1
        const curBoost = 1 + ( (k._phaseChaseBoost||1) - 1 ) * (1 - t); // linear blend zurück nach 1
        sp *= curBoost;
        if(k._phaseChaseBoostTimer===0){ k._phaseChaseBoost = 1; }
      }
      k.x += (dx/d) * sp * dt;
      k.y += (dy/d) * sp * dt;
    }
  }
  // Feder der Wahrheit Projektil (alle 3s) -> schießt auf normalen Fernkampf-Gegner
  if(window.collectedLoot && window.collectedLoot.find(l=>l.id==='truthfeather')) {
    window.truthFeatherShotTimer = (window.truthFeatherShotTimer||0) + dt;
    const FEATHER_INTERVAL = 3.0;
    if(window.truthFeatherShotTimer >= FEATHER_INTERVAL) {
      window.truthFeatherShotTimer -= FEATHER_INTERVAL;
      let target=null, bestD=1e9;
      for(const e of state.enemies){
        if(e && e.type==='ranged' && !e.elite && !e.boss && e.hp>0){
          const d = Math.hypot(e.x-player.x, e.y-player.y);
          if(d < bestD){ bestD = d; target = e; }
        }
      }
      if(target){
        const ang = Math.atan2(target.y-player.y, target.x-player.x);
        const sp = 420;
        const proj = { x:player.x, y:player.y, vx:Math.cos(ang)*sp, vy:Math.sin(ang)*sp, r:10, color:'#ffe600', dmg: Math.max(5, target.hp*5), range:820, traveled:0, pierce:0, explode:0, trail:[], weaponIndex:null, ricochet:0, type:'truthFeather' };
        state.projectiles.push(proj);
      }
    }
  }
      // Dolch-DoT-Projektil-Logik (Pierce-Version)
      for(let i=state.projectiles.length-1;i>=0;i--){
        const p=state.projectiles[i];
        if(p.type==='daggerDotPierce'){
          p.x += p.vx*dt;
          p.y += p.vy*dt;
          p.traveled += Math.hypot(p.vx*dt, p.vy*dt);
          for(const e of state.enemies){
            if(e && e.hp>0 && !p.hitEnemies.has(e) && Math.hypot(e.x-p.x, e.y-p.y) < e.r + p.r){
              // DoT setzen, aber nur wenn keiner aktiv ist oder abgelaufen
              // Mehrfach-Stapelbar bis 3 Stacks; jeder neue Stack eigene Instanz
              const maxStacks = 3;
              if(!e.daggerDot || !Array.isArray(e.daggerDot.stacks)){
                // Falls alter Single-DoT existiert, in neues System überführen
                if(e.daggerDot && e.daggerDot.active){
                  e.daggerDot = { stacks: [ { t:e.daggerDot.t||0, dur:e.daggerDot.dur||5, dmg:e.daggerDot.dmg||1 } ], max: maxStacks };
                } else {
                  e.daggerDot = { stacks: [], max: maxStacks };
                }
              }
              if(e.daggerDot.stacks.length < maxStacks){
                let baseDmg = Math.max(1, Math.round(e.maxHp * 0.12)); // Basis leicht erhöht (12% HP pro Stack über 5s)
                if(p.dotDmgBonus) baseDmg = Math.round(baseDmg * p.dotDmgBonus);
                if(e.boss) baseDmg = Math.round(baseDmg * 0.55); // geringere Effektivität auf Boss
                e.daggerDot.stacks.push({ t:0, dur:5.0, dmg: baseDmg });
                for(let j=0;j<10;j++) particle(e.x + (Math.random()-0.5)*e.r*1.25, e.y + (Math.random()-0.5)*e.r*1.25, 'rgba(80,255,80,0.10)');
              } else {
                // Erneuere den ältesten Stack (Refresh für bessere Konsistenz)
                let oldest = e.daggerDot.stacks[0];
                for(const st of e.daggerDot.stacks){ if(st.t > oldest.t) oldest = st; }
                oldest.t = 0; // reset Zeit
                for(let j=0;j<4;j++) particle(e.x + (Math.random()-0.5)*e.r*1.1, e.y + (Math.random()-0.5)*e.r*1.1, 'rgba(60,200,60,0.08)');
              }
              p.hitEnemies.add(e);
            }
          }
          if(p.traveled > p.range){
            state.projectiles.splice(i,1);
            continue;
          }
        }
      }
      // Dolch-DoT-Projektil-Logik
      for(let i=state.projectiles.length-1;i>=0;i--){
        const p=state.projectiles[i];
        if(p.type==='daggerDot' && !p.hit){
          p.x += p.vx*dt;
          p.y += p.vy*dt;
          p.traveled += Math.hypot(p.vx*dt, p.vy*dt);
          // Gegner-Kollision
          for(const e of state.enemies){
            if(e && e.hp>0 && Math.hypot(e.x-p.x, e.y-p.y) < e.r + p.r){
              // DoT setzen, aber nur wenn keiner aktiv ist oder abgelaufen
              // Basis-Version: auch stapelbar bis 3 (gleiche Struktur)
              const maxStacks = 3;
              if(!e.daggerDot || !Array.isArray(e.daggerDot.stacks)){
                if(e.daggerDot && e.daggerDot.active){
                  e.daggerDot = { stacks: [ { t:e.daggerDot.t||0, dur:e.daggerDot.dur||5, dmg:e.daggerDot.dmg||1 } ], max: maxStacks };
                } else {
                  e.daggerDot = { stacks: [], max: maxStacks };
                }
              }
              if(e.daggerDot.stacks.length < maxStacks){
                let baseDmg = Math.max(1, Math.round(e.maxHp * 0.08)); // Normaler Treiber: 8% HP pro Stack
                if(e.boss) baseDmg = Math.round(baseDmg * 0.50);
                e.daggerDot.stacks.push({ t:0, dur:5.0, dmg: baseDmg });
                for(let j=0;j<8;j++) particle(e.x + (Math.random()-0.5)*e.r*1.15, e.y + (Math.random()-0.5)*e.r*1.15, 'rgba(80,255,80,0.09)');
              } else {
                let oldest = e.daggerDot.stacks[0];
                for(const st of e.daggerDot.stacks){ if(st.t > oldest.t) oldest = st; }
                oldest.t = 0;
                for(let j=0;j<3;j++) particle(e.x + (Math.random()-0.5)*e.r, e.y + (Math.random()-0.5)*e.r, 'rgba(60,180,60,0.08)');
              }
              p.hit = true;
              break;
            }
          }
          // Reichweite überschritten oder getroffen
          if(p.traveled > p.range || p.hit){
            state.projectiles.splice(i,1);
            continue;
          }
        }
      }
      
      if(kristofEventTextTimer > 0) {
        kristofEventTextTimer -= dt;
        if(typeof ctx !== 'undefined') {
          ctx.save();
          ctx.globalAlpha = Math.min(1, kristofEventTextTimer/0.4);
          ctx.font = 'bold 64px Arial';
          ctx.fillStyle = '#ff2222';
          ctx.textAlign = 'center';
          ctx.fillText('STIRB!', innerWidth/2, innerHeight/2 - 120);
          ctx.restore();
        }
      }
  updatePlayerVelocity();
  // stepBullyAura entfernt
      state.time+=dt; if(player.iFrames>0) player.iFrames-=dt; if(player.cooldown>0) player.cooldown-=dt;
  if(typeof updatePlayerDash==='function') updatePlayerDash(dt);
  updateActionKeyUI(dt);
  // (Auto Dagger Execution entfernt: jetzt nur noch manuell per R)

      // --- Halberd Charge Update & Movement Slow ---
      const hu = window.halberdUlt;
      if(hu){
        // Cooldown countdown
        if(hu.state==='cooldown'){
          hu.timer -= dt; if(hu.timer<=0){ hu.timer=0; hu.state='idle'; }
        } else if(hu.state==='charging'){
          hu.chargeTime = (performance.now() - hu.chargeStart)/1000;
          if(hu.chargeTime >= hu.maxCharge){
            hu.chargeTime = hu.maxCharge;
            // auto-release when fully charged
            if(!hu._autoReleased){ hu._autoReleased=true; releaseHalberdCharge(); }
          }
        }
      }
      let dx=0,dy=0; if(keys.has('w')||keys.has('arrowup')) dy-=1; if(keys.has('s')||keys.has('arrowdown')) dy+=1; if(keys.has('a')||keys.has('arrowleft')) dx-=1; if(keys.has('d')||keys.has('arrowright')) dx+=1;
      const len=Math.hypot(dx,dy)||1;
      let speed=player.speed*(buffs.speed||1)*(player.iFrames>0?0.85:1);
      if(hu && hu.state==='charging') speed*=hu.slowFactor; // heavy slow while charging
      player.x=Math.max(12,Math.min(innerWidth-12, player.x + (dx/len)*speed*dt)); player.y=Math.max(12,Math.min(innerHeight-12, player.y + (dy/len)*speed*dt));
      if(mouseDown) triggerAttack();

      // --- Halberd Charge Pull (leichter Sog) ---
      if(hu && hu.state==='charging' && hu.pullEnabled){
        const pct = Math.min(1, hu.chargeTime / hu.maxCharge);
        const pullR = hu.pullRadiusBase + (hu.pullRadiusMax - hu.pullRadiusBase) * pct;
        const force = hu.pullForceBase + (hu.pullForceMax - hu.pullForceBase) * pct;
        const pullR2 = pullR * pullR;
        for(const e of state.enemies){
          if(!e || e.hp<=0) continue;
          if(e.boss) { var fFactor = hu.pullBossFactor; }
          else if(e.elite) { var fFactor = hu.pullEliteFactor; }
          else { var fFactor = 1; }
          if(fFactor <= 0) continue;
          const dx = player.x - e.x; const dy = player.y - e.y; const d2 = dx*dx + dy*dy;
          if(d2 > pullR2 || d2 < 4) continue;
          const d = Math.sqrt(d2);
          if(d <= hu.pullClampDist) continue; // nicht zu nah ziehen
          // Normalisiere & Stärke skaliert mit Entfernung (näher = weniger, weiter = etwas mehr)
          const ndx = dx / d; const ndy = dy / d;
          const distFrac = 1 - Math.min(1, d / pullR); // 0 (Rand) -> 1 (Mitte)
          const curForce = force * (0.35 + 0.65 * distFrac) * fFactor;
          e.x += ndx * curForce * dt;
          e.y += ndy * curForce * dt;
          // Kleiner Partikel-Funke selten
          if(Math.random() < 0.003) particle(e.x + (Math.random()-0.5)*6, e.y + (Math.random()-0.5)*6, 'rgba(255,140,40,0.25)');
        }
        // Visueller Kreis (dezent) optional
        if(typeof ctx !== 'undefined'){
          ctx.save();
          ctx.globalAlpha = 0.10 + 0.08*Math.sin(performance.now()*0.006 + pct*6);
          ctx.strokeStyle = 'rgba(255,'+Math.round(120+80*pct)+',40,0.55)';
          ctx.lineWidth = 2.5;
          ctx.beginPath(); ctx.arc(player.x, player.y, pullR, 0, Math.PI*2); ctx.stroke();
          ctx.restore();
        }
      }

      // --- Dynamic spawn rate scaling ---
      if (!state.spawnRateScale) state.spawnRateScale = 1.0;
      if (!state.enemyPowerScale) state.enemyPowerScale = 1.0;
      if (!state.lastSpawnScaleTime) state.lastSpawnScaleTime = state.time;
      // Every 10 seconds, increase spawn rate (decrease interval)
      if (state.time - state.lastSpawnScaleTime > 10) {
        state.spawnRateScale *= 1.08; // 8% faster every 10s
        state.lastSpawnScaleTime = state.time;
        // Clamp to avoid going too fast
        if (state.spawnRateScale > 5) state.spawnRateScale = 5;
      }
      state.spawnTimer -= dt;
      if(state.spawnTimer<=0){
        const baseBatch = 1 + Math.random()*(player.level>6?2:1);
        const totalBatch = Math.max(1, Math.round(baseBatch * (state.spawnMultiplier||1) * 0.80));
        for(let i=0;i<totalBatch;i++) spawnWerewolf();
        // Apply spawn rate scaling
        state.spawnTimer = (state.spawnInterval / state.spawnRateScale) * (0.7+Math.random()*0.7);
      }

      if(window.TESTMODE) {
      }

      if(player.explosionDebuff){
    player.explosionDebuffTimer -= dt;
    if(player.explosionDebuffTimer <= 0){
      player.explosionDebuff = false;
      player.explosionDebuffTimer = 0;
    }
  }
  
  if(player.eliteKillBuff){
    player.eliteKillBuffTimer -= dt;
    if(player.eliteKillBuffTimer <= 0){
      player.eliteKillBuff = false;
      player.eliteKillBuffTimer = 0;
    }
  }

  // Shockwaves unbedingt jedes Frame updaten
  updateShockwaves(dt);

      
      let accumulatedTouch = 0;
      for(let i=state.enemies.length-1;i>=0;i--){
  const e=state.enemies[i];
  if(!e) continue;
      if(e.boss && e.name==='Kristof'){ state.lastKristofX = e.x; state.lastKristofY = e.y; }
        // Knockback-Physik (immer zuerst, unabhängig vom Gegnerverhalten)
        if(e.knockbackVX || e.knockbackVY) {
          e.x += e.knockbackVX * dt;
          e.y += e.knockbackVY * dt;
          e.knockbackVX *= 0.82;
          e.knockbackVY *= 0.82;
          if(Math.abs(e.knockbackVX) < 2) e.knockbackVX = 0;
          if(Math.abs(e.knockbackVY) < 2) e.knockbackVY = 0;
        }
        // Hit-Cooldown reduzieren
        if(e.hitCooldown && e.hitCooldown > 0) {
          e.hitCooldown -= dt;
          if(e.hitCooldown < 0) e.hitCooldown = 0;
          console.log('hitCooldown reduziert:', e.hitCooldown);
        }
        const toX=player.x-e.x, toY=player.y-e.y; const dist=Math.hypot(toX,toY)||1;
  
  if(e.boss && e.name === 'Kristof') {
    // Während Center-Move / Telegraph nicht den Spieler verfolgen
    if(!(e.shockwaveState && (e.shockwaveState.movingToCenter || e.shockwaveState.telegraphing || e.shockwaveState.active))){
      const toX = player.x - e.x, toY = player.y - e.y;
      const dist = Math.hypot(toX, toY) || 1;
      e.x += (toX/dist) * e.speed * dt;
      e.y += (toY/dist) * e.speed * dt;
      const pr = player.effectiveR || player.r;
      if(dist < e.r + pr - 2 && player.iFrames <= 0) {
        damagePlayer(e.dmg);
      }
    }
    // Debug State Log (einfacher Überblick):
  if(e.shockwaveState && !e.shockwaveState._frameLog){
      console.log('[Kristof State]', {
        moving: e.shockwaveState.movingToCenter,
        tele: e.shockwaveState.telegraphing,
        active: e.shockwaveState.active,
        seqIndex: e.shockwaveState.seqIndex
      });
      e.shockwaveState._frameLog = true;
      setTimeout(()=>{ if(e.shockwaveState) e.shockwaveState._frameLog=false; }, 800);
    }
  }
  if(e.boss){
          e.radialTimer -= dt;
          if(e.radialTimer <= 0){
            
            const count = Math.min(28, 8 + Math.floor((state.metaStage||1) * 2));
            const baseDmg = Math.max(6, Math.round(e.dmg * 0.26));
            for(let pi=0; pi<count; pi++){
              const a = (pi / count) * Math.PI * 2 + (Math.random()-0.5)*0.12;
              const sp = 260 + (player.level*6);
              const proj = { x: e.x, y: e.y, vx: Math.cos(a)*sp, vy: Math.sin(a)*sp, r:6, color: e.color || '#ffb86b', dmg: baseDmg, range: 560, traveled:0, pierce:0, explode:0, trail:[], weaponIndex: null, ricochet:0, sourceIsBoss:true };
              state.projectiles.push(proj);
            }
            
            for(let pi=0;pi<12;pi++) particle(e.x + (Math.random()-0.5)*22, e.y + (Math.random()-0.5)*22, '#cccccc');
            e.radialTimer = e.radialInterval * (0.85 + Math.random()*0.4);
          }
        }
      
      if(e && !e.boss && !e.bossMinion && e.hp <= 0 && !e._kristofTokenDropped) {
        // DOPPELTER Kristof-Decrement entfernt – killEnemy behandelt dies bereits
        // (Früherer Code hat den Counter doppelt reduziert und sehr frühen Spawn ausgelöst)
      }

      // --- After Kristof boss kill: reduce spawn rate, increase enemy power ---
      if(e && e.boss && e.name === 'Kristof' && e.hp <= 0 && !e._kristofPowerApplied) {
        // Reduce spawn rate by 30%
        state.spawnRateScale = Math.max(1, state.spawnRateScale * 0.7);
        // Increase enemy power by 20%
        state.enemyPowerScale = (state.enemyPowerScale || 1) * 1.2;
        // Mark so this only happens once per Kristof
        e._kristofPowerApplied = true;
      }
        if(!(e.knockbackVX || e.knockbackVY)) {
          // Elite Dash State Machine (nur für melee/runner elites, nicht während Boss-Wellen-Lock)
          if(e.elite && e.type==='runner'){
            if(!e.dashState) e.dashState='idle';
            if(e.dashState==='idle'){
              e.dashCooldown = (e.dashCooldown||0) - dt;
              if(e.dashCooldown<=0){
                const dxp = player.x - e.x, dyp = player.y - e.y; const distp = Math.hypot(dxp,dyp)||1;
                if(distp >= ELITE_DASH_CFG.minDist && distp <= ELITE_DASH_CFG.maxDist){
                  e.dashState='telegraph';
                  // Richtung einmalig beim Beginn fest einfrieren
                  e.dashAngle = Math.atan2(dyp,dxp);
                  e.dashTimer = ELITE_DASH_CFG.telegraph;
                  e._dashPreviewDist = Math.min(ELITE_DASH_CFG.maxDistance, distp*0.9);
                } else {
                  // reset cooldown schneller wenn Distanz ungeeignet
                  e.dashCooldown = 1.0 + Math.random()*1.5;
                }
              }
            } else if(e.dashState==='telegraph'){
              e.dashTimer -= dt;
              if(e.dashTimer<=0){
                e.dashState='dash';
                e.dashTraveled = 0;
                e.dashSpeed = (e.speed||90) * ELITE_DASH_CFG.speedMul;
                // Richtung NICHT mehr aktualisieren -> bleibt wie beim Telegraph Start
                e.dashAngle = (typeof e.dashAngle==='number') ? e.dashAngle : Math.atan2(player.y-e.y, player.x-e.x);
              }
            } else if(e.dashState==='dash'){
              const mv = e.dashSpeed * dt;
              e.x += Math.cos(e.dashAngle)*mv;
              e.y += Math.sin(e.dashAngle)*mv;
              e.dashTraveled += mv;
              // Kollision mit Spieler während Dash -> Extra Schaden
              const pr = player.effectiveR||player.r;
              if(Math.hypot(player.x-e.x, player.y-e.y) < pr + e.r + 2){
                // Dash-Schaden: Kristof hat eigene (reduzierte) Formel + Cap auf maxHp-Prozent
                let dashDmg;
                if(e.boss && e.name === 'Kristof') {
                  const raw = e.dmg * (ELITE_DASH_CFG.kristofDmgFactor || ELITE_DASH_CFG.dmgFactor);
                  const cap = Math.round(player.maxHp * (ELITE_DASH_CFG.kristofHpPctCap || 0.18));
                  dashDmg = Math.max(1, Math.min(raw, cap));
                  // Optional: kleines Debug Log einmal pro Sekunde wenn Cap greift
                  if(raw > cap && (!window._kristofDashCapLogT || performance.now() - window._kristofDashCapLogT > 1000)){
                    window._kristofDashCapLogT = performance.now();
                    console.log('[Kristof][Dash] Schaden gecappt', {raw: Math.round(raw), applied: dashDmg, cap});
                  }
                } else {
                  dashDmg = e.dmg * ELITE_DASH_CFG.dmgFactor;
                }
                damagePlayer(dashDmg);
                if(player.iFrames < ELITE_DASH_CFG.touchIFrame) player.iFrames = ELITE_DASH_CFG.touchIFrame;
                // Sofort in Recover wechseln
                e.dashState='recover';
                e.dashTimer = ELITE_DASH_CFG.recover;
                e.dashCooldown = ELITE_DASH_CFG.cooldownMin + Math.random()*(ELITE_DASH_CFG.cooldownMax-ELITE_DASH_CFG.cooldownMin);
              }
              if(e.dashTraveled >= ELITE_DASH_CFG.maxDistance){
                e.dashState='recover';
                e.dashTimer = ELITE_DASH_CFG.recover;
                e.dashCooldown = ELITE_DASH_CFG.cooldownMin + Math.random()*(ELITE_DASH_CFG.cooldownMax-ELITE_DASH_CFG.cooldownMin);
              }
            } else if(e.dashState==='recover'){
              e.dashTimer -= dt; if(e.dashTimer<=0){ e.dashState='idle'; }
            }
          }
          // Slow aus Curse berücksichtigen
          let moveSpeed = e.speed;
          if(e.slowUntil && (state.time||0) < e.slowUntil){
            moveSpeed = moveSpeed * (e.slowFactor != null ? e.slowFactor : 1);
          } else {
            // Slow ausgelaufen -> reset
            if(e.slowUntil && (state.time||0) >= e.slowUntil){ delete e.slowUntil; delete e.slowFactor; }
          }
          if(e.type==='ranged'){
            e.shootTimer -= dt; if(e.shootTimer<=0){ enemyShoot(e); e.shootTimer = Math.max(0.3, 0.9 + Math.random()*0.6); }
            const desired=240;
            if(dist<desired){
              if(!e.boss){ e.x -= (toX/dist)*moveSpeed*dt; e.y -= (toY/dist)*moveSpeed*dt; } else { e.x += (toX/dist)*moveSpeed*dt * 0.8; e.y += (toY/dist)*moveSpeed*dt * 0.8; }
            } else { e.x += (toX/dist)*moveSpeed*0.4*dt; e.y += (toY/dist)*moveSpeed*0.4*dt; }
          } else {
            e.x += (toX/dist)*moveSpeed*dt;
            e.y += (toY/dist)*moveSpeed*dt;
          }
        }
        
        for(let j=i-1;j>=0;j--){
          const oe = state.enemies[j];
          if (!oe || !e) continue;
          const dd = Math.hypot(oe.x - e.x, oe.y - e.y);
          if(dd>0 && dd < (oe.r + e.r) * 0.8){
            const nx=(e.x-oe.x)/dd, ny=(e.y-oe.y)/dd;
            e.x += nx*6*dt; e.y += ny*6*dt; oe.x -= nx*6*dt; oe.y -= ny*6*dt;
          }
        }
        if(!e) continue;
  const pr2 = player.effectiveR || player.r;
  if(dist < e.r + pr2 - 2){
          if(e.type === 'weaponOnly' && e.explodesOnTouch){
            damagePlayer(Math.round(player.maxHp * 0.10));
            player.explosionDebuff = true;
            player.explosionDebuffTimer = 10.0;
            for(let p=0;p<12;p++) particle(e.x,e.y,'#cccccc');
            if (typeof killEnemy === 'function' && state.enemies[i]) { killEnemy(i, state.enemies[i]); } else { state.enemies.splice(i,1); }
            continue;
          }
          if(e.boss){ 
            accumulatedTouch += Math.max(1, Math.round(e.dmg * 2.5));
            const push = 1.2; 
            e.x += (toX/dist) * -Math.min(e.speed*dt*push, 36); 
            e.y += (toY/dist) * -Math.min(e.speed*dt*push, 36);
          } else {
            accumulatedTouch += e.dmg * dt;
            const knockback = 220;
            e.knockbackVX = -(toX/dist) * knockback;
            e.knockbackVY = -(toY/dist) * knockback;
          }
        }
      }
  
  if(accumulatedTouch > 0){ damagePlayer(accumulatedTouch); }

      for(let i=state.enemyShots.length-1;i>=0;i--){ const s=state.enemyShots[i]; s.x+=s.vx*dt; s.y+=s.vy*dt; s.life-=dt; if(s.life<=0){ state.enemyShots.splice(i,1); continue; } const d=Math.hypot(s.x-player.x,s.y-player.y); if(d<player.r+s.r){ damagePlayer(s.dmg); state.enemyShots.splice(i,1); continue; } if(s.x<-30||s.x>innerWidth+30||s.y<-30||s.y>innerHeight+30) state.enemyShots.splice(i,1); }

      for(let s=state.slashes.length-1; s>=0; s--){
        const sl=state.slashes[s];
        const t=(state.time-sl.start)/sl.dur;
        if(t>=1){ state.slashes.splice(s,1); continue; }
        // Reine Spin-Visual-Slashes überspringen Schaden/Knockback Logik
        if(sl.visualOnly){
          // Softes Ausfaden (je nach t) per globale Alpha im Draw unten
          const sweep=sl.arc;
          const ctx = window.ctx || window.gameCtx || window.mainCtx || window.canvas && window.canvas.getContext && window.canvas.getContext('2d');
          if(ctx){
            ctx.save();
            const fade = 1 - t;
            ctx.globalAlpha = 0.30 * fade;
            ctx.beginPath();
            ctx.arc(player.x, player.y, sl.range, sl.angle - sweep/2, sl.angle + sweep/2);
            ctx.arc(player.x, player.y, player.r+4, sl.angle + sweep/2, sl.angle - sweep/2, true);
            ctx.closePath();
            const grd = ctx.createRadialGradient(player.x, player.y, player.r+4, player.x, player.y, sl.range);
            grd.addColorStop(0, 'rgba(200,200,200,0.15)');
            grd.addColorStop(1, 'rgba(220,220,220,0.55)');
            ctx.fillStyle = grd;
            ctx.fill();
            ctx.restore();
          }
          continue;
        }
        // Animierter Arc: aufbauen, kurz stehen lassen, dann von links nach rechts auflösen
        const sweep=sl.arc;
        let arcStart, arcEnd;
        if(t < 0.25) {
          // Aufbau von 0 bis sweep
          const prog = t / 0.25;
          arcStart = sl.angle - sweep/2;
          arcEnd = arcStart + sweep * prog;
        } else if (t < 0.6) {
          // Komplett sichtbar
          arcStart = sl.angle - sweep/2;
          arcEnd = sl.angle + sweep/2;
        } else {
          // Auflösen von links nach rechts
          const prog = (t-0.6)/0.4; // 0 bis 1
          arcStart = sl.angle - sweep/2 + sweep * prog;
          arcEnd = sl.angle + sweep/2;
        }
        // Zeichne den Arc als grauen Bereich
        const ctx = window.ctx || window.gameCtx || window.mainCtx || window.canvas && window.canvas.getContext && window.canvas.getContext('2d');
        if(ctx && arcEnd > arcStart) {
          ctx.save();
          ctx.globalAlpha = 0.22;
          ctx.beginPath();
          ctx.arc(player.x, player.y, sl.range, arcStart, arcEnd);
          ctx.arc(player.x, player.y, player.r+8, arcEnd, arcStart, true);
          ctx.closePath();
          ctx.fillStyle = '#cccccc';
          ctx.fill();
          ctx.restore();
        }
        // Kollisionsabfrage wie gehabt
        const hitX = player.x;
        const hitY = player.y;
        const arcWidth = arcEnd - arcStart;
        // --- ENEMY HIT ---
        for(let i=state.enemies.length-1;i>=0;i--){
          const e=state.enemies[i];
          if(!e) continue;
          const dx=e.x-hitX, dy=e.y-hitY; const dist=Math.hypot(dx,dy); if(dist>sl.range+e.r) continue;
          const angTo=Math.atan2(dy,dx); const diff=angleDiff(angTo,sl.angle);
          if(Math.abs(diff) < arcWidth/2){
  // --- CHEST HIT ---
  // Try to hit a chest at the tip of the slash arc
  const tipX = player.x + Math.cos(sl.angle) * sl.range;
  const tipY = player.y + Math.sin(sl.angle) * sl.range;
  hitChestAt(tipX, tipY);
            if(typeof e.hitCooldown === 'undefined') e.hitCooldown = 0;
            console.log('hitCooldown vor Knockback:', e.hitCooldown);
            // Knockback immer direkt nach Treffer prüfen
            if(e.hitCooldown <= 0) {
              const knockbackPower = 120 + Math.random()*40;
              e.knockbackVX = Math.cos(sl.angle) * knockbackPower;
              e.knockbackVY = Math.sin(sl.angle) * knockbackPower;
              e.hitCooldown = 0.18;
              console.log('Knockback gesetzt:', {
                enemy: e,
                knockbackVX: e.knockbackVX,
                knockbackVY: e.knockbackVY,
                hitCooldown: e.hitCooldown
              });
            }
            console.log('Treffer-Block betreten:', {enemy: e, arcWidth, diff, hitCooldown: e.hitCooldown, lastHitId: e.lastHitId, slashId: sl.id});
            if(e.lastHitId===sl.id) continue; e.lastHitId = sl.id;
            const w = weapons[sl.weaponIndex];
            if(window.TESTMODE && e.hp > 1) {
              let fifty = e.hp * 0.5;
              e.hp -= fifty;
              if(typeof window.addDamageFloater==='function'){ window.addDamageFloater({x:e.x, y:e.y-(e.r||24), amount:fifty, type:'basic'}); }
              e.hitFlash = 0.76;
              setTimeout(() => { e.hitFlash = 0; }, 0);
              if(e.hp<=0){ handleBossPhaseAfterDamage(e, i); }
              continue;
            }
            {
              const slashScale = sl.dmgScale != null ? sl.dmgScale : 1;
              let dmgBuff = sl.dmgBuff || (buffs.dmg||1);
              let dmg = player.dmg*(w.dmgMul||1)*dmgBuff*(0.92+Math.random()*0.16) * slashScale;
              if(character === 'bully' && w) {
                if(w.id === 'sword') dmg *= 1.15;
                if(w.id === 'dagger' || w.id === 'sword' || w.id === 'halbard') dmg *= 0.75;
              }
              if(e.type === 'runner' || e.type === 'brute') dmg *= 1.3;
              let finalDmg;
              if(w && w.id === 'sword') {
                const r0 = player.r + 8;
                const r1 = player.r + sl.range;
                const distToPlayer = Math.hypot(e.x-player.x, e.y-player.y);
                if(distToPlayer > r1 - (r1-r0)*0.10) {
                  finalDmg = dmg * 1.1 * (e.boss ? (player.bossDamageMul||1) : 1);
                  if(e.name === 'Kristof' && e.playerDamageReduction) finalDmg *= (1 - e.playerDamageReduction);
                } else {
                  finalDmg = dmg * (e.boss ? (player.bossDamageMul||1) : 1);
                  if(e.boss && e.dmgReduction) finalDmg *= (1 - e.dmgReduction);
                  if(e.name === 'Kristof' && e.playerDamageReduction) finalDmg *= (1 - e.playerDamageReduction);
                }
              } else {
                finalDmg = dmg * (e.boss ? (player.bossDamageMul||1) : 1);
                if(e.boss && e.dmgReduction) finalDmg *= (1 - e.dmgReduction);
                if(e.name === 'Kristof' && e.playerDamageReduction) finalDmg *= (1 - e.playerDamageReduction);
              }
              e.hp -= finalDmg;
              if(typeof window.addDamageFloater==='function'){ window.addDamageFloater({x:e.x, y:e.y-(e.r||24), amount:finalDmg, type:'basic'}); }
              // Moon Slash Passiv: jeder 15. echte Schwerttreffer (lvl >=5) feuert ein Mondprojektil
              if(w && w.id === 'sword' && !window.TESTMODE){
                if(w.lvl >= 5){
                  window.moonSlashCounter = (window.moonSlashCounter||0) + 1;
                  if(window.DEBUG_MOON) console.log('[MoonSlash] Sword-Hit', window.moonSlashCounter, 'lvl', w.lvl);
                  if(window.moonSlashCounter % 15 === 0){
                    spawnMoonSlash(player.x, player.y, sl.angle, w.lvl);
                  }
                }
              }
              e.hitFlash = 0.76;
              setTimeout(() => { e.hitFlash = 0; }, 0);
              if(e.boss && e.phases){
                const phase = e.phases[e.currentPhase];
                const nextPhaseIndex = e.currentPhase + 1;
                const nextPhase = e.phases[nextPhaseIndex];
                const hpRatio = e.hp / e.maxHp;
                if(nextPhase && hpRatio <= nextPhase.threshold){
                  e.currentPhase = nextPhaseIndex;
                  e.maxHp = e.phasePools[e.currentPhase];
                  e.hp = e.maxHp;
                  state.bossPhaseRequiredColor = e.phases[e.currentPhase].color;
                  spawnPhaseSpecials(e);
                }
              }
              if(e.hp<=0){ handleBossPhaseAfterDamage(e, i); }
            }
          }
        }
      }

      for(let i=state.projectiles.length-1;i>=0;i--){
        const p=state.projectiles[i];
        if(!p.trail) p.trail=[];
        if(p.type === 'moonSlash'){
          const tl = (p.trailLife != null ? p.trailLife : 0.40);
          const tm = (p.trailMax != null ? p.trailMax : 18);
          p.trail.push({x:p.x,y:p.y,life:tl});
          if(p.trail.length>tm) p.trail.shift();
        } else {
          const tl = (p.trailLife != null ? p.trailLife : 0.25);
          const tm = (p.trailMax != null ? p.trailMax : 12);
          p.trail.push({x:p.x,y:p.y,life:tl});
          if(p.trail.length>tm) p.trail.shift();
        }
        p.x+=p.vx*dt; p.y+=p.vy*dt; p.traveled+=Math.hypot(p.vx*dt,p.vy*dt);
        let removed=false;
        // --- CHEST HIT for PROJECTILES ---
        if (hitChestAt(p.x, p.y)) {
          removed = true;
        }
        for(let j=state.enemies.length-1;j>=0;j--){
          const e=state.enemies[j]; const d=Math.hypot(e.x-p.x,e.y-p.y); if(d<e.r+p.r){
            const projWeapon = (p.weaponIndex!=null ? weapons[p.weaponIndex] : null);
            
            if(window.TESTMODE && e.hp > 1) {
              let fifty = e.hp * 0.5;
              e.hp -= fifty;
              if(typeof window.addDamageFloater==='function'){ window.addDamageFloater({x:e.x, y:e.y-(e.r||24), amount:fifty, type:'basic'}); }
              e.hitFlash = 0.76;
              setTimeout(() => { e.hitFlash = 0; }, 0);
              if(e.hp<=0){ handleBossPhaseAfterDamage(e, j); }
              // Knockback nur, wenn kein Cooldown
              if(typeof e.hitCooldown === 'undefined' || e.hitCooldown <= 0) {
                const knockbackPower = 120 + Math.random()*40;
                e.knockbackVX = Math.cos(sl.angle) * knockbackPower;
                e.knockbackVY = Math.sin(sl.angle) * knockbackPower;
                e.hitCooldown = 0.18; // 180ms Immunität gegen erneuten Knockback
                console.log('Knockback gesetzt:', {
                  enemy: e,
                  knockbackVX: e.knockbackVX,
                  knockbackVY: e.knockbackVY,
                  hitCooldown: e.hitCooldown
                });
              }
              continue;
            }
            
            e.hitFlash = 0.76;
            setTimeout(() => { e.hitFlash = 0; }, 0);
            for(const e of state.enemies) {
              if(e.hitFlash && e.hitFlash > 0) e.hitFlash -= dt;
              if(e.hitFlash < 0) e.hitFlash = 0;
            }
            let projFinal = p.dmg * (e.boss ? (player.bossDamageMul||1) : 1);
            if(character === 'bully' && projWeapon) {
              if(projWeapon.id === 'sword') projFinal *= 1.15;
              if(projWeapon.id === 'dagger' || projWeapon.id === 'sword' || projWeapon.id === 'halbard') projFinal *= 0.75;
            }
            if(e.type === 'runner' || e.type === 'brute') projFinal *= 1.3;
            if(e.boss && e.dmgReduction) projFinal *= (1 - e.dmgReduction);
            if(e.name === 'Kristof' && e.playerDamageReduction) projFinal *= (1 - e.playerDamageReduction);
            const falloff = Math.pow(0.9, p.piercedCount || 0);
            projFinal *= falloff;
            e.hp -= projFinal;
            if(typeof window.addDamageFloater==='function'){ window.addDamageFloater({x:e.x, y:e.y-(e.r||24), amount:projFinal, type:'basic'}); }
            if(p.type === 'truthFeather' && e.type === 'ranged' && !e.elite && !e.boss){
              e.hp = 0; // garantierter One-Shot
            }
            p.piercedCount = (p.piercedCount || 0) + 1;
            if(e.boss && e.phases){
              const nextPhaseIndex = e.currentPhase + 1;
              const nextPhase = e.phases[nextPhaseIndex];
              const hpRatio = e.hp / e.maxHp;
              if(nextPhase && hpRatio <= nextPhase.threshold){ e.currentPhase = nextPhaseIndex; state.bossPhaseRequiredColor = e.phases[e.currentPhase].color; spawnPhaseSpecials(e); }
            }
            if(e.hp<=0){ handleBossPhaseAfterDamage(e, j); }
            if(p.explode){ explode(p.x,p.y,p.explode, projFinal * 0.8, p.weaponIndex); removed=true; break; }
            if(p.pierce > 0){ p.pierce--; }
            else if(p.ricochet > 0){ let best=null, bestD=1e9; for(let m=0;m<state.enemies.length;m++){ if(m===j) continue; const ee=state.enemies[m]; const dd=Math.hypot(ee.x-p.x, ee.y-p.y); if(dd<bestD){ bestD=dd; best=ee; } } if(best){ const ang=Math.atan2(best.y-p.y, best.x-p.x); const sp = Math.hypot(p.vx,p.vy); p.vx = Math.cos(ang)*sp; p.vy = Math.sin(ang)*sp; p.ricochet--; } else { removed=true; } }
            else { removed=true; }
            break;
          }
        }
        if(removed || p.traveled>p.range || p.x<-30||p.x>innerWidth+30||p.y<-30||p.y>innerHeight+30){ state.projectiles.splice(i,1); }
      }



  

      for(let i=state.particles.length-1;i>=0;i--){ const p=state.particles[i]; p.life-=dt; if(p.float){ p.y-=24*dt; } else { p.x+=p.vx*dt; p.y+=p.vy*dt; p.vx*=0.98; p.vy*=0.98; } if(p.life<=0) state.particles.splice(i,1); }

    
    for(let i=state.aoes.length-1;i>=0;i--){ const a = state.aoes[i]; a.age += dt; if(a.age >= a.life) state.aoes.splice(i,1); }

      
      if(state.absorbing && state.absorbing.length){
        for(let ai=state.absorbing.length-1; ai>=0; ai--){
          const ab = state.absorbing[ai]; ab.t += dt; const p = Math.min(1, ab.t / ab.dur);
          
          const ease = (x=> (1 - Math.cos(x * Math.PI)) / 2)(p);
          ab.x = ab.startX + (ab.targetX - ab.startX) * ease;
          ab.y = ab.startY + (ab.targetY - ab.startY) * ease;
          
          if(Math.random() < 0.25) particle(ab.x + (Math.random()-0.5)*6, ab.y + (Math.random()-0.5)*6, ab.color);
          if(p >= 1){
            
            const boss = state.enemies.find(en=>en && en.boss);
            if(boss){
              
              const add = Math.max(1, Math.floor(boss.totalMaxHp * 0.01));
              boss.totalMaxHp = (boss.totalMaxHp || boss.maxHp) + add;
              
              if(boss.phasePools && boss.phasePools.length){
                
                const remaining = boss.phasePools.length - boss.currentPhase;
                if(remaining > 0){
                  const per = Math.floor(add / remaining) || 1;
                  for(let pi=boss.currentPhase; pi<boss.phasePools.length; pi++){
                    boss.phasePools[pi] = (boss.phasePools[pi] || 0) + per;
                  }
                  
                  boss.maxHp = boss.phasePools[boss.currentPhase];
                  boss.hp = Math.min(boss.hp + per, boss.maxHp);
                }
              } else {
                boss.maxHp += add; boss.hp = Math.min(boss.hp + add, boss.maxHp);
              }
              
              for(let i=0;i<10;i++) particle(boss.x + (Math.random()-0.5)*boss.r*2, boss.y + (Math.random()-0.5)*boss.r*2, ab.color);
            }
            state.absorbing.splice(ai,1);
          }
        }
      }

  
      for(let si=state.sweeps.length-1; si>=0; si--){
        const s = state.sweeps[si];
        s.age = state.time - s.startTime;
        const prevProgress = s._lastProgress != null ? s._lastProgress : 0;
        const progress = Math.min(1, s.age / s.dur);
        const twoPi = Math.PI * 2;
  const startA = s.angle;
        const prevAngle = startA + twoPi * prevProgress;
        const curAngle = startA + twoPi * progress;
        s._lastProgress = progress;
        
        const norm = a => { let v = a % twoPi; if(v < 0) v += twoPi; return v; };
  const nFrom = norm(prevAngle), nTo = norm(curAngle);
        for(let ei=state.enemies.length-1; ei>=0; ei--){
          const e = state.enemies[ei];
          if(!e || typeof e.x !== 'number' || typeof e.y !== 'number') continue; // Guard: enemy entry removed / hole
          const dx = e.x - player.x, dy = e.y - player.y;
          const dist = Math.hypot(dx, dy);
          if(dist > s.radius + e.r) continue;
          const angTo = Math.atan2(dy, dx);
          const na = norm(angTo);
          let inArc = false;
          if(nFrom <= nTo) inArc = na >= nFrom && na <= nTo;
          else inArc = na >= nFrom || na <= nTo;
          if(!inArc) continue;
          
          if(e._lastSweepId === s.id) continue;
          e._lastSweepId = s.id;
          
          
          const w = weapons[s.weaponIndex];
          const bossPhaseColor = state.bossPhaseRequiredColor;
          let weaponAllowed = true;
          if(e.weaponRequired){ weaponAllowed = !!(w && w.id === e.weaponRequired); }
          else if(bossPhaseColor && e.boss){ weaponAllowed = !!(w && w.color === bossPhaseColor); }
          let partialDmg = false;
          let partialDmgFactor = 1;
          if(!weaponAllowed && (e.weaponRequired || (bossPhaseColor && e.boss))) {
            partialDmg = true;
            const cfg = window.enemyScalingConfig || {};
            partialDmgFactor = e.boss ? (cfg.partialBoss||0.1) : (cfg.partialNormal||0.2);
          }
          if(!weaponAllowed && !partialDmg){ for(let p=0;p<3;p++) particle(e.x,e.y,'#888'); }
          else {
            let dmg = s.dmg * (buffs.dmg || 1) * (e.boss ? (player.bossDamageMul||1) : 1);
            
            if(partialDmg){
              const beforePartial = dmg;
              dmg *= partialDmgFactor;
              if((window.enemyScalingConfig||{}).logPartial){
                console.log('[PartialDmg][Sweep]', {enemyId:ei, boss:!!e.boss, factor: partialDmgFactor, before: beforePartial.toFixed?beforePartial.toFixed(2):beforePartial, after: dmg.toFixed?dmg.toFixed(2):dmg});
              }
            }
            if(e.type === 'runner' || e.type === 'brute') dmg *= 1.3;
            if(e.boss && e.invulnerable) continue;
            if(e.boss && e.dmgReduction) dmg *= (1 - e.dmgReduction);
            e.hp -= dmg;
            if(typeof window.addDamageFloater==='function'){ window.addDamageFloater({x:e.x, y:e.y-(e.r||24), amount:dmg, type:'basic'}); }
            for(let p=0;p<6;p++) particle(e.x,e.y, '#cccccc');
            if(e.hp<=0){ if(e.boss) handleBossPhaseAfterDamage(e, ei); else killEnemy(ei,e, s.weaponIndex); }
          }
        }
        if(progress >= 1) state.sweeps.splice(si,1);
      }

      const bolt = weapons.find(w=>w.id==='bolt');
      if(bolt && bolt.kristof){
        state.kristofBladeTimer += dt;
        const bladeInterval = 0.6;
        const bladeRadius = 84 + ((bolt.kristofStage||1)-1) * 6;
        if(state.kristofBladeTimer >= bladeInterval){
          state.kristofBladeTimer -= bladeInterval;
          const bladeDmg = Math.round(player.dmg * (buffs.dmg||1) * 0.20);
          for(let i=state.enemies.length-1;i>=0;i--) { const e = state.enemies[i]; const d = Math.hypot(e.x - player.x, e.y - player.y); if(d <= bladeRadius + e.r){ const finalBlade = bladeDmg * (e.boss ? (player.bossDamageMul||1) : 1); e.hp -= finalBlade; for(let p=0;p<6;p++) particle(e.x,e.y,'#cccccc'); if(e.hp<=0){ if(e.boss) handleBossPhaseAfterDamage(e, i); else killEnemy(i,e); } } }
        }
        state.kristofBladeRot += dt * 2.0;
      }

      if(state.autoWeaponSpin){
        state.autoWeaponSpinTimer += dt;
        const spinInterval = 0.14;
        if(state.autoWeaponSpinTimer >= spinInterval){
          state.autoWeaponSpinTimer -= spinInterval;
          const baseAngle = state.time * 3.0;
          for(let wi=0; wi<weapons.length; wi++){
            const w = weapons[wi];
            const angle = baseAngle + (wi/weapons.length) * Math.PI*2;
            for(let i=0;i<2;i++){
              const slash = { start: state.time, dur: 0.18, angle:fredSlashAngle, range: w.range*(buffs.range||1)*0.9, arc: (w.type==='projectile'?0.6:1.6), color: w.color, width: 12, id: ++state._slashId, weaponIndex: wi };
              state.slashes.push(slash);
            }
          }
        }
      }

      updateHUD();
    }

    
    const alpha_visible = 1.0;
    const alpha_covered = 0.6;
  const fade_duration = 0.2;

    
    function getUIElements() {
      
      const hud = document.querySelector('.hud');
      
      const weaponSlots = document.getElementById('weaponSlots');
      
      return [hud, weaponSlots].filter(Boolean);
    }

    
    function getPlayerRect() {
      
      const r = player.r;
      
      const rect = canvas.getBoundingClientRect();
      
  const px = player.x, py = player.y - (player.jumpOffset||0); // apply vertical jump offset for overlap logic if needed
      
      const x = rect.left + px;
      const y = rect.top + py;
      return {left: x - r, right: x + r, top: y - r, bottom: y + r};
    }

    
    let lastCovered = false;
    let fadeTimeouts = {};
    function updateUITransparency() {
      const playerRect = getPlayerRect();
      getUIElements().forEach(ui => {
        const uiRect = ui.getBoundingClientRect();
        const overlap = !(playerRect.right < uiRect.left ||
                          playerRect.left > uiRect.right ||
                          playerRect.bottom < uiRect.top ||
                          playerRect.top > uiRect.bottom);
        const targetAlpha = overlap ? alpha_covered : alpha_visible;
        if (parseFloat(ui.style.opacity||'1') !== targetAlpha) {
          ui.style.transition = `opacity ${fade_duration}s`;
          ui.style.opacity = targetAlpha;
        }
      });
    }

    
  
    function draw(){
      ctx.clearRect(0,0,innerWidth,innerHeight);
      // dt schätzen falls global nicht vorhanden (für Animationsupdate)
      const nowTs = performance.now();
      if(!draw.__lastTs) draw.__lastTs = nowTs;
      const dt = Math.min(0.05, (nowTs - draw.__lastTs)/1000);
      draw.__lastTs = nowTs;
      updateHealAnim(dt);
  updatePoisonAnim(dt);

      // (Bereinigt) Früherer Frame-Debug entfernt

      // Hintergrund
      if(!window.bgPattern){
        const bgImg = new Image();
        bgImg.src = './img/bg_tile.png';
        bgImg.onload = ()=>{
          window.bgPattern = ctx.createPattern(bgImg, 'repeat');
        };
      }
      ctx.save();
      if(!window.bgTileLoaded){
        window.bgTile = new Image();
        window.bgTile.src = 'css/hintergrund/boden.png';
        window.bgTileLoaded = true;
      }
      if(window.bgTile && window.bgTile.complete && window.bgTile.naturalWidth > 0){
        for(let y = 0; y < innerHeight; y += window.bgTile.naturalHeight){
          for(let x = 0; x < innerWidth; x += window.bgTile.naturalWidth){
            ctx.drawImage(window.bgTile, x, y);
          }
        }
      }
      ctx.restore();

      // Shockwaves ÜBER dem Boden rendern
      if(state.shockwaves && state.shockwaves.length){
        for(const sw of state.shockwaves){
          if(state.time < sw.start) continue;
          const rOuter = sw.r + sw.width*0.5;
          const rInner = sw.r - sw.width*0.5;
          if(rOuter <= 0) continue; // noch nicht sichtbar
          const innerClamped = Math.max(0, rInner);
          const ox = sw.originX != null ? sw.originX : (state.lastKristofX||0);
          const oy = sw.originY != null ? sw.originY : (state.lastKristofY||0);
          ctx.save();
          ctx.lineWidth = 4;
          ctx.strokeStyle = sw.color;
          ctx.globalAlpha = 0.55;
          ctx.beginPath();
          ctx.arc(ox, oy, Math.max(0.1, sw.r), 0, Math.PI*2);
          ctx.stroke();
          // damage band
          ctx.globalAlpha = 0.25;
          ctx.fillStyle = sw.innerColor;
          ctx.beginPath();
          ctx.arc(ox, oy, rOuter,0,Math.PI*2);
          ctx.arc(ox, oy, innerClamped,0,Math.PI*2,true);
          ctx.fill();
          ctx.restore();
        }
      }
      // Telegraph-Kreispuls wenn aktiv
      if(state.kristof && state.kristof.shockwaveState && state.kristof.shockwaveState.telegraphing){
        const k = state.kristof; const st = k.shockwaveState;
        const tRemain = st.telegraphUntil - state.time; const total = st.telegraphUntil - (st.telegraphUntil - 0.9);
        const prog = Math.max(0, Math.min(1, 1 - tRemain/0.9));
        const pulse = 30 + Math.sin(state.time*6)*6;
        const baseR = 140 + prog*60 + pulse;
        ctx.save();
        ctx.globalAlpha = 0.35;
        ctx.lineWidth = 6;
        ctx.strokeStyle = '#ff4444';
        ctx.beginPath(); ctx.arc(k.x, k.y, baseR, 0, Math.PI*2); ctx.stroke();
        ctx.globalAlpha = 0.12;
        ctx.fillStyle = '#ff0000';
        ctx.beginPath(); ctx.arc(k.x, k.y, baseR*0.7, 0, Math.PI*2); ctx.fill();
        ctx.restore();
      }

      // Feuerfeld Rendering (unter Spieler/Gegner Effekte, über Boden & Shockwaves)
      if(window.fireField && window.fireField.active){
        const f = window.fireField;
        const nowSec = performance.now()/1000;
        const lifeProg = 1 - Math.max(0, f.remaining)/(window.fireFieldConfig.duration||5);
        const pulse = 0.15 + Math.sin(nowSec*5)*0.05;
        ctx.save();
        // Outer glow ring
        const grad = ctx.createRadialGradient(f.x,f.y, f.radius*0.05, f.x,f.y, f.radius*1.05);
        grad.addColorStop(0, 'rgba(255,140,40,0.35)');
        grad.addColorStop(0.45, 'rgba(255,90,10,0.32)');
        grad.addColorStop(1, 'rgba(120,20,0,0.05)');
        ctx.fillStyle = grad;
        ctx.globalCompositeOperation = 'lighter';
        ctx.beginPath();
        if(f.shape==='circle') ctx.arc(f.x, f.y, f.radius, 0, Math.PI*2); else ctx.rect(f.x-f.radius, f.y-f.radius, f.radius*2, f.radius*2);
        ctx.fill();
        ctx.globalCompositeOperation = 'source-over';
        // Inner swirl / ring
        ctx.lineWidth = 4 + 2*Math.sin(nowSec*9 + lifeProg*5);
        ctx.strokeStyle = 'rgba(255,180,90,'+(0.60+pulse)+')';
        ctx.beginPath();
        if(f.shape==='circle') ctx.arc(f.x, f.y, f.radius* (0.78 + 0.14*Math.sin(nowSec*4)), 0, Math.PI*2); else ctx.rect(f.x-f.radius*0.82, f.y-f.radius*0.82, f.radius*1.64, f.radius*1.64);
        ctx.stroke();
        // Center cross (deaktiviert wenn nicht debug)
        if(window.fireFieldDebug){
          ctx.globalAlpha = 0.9;
          ctx.lineWidth=2;
          ctx.strokeStyle='#ffaa66';
          ctx.beginPath(); ctx.moveTo(f.x-10, f.y); ctx.lineTo(f.x+10,f.y); ctx.moveTo(f.x, f.y-10); ctx.lineTo(f.x, f.y+10); ctx.stroke();
        }
        ctx.restore();
        if(window.fireFieldDebug){
          ctx.save();
          ctx.fillStyle='#fff';
          ctx.font='bold 14px monospace';
          const remain = Math.max(0, f.remaining).toFixed(1);
          ctx.textAlign='center'; ctx.textBaseline='middle';
          ctx.fillText(remain+'s', f.x, f.y - f.radius*0.4);
          ctx.restore();
        }
      }
      // Feuerfeld Ziel-Vorschau (wenn targeting aktiv)
      if(window.fireFieldTargeting && window.fireFieldTargeting.active && window.fireFieldConfig){
        const cfg = window.fireFieldConfig; const r = cfg.radius; const mx = mouseX, my = mouseY; const t = performance.now()/1000;
        ctx.save();
        ctx.globalAlpha = 0.5 + 0.25*Math.sin(t*6);
        ctx.setLineDash([10,6]);
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'rgba(255,150,60,0.9)';
        ctx.beginPath(); ctx.arc(mx,my,r,0,Math.PI*2); ctx.stroke();
        ctx.setLineDash([]);
        ctx.globalAlpha = 0.12;
        ctx.fillStyle='rgba(255,90,20,0.35)';
        ctx.beginPath(); ctx.arc(mx,my,r*0.85,0,Math.PI*2); ctx.fill();
        ctx.globalAlpha=1;
        ctx.restore();
      }

      // (Burn Stack Rendering moved after enemy draw for proper layering)

      // GRAUER ARC (Hitbereich) VOR SPIELER/GEGNER
      for(let s=state.slashes.length-1; s>=0; s--){
        const sl=state.slashes[s];
        const t=(state.time-sl.start)/sl.dur;
        if(t>=1){ state.slashes.splice(s,1); continue; }
        const sweep=sl.arc;
        let arcStart, arcEnd;
        if(t < 0.25) {
          const prog = t / 0.25;
          arcStart = sl.angle - sweep/2;
          arcEnd = arcStart + sweep * prog;
        } else if (t < 0.6) {
          arcStart = sl.angle - sweep/2;
          arcEnd = sl.angle + sweep/2;
        } else {
          const prog = (t-0.6)/0.4;
          arcStart = sl.angle - sweep/2 + sweep * prog;
          arcEnd = sl.angle + sweep/2;
        }
        if(ctx && arcEnd > arcStart) {
          ctx.save();
          ctx.globalAlpha = 0.22;
          ctx.beginPath();
          ctx.arc(player.x, player.y, sl.range, arcStart, arcEnd);
          ctx.arc(player.x, player.y, player.r+8, arcEnd, arcStart, true);
          ctx.closePath();
          ctx.fillStyle = '#cccccc';
          ctx.fill();
          ctx.restore();
        }
      }

      // (Fallback Spin Glow entfernt – echte Sprite-Slashes übernehmen jetzt die Darstellung)

      const now = performance.now();
      // Erst alle Gegner-Sprites zeichnen
      for(let i=0;i<state.enemies.length;i++) {
        const e = state.enemies[i];
        const frame = Math.floor((now/125 + i)%6);
        drawEnemy(ctx, e, frame);
        // Burn Tint Overlay
        if(e._fireBurn && e._fireBurn.stacks>0){
          ctx.save();
          const a = Math.min(0.55, 0.18 + 0.18*e._fireBurn.stacks);
          ctx.globalAlpha = a;
          ctx.fillStyle='rgba(255,110,40,0.9)';
          ctx.beginPath(); ctx.arc(e.x, e.y, (e.r||20)*1.0, 0, Math.PI*2); ctx.fill();
          ctx.restore();
        }
        // Schild-Visualisierung für Kristof
        if(e.name==='Kristof' && e.absorbShieldHP>0){
          // Basis pro Gegner jetzt 200 statt 100 -> für Verhältnis Anzeige auf 200 normalisieren
          const ratio = e.absorbShieldHP / Math.max(1, (e.absorbShields*200));
          const pulse = 0.65 + Math.sin(state.time*6)*0.15;
          ctx.save();
          ctx.globalAlpha = 0.45;
          ctx.lineWidth = 3 + 3*ratio;
          ctx.strokeStyle = `rgba(80,160,255,${pulse})`;
          ctx.beginPath();
          ctx.arc(e.x, e.y, e.r + 14 + (1-ratio)*10, 0, Math.PI*2);
          ctx.stroke();
          ctx.globalAlpha = 0.12 * ratio;
          ctx.fillStyle = 'rgba(80,160,255,0.25)';
          ctx.beginPath(); ctx.arc(e.x, e.y, e.r + 10,0,Math.PI*2); ctx.fill();
          ctx.restore();
        }
      }
      // Feuerfeld Burn Stack Anzeigen (jetzt NACH Gegnern damit sichtbar oben)
      if(window.fireField && window.fireField.active && state.enemies){
        ctx.save();
        ctx.font = '12px sans-serif';
        ctx.textAlign='center';
        ctx.textBaseline='middle';
        for(const e of state.enemies){
          if(!e || e.hp<=0) continue;
          // kleiner Inside Ring Indikator auch ohne Stacks
          if(e._fireFieldTemp && e._fireFieldTemp.inside){
            ctx.save();
            const tPulse = 0.5 + 0.5*Math.sin(performance.now()/200 + e.x*0.05);
            ctx.globalAlpha = 0.25 + 0.35*tPulse;
            ctx.strokeStyle='rgba(255,160,80,0.9)';
            ctx.lineWidth=3;
            ctx.beginPath(); ctx.arc(e.x, e.y, (e.r||20)*1.15, 0, Math.PI*2); ctx.stroke();
            ctx.globalAlpha = 0.12 + 0.18*tPulse;
            ctx.fillStyle='rgba(255,90,30,0.4)';
            ctx.beginPath(); ctx.arc(e.x, e.y, (e.r||20)*0.9, 0, Math.PI*2); ctx.fill();
            ctx.restore();
          }
          if(!e._fireBurn) continue;
          const stacks = e._fireBurn.stacks||0; if(stacks<=0) continue;
          // Partikel & Glow
          const pCount = 1 + Math.floor(stacks*0.6);
          for(let pi=0; pi<pCount; pi++) if(Math.random()<0.20){
            const px = e.x + (Math.random()-0.5)*(e.r||20)*0.7;
            const py = e.y - (e.r||24) - 4 - Math.random()*8;
            particle(px, py, 'rgba(255,'+(120+Math.random()*80)+',40,'+(0.55+Math.random()*0.3)+')');
          }
          ctx.save();
          const t2 = performance.now()/1000;
          const flick = 0.35 + 0.25*Math.sin(t2*10 + e.x*0.1 + e.y*0.07);
          ctx.globalAlpha = 0.25 + 0.15*stacks + flick*0.05;
          ctx.fillStyle = 'rgba(255,90,20,0.85)';
          ctx.beginPath();
          ctx.arc(e.x, e.y - (e.r||24)*0.15, (e.r||20) * (1.05 + stacks*0.08), 0, Math.PI*2);
          ctx.fill();
          ctx.restore();
          const label = '🔥'+stacks;
          const tx = e.x; const ty = e.y - (e.r||24) - 14;
          ctx.font = 'bold 13px sans-serif';
          ctx.lineWidth = 3;
          ctx.strokeStyle = 'rgba(0,0,0,0.85)';
          ctx.strokeText(label, tx, ty);
          ctx.fillStyle = 'rgba(255,140,60,0.95)';
          ctx.fillText(label, tx, ty);
        }
        ctx.restore();
      }
      // Vereinheitlichte Damage Floaters (alle Typen)
      if(window.damageFloaters && window.damageFloaters.length){
        ctx.save();
        ctx.textAlign='center';
        ctx.textBaseline='middle';
        for(let i=window.damageFloaters.length-1;i>=0;i--){
          const f = window.damageFloaters[i];
          f.life += dt;
          if(f.life >= f.dur){ window.damageFloaters.splice(i,1); continue; }
          const prog = f.life / f.dur;
          f.y += f.vY * dt;
          f.vY *= 0.94;
          const alpha = 1 - prog;
          const scale = 1 + (f.life<0.18 ? (0.6 * (1 - f.life/0.18)) : 0);
          ctx.save();
          ctx.translate(f.x, f.y);
          ctx.scale(scale, scale);
          ctx.globalAlpha = alpha;
          ctx.font = (f.crit? '900 ':'bold ')+ '14px sans-serif';
          ctx.lineWidth = 3;
          ctx.strokeStyle = f.stroke;
          ctx.strokeText(f.txt, 0, 0);
          ctx.fillStyle = f.color;
          ctx.fillText(f.txt, 0, 0);
          ctx.restore();
        }
        ctx.restore();
      }
      // Dann Truhen wie statische Gegner zeichnen
      if (!Array.isArray(state.chests)) state.chests = [];
      for(const chest of state.chests) {
        drawChest(ctx, chest);
      }

      // Dagger Execute Slash FX (kurzlebige Effekte)
      (function drawExecuteFX(){
        const arr = window.executeFX; if(!arr || !arr.length) return; 
        for(let i=arr.length-1;i>=0;i--){
          const fx = arr[i]; fx.t += dt; const pct = fx.t / (fx.dur||0.25);
          if(pct >= 1){ arr.splice(i,1); continue; }
          const alpha = 0.9 * (1 - pct);
          const R = 68 + 42 * (1 - pct);
          const thick = 26 * (1 - pct*0.6);
          const arc = Math.PI * (0.7 + 0.2*Math.sin(pct*Math.PI));
          ctx.save();
          ctx.translate(fx.x, fx.y);
          ctx.rotate(fx.a||0);
          // Glow
          const glow = ctx.createRadialGradient(0,0, R*0.15, 0,0, R*1.1);
          glow.addColorStop(0, 'rgba(255,255,255,0.9)');
          glow.addColorStop(0.6, 'rgba(247,201,72,0.7)');
          glow.addColorStop(1, 'rgba(247,201,72,0.0)');
          ctx.globalAlpha = alpha * 0.65;
          ctx.globalCompositeOperation = 'lighter';
          ctx.fillStyle = glow;
          ctx.beginPath(); ctx.arc(0,0,R*1.05,-arc/2,arc/2); ctx.arc(0,0,R*0.1,arc/2,-arc/2,true); ctx.closePath(); ctx.fill();
          // Klinge (Sichel)
          const innerR = R - thick;
          ctx.globalAlpha = alpha;
          const bladeGrad = ctx.createLinearGradient(0,-R,0,R);
          bladeGrad.addColorStop(0,'#ffffff');
          bladeGrad.addColorStop(0.5,'#ffe6a6');
          bladeGrad.addColorStop(1,'#f7c948');
          ctx.fillStyle = bladeGrad;
          ctx.beginPath(); ctx.arc(0,0,R,-arc/2,arc/2); ctx.arc(0,0,innerR,arc/2,-arc/2,true); ctx.closePath(); ctx.fill();
          // Scharfe Kante
          ctx.globalAlpha = alpha * 0.9;
          ctx.lineWidth = 2.5;
          ctx.strokeStyle = '#fff';
          ctx.beginPath(); ctx.arc(0,0,R - thick*0.2, -arc/2, arc/2); ctx.stroke();
          ctx.restore();
        }
      })();

      // Dash Aim Indicator (Rechtsklick gehalten)
      (function drawDashAim(){
        const rc = window.rightClickDash; if(!rc || !rc.aim) return;
        const puls = 0.5 + 0.5*Math.sin(performance.now()*0.008);
        const tx = mouseX, ty = mouseY;
        // Distanz clamp Vorschau
        let dx = tx - player.x; let dy = ty - player.y; let dist = Math.hypot(dx,dy)||1;
        let maxD = rc.maxDist||400;
        if(dist > maxD){ const s = maxD / dist; dx*=s; dy*=s; dist = maxD; }
        const fx = player.x + dx; const fy = player.y + dy;
        ctx.save();
        ctx.lineWidth = 3;
        ctx.strokeStyle = 'rgba(120,240,255,0.85)';
        ctx.globalAlpha = 0.85;
        ctx.beginPath(); ctx.moveTo(player.x, player.y); ctx.lineTo(fx, fy); ctx.stroke();
        // Ziel-Kreis
        ctx.globalAlpha = 0.55;
        ctx.beginPath(); ctx.arc(fx, fy, 22 + puls*6, 0, Math.PI*2); ctx.stroke();
        ctx.globalAlpha = 0.18;
        const g = ctx.createRadialGradient(fx,fy,0,fx,fy,40);
        g.addColorStop(0,'rgba(140,255,255,0.6)');
        g.addColorStop(0.5,'rgba(140,255,255,0.25)');
        g.addColorStop(1,'rgba(140,255,255,0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(fx,fy,40,0,Math.PI*2); ctx.fill();
        // Kleiner Progress-Ring (Hold Zeit)
        const held = (performance.now() - rc.aimStart)/1000;
        const prog = Math.min(1, held / rc.minHold);
        ctx.globalAlpha = 0.9;
        ctx.lineWidth = 4;
        ctx.strokeStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(fx, fy, 10, -Math.PI/2, -Math.PI/2 + prog * Math.PI*2); ctx.stroke();
        ctx.restore();
      })();

      // Meteor (prozedural) Target / Aufladen / Fall / Impact
      (function drawMeteor(){
        const m = window.staffMeteor; if(!m) return; const now = performance.now();
        // Zielkreis
        if(m.targeting){ ctx.save(); const puls=0.55+Math.sin(now*0.008)*0.25; ctx.globalAlpha=0.9; ctx.setLineDash([12,7]); ctx.lineWidth=3.2; ctx.strokeStyle='#ffffff'; ctx.beginPath(); ctx.arc(m.targetX,m.targetY,m.radius,0,Math.PI*2); ctx.stroke(); ctx.setLineDash([]); ctx.globalAlpha=0.18; const g=ctx.createRadialGradient(m.targetX,m.targetY,0,m.targetX,m.targetY,m.radius*1.05); g.addColorStop(0,'rgba(255,255,255,0.55)'); g.addColorStop(0.35,'rgba(255,255,255,0.25)'); g.addColorStop(1,'rgba(255,255,255,0)'); ctx.fillStyle=g; ctx.beginPath(); ctx.arc(m.targetX,m.targetY,m.radius,0,Math.PI*2); ctx.fill(); ctx.globalAlpha=0.9; ctx.lineWidth=2.4; ctx.strokeStyle='#ffffff'; ctx.beginPath(); ctx.arc(m.targetX,m.targetY,34+puls*16,0,Math.PI*2); ctx.stroke(); ctx.restore(); }
        // Aufladen über Spieler (nur runder Glow, keine langen Beam-Partikel)
        if(m.summonActive && m.targeting){
          const cx = player.x, cy = player.y - player.r*0.4; const drawR = m.radius*1.9;
          ctx.save();
          ctx.globalCompositeOperation = 'lighter';
          // runder Kern-Glow
          const core = ctx.createRadialGradient(cx,cy,0,cx,cy,drawR*0.4);
          core.addColorStop(0,'rgba(255,255,255,0.9)');
          core.addColorStop(1,'rgba(255,150,60,0)');
          ctx.globalAlpha = 0.9;
          ctx.fillStyle = core;
          ctx.beginPath();
          ctx.arc(cx, cy, drawR*0.4*(0.85+Math.sin(now*0.012)*0.1), 0, Math.PI*2);
          ctx.fill();
          // Summon Partikel (nur runde Punkte)
          try { const rate=(m.summonParticleRate||0)*dt; for(let i=0;i<rate;i++){ if(Math.random()<rate){ const px=cx+(Math.random()-0.5)*(m.summonParticleJitterX||24); const py=cy+ (Math.random()*drawR*0.15)-drawR*0.05; const life=(m.summonParticleLife||0.6)*(0.7+Math.random()*0.6); const vy=(m.summonParticleRise||120)*(0.85+Math.random()*0.3); const vx=(Math.random()-0.5)*18; const rad=4+Math.random()*8; const shade=Math.random(); m.summonParticles.push({x:px,y:py,vx,vy,t:0,life,rad,shade}); } } for(let i=m.summonParticles.length-1;i>=0;i--){ const p=m.summonParticles[i]; p.t+=dt; p.y-=p.vy*dt; p.x+=p.vx*dt*0.5; p.rad*= (1+0.4*dt); if(p.t>=p.life) m.summonParticles.splice(i,1); else { const pr=p.rad; const prog=p.t/p.life; const fade=1-Math.pow(prog,1.4); const hueMix=p.shade*0.4; const rCol=255; const gCol=Math.round(200-80*hueMix); const bCol=Math.round(120-60*hueMix); const grd=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,pr); grd.addColorStop(0,`rgba(${rCol},${gCol},${bCol},${0.9*fade})`); grd.addColorStop(0.55,`rgba(${rCol},${gCol-40},${Math.max(0,bCol-80)},${0.45*fade})`); grd.addColorStop(1,`rgba(${rCol},${gCol-40},${Math.max(0,bCol-80)},0)`); ctx.globalAlpha=0.25+0.45*fade; ctx.fillStyle=grd; ctx.beginPath(); ctx.arc(p.x,p.y,pr,0,Math.PI*2); ctx.fill(); } } } catch(ex){} ctx.restore(); }
        // Fallende Kugel währen windup
        if(m.state==='windup'){ const fallDur=m.procFallDur||0.55; const fallProg=Math.min(1,(m.windupT||0)/fallDur); const want=(m.procTrailRate||90)*(1/60); for(let i=0;i<want;i++) if(Math.random()<want){ m.procFallTrail.push({x:player.x,y:player.y-player.r*0.4 - fallProg*260,life:m.procTrailLife||0.55,t:0}); } for(let i=m.procFallTrail.length-1;i>=0;i--){ const tr=m.procFallTrail[i]; tr.t+=1/60; const lt=tr.t/tr.life; if(lt>=1){ m.procFallTrail.splice(i,1); continue;} ctx.save(); ctx.globalAlpha=(1-lt)*0.45; ctx.fillStyle='#ffd7a0'; ctx.beginPath(); ctx.arc(tr.x,tr.y,12*(1-lt),0,Math.PI*2); ctx.fill(); ctx.restore(); } const startY=player.y-player.r*0.4-260; const curX=player.x+(m.targetX-player.x)*fallProg*0.15; const curY=startY+(m.targetY-startY)*Math.pow(fallProg,0.85); ctx.save(); ctx.translate(curX,curY); const bodyR=34+fallProg*18; const pulse=1+Math.sin(now*0.012)*0.08; const core=ctx.createRadialGradient(0,0,bodyR*0.15,0,0,bodyR); core.addColorStop(0,'rgba(255,240,200,0.85)'); core.addColorStop(0.45,'rgba(255,170,60,0.75)'); core.addColorStop(0.9,'rgba(255,120,0,0)'); ctx.globalAlpha=0.95; ctx.fillStyle=core; ctx.beginPath(); ctx.arc(0,0,bodyR*pulse,0,Math.PI*2); ctx.fill(); ctx.globalAlpha=0.6; ctx.strokeStyle='rgba(255,210,140,0.9)'; ctx.lineWidth=3; const lines=5; for(let i=0;i<lines;i++){ const a=now*0.0015+i*(Math.PI*2/lines); ctx.beginPath(); ctx.arc(0,0,bodyR*0.6,a,a+Math.PI*0.5); ctx.stroke(); } ctx.restore(); }
        // Impact
        if(m.state==='impact'){ const prog=Math.min(1,(m.animT||0)/(m.animDur||1)); const swT=Math.min(1, prog/(m.procShockwaveDur||0.6)); if(swT<1){ const swR=m.radius*(1+(m.procShockwaveMaxScale-1)*swT); ctx.save(); ctx.globalAlpha=(1-swT)*0.55; ctx.lineWidth=6*(1-swT*0.7); ctx.strokeStyle='rgba(255,255,255,'+(0.85*(1-swT))+')'; ctx.beginPath(); ctx.arc(m.targetX,m.targetY,swR,0,Math.PI*2); ctx.stroke(); ctx.globalAlpha*=0.6; ctx.lineWidth=2; ctx.beginPath(); ctx.arc(m.targetX,m.targetY,swR*0.78,0,Math.PI*2); ctx.stroke(); ctx.restore(); } const flashT=(m.animT||0) < (m.procImpactFlashDur||0.18) ? 1 - (m.animT/(m.procImpactFlashDur||0.18)) : 0; if(flashT>0){ ctx.save(); ctx.globalCompositeOperation='lighter'; ctx.globalAlpha=flashT*0.55; const grad=ctx.createRadialGradient(m.targetX,m.targetY,0,m.targetX,m.targetY,m.radius*2.2); grad.addColorStop(0,'rgba(255,250,230,0.95)'); grad.addColorStop(0.4,'rgba(255,200,120,0.55)'); grad.addColorStop(1,'rgba(255,120,0,0)'); ctx.fillStyle=grad; ctx.beginPath(); ctx.arc(m.targetX,m.targetY,m.radius*2.2,0,Math.PI*2); ctx.fill(); ctx.restore(); } const corePulse=1+Math.sin(now*0.009*(m.procCorePulseFreq||1.2))*(m.procCorePulseAmp||0.25)*(1-prog); ctx.save(); const cgrad=ctx.createRadialGradient(m.targetX,m.targetY,0,m.targetX,m.targetY,m.radius*1.3); cgrad.addColorStop(0,'rgba(255,230,160,'+(0.65*(1-prog))+')'); cgrad.addColorStop(0.45,'rgba(255,150,50,'+(0.45*(1-prog))+')'); cgrad.addColorStop(1,'rgba(255,120,0,0)'); ctx.globalAlpha=0.85*(1-prog); ctx.fillStyle=cgrad; ctx.beginPath(); ctx.arc(m.targetX,m.targetY,m.radius*0.85*corePulse,0,Math.PI*2); ctx.fill(); ctx.restore(); const wantE=(m.procEmberRate||120)*(1/60); for(let i=0;i<wantE;i++) if(Math.random()<wantE){ m.procEmbers.push({x:m.targetX,y:m.targetY,a:Math.random()*Math.PI*2,t:0,life:m.procEmberLife||0.6,r:3+Math.random()*3}); } for(let i=m.procEmbers.length-1;i>=0;i--){ const e=m.procEmbers[i]; e.t+=1/60; const lt=e.t/e.life; if(lt>=1){ m.procEmbers.splice(i,1); continue;} const dist=(m.radius*0.4)+lt*m.radius*1.6; const x=e.x+Math.cos(e.a)*dist; const y=e.y+Math.sin(e.a)*dist; ctx.save(); ctx.globalAlpha=(1-lt)*0.8; ctx.fillStyle='#ffd8a0'; ctx.beginPath(); ctx.arc(x,y, e.r*(1-lt*0.5),0,Math.PI*2); ctx.fill(); ctx.restore(); } }
      })();

      // Curse Target/Impact
      ;(function drawCurse(){
        const c = window.curseSkill; if(!c) return;
        if(c.targeting){
          // Zielkreis mit unabhängigem vertikalem Offset
          const circleY = c.targetY + (c.circleYOffsetFrac||0) * c.radius;
          ctx.save();
          const puls = 0.55 + Math.sin(performance.now()*0.009)*0.25;
          ctx.globalAlpha = 0.85;
          ctx.setLineDash([10,6]);
            ctx.lineWidth = 3;
          ctx.strokeStyle = '#ffffff';
          ctx.beginPath(); ctx.arc(c.targetX, circleY, c.radius*0.3, 0, Math.PI*2); ctx.stroke();
          ctx.setLineDash([]);
          ctx.globalAlpha = 0.16;
          const g = ctx.createRadialGradient(c.targetX, circleY, 0, c.targetX, circleY, c.radius*1.05*0.3);
          g.addColorStop(0,'rgba(255,255,255,0.55)');
          g.addColorStop(0.4,'rgba(255,255,255,0.25)');
          g.addColorStop(1,'rgba(255,255,255,0)');
          ctx.fillStyle = g; ctx.beginPath(); ctx.arc(c.targetX, circleY, c.radius*0.3,0,Math.PI*2); ctx.fill();
          ctx.globalAlpha = 0.9;
          ctx.lineWidth = 2.2;
          ctx.strokeStyle = '#ffffff';
          ctx.beginPath(); ctx.arc(c.targetX, circleY, 30 + puls*12, 0, Math.PI*2); ctx.stroke();
          ctx.restore();
        }
        if(c.state==='impact'){
          const prog = Math.min(1, (c.zoneT || 0) / Math.max(0.0001, c.zoneDuration||1));
          const pulse = 1 + Math.sin(performance.now()*0.002*Math.PI * c.procPulseFreq) * c.procPulseAmp * (1 - prog*0.65);
          const drawR = c.radius * 1.25 * 0.3 * pulse;
          const cYOff = ((c.spriteYOffsetFrac||0) + (c.impactExtraYOffsetFrac||0)) * drawR;
          ctx.save(); ctx.translate(c.targetX, c.targetY + cYOff);
          // Core Glow
          const core = ctx.createRadialGradient(0,0, drawR*0.05, 0,0, drawR*0.9);
          core.addColorStop(0,'rgba(255,255,255,'+(0.55*(1-prog*0.4))+')');
          core.addColorStop(0.35,'rgba(255,200,120,'+(0.35*(1-prog))+')');
          core.addColorStop(0.9,'rgba(255,140,40,0)');
          ctx.globalAlpha = 0.95;
          ctx.fillStyle = core; ctx.beginPath(); ctx.arc(0,0, drawR*0.9, 0, Math.PI*2); ctx.fill();
          // Ränder
          ctx.globalAlpha = 0.55*(1-prog*0.6);
          ctx.lineWidth = 4;
          ctx.strokeStyle = 'rgba(255,255,255,0.9)';
          ctx.beginPath(); ctx.arc(0,0, drawR*0.92, 0, Math.PI*2); ctx.stroke();
          ctx.globalAlpha = 0.35*(1-prog);
          ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(0,0, drawR*0.72, 0, Math.PI*2); ctx.stroke();
          // Runen
          const rot = (performance.now()*0.001 * c.procRotSpeed * Math.PI*2 * c.procRotDir) % (Math.PI*2);
          for(let i=0;i<c.procRuneCount;i++){
            const a = rot + i*(Math.PI*2/c.procRuneCount);
            const rr = drawR * (c.procRuneInnerFrac + (c.procRuneOuterFrac - c.procRuneInnerFrac) * (0.5 + 0.5*Math.sin(a*2 + prog*3)));
            ctx.save(); ctx.rotate(a); ctx.translate(rr,0);
            const size = c.procRuneSize * (0.75 + 0.25*Math.sin(a*3 + prog*4));
            ctx.globalAlpha = 0.85 * (1 - prog*0.55);
            ctx.fillStyle = '#ffffff';
            ctx.beginPath(); ctx.moveTo(-size*0.4, -size*0.4); ctx.lineTo(size*0.5, 0); ctx.lineTo(-size*0.4, size*0.4); ctx.closePath(); ctx.fill();
            ctx.globalAlpha *= 0.55; ctx.strokeStyle = '#ffaa55'; ctx.lineWidth = 1.3; ctx.stroke();
            ctx.restore();
          }
          // Inward Particles
          const want = c.procInwardParticleRate * (1/60);
          for(let k=0;k<want;k++) if(Math.random()<want){ c.procParticles.push({a:Math.random()*Math.PI*2,r:drawR*(0.95+Math.random()*0.25),life:c.procInwardParticleLife,t:0,rot:Math.random()*Math.PI*2,spd:drawR*(0.35+Math.random()*0.25)}); }
          for(let i=c.procParticles.length-1;i>=0;i--){
            const p=c.procParticles[i]; p.t+=1/60; const lt=p.t/p.life; if(lt>=1){ c.procParticles.splice(i,1); continue; }
            p.r -= p.spd*(1/60); const x=Math.cos(p.a)*p.r; const y=Math.sin(p.a)*p.r; ctx.save(); ctx.translate(x,y); ctx.rotate(p.rot + lt*4);
            const fade=(1-lt); ctx.globalAlpha=0.5*fade*(1-prog*0.4); ctx.fillStyle='#ffffff'; ctx.beginPath(); ctx.arc(0,0, 3+2*fade, 0, Math.PI*2); ctx.fill(); ctx.restore();
          }
          ctx.globalCompositeOperation='source-over';
          // Weißer Hit-Ring Effekt
          try {
            if(c.hitRingEnabled){
              const ringProg = prog; // 0..1
              if(ringProg >= (c.hitRingGrowStart||0)){
                const local = (ringProg - c.hitRingGrowStart) / Math.max(0.0001, (1 - c.hitRingGrowStart));
                const fadeStart = c.hitRingFadeStart||0.6;
                const fadeT = ringProg < fadeStart ? 0 : (ringProg - fadeStart) / Math.max(0.0001, 1 - fadeStart);
                const alpha = (1 - Math.min(1, fadeT)) * 0.95;
                const grow = Math.min(1, local);
                const outerR = c.radius * (c.hitRingMaxScale || 1.3) * (0.75 + 0.25*grow);
                ctx.save();
                // Glow Layer
                if(c.hitRingInnerGlow){
                  const g = ctx.createRadialGradient(0,0,outerR*0.15,0,0,outerR*0.95);
                  g.addColorStop(0,'rgba(255,255,255,'+(0.45*alpha)+')');
                  g.addColorStop(0.35,'rgba(255,255,255,'+(0.25*alpha)+')');
                  g.addColorStop(0.7,'rgba(255,255,255,'+(0.10*alpha)+')');
                  g.addColorStop(1,'rgba(255,255,255,0)');
                  ctx.globalAlpha = 1;
                  ctx.fillStyle = g;
                  ctx.beginPath(); ctx.arc(0,0,outerR*0.95,0,Math.PI*2); ctx.fill();
                }
                // Haupt-Ring
                ctx.lineWidth = (c.hitRingLineWidth||6) * (0.85 + 0.15*Math.sin(performance.now()*0.015));
                ctx.strokeStyle = 'rgba(255,255,255,'+alpha.toFixed(3)+')';
                ctx.beginPath(); ctx.arc(0,0,outerR,0,Math.PI*2); ctx.stroke();
                // Zweiter dünner Ring
                if(c.hitRingDouble){
                  ctx.lineWidth = 2.2;
                  ctx.globalAlpha = alpha * 0.9;
                  ctx.beginPath(); ctx.arc(0,0,outerR*0.82,0,Math.PI*2); ctx.stroke();
                }
                // Funken-Kringel (sporadisch)
                if(Math.random()<0.18 && alpha>0.2){
                  const sparks = 4;
                  for(let i=0;i<sparks;i++){
                    const ang = Math.random()*Math.PI*2;
                    const rr = outerR * (0.65 + Math.random()*0.35);
                    const sx = Math.cos(ang)*rr;
                    const sy = Math.sin(ang)*rr;
                    ctx.save();
                    ctx.translate(sx, sy);
                    ctx.globalAlpha = alpha * (0.55+Math.random()*0.4);
                    ctx.fillStyle = '#ffffff';
                    ctx.beginPath(); ctx.arc(0,0, 2 + Math.random()*1.8, 0, Math.PI*2); ctx.fill();
                    ctx.restore();
                  }
                }
                ctx.restore();
              }
            }
          } catch(_err){}
          ctx.restore();
        }
      })();

      // Schatten beim Sprung
      if(player.isJumping){
        const shadowScale = 1 - (player.jumpOffset / (player.jumpHeight||1)) * 0.4;
        ctx.save();
        ctx.globalAlpha = 0.35;
        ctx.beginPath();
        ctx.ellipse(player.x, player.y + player.r*0.6, player.r*1.4*shadowScale, player.r*0.55*shadowScale, 0, 0, Math.PI*2);
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fill();
        ctx.restore();
  // Debug Kreis um Sprunghöhe anzuzeigen
  // Debug-Kreis deaktiviert (unsichtbar, bleibt im Code für spätere Nutzung)
  ctx.save();
  ctx.globalAlpha = 0.0; // auf 0 gesetzt -> unsichtbar
  ctx.strokeStyle = '#ffee00';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(player.x, player.y - (player.jumpOffset||0) - 10, player.r + 18, 0, Math.PI*2);
  ctx.stroke();
  ctx.restore();
  // Debug-Text unsichtbar belassen für spätere Reaktivierung
  ctx.save();
  ctx.globalAlpha = 0.0;
  ctx.font = '12px monospace';
  ctx.fillStyle = '#fff';
  ctx.fillText('JUMP '+Math.round(player.jumpOffset||0), player.x+18, player.y- (player.jumpOffset||0) - 24);
  ctx.restore();
      }

      // --- Spieler Sprite (Bully) Zeichnen mit Idle/Walk Wechsel ---
      (function drawPlayerSprite(){
        if(!window.selectedCharacter) return; // kein Charakter ausgewählt
        const ch = window.selectedCharacter.toLowerCase();
        if(ch !== 'bully') return; // aktuell nur Bully animieren
        const anim = spriteAnimations.bully;
        if(!anim) return;
        // Aktuelle Waffe ermitteln und ggf. Sprite Sheets wechseln
        try {
          if(typeof player !== 'undefined' && Array.isArray(window.weapons)){
            const w = window.weapons[player.weaponIndex];
            if(w && typeof loadBullySheets === 'function') loadBullySheets(w.id||w.name||'');
          }
        } catch(_){}
        // Bewegungsgeschwindigkeit ermitteln
        const speed = Math.hypot(player.vx||0, player.vy||0);
        const moving = speed > 4; // Schwellwert
        // Sheet auswählen
        const sheet = moving ? anim.walkSheet : anim.idleSheet;
        if(!sheet || !sheet.complete || !sheet.naturalWidth) return; // noch nicht geladen
        // Frames dynamisch aus Breite ableiten (64x64 Tiling)
        const frameSize = 64;
        const frames = Math.max(1, Math.floor(sheet.naturalWidth / frameSize));
        // Richtungsbestimmung (letzte Richtung merken)
        if(typeof player._bullyLastDir !== 'string') player._bullyLastDir = 'down';
        if(moving){
          const ax = Math.abs(player.vx||0), ay = Math.abs(player.vy||0);
            if(ax > ay){
              player._bullyLastDir = (player.vx > 0) ? 'right' : 'left';
            } else if(ay > 0){
              player._bullyLastDir = (player.vy > 0) ? 'down' : 'up';
            }
        }
        // Reihenanzahl erkennen
        const rows = Math.max(1, Math.floor(sheet.naturalHeight / frameSize));
        let rowIndex = 0;
        if(rows > 1){
          // Mapping basierend auf ursprünglicher directions Reihenfolge ["up","left","down","right"]
          const dirOrder = ['up','left','down','right'];
          const idx = dirOrder.indexOf(player._bullyLastDir);
          rowIndex = idx >= 0 ? idx : 2; // fallback 'down'
          if(rowIndex >= rows) rowIndex = rows-1;
        }
        // Zeit/Aktuelle Frame hochzählen
        if(typeof player._animTime !== 'number') player._animTime = 0;
        if(typeof player._animFrame !== 'number') player._animFrame = 0;
        if(typeof player._lastAnimMoving !== 'boolean') player._lastAnimMoving = moving;
        // Wenn sich der Status (idle<->walk) ändert, Frame & Zeit zurücksetzen für sauberen Start
        if(player._lastAnimMoving !== moving){
          player._animTime = 0; player._animFrame = 0; player._lastAnimMoving = moving;
        }
        // Delta Zeit geschätzt: Wir haben hier kein dt, daher approximieren über Performance.now()
        const nowT = performance.now();
        if(!player._lastAnimTs) player._lastAnimTs = nowT;
        const dtMs = nowT - player._lastAnimTs; player._lastAnimTs = nowT;
        const dt = dtMs / 1000;
        const fps = moving ? 9 : 5; // unterschiedliche Geschwindigkeiten
        player._animTime += dt;
        const total = 1 / fps; // Zeit pro Frame
        while(player._animTime >= total){
          player._animTime -= total;
          player._animFrame = (player._animFrame + 1) % frames;
        }
        // Zeichnen (größer + Füße am gleichen Punkt halten)
        const fx = player._animFrame * frameSize;
        const fy = rowIndex * frameSize;
        const scale = (window.bullyScale || 1.55); // Standard-Vergrößerung
        const drawSize = frameSize * scale;
        ctx.save();
        // Feet-Anker: wir wollen dass die Füße am selben Bodenpunkt bleiben -> nach oben skalieren
        const feetY = player.y - (player.jumpOffset||0) + (frameSize/2); // ursprünglicher halber Offset
        ctx.drawImage(sheet, fx, fy, frameSize, frameSize,
          player.x - drawSize/2,
          feetY - drawSize,
          drawSize, drawSize);
        ctx.restore();
        // Debug optional: window.showBullyFeet && ...
      })();

        // Enhanced Halberd Charge Bar (segmented, glow, stats)
        ;(function drawHalberdChargeBar(){
          const hu = window.halberdUlt; if(!hu || hu.state!=='charging' || !player) return;
          const charge = Math.min(hu.chargeTime, hu.maxCharge);
          const pct = charge / hu.maxCharge; // 0..1
          const barW = 160, barH = 14; // verkleinert
          const pad = 5;
          const x = player.x - barW/2;
          const y = player.y - (player.r||24) - 48; // etwas näher am Kopf
          const now = performance.now();
          ctx.save();
          ctx.globalAlpha = 0.95;
          // Hintergrund (Glass + Border)
          const backGrad = ctx.createLinearGradient(x, y, x, y+barH+pad*2);
          backGrad.addColorStop(0,'rgba(18,16,14,0.92)');
          backGrad.addColorStop(1,'rgba(28,24,20,0.92)');
          ctx.fillStyle = backGrad;
          ctx.beginPath();
          ctx.roundRect(x-pad, y-pad, barW+pad*2, barH+pad*2, 10);
          ctx.fill();
          ctx.lineWidth = 1.5;
          ctx.strokeStyle = 'rgba(255,190,80,0.35)';
          ctx.stroke();
          // Hintergrund-Inset
          ctx.save();
          ctx.clip();
          ctx.globalAlpha = 0.20;
          ctx.fillStyle = '#000';
          ctx.fillRect(x-pad, y-pad, barW+pad*2, barH+pad*2);
          ctx.restore();
          // Ladeverlauf (Segmentierter Farbverlauf)
          const progGrad = ctx.createLinearGradient(x, y, x+barW, y);
          progGrad.addColorStop(0, '#18d463');
          progGrad.addColorStop(0.35, '#b6d400');
          progGrad.addColorStop(0.65, '#ff9a00');
          progGrad.addColorStop(1, '#ff1a00');
          ctx.fillStyle = progGrad;
          const innerW = barW * pct;
          ctx.beginPath();
          ctx.roundRect(x, y, innerW, barH, 6);
          ctx.fill();
          // Inner Glow Puls
          const pulseA = 0.25 + 0.25 * Math.sin(now * 0.008 + pct * 4);
          ctx.globalAlpha = pulseA;
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(x, y, innerW, barH * 0.32);
          ctx.globalAlpha = 1;
          // Segment Ticks (jede Sekunde / maxCharge)
          ctx.save();
          ctx.lineWidth = 2;
          for(let s=1; s<hu.maxCharge; s++){
            const sx = x + (s/hu.maxCharge) * barW;
            ctx.globalAlpha = s/hu.maxCharge < pct ? 0.55 : 0.25;
            ctx.strokeStyle = s/hu.maxCharge <= pct ? '#ffe6a8' : '#555';
            ctx.beginPath();
            ctx.moveTo(sx, y-2);
            ctx.lineTo(sx, y+barH+2);
            ctx.stroke();
          }
          ctx.restore();
          // 90% Warnung (Vorbereitungs-Ring über Spieler)
          if(pct >= 0.9){
            const warnA = 0.35 + 0.25*Math.sin(now*0.02);
            ctx.globalAlpha = warnA;
            ctx.strokeStyle = '#ff4d00';
            ctx.lineWidth = 3 + 2*Math.sin(now*0.015 + pct*10);
            ctx.beginPath();
            ctx.arc(player.x, player.y, (player.r||24)+34 + 4*Math.sin(now*0.01), 0, Math.PI*2);
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
          // Keine Textanzeige (Prozent / Multiplier entfernt)
          // Edge Shine Mask (leichtes Gloss am oberen Rand)
          const shineA = 0.18 + 0.18*Math.sin(now*0.01 + pct*6);
          ctx.globalAlpha = shineA;
          ctx.beginPath();
          ctx.roundRect(x+2, y+2, barW-4, barH*0.45, 4);
          const shineGrad = ctx.createLinearGradient(x, y, x, y+barH*0.45);
          shineGrad.addColorStop(0,'rgba(255,255,255,0.55)');
          shineGrad.addColorStop(1,'rgba(255,255,255,0.0)');
          ctx.fillStyle = shineGrad;
          ctx.fill();
          ctx.globalAlpha = 1;
          // Außen Glow je nach Füllung verstärken
          const glow = 5 + 22 * pct; // etwas dezenter
          ctx.save();
          ctx.shadowColor = 'rgba(255,'+Math.round(120+120*pct)+',40,'+(0.35+0.4*pct)+')';
          ctx.shadowBlur = glow;
          ctx.globalCompositeOperation = 'lighter';
          ctx.beginPath();
          ctx.roundRect(x-pad, y-pad, barW+pad*2, barH+pad*2, 10);
          ctx.strokeStyle = 'rgba(255,160,40,'+(0.15+0.2*pct)+')';
          ctx.lineWidth = 1.2;
          ctx.stroke();
          ctx.restore();
          ctx.restore();
        })();

      // Truhen-Treffer durch Spielerangriff prüfen (z.B. bei Slash, Projektil, etc.)
      // Beispiel: Im Angriffscode nach Gegner-Treffer auch hitChestAt(EnemyX, EnemyY) aufrufen
      // Dann das grüne DoT-Blinken als Overlay für alle mit aktivem DoT (nur solange Timer läuft)
      for(let i=0;i<state.enemies.length;i++) {
        const e = state.enemies[i];
        // Neuer Gift/Poison Effekt: unterstützt Stack-basiertes System
        if(e.daggerDot && e.hp > 0){
          if(Array.isArray(e.daggerDot.stacks) && e.daggerDot.stacks.length){
            const stackCount = e.daggerDot.stacks.length;
            const pulse = 0.55 + 0.35 * Math.sin(performance.now()*0.004 + e.x*0.05 + e.y*0.05);
            ctx.save();
            // Pulsierende Aura (Größe wächst leicht mit Stacks)
            const auraR = e.r + 14 + stackCount*3 + pulse*2;
            const g = ctx.createRadialGradient(e.x, e.y, e.r*0.2, e.x, e.y, auraR);
            g.addColorStop(0, 'rgba(40,255,120,0.25)');
            g.addColorStop(0.35,'rgba(40,255,120,0.18)');
            g.addColorStop(0.7, 'rgba(20,120,60,0.08)');
            g.addColorStop(1, 'rgba(10,60,30,0.0)');
            ctx.globalAlpha = 0.65;
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.arc(e.x,e.y,auraR,0,Math.PI*2);
            ctx.fill();
            // Kreis-Ring außen
            ctx.globalAlpha = 0.35 + 0.15 * Math.sin(performance.now()*0.008 + stackCount);
            ctx.strokeStyle = 'rgba(60,255,140,0.75)';
            ctx.lineWidth = 2 + stackCount*0.7;
            ctx.beginPath(); ctx.arc(e.x,e.y,auraR-4,0,Math.PI*2); ctx.stroke();
            // Kleine Funken / Giftpartikel (sparsam)
            if(Math.random() < 0.10){
              const ang = Math.random()*Math.PI*2;
              const rr = e.r + 8 + Math.random()* (10+stackCount*5);
              particle(e.x + Math.cos(ang)*rr, e.y + Math.sin(ang)*rr, 'rgba(80,255,140,0.12)');
            }
            // Stack Marker (Punkte) über Gegner
            const markerY = e.y - e.r - 10;
            for(let s=0;s<stackCount;s++){
              const off = (s - (stackCount-1)/2) * 10;
              ctx.globalAlpha = 0.85;
              ctx.fillStyle = '#34ff89';
              ctx.beginPath(); ctx.arc(e.x + off, markerY, 3.5, 0, Math.PI*2); ctx.fill();
              ctx.strokeStyle = '#0d4725'; ctx.lineWidth = 1; ctx.stroke();
            }
            ctx.restore();
          } else if(e.daggerDot.active && typeof e.daggerDot.t === 'number' && typeof e.daggerDot.dur === 'number' && e.daggerDot.t < e.daggerDot.dur){
            // Fallback alter Single-DoT Effekt
            ctx.save();
            ctx.globalAlpha = 0.22 + 0.16 * Math.abs(Math.sin(performance.now() * 0.012));
            ctx.beginPath();
            ctx.arc(e.x, e.y, e.r + 18, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fillStyle = 'rgba(0,255,136,0.28)';
            ctx.shadowColor = 'rgba(0,255,136,0.22)';
            ctx.shadowBlur = 28;
            ctx.fill();
            ctx.restore();
          }
        }
      }




  
      for(const s of state.sweeps){
        const t = Math.max(0, Math.min(1, (state.time - s.startTime) / s.dur));
        // Vereinfachte Halberd-Ult: IMMER ein 360° Ring (kein Beam / keine Phasen)
        if(s.isHalberdUlt) {
          ctx.save();
          ctx.translate(player.x, player.y);
          // Expansion Ease (leicht beschleunigt)
          const ease = (x=>x*x*(3-2*x))(t);
          const maxR = s.radius;
          const innerR = maxR * (0.15 + 0.15 * ease); // dünner Kern
          const curR = innerR + (maxR - innerR) * ease;
          const ringThickness = Math.max(22, s.width * 0.8 * (1 - 0.35*ease));
          // Impact Flash (kurz am Anfang)
          if(t < 0.15){
            const flashA = 0.55 * (1 - t/0.15);
            ctx.globalAlpha = flashA;
            ctx.beginPath(); ctx.arc(0,0, curR*0.55, 0, Math.PI*2); ctx.fillStyle = '#fffbe6'; ctx.fill();
          }
          // Inner Glow Puls
          ctx.globalAlpha = 0.35 + 0.25 * Math.sin(performance.now()*0.012 + t*5);
          let glowGrad = ctx.createRadialGradient(0,0,0, 0,0, curR);
          glowGrad.addColorStop(0, 'rgba(255,255,255,0.15)');
          glowGrad.addColorStop(0.4, s.color+'55');
          glowGrad.addColorStop(0.75, s.color+'10');
          glowGrad.addColorStop(1, 'rgba(255,255,255,0)');
          ctx.fillStyle = glowGrad;
          ctx.beginPath(); ctx.arc(0,0, curR, 0, Math.PI*2); ctx.fill();
          // Ring selbst
          ctx.globalAlpha = 0.9 - 0.6 * ease;
          ctx.lineWidth = ringThickness;
          ctx.strokeStyle = '#fff';
          ctx.shadowColor = s.color;
          ctx.shadowBlur = 48;
          ctx.beginPath(); ctx.arc(0,0, curR, 0, Math.PI*2); ctx.stroke();
          // Farbiger Kern-Rand (zweiter Ring)
          ctx.globalAlpha = 0.85 - 0.65 * ease;
          ctx.lineWidth = Math.max(6, ringThickness * 0.35);
            const edgeGrad = ctx.createLinearGradient(-curR,0,curR,0);
            edgeGrad.addColorStop(0,'#ffe9b0');
            edgeGrad.addColorStop(0.5, s.color);
            edgeGrad.addColorStop(1,'#ff5a00');
            ctx.strokeStyle = edgeGrad;
          ctx.beginPath(); ctx.arc(0,0, curR, 0, Math.PI*2); ctx.stroke();
          // Funken / Partikel während Ausdehnung
          for(let i=0;i<10;i++){
            if(Math.random()<0.35){
              const ang = Math.random()*Math.PI*2;
              const rr = curR * (0.75 + Math.random()*0.3);
              ctx.globalAlpha = 0.25 + 0.25*Math.random();
              ctx.fillStyle = 'rgba(255,'+(120+Math.floor(Math.random()*100))+',40,0.9)';
              ctx.beginPath(); ctx.arc(Math.cos(ang)*rr, Math.sin(ang)*rr, 3+Math.random()*4, 0, Math.PI*2); ctx.fill();
            }
          }
          // Abschluss: leicht verblassender Restkreis
          if(t>0.7){
            const fade = (t-0.7)/0.3;
            ctx.globalAlpha = Math.max(0, 0.4 - 0.4*fade);
            ctx.lineWidth = 4;
            ctx.strokeStyle = s.color;
            ctx.beginPath(); ctx.arc(0,0, curR, 0, Math.PI*2); ctx.stroke();
          }
          ctx.restore();
          continue;
        }
        // Default: original sweep rendering for non-Halberd sweeps
        const angleNow = s.angle + Math.PI*2 * t;
        const halfWidth = Math.atan2(s.width * 1.25, s.radius) || 0.28;
        ctx.save();
        ctx.translate(player.x, player.y);
        ctx.rotate(angleNow);
        const r0 = (player.effectiveR||player.r) + 8;
        const r1 = s.radius;
        const grd = ctx.createRadialGradient(0,0,r0, 0,0,r1);
        grd.addColorStop(0,'rgba(255,255,255,0.0)');
        grd.addColorStop(0.3, '#cccccc22');
        grd.addColorStop(0.7, '#cccccc66');
        grd.addColorStop(1,'rgba(255,255,255,0.0)');
        ctx.globalAlpha = 0.38 + 0.22 * Math.sin(performance.now()*0.008 + t*2);
        ctx.beginPath();
        ctx.moveTo(0,0);
        ctx.arc(0,0, r1, -halfWidth, halfWidth);
        ctx.lineTo(0,0);
        ctx.closePath();
        ctx.shadowColor = '#cccccc';
        ctx.shadowBlur = 32;
        ctx.fillStyle = grd;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 0.7 - 0.5 * t;
        ctx.strokeStyle = '#fff8';
        ctx.lineWidth = Math.max(10, s.width*0.9);
        ctx.beginPath();
        ctx.arc(0,0, r1-6, -halfWidth, halfWidth);
        ctx.stroke();
        ctx.globalAlpha = 0.25;
        ctx.strokeStyle = '#cccccc';
        ctx.lineWidth = Math.max(4, s.width*0.5);
        ctx.beginPath();
        ctx.arc(0,0, r1-16, -halfWidth, halfWidth);
        ctx.stroke();
        ctx.restore();
      }

      for(const p of state.projectiles){
        if(p.type === 'daggerDotPierce') {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(Math.atan2(p.vy, p.vx));
          // Klinge: metallischer Farbverlauf
          const grad = ctx.createLinearGradient(0, 0, 28, 0);
          grad.addColorStop(0, '#e0e0e0');
          grad.addColorStop(0.5, '#b0b0b0');
          grad.addColorStop(1, '#888');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(22, -6);
          ctx.lineTo(28, 0);
          ctx.lineTo(22, 6);
          ctx.closePath();
          ctx.fill();
          // Klingenrand
          ctx.strokeStyle = '#333';
          ctx.lineWidth = 2.2;
          ctx.stroke();
          // Dolchgriff
          ctx.save();
          ctx.translate(-2, 0);
          ctx.rotate(Math.PI/16);
          ctx.fillStyle = '#5a3c1a';
          ctx.fillRect(-3, -3, 7, 6);
          ctx.restore();
          // Parierstange
          ctx.save();
          ctx.translate(2, 0);
          ctx.rotate(Math.PI/2);
          ctx.fillStyle = '#c2b280';
          ctx.fillRect(-5, -1.5, 10, 3);
          ctx.restore();
          ctx.restore();
          ctx.restore();
          continue;
        }
        for(const t of p.trail){
          const baseLife = (p.type === 'moonSlash') ? (p.trailLife || 0.40) : (p.trailLife || 0.25);
          ctx.globalAlpha = Math.max(0, t.life/baseLife) * (p.type==='moonSlash'?0.75:0.55);
          if(p.type==='fireball'){
            const g = ctx.createRadialGradient(t.x, t.y, 0, t.x, t.y, 6);
            g.addColorStop(0,'#fff7e6');
            g.addColorStop(0.35,'#ffd27a');
            g.addColorStop(0.7,'#ff8c00');
            g.addColorStop(1,'#ff450000');
            ctx.fillStyle = g;
            ctx.beginPath(); ctx.arc(t.x,t.y,6,0,Math.PI*2); ctx.fill();
          } else if(p.type==='moonSlash'){
            const g = ctx.createRadialGradient(t.x, t.y, 0, t.x, t.y, 10);
            g.addColorStop(0, p.colorInner || '#ffffff');
            g.addColorStop(0.5, (p.colorOuter||'#6bd3ff')+'aa');
            g.addColorStop(1, (p.colorOuter||'#6bd3ff')+'00');
            ctx.fillStyle = g;
            ctx.beginPath(); ctx.arc(t.x,t.y,10,0,Math.PI*2); ctx.fill();
          } else {
            ctx.fillStyle = '#cccccc'; ctx.beginPath(); ctx.arc(t.x, t.y, 3, 0, Math.PI*2); ctx.fill();
          }
        }
        ctx.globalAlpha = 1; ctx.save(); ctx.translate(p.x,p.y);
        if(p.type === 'moonSlash'){
          const ang = Math.atan2(p.vy,p.vx);
          ctx.rotate(ang);
          const R = p.crescentRadius || 64;
          const thick = p.crescentThickness || 18;
          const arc = p.crescentArc || Math.PI*0.9;
          // Glow Hintergrund
          const glow = ctx.createRadialGradient(0,0,R*0.15,0,0,R*1.1);
          glow.addColorStop(0, (p.colorInner||'#ffffff'));
          glow.addColorStop(0.5, (p.colorOuter||'#6bd3ff'));
          glow.addColorStop(1, (p.colorOuter||'#6bd3ff')+'00');
          ctx.globalAlpha = 0.85;
          ctx.fillStyle = glow;
          ctx.beginPath(); ctx.arc(0,0,R*1.05,-arc/2,arc/2); ctx.arc(0,0,R*0.10,arc/2,-arc/2,true); ctx.closePath(); ctx.fill();
          // Sichel (eigentliche Klinge) als differenzierter Bogen
          ctx.globalAlpha = 1;
          const innerR = R - thick;
          ctx.beginPath();
          ctx.arc(0,0,R,-arc/2,arc/2);
          ctx.arc(0,0,innerR,arc/2,-arc/2,true);
          ctx.closePath();
          const bladeGrad = ctx.createLinearGradient(0,-R,0,R);
          bladeGrad.addColorStop(0,(p.colorOuter||'#6bd3ff')+'dd');
          bladeGrad.addColorStop(0.5,(p.colorInner||'#ffffff'));
          bladeGrad.addColorStop(1,(p.colorOuter||'#6bd3ff')+'cc');
          ctx.fillStyle = bladeGrad;
          ctx.shadowColor = p.colorOuter||'#6bd3ff';
          ctx.shadowBlur = 24;
          ctx.fill();
          // Schneide Highlight
          ctx.shadowBlur = 0;
          ctx.lineWidth = 3;
          ctx.strokeStyle = (p.colorInner||'#ffffff')+'cc';
          ctx.beginPath();
          ctx.arc(0,0,R- thick*0.15,-arc/2,arc/2);
          ctx.stroke();
          ctx.restore();
          continue;
        }
        if(p.type === 'fireball') {
          const time = performance.now()*0.002 + p.seed;
          const pulse = 0.85 + Math.sin(time*6)*0.15;
          const r = p.r * (1.2*pulse);
          // Outer glow
          const g = ctx.createRadialGradient(0,0,r*0.2,0,0,r);
          g.addColorStop(0,'#ffffff');
          g.addColorStop(0.25,'#ffe9b0');
          g.addColorStop(0.5,'#ffb347');
            g.addColorStop(0.75,'#ff7c1f');
          g.addColorStop(1,'#ff3b0a00');
          ctx.fillStyle = g;
          ctx.beginPath(); ctx.arc(0,0,r,0,Math.PI*2); ctx.fill();
          // Inner core
          ctx.globalAlpha = 0.9;
          ctx.fillStyle = '#fff2cc';
          ctx.beginPath(); ctx.arc(0,0,r*0.35,0,Math.PI*2); ctx.fill();
          // Directional flare
          ctx.globalAlpha = 0.85;
          ctx.rotate(Math.atan2(p.vy,p.vx));
          const flareLen = r*1.9;
          const flareW = r*0.9;
          const gradFlare = ctx.createLinearGradient(0,0,flareLen,0);
          gradFlare.addColorStop(0,'#ffffffaa');
          gradFlare.addColorStop(0.2,'#ffd27aaa');
          gradFlare.addColorStop(0.55,'#ff8c00aa');
          gradFlare.addColorStop(1,'#ff450000');
          ctx.fillStyle = gradFlare;
          ctx.beginPath();
          ctx.moveTo(0,-flareW*0.5);
          ctx.lineTo(flareLen,-flareW*0.15);
          ctx.lineTo(flareLen,flareW*0.15);
          ctx.lineTo(0,flareW*0.5);
          ctx.closePath(); ctx.fill();
          ctx.restore();
          continue;
        }
        if(p.type === 'daggerDot') {
          // Verbesserte Dolch-Projektil-Grafik
          ctx.rotate(Math.atan2(p.vy, p.vx));
          const bladeLen = 26;
          const bladeHalf = 5.5;
          // Motion-Blur / Nachleuchten
          ctx.save();
          ctx.globalAlpha = 0.28;
          const trailGrad = ctx.createLinearGradient(-18,0,bladeLen,0);
          trailGrad.addColorStop(0,'#f7c94800');
          trailGrad.addColorStop(0.25,'#f7c94855');
            trailGrad.addColorStop(0.6,'#f7c94833');
          trailGrad.addColorStop(1,'#f7c94800');
          ctx.fillStyle = trailGrad;
          ctx.beginPath();
          ctx.moveTo(-18,-2.2);
          ctx.lineTo(bladeLen*0.6,-bladeHalf*0.35);
          ctx.lineTo(bladeLen*0.6,bladeHalf*0.35);
          ctx.lineTo(-18,2.2);
          ctx.closePath();
          ctx.fill();
          ctx.restore();

          ctx.shadowColor = '#f7c948';
          ctx.shadowBlur = 20;
          // Klinge
          const grad = ctx.createLinearGradient(0,0,bladeLen,0);
          grad.addColorStop(0,'#fff7d1');
          grad.addColorStop(0.35,'#f7c948');
          grad.addColorStop(0.7,'#c79a1c');
          grad.addColorStop(1,'#7a5a10');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.moveTo(0,-bladeHalf*0.55);
          ctx.lineTo(bladeLen*0.78,-bladeHalf*0.55);
          ctx.lineTo(bladeLen,0);
          ctx.lineTo(bladeLen*0.78,bladeHalf*0.55);
          ctx.lineTo(0,bladeHalf*0.55);
          ctx.closePath();
          ctx.fill();
          // Klingen-Kontur
          ctx.lineWidth = 1.4;
          ctx.strokeStyle = '#3b2a09';
          ctx.stroke();
          // Highlight Linie oben
          ctx.lineWidth = 0.9;
          ctx.strokeStyle = '#fff8';
          ctx.beginPath();
          ctx.moveTo(2,-bladeHalf*0.42);
          ctx.lineTo(bladeLen*0.74,-bladeHalf*0.42);
          ctx.stroke();
          // Parierstange
          ctx.fillStyle = '#d6c28a';
          ctx.beginPath();
          ctx.rect(-4,-bladeHalf*0.9,8,bladeHalf*1.8);
          ctx.fill();
          ctx.strokeStyle = '#5a4922';
          ctx.lineWidth = 1;
          ctx.stroke();
          // Griff
          ctx.fillStyle = '#4d3315';
          ctx.beginPath();
          ctx.rect(-10,-bladeHalf*0.55,6,bladeHalf*1.1);
          ctx.fill();
          // Griff-Zierstreifen
          ctx.strokeStyle = '#c8a040';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(-8.5,-bladeHalf*0.55);
          ctx.lineTo(-8.5,bladeHalf*0.55);
          ctx.moveTo(-6.8,-bladeHalf*0.55);
          ctx.lineTo(-6.8,bladeHalf*0.55);
          ctx.stroke();
          // Knauf
          ctx.fillStyle = '#d6c28a';
          ctx.beginPath();
          ctx.arc(-11.2,0,2.2,0,Math.PI*2);
          ctx.fill();
          ctx.strokeStyle = '#5a4922';
          ctx.lineWidth = 1;
          ctx.stroke();
          ctx.shadowBlur = 0;
          ctx.globalAlpha = 1;
        } else if(p.weaponIndex === weapons.findIndex(w=>w.id==='bolt')) {
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 18;
          ctx.fillStyle = '#cccccc';
          ctx.beginPath(); ctx.arc(0,0,p.r,0,Math.PI*2); ctx.fill();
          ctx.save();
          ctx.rotate(Math.atan2(p.vy, p.vx));
          ctx.beginPath();
          ctx.moveTo(p.r + 10, 0);
          ctx.lineTo(p.r - 2, -7);
          ctx.lineTo(p.r - 2, 7);
          ctx.closePath();
          ctx.fillStyle = '#cccccc';
          ctx.globalAlpha = 0.97;
          ctx.fill();
          ctx.restore();
        } else {
          ctx.shadowColor = p.color; ctx.shadowBlur = 12;
          ctx.fillStyle = '#cccccc'; ctx.beginPath(); ctx.arc(0,0,p.r,0,Math.PI*2); ctx.fill();
        }
        ctx.restore();
      }

        
        if(state.absorbing && state.absorbing.length){
          for(const ab of state.absorbing){
            ctx.save(); ctx.translate(ab.x, ab.y);
            ctx.fillStyle = '#cccccc';
            ctx.globalAlpha = 0.95;
            const s = 10;
            ctx.fillRect(-s/2, -s/2, s, s);
            ctx.restore();
          }
        }

      
      let animKey = 'idle';
      let animLen = 10;
      if (character === 'default') {
        if(isDying) {
          animKey = 'customDeath';
          animLen = DEATH_FRAMES;
        } else if(state.dead) {
          animKey = 'dead';
          animLen = 10;
        } else if(playerAnim === 'attack') {
          animKey = 'attack';
          animLen = 10;
        } else if(Math.abs(player.vx||0) > 1 || Math.abs(player.vy||0) > 1) {
          animKey = 'walk';
          animLen = framesPerDir;
        } else {
          animKey = 'idle';
          animLen = 10;
        }
      } else if (character === 'bully') {
        // Legacy Bully Animations deaktiviert – neue drawPlayerSprite() Routine übernimmt die Darstellung.
        // Setze Flag, damit nachfolgende (ältere) Renderpfade Bully ignorieren.
        window.__skipLegacyBullyRender = true;
      }
      
      
      if(player.vx || player.vy) {
        playerLastMove = {x: player.vx, y: player.vy};
        if(Math.abs(player.vx) > Math.abs(player.vy)) {
          playerLastDir = player.vx > 0 ? 'right' : 'left';
        } else {
          playerLastDir = player.vy > 0 ? 'down' : 'up';
        }
      }

      
      if(isDying) {
        
        updateDeath(typeof dt === 'number' ? dt : 16);
        if(finishedDying) {
          isDying = false;
          die();
        }
      } else if(state.dead) {
        
        if(playerAnimFrame < animLen-1) {
          playerAnimTimer++;
          if(playerAnimTimer > 8) {
            playerAnimFrame++;
            playerAnimTimer = 0;
          }
        }
      } else if(playerAnim === 'attack') {
        
        playerAnimTimer++;
  if(playerAnimTimer > 2) {
          playerAnimFrame++;
          playerAnimTimer = 0;
        }
        if(playerAnimFrame >= animLen) {
          playerAnim = (Math.abs(player.vx||0) > 1 || Math.abs(player.vy||0) > 1) ? 'walk' : 'idle';
          playerAnimFrame = 0;
          player.canAttack = true;
          
          if (mouseDown) {
            setTimeout(triggerAttack, 0);
          }
        }
      } else {
        
        if(character !== 'bully' || playerAnim !== 'walk') {
          playerAnimTimer++;
          if(playerAnimTimer > 6) {
            playerAnimFrame = (playerAnimFrame + 1) % animLen;
            playerAnimTimer = 0;
          }
        }
      }
      
      if(character === 'default') {
        
        const DIRS = ["up","left","down","right"];
  
  const weaponObj = weapons[player.weaponIndex] || { id: 'sword', name: 'Sword' };
  let weaponName = weaponObj.name || 'Sword';
  let weaponId = weaponObj.id || '';
  
  if (/halberd|halbard/i.test(weaponName) || /halberd|halbard/i.test(weaponId)) weaponName = 'Halberd';
  else if (/dagger/i.test(weaponName) || /dagger/i.test(weaponId)) weaponName = 'Dagger';
  else if (/staff/i.test(weaponName) || /staff/i.test(weaponId)) weaponName = 'Staff';
  else weaponName = 'Sword';
  const sheets = getFredSheets(weaponName);
  sheets.walk.rows = DIRS;

        
        let dx = player.vx || 0, dy = player.vy || 0;
        let prevState = fredAnimState;
        let newState = (dx !== 0 || dy !== 0) ? "walk" : "idle";
        if (newState !== fredAnimState) {
          fredAnimState = newState;
          fredFrame = 0;
          fredLastTick = 0;
        }
        if (dx !== 0 || dy !== 0) {
          if (Math.abs(dx) > Math.abs(dy)) {
            fredDirection = dx > 0 ? "right" : "left";
          } else {
            fredDirection = dy > 0 ? "down" : "up";
          }
        }

        
        let cfg = sheets.walk;
        // ANIMATION TIMING FIX:
        // dt ist in Sekunden, vorher wurde mit msPerFrame (Millisekunden) verglichen -> falsche Geschwindigkeit.
        // Korrektur: secondsPerFrame = 1 / fps. Wir akkumulieren dt (Sekunden) und schalten Frames um, wenn Schwellwert erreicht.
        const secondsPerFrame = 1 / (cfg.fps || 10);
        fredLastTick += (typeof dt === 'number' ? dt : 0.016);
        if (fredAnimState === "idle") {
          fredFrame = 0;
        } else if (fredLastTick >= secondsPerFrame) {
          const framesToAdvance = Math.floor(fredLastTick / secondsPerFrame); // Falls Lag -> mehrere Frames nachholen
          fredFrame = (fredFrame + framesToAdvance) % cfg.frames;
          fredLastTick -= framesToAdvance * secondsPerFrame; // Rest behalten für gleichmäßiges Tempo
          if(window.DEBUG_FRED_ANIM && !window._fredAnimLogT){ window._fredAnimLogT = 0; }
          if(window.DEBUG_FRED_ANIM){
            window._fredAnimLogT += framesToAdvance * secondsPerFrame;
            if(window._fredAnimLogT >= 1){
              console.log('[FredAnim]', { frame: fredFrame, state: fredAnimState, dir: fredDirection, fps: cfg.fps, dtAccum: fredLastTick.toFixed(3) });
              window._fredAnimLogT = 0;
            }
          }
        }

        
        const rowIndex = cfg.rows.indexOf(fredDirection);
        const safeRow = (rowIndex >= 0) ? rowIndex : 0;
        let fredSx, fredSy, fredSw, fredSh;
        
        const slashCfg = sheets.slash;
        const slashImg = slashCfg.img;
        const isDagger = /dagger/i.test(weaponName);
        if (animKey === 'customDeath') {
          renderDeath(ctx, player.x, player.y + 32);
        } else if (playerAnim === 'hurt') {
          
          const hurtCfg = sheets.hurt;
          const hurtFrame = Math.min(hurtCfg.frames - 1, Math.floor(playerAnimFrame));
          const hurtFeetY = (player.visualY!==undefined?player.visualY:player.y) + 32;
          const hurtDrawW = 96, hurtDrawH = Math.round((hurtCfg.h / hurtCfg.w) * hurtDrawW);
          const sx = hurtFrame * hurtCfg.w;
          const sy = 0;
          ctx.save();
          ctx.translate(player.x, hurtFeetY - hurtDrawH);
          if(hurtCfg.img.complete && hurtCfg.img.naturalWidth > 0) {
            ctx.globalAlpha = 0.7;
            ctx.drawImage(hurtCfg.img, sx, sy, hurtCfg.w, hurtCfg.h, -hurtDrawW/2, 0, hurtDrawW, hurtDrawH);
            ctx.globalAlpha = 0.35;
            ctx.fillStyle = '#cccccc';
            ctx.fillRect(-hurtDrawW/2, 0, hurtDrawW, hurtDrawH);
            ctx.globalAlpha = 1;
          }
          ctx.restore();
        } else if (playerAnim === 'attack') {
          
          
          
          let sword = (player.weapon && player.weapon.id === 'sword') ? player.weapon : null;
          let cooldown = sword ? sword.cooldown : 0.36;
          let animSpeed = Math.max(1, Math.round(24 * (1/cooldown)) );
          
          let slashFrame = Math.min(5, Math.floor(playerAnimFrame / Math.max(1, Math.round(animLen/6))));
          
          const slashDrawW = Math.round(192 * 1.5), slashDrawH = Math.round(192 * 1.5);
          const walkDrawH = 96;
          const slashFeetY = (player.visualY!==undefined?player.visualY:player.y) + 32;
          
          const footOffset = 94;

          
          
          
          const t = Math.min(1, playerAnimFrame / Math.max(1, Math.floor((animLen-1)/2)));
          let dynamicRadius, arcWidth, hitOffsetY;
          if(isDagger) {
            dynamicRadius = 60;
            arcWidth = (60 * Math.PI) / 180;
            hitOffsetY = footOffset + 24;
          } else if (/halberd|halbard/i.test(weaponName) || /halberd|halbard/i.test(weaponId)) {
            dynamicRadius = 120;
            arcWidth = (140 * Math.PI) / 180;
            hitOffsetY = footOffset + 8;
          } else {
            dynamicRadius = 100;
            arcWidth = (95 * Math.PI) / 180;
            hitOffsetY = footOffset;
          }
          // Entfernt: alte graue Slash-Arc-Animation für Fred

          
          // Entfernt: window.lastSlashGlow-Logik, da startAngle/arcWidth nicht mehr definiert
          
  

          
          
          if(isDagger) {
            
            const dirIdx = slashCfg.rows.indexOf(fredSlashDirection);
            const frameIdx = Math.min(5, slashFrame);
            let f = { sx: frameIdx * 64, sy: dirIdx * 64, sw: 64, sh: 64 };
            ctx.save();
            ctx.imageSmoothingEnabled = false;
            
            const fredDrawW = 96, fredDrawH = 96;
            const fredFeetY = (player.visualY!==undefined?player.visualY:player.y) + 32;
            ctx.translate(player.x, fredFeetY - fredDrawH);
            if(slashImg.complete && slashImg.naturalWidth > 0) {
              ctx.drawImage(slashImg, f.sx, f.sy, f.sw, f.sh, -fredDrawW/2, 0, fredDrawW, fredDrawH);
            }
            ctx.restore();
          } else {
            
            let f = getFredSlashFrame(fredSlashDirection, slashFrame);
            ctx.save();
            ctx.imageSmoothingEnabled = false;
            ctx.translate(player.x, slashFeetY - slashDrawH + footOffset);
            ctx.drawImage(slashImg, f.sx, f.sy, f.sw, f.sh, -slashDrawW/2, 0, slashDrawW, slashDrawH);
            ctx.restore();
          }
        } else if (fredAnimState === "idle") {
          
          if (/staff/i.test(weaponName) || /staff/i.test(weaponId)) {
            
            fredSx = 0;
            fredSy = safeRow * cfg.h;
            fredSw = cfg.w; fredSh = cfg.h;
            const fredFeetY = (player.visualY!==undefined?player.visualY:player.y) + 32;
            const fredDrawW = 96, fredDrawH = Math.round((fredSh / fredSw) * fredDrawW);
            ctx.save();
            ctx.translate(player.x, fredFeetY - fredDrawH);
            if(cfg.img.complete && cfg.img.naturalWidth > 0) {
              ctx.drawImage(cfg.img, fredSx, fredSy, fredSw, fredSh, -fredDrawW/2, 0, fredDrawW, fredDrawH);
            }
            ctx.restore();
          } else {
            fredSx = 0;
            fredSy = safeRow * cfg.h;
            fredSw = cfg.w; fredSh = cfg.h;
            const fredFeetY = (player.visualY!==undefined?player.visualY:player.y) + 32;
            const fredDrawW = 96, fredDrawH = Math.round((fredSh / fredSw) * fredDrawW);
            ctx.save();
            ctx.translate(player.x, fredFeetY - fredDrawH);
            if(cfg.img.complete && cfg.img.naturalWidth > 0) {
              ctx.drawImage(cfg.img, fredSx, fredSy, fredSw, fredSh, -fredDrawW/2, 0, fredDrawW, fredDrawH);
            }
            ctx.restore();
          }
        } else {
          
          if (/staff/i.test(weaponName) || /staff/i.test(weaponId)) {
            fredSx = fredFrame * cfg.w;
            fredSy = safeRow * cfg.h;
            fredSw = cfg.w; fredSh = cfg.h;
            const fredFeetY = (player.visualY!==undefined?player.visualY:player.y) + 32;
            const fredDrawW = 96, fredDrawH = Math.round((fredSh / fredSw) * fredDrawW);
            ctx.save();
            ctx.translate(player.x, fredFeetY - fredDrawH);
            if(cfg.img.complete && cfg.img.naturalWidth > 0) {
              ctx.drawImage(cfg.img, fredSx, fredSy, fredSw, fredSh, -fredDrawW/2, 0, fredDrawW, fredDrawH);
            }
            ctx.restore();
          } else {
            fredSx = fredFrame * cfg.w;
            fredSy = safeRow * cfg.h;
            fredSw = cfg.w; fredSh = cfg.h;
            const fredFeetY = (player.visualY!==undefined?player.visualY:player.y) + 32;
            const fredDrawW = 96, fredDrawH = Math.round((fredSh / fredSw) * fredDrawW);
            ctx.save();
            ctx.translate(player.x, fredFeetY - fredDrawH);
            if(cfg.img.complete && cfg.img.naturalWidth > 0) {
              ctx.drawImage(cfg.img, fredSx, fredSy, fredSw, fredSh, -fredDrawW/2, 0, fredDrawW, fredDrawH);
            }
            ctx.restore();
          }
        }


  } else if(character === 'bully') {
    // Sekundärer (alter) Bully-Renderpfad -> komplett überspringen, da neue drawPlayerSprite() Routine aktiv ist.
    return; // verhindert Doppel-Rendering über dem neuen Walk/Idle Sheet
    
    if(typeof window.bullyFrame === 'undefined') window.bullyFrame = 0;
    if(typeof window.bullyLastTick === 'undefined') window.bullyLastTick = 0;
    let dx = player.vx || 0, dy = player.vy || 0;
    let prevState = window.bullyAnimState || 'idle';
    let newState = (dx !== 0 || dy !== 0) ? 'walk' : 'idle';
    if (newState !== prevState) {
      window.bullyAnimState = newState;
      window.bullyFrame = 0;
      window.bullyLastTick = 0;
    }
    if (dx !== 0 || dy !== 0) {
      if (Math.abs(dx) > Math.abs(dy)) {
        window.bullyDirection = dx > 0 ? 'right' : 'left';
      } else {
        window.bullyDirection = dy > 0 ? 'down' : 'up';
      }
    }

  
  const weaponObj = weapons[player.weaponIndex] || { id: 'sword', name: 'Sword' };
  let weaponName = weaponObj.name || 'Sword';
  let weaponId = weaponObj.id || '';
  if (/halberd|halbard/i.test(weaponName) || /halberd|halbard/i.test(weaponId)) weaponName = 'Halberd';
  else if (/dagger/i.test(weaponName) || /dagger/i.test(weaponId)) weaponName = 'Dagger';
  else if (/staff/i.test(weaponName) || /staff/i.test(weaponId)) weaponName = 'Staff';
  else weaponName = 'Sword';
  const sheets = getBullySheets(weaponName);
    let cfg;
    if (playerAnim === 'walk') {
      cfg = sheets.walk;
    } else if (playerAnim === 'idle') {
      cfg = sheets.idle;
    } else if (playerAnim === 'hurt') {
      cfg = sheets.hurt;
    } else {
      cfg = sheets.idle;
    }
    
    const msPerFrame = 1000 / cfg.fps;
    window.bullyLastTick += (typeof dt === 'number' ? dt : 16);
    if (window.bullyAnimState === 'idle') {
      window.bullyFrame = 0;
    } else if (window.bullyLastTick >= msPerFrame) {
      window.bullyFrame = (window.bullyFrame + 1) % cfg.frames;
      window.bullyLastTick = 0;
    }

    let animState = playerAnim;
    let rowIndex = cfg.rows.indexOf(playerLastDir);
    let safeRow = (rowIndex >= 0) ? rowIndex : 0;
    let sx, sy, sw, sh;
    if (animKey === 'customDeath') {
      renderDeath(ctx, player.x, player.y + 32);
    } else if (playerAnim === 'hurt') {
      const hurtCfg = cfg;
      const hurtFrame = Math.min(hurtCfg.frames - 1, Math.floor(playerAnimFrame));
  const hurtFeetY = (player.visualY!==undefined?player.visualY:player.y) + 32;
      const hurtDrawW = 96, hurtDrawH = Math.round((hurtCfg.h / hurtCfg.w) * hurtDrawW);
      const sx = hurtFrame * hurtCfg.w;
      const sy = 0;
      ctx.save();
      ctx.translate(player.x, hurtFeetY - hurtDrawH);
      if(hurtCfg.img.complete && hurtCfg.img.naturalWidth > 0) {
        ctx.drawImage(hurtCfg.img, sx, sy, hurtCfg.w, hurtCfg.h, -hurtDrawW/2, 0, hurtDrawW, hurtDrawH);
      }
      ctx.restore();
    } else if (playerAnim === 'attack') {
      let sword = (player.weapon && player.weapon.id === 'sword') ? player.weapon : null;
      let cooldown = sword ? sword.cooldown : 0.36;
      let animSpeed = Math.max(1, Math.round(24 * (1/cooldown)) );
      let slashFrame = Math.min(5, Math.floor(playerAnimFrame / Math.max(1, Math.round(animLen/6))));
      const slashDrawW = Math.round(192 * 1.5), slashDrawH = Math.round(192 * 1.5);
      const walkDrawH = 96;
  const slashFeetY = (player.visualY!==undefined?player.visualY:player.y) + 32;
      const footOffset = 94;
      const bullySlashImg = spriteAnimations.bully.slashImg || (spriteAnimations.bully.slashImg = new Image());
      const slashCfg = sheets.slash;
      const slashImg = slashCfg.img;
      
      if (/dagger/i.test(weaponName) || /dagger/i.test(weaponId)) {
        
        const dirIdx = slashCfg.rows.indexOf(fredSlashDirection);
        const frameIdx = Math.min(5, slashFrame);
        let f = { sx: frameIdx * 64, sy: dirIdx * 64, sw: 64, sh: 64 };
        ctx.save();
        ctx.imageSmoothingEnabled = false;
        const bullyDrawW = 96, bullyDrawH = 96;
  const bullyFeetY = (player.visualY!==undefined?player.visualY:player.y) + 32;
        ctx.translate(player.x, bullyFeetY - bullyDrawH);
        ctx.drawImage(slashImg, f.sx, f.sy, f.sw, f.sh, -bullyDrawW/2, 0, bullyDrawW, bullyDrawH);
        ctx.restore();
      } else {
        
        const f = getFredSlashFrame(fredSlashDirection, slashFrame);
        ctx.save();
        ctx.imageSmoothingEnabled = false;
        ctx.translate(player.x, slashFeetY - slashDrawH + footOffset);
        ctx.drawImage(slashImg, f.sx, f.sy, f.sw, f.sh, -slashDrawW/2, 0, slashDrawW, slashDrawH);
        ctx.restore();
      }
    } else if (playerAnim === 'walk') {
      
      sx = window.bullyFrame * cfg.w;
      sy = safeRow * cfg.h;
      sw = cfg.w; sh = cfg.h;
  const feetY = (player.visualY!==undefined?player.visualY:player.y) - (player.jumpOffset||0) + 32;
      const drawW = 96, drawH = Math.round((sh / sw) * drawW);
      ctx.save();
      ctx.translate(player.x, feetY - drawH);
      if(cfg.img.complete && cfg.img.naturalWidth > 0) {
        ctx.drawImage(cfg.img, sx, sy, sw, sh, -drawW/2, 0, drawW, drawH);
      }
      ctx.restore();
    } else if (animState === "idle") {
      sx = 0;
      sy = safeRow * cfg.h;
      sw = cfg.w; sh = cfg.h;
  const feetY = (player.visualY!==undefined?player.visualY:player.y) + 32;
      const drawW = 96, drawH = Math.round((sh / sw) * drawW);
      ctx.save();
      ctx.translate(player.x, feetY - drawH);
      if(cfg.img.complete && cfg.img.naturalWidth > 0) {
        ctx.drawImage(cfg.img, sx, sy, sw, sh, -drawW/2, 0, drawW, drawH);
      }
      ctx.restore();
    } else {
      
      if (/staff/i.test(weaponName) || /staff/i.test(weaponId)) {
        fredSx = fredFrame * cfg.w;
        fredSy = safeRow * cfg.h;
        fredSw = cfg.w; fredSh = cfg.h;
  const fredFeetY = (player.visualY!==undefined?player.visualY:player.y) - (player.jumpOffset||0) + 32;
        const fredDrawW = 96, fredDrawH = Math.round((fredSh / fredSw) * fredDrawW);
        ctx.save();
        ctx.translate(player.x, fredFeetY - fredDrawH);
        if(cfg.img.complete && cfg.img.naturalWidth > 0) {
          ctx.drawImage(cfg.img, fredSx, fredSy, fredSw, fredSh, -fredDrawW/2, 0, fredDrawW, fredDrawH);
        }
        ctx.restore();
      } else {
        fredSx = fredFrame * cfg.w;
        fredSy = safeRow * cfg.h;
        fredSw = cfg.w; fredSh = cfg.h;
  const fredFeetY = (player.visualY!==undefined?player.visualY:player.y) - (player.jumpOffset||0) + 32;
        const fredDrawW = 96, fredDrawH = Math.round((fredSh / fredSw) * fredDrawW);
        ctx.save();
        ctx.translate(player.x, fredFeetY - fredDrawH);
        if(cfg.img.complete && cfg.img.naturalWidth > 0) {
          ctx.drawImage(cfg.img, fredSx, fredSy, fredSw, fredSh, -fredDrawW/2, 0, fredDrawW, fredDrawH);
        }
        ctx.restore();
      }
    }

    // Feder der Wahrheit Symbol über Spieler (einmalig wenn gesammelt)
    if(window.collectedLoot && window.collectedLoot.find(l=>l.id==='truthfeather')){
      const t = performance.now()/1000;
      const bob = Math.sin(t*2.4)*6 - 10; // leichtes Schweben
      const glowPulse = 0.5 + 0.5*Math.sin(t*4);
      ctx.save();
  ctx.translate(player.x, (player.visualY!==undefined?player.visualY:player.y) - (player.jumpOffset||0) - player.r - 56 + bob); // höher + Jump Offset
      // Glow Kreis
      const grdF = ctx.createRadialGradient(0,0,4,0,0,34);
      grdF.addColorStop(0,'#ffe8aa');
      grdF.addColorStop(0.4,'#ffd34d');
      grdF.addColorStop(1,'rgba(255,230,0,0)');
      ctx.globalAlpha = 0.55 + glowPulse*0.35;
      ctx.fillStyle = grdF;
      ctx.beginPath(); ctx.arc(0,0,32,0,Math.PI*2); ctx.fill();
      ctx.globalAlpha = 1;
      ctx.font = '28px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = '#ffe600';
      ctx.shadowBlur = 18 + glowPulse*12;
      ctx.fillText('🪶',0,0);
      ctx.restore();
    }

  // (Spin Overlay Call verschoben ans Ende der draw()-Funktion)


  } else if(character === 'bully') {
    
    if(typeof window.bullyFrame === 'undefined') window.bullyFrame = 0;
    if(typeof window.bullyLastTick === 'undefined') window.bullyLastTick = 0;
    let dx = player.vx || 0, dy = player.vy || 0;
    let prevState = window.bullyAnimState || 'idle';
    let newState = (dx !== 0 || dy !== 0) ? 'walk' : 'idle';
    if (newState !== prevState) {
      window.bullyAnimState = newState;
      window.bullyFrame = 0;
      window.bullyLastTick = 0;
  }

  if (dx !== 0 || dy !== 0) {
      if (Math.abs(dx) > Math.abs(dy)) {
        window.bullyDirection = dx > 0 ? 'right' : 'left';
      } else {
        window.bullyDirection = dy > 0 ? 'down' : 'up';
      }
    }

  
  const weaponObj = weapons[player.weaponIndex] || { id: 'sword', name: 'Sword' };
  let weaponName = weaponObj.name || 'Sword';
  let weaponId = weaponObj.id || '';
  if (/halberd|halbard/i.test(weaponName) || /halberd|halbard/i.test(weaponId)) weaponName = 'Halberd';
  else if (/dagger/i.test(weaponName) || /dagger/i.test(weaponId)) weaponName = 'Dagger';
  else if (/staff/i.test(weaponName) || /staff/i.test(weaponId)) weaponName = 'Staff';
  else weaponName = 'Sword';
  const sheets = getBullySheets(weaponName);
    let cfg;
    if (playerAnim === 'walk') {
      cfg = sheets.walk;
    } else if (playerAnim === 'idle') {
      cfg = sheets.idle;
    } else if (playerAnim === 'hurt') {
      cfg = sheets.hurt;
    } else {
      cfg = sheets.idle;
    }
    
    const msPerFrame = 1000 / cfg.fps;
    window.bullyLastTick += (typeof dt === 'number' ? dt : 16);
  if (window.bullyAnimState === 'idle') {
      window.bullyFrame = 0;
    } else if (window.bullyLastTick >= msPerFrame) {
      window.bullyFrame = (window.bullyFrame + 1) % cfg.frames;
      window.bullyLastTick = 0;
    }

    let animState = playerAnim;
    let rowIndex = cfg.rows.indexOf(playerLastDir);
    let safeRow = (rowIndex >= 0) ? rowIndex : 0;
    let sx, sy, sw, sh;
  if (animKey === 'customDeath') {
      renderDeath(ctx, player.x, player.y + 32);
    } else if (playerAnim === 'hurt') {
      const hurtCfg = cfg;
      const hurtFrame = Math.min(hurtCfg.frames - 1, Math.floor(playerAnimFrame));
  const hurtFeetY = (player.visualY!==undefined?player.visualY:player.y) + 32;
      const hurtDrawW = 96, hurtDrawH = Math.round((hurtCfg.h / hurtCfg.w) * hurtDrawW);
      const sx = hurtFrame * hurtCfg.w;
      const sy = 0;
      ctx.save();
      ctx.translate(player.x, hurtFeetY - hurtDrawH);
      if(hurtCfg.img.complete && hurtCfg.img.naturalWidth > 0) {
        ctx.drawImage(hurtCfg.img, sx, sy, hurtCfg.w, hurtCfg.h, -hurtDrawW/2, 0, hurtDrawW, hurtDrawH);
      }
      ctx.restore();
  } else if (playerAnim === 'attack') {
      let sword = (player.weapon && player.weapon.id === 'sword') ? player.weapon : null;
      let cooldown = sword ? sword.cooldown : 0.36;
      let animSpeed = Math.max(1, Math.round(24 * (1/cooldown)) );
      let slashFrame = Math.min(5, Math.floor(playerAnimFrame / Math.max(1, Math.round(animLen/6))));
      const slashDrawW = Math.round(192 * 1.5), slashDrawH = Math.round(192 * 1.5);
      const walkDrawH = 96;
  const slashFeetY = (player.visualY!==undefined?player.visualY:player.y) + 32;
      const footOffset = 94;
      const bullySlashImg = spriteAnimations.bully.slashImg || (spriteAnimations.bully.slashImg = new Image());
      const slashCfg = sheets.slash;
      const slashImg = slashCfg.img;
      
      if (/dagger/i.test(weaponName) || /dagger/i.test(weaponId)) {
        
        const dirIdx = slashCfg.rows.indexOf(fredSlashDirection);
        const frameIdx = Math.min(5, slashFrame);
        let f = { sx: frameIdx * 64, sy: dirIdx * 64, sw: 64, sh: 64 };
        ctx.save();
        ctx.imageSmoothingEnabled = false;
        const bullyDrawW = 96, bullyDrawH = 96;
  const bullyFeetY = (player.visualY!==undefined?player.visualY:player.y) + 32;
        ctx.translate(player.x, bullyFeetY - bullyDrawH);
        ctx.drawImage(slashImg, f.sx, f.sy, f.sw, f.sh, -bullyDrawW/2, 0, bullyDrawW, bullyDrawH);
        ctx.restore();
      } else {
        
        const f = getFredSlashFrame(fredSlashDirection, slashFrame);
        ctx.save();
        ctx.imageSmoothingEnabled = false;
        ctx.translate(player.x, slashFeetY - slashDrawH + footOffset);
        ctx.drawImage(slashImg, f.sx, f.sy, f.sw, f.sh, -slashDrawW/2, 0, slashDrawW, slashDrawH);
        ctx.restore();
      }
  } else if (playerAnim === 'walk') {
      
      sx = window.bullyFrame * cfg.w;
      sy = safeRow * cfg.h;
      sw = cfg.w; sh = cfg.h;
  const feetY = (player.visualY!==undefined?player.visualY:player.y) + 32;
      const drawW = 96, drawH = Math.round((sh / sw) * drawW);
      ctx.save();
      ctx.translate(player.x, feetY - drawH);
      if(cfg.img.complete && cfg.img.naturalWidth > 0) {
        ctx.drawImage(cfg.img, sx, sy, sw, sh, -drawW/2, 0, drawW, drawH);
      }
      ctx.restore();
  } else if (animState === "idle") {
      sx = 0;
      sy = safeRow * cfg.h;
      sw = cfg.w; sh = cfg.h;
  const feetY = (player.visualY!==undefined?player.visualY:player.y) + 32;
      const drawW = 96, drawH = Math.round((sh / sw) * drawW);
      ctx.save();
      ctx.translate(player.x, feetY - drawH);
      if(cfg.img.complete && cfg.img.naturalWidth > 0) {
        ctx.drawImage(cfg.img, sx, sy, sw, sh, -drawW/2, 0, drawW, drawH);
      }
      ctx.restore();
  } else {
      
      if (/staff/i.test(weaponName) || /staff/i.test(weaponId)) {
        fredSx = fredFrame * cfg.w;
        fredSy = safeRow * cfg.h;
        fredSw = cfg.w; fredSh = cfg.h;
  const fredFeetY = (player.visualY!==undefined?player.visualY:player.y) + 32;
        const fredDrawW = 96, fredDrawH = Math.round((fredSh / fredSw) * fredDrawW);
        ctx.save();
        ctx.translate(player.x, fredFeetY - fredDrawH);
        if(cfg.img.complete && cfg.img.naturalWidth > 0) {
          ctx.drawImage(cfg.img, fredSx, fredSy, fredSw, fredSh, -fredDrawW/2, 0, fredDrawW, fredDrawH);
        }
        ctx.restore();
      } else {
        fredSx = fredFrame * cfg.w;
        fredSy = safeRow * cfg.h;
        fredSw = cfg.w; fredSh = cfg.h;
  const fredFeetY = (player.visualY!==undefined?player.visualY:player.y) + 32;
        const fredDrawW = 96, fredDrawH = Math.round((fredSh / fredSw) * fredDrawW);
        ctx.save();
        ctx.translate(player.x, fredFeetY - fredDrawH);
        if(cfg.img.complete && cfg.img.naturalWidth > 0) {
          ctx.drawImage(cfg.img, fredSx, fredSy, fredSw, fredSh, -fredDrawW/2, 0, fredDrawW, fredDrawH);
        }
        ctx.restore();
      }
    }
  } else if(character === 'bully') {
    
    if(typeof window.bullyFrame === 'undefined') window.bullyFrame = 0;
    if(typeof window.bullyLastTick === 'undefined') window.bullyLastTick = 0;
    let dx = player.vx || 0, dy = player.vy || 0;
    let prevState = window.bullyAnimState || 'idle';
    let newState = (dx !== 0 || dy !== 0) ? 'walk' : 'idle';
    if (newState !== prevState) {
      window.bullyAnimState = newState;
      window.bullyFrame = 0;
      window.bullyLastTick = 0;
    }
    if (dx !== 0 || dy !== 0) {
      if (Math.abs(dx) > Math.abs(dy)) {
        window.bullyDirection = dx > 0 ? 'right' : 'left';
      } else {
        window.bullyDirection = dy > 0 ? 'down' : 'up';
      }
    }

  
  const weaponObj = weapons[player.weaponIndex] || { id: 'sword', name: 'Sword' };
  let weaponName = weaponObj.name || 'Sword';
  let weaponId = weaponObj.id || '';
  if (/halberd|halbard/i.test(weaponName) || /halberd|halbard/i.test(weaponId)) weaponName = 'Halberd';
  else if (/dagger/i.test(weaponName) || /dagger/i.test(weaponId)) weaponName = 'Dagger';
  else if (/staff/i.test(weaponName) || /staff/i.test(weaponId)) weaponName = 'Staff';
  else weaponName = 'Sword';
  const sheets = getBullySheets(weaponName);
    let cfg;
    if (playerAnim === 'walk') {
      cfg = sheets.walk;
    } else if (playerAnim === 'idle') {
      cfg = sheets.idle;
    } else if (playerAnim === 'hurt') {
      cfg = sheets.hurt;
    } else {
      cfg = sheets.idle;
    }
    
    const msPerFrame = 1000 / cfg.fps;
    window.bullyLastTick += (typeof dt === 'number' ? dt : 16);
    if (window.bullyAnimState === 'idle') {
      window.bullyFrame = 0;
    } else if (window.bullyLastTick >= msPerFrame) {
      window.bullyFrame = (window.bullyFrame + 1) % cfg.frames;
      window.bullyLastTick = 0;
    }

    let animState = playerAnim;
    let rowIndex = cfg.rows.indexOf(playerLastDir);
    let safeRow = (rowIndex >= 0) ? rowIndex : 0;
    let sx, sy, sw, sh;
    if (animKey === 'customDeath') {
      renderDeath(ctx, player.x, player.y + 32);
    } else if (playerAnim === 'hurt') {
      const hurtCfg = cfg;
      const hurtFrame = Math.min(hurtCfg.frames - 1, Math.floor(playerAnimFrame));
  const hurtFeetY = (player.visualY!==undefined?player.visualY:player.y) + 32;
      const hurtDrawW = 96, hurtDrawH = Math.round((hurtCfg.h / hurtCfg.w) * hurtDrawW);
      const sx = hurtFrame * hurtCfg.w;
      const sy = 0;
      ctx.save();
      ctx.translate(player.x, hurtFeetY - hurtDrawH);
      if(hurtCfg.img.complete && hurtCfg.img.naturalWidth > 0) {
        ctx.drawImage(hurtCfg.img, sx, sy, hurtCfg.w, hurtCfg.h, -hurtDrawW/2, 0, hurtDrawW, hurtDrawH);
      }
      ctx.restore();
    } else if (playerAnim === 'attack') {
      let sword = (player.weapon && player.weapon.id === 'sword') ? player.weapon : null;
      let cooldown = sword ? sword.cooldown : 0.36;
      let animSpeed = Math.max(1, Math.round(24 * (1/cooldown)) );
      let slashFrame = Math.min(5, Math.floor(playerAnimFrame / Math.max(1, Math.round(animLen/6))));
      const slashDrawW = Math.round(192 * 1.5), slashDrawH = Math.round(192 * 1.5);
      const walkDrawH = 96;
  const slashFeetY = (player.visualY!==undefined?player.visualY:player.y) + 32;
      const footOffset = 94;
      const bullySlashImg = spriteAnimations.bully.slashImg || (spriteAnimations.bully.slashImg = new Image());
      const slashCfg = sheets.slash;
      const slashImg = slashCfg.img;
      
      if (/dagger/i.test(weaponName) || /dagger/i.test(weaponId)) {
        
        const dirIdx = slashCfg.rows.indexOf(fredSlashDirection);
        const frameIdx = Math.min(5, slashFrame);
        let f = { sx: frameIdx * 64, sy: dirIdx * 64, sw: 64, sh: 64 };
        ctx.save();
        ctx.imageSmoothingEnabled = false;
        const bullyDrawW = 96, bullyDrawH = 96;
  const bullyFeetY = (player.visualY!==undefined?player.visualY:player.y) + 32;
        ctx.translate(player.x, bullyFeetY - bullyDrawH);
        ctx.drawImage(slashImg, f.sx, f.sy, f.sw, f.sh, -bullyDrawW/2, 0, bullyDrawW, bullyDrawH);
        ctx.restore();
      } else {
        
        const f = getFredSlashFrame(fredSlashDirection, slashFrame);
        ctx.save();
        ctx.imageSmoothingEnabled = false;
        ctx.translate(player.x, slashFeetY - slashDrawH + footOffset);
        ctx.drawImage(slashImg, f.sx, f.sy, f.sw, f.sh, -slashDrawW/2, 0, slashDrawW, slashDrawH);
        ctx.restore();
      }
    } else if (playerAnim === 'walk') {
      
      sx = window.bullyFrame * cfg.w;
      sy = safeRow * cfg.h;
      sw = cfg.w; sh = cfg.h;
      const feetY = player.y + 32;
      const drawW = 96, drawH = Math.round((sh / sw) * drawW);
      ctx.save();
      ctx.translate(player.x, feetY - drawH);
      if(cfg.img.complete && cfg.img.naturalWidth > 0) {
        ctx.drawImage(cfg.img, sx, sy, sw, sh, -drawW/2, 0, drawW, drawH);
      }
      ctx.restore();
    } else if (animState === "idle") {
      sx = 0;
      sy = safeRow * cfg.h;
      sw = cfg.w; sh = cfg.h;
      const feetY = player.y + 32;
      const drawW = 96, drawH = Math.round((sh / sw) * drawW);
      ctx.save();
      ctx.translate(player.x, feetY - drawH);
      if(cfg.img.complete && cfg.img.naturalWidth > 0) {
        ctx.drawImage(cfg.img, sx, sy, sw, sh, -drawW/2, 0, drawW, drawH);
      }
      ctx.restore();
    } else {
      
      if (/staff/i.test(weaponName) || /staff/i.test(weaponId)) {
        fredSx = fredFrame * cfg.w;
        fredSy = safeRow * cfg.h;
        fredSw = cfg.w; fredSh = cfg.h;
        const fredFeetY = player.y + 32;
        const fredDrawW = 96, fredDrawH = Math.round((fredSh / fredSw) * fredDrawW);
        ctx.save();
        ctx.translate(player.x, fredFeetY - fredDrawH);
        if(cfg.img.complete && cfg.img.naturalWidth > 0) {
          ctx.drawImage(cfg.img, fredSx, fredSy, fredSw, fredSh, -fredDrawW/2, 0, fredDrawW, fredDrawH);
        }
        ctx.restore();
      } else {
        fredSx = fredFrame * cfg.w;
        fredSy = safeRow * cfg.h;
        fredSw = cfg.w; fredSh = cfg.h;
        const fredFeetY = player.y + 32;
        const fredDrawW = 96, fredDrawH = Math.round((fredSh / fredSw) * fredDrawW);
        ctx.save();
        ctx.translate(player.x, fredFeetY - fredDrawH);
        if(cfg.img.complete && cfg.img.naturalWidth > 0) {
          ctx.drawImage(cfg.img, fredSx, fredSy, fredSw, fredSh, -fredDrawW/2, 0, fredDrawW, fredDrawH);
        }
        ctx.restore();
      }
    }

    // --- Spin Overlay (global, final Layer) ---
    if(typeof drawSpinOverlay === 'function') drawSpinOverlay(ctx);
    else if(window.swordSpin && window.swordSpin.active){
      ctx.save();
      ctx.globalAlpha = 0.45;
      ctx.strokeStyle = '#ffaa55';
      ctx.lineWidth = 4;
      ctx.beginPath(); ctx.arc(player.x, player.y, (weapons[player.weaponIndex]?.range||140)*0.9, 0, Math.PI*2); ctx.stroke();
      ctx.restore();
    }
  }

  // GLOBAL Heal Animation (für alle Charaktere)
  if(healAnimState.playing){
    if(healAnim.img && healAnim.img.complete && healAnim.img.naturalWidth>0){
  // Multi-Row Support: 5 Spalten x 6 Reihen (Konfiguration in healAnim)
  const totalFramesConfigured = healAnim.frames;
  const cols = healAnim.cols || 5;
  const rows = healAnim.rows || Math.ceil(totalFramesConfigured / cols);
  // Fallback falls Sprite breiter oder schmaler: benutze gemeldete naturalWidth/naturalHeight
  const frameDur = 1 / healAnim.fps;
  const fi = Math.min(totalFramesConfigured-1, Math.floor(healAnimState.t / frameDur));
  const col = fi % cols;
  const row = Math.floor(fi / cols);
      const bob = Math.sin(performance.now()*0.006)*4;
      const scale = 0.95;
      const dw = healAnim.w * scale;
      const dh = healAnim.h * scale;
  const healOffsetY = 52; // feinjustiert (vorher 42)
  const feetY = (player.visualY!==undefined?player.visualY:player.y) - (player.jumpOffset||0) + healOffsetY;
      ctx.save();
      ctx.imageSmoothingEnabled = false;
      ctx.globalAlpha = 0.94;
  ctx.drawImage(healAnim.img, col*healAnim.w, row*healAnim.h, healAnim.w, healAnim.h, Math.round(player.x - dw/2), Math.round(feetY - dh + bob), dw, dh);
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = 0.35;
      const grd = ctx.createRadialGradient(player.x, feetY - dh*0.4, 8, player.x, feetY - dh*0.4, dh*0.55);
      grd.addColorStop(0,'rgba(120,255,180,0.8)');
      grd.addColorStop(0.4,'rgba(80,200,140,0.3)');
      grd.addColorStop(1,'rgba(40,120,80,0)');
      ctx.fillStyle = grd;
      ctx.beginPath(); ctx.arc(player.x, feetY - dh*0.4, dh*0.55, 0, Math.PI*2); ctx.fill();
      ctx.restore();
    } else {
      // Platzhalter entfernt (nur still warten bis Sprite geladen ist)
      if(!healAnim._loggedPending){ console.log('[HealAnim] pending load (kein Placeholder)...', healAnim.img ? healAnim.img.src : 'no image'); healAnim._loggedPending=true; }
    }
  }

  // GLOBAL Poison State Overlay (Player + vergiftete Gegner)
  // Render-Ebene: Nach Charakter/Heilung, vor Projektilen/AOEs für gute Lesbarkeit
  (function renderPoison(){
    const dtLocal = 0; // kein lokales dt nötig, globaler poisonAnimTime läuft extern
    // Player falls vergiftet
    const list = [];
    if(isEntityPoisoned(player)) list.push(player);
    for(const e of state.enemies){ if(isEntityPoisoned(e)) list.push(e); }
    if(list.length===0) return;
    const anim = poisonStateAnim;
    const fps = anim.fps || 12;
    const frameDur = 1 / fps;
    const frames = anim.frames || 1;
    const baseT = poisonAnimTime;
    const fi = frames>0 ? Math.floor(baseT / frameDur) % frames : 0;
    for(const ent of list){
      const feetY = ent.y + (ent === player ? 32 : (ent.r||16));
      const alphaPulse = 0.75 + Math.sin(baseT*3 + ent.x*0.05)*0.15;
      if(anim.loaded && anim.img && anim.img.complete && anim.fw>0){
        const cols = anim.cols || frames;
        const sx = (fi % cols) * anim.fw;
        const sy = Math.floor(fi / cols) * anim.fh;
        // Separate Skalierung für Player und Gegner
        const scale = (ent === player) ? 0.88 : 0.70; // kleiner für kleinere Gegner
        const dw = anim.fw * scale; const dh = anim.fh * scale;
        const drawW = dw;
        const drawH = dh;
        // Weiter nach unten ähnlich Heal: zusätzlichen Offset nutzen
        const baseOff = (ent === player) ? 8 : (ent.r||16)*0.6;
        const extraDown = 34; // Feinjustierung nach Wunsch
        const offY = (ent === player ? -drawH + baseOff + extraDown : -drawH + baseOff + extraDown);
        ctx.save();
        ctx.imageSmoothingEnabled = false;
        ctx.globalAlpha = 0.85 * alphaPulse;
        ctx.globalCompositeOperation = 'lighter';
        ctx.drawImage(anim.img, sx, sy, anim.fw, anim.fh, Math.round(ent.x - drawW/2), Math.round(feetY + offY), drawW, drawH);
        ctx.restore();
      } else {
        // Kein Fallback-Kreis mehr gewünscht -> nichts zeichnen.
      }
    }
  })();


// (Removed Bully aura system)
  

      
      for(const s of state.enemyShots){
        ctx.save();
        ctx.globalAlpha = 0.92;
        
        const angle = Math.atan2(s.vy, s.vx);
        ctx.translate(s.x, s.y);
        ctx.rotate(angle);
        
        ctx.strokeStyle = '#8b5c2a';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(-10, 0);
        ctx.lineTo(10, 0);
        ctx.stroke();
        
        ctx.fillStyle = '#cccccc';
        ctx.beginPath();
        ctx.moveTo(10, 0);
        ctx.lineTo(4, -4);
        ctx.lineTo(4, 4);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      const boltW = weapons.find(w=>w.id==='bolt');
      if(boltW && boltW.kristof){
        const stage = boltW.kristofStage||1;
        const bladeRadius = 84 + (stage-1)*6;
        const count = Math.min(64, 8 + stage*3);
        for(let i=0;i<count;i++){ const a = state.kristofBladeRot + (i/count) * Math.PI*2; const bx = player.x + Math.cos(a) * bladeRadius; const by = player.y + Math.sin(a) * bladeRadius; ctx.save(); ctx.translate(bx,by); ctx.rotate(a); ctx.fillStyle = 'rgba(255,200,100,0.95)'; ctx.beginPath(); ctx.moveTo(-6,-2); ctx.lineTo(10,0); ctx.lineTo(-6,2); ctx.closePath(); ctx.fill(); ctx.restore(); }
      }


  
      for(const a of state.aoes){
        const t = Math.max(0, Math.min(1, a.age / a.life));
        const alpha = 0.55 * (1 - t);
        const scale = 0.9 + 0.4 * (1 - t);
        ctx.save();
        ctx.globalAlpha = alpha;
  ctx.fillStyle = '#cccccc';
        ctx.beginPath();
        ctx.arc(a.x, a.y, a.r * scale, 0, Math.PI*2);
        ctx.fill();
        
        ctx.globalAlpha = 0.9 * (1 - t);
        ctx.lineWidth = 3;
        ctx.strokeStyle = a.color;
        ctx.beginPath();
        ctx.arc(a.x, a.y, a.r * (0.95 + 0.05 * (1 - t)), 0, Math.PI*2);
        ctx.stroke();
        ctx.restore();
      }
      
      updateUITransparency();
      // Globaler Spin Overlay Aufruf (bereinigt, ohne Fallback/Logs)
      if(window.swordSpin && window.swordSpin.active && typeof drawSpinOverlay === 'function'){
        drawSpinOverlay(ctx);
      }
    }

    function init(){
      buildUI();
      updateHUD();
      if(typeof updateLiveScore==='function') updateLiveScore();
      loop();
    }
      
      state.running = false;
      function populateStartMenu() {
          // Overlay nur im Startmenü anzeigen
          const infoDiv = document.getElementById('nextStartInfo');
          const startMenu = document.getElementById('startMenu');
          if(infoDiv && startMenu) {
            infoDiv.style.display = startMenu.classList.contains('show') ? 'block' : 'none';
          }
        try {
          var menu = document.getElementById('menuWeapons');
          var tooltip = document.getElementById('weaponTooltip');
          if (!menu) return;
          menu.innerHTML = '';
          // --- Character Preview UI ---
          let previewBox = document.getElementById('charPreviewBox');
          if (!previewBox) {
            previewBox = document.createElement('div');
            previewBox.id = 'charPreviewBox';
            previewBox.style.display = 'flex';
            previewBox.style.flexDirection = 'column';
            previewBox.style.alignItems = 'center';
            previewBox.style.marginBottom = '18px';
            menu.appendChild(previewBox);
          } else {
            menu.appendChild(previewBox);
          }
          previewBox.innerHTML = '';
          // Canvas für Vorschau
          let canvas = document.createElement('canvas');
          canvas.width = 96; canvas.height = 96;
          canvas.style.background = '#222';
          canvas.style.borderRadius = '8px';
          canvas.style.marginBottom = '8px';
          previewBox.appendChild(canvas);
          // Dreh-Buttons
          let btnRow = document.createElement('div');
          btnRow.style.display = 'flex';
          btnRow.style.gap = '12px';
          let btnLeft = document.createElement('button'); btnLeft.textContent = '⟲'; btnLeft.title = 'Links drehen';
          let btnRight = document.createElement('button'); btnRight.textContent = '⟳'; btnRight.title = 'Rechts drehen';
          btnRow.appendChild(btnLeft); btnRow.appendChild(btnRight);
          previewBox.appendChild(btnRow);

          // Auswahl-Anzeige unter der Vorschau
          let selectionInfo = document.createElement('div');
          selectionInfo.id = 'selectionInfo';
          selectionInfo.style.margin = '10px 0 0 0';
          selectionInfo.style.fontSize = '1.1em';
          selectionInfo.style.fontWeight = 'bold';
          selectionInfo.style.color = '#ffe600';
          selectionInfo.style.textShadow = '0 2px 8px #000b,0 0 8px #ffe60088';
          function updateSelectionInfo() {
            let charTxt = (window.selectedCharacter === 'bully') ? 'Bully' : 'Fred';
            let weaponObj = weapons.find(w => w.id.toLowerCase() === (window.selectedWeaponId||'sword').toLowerCase());
            let weaponTxt = weaponObj ? weaponObj.name : 'Sword';
            selectionInfo.textContent = `Start: ${charTxt} / ${weaponTxt}`;
            // Update global Overlay
            const infoDiv = document.getElementById('nextStartInfo');
            const startMenu = document.getElementById('startMenu');
            if(infoDiv) {
              infoDiv.textContent = `Nächster Start: ${charTxt} / ${weaponTxt}`;
              // Sofort prüfen, ob Menü sichtbar ist
              if(startMenu) {
                infoDiv.style.display = startMenu.classList.contains('show') ? 'block' : 'none';
              }
            }
// Overlay auch beim Start/Verlassen des Menüs aktualisieren
document.addEventListener('DOMContentLoaded', () => {
  const startMenu = document.getElementById('startMenu');
  const infoDiv = document.getElementById('nextStartInfo');
  function updateOverlayVisibility() {
    if(infoDiv && startMenu) {
      // Auch sofort Text aktualisieren
      let charTxt = (window.selectedCharacter === 'bully') ? 'Bully' : 'Fred';
      let weaponObj = window.weapons ? window.weapons.find(w => w.id.toLowerCase() === (window.selectedWeaponId||'sword').toLowerCase()) : null;
      let weaponTxt = weaponObj ? weaponObj.name : 'Sword';
      infoDiv.textContent = `Nächster Start: ${charTxt} / ${weaponTxt}`;
      infoDiv.style.display = startMenu.classList.contains('show') ? 'block' : 'none';
    }
  }
  if(startMenu) {
    const observer = new MutationObserver(updateOverlayVisibility);
    observer.observe(startMenu, { attributes: true, attributeFilter: ['class'] });
    updateOverlayVisibility();
  }
  // Auch bei jeder Auswahländerung im Menü sofort aktualisieren
  window._updateSelectionInfo = updateOverlayVisibility;
});
          }
          updateSelectionInfo();
          previewBox.appendChild(selectionInfo);
          // Bei jeder Auswahl neu anzeigen
          window._updateSelectionInfo = updateSelectionInfo;

          // Charakter-Buttons (Fred/Bully)
          let charBtnRow = document.createElement('div');
          charBtnRow.style.display = 'flex';
          charBtnRow.style.gap = '12px';
          ['fred','bully'].forEach(charKey => {
            let btn = document.createElement('button');
            btn.textContent = charKey.charAt(0).toUpperCase() + charKey.slice(1);
            btn.style.padding = '6px 18px';
            btn.style.borderRadius = '8px';
            btn.style.fontWeight = 'bold';
            btn.style.background = (window.selectedCharacter === charKey) ? '#7a38e1' : '#23232a';
            btn.style.color = '#fff';
            btn.onclick = () => {
              window.selectedCharacter = charKey;
              drawPreview();
              if(window._updateSelectionInfo) window._updateSelectionInfo();
              populateStartMenu();
            };
            charBtnRow.appendChild(btn);
          });
          previewBox.appendChild(charBtnRow);

          weapons.forEach((w, i) => {
            const card = document.createElement('div');
            card.style.minWidth = '140px'; card.style.padding = '8px'; card.style.borderRadius = '8px'; card.style.background = '#0f0f12'; card.style.border = '2px solid #222'; card.style.cursor = 'pointer';
            card.style.display = 'flex'; card.style.flexDirection = 'column'; card.style.gap = '6px';
            card.style.transition = 'border 0.2s, box-shadow 0.2s';
            const title = document.createElement('div'); title.textContent = w.name + ' (Lv ' + (w.lvl||1) + ')'; title.style.fontWeight = '700'; title.style.color = w.color || '#fff';
            const desc = document.createElement('div'); desc.textContent = `${w.type} · dmgMul:${(w.dmgMul||1).toFixed(2)} · range:${w.range||0}`;
            desc.style.fontSize = '12px'; desc.style.color = '#ddd';
            card.appendChild(title); card.appendChild(desc);
            if(w.id === 'bolt') {
              card.style.opacity = '0.45';
              card.style.pointerEvents = 'none';
              card.title = '';
              card.style.cursor = 'not-allowed';
            } else {
              if(window.selectedWeaponId === w.id) {
                card.style.border = '3px solid ' + (w.color || '#7a38e1');
                card.style.boxShadow = '0 0 16px ' + (w.color || '#7a38e1') + '55';
                card.style.background = '#18182a';
              }
              card.onclick = (ev)=>{
                window.selectedWeaponId = w.id;
                player.weaponIndex = i;
                drawPreview();
                if(window._updateSelectionInfo) window._updateSelectionInfo();
                populateStartMenu();
                if(startBtn) startBtn.disabled = false;
                setTimeout(()=>{ if(window._charPreviewDir!=null) drawPreview(); }, 120);
                let extra = '';
                if(w.id === 'dagger') {
                  extra = `<br><span style=\"color:#f7c948;font-weight:700\">Spezial: Trifft Gegner mit einem DoT-Dolch, der 10% ihrer HP über 5 Sekunden als Giftschaden verursacht!</span>`;
                } else if(w.id === 'halbard') {
                  extra = `<br><span style=\"color:#38e1d7;font-weight:700\">Rundumschlag nach 10 Treffern!</span>`;
                } else if(w.id === 'sword') {
                  extra = `<br><span style=\"color:#c73be6;font-weight:700\">Solider Nahkampfschaden, gute Reichweite.</span>`;
                } else if(w.id === 'staff') {
                  extra = `<br><span style=\"color:#ff7c1f;font-weight:700\">Fernkampf-Projektile mit Flächenschaden.</span>`;
                }
                tooltip.innerHTML = `<strong>${w.name}</strong><br>Typ: ${w.type}<br>Schaden-Multiplikator: ${(w.dmgMul||1).toFixed(2)}<br>Reichweite: ${w.range||0}<br>Cooldown: ${w.cooldown||0}${extra}`;
                tooltip.style.display = 'block';
                const rect = card.getBoundingClientRect();
                tooltip.style.left = (rect.left + window.scrollX + rect.width/2 - tooltip.offsetWidth/2) + 'px';
                tooltip.style.top = (rect.bottom + window.scrollY + 8) + 'px';
              };
            }
            card.onmouseenter = null;
            card.onmouseleave = null;
            menu.appendChild(card);
          });
          
          if(startBtn) startBtn.disabled = (typeof player.weaponIndex !== 'number' || player.weaponIndex < 0);
          
          if(startBtn){
            startBtn.onclick = ()=>{
              // Nur noch restart() aufrufen, das übernimmt die Auswahl garantiert
              tooltip.style.display = 'none';
              document.getElementById('startMenu').classList.remove('show');
              restart();
              const scoreDiv = document.getElementById('gameOverScore');
              if(scoreDiv) scoreDiv.textContent = 'Score: 0';
              const gameOverOverlay = document.getElementById('gameOver');
              if(gameOverOverlay) gameOverOverlay.classList.remove('show');
              state.running = true;
              state.lastTime = performance.now();
            };
          }
        } catch (err) { console.error('populateStartMenu error', err); }
      }
      
  const startBtn = document.getElementById('startBtn');
  // Handler wird bereits korrekt in populateStartMenu gesetzt

      try { 
        populateStartMenu(); 
        // Start-Button-Handler nach Menüaufbau immer neu setzen
        setTimeout(() => {
          const startBtn = document.getElementById('startBtn');
          if(startBtn){
            startBtn.onclick = ()=>{
              document.getElementById('startMenu').classList.remove('show');
              // Overlay sofort ausblenden
              const infoDiv = document.getElementById('nextStartInfo');
              if(infoDiv) infoDiv.style.display = 'none';
              restart();
              const scoreDiv = document.getElementById('gameOverScore');
              if(scoreDiv) scoreDiv.textContent = 'Score: 0';
              const gameOverOverlay = document.getElementById('gameOver');
              if(gameOverOverlay) gameOverOverlay.classList.remove('show');
              state.running = true;
              state.lastTime = performance.now();
            };
          }
        }, 0);
        buildUI(); updateHUD(); loop(); 
      } catch (e){ console.error('Init error:', e); try { pauseOverlay.classList.add('show'); } catch(_) {} }


    function loop(){
      try {
        const now = performance.now();
        let dt = (now - state.lastTime) / 1000;
        state.lastTime = now;
        if(dt > 0.08) dt = 0.08;
        // Heartbeat für Debug (nur alle 5s loggen)
        window.__hbT = (window.__hbT||0) + dt;
        if(window.__hbT >= 5){
          window.__hbT = 0;
          console.log('[Loop HB]', 'time', state.time.toFixed(1), 'enemies', state.enemies.length, state.kristof?('kHP '+(state.kristof.hp/state.kristof.maxHp*100).toFixed(1)+'%'):'noKristof');
        }
        
        if(state.running && !state.dead){
          // Failsafe: falls HP bereits 0 aber Tod-Sequenz nicht gestartet
          if(player && player.hp <= 0 && !isDying && !state.dead){
            player.hp = 0;
            if(window.ENABLE_DEATH_ANIMATION){
              startDeath();
            } else {
              die();
            }
          }
          step(dt);
          checkChestPickup();
          draw();
        } else if(state.dead) {
          draw();
        }
        requestAnimationFrame(loop);
      } catch (e) {
        console.error('Error in game loop:', e);
        state.running = false;
        try { pauseOverlay.classList.add('show'); } catch(_) {}
      }
    }

    // Watchdog: prüfe alle 4s ob time weiterläuft, sonst logge Freeze-Indizien
    setInterval(()=>{
      window.__wdLast = window.__wdLast || {t: state.time};
      if(Math.abs(state.time - window.__wdLast.t) < 0.01 && state.running && !state.dead){
        console.warn('[Watchdog] möglicher Freeze erkannt: time steht', state.time.toFixed(2), 'Kristof', state.kristof?{hp:state.kristof.hp, st:state.kristof.shockwaveState}:null, 'enemies', state.enemies.length);
      }
      window.__wdLast.t = state.time;
    }, 4000);

})();

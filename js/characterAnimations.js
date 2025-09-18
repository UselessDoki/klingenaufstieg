 


 
function getFredSheets(weapon) {
  const w = weapon || 'Sword';
  const base = 'img/Fred Animation/Fred ' + w;
  
  if (/dagger/i.test(w) || /staff/i.test(w)) {
    return {
      walk: { img: (()=>{ let i=new Image(); i.src=base+'/walk.png'; return i; })(), w:64, h:64, frames:9, rows:["up","left","down","right"], fps:10 },
      idle: { img: (()=>{ let i=new Image(); i.src=base+'/idle.png'; return i; })(), w:64, h:64, frames:10, rows:["up","left","down","right"], fps:10 },
      hurt: { img: (()=>{ let i=new Image(); i.src=base+'/hurt.png'; return i; })(), w:64, h:64, frames:6, rows:["down"], fps:12 },
      slash: { img: (()=>{ let i=new Image(); i.src=base+'/thrust_oversize.png'; return i; })(), w:64, h:64, frames:6, rows:["up","left","down","right"], fps:14 }
    };
  }
  
  return {
    walk: { img: (()=>{ let i=new Image(); i.src=base+'/walk.png'; return i; })(), w:64, h:64, frames:9, rows:["up","left","down","right"], fps:10 },
    idle: { img: (()=>{ let i=new Image(); i.src=base+'/idle.png'; return i; })(), w:64, h:64, frames:10, rows:["up","left","down","right"], fps:10 },
    hurt: { img: (()=>{ let i=new Image(); i.src=base+'/hurt.png'; return i; })(), w:64, h:64, frames:6, rows:["down"], fps:12 },
    slash: { img: (()=>{ let i=new Image(); i.src=base+'/slash_oversize.png'; return i; })(), w:192, h:192, frames:6, rows:["up","left","down","right"], fps:12 }
  };
}

function getBullySheets(weapon) {
  const w = weapon || 'Sword';
  let base = 'img/Bully Animation/Bully ' + w;
  
  if (/dagger/i.test(w)) {
    return {
      walk: { img: (()=>{ let i=new Image(); i.src=base+'/walk.png'; return i; })(), w:64, h:64, frames:9, rows:["up","left","down","right"], fps:10 },
      idle: { img: (()=>{ let i=new Image(); i.src=base+'/idle.png'; return i; })(), w:64, h:64, frames:10, rows:["up","left","down","right"], fps:10 },
      hurt: { img: (()=>{ let i=new Image(); i.src=base+'/hurt.png'; return i; })(), w:64, h:64, frames:6, rows:["down"], fps:12 },
  slash: { img: (()=>{ let i=new Image(); i.src=base+'/slash.png'; return i; })(), w:64, h:64, frames:6, rows:["up","left","down","right"], fps:18 }
    };
  }
  
  if (/halberd|halbard/i.test(w)) {
    base = 'img/Bully Animation/Bully Halberd';
    return {
      walk: { img: (()=>{ let i=new Image(); i.src=base+'/walk.png'; return i; })(), w:64, h:64, frames:9, rows:["up","left","down","right"], fps:10 },
      idle: { img: (()=>{ let i=new Image(); i.src=base+'/idle.png'; return i; })(), w:64, h:64, frames:10, rows:["up","left","down","right"], fps:10 },
      hurt: { img: (()=>{ let i=new Image(); i.src=base+'/hurt.png'; return i; })(), w:64, h:64, frames:6, rows:["down"], fps:12 },
      slash: { img: (()=>{ let i=new Image(); i.src=base+'/slash_oversize.png'; return i; })(), w:192, h:192, frames:6, rows:["up","left","down","right"], fps:12 }
    };
  }
  
  if (/staff/i.test(w)) {
    return {
      walk: { img: (()=>{ let i=new Image(); i.src=base+'/walk.png'; return i; })(), w:64, h:64, frames:9, rows:["up","left","down","right"], fps:10 },
      idle: { img: (()=>{ let i=new Image(); i.src=base+'/idle.png'; return i; })(), w:64, h:64, frames:10, rows:["up","left","down","right"], fps:10 },
      hurt: { img: (()=>{ let i=new Image(); i.src=base+'/hurt.png'; return i; })(), w:64, h:64, frames:6, rows:["down"], fps:12 },
      slash: { img: (()=>{ let i=new Image(); i.src=base+'/thrust_oversize.png'; return i; })(), w:64, h:64, frames:6, rows:["up","left","down","right"], fps:14 }
    };
  }
  
  return {
    walk: { img: (()=>{ let i=new Image(); i.src=base+'/walk.png'; return i; })(), w:64, h:64, frames:9, rows:["up","left","down","right"], fps:10 },
    idle: { img: (()=>{ let i=new Image(); i.src=base+'/idle.png'; return i; })(), w:64, h:64, frames:10, rows:["up","left","down","right"], fps:10 },
    hurt: { img: (()=>{ let i=new Image(); i.src=base+'/hurt.png'; return i; })(), w:64, h:64, frames:6, rows:["down"], fps:12 },
    slash: { img: (()=>{ let i=new Image(); i.src=base+'/slash_oversize.png'; return i; })(), w:192, h:192, frames:6, rows:["up","left","down","right"], fps:12 }
  };
}

 
window.getFredSheets = getFredSheets;
window.getBullySheets = getBullySheets;

 

window.TESTMODE = true;

 
function setupTestModeButton() {
  const btn = document.getElementById('testModeBtn');
  if (!btn) return;
  btn.style.display = 'block';
  btn.textContent = 'Test Mode: ' + (window.TESTMODE ? 'AN' : 'AUS');
  btn.onclick = function() {
    window.TESTMODE = !window.TESTMODE;
    btn.textContent = 'Test Mode: ' + (window.TESTMODE ? 'AN' : 'AUS');
    document.body.classList.toggle('testmode', window.TESTMODE);
  if (typeof onTestModeToggle === 'function') onTestModeToggle(window.TESTMODE);
  if (typeof updateTestModeIndicator === 'function') updateTestModeIndicator();
  };
}

document.addEventListener('DOMContentLoaded', function() {
  setupTestModeButton();
  if (typeof updateTestModeIndicator === 'function') updateTestModeIndicator();
});

 
window.onTestModeToggle = function(isActive) {
  
  if(isActive) {
    console.log('Testmode aktiviert!');
  } else {
    console.log('Testmode deaktiviert!');
  }
  if (typeof updateTestModeIndicator === 'function') updateTestModeIndicator();
};

const menuButton = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('#site-nav');

function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Abrir menu');
  siteNav.classList.remove('is-open');
}

menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Abrir menu' : 'Fechar menu');
  siteNav.classList.toggle('is-open', !isOpen);
});

siteNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu();
});

const contactForm = document.querySelector('#contact-form');
const formResult = document.querySelector('#form-result');

contactForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const fields = [...contactForm.querySelectorAll('input, textarea')];
  let firstInvalidField;

  fields.forEach((field) => {
    const valid = field.checkValidity();
    field.setAttribute('aria-invalid', String(!valid));
    if (!valid && !firstInvalidField) firstInvalidField = field;
  });

  if (firstInvalidField) {
    formResult.hidden = true;
    firstInvalidField.focus();
    firstInvalidField.reportValidity();
    return;
  }

  const data = new FormData(contactForm);
  formResult.innerHTML = `
    <h3>Mensagem registrada nesta demonstração!</h3>
    <p><strong>Nome:</strong> ${escapeHtml(data.get('nome'))}</p>
    <p><strong>E-mail:</strong> ${escapeHtml(data.get('email'))}</p>
    <p><strong>Mensagem:</strong> ${escapeHtml(data.get('mensagem'))}</p>
  `;
  formResult.hidden = false;
  formResult.focus();
});

contactForm.querySelectorAll('input, textarea').forEach((field) => {
  field.addEventListener('input', () => field.removeAttribute('aria-invalid'));
});

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
  })[character]);
}

const gameCanvas = document.querySelector('#soccer-game');

if (gameCanvas) {
  const ctx = gameCanvas.getContext('2d');
  const aim = document.querySelector('#aim');
  const power = document.querySelector('#power');
  const aimValue = document.querySelector('#aim-value');
  const powerValue = document.querySelector('#power-value');
  const shootButton = document.querySelector('#shoot-button');
  const restartButton = document.querySelector('#restart-game');
  const gameStatus = document.querySelector('#game-status');
  const goalsLabel = document.querySelector('#goals');
  const shotsLabel = document.querySelector('#shots-left');
  let goals = 0;
  let shotsLeft = 5;
  let shot = null;
  let finishTime = 0;

  function drawPlayer(x, y, color, keeper = false) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y - 33, 11, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(x - 13, y - 20, 26, 33);
    ctx.strokeStyle = '#182820';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x - 7, y + 10); ctx.lineTo(x - 14, y + 27);
    ctx.moveTo(x + 7, y + 10); ctx.lineTo(x + 14, y + 27);
    ctx.stroke();
    ctx.strokeStyle = keeper ? '#f4e58d' : '#fff';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(x - 10, y - 13); ctx.lineTo(x - 23, y - 2);
    ctx.moveTo(x + 10, y - 13); ctx.lineTo(x + 23, y - 2);
    ctx.stroke();
  }

  function drawBall(x, y, radius = 12) {
    ctx.fillStyle = '#fff';
    ctx.strokeStyle = '#26372d';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(x, y, radius, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#26372d';
    ctx.beginPath();
    for (let i = 0; i < 5; i += 1) {
      const angle = -Math.PI / 2 + i * (Math.PI * 2 / 5);
      const px = x + Math.cos(angle) * radius * .45;
      const py = y + Math.sin(angle) * radius * .45;
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.closePath(); ctx.fill();
  }

  function drawScene(now) {
    const w = gameCanvas.width;
    const h = gameCanvas.height;
    ctx.clearRect(0, 0, w, h);
    const sky = ctx.createLinearGradient(0, 0, 0, 210);
    sky.addColorStop(0, '#c9e5ee'); sky.addColorStop(1, '#f2f4df');
    ctx.fillStyle = sky; ctx.fillRect(0, 0, w, 205);
    ctx.fillStyle = '#f4d77b'; ctx.beginPath(); ctx.arc(625, 52, 26, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#315846'; ctx.fillRect(0, 120, w, 45);
    ctx.fillStyle = '#e8eddd'; ctx.font = 'bold 12px Arial';
    ctx.fillText('TORCIDA DO MUNDO DO FUTEBOL', 18, 147);
    for (let i = 0; i < 34; i += 1) {
      ctx.fillStyle = i % 2 ? '#d5ee83' : '#f4f5ed';
      ctx.fillRect(20 + i * 20, 126 + (i % 3) * 7, 8, 4);
    }
    ctx.fillStyle = '#57985d'; ctx.fillRect(0, 165, w, h - 165);
    ctx.fillStyle = '#4f8e55';
    for (let x = 0; x < w; x += 120) ctx.fillRect(x, 165, 60, h - 165);
    ctx.strokeStyle = 'rgba(255,255,255,.7)'; ctx.lineWidth = 2;
    ctx.strokeRect(20, 183, w - 40, 145);
    ctx.beginPath(); ctx.ellipse(360, 256, 68, 35, 0, 0, Math.PI * 2); ctx.stroke();

    ctx.fillStyle = '#edf2e9'; ctx.fillRect(272, 40, 176, 126);
    ctx.fillStyle = '#538e5d'; ctx.fillRect(283, 50, 154, 108);
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 7; ctx.strokeRect(272, 40, 176, 126);
    ctx.strokeStyle = 'rgba(255,255,255,.65)'; ctx.lineWidth = 1;
    for (let x = 292; x < 440; x += 18) { ctx.beginPath(); ctx.moveTo(x, 48); ctx.lineTo(x, 161); ctx.stroke(); }
    for (let y = 60; y < 160; y += 18) { ctx.beginPath(); ctx.moveTo(280, y); ctx.lineTo(440, y); ctx.stroke(); }

    const keeperX = 360 + Math.sin(now / 570) * 48;
    drawPlayer(keeperX, 130, '#d34f39', true);
    drawPlayer(132, 279, '#f5f5ed');
    ctx.fillStyle = 'rgba(20,48,32,.16)'; ctx.beginPath(); ctx.ellipse(132, 308, 24, 7, 0, 0, Math.PI * 2); ctx.fill();

    if (shot) {
      const elapsed = Math.min(1, (now - shot.started) / 850);
      const eased = 1 - Math.pow(1 - elapsed, 3);
      const x = shot.startX + (shot.targetX - shot.startX) * eased;
      const y = shot.startY + (shot.targetY - shot.startY) * eased - Math.sin(Math.PI * elapsed) * shot.arc;
      drawBall(x, y, Math.max(6, 12 - elapsed * 5));
      if (elapsed >= 1 && !shot.checked) resolveShot(now, keeperX);
    } else {
      const targetX = 283 + Number(aim.value) / 100 * 154;
      const targetY = 177 - (Number(power.value) - 25) / 75 * 84;
      ctx.setLineDash([5, 5]); ctx.strokeStyle = 'rgba(255,255,255,.8)'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(145, 280); ctx.lineTo(targetX, targetY); ctx.stroke(); ctx.setLineDash([]);
      ctx.strokeStyle = '#d9f37b'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(targetX, targetY, 10, 0, Math.PI * 2); ctx.stroke();
      drawBall(145, 280);
    }

    if (finishTime && now - finishTime < 850) {
      ctx.fillStyle = 'rgba(13,42,29,.68)'; ctx.fillRect(235, 184, 250, 50);
      ctx.fillStyle = '#fff'; ctx.font = 'bold 20px Arial'; ctx.textAlign = 'center';
      ctx.fillText(gameStatus.textContent, 360, 216); ctx.textAlign = 'left';
    }
    requestAnimationFrame(drawScene);
  }

  function resolveShot(now, keeperX) {
    shot.checked = true;
    const insideGoal = shot.targetX >= 280 && shot.targetX <= 440 && shot.targetY >= 52 && shot.targetY <= 166;
    const saved = insideGoal && Math.abs(shot.targetX - keeperX) < 39;
    if (!insideGoal) gameStatus.textContent = 'Pra fora! Ajuste a direção ou a força.';
    else if (saved) gameStatus.textContent = 'Defesa do goleiro! Tente outro canto.';
    else { goals += 1; gameStatus.textContent = 'Gooooool! Boa cobrança!'; }
    goalsLabel.textContent = String(goals);
    finishTime = now;
    window.setTimeout(() => {
      shot = null;
      if (shotsLeft === 0) {
        gameStatus.textContent = `Fim de jogo: você marcou ${goals} de 5.`;
        shootButton.disabled = true;
        restartButton.hidden = false;
      } else if (!shootButton.disabled) gameStatus.textContent = 'Prepare o próximo chute!';
    }, 900);
  }

  aim.addEventListener('input', () => { aimValue.value = aim.value; aimValue.textContent = aim.value; });
  power.addEventListener('input', () => { powerValue.value = power.value; powerValue.textContent = power.value; });
  shootButton.addEventListener('click', () => {
    if (shot || shotsLeft === 0) return;
    shotsLeft -= 1;
    shotsLabel.textContent = String(shotsLeft);
    shot = {
      started: performance.now(), startX: 145, startY: 280,
      targetX: 283 + Number(aim.value) / 100 * 154,
      targetY: 177 - (Number(power.value) - 25) / 75 * 84,
      arc: 20 + Number(power.value) * .28, checked: false
    };
    gameStatus.textContent = 'A bola está a caminho do gol...';
    if (shotsLeft === 0) shootButton.disabled = true;
  });
  restartButton.addEventListener('click', () => {
    goals = 0; shotsLeft = 5; shot = null; finishTime = 0;
    goalsLabel.textContent = '0'; shotsLabel.textContent = '5';
    gameStatus.textContent = 'Prepare o chute! Ajuste os controles e tente marcar.';
    shootButton.disabled = false; restartButton.hidden = true;
  });
  requestAnimationFrame(drawScene);
}


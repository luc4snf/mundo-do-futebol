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


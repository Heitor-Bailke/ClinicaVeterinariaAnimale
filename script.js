// Centralize aqui os únicos dados que precisam ser atualizados antes da publicação.
const clinic = {
  whatsapp: '5527997880080',
  phoneDisplay: '(27) 99788-0080',
  message: 'Olá! Vim pelo site da Animale e gostaria de marcar uma consulta.'
};

const units = {
  hospital: {
    label: 'Hospital Veterinario - 24h',
    whatsapp: clinic.whatsapp
  },
  clinic: {
    label: 'Clinica Veterinaria',
    whatsapp: '5527995333047'
  }
};

const whatsappUrl = `https://wa.me/${clinic.whatsapp}?text=${encodeURIComponent(clinic.message)}`;
document.querySelectorAll('[data-whatsapp]').forEach((link) => link.href = whatsappUrl);
document.querySelectorAll('[data-phone]').forEach((link) => link.href = `tel:+${clinic.whatsapp}`);
document.querySelectorAll('[data-phone-text]').forEach((item) => item.textContent = clinic.phoneDisplay);
document.getElementById('year').textContent = new Date().getFullYear();

const header = document.querySelector('.header');
const nav = document.querySelector('.nav');
const toggle = document.querySelector('.menu-toggle');
toggle.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(isOpen));
});
document.querySelectorAll('.nav a').forEach((link) => link.addEventListener('click', () => nav.classList.remove('open')));

const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
  if (entry.isIntersecting) entry.target.classList.add('visible');
}), { threshold: 0.14 });
document.querySelectorAll('.reveal').forEach((item) => observer.observe(item));

const sections = [...document.querySelectorAll('main section[id]')];
const navLinks = [...document.querySelectorAll('.nav a')];
const navObserver = new IntersectionObserver((entries) => entries.forEach((entry) => {
  if (!entry.isIntersecting) return;
  navLinks.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
}), { rootMargin: '-42% 0px -52% 0px' });
sections.forEach((section) => navObserver.observe(section));

window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 12), { passive: true });

const serviceTrack = document.querySelector('[data-services-track]');
const previousService = document.querySelector('[data-services-prev]');
const nextService = document.querySelector('[data-services-next]');

if (serviceTrack && previousService && nextService) {
  let slideTimer;
  const step = () => serviceTrack.querySelector('.service-card').getBoundingClientRect().width + 16;
  const updateServiceControls = () => {
    previousService.disabled = serviceTrack.scrollLeft < 4;
    nextService.disabled = serviceTrack.scrollLeft + serviceTrack.clientWidth >= serviceTrack.scrollWidth - 4;
  };
  const slideServices = (direction) => {
    serviceTrack.classList.add('is-sliding');
    serviceTrack.scrollBy({ left: direction * step(), behavior: 'smooth' });
    window.clearTimeout(slideTimer);
    slideTimer = window.setTimeout(() => serviceTrack.classList.remove('is-sliding'), 430);
  };
  previousService.addEventListener('click', () => slideServices(-1));
  nextService.addEventListener('click', () => slideServices(1));
  serviceTrack.addEventListener('scroll', updateServiceControls, { passive: true });
  window.addEventListener('resize', updateServiceControls);
  updateServiceControls();
}

const whatsappForm = document.querySelector('[data-whatsapp-form]');
const appointmentLink = document.querySelector('.header-cta');

if (appointmentLink) {
  appointmentLink.href = '#formulario';
  appointmentLink.removeAttribute('data-whatsapp');
}

if (whatsappForm) {
  whatsappForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(whatsappForm);
    const name = formData.get('nome').trim();
    const phone = formData.get('telefone').trim();
    const pet = formData.get('pet').trim() || 'Não informado';
    const subject = formData.get('assunto');
    const unit = units[formData.get('unidade')] || units.hospital;
    const message = formData.get('mensagem').trim();
    const whatsappMessage = `Olá! Vim pelo site da Animale.\n\n*Assunto:* ${subject}\n*Unidade preferida:* ${unit.label}\n*Tutor(a):* ${name}\n*WhatsApp:* ${phone}\n*Pet:* ${pet}\n\n*Mensagem:* ${message}`;
    window.open(`https://wa.me/${unit.whatsapp}?text=${encodeURIComponent(whatsappMessage)}`, '_blank', 'noopener');
  });
}

const whatsappButton = document.querySelector('.form-submit');
if (whatsappButton) {
  whatsappButton.addEventListener('pointermove', (event) => {
    const bounds = whatsappButton.getBoundingClientRect();
    whatsappButton.style.setProperty('--pointer-x', `${event.clientX - bounds.left}px`);
    whatsappButton.style.setProperty('--pointer-y', `${event.clientY - bounds.top}px`);
  });
}

const backToTop = document.querySelector('[data-scroll-top]');
if (backToTop) {
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.querySelector('.brand')?.focus({ preventScroll: true });
  });
}

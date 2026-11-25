const chat = document.getElementById('chat');
const welcome = document.getElementById('welcome');
const composer = document.getElementById('composer');
const promptInput = document.getElementById('promptInput');
const newChat = document.getElementById('newChat');
const sidebar = document.querySelector('.sidebar');
const mobileMenu = document.getElementById('mobileMenu');

function escapeHtml(value) {
  const element = document.createElement('div');
  element.textContent = value;
  return element.innerHTML;
}

function resizeTextarea() {
  promptInput.style.height = 'auto';
  promptInput.style.height = `${Math.min(promptInput.scrollHeight, 120)}px`;
}

function addMessage(text, role) {
  const message = document.createElement('div');
  message.className = `message ${role}`;

  if (role === 'user') {
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    bubble.textContent = text;
    message.appendChild(bubble);
  } else {
    message.innerHTML = `
      <div class="assistant-avatar">
        <svg viewBox="0 0 24 24"><path d="M12 2 14.8 9.2 22 12l-7.2 2.8L12 22l-2.8-7.2L2 12l7.2-2.8L12 2Z"/></svg>
      </div>
      <div class="assistant-content">
        <strong>Nexus</strong>
        ${escapeHtml(text)}
      </div>`;
  }

  chat.appendChild(message);
  chat.scrollTop = chat.scrollHeight;
}

function sendPrompt(text) {
  const prompt = text.trim();
  if (!prompt) return;

  if (welcome?.isConnected) welcome.remove();
  addMessage(prompt, 'user');
  promptInput.value = '';
  resizeTextarea();

  window.setTimeout(() => {
    addMessage(
      'Entendi sua solicitação. Posso transformar essa ideia em um plano estruturado, com objetivos, etapas práticas e próximos passos. Conte um pouco mais sobre o contexto ou envie seus dados para começarmos.',
      'assistant'
    );
  }, 350);
}

composer.onsubmit = (event) => {
  event.preventDefault();
  sendPrompt(promptInput.value);
};

promptInput.addEventListener('input', resizeTextarea);
promptInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    sendPrompt(promptInput.value);
  }
});

document.querySelectorAll('.prompt-card').forEach((card) => {
  card.addEventListener('click', () => sendPrompt(card.dataset.prompt));
});

newChat.addEventListener('click', () => {
  chat.innerHTML = '';
  chat.appendChild(welcome);
  promptInput.value = '';
  promptInput.focus();
  sidebar.classList.remove('open');
});

mobileMenu.addEventListener('click', () => sidebar.classList.toggle('open'));

document.addEventListener('keydown', (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault();
    promptInput.focus();
  }
});

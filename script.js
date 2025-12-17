function mostrarHora() {
  const agora = new Date();
  const el = document.getElementById("relogio");
  if (el) el.textContent = agora.toLocaleTimeString();
}

mostrarHora();
setInterval(mostrarHora, 1000);

/**
 * @param {string} msg - Mensagem a ser exibida
 */
const toast = document.getElementById("toast");

function showToast(msg){
  if(!toast) return;
  toast.textContent = msg;
  toast.classList.add("show");
  window.clearTimeout(showToast._t);
  showToast._t = window.setTimeout(() => toast.classList.remove("show"), 2400);
}
const btnStorage = document.getElementById("btnStorage");
const storageResult = document.getElementById("storageResult");

btnStorage?.addEventListener("click", () => {
  try{
    localStorage.setItem("nome", "Gleidson");
    
    const nome = localStorage.getItem("nome");
    
    storageResult.style.display = "block";
    storageResult.innerHTML = `<strong>Resultado:</strong> localStorage.getItem("nome") = <code>${String(nome)}</code>`;
    showToast("Salvo e lido do localStorage! ✅");
  }catch(e){
    storageResult.style.display = "block";
    storageResult.textContent = "Não foi possível usar localStorage neste ambiente.";
    showToast("Ops… localStorage não disponível aqui.");
  }
});


document.getElementById("btnTop")?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

const navBody = document.getElementById("navBody");

document.getElementById("btnCollapse")?.addEventListener("click", () => {
  if(!navBody) return;
  navBody.style.maxHeight = "260px";
  navBody.style.overflow = "auto";
  showToast("Índice recolhido.");
});

document.getElementById("btnExpand")?.addEventListener("click", () => {
  if(!navBody) return;
  navBody.style.maxHeight = "none";
  navBody.style.overflow = "visible";
  showToast("Índice expandido.");
});

const links = Array.from(document.querySelectorAll('.nav-link'));
const sections = links
  .map(a => document.querySelector(a.getAttribute('href')))
  .filter(Boolean);

const obs = new IntersectionObserver((entries) => {
  for (const entry of entries){
    if (entry.isIntersecting){
      const id = '#' + entry.target.id;
      links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === id));
    }
  }
}, { rootMargin: "-30% 0px -60% 0px", threshold: 0.02 });

sections.forEach(sec => obs.observe(sec));

window.addEventListener('keydown', (e) => {
  const key = e.key.toUpperCase();
  
  if (key === '/'){
    e.preventDefault();
    showToast('Use Ctrl + F para buscar na página 🔎');
    return;
  }

  const target = links.find(a => (a.dataset.key || '').toUpperCase() === key);
  if (target){
    e.preventDefault();
    target.click();
    document.querySelector(target.getAttribute('href'))?.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    });
  }
});

links.forEach(a => a.addEventListener('click', (e) => {
  const href = a.getAttribute('href');
  const el = href ? document.querySelector(href) : null;
  if (el){
    e.preventDefault();
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}));

function highlightCode() {
  document.querySelectorAll('pre code').forEach(block => {
    let html = block.innerHTML;
    
    // Palavras-chave
    html = html.replace(/\b(let|const|var|if|else|switch|case|break|default|function|return|for|while|do|try|catch|finally|throw|new|class|extends|import|export|from|async|await|typeof|instanceof|in|of|delete|void|this|super|static|get|set|yield|debugger)\b/g, 
      '<span class="keyword">$1</span>');
    
    // Console
    html = html.replace(/\b(console)\b/g, '<span class="console">$1</span>');
    
    // Funções
    html = html.replace(/\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/g, '<span class="function">$1</span>(');
    
    // Strings
    html = html.replace(/"([^"]*)"/g, '<span class="string">"$1"</span>');
    html = html.replace(/'([^']*)'/g, '<span class="string">\'$1\'</span>');
    
    // Números
    html = html.replace(/\b(\d+)\b/g, '<span class="number">$1</span>');
    
    // Booleanos
    html = html.replace(/\b(true|false|null|undefined|NaN)\b/g, '<span class="boolean">$1</span>');
    
    // Comentários
    html = html.replace(/\/\/(.*)/g, '<span class="comment">//$1</span>');
    
    // Operadores
    html = html.replace(/([+\-*/%=<>!&|?:]+)/g, '<span class="operator">$1</span>');
    
    block.innerHTML = html;
  });
}

function addCopyButtons() {
  const pres = document.querySelectorAll('pre');
  console.log(`Encontrados ${pres.length} blocos de código`);
  
  pres.forEach((pre, index) => {
    // verifica se já tem wrapper
    if (pre.parentElement && pre.parentElement.classList.contains('code-wrapper')) {
      console.log(`Bloco ${index} já tem wrapper`);
      return;
    }
    
    // envolve o pre em um wrapper
    const wrapper = document.createElement('div');
    wrapper.className = 'code-wrapper';
    pre.parentNode.insertBefore(wrapper, pre);
    wrapper.appendChild(pre);
    
    // cria o botão de copiar
    const button = document.createElement('button');
    button.className = 'copy-btn';
    button.setAttribute('type', 'button');
    button.setAttribute('aria-label', 'Copiar código');
    button.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
      </svg>
      <span>Copiar</span>
    `;
    
    button.addEventListener('click', async () => {
      const code = pre.querySelector('code');
      const text = code ? code.innerText : pre.innerText;
      
      try {
        await navigator.clipboard.writeText(text);
        button.innerHTML = `
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>Copiado!</span>
        `;
        button.classList.add('copied');
        showToast('Código copiado! ✅');
        
        setTimeout(() => {
          button.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            <span>Copiar</span>
          `;
          button.classList.remove('copied');
        }, 2000);
      } catch (err) {
        console.error('Erro ao copiar:', err);
        showToast('Erro ao copiar código');
      }
    });
    
    wrapper.appendChild(button);
    console.log(`Botão adicionado ao bloco ${index}`);
  });
  
  console.log('Botões de copiar adicionados com sucesso!');
}

// cria o botão de toggle
function createThemeToggle() {
  const toggle = document.createElement('button');
  toggle.className = 'theme-toggle';
  toggle.setAttribute('aria-label', 'Alternar modo claro/escuro');
  toggle.innerHTML = `
    <svg class="sun-icon" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="12" r="5"></circle>
      <line x1="12" y1="1" x2="12" y2="3"></line>
      <line x1="12" y1="21" x2="12" y2="23"></line>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
      <line x1="1" y1="12" x2="3" y2="12"></line>
      <line x1="21" y1="12" x2="23" y2="12"></line>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
    </svg>
  `;
  
  toggle.addEventListener('click', toggleTheme);
  document.body.appendChild(toggle);
}

function toggleTheme() {
  const body = document.body;
  const isLight = body.classList.toggle('light-mode');
  
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
  
  const toggle = document.querySelector('.theme-toggle');
  if (isLight) {
    toggle.innerHTML = `
      <svg class="moon-icon" viewBox="0 0 24 24" fill="currentColor">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>
    `;
    showToast('Modo claro ativado ☀️');
  } else {
    toggle.innerHTML = `
      <svg class="sun-icon" viewBox="0 0 24 24" fill="currentColor">
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3" stroke="currentColor" stroke-width="2"></line>
        <line x1="12" y1="21" x2="12" y2="23" stroke="currentColor" stroke-width="2"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="currentColor" stroke-width="2"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="currentColor" stroke-width="2"></line>
        <line x1="1" y1="12" x2="3" y2="12" stroke="currentColor" stroke-width="2"></line>
        <line x1="21" y1="12" x2="23" y2="12" stroke="currentColor" stroke-width="2"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="currentColor" stroke-width="2"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="currentColor" stroke-width="2"></line>
      </svg>
    `;
    showToast('Modo escuro ativado 🌙');
  }
}

function loadSavedTheme() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    document.body.classList.add('light-mode');
    const toggle = document.querySelector('.theme-toggle');
    if (toggle) {
      toggle.innerHTML = `
        <svg class="moon-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      `;
    }
  }
}

// função de inicialização
function initializePage() {
  console.log('=== Inicializando página ===');
  console.log('1. Aplicando syntax highlighting...');
  highlightCode();
  console.log('2. Adicionando botões de copiar...');
  addCopyButtons();
  console.log('3. Criando toggle de tema...');
  createThemeToggle();
  console.log('4. Carregando tema salvo...');
  loadSavedTheme();
  console.log('=== Página inicializada com sucesso! ===');
}

// executa quando o DOM estiver pronto
if (document.readyState === 'loading') {
  console.log('DOM ainda carregando, aguardando DOMContentLoaded...');
  document.addEventListener('DOMContentLoaded', initializePage);
} else {
  console.log('DOM já pronto, inicializando imediatamente...');
  initializePage();
}


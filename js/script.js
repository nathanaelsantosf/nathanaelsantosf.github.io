// =====================================================================
// SCRIPT DO SITE - Daniel Santos Advocacia
// O arquivo está em blocos numerados. Cada bloco faz UMA coisa.
//   1. Menu hambúrguer no celular/tablet (abrir e fechar)
//   2. Rolagem suave ao clicar nos links
//   3. Cabeçalho muda ao rolar a página
//   4. Link do menu fica destacado na seção atual
//   5. Animação de entrada (reveal)
//   6. Ano automático no rodapé
// =====================================================================


// ---------------------------------------------------------------------
// Elementos da página que o script usa
// (document.getElementById busca um elemento pelo id que está no HTML)
// ---------------------------------------------------------------------
const header = document.getElementById('header');
const menu = document.getElementById('menu');
const menuFundo = document.getElementById('menu-fundo');
const botaoAbrir = document.getElementById('menu-botao');
const botaoFechar = document.getElementById('menu-fechar');


// =====================================================================
// 1. MENU HAMBÚRGUER
// =====================================================================

function abrirMenu() {
  menuFundo.hidden = false;
  // O requestAnimationFrame espera o navegador mostrar o fundo
  // antes de aplicar a classe, para a animação acontecer.
  requestAnimationFrame(() => menuFundo.classList.add('is-aberto'));

  menu.classList.add('is-aberto');
  document.body.classList.add('menu-aberto');   // trava a rolagem da página
  botaoAbrir.setAttribute('aria-expanded', 'true');

  // Leva o foco do teclado para dentro do menu
  setTimeout(() => botaoFechar.focus(), 50);
}

function fecharMenu() {
  menu.classList.remove('is-aberto');
  menuFundo.classList.remove('is-aberto');
  document.body.classList.remove('menu-aberto');
  botaoAbrir.setAttribute('aria-expanded', 'false');

  // Depois que a animação termina, esconde o fundo de vez
  setTimeout(() => { menuFundo.hidden = true; }, 350);
}

botaoAbrir.addEventListener('click', abrirMenu);
botaoFechar.addEventListener('click', () => {
  fecharMenu();
  botaoAbrir.focus();
});
menuFundo.addEventListener('click', fecharMenu);   // clicar fora fecha

// Apertar ESC fecha o menu
document.addEventListener('keydown', (evento) => {
  if (evento.key === 'Escape' && menu.classList.contains('is-aberto')) {
    fecharMenu();
    botaoAbrir.focus();
  }
});


// No computador o menu fica na barra do topo (sem hambúrguer).
// Se a tela aumentar com o painel aberto, ele é fechado automaticamente.
const telaComputador = window.matchMedia('(min-width: 1024px)');
telaComputador.addEventListener('change', (evento) => {
  if (evento.matches && menu.classList.contains('is-aberto')) {
    fecharMenu();
  }
});


// =====================================================================
// 2. ROLAGEM SUAVE
// Todo link com o atributo data-link-menu rola suavemente até a seção.
// Se o menu estiver aberto, ele fecha antes.
// =====================================================================

document.querySelectorAll('[data-link-menu]').forEach((link) => {
  link.addEventListener('click', (evento) => {
    const destino = document.querySelector(link.getAttribute('href'));
    if (!destino) return;

    evento.preventDefault();                 // cancela o pulo seco do navegador
    const estavaAberto = menu.classList.contains('is-aberto');
    if (estavaAberto) fecharMenu();

    // Espera o menu liberar a rolagem da página e então rola
    setTimeout(() => {
      destino.scrollIntoView({ behavior: 'smooth' });
      history.replaceState(null, '', link.getAttribute('href'));  // atualiza o endereço
    }, estavaAberto ? 60 : 0);
  });
});


// =====================================================================
// 3. CABEÇALHO MUDA AO ROLAR
// Depois de 20px de rolagem, o cabeçalho ganha a classe "is-scrolled"
// (o visual dela está no style.css, bloco 3).
// =====================================================================

function aoRolar() {
  header.classList.toggle('is-scrolled', window.scrollY > 20);
}
window.addEventListener('scroll', aoRolar, { passive: true });
aoRolar();


// =====================================================================
// 4. LINK DO MENU DESTACADO NA SEÇÃO ATUAL
// Observa qual seção está no meio da tela e marca o link correspondente.
// =====================================================================

const linksDoMenu = document.querySelectorAll('.menu__link');
const secoes = document.querySelectorAll('main section[id], footer[id]');

const observadorDeSecoes = new IntersectionObserver(
  (entradas) => {
    entradas.forEach((entrada) => {
      if (!entrada.isIntersecting) return;
      linksDoMenu.forEach((link) => {
        const ativo = link.getAttribute('href') === '#' + entrada.target.id;
        link.setAttribute('aria-current', ativo ? 'true' : 'false');
      });
    });
  },
  { rootMargin: '-45% 0px -50% 0px' }   // considera a faixa do meio da tela
);

secoes.forEach((secao) => observadorDeSecoes.observe(secao));


// =====================================================================
// 5. ANIMAÇÃO DE ENTRADA (reveal)
// Elementos com class="reveal" aparecem quando entram na tela.
// Irmãos do mesmo grupo aparecem um depois do outro (atraso de 0,1s).
// =====================================================================

const itensReveal = document.querySelectorAll('.reveal');

// Define o atraso de cada item dentro do seu grupo
const contagemPorGrupo = new Map();
itensReveal.forEach((item) => {
  const grupo = item.parentElement;
  const posicao = contagemPorGrupo.get(grupo) ?? 0;
  item.style.setProperty('--delay', `${posicao * 0.1}s`);
  contagemPorGrupo.set(grupo, posicao + 1);
});

const observadorReveal = new IntersectionObserver(
  (entradas) => {
    entradas.forEach((entrada) => {
      if (entrada.isIntersecting) {
        entrada.target.classList.add('is-visible');
        observadorReveal.unobserve(entrada.target);   // anima só uma vez
      }
    });
  },
  { threshold: 0.15, rootMargin: '0px 0px -6% 0px' }
);

itensReveal.forEach((item) => observadorReveal.observe(item));


// =====================================================================
// 6. ANO AUTOMÁTICO NO RODAPÉ
// =====================================================================

const campoAno = document.getElementById('ano');
if (campoAno) campoAno.textContent = new Date().getFullYear();
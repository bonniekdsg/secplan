#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script para adicionar menu hambúrguer mobile em todas as páginas HTML do site SECPLAN
"""

import os
import re
from pathlib import Path

# CSS do menu hambúrguer
MOBILE_MENU_CSS = """
  /* ============================================
     MENU HAMBÚRGUER MOBILE
     ============================================ */
  
  /* Botão hambúrguer */
  .mobile-menu-button {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    width: 32px;
    height: 32px;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
    z-index: 60;
    transition: transform 0.3s ease;
  }

  .mobile-menu-button:focus-visible {
    outline: 2px solid #8D2B2A;
    outline-offset: 4px;
    border-radius: 4px;
  }

  .mobile-menu-button span {
    width: 100%;
    height: 3px;
    background-color: #1F2937;
    border-radius: 2px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    transform-origin: center;
  }

  .dark .mobile-menu-button span {
    background-color: #F3F4F6;
  }

  /* Estado aberto do botão hambúrguer */
  .mobile-menu-button[aria-expanded="true"] span:nth-child(1) {
    transform: translateY(10px) rotate(45deg);
  }

  .mobile-menu-button[aria-expanded="true"] span:nth-child(2) {
    opacity: 0;
    transform: scaleX(0);
  }

  .mobile-menu-button[aria-expanded="true"] span:nth-child(3) {
    transform: translateY(-10px) rotate(-45deg);
  }

  /* Menu mobile overlay */
  .mobile-menu-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 40;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s ease, visibility 0.3s ease;
  }

  .mobile-menu-overlay.active {
    opacity: 1;
    visibility: visible;
  }

  /* Menu mobile drawer */
  .mobile-menu-drawer {
    position: fixed;
    top: 0;
    right: -100%;
    width: 85%;
    max-width: 320px;
    height: 100vh;
    background-color: #FFFFFF;
    box-shadow: -4px 0 24px rgba(0, 0, 0, 0.15);
    z-index: 50;
    overflow-y: auto;
    transition: right 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .dark .mobile-menu-drawer {
    background-color: #1F2937;
  }

  .mobile-menu-drawer.active {
    right: 0;
  }

  .mobile-menu-drawer nav {
    display: flex;
    flex-direction: column;
    padding: 80px 24px 24px;
    gap: 8px;
  }

  .mobile-menu-drawer a {
    display: block;
    padding: 16px 20px;
    font-size: 16px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: #1F2937;
    text-decoration: none;
    border-radius: 8px;
    transition: all 0.2s ease;
    opacity: 0;
    transform: translateX(20px);
  }

  .dark .mobile-menu-drawer a {
    color: #F3F4F6;
  }

  .mobile-menu-drawer.active a {
    animation: slideInRight 0.3s ease forwards;
  }

  .mobile-menu-drawer a:nth-child(1) { animation-delay: 0.05s; }
  .mobile-menu-drawer a:nth-child(2) { animation-delay: 0.1s; }
  .mobile-menu-drawer a:nth-child(3) { animation-delay: 0.15s; }
  .mobile-menu-drawer a:nth-child(4) { animation-delay: 0.2s; }
  .mobile-menu-drawer a:nth-child(5) { animation-delay: 0.25s; }

  .mobile-menu-drawer a:hover,
  .mobile-menu-drawer a:focus-visible {
    background-color: #F3F4F6;
    color: #8D2B2A;
    transform: translateX(4px);
  }

  .dark .mobile-menu-drawer a:hover,
  .dark .mobile-menu-drawer a:focus-visible {
    background-color: #374151;
    color: #FFFFFF;
  }

  .mobile-menu-drawer a:focus-visible {
    outline: 2px solid #8D2B2A;
    outline-offset: 2px;
  }

  @keyframes slideInRight {
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  /* Prevenir scroll do body quando menu está aberto */
  body.menu-open {
    overflow: hidden;
  }

  /* Desktop: esconder botão hambúrguer */
  @media (min-width: 768px) {
    .mobile-menu-button {
      display: none;
    }
  }

  /* Mobile: mostrar botão hambúrguer */
  @media (max-width: 767px) {
    .mobile-menu-button {
      display: flex;
    }
  }

  /* Preferência de movimento reduzido */
  @media (prefers-reduced-motion: reduce) {
    .mobile-menu-button span,
    .mobile-menu-overlay,
    .mobile-menu-drawer,
    .mobile-menu-drawer a {
      transition: none;
      animation: none;
    }
    .mobile-menu-drawer a {
      opacity: 1;
      transform: none;
    }
  }
"""

# HTML do botão hambúrguer e menu mobile
MOBILE_MENU_HTML_BUTTON = """<!-- Botão Menu Hambúrguer Mobile -->
<button 
  class="mobile-menu-button md:hidden" 
  aria-label="Abrir menu de navegação"
  aria-expanded="false"
  aria-controls="mobile-menu-drawer"
  id="mobile-menu-button"
>
  <span></span>
  <span></span>
  <span></span>
</button>"""

MOBILE_MENU_HTML_DRAWER = """<!-- Overlay do Menu Mobile -->
<div class="mobile-menu-overlay" id="mobile-menu-overlay" aria-hidden="true"></div>
<!-- Drawer do Menu Mobile -->
<div class="mobile-menu-drawer" id="mobile-menu-drawer" aria-label="Menu de navegação">
<nav>
<a href="index.html" class="mobile-menu-link">Início</a>
<a href="sobre-nos.html" class="mobile-menu-link">Sobre Nós</a>
<a href="index.html#hero" class="mobile-menu-link">Áreas de Atuação</a>
<a href="index.html#noticias" class="mobile-menu-link">Notícias</a>
<a href="index.html#contato" class="mobile-menu-link">Contato</a>
</nav>
</div>"""

# JavaScript do menu mobile
MOBILE_MENU_JS = """
<!-- Script do Menu Mobile -->
<script>
  (function() {
    'use strict';

    const menuButton = document.getElementById('mobile-menu-button');
    const menuOverlay = document.getElementById('mobile-menu-overlay');
    const menuDrawer = document.getElementById('mobile-menu-drawer');
    const menuLinks = document.querySelectorAll('.mobile-menu-link');
    const body = document.body;

    if (!menuButton || !menuOverlay || !menuDrawer) return;

    let isMenuOpen = false;

    function openMobileMenu() {
      isMenuOpen = true;
      menuButton.setAttribute('aria-expanded', 'true');
      menuOverlay.classList.add('active');
      menuDrawer.classList.add('active');
      menuOverlay.setAttribute('aria-hidden', 'false');
      body.classList.add('menu-open');
      
      // Focar no primeiro link do menu para acessibilidade
      if (menuLinks.length > 0) {
        setTimeout(() => {
          menuLinks[0].focus();
        }, 300);
      }
    }

    function closeMobileMenu() {
      isMenuOpen = false;
      menuButton.setAttribute('aria-expanded', 'false');
      menuOverlay.classList.remove('active');
      menuDrawer.classList.remove('active');
      menuOverlay.setAttribute('aria-hidden', 'true');
      body.classList.remove('menu-open');
    }

    // Abrir menu ao clicar no botão
    menuButton.addEventListener('click', function(e) {
      e.stopPropagation();
      if (isMenuOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    // Fechar menu ao clicar no overlay
    menuOverlay.addEventListener('click', closeMobileMenu);

    // Fechar menu ao clicar em um link
    menuLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        // Se o link não for âncora (#), fechar o menu
        const href = this.getAttribute('href');
        if (href && !href.startsWith('#')) {
          closeMobileMenu();
        } else if (href && href.startsWith('#')) {
          // Para links âncora, fechar menu e fazer scroll suave
          closeMobileMenu();
          const targetId = href.substring(1);
          const targetElement = document.getElementById(targetId);
          if (targetElement) {
            e.preventDefault();
            setTimeout(() => {
              targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 300);
          }
        }
      });
    });

    // Fechar menu ao pressionar ESC
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && isMenuOpen) {
        closeMobileMenu();
        menuButton.focus();
      }
    });

    // Fechar menu ao redimensionar para desktop
    const mediaQuery = window.matchMedia('(min-width: 768px)');
    function handleMediaChange(e) {
      if (e.matches && isMenuOpen) {
        closeMobileMenu();
      }
    }
    mediaQuery.addEventListener('change', handleMediaChange);

    // Prevenir scroll do body quando menu está aberto (já feito via CSS, mas reforçar)
    menuDrawer.addEventListener('touchmove', function(e) {
      if (isMenuOpen) {
        const drawer = this;
        const scrollTop = drawer.scrollTop;
        const scrollHeight = drawer.scrollHeight;
        const height = drawer.clientHeight;
        const isAtTop = scrollTop === 0;
        const isAtBottom = scrollTop + height >= scrollHeight - 1;

        if ((isAtTop && e.touches[0].clientY > e.touches[0].clientY) ||
            (isAtBottom && e.touches[0].clientY < e.touches[0].clientY)) {
          e.preventDefault();
        }
      }
    }, { passive: false });
  })();
</script>
"""


def get_nav_links_from_file(content):
    """Extrai os links de navegação do arquivo HTML"""
    # Procura por links de navegação no header
    nav_pattern = r'<nav[^>]*>.*?</nav>'
    nav_match = re.search(nav_pattern, content, re.DOTALL)
    
    if nav_match:
        nav_content = nav_match.group(0)
        # Extrai os hrefs dos links
        link_pattern = r'href=["\']([^"\']+)["\']'
        links = re.findall(link_pattern, nav_content)
        return links
    
    # Fallback: links padrão
    return ['index.html', 'sobre-nos.html', 'index.html#hero', 'index.html#noticias', 'index.html#contato']


def add_mobile_menu_to_file(file_path):
    """Adiciona o menu hambúrguer mobile a um arquivo HTML"""
    print(f"Processando: {file_path.name}")
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Verificar se já tem o menu hambúrguer
        if 'mobile-menu-button' in content:
            print(f"  ⚠️  {file_path.name} já possui menu hambúrguer. Pulando...")
            return False
        
        modified = False
        
        # 1. Adicionar CSS antes de </style>
        if '</style>' in content and MOBILE_MENU_CSS not in content:
            content = content.replace('</style>', MOBILE_MENU_CSS + '\n</style>')
            modified = True
            print("  ✓ CSS adicionado")
        
        # 2. Adicionar botão hambúrguer após o menu desktop
        # Procura por padrão: </nav></div></div> após o menu desktop
        nav_end_pattern = r'(</nav>\s*</div>\s*</div>)'
        if re.search(nav_end_pattern, content) and MOBILE_MENU_HTML_BUTTON not in content:
            # Adiciona comentário e botão antes do fechamento
            replacement = r'</nav>\n</div>\n' + MOBILE_MENU_HTML_BUTTON + '\n</div>'
            content = re.sub(nav_end_pattern, replacement, content)
            modified = True
            print("  ✓ Botão hambúrguer adicionado")
        
        # 3. Adicionar drawer após o header
        header_end_pattern = r'(</header>)'
        if re.search(header_end_pattern, content) and MOBILE_MENU_HTML_DRAWER not in content:
            content = re.sub(header_end_pattern, r'\1\n' + MOBILE_MENU_HTML_DRAWER, content)
            modified = True
            print("  ✓ Drawer do menu adicionado")
        
        # 4. Adicionar JavaScript antes de </body> ou antes de scripts finais
        # Procura por padrões comuns antes do </body>
        js_insertion_points = [
            (r'(<script src="js/search\.js"></script>)', r'\1\n' + MOBILE_MENU_JS),
            (r'(<!-- Widget VLibras -->)', MOBILE_MENU_JS + '\n\1'),
            (r'(</body>)', MOBILE_MENU_JS + '\n\1'),
        ]
        
        js_added = False
        for pattern, replacement in js_insertion_points:
            if re.search(pattern, content) and MOBILE_MENU_JS not in content:
                content = re.sub(pattern, replacement, content)
                modified = True
                js_added = True
                print("  ✓ JavaScript adicionado")
                break
        
        if modified:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"  ✅ {file_path.name} atualizado com sucesso!")
            return True
        else:
            print(f"  ⚠️  Nenhuma modificação necessária em {file_path.name}")
            return False
            
    except Exception as e:
        print(f"  ❌ Erro ao processar {file_path.name}: {e}")
        return False


def main():
    """Função principal"""
    script_dir = Path(__file__).parent
    html_files = list(script_dir.glob('*.html'))
    
    # Remover index.html da lista (já tem o menu)
    html_files = [f for f in html_files if f.name != 'index.html']
    
    print(f"Encontrados {len(html_files)} arquivos HTML para processar\n")
    
    success_count = 0
    for html_file in html_files:
        if add_mobile_menu_to_file(html_file):
            success_count += 1
        print()
    
    print(f"\n{'='*60}")
    print(f"Processamento concluído!")
    print(f"Arquivos atualizados: {success_count}/{len(html_files)}")
    print(f"{'='*60}")


if __name__ == '__main__':
    main()

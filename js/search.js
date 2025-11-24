/**
 * Funcionalidade de Busca Rápida - SECPLAN
 * Implementa autocompletar, destaque de termos e navegação por teclado.
 */

(function() {
    // Base de dados para pesquisa (Pode ser expandida conforme necessário)
    const searchData = [
        { title: "Início", type: "Página", url: "index.html", keywords: "home, inicial, começo, mpac", context: "Menu Principal" },
        { title: "Sobre Nós", type: "Institucional", url: "sobre-nos.html", keywords: "quem somos, institucional, secplan, missão, visão, valores", context: "Menu Principal" },
        { title: "Áreas de Atuação", type: "Seção", url: "index.html#hero", keywords: "atuação, áreas, serviços, departamentos", context: "Página Inicial" },
        { title: "Instrumentos de Planejamento", type: "Serviço", url: "instrumentos-planejamento.html", keywords: "planejamento, estratégico, ppa, pga, poa, loa, dados", context: "Menu Principal" },
        { title: "Planejamento Estratégico", type: "Instrumento", url: "planejamento-estrategico.html", keywords: "planejamento, estratégico, objetivos, metas, missão, visão", context: "Em: Instrumentos de Planejamento" },
        { title: "Plano Plurianual (PPA)", type: "Instrumento", url: "plano-plurianual.html", keywords: "ppa, plano plurianual, médio prazo, 4 anos, 2024-2027", context: "Em: Instrumentos de Planejamento" },
        { title: "Plano Geral de Atuação (PGA)", type: "Instrumento", url: "plano-geral-atuacao.html", keywords: "pga, plano geral, atuação, diretrizes, objetivos", context: "Em: Instrumentos de Planejamento" },
        { title: "Plano Operacional de Atuação (POA)", type: "Instrumento", url: "plano-operacional-atuacao.html", keywords: "poa, plano operacional, ações, cronograma, execução", context: "Em: Instrumentos de Planejamento" },
        { title: "Lei Orçamentária Anual (LOA)", type: "Instrumento", url: "lei-orcamentaria-anual.html", keywords: "loa, lei orçamentária, orçamento, finanças, recursos", context: "Em: Instrumentos de Planejamento" },
        { title: "Diálogos Regionais", type: "Instrumento", url: "instrumentos-planejamento.html", keywords: "diálogos, regionais, mapa, encontros, relatórios", context: "Em: Instrumentos de Planejamento" },
        { title: "Relatório Anual de Atividades", type: "Documento", url: "relatorio-anual.html", keywords: "relatórios, contas, atividades, gestão, resultados", context: "Menu Principal" },
        { title: "Gestão à Vista", type: "Painel", url: "gestao-vista.html", keywords: "bi, dashboard, indicadores, metas, resultados, power bi", context: "Menu Principal" },
        { title: "Captação de Recursos e Convênios", type: "Serviço", url: "captacao-recursos.html", keywords: "recursos, convênios, fundos, manual, publicações, dinheiro", context: "Menu Principal" },
        { title: "Escritório de Processos", type: "Serviço", url: "escritorio-processos.html", keywords: "processos, bpm, fluxos, modelagem, metodologia, escritório", context: "Menu Principal" },
        { title: "SeringalLab", type: "Inovação", url: "https://seringallab.mpac.mp.br/", keywords: "laboratório, inovação, ideias, projetos, criatividade", context: "Site Externo" },
        { title: "Notícias", type: "Seção", url: "index.html#noticias", keywords: "novidades, atualizações, imprensa, mídia", context: "Página Inicial" },
        { title: "Contato", type: "Seção", url: "index.html#contato", keywords: "fale conosco, endereço, telefone, email, localização", context: "Página Inicial" },
        { title: "Publicações", type: "Página", url: "publicacoes.html", keywords: "publicações, atos, normas, ações institucionais, serviços, documentos", context: "Menu Principal" },
        { title: "Atos e Normas", type: "Seção", url: "atos-normas.html", keywords: "atos, normas, regulamentação, legislação", context: "Em: Publicações" },
        { title: "Ações Institucionais", type: "Seção", url: "acoes-institucionais.html", keywords: "ações, institucionais, eventos", context: "Em: Publicações" },
        { title: "Serviços", type: "Seção", url: "servicos.html", keywords: "serviços, carta de serviços", context: "Em: Publicações" },
        
        // Documentos e Itens Específicos
        { title: "BI dos Convênios e Instrumentos Congêneres", type: "Dashboard", url: "captacao-recursos.html#business-intelligence", keywords: "bi, convênios, instrumentos, business intelligence, dashboard, captação", context: "Em: Captação de Recursos" },
        { title: "BI de Captação de Recursos", type: "Dashboard", url: "captacao-recursos.html#business-intelligence", keywords: "bi, captação, recursos, business intelligence, dashboard", context: "Em: Captação de Recursos" },
        { title: "Manual de Captação de Recursos", type: "Publicação", url: "captacao-recursos.html#publicacoes", keywords: "manual, guia, pdf, instruções, publicações, captação", context: "Em: Captação de Recursos" },
        { title: "Instrução Normativa nº 01/2024", type: "Legislação", url: "captacao-recursos.html#publicacoes", keywords: "normativa, lei, regulamento, regras, publicações, captação", context: "Em: Captação de Recursos" },
        { title: "Metodologia de Processos", type: "Metodologia", url: "escritorio-processos.html", keywords: "metodologia, bpm, modelagem, pdf", context: "Em: Escritório de Processos" },
        { title: "Ato nº 31/2014", type: "Legislação", url: "escritorio-processos.html", keywords: "ato, legislação, processos, publicação", context: "Em: Escritório de Processos" },
        { title: "Repositório de Fluxos", type: "Seção", url: "escritorio-processos.html#repositorio-fluxos", keywords: "repositório, fluxos, bpmn, processos, diagramas, cav, observatório, assessoria, caop, compac, cira, natera, dgp, secplan", context: "Em: Escritório de Processos" },
        { title: "Ato nº 153/2024 - Estrutura da SECPLAN", type: "Legislação", url: "atos-normas.html", keywords: "ato, estrutura, secplan, organização", context: "Em: Atos e Normas" },
        { title: "Mapas Estratégicos", type: "Documento", url: "mapas-estrategicos.html", keywords: "mapas, estratégicos, planejamento", context: "Em: Planejamento Estratégico" },
        { title: "Painel de Metas", type: "Documento", url: "painel-metas.html", keywords: "painel, metas, objetivos", context: "Em: Planejamento Estratégico" },
        { title: "Painéis de Metas do PGA", type: "Documento", url: "paineis-metas.html", keywords: "painéis, metas, pga", context: "Em: Plano Geral de Atuação" },
        { title: "Repositório de Informações SIGE-POA", type: "Documento", url: "repositorio-informacoes.html", keywords: "repositório, informações, sige, poa", context: "Em: Plano Operacional" }
    ];

    // Injeção de CSS para o dropdown de resultados
    const style = document.createElement('style');
    style.textContent = `
        .search-wrapper {
            position: relative !important;
        }
        .search-results-container {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 0.5rem;
            margin-top: 0.5rem;
            max-height: 400px;
            overflow-y: auto;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
            z-index: 9999;
            display: none;
            scrollbar-width: thin;
        }
        .dark .search-results-container {
            background: #1f2937;
            border-color: #374151;
            color: #f3f4f6;
        }
        .search-result-item {
            padding: 0.75rem 1rem;
            border-bottom: 1px solid #f3f4f6;
            cursor: pointer;
            transition: background-color 0.2s;
            text-decoration: none;
            display: block;
            text-align: left;
        }
        .dark .search-result-item {
            border-color: #374151;
        }
        .search-result-item:last-child {
            border-bottom: none;
        }
        .search-result-item:hover, .search-result-item:focus {
            background-color: #f9fafb;
            outline: none;
        }
        .dark .search-result-item:hover, .dark .search-result-item:focus {
            background-color: #374151;
        }
        .search-result-title {
            font-weight: 600;
            color: #111827;
            display: block;
            font-size: 0.95rem;
        }
        .dark .search-result-title {
            color: #f3f4f6;
        }
        .search-result-type {
            font-size: 0.7rem;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            display: block;
            font-weight: 500;
        }
        .dark .search-result-type {
            color: #9ca3af;
        }
        .search-result-context {
            font-size: 0.7rem;
            color: #9ca3af;
            font-style: italic;
            font-weight: 400;
            margin-left: auto;
            text-align: right;
            white-space: nowrap;
        }
        .dark .search-result-context {
            color: #6b7280;
        }
        .highlight {
            background-color: rgba(141, 43, 42, 0.15);
            color: #8D2B2A;
            font-weight: 700;
            border-radius: 2px;
        }
        .dark .highlight {
            background-color: rgba(141, 43, 42, 0.4);
            color: #fca5a5;
        }
        .no-results {
            padding: 1.5rem 1rem;
            text-align: center;
            color: #6b7280;
            font-size: 0.9rem;
        }
        .dark .no-results {
            color: #9ca3af;
        }
        .search-view-more {
            text-align: center;
            color: #8D2B2A;
            font-weight: 600;
            font-size: 0.9rem;
            width: 100%;
            border: none;
            background: none;
        }
        .dark .search-view-more {
            color: #fca5a5;
        }
        /* Atalho Ctrl+K Badge */
        .shortcut-badge {
            position: absolute;
            right: 3.5rem;
            top: 50%;
            transform: translateY(-50%);
            font-size: 0.75rem;
            color: #9ca3af;
            border: 1px solid #e5e7eb;
            border-radius: 4px;
            padding: 0.1rem 0.4rem;
            background: #f9fafb;
            pointer-events: none;
        }
        .dark .shortcut-badge {
            background: #374151;
            border-color: #4b5563;
            color: #d1d5db;
        }
        @media (max-width: 640px) {
            .shortcut-badge { display: none; }
        }
    `;
    document.head.appendChild(style);

    // Inicialização
    function initSearch() {
        const searchInput = document.getElementById('site-search');
        if (!searchInput) return;

        const searchContainer = searchInput.closest('div');
        searchContainer.classList.add('search-wrapper');

        // Adicionar badge de atalho visualmente
        if (!searchContainer.querySelector('.shortcut-badge')) {
            const badge = document.createElement('span');
            badge.className = 'shortcut-badge';
            badge.textContent = 'Ctrl K';
            searchContainer.appendChild(badge);
        }

        // Container de resultados
        let resultsContainer = document.getElementById('search-results');
        if (!resultsContainer) {
            resultsContainer = document.createElement('div');
            resultsContainer.className = 'search-results-container';
            resultsContainer.id = 'search-results';
            resultsContainer.setAttribute('role', 'listbox');
            searchContainer.appendChild(resultsContainer);
        }

        // Event Listeners
        searchInput.addEventListener('input', debounce((e) => handleSearch(e.target.value), 150)); // Resposta rápida < 300ms
        
        searchInput.addEventListener('focus', (e) => {
            if (e.target.value.length > 0) resultsContainer.style.display = 'block';
        });
        
        // Fechar ao clicar fora
        document.addEventListener('click', (e) => {
            if (!searchContainer.contains(e.target)) {
                resultsContainer.style.display = 'none';
            }
        });

        // Navegação por Teclado no Input
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                const firstItem = resultsContainer.querySelector('.search-result-item');
                if (firstItem) firstItem.focus();
            }
            if (e.key === 'Escape') {
                resultsContainer.style.display = 'none';
                searchInput.blur();
            }
            if (e.key === 'Enter') {
                // Se houver apenas 1 resultado ou primeiro selecionado, ir para ele
                const firstItem = resultsContainer.querySelector('.search-result-item');
                if (firstItem && resultsContainer.style.display === 'block') {
                    e.preventDefault();
                    firstItem.click();
                }
            }
        });

        // Navegação por Teclado nos Resultados
        resultsContainer.addEventListener('keydown', (e) => {
            const current = document.activeElement;
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                const next = current.nextElementSibling;
                if (next) next.focus();
            }
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                const prev = current.previousElementSibling;
                if (prev) prev.focus();
                else searchInput.focus();
            }
            if (e.key === 'Escape') {
                resultsContainer.style.display = 'none';
                searchInput.focus();
            }
        });

        // Atalho Global Ctrl+K
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                searchInput.focus();
            }
        });
    }

    // Lógica de Busca
    function handleSearch(query) {
        const resultsContainer = document.getElementById('search-results');
        const badge = document.querySelector('.shortcut-badge');
        
        if (!query || query.trim() === '') {
            resultsContainer.style.display = 'none';
            resultsContainer.innerHTML = '';
            if (badge) badge.style.display = 'block';
            return;
        }

        if (badge) badge.style.display = 'none';

        const normalizedQuery = normalizeString(query);
        
        // Algoritmo de filtro
        const filtered = searchData.filter(item => {
            return normalizeString(item.title).includes(normalizedQuery) ||
                   normalizeString(item.keywords).includes(normalizedQuery);
        });

        // Ordenação por relevância: Título exato > Título parcial > Palavra-chave
        filtered.sort((a, b) => {
            const aTitle = normalizeString(a.title).indexOf(normalizedQuery);
            const bTitle = normalizeString(b.title).indexOf(normalizedQuery);
            
            // Se ambos têm no título, prioriza o que aparece antes
            if (aTitle !== -1 && bTitle !== -1) return aTitle - bTitle;
            // Prioriza quem tem no título
            if (aTitle !== -1) return -1;
            if (bTitle !== -1) return 1;
            return 0;
        });

        renderResults(filtered, query);
    }

    function normalizeString(str) {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    }

    // Renderização
    function renderResults(results, query, showAll = false) {
        const resultsContainer = document.getElementById('search-results');
        resultsContainer.innerHTML = '';

        if (results.length === 0) {
            const noResults = document.createElement('div');
            noResults.className = 'no-results';
            noResults.innerHTML = `Nenhum resultado para "<strong>${escapeHtml(query)}</strong>"`;
            resultsContainer.appendChild(noResults);
        } else {
            const limit = showAll ? results.length : 10;
            const displayResults = results.slice(0, limit);

            displayResults.forEach(item => {
                const el = document.createElement('a');
                el.href = item.url;
                el.className = 'search-result-item';
                el.setAttribute('role', 'option');
                
                // Container para o cabeçalho (Tipo + Contexto)
                const headerDiv = document.createElement('div');
                headerDiv.style.display = 'flex';
                headerDiv.style.justifyContent = 'space-between';
                headerDiv.style.alignItems = 'center';
                headerDiv.style.marginBottom = '0.25rem';

                const type = document.createElement('span');
                type.className = 'search-result-type';
                type.textContent = item.type;
                type.style.marginBottom = '0'; // Resetar margem para alinhar

                // Novo elemento de contexto
                if (item.context) {
                    const context = document.createElement('span');
                    context.className = 'search-result-context';
                    context.textContent = item.context;
                    headerDiv.appendChild(type);
                    headerDiv.appendChild(context);
                } else {
                    headerDiv.appendChild(type);
                }
                
                const title = document.createElement('span');
                title.className = 'search-result-title';
                title.innerHTML = highlightMatch(item.title, query);
                
                el.appendChild(headerDiv); // Adiciona o cabeçalho organizado
                el.appendChild(title);
                resultsContainer.appendChild(el);
            });

            // Botão "Ver mais" se houver muitos resultados
            if (results.length > 10 && !showAll) {
                const viewMore = document.createElement('button');
                viewMore.className = 'search-result-item search-view-more';
                viewMore.textContent = `Ver mais ${results.length - 10} resultados...`;
                viewMore.onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    renderResults(results, query, true);
                    // Focar no primeiro item novo seria ideal aqui
                };
                resultsContainer.appendChild(viewMore);
            }
        }
        resultsContainer.style.display = 'block';
    }

    function highlightMatch(text, query) {
        // Escapar caracteres especiais regex para evitar erros
        const safeQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        
        // Normalizar texto e query para encontrar matches ignorando acentos
        const normalizedText = normalizeString(text);
        const normalizedQuery = normalizeString(safeQuery);
        
        // Encontrar todas as ocorrências
        let result = '';
        let lastIndex = 0;
        let matchIndex = normalizedText.indexOf(normalizedQuery);
        
        while (matchIndex !== -1) {
            // Adicionar texto antes do match
            result += text.substring(lastIndex, matchIndex); // O índice na string original pode diferir ligeiramente se houver caracteres combinados, mas para fins simples geralmente funciona ou precisaria de mapeamento complexo. 
            // Para simplificar e garantir que o texto original seja preservado (com maiúsculas/minúsculas originais):
            
            // NOTA: highlight exato com 'normalize' é complexo pois os índices mudam. 
            // Vamos usar uma abordagem regex simples 'accent-insensitive' se possível ou manter a busca simples visual
            // Dado a complexidade de highlight com normalização NFD, vamos voltar ao highlight simples case-insensitive para exibição visual, 
            // mas a BUSCA (filtragem) já está robusta.
            
            // Fallback para highlight simples visual que funciona na maioria dos casos de digitação direta
            // Se o usuário digitou sem acento e o texto tem acento, o highlight pode falhar visualmente, mas o item aparece.
            // Melhor manter o highlight simples por enquanto para não quebrar o texto.
            break; 
        }
        
        // Usando RegExp simples para highlight visual quando possível (match exato de caracteres)
        try {
             const regex = new RegExp(`(${safeQuery})`, 'gi');
             return text.replace(regex, '<span class="highlight">$1</span>');
        } catch (e) {
            return text;
        }
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Debounce utilitário para performance
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            const context = this;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    }

    // Inicializar
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSearch);
    } else {
        initSearch();
    }
})();

# BACKLOG.md

# Concurso AI Platform

## Backlog de Desenvolvimento

Este documento registra o trabalho pendente, planejado e futuro da plataforma.

---

## Rodadas Concluídas

### Rodada 1 — Estabilização e Correções Críticas ✅
- [x] Corrigir 18 erros de lint concentrados em PWA
- [x] Corrigir 14 testes falhando em PWA (pwa-service, update-prompt, offline-indicator)
- [x] Migrar `.eslintignore` obsoleto para `eslint.config.js`
- [x] Criar `BACKLOG.md`
- [x] Atualizar `CHANGELOG.md`

### Rodada 2 — Conteúdo Piloto e Finalização do Renderizador ✅
- [x] Criar conteúdo piloto para 11 disciplinas (1 capítulo introdutório cada)
- [x] Expandir Língua Portuguesa para 4 capítulos reais
- [x] Criar roadmaps para 11 disciplinas (`00-roadmap.md`)
- [x] Implementar plugin `content-server` no Vite (serve `content/` em dev, copia para `dist/` no build)
- [x] Definir fallback informativo definitivo para Mermaid em v1.0

### Rodada 3 — Questões Comentadas, Flashcards e Simulados ✅
- [x] Criar 2 questões comentadas + 2 questões para resolver em 6 capítulos
- [x] Criar 1 simulado piloto de 20 questões misturando disciplinas
- [x] Criar flashcards para capítulos de Português e Matemática Financeira

### Rodada 4 — PWA Completo e Páginas Complementares ✅
- [x] Gerar ícones PWA (192x192, 512x512, maskable)
- [x] Ajustar manifest para DATAPREV
- [x] Finalizar indicadores offline e update
- [x] Melhorar Empty States das páginas placeholder
- [x] Integrar fila de revisões na página de Revisões

### Rodada 5 — Polimento e Release Candidate 1.0 ✅
- [x] Auditoria completa de estados (Loading/Empty/Error/Success) — 8 páginas cobertas
- [x] Remover código morto, console.log, TODO — 0 TODOs/FIXMEs no código
- [x] Validar responsividade (Desktop/Tablet/Mobile) — todas as páginas com breakpoints
- [x] Validar acessibilidade (teclado, ARIA, contraste) — sem `alt=""` vazio, botões com type, ícones com aria-hidden
- [x] Executar build com sucesso — 48 assets precached
- [x] Executar lint — 0 erros, 0 warnings
- [x] Executar testes — 230/230 passando
- [x] Atualizar documentação final (BACKLOG, CHANGELOG)
- [x] Preparar para deploy no GitHub Pages

---

## Tarefas Futuras (Pós-MVP / v2.0+)

### Fase 3 — Conteúdo Completo
- [ ] Produzir apostilas para todas as disciplinas
- [ ] Banco de questões comentadas por capítulo
- [ ] Flashcards por tópico
- [ ] Resumos executivos
- [ ] Glossários completos
- [ ] Mapas mentais (Mermaid real)

### Fase 4 — Inteligência Adaptativa
- [ ] Planner adaptativo baseado em desempenho
- [ ] Knowledge Graph de dependências
- [ ] Análise de pontos fracos
- [ ] Sugestão automática de revisões
- [ ] Identificação de padrões de erro

### Fase 5 — NotebookLM Integrado
- [ ] Geração automática de coleções
- [ ] Roteiros de podcast
- [ ] Audio Overview otimizado
- [ ] Materiais de revisão em lote

### Fase 6 — Pós-Prova / Generalização
- [ ] Suporte a múltiplas bancas (CESGRANRIO, CEBRASPE, FCC, VUNESP)
- [ ] Múltiplos concursos
- [ ] Importação de editais
- [ ] Novos perfis de candidato
- [ ] Comparação entre bancas

---

## Débito Técnico Conhecido

| Item | Severidade | Descrição | Resolução Planejada |
|------|------------|-----------|---------------------|
| Mermaid | Média | Renderização real não implementada (fallback informativo) | v2.0+: implementar renderização Mermaid real |
| Conteúdo | Alta | Apenas 6 capítulos com questões/flashcards; demais disciplinas com placeholder | Fase 3: produção de conteúdo completo |
| Lighthouse | Média | Não executado em ambiente real (requer deploy) | Pós-deploy: rodar Lighthouse e otimizar |
| Offline | Média | Funcionamento offline não validado em produção | Pós-deploy: testar Service Worker em GitHub Pages |

---

## Notas

- Todas as decisões arquiteturais devem ser registradas em `docs/references/DECISIONS.md`
- O CHANGELOG.md é a fonte da verdade para histórico de alterações concluídas
- Este BACKLOG.md deve ser atualizado ao final de cada rodada
- Versão atual: **v1.19.0 — Release Candidate 1.0**

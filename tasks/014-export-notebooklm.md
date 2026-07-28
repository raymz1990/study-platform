# Task 014 — Exportação NotebookLM

**Fase:** 2 — MVP de Estudos | **Milestone:** 2 — MVP navegável
**Status:** Planejada | **Prioridade:** P1

---

## Objetivo

Implementar a exportação de conteúdo em Markdown otimizado para o Google NotebookLM, com metadados, hierarquia, glossário, referências e checklist, pronto para uso em Audio Overview e geração de podcasts.

## Contexto

Todo documento deve ser otimizado para NotebookLM (NOTEBOOKLM_GUIDE.md): título, objetivos, pré-requisitos, desenvolvimento, exemplos, pegadinhas FGV, questões comentadas, resumo executivo, glossário, referências + metadados (disciplina, capítulo, tópicos, nível, tempo, palavras-chave, data, versão) e 10 perguntas frequentes. O Markdown é a fonte única — a exportação nunca edita o original (fonte única da verdade, SYSTEM_ARCHITECTURE.md §4).

## Documentos Obrigatórios

- NOTEBOOKLM_GUIDE.md (estrutura obrigatória, metadados, checklist)
- CONTENT_STANDARDS.md (metadados, estrutura)
- SYSTEM_ARCHITECTURE.md (§14 — NotebookLM)
- DATA_MODEL.md (Conteúdo NotebookLM)
- COMPONENT_LIBRARY.md (Notebook Export, Download Panel)

## Arquivos Envolvidos

```
src/components/export/notebook-export.tsx
src/components/export/download-panel.tsx
src/services/notebook-export-service.ts    (montagem do documento otimizado)
src/types/export.ts
scripts/build-content.ts                    (geração em lote — TECH_STACK §35)
notebooklm/                                 (saída dos exports)
```

## Dependências

- Task 009 — Renderizador de Conteúdo (fonte e metadados).
- Bloqueia: nenhuma (integra-se à Fase 5 futura).

## Critérios de Aceite

- [ ] Exportação por capítulo em `.md` com todas as seções do NOTEBOOKLM_GUIDE.md.
- [ ] Metadados completos no cabeçalho do documento exportado.
- [ ] Glossário, referências e checklist incluídos automaticamente.
- [ ] Seção de 10 perguntas frequentes preservada.
- [ ] Download individual (capítulo) e em lote (disciplina) via script.
- [ ] Documento exportado válido para upload direto no NotebookLM.
- [ ] Conteúdo original em `content/` nunca modificado pela exportação.
- [ ] Compatibilidade com Audio Overview (frases curtas, sem listas excessivas — validação básica).

## Checklist de Testes

- [ ] Teste unitário do `notebook-export-service` (montagem das seções e metadados).
- [ ] Teste de integridade: export contém todas as seções obrigatórias (checklist do NOTEBOOKLM_GUIDE.md).
- [ ] Teste de não-mutabilidade do conteúdo original.
- [ ] Teste do script de exportação em lote.
- [ ] Validação manual: upload de um export real no NotebookLM (estrutura reconhecida).

## Entregáveis

1. Serviço de exportação NotebookLM.
2. Componentes de exportação e download na página de capítulo.
3. Script de exportação em lote.
4. Diretório `notebooklm/` com exports gerados.
5. Testes.

## Estimativa de Esforço

**8 horas** (serviço, componentes, script, validação, testes).

---

## Documentação

Ao concluir: atualizar CHANGELOG.md; critério prepara Fase 5 (NotebookLM).

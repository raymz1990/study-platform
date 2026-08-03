# Task 015 — Release Candidate (Polimento, Auditoria e Fechamento do MVP)

**Fase:** 2 — MVP de Estudos  
**Milestone:** 2 — MVP navegável  
**Status:** Planejada  
**Prioridade:** P1

---

# Objetivo

Realizar a auditoria completa da aplicação, corrigindo inconsistências visuais, problemas de usabilidade, acessibilidade, performance e qualidade de código, preparando o projeto para o primeiro Release Candidate (RC1).

Esta Task não adiciona novas funcionalidades.

Seu objetivo é consolidar tudo o que foi implementado nas Tasks 001–014 e validar que o MVP atende integralmente aos requisitos do projeto.

---

# Contexto

Ao iniciar esta Task todas as funcionalidades principais já deverão estar implementadas.

Esta fase corresponde ao fechamento técnico do Milestone 2.

Todo ajuste realizado deverá estar relacionado exclusivamente à qualidade da aplicação.

Qualquer nova funcionalidade deverá ser registrada para milestones futuros.

Esta Task deverá seguir:

- UI_UX_GUIDELINES.md
- DESIGN_SYSTEM.md
- TESTING.md
- DEPLOYMENT.md
- CODING_STANDARDS.md
- COMPONENT_LIBRARY.md

---

# Documentos Obrigatórios

- UI_UX_GUIDELINES.md
- DESIGN_SYSTEM.md
- TESTING.md
- DEPLOYMENT.md
- CODING_STANDARDS.md
- COMPONENT_LIBRARY.md
- CHANGELOG.md
- MILESTONES.md

---

# Arquivos Envolvidos

```
Toda a aplicação.

Principalmente:

src/components/foundation/
src/pages/
src/layouts/
src/hooks/
src/services/

docs/

CHANGELOG.md
MILESTONES.md
README.md
```

---

# Dependências

Obrigatórias

- Tasks 001–014 concluídas.

Libera

- Release RC1
- Deploy Produção
- Encerramento do Milestone 2

---

# Escopo

## P0

### 1. Auditoria Completa

Revisar toda a aplicação verificando:

- funcionalidades
- consistência visual
- estados
- acessibilidade
- responsividade
- performance
- qualidade de código

---

### 2. Estados da Interface

Todas as páginas deverão possuir:

- Loading
- Empty
- Error
- Success

Não poderá existir tela sem tratamento de estado.

---

### 3. Consistência Visual

Revisar:

- espaçamentos
- alinhamentos
- tipografia
- cores
- componentes
- ícones
- feedback visual

Todos os componentes deverão seguir o Design System.

---

### 4. Responsividade

Validar completamente:

- Desktop
- Tablet
- Mobile

A experiência Desktop continua sendo a prioridade do projeto.

---

### 5. Acessibilidade

Validar:

- navegação por teclado
- foco
- contraste
- landmarks
- ARIA
- leitores de tela

Todos os critérios mínimos WCAG AA deverão ser atendidos.

---

### 6. Performance

Validar:

- carregamento inicial
- troca de páginas
- busca
- renderização dos capítulos
- gráficos
- PWA

Eliminar gargalos simples identificados durante a auditoria.

---

### 7. Código

Remover:

- console.log
- TODO esquecidos
- código morto
- imports não utilizados
- warnings
- comentários temporários

Nenhum código de desenvolvimento deverá permanecer.

---

### 8. Cobertura de Testes

Executar toda a suíte.

Adicionar testes apenas quando identificadas lacunas relevantes.

---

## P1

### Lighthouse

Executar auditoria completa.

Avaliar:

- Performance
- Accessibility
- Best Practices
- SEO
- PWA

Registrar os resultados.

---

### Release Candidate

Preparar a aplicação para geração da Release RC1.

Revisar:

- versão
- changelog
- milestones
- documentação

---

# Critérios de Aceite

## Funcionalidades

- [ ] Todas as funcionalidades das Tasks 001–014 funcionando.
- [ ] Nenhuma regressão identificada.
- [ ] Todos os estados implementados.
- [ ] Feedback visual consistente.
- [ ] Nenhuma funcionalidade parcialmente implementada.

---

## Arquitetura

- [ ] Nenhuma duplicação significativa.
- [ ] Serviços centralizados.
- [ ] Componentes reutilizados.
- [ ] Nenhum acoplamento desnecessário.

---

## Interface

- [ ] Desktop.
- [ ] Tablet.
- [ ] Mobile.
- [ ] Dark Mode.
- [ ] Responsividade validada.
- [ ] Design System respeitado.

---

## Qualidade

- [ ] pnpm lint
- [ ] pnpm build
- [ ] TypeScript strict
- [ ] Nenhum any
- [ ] Nenhum warning
- [ ] Nenhum console.log
- [ ] Cobertura ≥90% módulos críticos
- [ ] Cobertura ≥80% demais módulos

---

## Performance

- [ ] First Load < 2 segundos.
- [ ] Busca <300 ms.
- [ ] Navegação instantânea.
- [ ] Lighthouse aprovado.

---

# Checklist de Testes

## Funcional

- [ ] Dashboard
- [ ] Planner
- [ ] Disciplinas
- [ ] Capítulos
- [ ] Markdown
- [ ] Busca
- [ ] Configurações
- [ ] PWA

---

## Interface

- [ ] Estados
- [ ] Desktop
- [ ] Tablet
- [ ] Mobile
- [ ] Dark Mode

---

## Performance

- [ ] Lighthouse
- [ ] Tempo de carregamento
- [ ] Tempo da busca

---

## Acessibilidade

- [ ] Teclado
- [ ] Screen Reader
- [ ] ARIA
- [ ] Contraste

---

## Produção

- [ ] Build Produção
- [ ] PWA
- [ ] GitHub Pages
- [ ] Cloudflare

---

## Regressão

- [ ] Toda a suíte permanece verde.

---

# Entregáveis

## Código

- Correções finais
- Refatorações pontuais
- Ajustes de interface

---

## Relatórios

- Lighthouse
- Cobertura de testes
- Auditoria de acessibilidade
- Auditoria de performance

---

## Documentação

- CHANGELOG atualizado
- README atualizado
- MILESTONES atualizado

---

# Fora do Escopo

Não implementar:

- novas funcionalidades;
- novos componentes;
- novos serviços;
- mudanças arquiteturais significativas;
- alterações no modelo de dados;
- integrações externas.

Todas essas atividades pertencem ao próximo milestone.

---

# Estimativa

**12 horas**

Incluindo:

- auditoria
- correções
- regressão
- Lighthouse
- documentação
- preparação da Release Candidate

---

# Critério para Fechamento do Milestone 2

O Milestone 2 será considerado concluído quando:

- todas as Tasks 001–014 estiverem aprovadas;
- não existirem defeitos críticos ou altos em aberto;
- todos os testes estiverem aprovados;
- `pnpm build` executar sem erros;
- `pnpm lint` executar sem erros;
- a cobertura mínima de testes for atendida;
- a aplicação estiver apta para publicação;
- o Gate Review final for aprovado.

---

# Documentação

Ao concluir:

- atualizar `CHANGELOG.md`;
- atualizar `MILESTONES.md`;
- atualizar `README.md`;
- registrar a versão Release Candidate (RC1);
- preparar a branch `release/mvp`;
- submeter ao Gate Review final do **Milestone 2**.
# DEFINITION_OF_DONE.md

> Versão: 1.0
> Status: Ativo
> Documento normativo

---

# 1. Objetivo

Definir os critérios obrigatórios para considerar uma Task concluída.

Nenhuma Task poderá ser marcada como "Concluída" sem atender integralmente este documento.

---

# 2. Escopo

Aplica-se a:

- Desenvolvimento
- Correções
- Refatorações
- Componentes
- Conteúdo técnico
- Documentação técnica

---

# 3. Critérios Gerais

Uma Task somente poderá ser concluída quando:

- Todo o escopo previsto foi implementado.
- Nenhum item obrigatório ficou pendente.
- Não existam erros conhecidos bloqueantes.
- O código esteja funcional.
- Todos os testes obrigatórios tenham sido executados.

---

# 4. Arquitetura

Deve respeitar obrigatoriamente:

- SYSTEM_ARCHITECTURE.md
- TECH_STACK.md
- AI_ENGINE.md
- CODING_STANDARDS.md
- TESTING.md

Nenhuma decisão arquitetural poderá ser alterada durante a execução da Task.

Caso seja necessária uma mudança arquitetural:

- interromper a implementação;
- registrar proposta;
- atualizar DECISIONS.md após aprovação.

---

# 5. Código

Todo código deverá:

- compilar sem erros;
- utilizar TypeScript estrito;
- não utilizar any;
- não possuir código morto;
- não possuir comentários desnecessários;
- seguir ESLint;
- seguir Prettier;
- seguir convenções do projeto.

---

# 6. Componentes

Todo componente deverá:

- possuir responsabilidade única;
- ser reutilizável;
- possuir tipagem completa;
- utilizar props tipadas;
- ser acessível (WCAG AA);
- funcionar em Dark Mode;
- ser responsivo.

---

# 7. Performance

A implementação deverá:

- evitar renderizações desnecessárias;
- evitar duplicação;
- evitar código complexo;
- utilizar lazy loading quando previsto;
- manter boa legibilidade.

---

# 8. Testes

Antes da conclusão deverão ser executados:

## Build

✓ Build sem erros.

## Lint

✓ ESLint sem erros.

## Formatação

✓ Prettier.

## Testes

✓ Todos os testes da Task.

## Cobertura

Módulos críticos:

- mínimo 90%

Demais módulos:

- mínimo 80%

---

# 9. Conteúdo

Quando aplicável:

- Markdown válido.
- Links funcionando.
- Estrutura conforme CONTENT_STRUCTURE.md.
- Conteúdo conforme CONTENT_STANDARDS.md.

---

# 10. Documentação

Quando necessário:

- CHANGELOG atualizado.
- DECISIONS atualizado (somente mudanças arquiteturais).
- Comentários relevantes adicionados.
- README atualizado se houver impacto.

---

# 11. Escopo

É proibido:

- implementar funcionalidades fora da Task;
- modificar Tasks futuras;
- alterar arquitetura;
- alterar roadmap;
- modificar documentação não relacionada.

---

# 12. Entregáveis

Toda Task deverá entregar:

- lista de arquivos criados;
- lista de arquivos alterados;
- resumo técnico;
- instruções para execução;
- limitações conhecidas;
- pendências.

---

# 13. Checklist Obrigatório

## Arquitetura

- [ ] Segue SYSTEM_ARCHITECTURE
- [ ] Segue TECH_STACK
- [ ] Segue CODING_STANDARDS

## Código

- [ ] Compila
- [ ] TypeScript sem erros
- [ ] ESLint OK
- [ ] Prettier OK

## Funcional

- [ ] Critérios de aceite atendidos
- [ ] Responsivo
- [ ] Dark Mode
- [ ] Acessível

## Testes

- [ ] Build
- [ ] Unitários
- [ ] Cobertura

## Documentação

- [ ] CHANGELOG
- [ ] DECISIONS (quando necessário)

---

# 14. Critérios de Rejeição

Uma Task deverá ser considerada NÃO CONCLUÍDA quando:

- existir erro de compilação;
- existir erro de lint;
- cobertura inferior ao mínimo;
- qualquer critério de aceite não for atendido;
- houver implementação fora do escopo;
- arquitetura tiver sido modificada sem aprovação.

---

# 15. Fluxo Oficial

Task

↓

Implementação

↓

Testes

↓

Checklist

↓

Documentação

↓

Revisão

↓

Concluída

# 16. Responsabilidade dos Agentes

## Kimi K3

Responsável por:

- arquitetura;
- planejamento;
- auditoria;
- revisão de milestones;
- criação de ADRs;
- backlog;
- análise do edital;
- estratégia pedagógica.

Não deve implementar código.

---

## Kimi 2.6

Responsável por:

- implementação;
- refatoração;
- correções;
- testes;
- documentação derivada;
- execução das Tasks.

Não deve alterar arquitetura ou implementar funcionalidades fora da Task atual.

Em caso de necessidade de alteração arquitetural, interromper a implementação e encaminhar a decisão para revisão pelo agente responsável pela arquitetura.

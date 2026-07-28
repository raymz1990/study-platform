# DECISIONS.md

# Concurso AI Platform
## Architecture & Project Decisions
Version: 1.0

---

# Objetivo

Registrar as decisões arquiteturais, pedagógicas e tecnológicas que orientam o desenvolvimento da plataforma.

Este documento responde à pergunta:

**"Por que esta decisão foi tomada?"**

Não registrar alterações de código (ver CHANGELOG.md).

Não registrar tarefas (ver PROJECT_ROADMAP.md).

Não registrar progresso (ver MILESTONES.md).

---

# Como Registrar

Cada decisão deverá possuir:

ID

Data

Status

Categoria

Contexto

Decisão

Consequências

Alternativas Avaliadas

Documentos Relacionados

---

# Status

Proposto

Aceito

Substituído

Obsoleto

---

# Categorias

Arquitetura

Tecnologia

Conteúdo

UX

Infraestrutura

Estudos

NotebookLM

Banca

Documentação

---

# Template

---

## ADR-XXX

Data

YYYY-MM-DD

Status

Aceito

Categoria

Arquitetura

---

### Contexto

Descrever o problema.

---

### Decisão

Descrever claramente a decisão tomada.

---

### Motivo

Explicar por que essa decisão foi escolhida.

---

### Consequências

Impactos positivos

Limitações

Riscos

---

### Alternativas Avaliadas

Alternativa A

Alternativa B

Alternativa C

---

### Documentos Relacionados

SYSTEM_ARCHITECTURE.md

TECH_STACK.md

PROJECT_ROADMAP.md

---

# Decisões Oficiais

---

## ADR-001

Data

2026-07-25

Status

Aceito

Categoria

Arquitetura

### Contexto

Era necessário definir uma arquitetura que pudesse evoluir para diferentes concursos sem exigir reestruturações profundas.

### Decisão

Separar a documentação em cinco domínios:

Architecture

Development

Content

UI

Roadmap

Complementados por uma pasta References para materiais externos ao projeto.

### Motivo

Melhor organização.

Baixo acoplamento.

Alta reutilização.

Escalabilidade.

### Consequências

Documentação modular.

Facilidade para manutenção.

Facilidade para utilização por agentes de IA.

### Alternativas Avaliadas

Documentação única.

Documentação por tecnologia.

Documentação distribuída na raiz.

### Documentos Relacionados

SYSTEM_ARCHITECTURE.md

README.md

---

## ADR-002

Data

2026-07-25

Status

Aceito

Categoria

Tecnologia

### Contexto

Era necessário escolher uma estratégia de hospedagem gratuita.

### Decisão

Utilizar GitHub Pages como plataforma oficial de publicação.

Quando houver necessidade de autenticação ou recursos incompatíveis com GitHub Pages, utilizar alternativas gratuitas compatíveis com a arquitetura do projeto.

### Motivo

Sem custo.

Integração com Git.

Facilidade de deploy.

Versionamento automático.

### Consequências

Hospedagem estática.

Necessidade de soluções compatíveis com sites estáticos para funcionalidades avançadas.

### Documentos Relacionados

DEPLOYMENT.md

TECH_STACK.md

---

## ADR-003

Data

2026-07-25

Status

Aceito

Categoria

Conteúdo

### Contexto

O projeto foi concebido para apoiar diferentes concursos públicos ao longo do tempo.

### Decisão

Toda a arquitetura de conteúdo deverá ser reutilizável.

A única parte específica será a estratégia da banca ativa.

### Motivo

Reutilização.

Escalabilidade.

Redução de retrabalho.

### Consequências

A plataforma poderá suportar novas bancas apenas adicionando novos documentos de estratégia.

### Documentos Relacionados

CONTENT_STANDARDS.md

FGV_STRATEGY.md

ROADMAP_DISCIPLINAS.md

---

## ADR-004

Data

2026-07-25

Status

Aceito

Categoria

Estudos

### Contexto

O candidato possui disponibilidade limitada para estudo diário.

### Decisão

Toda funcionalidade deverá priorizar produtividade e eficiência, considerando sessões curtas durante a semana e períodos mais longos aos finais de semana.

### Motivo

A plataforma deve refletir a realidade de uso prevista, favorecendo revisões, continuidade e acompanhamento do progresso.

### Consequências

Recursos de revisão, planejamento e acompanhamento terão prioridade sobre funcionalidades secundárias.

### Documentos Relacionados

PROJECT_ROADMAP.md

ROADMAP_DISCIPLINAS.md

---

## ADR-005

Data

2026-07-25

Status

Aceito

Categoria

Banca

### Contexto

Embora a plataforma tenha como objetivo suportar diferentes bancas no futuro, o concurso atual possui banca definida.

### Decisão

Durante a preparação para a DATAPREV, todo o conteúdo deverá ser produzido exclusivamente segundo o padrão da FGV.

Estratégias de outras bancas somente serão adicionadas quando houver um projeto específico para elas.

### Motivo

Evitar mistura de estilos de cobrança.

Maximizar aderência ao concurso atual.

### Consequências

Maior consistência do conteúdo.

Facilidade para reutilização futura.

### Documentos Relacionados

FGV_STRATEGY.md

FGV_EDITAL_ANALISE.md

CONTENT_STANDARDS.md

---

## ADR-006

Data

2026-07-28

Status

Aceito

Categoria

Documentação

### Contexto

Existiam duas cadeias de resolução de conflito divergentes: AI_ENGINE.md (hierarquia de 10 documentos) e CODING_STANDARDS.md (cadeia SYSTEM_ARCHITECTURE → TECH_STACK → DATA_MODEL → CODING_STANDARDS).

### Decisão

Adotar como oficial e única a hierarquia definida em AI_ENGINE.md. CODING_STANDARDS.md foi atualizado para referenciá-la.

### Motivo

Fonte única da verdade também para governança documental; a lista do AI_ENGINE é a mais completa e é referenciada pelo README.md.

### Consequências

Resolução de conflitos previsível. Qualquer novo documento normativo deve ser posicionado na hierarquia do AI_ENGINE.

### Alternativas Avaliadas

Manter duas cadeias por domínio; criar terceiro documento de governança.

### Documentos Relacionados

README.md

AI_ENGINE.md

CODING_STANDARDS.md

---

## ADR-007

Data

2026-07-28

Status

Aceito

Categoria

Arquitetura

### Contexto

DATA_MODEL.md e CONTENT_STRUCTURE.md definíam hierarquias de conteúdo divergentes: DATA_MODEL (Concurso → Perfil → Disciplina → Módulo → Capítulo → Tópico → Objeto de Estudo) vs. CONTENT_STRUCTURE (Concurso → Disciplina → Unidade → Capítulo → Tópico → Conceito).

### Decisão

Prevalece a hierarquia do DATA_MODEL.md. CONTENT_STRUCTURE.md foi reconciliado: "Unidade" foi descontinuada e substituída por "Módulo"; "Conceito", "Exemplo", "Questão" etc. passam a ser tipos de Objeto de Estudo. GLOSSARIO.md atualizado. Registrada a ressalva de que os "Módulos I e II" do edital (blocos de prova) não se confundem com a entidade Módulo do modelo.

### Motivo

DATA_MODEL.md é a fonte única da verdade para estruturas de dados e está acima na hierarquia de documentos.

### Consequências

Tipos TypeScript do MVP serão derivados de um único modelo. Migração terminológica simples (nenhum conteúdo produzido ainda).

### Alternativas Avaliadas

Manter "Unidade" como sinônimo; adotar a hierarquia do CONTENT_STRUCTURE.

### Documentos Relacionados

DATA_MODEL.md

CONTENT_STRUCTURE.md

GLOSSARIO.md

---

## ADR-008

Data

2026-07-28

Status

Aceito

Categoria

Estudos

### Contexto

A política oficial de revisão espaçada (24h → 7d → 30d → 60d → 90d) é inviável integralmente na janela de 76 dias até a prova de 11/10/2026.

### Decisão

Manter 24h/7d/30d/60d/90d como política oficial permanente da plataforma (SYSTEM_ARCHITECTURE.md e DATA_MODEL.md). Para janelas curtas, a adaptação oficial é: R4 (60d) funde-se com a revisão de reta final; R5 (90d) é substituída por simulado completo + revisão de erros, utilizando o tipo "livre" do modelo de Revisão. A adaptação está registrada em ROADMAP_DISCIPLINAS.md v2.0.

### Motivo

Preservar a arquitetura para concursos futuros (janelas longas) sem perder aplicabilidade no concurso atual.

### Consequências

O Planner deve implementar a política completa e a regra de adaptação para janelas curtas.

### Alternativas Avaliadas

Alterar a política oficial para a janela curta; abandonar 60d/90d permanentemente.

### Documentos Relacionados

SYSTEM_ARCHITECTURE.md

DATA_MODEL.md

ROADMAP_DISCIPLINAS.md

---

## ADR-009

Data

2026-07-28

Status

Aceito

Categoria

Infraestrutura

### Contexto

TECH_STACK.md (§20) definia apenas main + feature/bugfix/refactor, enquanto DEPLOYMENT.md definia main, develop, feature/*, bugfix/*, release/*, hotfix/*.

### Decisão

Unificar pelo modelo completo do DEPLOYMENT.md (Git Flow simplificado): main (produção), develop (integração), feature/*, bugfix/*, release/*, hotfix/*, refactor/* (integrada via develop). TECH_STACK.md atualizado.

### Motivo

O modelo completo já era exigido pelo pipeline de deploy e por CONTRIBUTING.md; o modelo reduzido não suportava o fluxo Development → Preview → Production.

### Consequências

Toda funcionalidade nasce em branch própria; main só recebe merges de release/hotfix.

### Alternativas Avaliadas

Trunk-based development; manter modelo reduzido.

### Documentos Relacionados

TECH_STACK.md

DEPLOYMENT.md

CONTRIBUTING.md

---

## ADR-010

Data

2026-07-28

Status

Aceito

Categoria

Tecnologia

### Contexto

A documentação continha referências obsoletas ou inconsistentes: CONTRIBUTING.md exigia leitura de CLAUDE.md (arquivo inexistente); LINKS_IMPORTANTES.md listava Next.js (tecnologia proibida por TECH_STACK.md); vários documentos citavam uma ferramenta específica de IA como mantenedora do projeto.

### Decisão

Substituir a referência a CLAUDE.md por AI_ENGINE.md; remover Next.js das listas de ferramentas; substituir menções a ferramenta específica de IA por "agentes de IA", tornando o projeto neutro quanto ao agente mantenedor.

### Motivo

Eliminar referências a artefatos inexistentes e a tecnologias proibidas; evitar acoplamento do projeto a um fornecedor de IA.

### Consequências

Documentação consistente com a stack oficial e portável entre agentes de IA.

### Alternativas Avaliadas

Criar um CLAUDE.md; manter menção à ferramenta original.

### Documentos Relacionados

CONTRIBUTING.md

LINKS_IMPORTANTES.md

TECH_STACK.md

CODING_STANDARDS.md

---

# Regras

Toda decisão relevante deverá ser registrada.

Nunca remover decisões antigas.

Quando uma decisão deixar de valer, alterar seu status para "Substituído" ou "Obsoleto".

Sempre registrar os documentos impactados.

---

# Objetivo Final

Manter um histórico claro das decisões estratégicas, arquiteturais e pedagógicas do projeto, garantindo consistência ao longo da evolução da plataforma e reduzindo retrabalho durante o desenvolvimento.
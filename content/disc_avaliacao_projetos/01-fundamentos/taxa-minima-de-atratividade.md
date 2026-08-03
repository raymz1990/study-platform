---
id: chap-tma
title: Taxa Mínima de Atratividade
discipline: Avaliações Econômicas de Projetos
chapter: Taxa Mínima de Atratividade
level: beginner
estimatedTime: 60
version: "1.0"
updatedAt: "2026-08-01"
author: "Concurso AI Platform"
keywords: [TMA, taxa mínima de atratividade, custo de capital, FGV]
---

# Taxa Mínima de Atratividade

## 1 Introdução

Avaliações Econômicas de Projetos é a disciplina que une Matemática Financeira e Administração Financeira em um único framework: **decidir se um projeto vale a pena**. A primeira peça desse quebra-cabeça é a Taxa Mínima de Atratividade (TMA) — o "hurdle rate" que separa projetos bons de projetos ruins.

**Tempo médio recomendado**: 60 minutos.

**Pré-requisitos**: Juros simples e compostos (Matemática Financeira). Capital de giro e custo de capital (Administração Financeira).

## 2 Objetivos

Ao final deste capítulo, você será capaz de:

- Definir TMA e sua relação com o custo de capital.
- Calcular o Custo Médio Ponderado de Capital (CMPC/WACC).
- Explicar por que a TMA é diferente para projetos de risco diferentes.
- Aplicar a TMA como critério de aceitação de projetos.

## 3 Conhecimentos Prévios

- Juros compostos e taxas de retorno.
- Estrutura de capital (dívida vs. equity).
- Conceito básico de risco e retorno.

## 4 Desenvolvimento

### 4.1 O que é a TMA?

A **Taxa Mínima de Atratividade (TMA)** é a **taxa de retorno mínima** que um projeto deve gerar para ser considerado economicamente viável. Se o projeto não retornar pelo menos a TMA, ele destrói valor.

A TMA reflete:
- O **custo de oportunidade** do capital (o que poderia ser ganho em alternativas equivalentes).
- O **risco do projeto** (projetos mais arriscados exigem TMA maior).
- A **estratégia** da empresa (projetos estratégicos podem ter TMA ajustada).

### 4.2 Custo Médio Ponderado de Capital (CMPC / WACC)

Para empresas, a TMA costuma ser derivada do CMPC:

$$CMPC = \frac{E}{V} \times r_e + \frac{D}{V} \times r_d \times (1 - T)$$

Onde:
- $E$ = valor de mercado do patrimônio líquido (equity)
- $D$ = valor de mercado da dívida
- $V = E + D$ = valor total da empresa
- $r_e$ = custo do capital próprio (CAPM)
- $r_d$ = custo da dívida
- $T$ = alíquota de imposto de renda

> [!attention]
> A dívida tem **efeito fiscal**: os juros são dedutíveis do IR, então o custo efetivo da dívida é $r_d \times (1 - T)$. O equity não tem esse benefício.

### 4.3 CAPM — Custo do Capital Próprio

O Capital Asset Pricing Model (CAPM) estima o custo do equity:

$$r_e = r_f + \beta \times (r_m - r_f)$$

Onde:
- $r_f$ = taxa livre de risco (ex: SELIC, T-Bonds)
- $\beta$ = sensibilidade do ativo ao mercado ($\beta > 1$ = mais volátil que o mercado)
- $r_m$ = retorno esperado do mercado
- $(r_m - r_f)$ = prêmio de risco de mercado

> [!trap]
> A FGV cobra CAPM em nível conceitual, não exige cálculo completo. Foque em entender o que cada variável representa e como alterações afetam $r_e$.

### 4.4 TMA Ajustada ao Risco

Projetos de risco diferente da média da empresa precisam de **TMA ajustada**:

| Situação | Ajuste na TMA |
|----------|---------------|
| Projeto com risco menor que o da empresa | TMA < CMPC |
| Projeto com risco igual ao da empresa | TMA = CMPC |
| Projeto com risco maior que o da empresa | TMA > CMPC |

> [!attention]
> Usar o CMPC como TMA para **todos** os projetos é um erro clássico. Projetos arriscados precisam de barreira mais alta; projetos seguros podem ser aprovados com TMA menor.

## 5 Exemplos

1. Uma empresa tem $E = 60$, $D = 40$, $r_e = 12\%$, $r_d = 8\%$, $T = 30\%$.
   $$CMPC = 0,60 \times 0,12 + 0,40 \times 0,08 \times 0,70 = 0,072 + 0,0224 = 9,44\%$$

2. Se o projeto for de **risco maior**, a TMA pode ser ajustada para 11% ou 12%.

3. Se o projeto for de **risco menor**, a TMA pode ser 8%.

## 6 Erros Frequentes

- Usar CMPC como TMA para todos os projetos, ignorando o risco específico.
- Esquecer o efeito fiscal da dívida no CMPC.
- Confundir TMA com taxa interna de retorno (TIR).
- Achar que TMA "fixa" é universal — ela varia com o risco e o mercado.

## 7 Como a FGV Cobra

A FGV cobra **interpretação de indicadores** e **conceitos** mais do que cálculos complexos:
- "Qual o efeito de aumentar a alavancagem no CMPC?"
- "Por que projetos arriscados devem ter TMA maior?"
- "Dado um cenário, calcule o CMPC e indique se o projeto é viável."

## 8 Questões Comentadas

*(Questões serão adicionadas na fase de produção de conteúdo.)*

## 9 Questões para Resolver

*(Serão disponibilizadas em breve.)*

## 10 Resumo Executivo

- **TMA** = taxa mínima de retorno para aceitar um projeto.
- **CMPC** = custo médio ponderado de capital (dívida + equity).
- **Dívida** tem benefício fiscal: $r_d \times (1 - T)$.
- **CAPM**: $r_e = r_f + \beta(r_m - r_f)$.
- **Projetos arriscados** → TMA maior; **projetos seguros** → TMA menor.

## 11 Mapa Mental

```mermaid
graph TD
  A[TMA] --> B[Definição]
  A --> C[CMPC]
  A --> D[CAPM]
  A --> E[Ajuste por Risco]
  B --> B1[Retorno Mínimo]
  C --> C1[E/V × re + D/V × rd × (1-T)]
  D --> D1[rf + β × (rm - rf)]
  E --> E1[Risco Alto → TMA ↑]
  E --> E2[Risco Baixo → TMA ↓]
```

## 12 Flashcards

*(Flashcards serão adicionados na fase de produção de conteúdo.)*

## 13 Checklist

- [ ] Sei definir TMA e sua importância na avaliação de projetos.
- [ ] Sei calcular o CMPC/WACC.
- [ ] Sei explicar o CAPM e o que cada variável representa.
- [ ] Sei ajustar a TMA conforme o risco do projeto.
- [ ] Sei interpretar questões conceituais da FGV sobre TMA e CMPC.

## 14 Glossário

- **TMA**: Taxa Mínima de Atratividade (Hurdle Rate).
- **CMPC/WACC**: Custo Médio Ponderado de Capital.
- **CAPM**: Capital Asset Pricing Model.
- **Beta (β)**: medida de volatilidade de um ativo em relação ao mercado.
- **Alavancagem**: uso de dívida para financiar ativos.

## 15 Referências

- Damodaran, Aswath. *Avaliação de Empresas*. 2ª ed. São Paulo: Pearson, 2007.
- Ross, Stephen A. et al. *Princípios de Administração Financeira*. 12ª ed. São Paulo: Atlas, 2015.

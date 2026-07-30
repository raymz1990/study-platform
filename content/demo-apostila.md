---
id: demo_apostila_001
title: Demonstração do Markdown Viewer
discipline: Matemática Financeira
chapter: Juros Compostos
level: intermediate
estimatedTime: 45
version: "1.0"
updatedAt: "2026-07-28"
author: "Concurso AI Platform"
keywords: [juros, matemática financeira, FGV]
---

# Matemática Financeira — Juros Compostos

## Introdução

O regime de juros compostos é fundamental para provas da FGV. Neste capítulo, você aprenderá a calcular montantes, taxas equivalentes e aplicar fórmulas em situações práticas.

> [!ATTENTION]
> A FGV cobra juros compostos com **frequência maior** que outras bancas. Domine as taxas equivalentes!

## Objetivos

Ao final deste estudo, você será capaz de:

- Calcular montante em juros compostos
- Converter taxas equivalentes
- Resolver questões de desconto composto
- Identificar pegadinhas da banca

## Fórmula Principal

A fórmula do montante em juros compostos é:

```
M = C × (1 + i)^n
```

Onde:

- **M** = Montante
- **C** = Capital
- **i** = Taxa de juros
- **n** = Prazo

## Exemplo Prático

Uma aplicação de R$ 10.000,00 a 2% ao mês, por 3 meses:

```
M = 10.000 × (1,02)^3
M = 10.000 × 1,061208
M = 10.612,08
```

> [!TRAP]
> A FGV adora confundir taxas **nominais** com taxas **efetivas**. Sempre converta a taxa para o período da capitalização!

## Tabela Comparativa

| Regime | Fórmula | Uso |
|--------|---------|-----|
| Juros Simples | J = C × i × n | Curto prazo |
| Juros Compostos | M = C × (1+i)^n | Longo prazo |
| Desconto Simples | D = N × i × n | Títulos |
| Desconto Composto | D = N × [1 - (1+i)^-n] | Títulos |

## Como a FGV Cobra

A banca FGV costuma apresentar questões com:

1. Taxas nominais misturadas com efetivas
2. Prazos em dias, meses e anos no mesmo enunciado
3. Valores próximos nas alternativas (exigindo cálculo completo)

> [!MEMORIZATION]
> Taxa nominal = taxa que **não** incorpora capitalização. Taxa efetiva = taxa que **já** incorpora.

## Questão Comentada

**Enunciado:** Um capital de R$ 5.000,00 é aplicado a juros compostos de 1% ao mês. Qual o montante após 2 meses?

```typescript
const capital = 5000;
const taxa = 0.01;
const prazo = 2;
const montante = capital * Math.pow(1 + taxa, prazo);
console.log(montante); // 5.100,50
```

## Resumo Executivo

- Juros compostos: capitalização sobre capitalização
- Fórmula: `M = C × (1 + i)^n`
- Atenção às taxas equivalentes
- A FGV exige precisão nos cálculos

> [!IMPORTANT]
> Revise as questões erradas do seu caderno antes de avançar para o próximo capítulo.

## Glossário

- **Capitalização:** processo de incorporação de juros ao principal
- **Taxa equivalente:** taxas que produzem o mesmo montante em prazos diferentes
- **Montante:** valor acumulado ao final da aplicação

## Referências

- LEI Nº 4.595/1964 — Estatuto do Banco Central
- Matemática Financeira — Assaf Neto
- Provas FGV — 2019-2025

---

*Documento gerado pela Concurso AI Platform. Última atualização: 2026-07-28.*

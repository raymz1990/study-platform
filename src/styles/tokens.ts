/**
 * Tokens visuais oficiais da Concurso AI Platform.
 *
 * Estes tokens são a fonte única da verdade para todas as decisões visuais.
 * Nunca aplicar valores arbitrários diretamente nos componentes.
 *
 * Filosofia:
 * - Cores representam ESTADO, nunca decoração (UI_UX_GUIDELINES.md).
 * - Verde = concluído | Azul = em andamento | Amarelo = atenção | Vermelho = urgente.
 * - Paleta reduzida para baixa carga cognitiva em sessões longas de estudo.
 */

// ---------------------------------------------------------------------------
// Cores semânticas de estado de estudo
// ---------------------------------------------------------------------------

export const STUDY_STATE_COLORS = {
  /** Tópico/capítulo completamente estudado e revisado. */
  completed: '#16a34a', // green-600

  /** Tópico em progresso — estudado parcialmente. */
  inProgress: '#2563eb', // blue-600

  /** Revisão pendente ou atenção necessária. */
  attention: '#ca8a04', // yellow-600

  /** Revisão urgente — item vencido no spaced repetition. */
  urgent: '#dc2626', // red-600

  /** Item ainda não iniciado. */
  notStarted: '#6b7280', // gray-500
} as const

export type StudyStateColor = keyof typeof STUDY_STATE_COLORS

// ---------------------------------------------------------------------------
// Paleta de cores primária (slate-based, neutra e profissional)
// ---------------------------------------------------------------------------

export const COLORS = {
  primary: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
    950: '#020617',
  },
  accent: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
    950: '#172554',
  },
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
    950: '#052e16',
  },
  warning: {
    50: '#fefce8',
    100: '#fef9c3',
    200: '#fef08a',
    300: '#fde047',
    400: '#facc15',
    500: '#eab308',
    600: '#ca8a04',
    700: '#a16207',
    800: '#854d0e',
    900: '#713f12',
    950: '#422006',
  },
  danger: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
    950: '#450a0a',
  },
  info: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
    950: '#082f49',
  },
} as const

// ---------------------------------------------------------------------------
// Tipografia
// ---------------------------------------------------------------------------

export const TYPOGRAPHY = {
  /** Fonte sans-serif para todo o texto da interface. */
  sans: "'Inter', ui-sans-serif, system-ui, sans-serif",

  /** Fonte monoespaçada para código, fórmulas e dados tabulares. */
  mono: "'JetBrains Mono', ui-monospace, monospace",

  sizes: {
    xs: '0.75rem', // 12px
    sm: '0.875rem', // 14px
    base: '1rem', // 16px
    lg: '1.125rem', // 18px
    xl: '1.25rem', // 20px
    '2xl': '1.5rem', // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
  },

  weights: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },

  lineHeights: {
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },
} as const

// ---------------------------------------------------------------------------
// Espaçamento — escala de 4px base (0.25rem)
// ---------------------------------------------------------------------------

export const SPACING = {
  0: '0px',
  px: '1px',
  0.5: '0.125rem', // 2px
  1: '0.25rem', // 4px
  1.5: '0.375rem', // 6px
  2: '0.5rem', // 8px
  2.5: '0.625rem', // 10px
  3: '0.75rem', // 12px
  3.5: '0.875rem', // 14px
  4: '1rem', // 16px
  5: '1.25rem', // 20px
  6: '1.5rem', // 24px
  7: '1.75rem', // 28px
  8: '2rem', // 32px
  9: '2.25rem', // 36px
  10: '2.5rem', // 40px
  11: '2.75rem', // 44px
  12: '3rem', // 48px
  14: '3.5rem', // 56px
  16: '4rem', // 64px
  20: '5rem', // 80px
  24: '6rem', // 96px
} as const

// ---------------------------------------------------------------------------
// Bordas e Raios
// ---------------------------------------------------------------------------

export const BORDER_RADIUS = {
  none: '0px',
  sm: '0.125rem', // 2px
  DEFAULT: '0.375rem', // 6px
  md: '0.5rem', // 8px
  lg: '0.625rem', // 10px
  xl: '0.75rem', // 12px
  '2xl': '1rem', // 16px
  full: '9999px',
} as const

// ---------------------------------------------------------------------------
// Sombras — discretas, apenas para profundidade/foco
// ---------------------------------------------------------------------------

export const SHADOWS = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  focus: '0 0 0 2px rgb(37 99 235 / 0.4)',
} as const

// ---------------------------------------------------------------------------
// Transições
// ---------------------------------------------------------------------------

export const TRANSITIONS = {
  fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
  DEFAULT: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
  slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
} as const

// ---------------------------------------------------------------------------
// Z-Index scale
// ---------------------------------------------------------------------------

export const Z_INDEX = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
} as const

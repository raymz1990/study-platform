/**
 * Utilitários de data — Concurso AI Platform.
 *
 * Centraliza toda manipulação de datas para evitar inconsistências
 * de timezone, duplicação de código e bugs de fuso horário.
 *
 * Regra: nenhum outro arquivo deve usar toISOString(), getDay(), etc.
 * diretamente. Sempre usar estas funções.
 */

const MS_PER_DAY = 1000 * 60 * 60 * 24

export const WEEKDAY_LABELS = [
  'Domingo',
  'Segunda',
  'Terça',
  'Quarta',
  'Quinta',
  'Sexta',
  'Sábado',
] as const

export const WEEKDAY_KEYS = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
] as const

export type WeekdayKey = typeof WEEKDAY_KEYS[number]

/**
 * Converte um Date para string ISO (YYYY-MM-DD) usando
 * componentes locais — evita bugs de fuso horário.
 */
export function toISODate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Adiciona dias a uma data.
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

/**
 * Diferença em dias entre duas datas ISO (a → b).
 * Positivo = b é depois de a.
 */
export function diffDays(a: string, b: string): number {
  const d1 = new Date(a + 'T00:00:00')
  const d2 = new Date(b + 'T00:00:00')
  return Math.floor((d2.getTime() - d1.getTime()) / MS_PER_DAY)
}

/**
 * Label do dia da semana em português.
 */
export function weekdayLabel(date: Date): string {
  return WEEKDAY_LABELS[date.getDay()] ?? 'Desconhecido'
}

/**
 * Chave do template semanal para uma data.
 */
export function weekdayKey(date: Date): WeekdayKey | undefined {
  return WEEKDAY_KEYS[date.getDay()]
}

/**
 * Cria um Date a partir de uma string ISO, meia-noite local.
 */
export function fromISODate(dateStr: string): Date {
  return new Date(dateStr + 'T00:00:00')
}

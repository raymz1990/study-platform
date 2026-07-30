/**
 * slugify — Geração normalizada de IDs tipo GitHub.
 *
 * Centraliza toda a geração de slugs do projeto para garantir
 * consistência entre parser (TOC) e DOM (headings).
 *
 * Regras:
 * - Remove acentos (NFD + strip diacríticos)
 * - Converte para minúsculas
 * - Remove caracteres não alfanuméricos (exceto espaços e hífens)
 * - Colapsa espaços em hífens
 */

export function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
}

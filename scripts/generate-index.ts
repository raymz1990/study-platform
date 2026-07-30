/**
 * generate-index.ts — Script de build time para gerar o índice de busca.
 *
 * Executado durante o build do Vite (ou manualmente via `pnpm tsx scripts/generate-index.ts`).
 * Gera `public/search-index.json` a partir do `content/index.json`.
 *
 * Uso:
 *   pnpm tsx scripts/generate-index.ts
 */

import { writeFileSync, mkdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { buildSearchIndex } from '../src/services/search-index-builder'

const OUTPUT_DIR = resolve(process.cwd(), 'public')
const OUTPUT_FILE = resolve(OUTPUT_DIR, 'search-index.json')

function main(): void {
  console.log('🔍 Gerando índice de busca...')

  const index = buildSearchIndex()

  mkdirSync(OUTPUT_DIR, { recursive: true })
  writeFileSync(OUTPUT_FILE, JSON.stringify(index, null, 2), 'utf-8')

  console.log(`✅ Índice gerado com ${index.length} entradas em:`)
  console.log(`   ${OUTPUT_FILE}`)
}

main()

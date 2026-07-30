/**
 * Declarações de módulo para imports JSON.
 *
 * O Vite suporta importação de JSON nativamente.
 * Este arquivo garante compatibilidade com TypeScript strict.
 */

declare module '*.json' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const value: any
  export default value
}

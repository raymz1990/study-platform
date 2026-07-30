import examConfig from '../../../config/exam.json'

/**
 * Footer — rodapé da aplicação.
 *
 * Informações concisas: concurso, perfil, banca.
 * Dados consumidos de config/exam.json para reusabilidade entre concursos.
 */
export function Footer(): React.ReactElement {
  const { institution, profile, board, examDate } = examConfig

  return (
    <footer className="bg-background text-muted-foreground border-t px-4 py-3 text-center text-xs">
      {institution} — {profile} — {board} — Prova: {examDate}
    </footer>
  )
}

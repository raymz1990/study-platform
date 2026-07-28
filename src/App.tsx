import { BookOpen, GraduationCap, Moon, Sun } from 'lucide-react'
import { useState, useEffect } from 'react'

function App(): React.ReactElement {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDark])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-background p-6 text-foreground transition-colors">
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-3">
          <GraduationCap className="h-10 w-10 text-primary" />
          <BookOpen className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Concurso AI Platform
        </h1>
        <p className="max-w-md text-center text-muted-foreground">
          Plataforma inteligente para preparação em concursos públicos.
        </p>
      </div>

      <button
        type="button"
        onClick={() => setIsDark((prev) => !prev)}
        className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-card-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        aria-label={isDark ? 'Ativar modo claro' : 'Ativar modo escuro'}
      >
        {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        {isDark ? 'Modo claro' : 'Modo escuro'}
      </button>

      <footer className="mt-8 text-xs text-muted-foreground">
        DATAPREV — Perfil 10 — Gestão Econômico-Financeira — FGV
      </footer>
    </div>
  )
}

export default App

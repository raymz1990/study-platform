import { SettingsForm } from '@/components/settings/settings-form'

export function ConfiguracoesPage(): React.ReactElement {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Configurações</h1>
        <p className="text-sm text-muted-foreground">
          Personalize sua experiência de estudo.
        </p>
      </div>

      <SettingsForm />
    </div>
  )
}

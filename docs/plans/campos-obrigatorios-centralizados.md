# Plano: Campos Obrigatórios Centralizados nos Formulários

**Prioridade:** Próxima semana
**Estimativa:** 1 sessão de trabalho
**Branch sugerida:** `feature/centralized-required-fields`

---

## Problema

Os 18 formulários do CMS cada um define seu próprio Zod schema inline e adiciona asteriscos (`*`) manualmente nos labels. Isso cria dois problemas:

1. Para mudar um campo de obrigatório → opcional (ou vice-versa), é preciso editar **dois lugares**: o schema Zod e o label JSX.
2. Não há um ponto central de referência — é difícil saber quais campos são obrigatórios sem abrir cada arquivo.

## Solução

Usar o próprio **Zod schema como fonte da verdade**. Criar um utilitário que inspeciona o schema e deriva automaticamente se um campo precisa de asterisco no label.

**Resultado para o dev:** editar `.optional()` ou `.min(1, ...)` no schema já muda o asterisco no UI. Sem arquivos extras para sincronizar.

---

## Checklist de Implementação

### Fase 1 — Infraestrutura (criar novos arquivos)

- [ ] Criar `src/lib/schemaUtils.ts` (utilitário de inspeção de schema)
- [ ] Criar `src/lib/formSchemas.ts` (registro central de schemas)
- [ ] Adicionar `RequiredFieldsProvider` e `RequiredFormLabel` em `src/components/ui/form.tsx`

### Fase 2 — Preparar os formulários (adicionar `export` aos schemas)

Adicionar `export` antes de `const` em cada schema:

- [ ] `AgentForm.tsx` → `export const agentSchema`
- [ ] `BannerForm.tsx` → `export const bannerSchema`
- [ ] `CoachForm.tsx` → `export const coachSchema`
- [ ] `CollectionForm.tsx` → `export const collectionSchema`
- [ ] `CompetitionForm.tsx` → `export const competitionSchema`
- [ ] `EventForm.tsx` → `export const eventSchema`
- [ ] `GameForm.tsx` → `export const gameSchema`
- [ ] `LiveForm.tsx` → `export const liveSchema`
- [ ] `NewsForm.tsx` → `export const newsSchema`
- [ ] `PageForm.tsx` → `export const pageFormSchema`
- [ ] `PlayerForm.tsx` → `export const playerSchema`
- [ ] `RefereeForm.tsx` → `export const refereeSchema`
- [ ] `SeasonForm.tsx` → `export const seasonSchema`
- [ ] `ShelfForm.tsx` → `export const shelfSchema`
- [ ] `StadiumForm.tsx` → `export const stadiumSchema`
- [ ] `TeamForm.tsx` → `export const teamSchema`
- [ ] `VideoForm.tsx` → `export const videoSchema`

### Fase 3 — Atualizar cada formulário (padrão de 4 passos)

Para cada formulário abaixo, aplicar o padrão descrito na seção "Padrão de Atualização":

- [ ] `PlayerForm.tsx` (mais simples, usar como referência)
- [ ] `CoachForm.tsx`
- [ ] `RefereeForm.tsx`
- [ ] `StadiumForm.tsx`
- [ ] `EventForm.tsx`
- [ ] `BannerForm.tsx`
- [ ] `SeasonForm.tsx`
- [ ] `GameForm.tsx`
- [ ] `PageForm.tsx`
- [ ] `NewsForm.tsx`
- [ ] `VideoForm.tsx`
- [ ] `LiveForm.tsx`
- [ ] `TeamForm.tsx`
- [ ] `CompetitionForm.tsx`
- [ ] `ShelfForm.tsx`
- [ ] `CollectionForm.tsx`
- [ ] `AgentForm.tsx` ⚠️ (apenas exportar schema — ver exceção abaixo)
- [ ] `CampaignForm.tsx` ⚠️ (pular — ver exceção abaixo)

### Fase 4 — Verificação

- [ ] `npm run build` sem erros TypeScript
- [ ] Abrir um formulário e confirmar asteriscos nos campos obrigatórios
- [ ] Mudar um campo de `.min(1, "...")` para `.optional()` e confirmar que o asterisco desaparece
- [ ] Submeter formulário incompleto e confirmar que a validação continua funcionando

---

## Código dos Novos Arquivos

### `src/lib/schemaUtils.ts`

```typescript
import { ZodObject, ZodOptional, ZodNullable, ZodUnion, ZodBoolean, ZodTypeAny } from "zod"

function isFieldOptional(field: ZodTypeAny): boolean {
  // Booleans sempre têm valor (true/false) — nunca precisam de asterisco
  if (field instanceof ZodBoolean) return true
  if (field instanceof ZodOptional) return true
  if (field instanceof ZodNullable) return isFieldOptional((field as any).unwrap())
  if (field instanceof ZodUnion) {
    const opts = (field as any)._zod?.def?.options ?? (field as any).options ?? []
    return (opts as ZodTypeAny[]).some(isFieldOptional)
  }
  if (typeof (field as any).isOptional === "function") return (field as any).isOptional()
  return false
}

export function getRequiredFields(schema: ZodObject<any>): Record<string, boolean> {
  const result: Record<string, boolean> = {}
  for (const [key, field] of Object.entries(schema.shape as Record<string, ZodTypeAny>)) {
    result[key] = !isFieldOptional(field)
  }
  return result
}
```

### `src/lib/formSchemas.ts`

```typescript
import { agentSchema } from "@/components/forms/AgentForm"
import { bannerSchema } from "@/components/forms/BannerForm"
import { coachSchema } from "@/components/forms/CoachForm"
import { collectionSchema } from "@/components/forms/CollectionForm"
import { competitionSchema } from "@/components/forms/CompetitionForm"
import { eventSchema } from "@/components/forms/EventForm"
import { gameSchema } from "@/components/forms/GameForm"
import { liveSchema } from "@/components/forms/LiveForm"
import { newsSchema } from "@/components/forms/NewsForm"
import { pageFormSchema } from "@/components/forms/PageForm"
import { playerSchema } from "@/components/forms/PlayerForm"
import { refereeSchema } from "@/components/forms/RefereeForm"
import { seasonSchema } from "@/components/forms/SeasonForm"
import { shelfSchema } from "@/components/forms/ShelfForm"
import { stadiumSchema } from "@/components/forms/StadiumForm"
import { teamSchema } from "@/components/forms/TeamForm"
import { videoSchema } from "@/components/forms/VideoForm"
// CampaignForm não usa Zod — omitido intencionalmente

export const formSchemas = {
  agent: agentSchema,
  banner: bannerSchema,
  coach: coachSchema,
  collection: collectionSchema,
  competition: competitionSchema,
  event: eventSchema,
  game: gameSchema,
  live: liveSchema,
  news: newsSchema,
  page: pageFormSchema,
  player: playerSchema,
  referee: refereeSchema,
  season: seasonSchema,
  shelf: shelfSchema,
  stadium: stadiumSchema,
  team: teamSchema,
  video: videoSchema,
}

export type FormName = keyof typeof formSchemas
```

### Adição em `src/components/ui/form.tsx`

Adicionar ao final do arquivo (após os exports existentes):

```tsx
import React from "react"

// Context para injetar o mapa de campos obrigatórios na árvore do form
const RequiredFieldsContext = React.createContext<Record<string, boolean>>({})

export function RequiredFieldsProvider({
  requiredFields,
  children,
}: {
  requiredFields: Record<string, boolean>
  children: React.ReactNode
}) {
  return (
    <RequiredFieldsContext.Provider value={requiredFields}>
      {children}
    </RequiredFieldsContext.Provider>
  )
}

/**
 * Substituto de <FormLabel> que adiciona " *" automaticamente
 * quando o campo é obrigatório segundo o schema Zod.
 *
 * Antes: <FormLabel>Nome *</FormLabel>
 * Depois: <RequiredFormLabel>Nome</RequiredFormLabel>
 */
export const RequiredFormLabel = React.forwardRef<
  React.ElementRef<typeof FormLabel>,
  React.ComponentPropsWithoutRef<typeof FormLabel>
>(({ children, ...props }, ref) => {
  const { name } = React.useContext(FormFieldContext)
  const requiredFields = React.useContext(RequiredFieldsContext)
  const isRequired = requiredFields[name] ?? false

  return (
    <FormLabel ref={ref} {...props}>
      {children}
      {isRequired && (
        <span className="ml-0.5 text-destructive" aria-hidden="true">
          *
        </span>
      )}
    </FormLabel>
  )
})
RequiredFormLabel.displayName = "RequiredFormLabel"
```

---

## Padrão de Atualização de Formulário (4 passos)

Usar `PlayerForm.tsx` como template e repetir para todos os outros.

### Passo 1 — Exportar o schema
```typescript
// Antes:
const playerSchema = z.object({ ... })

// Depois:
export const playerSchema = z.object({ ... })
```

### Passo 2 — Adicionar imports
```typescript
import { getRequiredFields } from "@/lib/schemaUtils"
import { RequiredFieldsProvider, RequiredFormLabel } from "@/components/ui/form"
```

### Passo 3 — Derivar campos obrigatórios no componente
```typescript
export function PlayerForm({ initialData, isEdit = false, onClose }: PlayerFormProps) {
  const requiredFields = getRequiredFields(playerSchema)  // ← adicionar esta linha
  // ... resto do código inalterado
```

### Passo 4 — Envolver Form + trocar labels
```tsx
// Antes:
<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    ...
    <FormLabel>Nome *</FormLabel>
    <FormLabel>Posição</FormLabel>
    <FormLabel>Nacionalidade *</FormLabel>

// Depois:
<RequiredFieldsProvider requiredFields={requiredFields}>
  <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)}>
      ...
      <RequiredFormLabel>Nome</RequiredFormLabel>
      <RequiredFormLabel>Posição</RequiredFormLabel>
      <RequiredFormLabel>Nacionalidade</RequiredFormLabel>
  </Form>
</RequiredFieldsProvider>
```

> Remover o ` *` do texto dos labels — o componente adiciona automaticamente.

---

## Exceções

| Formulário | Motivo | Ação |
|---|---|---|
| `CampaignForm.tsx` | Não usa Zod (usa `useState` manual) | Manter `<FormLabel>` normal com asteriscos manuais. Adicionar `// TODO: migrar para Zod` |
| `AgentForm.tsx` | Usa Zod mas usa `<label>` HTML direto (não `<FormLabel>` shadcn) | Exportar o schema para o registro, mas **não** trocar labels por ora |

---

## Como mudar campos obrigatórios após a implementação

Para tornar um campo opcional:
```typescript
// Antes (obrigatório):
name: z.string().min(1, "Name is required")

// Depois (opcional):
name: z.string().optional()
```

O asterisco no UI desaparece automaticamente. Nenhuma outra mudança necessária.

Para tornar um campo obrigatório:
```typescript
// Antes (opcional):
description: z.string().optional()

// Depois (obrigatório):
description: z.string().min(1, "Description is required")
```

O asterisco aparece automaticamente no UI.

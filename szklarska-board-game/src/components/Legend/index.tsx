import { cn } from '@/lib/utils'
import { SQUARE_KIND_THEME } from '@/game/theme'
import { RULES } from '@/game/rules'
import { SQUARE_KINDS } from '@/game/types'

/* ---------------------------------------------------------------------
   Renders itself from the theme map plus the distribution rules — add a
   square kind and it shows up here automatically.
   --------------------------------------------------------------------- */

const WEIGHT_TOTAL = SQUARE_KINDS.reduce(
    (sum, kind) => sum + RULES.distribution[kind],
    0,
)

export function Legend({ className }: { className?: string }) {
    return (
        <ul className={cn('flex flex-col gap-3', className)}>
            {SQUARE_KINDS.map((kind) => {
                const theme = SQUARE_KIND_THEME[kind]
                const Icon = theme.icon
                const share = Math.round((RULES.distribution[kind] / WEIGHT_TOTAL) * 100)

                return (
                    <li key={kind} className="flex items-start gap-3">
                        <span
                            className={cn(
                                'flex size-8 shrink-0 items-center justify-center rounded-md border',
                                theme.swatch,
                            )}
                        >
                            <Icon className={cn('size-4', theme.accent)} aria-hidden />
                        </span>
                        <div className="min-w-0">
                            <p className="text-sm font-semibold">
                                {theme.label}
                                <span className="text-muted-foreground ml-2 text-xs font-normal">
                                    {share}% of the board
                                </span>
                            </p>
                            <p className="text-muted-foreground text-xs">
                                {theme.description}
                            </p>
                        </div>
                    </li>
                )
            })}
        </ul>
    )
}

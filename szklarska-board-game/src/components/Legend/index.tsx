import { cn } from '@/lib/utils'
import { CATEGORY_THEME, SQUARE_CATEGORIES } from '@/game/theme'

/* ---------------------------------------------------------------------
   Renders itself from the theme map — add a category to theme.ts and it
   shows up here automatically.
   --------------------------------------------------------------------- */

export function Legend({ className }: { className?: string }) {
    return (
        <ul className={cn('flex flex-wrap gap-x-4 gap-y-2', className)}>
            {SQUARE_CATEGORIES.map((category) => {
                const theme = CATEGORY_THEME[category]
                const Icon = theme.icon

                return (
                    <li
                        key={category}
                        className="text-muted-foreground flex items-center gap-2 text-xs font-medium"
                    >
                        <span
                            className={cn(
                                'flex size-5 items-center justify-center rounded-md border',
                                theme.swatch,
                            )}
                        >
                            <Icon className={cn('size-3', theme.accent)} aria-hidden />
                        </span>
                        {theme.label}
                    </li>
                )
            })}
        </ul>
    )
}

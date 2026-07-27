import * as React from 'react'

import { cn } from '@/lib/utils'
import { TERMINAL_THEME } from '@/game/theme'

/* ---------------------------------------------------------------------
   The START / FINISH discs that cap both ends of the snail path.
   --------------------------------------------------------------------- */

export type TerminalProps = React.ComponentProps<'div'> & {
    kind: keyof typeof TERMINAL_THEME
    label: string
}

export function Terminal({ kind, label, className, ...props }: TerminalProps) {
    return (
        <div
            data-slot="terminal"
            data-kind={kind}
            className={cn(
                'flex size-square items-center justify-center rounded-full',
                'border-[length:var(--square-border-width)] shadow-sm',
                'text-xs font-extrabold tracking-wide uppercase',
                TERMINAL_THEME[kind],
                className,
            )}
            {...props}
        >
            {label}
        </div>
    )
}

import * as React from 'react'

import { cn } from '@/lib/utils'
import { TERMINAL_THEME } from '@/game/theme'

/* ---------------------------------------------------------------------
   The round START / FINISH discs that cap both ends of the snake path.
   --------------------------------------------------------------------- */

export type TerminalProps = React.ComponentProps<'div'> & {
    kind: keyof typeof TERMINAL_THEME
    label: string
}

export function Terminal({
    kind,
    label,
    className,
    children,
    ...props
}: TerminalProps) {
    return (
        <div
            data-slot="terminal"
            data-kind={kind}
            className={cn(
                'relative flex size-square items-center justify-center rounded-full',
                'border-(length:--square-border-width) shadow-sm',
                'text-xs font-extrabold tracking-wide uppercase',
                TERMINAL_THEME[kind],
                className,
            )}
            {...props}
        >
            {label}
            {children}
        </div>
    )
}

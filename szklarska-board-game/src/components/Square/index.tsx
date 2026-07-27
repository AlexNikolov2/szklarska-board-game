import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'
import { CATEGORY_THEME } from '@/game/theme'
import type { BoardSquare } from '@/game/types'

/* ---------------------------------------------------------------------
   A single path tile. Every dimension comes from a design token
   (size-square, rounded-square, --square-border-width), so resizing the
   whole board is a one-line change in index.css.
   --------------------------------------------------------------------- */

const squareVariants = cva(
    [
        'group relative flex size-square flex-col items-center justify-center gap-1',
        'rounded-square border-[length:var(--square-border-width)] p-1.5 text-center',
        'transition-[transform,box-shadow,opacity] duration-150 outline-none',
        'focus-visible:ring-[3px] focus-visible:ring-ring/50',
    ],
    {
        variants: {
            state: {
                idle: 'hover:-translate-y-0.5 hover:shadow-md',
                active: '-translate-y-0.5 shadow-lg ring-[3px] ring-ring/60',
                done: 'opacity-55 saturate-50',
                locked: 'cursor-not-allowed opacity-40',
            },
        },
        defaultVariants: {
            state: 'idle',
        },
    },
)

export type SquareState = NonNullable<
    VariantProps<typeof squareVariants>['state']
>

export type SquareProps = Omit<React.ComponentProps<'button'>, 'onSelect'> & {
    square: BoardSquare
    state?: SquareState
    /** Number printed in the corner. Defaults to the path position. */
    step?: number
    onSelect?: (square: BoardSquare) => void
}

export function Square({
    square,
    state = 'idle',
    step,
    onSelect,
    className,
    children,
    ...props
}: SquareProps) {
    const theme = CATEGORY_THEME[square.category]
    const Icon = theme.icon

    return (
        <button
            type="button"
            data-slot="square"
            data-category={square.category}
            data-state={state}
            disabled={state === 'locked'}
            aria-label={`${step ?? square.id + 1}. ${square.label} — ${theme.label}`}
            onClick={() => onSelect?.(square)}
            className={cn(squareVariants({ state }), theme.tile, className)}
            {...props}
        >
            <span className="absolute top-1 left-1.5 text-[0.625rem] leading-none font-bold opacity-60">
                {step ?? square.id + 1}
            </span>

            {square.bonus ? (
                <span className="absolute top-1 right-1.5 text-[0.625rem] leading-none font-bold opacity-70">
                    {square.bonus > 0 ? `+${square.bonus}` : square.bonus}
                </span>
            ) : null}

            <Icon className="size-5 shrink-0 opacity-80" aria-hidden />
            <span className="line-clamp-3 text-[0.6875rem] leading-tight font-semibold text-balance">
                {square.label}
            </span>

            {children}
        </button>
    )
}
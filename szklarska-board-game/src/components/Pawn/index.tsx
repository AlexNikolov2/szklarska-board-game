import { cn } from '@/lib/utils'
import { PAWN_THEME } from '@/game/theme'

/* ---------------------------------------------------------------------
   Player token. Colour is picked from PAWN_THEME by seat index.
   --------------------------------------------------------------------- */

export type PawnProps = {
    /** Seat index; wraps around if there are more players than pawn colours. */
    seat: number
    name: string
    className?: string
}

export function Pawn({ seat, name, className }: PawnProps) {
    return (
        <span
            data-slot="pawn"
            title={name}
            className={cn(
                'inline-block size-3.5 rounded-full ring-2 ring-white/80 shadow',
                PAWN_THEME[seat % PAWN_THEME.length],
                className,
            )}
        >
            <span className="sr-only">{name}</span>
        </span>
    )
}

import { Dices, Footprints, RotateCcw, Trophy } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Pawn } from '@/components/Pawn'
import { activePlayer } from '@/game/engine'
import { SQUARE_KIND_THEME } from '@/game/theme'
import type { GameState } from '@/game/types'

/* ---------------------------------------------------------------------
   Everything the active player can do right now, driven by state.phase.
   --------------------------------------------------------------------- */

export type TurnControlsProps = {
    state: GameState
    onRoll: () => void
    onEndTurn: () => void
    onNewGame: () => void
    className?: string
}

export function TurnControls({
    state,
    onRoll,
    onEndTurn,
    onNewGame,
    className,
}: TurnControlsProps) {
    const player = activePlayer(state)
    const forced = player.pendingSteps > 0
    const square =
        player.position >= 0 ? state.squares[player.position] : null

    if (state.phase === 'finished') {
        const winner = state.players.find((p) => p.id === state.winnerId)

        return (
            <div className={cn('flex flex-col items-start gap-3', className)}>
                <Badge className="bg-finish text-finish-fg border-finish-border gap-1.5 py-1">
                    <Trophy className="size-3" aria-hidden />
                    Game over
                </Badge>
                <p className="text-lg font-semibold">
                    {winner?.name} reached the finish.
                </p>
                <Button onClick={onNewGame}>
                    <RotateCcw />
                    New game
                </Button>
            </div>
        )
    }

    return (
        <div className={cn('flex flex-col gap-3', className)}>
            <div className="flex items-center gap-2">
                <Pawn seat={player.seat} name={player.name} />
                <span className="text-sm font-semibold">{player.name}</span>
                <Badge variant="secondary" className="ml-auto">
                    Turn {state.turn}
                </Badge>
            </div>

            {square && (
                <p className="text-muted-foreground text-xs">
                    Standing on square {player.position + 1} ·{' '}
                    {SQUARE_KIND_THEME[square.kind].label}
                </p>
            )}

            {state.lastRoll !== null && (
                <p className="flex items-center gap-2 text-sm">
                    <Dices className="size-4" aria-hidden />
                    Rolled <span className="font-bold">{state.lastRoll}</span>
                </p>
            )}

            <div className="flex flex-wrap gap-2">
                {state.phase === 'awaiting-roll' && (
                    <Button onClick={onRoll}>
                        {forced ? <Footprints /> : <Dices />}
                        {forced ? `Move ${player.pendingSteps}` : 'Roll the dice'}
                    </Button>
                )}

                {state.phase === 'turn-end' && (
                    <Button onClick={onEndTurn}>Next player</Button>
                )}

                <Button variant="outline" onClick={onNewGame}>
                    <RotateCcw />
                    New board
                </Button>
            </div>
        </div>
    )
}

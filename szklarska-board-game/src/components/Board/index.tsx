import { cn } from '@/lib/utils'
import { Square, type SquareState } from '@/components/Square'
import { Terminal } from '@/components/Terminal'
import { Pawn } from '@/components/Pawn'
import { BOARD_CONFIG } from '@/game/theme'
import {
    getFinishPlacement,
    getGridColumnCount,
    getPlacement,
    getRowCount,
    getStartPlacement,
} from '@/game/layout'
import type { BoardSquare, Player } from '@/game/types'

/* ---------------------------------------------------------------------
   The board itself: a straight snail path laid out on a CSS grid.
   Path order is decoupled from DOM order — every tile is positioned
   explicitly, so changing `columns` reflows the whole snail.
   --------------------------------------------------------------------- */

export type BoardProps = {
    squares: BoardSquare[]
    players?: Player[]
    activeSquareId?: number | null
    completedSquareIds?: number[]
    columns?: number
    onSquareSelect?: (square: BoardSquare) => void
    className?: string
}

export function Board({
    squares,
    players = [],
    activeSquareId = null,
    completedSquareIds = [],
    columns = BOARD_CONFIG.columns,
    onSquareSelect,
    className,
}: BoardProps) {
    const total = squares.length
    const rows = getRowCount(total, columns)
    const start = getStartPlacement(columns, total)
    const finish = getFinishPlacement(columns, total)

    const completed = new Set(completedSquareIds)

    return (
        <div
            data-slot="board"
            className={cn(
                'bg-board border-board-grid w-full overflow-x-auto rounded-xl border p-6 shadow-sm',
                className,
            )}
        >
            <div
                className="mx-auto grid w-fit gap-square-gap"
                style={{
                    gridTemplateColumns: `repeat(${getGridColumnCount(columns)}, var(--square-size))`,
                    gridTemplateRows: `repeat(${rows}, var(--square-size))`,
                }}
            >
                <Terminal
                    kind="start"
                    label={BOARD_CONFIG.startLabel}
                    style={{ gridRow: start.gridRow, gridColumn: start.gridColumn }}
                />

                {squares.map((square, index) => {
                    const placement = getPlacement(index, columns, total)
                    const state: SquareState =
                        square.id === activeSquareId
                            ? 'active'
                            : completed.has(square.id)
                                ? 'done'
                                : 'idle'
                    const here = players.filter((p) => p.position === index)

                    return (
                        <Square
                            key={square.id}
                            square={square}
                            step={index + 1}
                            state={state}
                            onSelect={onSquareSelect}
                            data-direction={placement.direction}
                            style={{
                                gridRow: placement.gridRow,
                                gridColumn: placement.gridColumn,
                            }}
                        >
                            {here.length > 0 && (
                                <span className="absolute -bottom-1.5 flex gap-0.5">
                                    {here.map((player) => (
                                        <Pawn
                                            key={player.id}
                                            seat={players.indexOf(player)}
                                            name={player.name}
                                        />
                                    ))}
                                </span>
                            )}
                        </Square>
                    )
                })}

                <Terminal
                    kind="finish"
                    label={BOARD_CONFIG.finishLabel}
                    style={{ gridRow: finish.gridRow, gridColumn: finish.gridColumn }}
                />
            </div>
        </div>
    )
}

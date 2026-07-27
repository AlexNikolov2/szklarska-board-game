import { cn } from '@/lib/utils'
import { Square, type SquareState } from '@/components/Square'
import { Terminal } from '@/components/Terminal'
import { Pawn } from '@/components/Pawn'
import { BOARD_CONFIG } from '../../game/theme'
import {
    getFinishPlacement,
    getGridColumnCount,
    getPlacement,
    getRowCount,
    getStartPlacement,
} from '@/game/layout'
import type { BoardSquare, Player } from '../../game/types'

/* ---------------------------------------------------------------------
   The board: a snake path laid out on a CSS grid — right, up, left, up,
   right — capped by round START and FINISH discs. Path order is
   decoupled from DOM order, so changing `columns` reflows the snake.
   --------------------------------------------------------------------- */

export type BoardProps = {
    squares: BoardSquare[]
    players?: Player[]
    activeSquareId?: number | null
    visitedSquareIds?: number[]
    columns?: number
    onSquareSelect?: (square: BoardSquare) => void
    className?: string
}

function PawnRow({ players }: { players: Player[] }) {
    if (players.length === 0) return null

    return (
        <span className="absolute -bottom-1.5 flex gap-0.5">
            {players.map((player) => (
                <Pawn key={player.id} seat={player.seat} name={player.name} />
            ))}
        </span>
    )
}

export function Board({
    squares,
    players = [],
    activeSquareId = null,
    visitedSquareIds = [],
    columns = BOARD_CONFIG.columns,
    onSquareSelect,
    className,
}: BoardProps) {
    const total = squares.length
    const rows = getRowCount(total, columns)
    const start = getStartPlacement(columns, total)
    const finish = getFinishPlacement(columns, total)
    const visited = new Set(visitedSquareIds)

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
                >
                    <PawnRow players={players.filter((p) => p.position < 0)} />
                </Terminal>

                {squares.map((square, index) => {
                    const placement = getPlacement(index, columns, total)
                    const state: SquareState =
                        square.id === activeSquareId
                            ? 'active'
                            : visited.has(square.id)
                                ? 'visited'
                                : 'idle'

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
                            <PawnRow players={players.filter((p) => p.position === index)} />
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

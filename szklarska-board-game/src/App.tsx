import * as React from 'react'
import { Moon, Sun } from 'lucide-react'

import { Board } from '@/components/Board'
import { Legend } from '@/components/Legend'
import { Pawn } from '@/components/Pawn'
import { QuestionDialog } from '@/components/Question'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BOARD_SQUARES, QUESTIONS } from '@/game/content'
import type { BoardSquare, Player } from '@/game/types'

const DEMO_PLAYERS: Player[] = [
  { id: 'p1', name: 'Founder A', position: 2 },
  { id: 'p2', name: 'Founder B', position: 5 },
]

/** Board scale presets — each one just rewrites the --square-size token. */
const SCALES = [
  { label: 'Compact', value: '4.25rem' },
  { label: 'Default', value: '5.5rem' },
  { label: 'Large', value: '6.75rem' },
]

export default function App() {
  const [players, setPlayers] = React.useState(DEMO_PLAYERS)
  const [activeSquare, setActiveSquare] = React.useState<BoardSquare | null>(
    null,
  )
  const [completed, setCompleted] = React.useState<number[]>([])
  const [dark, setDark] = React.useState(false)
  const [scale, setScale] = React.useState(SCALES[1].value)

  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  React.useEffect(() => {
    document.documentElement.style.setProperty('--square-size', scale)
  }, [scale])

  const question =
    QUESTIONS.find((q) => q.category === activeSquare?.category) ?? null

  function handleResolved(correct: boolean) {
    if (!activeSquare) return
    if (correct) {
      setCompleted((prev) => [...prev, activeSquare.id])
      setPlayers((prev) =>
        prev.map((player, index) =>
          index === 0
            ? {
              ...player,
              position: Math.min(
                BOARD_SQUARES.length - 1,
                activeSquare.id + (activeSquare.bonus ?? 0) + 1,
              ),
            }
            : player,
        ),
      )
    }
    setActiveSquare(null)
  }

  return (
    <div className="min-h-svh px-4 py-8 sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-muted-foreground text-xs font-semibold tracking-[0.18em] uppercase">
              Design system preview
            </p>
            <h1 className="text-3xl font-bold tracking-tight">
              Entrepreneurship Snail Board
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Every colour, size and radius on this page is a token in{' '}
              <code className="bg-muted rounded px-1 py-0.5 text-xs">
                src/index.css
              </code>
              .
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="border-input flex rounded-md border p-0.5">
              {SCALES.map((option) => (
                <Button
                  key={option.value}
                  size="sm"
                  variant={scale === option.value ? 'secondary' : 'ghost'}
                  onClick={() => setScale(option.value)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              size="icon"
              aria-label="Toggle dark mode"
              onClick={() => setDark((value) => !value)}
            >
              {dark ? <Sun /> : <Moon />}
            </Button>
          </div>
        </header>

        <Board
          squares={BOARD_SQUARES}
          players={players}
          completedSquareIds={completed}
          activeSquareId={activeSquare?.id ?? null}
          onSquareSelect={setActiveSquare}
        />

        <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <Legend />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Players</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="flex flex-col gap-3">
                {players.map((player, index) => (
                  <li
                    key={player.id}
                    className="flex items-center gap-3 text-sm"
                  >
                    <Pawn seat={index} name={player.name} />
                    <span className="font-medium">{player.name}</span>
                    <span className="text-muted-foreground ml-auto text-xs">
                      Square {player.position + 1}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      <QuestionDialog
        question={question}
        open={activeSquare !== null}
        onOpenChange={(open) => !open && setActiveSquare(null)}
        onResolved={handleResolved}
      />
    </div>
  )
}

import * as React from 'react'
import { Moon, Sun } from 'lucide-react'

import { ActionDialog } from '@/components/Action'
import { Board } from '@/components/Board'
import { Legend } from './components/Legend'
import { QuestionDialog, type QuestionPhase } from './components/Question'
import { Scoreboard } from '@/components/Scoreboard'
import { TurnControls } from '@/components/TurnControls'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useGame } from '@/hooks/useGame'
import { activePlayer } from '@/game/engine'

const PLAYER_NAMES = ['Founder A', 'Founder B']

/** Board scale presets — each one just rewrites the --square-size token. */
const SCALES = [
  { label: 'Compact', value: '4.25rem' },
  { label: 'Default', value: '5.5rem' },
  { label: 'Large', value: '6.75rem' },
]

const QUESTION_PHASES: QuestionPhase[] = [
  'question-difficulty',
  'question-answer',
  'question-bonus-roll',
]

export default function App() {
  const game = useGame(PLAYER_NAMES)
  const [dark, setDark] = React.useState(false)
  const [scale, setScale] = React.useState(SCALES[1].value)

  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  React.useEffect(() => {
    document.documentElement.style.setProperty('--square-size', scale)
  }, [scale])

  const { state } = game
  const player = activePlayer(state)
  const questionPhase = QUESTION_PHASES.includes(state.phase as QuestionPhase)
    ? (state.phase as QuestionPhase)
    : null

  return (
    <div className="min-h-svh px-4 py-8 sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-muted-foreground text-xs font-semibold tracking-[0.18em] uppercase">
              Entrepreneurship board game
            </p>
            <h1 className="text-3xl font-bold tracking-tight">Snake Board</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Base, question and action squares are reshuffled every game.
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
          squares={state.squares}
          players={state.players}
          activeSquareId={player.position >= 0 ? player.position : null}
        />

        <div className="grid gap-4 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Current turn</CardTitle>
            </CardHeader>
            <CardContent>
              <TurnControls
                state={state}
                onRoll={game.roll}
                onEndTurn={game.endTurn}
                onNewGame={game.newGame}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Players</CardTitle>
            </CardHeader>
            <CardContent>
              <Scoreboard players={state.players} activePlayerId={player.id} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Square kinds</CardTitle>
            </CardHeader>
            <CardContent>
              <Legend />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Game log</CardTitle>
          </CardHeader>
          <CardContent>
            {state.log.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                Roll the dice to start.
              </p>
            ) : (
              <ol className="flex flex-col gap-1 text-sm">
                {state.log.slice(0, 8).map((entry) => (
                  <li key={entry.id} className="text-muted-foreground">
                    <span className="text-foreground font-medium">
                      {state.players.find((p) => p.id === entry.playerId)?.name}
                    </span>{' '}
                    {entry.message}
                  </li>
                ))}
              </ol>
            )}
          </CardContent>
        </Card>
      </div>

      <QuestionDialog
        phase={questionPhase}
        question={state.pendingQuestion}
        onChooseDifficulty={game.chooseDifficulty}
        onAnswer={game.answer}
        onBonusRoll={game.bonusRoll}
      />

      <ActionDialog
        open={state.phase === 'action'}
        player={player}
        onBuyProperty={game.buyProperty}
        onBuyShares={game.buyShares}
        onDecline={game.decline}
      />
    </div>
  )
}

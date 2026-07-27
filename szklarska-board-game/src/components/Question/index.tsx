import * as React from 'react'
import { CheckCircle2, Dices, XCircle } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { DIFFICULTY_THEME, SQUARE_KIND_THEME } from '@/game/theme'
import { RULES } from '@/game/rules'
import { DIFFICULTIES, type Difficulty, type Question } from '@/game/types'

/* ---------------------------------------------------------------------
   Question square flow: choose difficulty -> answer -> bonus roll.
   The dialog is modal and cannot be dismissed; the turn must resolve.
   --------------------------------------------------------------------- */

export type QuestionPhase =
    | 'question-difficulty'
    | 'question-answer'
    | 'question-bonus-roll'

export type QuestionDialogProps = {
    phase: QuestionPhase | null
    question: Question | null
    onChooseDifficulty: (difficulty: Difficulty) => void
    onAnswer: (optionIndex: number) => void
    onBonusRoll: () => void
}

export function QuestionDialog({
    phase,
    question,
    onChooseDifficulty,
    onAnswer,
    onBonusRoll,
}: QuestionDialogProps) {
    const [picked, setPicked] = React.useState<number | null>(null)
    const theme = SQUARE_KIND_THEME.question

    React.useEffect(() => {
        setPicked(null)
    }, [question?.id])

    // Unmount rather than animate out: the step content disappears together
    // with the phase, so an exit animation would just fade an empty box.
    if (phase === null) return null

    return (
        <Dialog open>
            <DialogContent
                showCloseButton={false}
                onEscapeKeyDown={(event) => event.preventDefault()}
                onInteractOutside={(event) => event.preventDefault()}
                className="sm:max-w-xl"
            >
                {phase === 'question-difficulty' && (
                    <DifficultyPicker onChoose={onChooseDifficulty} />
                )}

                {phase === 'question-answer' && question && (
                    <AnswerStep
                        question={question}
                        picked={picked}
                        onPick={setPicked}
                        onConfirm={() => picked !== null && onAnswer(picked)}
                    />
                )}

                {phase === 'question-bonus-roll' && (
                    <>
                        <DialogHeader>
                            <Badge variant="outline" className={cn('gap-1.5 py-1', theme.tile)}>
                                <theme.icon className="size-3" aria-hidden />
                                Correct answer
                            </Badge>
                            <DialogTitle className="text-xl">Take your free move</DialogTitle>
                            <DialogDescription>
                                Roll the dice and advance by the number you throw.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button onClick={onBonusRoll}>
                                <Dices />
                                Roll the dice
                            </Button>
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>
    )
}

function DifficultyPicker({
    onChoose,
}: {
    onChoose: (difficulty: Difficulty) => void
}) {
    const theme = SQUARE_KIND_THEME.question

    return (
        <>
            <DialogHeader>
                <Badge variant="outline" className={cn('gap-1.5 py-1', theme.tile)}>
                    <theme.icon className="size-3" aria-hidden />
                    {theme.label} square
                </Badge>
                <DialogTitle className="text-xl">Choose your difficulty</DialogTitle>
                <DialogDescription>
                    Harder questions pay more. Answer correctly to score and unlock a
                    bonus dice roll.
                </DialogDescription>
            </DialogHeader>

            <div className="grid gap-3 sm:grid-cols-3">
                {DIFFICULTIES.map((difficulty) => {
                    const level = DIFFICULTY_THEME[difficulty]

                    return (
                        <button
                            key={difficulty}
                            type="button"
                            onClick={() => onChoose(difficulty)}
                            className={cn(
                                'flex flex-col items-center gap-1 rounded-lg border p-4 transition-transform',
                                'hover:-translate-y-0.5 hover:shadow-md',
                                'focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none',
                                level.tile,
                            )}
                        >
                            <span className="text-sm font-semibold">{level.label}</span>
                            <span className="text-2xl font-bold">
                                +{RULES.question.reward[difficulty]}
                            </span>
                            <span className="text-[0.6875rem] opacity-70">points</span>
                        </button>
                    )
                })}
            </div>
        </>
    )
}

function AnswerStep({
    question,
    picked,
    onPick,
    onConfirm,
}: {
    question: Question
    picked: number | null
    onPick: (index: number) => void
    onConfirm: () => void
}) {
    const level = DIFFICULTY_THEME[question.difficulty]
    const answered = picked !== null
    const correct = picked === question.answerIndex

    return (
        <>
            <DialogHeader>
                <Badge variant="outline" className={cn('gap-1.5 py-1', level.tile)}>
                    {level.label} · +{RULES.question.reward[question.difficulty]} pts
                </Badge>
                <DialogTitle className="text-xl leading-snug text-balance">
                    {question.prompt}
                </DialogTitle>
            </DialogHeader>

            <ul className="flex flex-col gap-2">
                {question.options.map((option, index) => {
                    const isAnswer = index === question.answerIndex
                    const isPicked = index === picked

                    return (
                        <li key={option}>
                            <button
                                type="button"
                                disabled={answered}
                                onClick={() => onPick(index)}
                                className={cn(
                                    'flex w-full items-center gap-3 rounded-lg border p-3 text-left text-sm transition-colors',
                                    'hover:bg-accent disabled:cursor-default',
                                    answered &&
                                    isAnswer &&
                                    'bg-level-easy text-level-easy-fg border-level-easy-border',
                                    answered &&
                                    isPicked &&
                                    !isAnswer &&
                                    'bg-level-hard text-level-hard-fg border-level-hard-border',
                                    answered && !isAnswer && !isPicked && 'opacity-50',
                                )}
                            >
                                <span className="bg-muted text-muted-foreground flex size-6 shrink-0 items-center justify-center rounded-md text-xs font-bold">
                                    {String.fromCharCode(65 + index)}
                                </span>
                                <span className="flex-1">{option}</span>
                                {answered && isAnswer && <CheckCircle2 className="size-4" />}
                                {answered && isPicked && !isAnswer && (
                                    <XCircle className="size-4" />
                                )}
                            </button>
                        </li>
                    )
                })}
            </ul>

            {answered && (
                <p className="text-muted-foreground bg-muted rounded-lg p-3 text-sm">
                    {question.explanation}
                </p>
            )}

            <DialogFooter>
                <Button disabled={!answered} onClick={onConfirm}>
                    {answered && correct ? 'Collect points' : 'Continue'}
                </Button>
            </DialogFooter>
        </>
    )
}

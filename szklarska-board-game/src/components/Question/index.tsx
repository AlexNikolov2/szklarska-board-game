import * as React from 'react'
import { CheckCircle2, XCircle } from 'lucide-react'

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
import { CATEGORY_THEME } from '@/game/theme'
import type { Question } from '@/game/types'

/* ---------------------------------------------------------------------
   The challenge card shown when a player lands on a square. It inherits
   the colour of the square's category straight from the theme map.
   --------------------------------------------------------------------- */

export type QuestionProps = {
    question: Question | null
    open: boolean
    onOpenChange: (open: boolean) => void
    onResolved?: (correct: boolean) => void
}

export function QuestionDialog({
    question,
    open,
    onOpenChange,
    onResolved,
}: QuestionProps) {
    const [picked, setPicked] = React.useState<number | null>(null)

    React.useEffect(() => {
        if (open) setPicked(null)
    }, [open, question?.id])

    if (!question) return null

    const theme = CATEGORY_THEME[question.category]
    const Icon = theme.icon
    const answered = picked !== null
    const correct = picked === question.answerIndex

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <Badge
                        variant="outline"
                        className={cn('gap-1.5 py-1', theme.tile)}
                    >
                        <Icon className="size-3" aria-hidden />
                        {theme.label}
                    </Badge>
                    <DialogTitle className="text-xl leading-snug text-balance">
                        {question.prompt}
                    </DialogTitle>
                    <DialogDescription>{theme.description}</DialogDescription>
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
                                    onClick={() => setPicked(index)}
                                    className={cn(
                                        'flex w-full items-center gap-3 rounded-lg border p-3 text-left text-sm transition-colors',
                                        'hover:bg-accent disabled:cursor-default',
                                        answered && isAnswer && 'border-cat-growth-border bg-cat-growth text-cat-growth-fg',
                                        answered &&
                                        isPicked &&
                                        !isAnswer &&
                                        'border-cat-risk-border bg-cat-risk text-cat-risk-fg',
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
                    <Button
                        disabled={!answered}
                        onClick={() => {
                            onResolved?.(correct)
                            onOpenChange(false)
                        }}
                    >
                        {correct ? 'Move forward' : 'Continue'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

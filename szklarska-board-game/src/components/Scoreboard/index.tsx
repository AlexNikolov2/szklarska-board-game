import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Pawn } from '@/components/Pawn'
import { PROPERTY_BY_ID } from '@/game/catalog'
import { incomePerSquare, netWorth } from '@/game/engine'
import { COMPANY_ICON, PROPERTY_ICON } from '@/game/theme'
import type { CompanyId, Player } from '@/game/types'

/* ---------------------------------------------------------------------
   Points, holdings and passive income for every player.
   --------------------------------------------------------------------- */

export type ScoreboardProps = {
    players: Player[]
    activePlayerId: string
    className?: string
}

export function Scoreboard({
    players,
    activePlayerId,
    className,
}: ScoreboardProps) {
    return (
        <ul className={cn('flex flex-col gap-2', className)}>
            {players.map((player) => {
                const income = incomePerSquare(player)
                const shareIds = (Object.keys(player.shares) as CompanyId[]).filter(
                    (id) => player.shares[id] > 0,
                )

                return (
                    <li
                        key={player.id}
                        className={cn(
                            'rounded-lg border p-3 transition-colors',
                            player.id === activePlayerId && 'border-ring bg-accent/40',
                        )}
                    >
                        <div className="flex items-center gap-2">
                            <Pawn seat={player.seat} name={player.name} />
                            <span className="text-sm font-semibold">{player.name}</span>
                            <Badge variant="secondary" className="ml-auto">
                                {player.points} pts
                            </Badge>
                        </div>

                        <p className="text-muted-foreground mt-1 text-xs">
                            {player.position < 0
                                ? 'On START'
                                : `Square ${player.position + 1}`}
                            {income > 0 && ` · +${income} pt${income === 1 ? '' : 's'} / square`}
                            {player.pendingSteps > 0 &&
                                ` · forced move of ${player.pendingSteps} next turn`}
                            {` · net worth ${netWorth(player)}`}
                        </p>

                        {(player.properties.length > 0 || shareIds.length > 0) && (
                            <div className="mt-2 flex flex-wrap gap-1">
                                {player.properties.map((id) => {
                                    const Icon = PROPERTY_ICON[id]
                                    return (
                                        <Badge
                                            key={id}
                                            variant="outline"
                                            className="bg-asset-property text-asset-property-fg border-asset-property-border"
                                        >
                                            <Icon aria-hidden />
                                            {PROPERTY_BY_ID[id].label}
                                        </Badge>
                                    )
                                })}
                                {shareIds.map((id) => {
                                    const Icon = COMPANY_ICON[id]
                                    return (
                                        <Badge
                                            key={id}
                                            variant="outline"
                                            className="bg-asset-company text-asset-company-fg border-asset-company-border"
                                        >
                                            <Icon aria-hidden />
                                            {player.shares[id]}×
                                        </Badge>
                                    )
                                })}
                            </div>
                        )}
                    </li>
                )
            })}
        </ul>
    )
}

import * as React from 'react'
import { Minus, Plus } from 'lucide-react'

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
import { COMPANIES, PROPERTIES } from '@/game/catalog'
import {
    ASSET_THEME,
    COMPANY_ICON,
    PROPERTY_ICON,
    SQUARE_KIND_THEME,
} from '@/game/theme'
import type { CompanyId, Player, PropertyId } from '@/game/types'

/* ---------------------------------------------------------------------
   Action square flow: buy a property, or invest in a company.
   Both offers are rendered straight from the catalog.
   --------------------------------------------------------------------- */

export type ActionDialogProps = {
    open: boolean
    player: Player
    onBuyProperty: (propertyId: PropertyId) => void
    onBuyShares: (companyId: CompanyId, quantity: number) => void
    onDecline: () => void
}

export function ActionDialog({
    open,
    player,
    onBuyProperty,
    onBuyShares,
    onDecline,
}: ActionDialogProps) {
    const theme = SQUARE_KIND_THEME.action

    // See QuestionDialog: unmount rather than animate out.
    if (!open) return null

    return (
        <Dialog open>
            <DialogContent
                showCloseButton={false}
                onEscapeKeyDown={(event) => event.preventDefault()}
                onInteractOutside={(event) => event.preventDefault()}
                className="sm:max-w-2xl"
            >
                <DialogHeader>
                    <Badge variant="outline" className={cn('gap-1.5 py-1', theme.tile)}>
                        <theme.icon className="size-3" aria-hidden />
                        {theme.label} square
                    </Badge>
                    <DialogTitle className="text-xl">Make a move on the market</DialogTitle>
                    <DialogDescription>
                        {player.name} has{' '}
                        <span className="text-foreground font-semibold">
                            {player.points} pts
                        </span>{' '}
                        to spend.
                    </DialogDescription>
                </DialogHeader>

                <section className="flex flex-col gap-2">
                    <h3 className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                        Buy property
                    </h3>
                    <div className="grid gap-2 sm:grid-cols-4">
                        {PROPERTIES.map((property) => {
                            const Icon = PROPERTY_ICON[property.id]
                            const owned = player.properties.includes(property.id)
                            const affordable = player.points >= property.cost

                            return (
                                <button
                                    key={property.id}
                                    type="button"
                                    disabled={owned || !affordable}
                                    onClick={() => onBuyProperty(property.id)}
                                    className={cn(
                                        'flex flex-col items-center gap-1 rounded-lg border p-3 transition-transform',
                                        'enabled:hover:-translate-y-0.5 enabled:hover:shadow-md',
                                        'focus-visible:ring-ring/50 outline-none focus-visible:ring-[3px]',
                                        'disabled:cursor-not-allowed disabled:opacity-40',
                                        ASSET_THEME.property,
                                    )}
                                >
                                    <Icon className="size-5 opacity-80" aria-hidden />
                                    <span className="text-xs font-semibold">{property.label}</span>
                                    <span className="text-sm font-bold">{property.cost} pts</span>
                                    {owned && <span className="text-[0.625rem]">Owned</span>}
                                </button>
                            )
                        })}
                    </div>
                </section>

                <section className="flex flex-col gap-2">
                    <h3 className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                        Invest in a company
                    </h3>
                    <div className="flex flex-col gap-2">
                        {COMPANIES.map((company) => (
                            <CompanyOffer
                                key={company.id}
                                companyId={company.id}
                                name={company.name}
                                sharePrice={company.sharePrice}
                                incomePerSquare={company.incomePerSquare}
                                owned={player.shares[company.id]}
                                budget={player.points}
                                onBuy={onBuyShares}
                            />
                        ))}
                    </div>
                </section>

                <DialogFooter>
                    <Button variant="ghost" onClick={onDecline}>
                        Pass on this deal
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

function CompanyOffer({
    companyId,
    name,
    sharePrice,
    incomePerSquare,
    owned,
    budget,
    onBuy,
}: {
    companyId: CompanyId
    name: string
    sharePrice: number
    incomePerSquare: number
    owned: number
    budget: number
    onBuy: (companyId: CompanyId, quantity: number) => void
}) {
    const [quantity, setQuantity] = React.useState(1)
    const Icon = COMPANY_ICON[companyId]
    const maxAffordable = Math.floor(budget / sharePrice)
    const cost = sharePrice * quantity
    const affordable = quantity <= maxAffordable

    return (
        <div
            className={cn(
                'flex flex-wrap items-center gap-3 rounded-lg border p-3',
                ASSET_THEME.company,
            )}
        >
            <Icon className="size-5 shrink-0 opacity-80" aria-hidden />

            <div className="min-w-40 flex-1">
                <p className="text-sm font-semibold">{name}</p>
                <p className="text-xs opacity-80">
                    {sharePrice} pts / share · +{incomePerSquare} pt
                    {incomePerSquare === 1 ? '' : 's'} per square moved
                    {owned > 0 && ` · you hold ${owned}`}
                </p>
            </div>

            <div className="flex items-center gap-1">
                <Button
                    size="icon"
                    variant="ghost"
                    className="size-7"
                    aria-label={`Buy fewer ${name} shares`}
                    disabled={quantity <= 1}
                    onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                >
                    <Minus />
                </Button>
                <span className="w-6 text-center text-sm font-bold">{quantity}</span>
                <Button
                    size="icon"
                    variant="ghost"
                    className="size-7"
                    aria-label={`Buy more ${name} shares`}
                    disabled={quantity >= Math.max(1, maxAffordable)}
                    onClick={() => setQuantity((value) => value + 1)}
                >
                    <Plus />
                </Button>
            </div>

            <Button
                size="sm"
                disabled={!affordable}
                onClick={() => onBuy(companyId, quantity)}
            >
                Buy for {cost} pts
            </Button>
        </div>
    )
}

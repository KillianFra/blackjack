
type getDeckProps = { deck_id: string; shuffled: boolean; remaining: number; success: boolean; }

type getCardsProps = { success: boolean; deck_id: string; cards: { code: string; image: string; images: { svg: string; png: string; }; value: string; suit: string; }[]; remaining: number; }    

type shuffleDeckProps = { success: boolean; deck_id: string; shuffled: boolean; remaining: number; }

type cardToHandProps = { success: boolean; deck_id: string; remaining: number; piles: { [key: string]: { remaining: number; } } }

type listCardsInPileProps = { success: boolean; deck_id: string; remaining: number; piles: { [key: string]: { remaining: number; cards: { code: string; image: string; images: { svg: string; png: string; }; value: string; suit: string; }[] } } }

export { getDeckProps, getCardsProps, shuffleDeckProps, cardToHandProps, listCardsInPileProps }
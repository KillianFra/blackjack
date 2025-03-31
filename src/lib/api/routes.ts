import type { cardToHandProps, getCardsProps, getDeckProps, listCardsInPileProps, shuffleDeckProps } from "../../ambient"

const apiUrl = 'http://deckofcards.raltech.school/api/deck'


export function getNewDeck(deckCount: number = 6) : Promise<getDeckProps> {
    return fetch(`${apiUrl}/new/shuffle/?deck_count=${deckCount}`)
        .then(response => response.json())
}

export function drawCard(number: number, deckId: string) : Promise<getCardsProps> {
    return fetch(`${apiUrl}/${deckId}/draw/?count=${number}`)
        .then(response => response.json())
}

export function shuffleDeck(deckId: string) : Promise<shuffleDeckProps> {
    return fetch(`${apiUrl}/${deckId}/shuffle/?remaining=true`)
        .then(response => response.json())
}

export function addCardToHand(deckId: string, handName: string = "playerHand", cards: []) : Promise<cardToHandProps> {
    return fetch(`${apiUrl}/${deckId}/pile/${handName}/add/?cards=${cards.join()}`)
        .then(response => response.json())
}

export function getCardsInPile(deckId: string, pileName: string = "playerHand") : Promise<listCardsInPileProps> {
    return fetch(`${apiUrl}/${deckId}/pile/${pileName}/list/`)
        .then(response => response.json())
    }

export function getBackCard() {
    return fetch('http://deckofcards.raltech.school/static/img/back.png')
}

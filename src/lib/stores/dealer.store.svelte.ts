import { browser } from '$app/environment';
import { drawCard, getNewDeck } from '$lib/api/routes';

export type Dealer = {
    hand: { code: string; image: string; images: { svg: string; png: string }; value: string; suit: string }[];
    deck_id: string;
    handValue: number;
}

const defaultDealer: Dealer = {
    hand: [],
    deck_id: "",
    handValue: 0
}

function getLocalDealer(): Dealer {
    if (browser) {
        const dealer = localStorage.getItem('dealer');
        if (dealer) {
            return JSON.parse(dealer);
        }
    }
    return defaultDealer;
}

function createDealerStore() {
    let state = $state(getLocalDealer());
    return {
        get dealer() { return state },
        set dealer(value: Dealer) { 
            state = value;
            if (browser) {
                localStorage.setItem('dealer', JSON.stringify(value));
            }
        },
        get hand() { return state.hand },
        set hand(value) { 
            state.hand = value;
            state.handValue = value.reduce((acc, card) => {
                if (card.value === "ACE") {
                    return acc + 11;
                }
                if (card.value === "KING" || card.value === "QUEEN" || card.value === "JACK") {
                    return acc + 10;
                }
                return acc + parseInt(card.value);
            }
            , 0);
            if (browser) {
                localStorage.setItem('dealer', JSON.stringify(state));
            }
        },
        get handValue() { return state.handValue },
        set handValue(value: number) { 
            state.handValue = value;
            if (browser) {
                localStorage.setItem('dealer', JSON.stringify(state));
            }
        },
        get deck_id() { 
            if (!state.deck_id) {
                getNewDeck().then(deck => {
                    state.deck_id = deck.deck_id;
                    if (browser) {
                        localStorage.setItem('dealer', JSON.stringify(state));
                    }
                });
            }
            return state.deck_id
         },
        set deck_id(value: string) {
            state.deck_id = value;
            if (browser) {
                localStorage.setItem('dealer', JSON.stringify(state));
            }
        },
        resetDealer() { 
            state = defaultDealer;
            if (browser) {
                localStorage.setItem('dealer', JSON.stringify(defaultDealer));
            }
        },
        hit() {
            drawCard(1, state.deck_id).then(card => {
                state.hand.push(card.cards[0]);
                state.handValue = state.hand.reduce((acc, card) => {
                    if (card.value === "ACE") {
                        return acc + 11;
                    }
                    if (card.value === "KING" || card.value === "QUEEN" || card.value === "JACK") {
                        return acc + 10;
                    }
                    return acc + parseInt(card.value);
                }
                , 0);
                if (browser) {
                    localStorage.setItem('dealer', JSON.stringify(state));
                }
            });
        }
    }
}

export const dealerStore = createDealerStore(); 
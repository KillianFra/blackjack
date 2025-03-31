import { browser } from '$app/environment';

export type Dealer = {
    hand: { code: string; image: string; images: { svg: string; png: string }; value: string; suit: string }[];
    handValue: number;
}

const defaultDealer: Dealer = {
    hand: [],
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
        resetDealer() { 
            state = defaultDealer;
            if (browser) {
                localStorage.setItem('dealer', JSON.stringify(defaultDealer));
            }
        }
    }
}

export const dealerStore = createDealerStore(); 
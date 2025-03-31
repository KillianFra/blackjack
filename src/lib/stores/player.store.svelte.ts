import { browser } from '$app/environment';
import { drawCard } from '$lib/api/routes';
import { dealerStore } from './dealer.store.svelte';

export type User = {
    name: string;
    balance: number;
    hand: { code: string; image: string; images: { svg: string; png: string }; value: string; suit: string }[];
    bet: number;
    handValue: number;
}

const defaultUser: User = {
    name: "Player",
    balance: 1000,
    hand: [],
    bet: 0,
    handValue: 0
}

function getLocalUser(): User {
    if (browser) {
        const user = localStorage.getItem('user');
        if (user) {
            return JSON.parse(user);
        }
    }
    return defaultUser;
}

function calculateHandValue(hand: User['hand']): number {
    return hand.reduce((acc, card) => {
        if (card.value === "ACE") {
            return acc + 11;
        }
        if (card.value === "KING" || card.value === "QUEEN" || card.value === "JACK") {
            return acc + 10;
        }
        return acc + parseInt(card.value);
    }, 0);
}

function createUserStore() {
    let state = $state(getLocalUser());

    function updateState(newState: Partial<User>) {
        state = { ...state, ...newState };
        if (browser) {
            localStorage.setItem('user', JSON.stringify(state));
        }
    }

    return {
        get user() { return state },
        set user(value: User) { 
            updateState(value);
        },
        get name() { return state.name },
        set name(value: string) { 
            updateState({ name: value });
        },
        get balance() { return state.balance },
        set balance(value: number) { 
            updateState({ balance: value });
        },
        get hand() { return state.hand },
        set hand(value: User['hand']) { 
            updateState({ 
                hand: value,
                handValue: calculateHandValue(value)
            });
        },
        get bet() { return state.bet },
        set bet(value: number) { 
            updateState({ bet: value });
        },
        get handValue() { return state.handValue },
        set handValue(value: number) { 
            updateState({ handValue: value });
        },
        resetUser() { 
            updateState(defaultUser);
        },
        hit() {
            drawCard(1, dealerStore.deck_id).then(card => {
                const newHand = [...state.hand, ...card.cards];
                updateState({ 
                    hand: newHand,
                    handValue: calculateHandValue(newHand)
                });
            });
        },
        placeBet(amount: number) {
            if (amount <= state.balance) {
                updateState({
                    bet: state.bet + amount,
                    balance: state.balance - amount
                });
                return true;
            }
            return false;
        },
        clearHand() {
            updateState({
                hand: [],
                handValue: 0
            });
        },
        resetBet() {
            updateState({
                bet: 0,
                balance: state.balance + state.bet
            });
        }
    }
}

export const userStore = createUserStore();
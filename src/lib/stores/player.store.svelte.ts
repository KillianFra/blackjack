import { browser } from '$app/environment';

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

function createUserStore() {
    let state = $state(getLocalUser());
    return {
        get user() { return state },
        set user(value: User) { 
            state = value;
            if (browser) {
                localStorage.setItem('user', JSON.stringify(value));
            }
        },
        get name() { return state.name },
        set name(value: string) { 
            state.name = value;
            if (browser) {
                localStorage.setItem('user', JSON.stringify(state));
            }
        },
        get balance() { return state.balance },
        set balance(value: number) { 
            state.balance = value;
            if (browser) {
                localStorage.setItem('user', JSON.stringify(state));
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
                localStorage.setItem('user', JSON.stringify(state));
            }
        },
        get bet() { return state.bet },
        set bet(value: number) { 
            state.bet = value;
            if (browser) {
                localStorage.setItem('user', JSON.stringify(state));
            }
        },
        get handValue() { return state.handValue },
        set handValue(value: number) { 
            state.handValue = value;
            if (browser) {
                localStorage.setItem('user', JSON.stringify(state));
            }
        },
        resetUser() { 
            state = defaultUser;
            if (browser) {
                localStorage.setItem('user', JSON.stringify(defaultUser));
            }
        }
    }
}

export const userStore = createUserStore();
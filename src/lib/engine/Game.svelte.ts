import { type Card } from '$lib/types/players';
import { getHandValue } from '$lib/utils';

export enum GameState {
	INIT = 'INIT',
	PLAYING = 'PLAYING',
	DEALER_TURN = 'DEALER_TURN',
	END = 'END'
}

export enum HandState {
	INIT = 'INIT',
	PLAYING = 'PLAYING',
	STANDING = 'STANDING',
	LOST = 'LOST',
	WIN = 'WIN',
	BLACKJACK = 'BLACKJACK',
	EQUAL = 'EQUAL'
}

type PlayerHand = {
	cards: Card[];
	bet: number;
	handState: HandState;
};

export class Game {
	deckId: string = $state('');
	gameState: GameState = $state(GameState.INIT);
	playerHands: PlayerHand[] = $state<PlayerHand[]>([
		{
			cards: [],
			bet: 0,
			handState: HandState.INIT
		}
	]);
	dealerCards: Card[] = $state([]);
	playerBalance: number = $state(1000);
	isSplited: boolean = $state(false);

	constructor(deckId: string) {
		this.deckId = deckId;
	}

	static async init(fetch: typeof globalThis.fetch) {
		const deckId = await fetch('/api/deck').then((response) => response.json());
		return deckId;
	}

	private async drawCards(count: number) {
		try {
			return await fetch(`/api/card?deckId=${this.deckId}&drawCount=${count}`).then((response) =>
				response.json()
			);
		} catch (error) {
			console.error('Error drawing cards:', error);
		}
	}

	setBet(bet: number, hand?: PlayerHand) {
		if (bet <= this.playerBalance) {
			if (hand) {
				hand.bet += bet;
			} else {
				this.playerHands[0].bet += bet;
			}
			this.playerBalance -= bet;
		}
	}

	doubleDown(hand: PlayerHand) {
		if (hand.bet === 0) return;
		this.setBet(hand.bet, hand);
	}

	replay() {
		this.resetHands();
		this.gameState = GameState.INIT;
		this.isSplited = false;
	}

	async hit(hand: PlayerHand) {
		if (!this.canHit(hand)) return;

		const newPlayerCard = await this.drawCards(1);
		hand.cards = [...hand.cards, ...newPlayerCard];

		if (getHandValue(hand.cards) > 21) {
			this.evaluate(hand);
		}
	}

	async split() {
		if (!this.canSplit()) return;

		const bet = this.playerHands[0].bet;

		const hands = this.playerHands[0].cards.map((card) => {
			const hand = {
				cards: [card],
				bet: 0,
				handState: HandState.PLAYING
			};
			this.setBet(bet, hand);
			return hand;
		});

		this.playerHands = [...hands];
		this.isSplited = true;
	}

	async deal() {
		if (this.getTotalBet() === 0) return;

		this.gameState = GameState.PLAYING;

		const newDealerCard = await this.drawCards(1);

		this.dealerCards = [...this.dealerCards, ...newDealerCard];
		const newPlayerCards = await this.drawCards(2);

		// force twice the same card
		while (newPlayerCards[0].value !== newPlayerCards[1].value) {
			const newPlayerCard = await this.drawCards(1);
			console.log('newPlayerCard:', newPlayerCard[0]);
			newPlayerCards[1] = newPlayerCard[0];
		}

		// update first hands
		this.playerHands[0].cards = newPlayerCards;
		this.playerHands[0].handState = HandState.PLAYING;

		// Vérifier le blackjack naturel
		this.playerHands.forEach((hand) => {
			if (getHandValue(hand.cards) === 21) {
				this.evaluateBlackjack(hand);
			}
		});
	}

	async dealerPlay() {
		const maxHandValue = Math.max(...this.playerHands.map((hand) => getHandValue(hand.cards)));

		while (getHandValue(this.dealerCards) < 17 || maxHandValue > getHandValue(this.dealerCards)) {
			const newDealerCard = await this.drawCards(1);
			this.dealerCards = [...this.dealerCards, ...newDealerCard];
		}

		this.playerHands.forEach((hand) => {
			this.evaluate(hand);
		});

		console.log('this.playerHands:', this.playerHands);

		this.gameState = GameState.END;
	}

	stand(hand: PlayerHand) {
		if (hand.handState === HandState.PLAYING) {
			hand.handState = HandState.STANDING;
		}

		const handStates = this.playerHands.map((hand) => hand.handState);

		if (!handStates.includes(HandState.PLAYING)) {
			this.dealerPlay();
		}
	}

	private async evaluateBlackjack(hand: PlayerHand) {
		// vérifier si le dealer a lui aussi un blackjack
		const newDealerCard = await this.drawCards(1);
		this.dealerCards = [...this.dealerCards, ...newDealerCard];
		if (getHandValue(this.dealerCards) === 21) {
			hand.handState = HandState.EQUAL;
			this.gameState = GameState.END;
			return;
		}

		// Blackjack paie 3:2
		this.playerBalance += hand.bet * 2.5;
		hand.handState = HandState.BLACKJACK;
		this.gameState = GameState.END;
	}

	private evaluate(hand: PlayerHand) {
		const playerValue = getHandValue(hand.cards);
		const dealerValue = getHandValue(this.dealerCards);

		if (dealerValue > 21) {
			// Dealer bust, joueur gagne
			this.playerBalance += hand.bet * 2;
			hand.handState = HandState.WIN;
			return;
		} else if (playerValue > dealerValue) {
			// Joueur gagne
			this.playerBalance += hand.bet * 2;
			hand.handState = HandState.WIN;
			return;
		} else if (playerValue === dealerValue) {
			// Égalité (push)
			this.playerBalance += hand.bet;
			hand.handState = HandState.EQUAL;
			return;
		}

		// Si aucune condition n'est remplie, le joueur perd (dealer gagne)
		hand.handState = HandState.LOST;
		return;
	}

	getTotalBet() {
		return this.playerHands.reduce((acc, hand) => acc + hand.bet, 0);
	}

	resetHands() {
		this.playerHands = [
			{
				cards: [],
				bet: 0,
				handState: HandState.INIT
			}
		];
		this.dealerCards = [];
		this.gameState = GameState.INIT;
	}

	canHit(hand: PlayerHand): boolean {
		return (
			getHandValue(hand.cards) < 21 &&
			hand.handState !== HandState.BLACKJACK &&
			hand.handState !== HandState.STANDING
		);
	}

	canStand(hand: PlayerHand): boolean {
		return (
			getHandValue(hand.cards) >= 17 &&
			hand.handState !== HandState.BLACKJACK &&
			hand.handState !== HandState.STANDING
		);
	}

	canBet(): boolean {
		return this.gameState === GameState.INIT && this.playerBalance > 0;
	}

	canSplit(): boolean {
		return (
			this.playerHands.length === 1 &&
			this.playerHands[0].cards.length === 2 &&
			this.playerHands[0].cards[0].value === this.playerHands[0].cards[1].value &&
			!this.isSplited
		);
	}

	canDoubleDown(hand: PlayerHand): boolean {
		return this.playerBalance >= hand.bet && hand.handState === HandState.PLAYING;
	}
}

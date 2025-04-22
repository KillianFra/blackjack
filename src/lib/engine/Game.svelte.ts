import { type Card } from '$lib/types/players';
import { getHandValue } from '$lib/utils';

export enum GameState {
	INIT,
	PLAYING,
	WIN,
	LOSE,
	BLACKJACK,
	EQUAL
}

export class Game {
	deckId: string = $state('');
	gameState: GameState = $state(GameState.INIT);
	playerCards: Card[] = $state([]);
	dealerCards: Card[] = $state([]);
	playerBalance: number = $state(1000);
	playerBet: number = $state(0);

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

	async bet(playerBet: number) {
		if (playerBet <= this.playerBalance) {
			this.playerBet = playerBet;
			this.playerBalance -= playerBet;
			this.gameState = GameState.PLAYING;
		}
	}

	async doubleDown() {
		if (this.playerBet === 0) return;
		this.playerBalance -= this.playerBet;
		this.playerBet *= 2;
		this.dealerPlay();
	}

	async deal() {
		if (this.playerBet === 0) return;

		this.gameState = GameState.PLAYING;
		const newDealerCard = await this.drawCards(1);

		this.dealerCards = [...this.dealerCards, ...newDealerCard];
		const newPlayerCards = await this.drawCards(2);

		this.playerCards = [...this.playerCards, ...newPlayerCards];

		// Vérifier le blackjack naturel
		if (getHandValue(this.playerCards) === 21) {
			this.evaluateBlackjack();
		}
	}

	async replay() {
		this.resetHand();
		this.gameState = GameState.INIT;
	}

	async hit() {
		const newPlayerCards = await this.drawCards(1);
		this.playerCards = [...this.playerCards, ...newPlayerCards];

		if (getHandValue(this.playerCards) > 21) {
			this.evaluate();
		}
	}

	async dealerPlay() {
		while (
			getHandValue(this.dealerCards) < 17 ||
			getHandValue(this.playerCards) > getHandValue(this.dealerCards)
		) {
			const newDealerCard = await this.drawCards(1);
			this.dealerCards = [...this.dealerCards, ...newDealerCard];
		}

		if (getHandValue(this.playerCards) < getHandValue(this.dealerCards)) {
			this.evaluate();
		}
	}

	private async evaluateBlackjack() {
		// vérifier si le dealer a lui aussi un blackjack
		const newDealerCard = await this.drawCards(1);
		this.dealerCards = [...this.dealerCards, ...newDealerCard];
		if (getHandValue(this.dealerCards) === 21) {
			this.gameState = GameState.EQUAL;
			return;
		}

		// Blackjack paie 3:2
		this.playerBalance += this.playerBet * 2.5;
		this.gameState = GameState.BLACKJACK;
	}

	private async evaluate() {
		console.log('player bet:', this.playerBet);

		const playerValue = getHandValue(this.playerCards);
		const dealerValue = getHandValue(this.dealerCards);

		if (playerValue > 21) {
			// Joueur perd (bust)
			this.gameState = GameState.LOSE;
		} else {
			if (dealerValue > 21) {
				// Dealer bust, joueur gagne
				this.playerBalance += this.playerBet * 2;
				console.log('player balance:', this.playerBet);
				this.gameState = GameState.WIN;
				return;
			} else if (playerValue > dealerValue) {
				// Joueur gagne
				this.playerBalance += this.playerBet * 2;
				console.log('player balance:', this.playerBet);
				this.gameState = GameState.WIN;
			} else if (playerValue === dealerValue) {
				// Égalité (push)
				this.playerBalance += this.playerBet;
				this.gameState = GameState.EQUAL;
			}
		}

		// Si aucune condition n'est remplie, le joueur perd (dealer gagne)
		this.gameState = GameState.LOSE;
		return;
	}

	resetHand() {
		this.playerCards = [];
		this.dealerCards = [];
		this.playerBet = 0;
		this.gameState = GameState.INIT;
	}

	canHit(): boolean {
		return getHandValue(this.playerCards) < 21 && this.gameState !== GameState.BLACKJACK;
	}

	canStand(): boolean {
		return this.playerCards.length >= 2 && this.gameState !== GameState.BLACKJACK;
	}

	canBet(): boolean {
		return this.gameState === GameState.INIT && this.playerBalance > 0;
	}

	canSplit(): boolean {
		return this.playerCards.length === 2 && this.playerCards[0].value === this.playerCards[1].value;
	}
}

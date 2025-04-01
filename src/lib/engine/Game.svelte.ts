import { type Card, GameState } from '$lib/types/players';

export class Game {
	deckId: string = $state('');
	gameState: GameState = GameState.INIT;
	playerCards: Card[] = $state([]);
	dealerCards: Card[] = $state([]);
	playerBalance: number = $state(1000);
	playerBet: number = $state(0);

	constructor(deckId: string) {
		console.log('deckId:', deckId);
		this.deckId = deckId;
	}

	static async init(fetch: typeof globalThis.fetch) {
		const deckId = await fetch('/api/deck').then((response) => response.json());
		console.log('deckId:', deckId);
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
		console.log('bet:', playerBet);
		this.gameState = GameState.BETTING;
	}

	async deal() {
		const newDealerCards = await this.drawCards(1);
		this.dealerCards = [...this.dealerCards, ...newDealerCards];
		const newPlayerCards = await this.drawCards(2);
		this.playerCards = [...this.playerCards, ...newPlayerCards];
	}

	async hit() {
		this.gameState = GameState.HIT;
	}

	stand() {
		this.gameState = GameState.STAND;
	}
}

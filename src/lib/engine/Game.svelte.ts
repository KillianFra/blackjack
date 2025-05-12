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

	async setGameBalance() {
		const { balance } = await fetch('/api/user/balance').then((response) => response.json());

		if (!balance) return;

		this.playerBalance = balance;
	}

	async setGame() {
		const game = await fetch('/api/game/load').then((response) => response.json());

		if (!game) return;

		this.deckId = game.deckId;
		this.playerHands = game.playerHands;
		this.dealerCards = game.dealerCards;
		this.isSplited = game.isSplited;
		this.gameState = game.gameState;
	}

	async saveState() {
		const gameData = {
			bet: this.getTotalBet(),
			deckId: this.deckId,
			playerHands: this.playerHands,
			dealerCards: this.dealerCards,
			gameState: this.gameState,
			playerBalance: this.playerBalance,
			isSplited: this.isSplited,
			isDone: this.gameState === GameState.END
		};

		const response = await fetch('/api/game/save', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(gameData)
		});

		if (!response.ok) {
			throw new Error('Failed to save game state');
		}

		return response.json();
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

	async doubleDown(hand: PlayerHand) {
		if (hand.bet === 0) return;
		this.setBet(hand.bet, hand);

		// draw one card
		const newPlayerCard = await this.drawCards(1);
		hand.cards = [...hand.cards, ...newPlayerCard];

		// close the hand
		hand.handState = HandState.STANDING;

		this.checkDealerTurn();
		await this.saveState();
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
			hand.handState = HandState.LOST;
			this.dealerPlay();
		}
		await this.saveState();
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

		// // force twice the same card
		// while (newPlayerCards[0].value !== newPlayerCards[1].value) {
		// 	const newPlayerCard = await this.drawCards(1);
		// 	console.log('newPlayerCard:', newPlayerCard[0]);
		// 	newPlayerCards[1] = newPlayerCard[0];
		// }

		// update first hands
		this.playerHands[0].cards = newPlayerCards;
		this.playerHands[0].handState = HandState.PLAYING;

		// Vérifier le blackjack naturel
		this.playerHands.forEach((hand) => {
			if (getHandValue(hand.cards) === 21) {
				this.evaluateBlackjack(hand);
			}
		});
		await this.saveState();
	}

	async dealerPlay() {
		// Get the maximum hand value among all player hands that haven't busted
		const maxHandValue = Math.max(
			...this.playerHands
				.filter((hand) => getHandValue(hand.cards) <= 21)
				.map((hand) => getHandValue(hand.cards))
		);

		// If all players busted, no need for dealer to draw
		if (maxHandValue > 21) {
			const newDealerCard = await this.drawCards(1);
			this.dealerCards = [...this.dealerCards, ...newDealerCard];

			this.playerHands.forEach((hand) => {
				hand.handState = HandState.LOST;
			});
			this.gameState = GameState.END;
			await this.saveState();
			return;
		}

		// Dealer draws until hand value is at least 17
		while (getHandValue(this.dealerCards) < 17) {
			const newDealerCard = await this.drawCards(1);
			this.dealerCards = [...this.dealerCards, ...newDealerCard];
		}

		// Evaluate each hand against the dealer's final hand
		this.playerHands.forEach((hand) => {
			this.evaluate(hand);
		});

		this.gameState = GameState.END;
		await this.saveState();
	}

	stand(hand: PlayerHand) {
		if (hand.handState === HandState.PLAYING) {
			hand.handState = HandState.STANDING;
		}

		this.checkDealerTurn();
	}

	private checkDealerTurn() {
		const handStates = this.playerHands.map((hand) => hand.handState);

		if (!handStates.includes(HandState.PLAYING)) {
			this.dealerPlay();
		}
	}

	private async evaluateBlackjack(hand: PlayerHand) {
		// vérifier si le dealer a lui
		const newDealerCard = await this.drawCards(1);
		this.dealerCards = [...this.dealerCards, ...newDealerCard];
		if (getHandValue(this.dealerCards) === 21) {
			hand.handState = HandState.EQUAL;
			this.gameState = GameState.END;
			await this.saveState();
			return;
		}

		// Blackjack paie 3:2
		this.playerBalance += hand.bet * 2.5;
		hand.handState = HandState.BLACKJACK;
		this.gameState = GameState.END;
		await this.saveState();
	}

	private async evaluate(hand: PlayerHand) {
		const playerValue = getHandValue(hand.cards);
		const dealerValue = getHandValue(this.dealerCards);

		// Player busts
		if (playerValue > 21) {
			hand.handState = HandState.LOST;
			return;
		}

		// Dealer busts or player has higher value
		if (dealerValue > 21 || playerValue > dealerValue) {
			this.playerBalance += hand.bet * 2;
			hand.handState = HandState.WIN;
			return;
		}

		// Equal values
		if (playerValue === dealerValue) {
			this.playerBalance += hand.bet;
			hand.handState = HandState.EQUAL;
			return;
		}

		// Dealer wins
		hand.handState = HandState.LOST;
		await this.saveState();
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
		if (this.isSplited) {
			return hand.cards.length === 1 && this.playerBalance >= hand.bet * 2;
		}

		return (
			this.playerBalance >= hand.bet &&
			hand.handState === HandState.PLAYING &&
			hand.cards.length === 2
		);
	}
}

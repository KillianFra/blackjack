export type Player = {
	name: string;
	hand: Card[];
	bet?: number;
	balance?: number;
};

export type Card = {
	value: string;
	suit: string;
	code: string;
	image: string;
};

export type Game = {
	deckId: string;
	bet: number;
	player: Player;
	dealer: Player;
};

export enum GameState {
	INIT,
	BETTING,
	DEALING,
	HIT,
	STAND,
	DEALER_TURN,
	EVALUATE,
	RESULT,
	GAME_OVER
}

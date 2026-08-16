export type Expense = {
	id: string;
	lenderUserName: string;
	title: string;
	longDescription: string | null;
	category: string;
	createdAt: Date;
	payments: ExpensePayement[];
};

export type ExpensePayement = {
	amountEuros: number;
	borrowerUserName: string;
};

export type Balance = {
	userName: string;
	amountEuros: number;
};

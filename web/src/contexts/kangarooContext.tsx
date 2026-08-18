import { createContext, createSignal, type JSX, useContext } from "solid-js";
import type { Balance, Expense } from "~/types";

type HomePayload = {
	balance: Balance[];
	expenses: Expense[];
};

type ExpensePayload = {
	expense: Expense;
	availableUsernames: string[];
	categories: string[];
};

type KangarooDataPayload = HomePayload | ExpensePayload;

type KangarooData = {
	consumeHomeData: () => HomePayload | null;
	consumeExpenseData: () => ExpensePayload | null;
};

const KangarooContext = createContext<KangarooData | undefined>();

export function useKangaroo() {
	const context = useContext(KangarooContext);

	if (!context) {
		throw new Error("useKangaroo must be used inside KangarooProvider");
	}

	return context;
}

export const KangarooProvider = (props: { children: JSX.Element }) => {
	const [consumed, setIsConsumed] = createSignal<boolean>(false);

	const kangarooDataRaw = JSON.parse(
		document.getElementById("kangaroo-data")?.textContent ?? "null",
	);
	const kangarooData =
		kangarooDataRaw && !kangarooDataRaw.errorMessage ? kangarooDataRaw : null;

	const consumeData = (): KangarooDataPayload | null => {
		const wasConsumed = consumed();
		setIsConsumed(true);
		return wasConsumed ? null : kangarooData;
	};

	return (
		<KangarooContext.Provider
			value={{
				consumeHomeData: () => {
					const data = consumeData();
					return data && "balance" in data
						? {
								...data,
								expenses: data.expenses.map((expense) => {
									expense.createdAt = new Date(expense.createdAt);
									return expense;
								}),
							}
						: null;
				},
				consumeExpenseData: () => {
					const data = consumeData();
					return data && "expense" in data
						? {
								...data,
								expense: {
									...data.expense,
									createdAt: new Date(data.expense.createdAt),
								},
							}
						: null;
				},
			}}
		>
			{props.children}
		</KangarooContext.Provider>
	);
};

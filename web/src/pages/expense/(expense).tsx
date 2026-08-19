import { useNavigate, useParams } from "@solidjs/router";
import {
	EuroIcon,
	FlameKindlingIcon,
	OrigamiIcon,
	PlusIcon,
	SproutIcon,
	Trash2Icon,
} from "lucide-solid";
import {
	type Component,
	createSignal,
	For,
	Match,
	onMount,
	Show,
	Switch,
} from "solid-js";
import { createStore } from "solid-js/store";
import { css } from "styled-system/css";
import { Container, HStack, VStack } from "styled-system/jsx";
import {
	Button,
	Card,
	Field,
	Heading,
	IconButton,
	NumberInput,
	Skeleton,
	Text,
} from "~/components";
import { useKangaroo } from "~/contexts/kangarooContext";
import { createBackendClient } from "~/hooks/createBackendClient";
import { createResourceWithInitialValue } from "~/hooks/createResourceWithInitialValue";
import type { Expense } from "~/types";
import { NotFound } from "../internal/notFound";
import { CustomSelector } from "./customSelector";

const EXPENSE_ID_PLACEHOLDER = "00000000-0000-0000-0000-000000000000";

type Params = {
	id: string;
};

type Store = {
	expense: Expense | null | undefined;
};

const spacer = css({ h: "1px", bgColor: "border.subtle", my: "6" });

export const ExpenseView: Component = () => {
	const { consumeExpenseData } = useKangaroo();
	const kangarooData = consumeExpenseData();
	const navigate = useNavigate();
	const params = useParams<Params>();
	const client = createBackendClient();

	const [availableUsernames, { refetch: refetchUsernames }, usernamesPromise] =
		createResourceWithInitialValue<string[]>(async () => {
			const { jsonPayload } = await client.get("/api/users");
			return jsonPayload;
		}, kangarooData?.availableUsernames);

	const [store, setStore] = createStore<Store>({ expense: undefined });
	const totalAmount = () =>
		Math.floor(
			(store.expense?.payments.reduce(
				(total, current) => total + current.amountEuros,
				0,
			) ?? 0) * 100,
		) / 100;
	const setTotalAmount = (amount: number) => {
		const payments = store.expense?.payments;
		if (!payments?.length) {
			return;
		}
		const amountEuros = Math.round((amount / payments.length) * 100) / 100;
		setStore("expense", "payments", () => true, "amountEuros", amountEuros);
	};
	const isNewExpense = () => store.expense?.id === EXPENSE_ID_PLACEHOLDER;
	const isExpenseValid = () => {
		const expense = store.expense;
		if (!expense) return false;
		if (
			!expense.title ||
			!expense.category ||
			!expense.lenderUserName ||
			expense.payments.length === 0
		)
			return false;
		if (
			expense.payments.filter((payment) => !payment.borrowerUserName).length !==
			0
		)
			return false;
		return true;
	};

	const [triedToSubmit, setTriedToSubmit] = createSignal(false);

	onMount(async () => {
		if (!params.id) {
			await usernamesPromise;
			const usernames =
				availableUsernames() ?? (await refetchUsernames()) ?? [];
			setStore("expense", {
				id: EXPENSE_ID_PLACEHOLDER,
				lenderUserName: "",
				title: "",
				longDescription: null,
				category: "",
				createdAt: new Date(),
				payments: usernames.map((username) => ({
					amountEuros: 0,
					borrowerUserName: username,
				})),
			});
			return;
		}

		if (kangarooData?.expense) {
			setStore("expense", {
				...kangarooData.expense,
				createdAt: new Date(kangarooData.expense.createdAt),
			});
			return;
		}

		const { jsonPayload, statusCode } = await client.get(
			`/api/expenses/${params.id}`,
		);
		setStore(
			"expense",
			statusCode === 404
				? null
				: {
						...jsonPayload,
						createdAt: new Date(jsonPayload.createdAt),
					},
		);
	});

	return (
		<Switch>
			<Match when={store.expense === undefined}>
				<Skeleton
					mt="25dvh"
					mx="auto"
					h="50dvh"
					w={{ base: "2xl", lgDown: "full" }}
				/>
			</Match>
			<Match when={store.expense === null}>
				<NotFound />
			</Match>
			<Match when={store.expense}>
				{(safeExpense) => (
					<Container p="12" h="100dvh" w={{ base: "2xl", lgDown: "full" }}>
						<Card.Root>
							<Card.Body p="12">
								<VStack gap="12">
									<HStack>
										<OrigamiIcon size="var(--sizes-6)" />
										<Heading textStyle="2xl">
											<Show when={isNewExpense()} fallback="Edit Expense">
												New Expense
											</Show>
										</Heading>
									</HStack>

									<VStack gap="6" alignItems="stretch" w="full">
										<Field.Root
											invalid={triedToSubmit() && !safeExpense().title}
										>
											<Field.Label>Title</Field.Label>
											<Field.Input
												onChange={(event) =>
													setStore("expense", "title", event.target.value)
												}
												value={safeExpense().title}
											/>
										</Field.Root>
										<Field.Root>
											<Field.Label>Description (Optional)</Field.Label>
											<Field.Input
												onChange={(event) =>
													setStore(
														"expense",
														"longDescription",
														event.target.value,
													)
												}
												value={safeExpense().longDescription ?? ""}
											/>
										</Field.Root>
										<CustomSelector
											invalid={triedToSubmit() && !safeExpense().category}
											getApiEndpoint="/api/categories"
											label="Category"
											availableValues={kangarooData?.categories}
											setValue={(category) =>
												setStore("expense", "category", category)
											}
											defaultValue={safeExpense().category}
										/>

										<div class={spacer} />

										<CustomSelector
											invalid={triedToSubmit() && !safeExpense().lenderUserName}
											getApiEndpoint="/api/users"
											label="Payer"
											availableValues={availableUsernames()}
											setValue={(username) =>
												setStore("expense", "lenderUserName", username)
											}
											defaultValue={safeExpense().lenderUserName}
										/>
										<Field.Root>
											<Field.Label>Total Amount</Field.Label>
											<HStack>
												<EuroIcon />
												<NumberInput
													flex="1"
													value={totalAmount().toString()}
													min={0}
													onValueChange={(event) =>
														setTotalAmount(
															event.value ? toSafeNumber(event.value) : 0,
														)
													}
													allowMouseWheel
												/>
											</HStack>
										</Field.Root>

										<div class={spacer} />

										<For each={safeExpense().payments}>
											{(payment, index) => (
												<VStack alignItems="stretch">
													<CustomSelector
														invalid={
															triedToSubmit() && !payment.borrowerUserName
														}
														getApiEndpoint="/api/users"
														label="Borrower"
														defaultValue={payment.borrowerUserName}
														availableValues={availableUsernames()}
														setValue={(username) =>
															setStore(
																"expense",
																"payments",
																index(),
																"borrowerUserName",
																username,
															)
														}
													/>
													<HStack>
														<EuroIcon />
														<NumberInput
															flex="1"
															value={payment.amountEuros.toString()}
															min={0}
															onValueChange={(event) =>
																setStore(
																	"expense",
																	"payments",
																	index(),
																	"amountEuros",
																	event.value ? toSafeNumber(event.value) : 0,
																)
															}
															allowMouseWheel
														/>
														<IconButton
															variant="subtle"
															onClick={() =>
																setStore("expense", "payments", (payments) =>
																	payments.filter(
																		(_, indexToRetain) =>
																			indexToRetain !== index(),
																	),
																)
															}
														>
															<Trash2Icon />
														</IconButton>
													</HStack>
												</VStack>
											)}
										</For>
										<Button
											border={
												triedToSubmit() && !safeExpense().payments.length
													? "1px solid var(--colors-fg-error)"
													: undefined
											}
											variant="subtle"
											onClick={() => {
												const amountEuros =
													Math.round(
														(totalAmount() /
															(safeExpense().payments.length + 1)) *
															100,
													) / 100;
												setStore("expense", "payments", (payments) => [
													...payments.map((payment) => ({
														...payment,
														amountEuros,
													})),
													{ amountEuros, borrowerUserName: "" },
												]);
											}}
										>
											Add Borrower
											<PlusIcon />
										</Button>

										<div class={spacer} />

										<Text textStyle="lg" mx="auto">
											{safeExpense().createdAt.toDateString()}
										</Text>
									</VStack>

									<HStack>
										<Button variant="subtle" onClick={() => navigate("/")}>
											Cancel
										</Button>
										<Button
											onClick={async () => {
												const action = isNewExpense()
													? client.post
													: client.put;

												if (!isExpenseValid()) {
													setTriedToSubmit(true);
													return;
												}

												const expense = {
													...safeExpense(),
													// overwritten by backend anyway
													createdAt: "1990-01-01T00:00:00.000000",
												};
												console.log(expense);

												await action("/api/expenses", expense);
												navigate("/");
											}}
										>
											<Show
												when={isNewExpense()}
												fallback={
													<>
														Modify Expense
														<FlameKindlingIcon />
													</>
												}
											>
												Create Expense
												<SproutIcon />
											</Show>
										</Button>
									</HStack>
								</VStack>
							</Card.Body>
						</Card.Root>
					</Container>
				)}
			</Match>
		</Switch>
	);
};

const toSafeNumber = (value: string): number => {
	const safeValue = Math.round(parseFloat(value.replace(",", ".")) * 100) / 100;
	return Number.isNaN(safeValue) ? 0 : safeValue;
};

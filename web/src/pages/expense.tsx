import { useNavigate, useParams } from "@solidjs/router";
import { FlameKindlingIcon, OrigamiIcon, SproutIcon } from "lucide-solid";
import { type Component, Show } from "solid-js";
import { Container, HStack, VStack } from "styled-system/jsx";
import { Button, Card, Heading, Skeleton } from "~/components";
import { useKangaroo } from "~/contexts/kangarooContext";
import { createBackendClient } from "~/hooks/createBackendClient";
import { createResourceWithInitialValue } from "~/hooks/createResourceWithInitialValue";
import type { Expense } from "~/types";

const EXPENSE_ID_PLACEHOLDER = "00000000-0000-0000-0000-00000000";

type Params = {
	id: string;
};

export const ExpenseView: Component = () => {
	const { consumeExpenseData } = useKangaroo();
	const kangarooData = consumeExpenseData();
	const navigate = useNavigate();
	const params = useParams<Params>();
	const client = createBackendClient();

	const [expense] = createResourceWithInitialValue<Expense>(
		async () => {
			const { jsonPayload } = await client.get(`/expenses/${params.id}`);
			return jsonPayload;
		},
		params.id
			? kangarooData?.expense
			: {
					id: EXPENSE_ID_PLACEHOLDER,
					lenderUserName: "",
					title: "",
					longDescription: null,
					category: "",
					createdAt: new Date(),
					payments: [],
				},
	);
	const isNewExpense = () => expense()?.id !== EXPENSE_ID_PLACEHOLDER;

	return (
		<Container p="12" h="100dvh" w={{ base: "2xl", lgDown: "full" }}>
			<Show when={expense()} fallback={<Skeleton />}>
				{(safeExpense) => (
					<Card.Root>
						<Card.Body p="12">
							<VStack gap="12">
								<HStack>
									<OrigamiIcon size="var(--sizes-6)" />
									<Heading textStyle="2xl">
										<Show when={isNewExpense()} fallback="New Expense">
											Edit Expense
										</Show>
									</Heading>
								</HStack>

								<HStack>
									<Button variant="subtle" onClick={() => navigate("/")}>
										Cancel
									</Button>
									<Button
										onClick={async () => {
											const action = isNewExpense() ? client.post : client.put;
											await action("/expenses", safeExpense());
											navigate("/");
										}}
									>
										<Show
											when={isNewExpense()}
											fallback={
												<>
													Create Expense
													<SproutIcon />
												</>
											}
										>
											Modify Expense
											<FlameKindlingIcon />
										</Show>
									</Button>
								</HStack>
							</VStack>
						</Card.Body>
					</Card.Root>
				)}
			</Show>
		</Container>
	);
};

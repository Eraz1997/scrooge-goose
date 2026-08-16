import { useNavigate } from "@solidjs/router";
import { PencilIcon } from "lucide-solid";
import { type Component, For } from "solid-js";
import { Badge, Button, Table } from "~/components";
import { createBackendClient } from "~/hooks/createBackendClient";
import { createResourceWithInitialValue } from "~/hooks/createResourceWithInitialValue";
import type { Expense } from "~/types";

type Props = {
	expenses: Expense[] | undefined;
};

export const ExpensesList: Component<Props> = (props) => {
	const client = createBackendClient();
	const navigate = useNavigate();

	const [expenses] = createResourceWithInitialValue<Expense[]>(async () => {
		const { jsonPayload } = await client.get("/expenses");
		return jsonPayload;
	}, props.expenses);

	return (
		<Table.Root flexGrow="1">
			<Table.Head>
				<Table.Row>
					<Table.Header>Who paid?</Table.Header>
					<Table.Header>Title</Table.Header>
					<Table.Header>Amount</Table.Header>
					<Table.Header>Category</Table.Header>
					<Table.Header>Date</Table.Header>
					<Table.Header />
				</Table.Row>
			</Table.Head>
			<Table.Body>
				<For each={expenses()}>
					{(expense) => (
						<Table.Row>
							<Table.Cell fontWeight="medium">
								{expense.lenderUserName}
							</Table.Cell>
							<Table.Cell>{expense.title}</Table.Cell>
							<Table.Cell>{expense.category}</Table.Cell>
							<Table.Cell>
								<Badge>
									{expense.payments.reduce(
										(total, payment) => total + payment.amountEuros,
										0,
									)}
								</Badge>
							</Table.Cell>
							<Table.Cell>{expense.createdAt.toDateString()}</Table.Cell>
							<Table.Cell width="24" textAlign="end">
								<Button
									size="xs"
									onClick={() => navigate(`expenses/${expense.id}`)}
								>
									<PencilIcon />
								</Button>
							</Table.Cell>
						</Table.Row>
					)}
				</For>
			</Table.Body>
		</Table.Root>
	);
};

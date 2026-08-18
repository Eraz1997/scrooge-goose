import { CheckIcon } from "lucide-solid";
import { type Component, For } from "solid-js";
import { Box, HStack } from "styled-system/jsx";
import { Avatar, Card, Text } from "~/components";
import { createBackendClient } from "~/hooks/createBackendClient";
import { createResourceWithInitialValue } from "~/hooks/createResourceWithInitialValue";
import type { Balance } from "~/types";

type Props = {
	balance: Balance[] | undefined;
};

export const BalanceView: Component<Props> = (props) => {
	const client = createBackendClient();

	const [balance] = createResourceWithInitialValue<Balance[]>(async () => {
		const { jsonPayload } = await client.get("/api/balance");
		const balance = jsonPayload as Balance[];
		balance.sort((a, b) => {
			if (a.userName === b.userName) return 0;
			return a.userName > b.userName ? 1 : -1;
		});
		return balance;
	}, props.balance);

	return (
		<Card.Root w="full" alignItems="center">
			<Card.Body p="6">
				<HStack gap="8">
					<For
						each={balance()}
						fallback={
							<>
								<Avatar.Root size="2xl">
									<Avatar.Fallback bgColor="indigo.5" color="indigo.11">
										<CheckIcon />
									</Avatar.Fallback>
								</Avatar.Root>
								<Text textStyle="2xl">All set!</Text>
							</>
						}
					>
						{(balanceItem) => (
							<HStack gap="4">
								<Avatar.Root size="lg">
									<Avatar.Fallback
										bg={`${pickPalette(balanceItem.userName)}.5`}
										color={`${pickPalette(balanceItem.userName)}.11`}
									>
										{toInitials(balanceItem.userName)}
									</Avatar.Fallback>
								</Avatar.Root>
								<Box>
									<Text textStyle="lg">{balanceItem.userName}</Text>
									<Text textStyle="md">
										{balanceItem.amountEuros.toFixed(2)} €
									</Text>
								</Box>
							</HStack>
						)}
					</For>
				</HStack>
			</Card.Body>
		</Card.Root>
	);
};

const toInitials = (username: string) => {
	if (!username) return ":)";
	if (username.length === 1) return username[0].toUpperCase();
	return `${username[0]}${username[1]}`.toUpperCase();
};

const colorPalette = [
	"red",
	"blue",
	"green",
	"yellow",
	"purple",
	"orange",
] as const;

const pickPalette = (username: string) => {
	const index = username.charCodeAt(0) % colorPalette.length;
	return colorPalette[index];
};

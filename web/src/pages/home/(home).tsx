import { useNavigate } from "@solidjs/router";
import { OrigamiIcon, PlusIcon } from "lucide-solid";
import type { Component } from "solid-js";
import { Container, Float, HStack, VStack } from "styled-system/jsx";
import { Heading, IconButton } from "~/components";
import { useKangaroo } from "~/contexts/kangarooContext";
import { BalanceView } from "./balance";
import { ExpensesList } from "./expensesList";

export const Home: Component = () => {
	const { consumeHomeData } = useKangaroo();
	const kangarooData = consumeHomeData();
	const navigate = useNavigate();

	return (
		<Container p="12" h="100dvh" w={{ base: "2xl", lgDown: "full" }}>
			<VStack gap="12">
				<HStack>
					<OrigamiIcon size="var(--sizes-12)" />
					<Heading textStyle="4xl">Scooge Goose</Heading>
				</HStack>
				<BalanceView balance={kangarooData?.balance} />
				<ExpensesList expenses={kangarooData?.expenses} />
			</VStack>
			<Float placement="bottom-end" offset="12">
				<IconButton size="xl" onClick={() => navigate("/expenses/new")}>
					<PlusIcon />
				</IconButton>
			</Float>
		</Container>
	);
};

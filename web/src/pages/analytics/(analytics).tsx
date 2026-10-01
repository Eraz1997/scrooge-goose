import { useNavigate } from "@solidjs/router";
import { BirdhouseIcon, ChartSplineIcon } from "lucide-solid";
import { type Component, Show } from "solid-js";
import { createStore } from "solid-js/store";
import { Box, Container, Float, HStack, VStack } from "styled-system/jsx";
import { Card, Heading, IconButton, Skeleton } from "~/components";
import { useKangaroo } from "~/contexts/kangarooContext";
import { createBackendClient } from "~/hooks/createBackendClient";
import { createResourceWithInitialValue } from "~/hooks/createResourceWithInitialValue";
import type { Expense } from "~/types";
import { AnalyticFilters } from "./analyticFilters";
import { AnalyticsChart } from "./chart";

const TODAY = new Date();
const ONE_MONTH_AGO = new Date(TODAY);
ONE_MONTH_AGO.setMonth(ONE_MONTH_AGO.getMonth() - 1);

type Filters = {
	from: {
		day: number;
		month: number;
		year: number;
	};
	to: {
		day: number;
		month: number;
		year: number;
	};
	categories: string[];
	users: string[];
	interval: "day" | "week" | "month" | "year";
};

export const Analytics: Component = () => {
	const { consumeAnalyticsData } = useKangaroo();
	const kangarooData = consumeAnalyticsData();
	const navigate = useNavigate();
	const client = createBackendClient();

	const [expenses] = createResourceWithInitialValue<Expense[]>(async () => {
		const { jsonPayload } = await client.get("/api/expenses");
		const expenses: Expense[] = jsonPayload;
		expenses.forEach((expense) => {
			expense.createdAt = new Date(expense.createdAt);
		});
		return expenses;
	}, kangarooData?.expenses);

	const [availableUsernames] = createResourceWithInitialValue<string[]>(
		async () => {
			const { jsonPayload } = await client.get("/api/users");
			return jsonPayload;
		},
		kangarooData?.usernames,
	);

	const [availableCategories] = createResourceWithInitialValue<string[]>(
		async () => {
			const { jsonPayload } = await client.get("/api/categories");
			return jsonPayload;
		},
		kangarooData?.categories,
	);

	const [filters, setFilters] = createStore<Filters>({
		from: {
			day: ONE_MONTH_AGO.getDate(),
			month: ONE_MONTH_AGO.getMonth() + 1,
			year: ONE_MONTH_AGO.getFullYear(),
		},
		to: {
			day: TODAY.getDate(),
			month: TODAY.getMonth() + 1,
			year: TODAY.getFullYear(),
		},
		categories: [],
		users: [],
		interval: "day",
	});

	return (
		<>
			<Show
				when={
					expenses.loading ||
					availableUsernames.loading ||
					availableCategories.loading
				}
			>
				<Skeleton
					mt="25dvh"
					mx="auto"
					h="50dvh"
					w={{ base: "2xl", lgDown: "full" }}
				/>
			</Show>
			<Show when={expenses()}>
				{(safeExpenses) => (
					<Show when={availableUsernames()}>
						{(safeAvailableUsernames) => (
							<Show when={availableCategories()}>
								{(safeAvailableCategories) => (
									<Container
										p="12"
										h="100dvh"
										w={{ base: "2xl", lgDown: "full" }}
									>
										<VStack gap="12" h="full">
											<HStack>
												<ChartSplineIcon size="var(--sizes-6)" />
												<Heading textStyle="2xl">Analytics</Heading>
											</HStack>

											<Card.Root w="full" alignItems="stretch" flexShrink="0">
												<Card.Body p="6">
													<AnalyticFilters
														from={{
															day: filters.from.day,
															month: filters.from.month,
															year: filters.from.year,
														}}
														to={{
															day: filters.to.day,
															month: filters.to.month,
															year: filters.to.year,
														}}
														availableCategories={safeAvailableCategories()}
														categories={filters.categories}
														availableUsers={safeAvailableUsernames()}
														users={filters.users}
														interval={filters.interval}
														setCategories={(categories) => {
															setFilters("categories", categories);
														}}
														setUsers={(users) => {
															setFilters("users", users);
														}}
														setInterval={(interval) => {
															setFilters("interval", interval);
														}}
														setFromDay={(day) => {
															setFilters("from", "day", day);
														}}
														setFromMonth={(month) => {
															setFilters("from", "month", month);
														}}
														setFromYear={(year) => {
															setFilters("from", "year", year);
														}}
														setToDay={(day) => {
															setFilters("to", "day", day);
														}}
														setToMonth={(month) => {
															setFilters("to", "month", month);
														}}
														setToYear={(year) => {
															setFilters("to", "year", year);
														}}
													/>
												</Card.Body>
											</Card.Root>

											<Box
												w="full"
												px="4"
												overflowX="scroll"
												h="full"
												minH="md"
											>
												<AnalyticsChart
													expenses={safeExpenses()}
													from={{
														day: filters.from.day,
														month: filters.from.month,
														year: filters.from.year,
													}}
													to={{
														day: filters.to.day,
														month: filters.to.month,
														year: filters.to.year,
													}}
													categories={
														filters.categories.length > 0
															? filters.categories
															: safeAvailableCategories()
													}
													users={
														filters.users.length > 0
															? filters.users
															: safeAvailableUsernames()
													}
													interval={filters.interval}
												/>
											</Box>
										</VStack>
										<Float placement="bottom-end" offset="12">
											<IconButton size="xl" onClick={() => navigate("/")}>
												<BirdhouseIcon />
											</IconButton>
										</Float>
									</Container>
								)}
							</Show>
						)}
					</Show>
				)}
			</Show>
		</>
	);
};

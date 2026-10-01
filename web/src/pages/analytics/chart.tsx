import {
	add,
	startOfDay,
	startOfMonth,
	startOfWeek,
	startOfYear,
} from "date-fns";
import {
	Axis,
	AxisCursor,
	AxisGrid,
	AxisLabel,
	AxisTooltip,
	Bar,
	Chart,
} from "solid-charts";
import { type Component, For, Show } from "solid-js";
import { css } from "styled-system/css";
import { Box, HStack } from "styled-system/jsx";
import { Text } from "~/components";
import type { Expense } from "~/types";

type Props = {
	expenses: Expense[];
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

export const AnalyticsChart: Component<Props> = (props) => {
	const data = () => {
		const chartData = [];
		const chartIndex: Record<string, Record<string, string | number>> = {};

		let day = new Date(props.from.year, props.from.month - 1, props.from.day);
		const endDay = new Date(props.to.year, props.to.month - 1, props.to.day);

		while (startOfDay(day) <= startOfDay(endDay)) {
			let dayKey = startOfDay(day).toDateString();
			if (props.interval === "day") {
				dayKey = startOfDay(day).toDateString();
				day = add(day, { days: 1 });
			} else if (props.interval === "week") {
				dayKey = startOfWeek(day).toDateString();
				day = add(day, { weeks: 1 });
			} else if (props.interval === "month") {
				dayKey = startOfMonth(day).toDateString();
				day = add(day, { months: 1 });
			} else if (props.interval === "year") {
				dayKey = startOfYear(day).toDateString();
				day = add(day, { years: 1 });
			}

			const dayItem: Record<string, string | number> = { xAxis: dayKey };
			props.categories.forEach((category) => {
				dayItem[category] = 0;
			});
			chartData.push(dayItem);
			chartIndex[dayKey] = dayItem;
		}

		props.expenses
			.filter((expense) => props.categories.includes(expense.category))
			.forEach((expense) => {
				let dayKey = startOfDay(expense.createdAt).toDateString();
				if (props.interval === "day") {
					dayKey = startOfDay(expense.createdAt).toDateString();
				} else if (props.interval === "week") {
					dayKey = startOfWeek(expense.createdAt).toDateString();
				} else if (props.interval === "month") {
					dayKey = startOfMonth(expense.createdAt).toDateString();
				} else if (props.interval === "year") {
					dayKey = startOfYear(expense.createdAt).toDateString();
				}

				if (chartIndex[dayKey]) {
					(chartIndex[dayKey][expense.category] as number) += expense.payments
						.filter((payment) => props.users.includes(payment.borrowerUserName))
						.reduce((total, payment) => total + payment.amountEuros, 0);
				}
			});

		return chartData;
	};

	return (
		<Show when={data().length > 0}>
			<Chart data={data()}>
				<Axis axis="y" position="left">
					<AxisLabel format={(value) => `€ ${value}`} />
					<AxisGrid class={css({ opacity: 0.2 })} />
				</Axis>
				<For each={props.categories}>
					{(category) => (
						<Bar
							dataKey={category}
							stackId="singleStack"
							fill={categoryToColour(category)}
						/>
					)}
				</For>
				<Axis axis="x" position="bottom" dataKey="xAxis">
					<AxisLabel />
					<AxisCursor
						stroke-dasharray="10,10"
						stroke-width={2}
						class={css({ color: "indigo.text", transition: "opacity" })}
					/>
					<AxisTooltip
						class={css({
							borderRadius: "md",
							overflow: "scroll",
							pointerEvents: "visible !important",
							maxH: "48",
							boxShadow: "lg",
							borderWidth: "1px",
							borderStyle: "solid",
							borderColor: "border.subtle",
							backgroundColor: "bg.subtle",
							padding: "2",
						})}
					>
						{(itemProps) => (
							<>
								<Box
									borderBottomWidth="1px"
									borderBottomStyle="solid"
									borderBottomColor="border.muted"
									pb="2"
									mb="2"
									overflowY="visible"
								>
									<Text textStyle="lg">{itemProps.data?.xAxis}</Text>
								</Box>
								<For each={props.categories}>
									{(category) => (
										<HStack alignItems="center">
											<Box
												borderRadius="full"
												w="2"
												h="2"
												style={`background-color: ${categoryToColour(category)}`}
											/>
											<Text flexGrow="1" marginLeft="1" textStyle="lg">
												{category}
											</Text>
											<Text textStyle="lg">
												{`€ ${itemProps.data?.[category]}`}
											</Text>
										</HStack>
									)}
								</For>
							</>
						)}
					</AxisTooltip>
				</Axis>
			</Chart>
		</Show>
	);
};

const categoryToColour = (category: string): string => {
	const hash =
		(category
			.split("")
			.reduce(
				(hash, char, index) => hash + char.charCodeAt(0) * (index + 1) ** 8,
				0,
			) %
			12) +
		1;
	return `var(--colors-indigo-${hash})`;
};

import { createListCollection } from "@ark-ui/solid";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-solid";
import { type Component, For } from "solid-js";
import { Portal } from "solid-js/web";
import { HStack, VStack } from "styled-system/jsx";
import { Select, Text } from "~/components";
import { NumberedSelectBox } from "./numberedSelectBox";
import { StringSelectBox } from "./stringSelectBox";

const CURRENT_YEAR = new Date().getFullYear();

type FilterInterval = "day" | "week" | "month" | "year";

type Props = {
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
	availableCategories: string[];
	categories: string[];
	availableUsers: string[];
	users: string[];
	interval: FilterInterval;
	setCategories: (categories: string[]) => void;
	setUsers: (users: string[]) => void;
	setFromDay: (day: number) => void;
	setFromMonth: (month: number) => void;
	setFromYear: (year: number) => void;
	setToDay: (day: number) => void;
	setToMonth: (month: number) => void;
	setToYear: (year: number) => void;
	setInterval: (interval: FilterInterval) => void;
};

export const AnalyticFilters: Component<Props> = (props) => {
	const intervalsCollection = () =>
		createListCollection<string>({
			items: ["day", "week", "month", "year"],
		});

	return (
		<VStack w="full" alignItems="stretch">
			<HStack>
				<Text textStyle="lg">From: </Text>
				<NumberedSelectBox
					from={1}
					to={31}
					value={props.from.day}
					setValue={props.setFromDay}
				/>
				<NumberedSelectBox
					from={1}
					to={12}
					value={props.from.month}
					setValue={props.setFromMonth}
				/>
				<NumberedSelectBox
					from={1980}
					to={CURRENT_YEAR}
					value={props.from.year}
					setValue={props.setFromYear}
				/>
			</HStack>
			<HStack>
				<Text textStyle="lg">To: </Text>
				<NumberedSelectBox
					from={1}
					to={31}
					value={props.to.day}
					setValue={props.setToDay}
				/>
				<NumberedSelectBox
					from={1}
					to={12}
					value={props.to.month}
					setValue={props.setToMonth}
				/>
				<NumberedSelectBox
					from={1980}
					to={CURRENT_YEAR}
					value={props.to.year}
					setValue={props.setToYear}
				/>
			</HStack>
			<HStack>
				<Text textStyle="lg">Interval: </Text>
				<Select.Root
					positioning={{ sameWidth: true }}
					collection={intervalsCollection()}
					value={[props.interval]}
					onValueChange={(event: { items: string[] }) => {
						props.setInterval(event.items[0] as FilterInterval);
					}}
				>
					<Select.Control>
						<Select.Trigger>
							<Select.ValueText />
							<ChevronsUpDownIcon />
						</Select.Trigger>
					</Select.Control>
					<Portal>
						<Select.Positioner>
							<Select.Content maxH="96" overflowY="scroll">
								<For each={intervalsCollection().items}>
									{(item) => (
										<Select.Item item={item}>
											<Select.ItemText>{item}</Select.ItemText>
											<Select.ItemIndicator>
												<CheckIcon />
											</Select.ItemIndicator>
										</Select.Item>
									)}
								</For>
							</Select.Content>
						</Select.Positioner>
					</Portal>
				</Select.Root>
			</HStack>
			<HStack>
				<Text textStyle="lg">Categories: </Text>
				<StringSelectBox
					avaliableItems={props.availableCategories}
					selectedItems={props.categories}
					setValues={props.setCategories}
				/>
			</HStack>
			<HStack>
				<Text textStyle="lg">Users: </Text>
				<StringSelectBox
					avaliableItems={props.availableUsers}
					selectedItems={props.users}
					setValues={props.setUsers}
				/>
			</HStack>
		</VStack>
	);
};

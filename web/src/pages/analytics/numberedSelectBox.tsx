import { createListCollection } from "@ark-ui/solid";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-solid";
import { type Component, For } from "solid-js";
import { Portal } from "solid-js/web";
import { Select } from "~/components";

type Props = {
	from: number;
	to: number;
	value: number;
	setValue: (value: number) => void;
};

export const NumberedSelectBox: Component<Props> = (props) => {
	const collection = createListCollection<number>({
		items: createRangeArray(props.from, props.to),
		itemToValue: (item) => item.toString(),
		itemToString: (item) => item.toString(),
	});

	return (
		<Select.Root
			positioning={{ sameWidth: true }}
			collection={collection}
			value={[props.value.toString()]}
			onValueChange={(event: { items: number[] }) => {
				props.setValue(event.items[0]);
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
						<For each={collection.items}>
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
	);
};

const createRangeArray = (from: number, to: number): number[] =>
	[...Array(to - from + 1).keys()].map((item) => item + from);

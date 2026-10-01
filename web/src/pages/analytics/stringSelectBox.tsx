import { createListCollection } from "@ark-ui/solid";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-solid";
import { type Component, For } from "solid-js";
import { Portal } from "solid-js/web";
import { Select } from "~/components";

type Props = {
	avaliableItems: string[];
	selectedItems: string[];
	setValues: (values: string[]) => void;
};

export const StringSelectBox: Component<Props> = (props) => {
	const collection = () =>
		createListCollection<string>({
			items: props.avaliableItems,
		});

	return (
		<Select.Root
			multiple={true}
			positioning={{ sameWidth: false }}
			collection={collection()}
			value={props.selectedItems}
			onValueChange={(event: { items: string[] }) => {
				props.setValues(event.items);
			}}
		>
			<Select.Control>
				<Select.Trigger>
					<Select.ValueText
						maxW="24"
						placeholder="all"
						overflow="hidden"
						textOverflow="ellipsis"
						whiteSpace="nowrap"
					/>
					<ChevronsUpDownIcon />
				</Select.Trigger>
			</Select.Control>
			<Portal>
				<Select.Positioner>
					<Select.Content maxH="96" overflowY="scroll">
						<For each={collection().items}>
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

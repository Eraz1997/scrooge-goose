import { createListCollection } from "@ark-ui/solid";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-solid";
import { type Component, createSignal, For, Match, Switch } from "solid-js";
import { HStack } from "styled-system/jsx";
import { Checkbox, Field, Select } from "~/components";
import { createBackendClient } from "~/hooks/createBackendClient";
import { createResourceWithInitialValue } from "~/hooks/createResourceWithInitialValue";

type Props = {
	label: string;
	availableValues: string[] | undefined;
	defaultValue?: string | undefined;
	setValue: (value: string) => void;
	getApiEndpoint: string;
	invalid?: boolean;
};

export const CustomSelector: Component<Props> = (props) => {
	const client = createBackendClient();

	const [customValue, setCustomValue] = createSignal<string>("");
	const [isUsingCustomValue, setIsUsingCustomValue] =
		createSignal<boolean>(false);
	const [selectedValue, setSelectedValue] = createSignal<string | undefined>(
		props.defaultValue,
	);
	const [availableValues] = createResourceWithInitialValue<string[]>(
		async () => {
			const { jsonPayload } = await client.get(props.getApiEndpoint);
			return jsonPayload;
		},
		props.availableValues,
	);
	const collection = () =>
		createListCollection<string>({
			items: availableValues() ?? [],
		});

	return (
		<HStack gap="6">
			<Field.Root flex="1" invalid={props.invalid}>
				<Field.Label>{props.label}</Field.Label>
				<Switch>
					<Match when={isUsingCustomValue()}>
						<Field.Input
							onChange={(event) => {
								setCustomValue(event.target.value);
								props.setValue(event.target.value);
							}}
							placeholder={`Enter Custom ${props.label}`}
						/>
					</Match>
					<Match when={!isUsingCustomValue()}>
						<Select.Root
							positioning={{ sameWidth: true }}
							collection={collection()}
							value={[selectedValue() ?? ""]}
							onValueChange={(event: { items: string[] }) => {
								setSelectedValue(event.items[0]);
								props.setValue(event.items[0]);
							}}
						>
							<Select.Control>
								<Select.Trigger
									border={
										props.invalid
											? "1px solid var(--colors-fg-error)"
											: undefined
									}
								>
									<Select.ValueText placeholder={`Select ${props.label}`} />
									<ChevronsUpDownIcon />
								</Select.Trigger>
							</Select.Control>
							<Select.Positioner>
								<Select.Content>
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
						</Select.Root>
					</Match>
				</Switch>
			</Field.Root>
			<Checkbox
				checked={isUsingCustomValue()}
				onCheckedChange={(event) => {
					setIsUsingCustomValue(event.checked === true);
					if (event.checked === true) {
						props.setValue(customValue());
					} else {
						props.setValue(selectedValue() ?? "");
					}
				}}
				mt="6"
			>
				Custom
			</Checkbox>
		</HStack>
	);
};

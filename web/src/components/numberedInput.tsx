import { NumberInput as ArkNumberInput, type Assign } from "@ark-ui/solid";
import type { ComponentProps } from "solid-js";
import { children, Show } from "solid-js";
import {
	type NumberInputVariantProps,
	numberInput,
} from "styled-system/recipes";
import type { HTMLStyledProps } from "styled-system/types";
import { createStyleContext } from "./utils/create-style-context";

const { withProvider, withContext } = createStyleContext(numberInput);

type RootProps = ComponentProps<typeof Root>;
const Root = withProvider<
	Assign<
		Assign<HTMLStyledProps<"div">, ArkNumberInput.RootBaseProps>,
		NumberInputVariantProps
	>
>(ArkNumberInput.Root, "root");

const Control = withContext<
	Assign<HTMLStyledProps<"div">, ArkNumberInput.ControlBaseProps>
>(ArkNumberInput.Control, "control");

const DecrementTrigger = withContext<
	Assign<HTMLStyledProps<"button">, ArkNumberInput.DecrementTriggerBaseProps>
>(ArkNumberInput.DecrementTrigger, "decrementTrigger");

const IncrementTrigger = withContext<
	Assign<HTMLStyledProps<"button">, ArkNumberInput.IncrementTriggerBaseProps>
>(ArkNumberInput.IncrementTrigger, "incrementTrigger");

const Input = withContext<
	Assign<HTMLStyledProps<"input">, ArkNumberInput.InputBaseProps>
>(ArkNumberInput.Input, "input");

const Label = withContext<
	Assign<HTMLStyledProps<"label">, ArkNumberInput.LabelBaseProps>
>(ArkNumberInput.Label, "label");

const _Scrubber = withContext<
	Assign<HTMLStyledProps<"div">, ArkNumberInput.ScrubberBaseProps>
>(ArkNumberInput.Scrubber, "scrubber");

const _ValueText = withContext<
	Assign<HTMLStyledProps<"span">, ArkNumberInput.ValueTextProps>
>(ArkNumberInput.ValueText, "valueText");

export interface NumberInputProps extends RootProps {}

export const NumberInput = (props: NumberInputProps) => {
	const getChildren = children(() => props.children);

	return (
		<Root {...props}>
			<Show when={getChildren()}>
				<Label>{getChildren()}</Label>
			</Show>
			<Control>
				<Input />
				<IncrementTrigger>
					<ChevronUpIcon />
				</IncrementTrigger>
				<DecrementTrigger>
					<ChevronDownIcon />
				</DecrementTrigger>
			</Control>
		</Root>
	);
};

const ChevronUpIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
		<title>Chevron Up Icon</title>
		<path
			fill="none"
			stroke="currentColor"
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
			d="m18 15l-6-6l-6 6"
		/>
	</svg>
);

const ChevronDownIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
		<title>Chevron Down Icon</title>
		<path
			fill="none"
			stroke="currentColor"
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
			d="m6 9l6 6l6-6"
		/>
	</svg>
);

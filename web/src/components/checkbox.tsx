import {
	Checkbox as ArkCheckbox,
	type Assign,
	CheckboxHiddenInput,
} from "@ark-ui/solid";
import type { ComponentProps } from "solid-js";
import { children, Show } from "solid-js";
import { type CheckboxVariantProps, checkbox } from "styled-system/recipes";
import type { HTMLStyledProps } from "styled-system/types";
import { createStyleContext } from "./utils/create-style-context";

const { withProvider, withContext } = createStyleContext(checkbox);

type RootProps = ComponentProps<typeof Root>;
const Root = withProvider<
	Assign<
		Assign<HTMLStyledProps<"label">, ArkCheckbox.RootBaseProps>,
		CheckboxVariantProps
	>
>(ArkCheckbox.Root, "root");

const Control = withContext<
	Assign<HTMLStyledProps<"div">, ArkCheckbox.ControlBaseProps>
>(ArkCheckbox.Control, "control");

const _Group = withContext<
	Assign<HTMLStyledProps<"div">, ArkCheckbox.GroupBaseProps>
>(ArkCheckbox.Group, "group");

const Indicator = withContext<
	Assign<HTMLStyledProps<"div">, ArkCheckbox.IndicatorBaseProps>
>(ArkCheckbox.Indicator, "indicator");

const Label = withContext<
	Assign<HTMLStyledProps<"span">, ArkCheckbox.LabelBaseProps>
>(ArkCheckbox.Label, "label");

export interface CheckboxProps extends RootProps {}

export const Checkbox = (props: CheckboxProps) => {
	const getChildren = children(() => props.children);

	return (
		<Root {...props}>
			<Control>
				<Indicator>
					<CheckIcon />
				</Indicator>
				<Indicator indeterminate>
					<MinusIcon />
				</Indicator>
			</Control>
			<Show when={getChildren()}>
				<Label>{getChildren()}</Label>
			</Show>
			<CheckboxHiddenInput />
		</Root>
	);
};

const CheckIcon = () => (
	<svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
		<title>Check Icon</title>
		<path
			d="M11.6666 3.5L5.24992 9.91667L2.33325 7"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	</svg>
);

const MinusIcon = () => (
	<svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
		<title>Minus Icon</title>
		<path
			d="M2.91675 7H11.0834"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	</svg>
);

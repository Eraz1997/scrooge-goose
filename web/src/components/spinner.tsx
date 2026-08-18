import { ark } from "@ark-ui/solid";
import type { ComponentProps } from "solid-js";
import { mergeProps, splitProps } from "solid-js";
import { styled } from "styled-system/jsx";
import { spinner } from "styled-system/recipes";

type StyledSpinnerProps = ComponentProps<typeof StyledSpinner>;
const StyledSpinner = styled(ark.div, spinner);

export interface SpinnerProps extends StyledSpinnerProps {
	/**
	 * For accessibility, it is important to add a fallback loading text.
	 * This text will be visible to screen readers.
	 * @default "Loading..."
	 */
	label?: string;
}

export const Spinner = (props: SpinnerProps) => {
	const [_localProps, rootProps] = splitProps(props, ["label"]);
	const localProps = mergeProps({ label: "Loading..." }, _localProps);

	return (
		<StyledSpinner
			borderBottomColor="transparent"
			borderLeftColor="transparent"
			{...rootProps}
		>
			<styled.span srOnly>{localProps.label}</styled.span>
		</StyledSpinner>
	);
};

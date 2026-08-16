import { useNavigate } from "@solidjs/router";
import { OrigamiIcon } from "lucide-solid";
import type { Component } from "solid-js";
import { css } from "styled-system/css";
import { VStack } from "styled-system/jsx";
import { Button, Card, Heading, Text } from "~/components";
import { Container } from "../../../styled-system/jsx/container";

const iconClass = css({
	width: "{36}",
	height: "{36}",
	strokeWidth: "{1}",
});

export const NotFound: Component = () => {
	const navigate = useNavigate();

	return (
		<Container p="12" maxW="md">
			<Card.Root>
				<Card.Body>
					<VStack gap="16">
						<VStack gap="0">
							<Heading size="7xl">404</Heading>
							<Text size="xl">Not Found</Text>
						</VStack>
						<VStack gap="4">
							<OrigamiIcon class={iconClass} />
							<Text size="md">
								We couldn't find what you were looking for, but the goose can
								bring you back home.
							</Text>
							<Button onClick={() => navigate("/")}>Go Home</Button>
						</VStack>
					</VStack>
				</Card.Body>
			</Card.Root>
		</Container>
	);
};

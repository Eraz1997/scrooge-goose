import { Container } from "../../../styled-system/jsx/container";
import { Squirrel } from "lucide-solid";
import { Component } from "solid-js";
import { Card } from "src/components/ui/card";
import { Heading } from "src/components/ui/heading";
import { Text } from "src/components/ui/text";
import { css } from "styled-system/css";
import { VStack } from "styled-system/jsx";

const iconClass = css({
  width: "{36}",
  height: "{36}",
  strokeWidth: "{1}",
});

export const NotFound: Component = () => {
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
              <Squirrel class={iconClass} />
              <Text size="md">
                We couldn't find what you were looking for, but we just found a
                cute squirrel.
              </Text>
            </VStack>
          </VStack>
        </Card.Body>
      </Card.Root>
    </Container>
  );
};

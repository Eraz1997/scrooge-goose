import { createBackendClient } from "./hooks/createBackendClient";
import { Home } from "./pages/home";
import { NotFound } from "./pages/internal/notFound";
import { Route, Router } from "@solidjs/router";
import { Component, onMount } from "solid-js";
import { Box } from "styled-system/jsx/box";

export const App: Component = () => {
  const client = createBackendClient();

  onMount(async () => {
    await client.post("/api/users/self-register");
  });

  return (
    <Box class="light">
      <Router>
        <Route path="/" component={Home} />
        <Route path="*404" component={NotFound} />
      </Router>
    </Box>
  );
};

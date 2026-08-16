import { Route, Router } from "@solidjs/router";
import type { Component } from "solid-js";
import { KangarooProvider } from "./contexts/kangarooContext";
import { ExpenseView } from "./pages/expense";
import { Home } from "./pages/home/(home)";
import { NotFound } from "./pages/internal/notFound";

export const App: Component = () => {
	return (
		<KangarooProvider>
			<Router>
				<Route path="/" component={Home} />
				<Route path="/expenses/new" component={ExpenseView} />
				<Route path="/expenses/:id" component={ExpenseView} />
				<Route path="*404" component={NotFound} />
			</Router>
		</KangarooProvider>
	);
};

/* @refresh reload */
import { App } from "./app";
import "./index.css";
import { render } from "solid-js/web";

render(() => <App />, document.getElementById("root") as HTMLElement);

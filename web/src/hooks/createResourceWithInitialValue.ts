import {
	type Accessor,
	createResource,
	createSignal,
	type ResourceFetcher,
	type ResourceReturn,
} from "solid-js";

export const createResourceWithInitialValue = <T>(
	fetcher: ResourceFetcher<true, T, unknown>,
	initialValue?: T | undefined,
): [...ResourceReturn<T, unknown>, Accessor<Promise<T> | T | null>] => {
	const [isFetchEnabled, setIsFetchEnabled] = createSignal<boolean>(
		initialValue === undefined,
	);
	const [promise, setPromise] = createSignal<T | Promise<T> | null>(null);

	const kangarooisedFetcher: ResourceFetcher<true, T, unknown> = async (
		source,
		info,
	) => {
		if (!isFetchEnabled() && initialValue !== undefined) {
			setIsFetchEnabled(true);
			return initialValue;
		} else {
			const fetcherPromise = fetcher(source, info);
			setPromise(() => fetcherPromise);
			const result = await fetcherPromise;
			setPromise(null);
			return result;
		}
	};

	return [...createResource<T>(kangarooisedFetcher, { initialValue }), promise];
};

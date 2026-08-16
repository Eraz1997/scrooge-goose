import {
	createResource,
	createSignal,
	type ResourceFetcher,
	type ResourceReturn,
} from "solid-js";

export const createResourceWithInitialValue = <T>(
	fetcher: ResourceFetcher<true, T, unknown>,
	initialValue?: T | undefined,
): ResourceReturn<T, unknown> => {
	const [isFetchEnabled, setIsFetchEnabled] = createSignal<boolean>(
		initialValue === undefined,
	);

	const kangarooisedFetcher: ResourceFetcher<true, T, unknown> = async (
		source,
		info,
	) => {
		if (!isFetchEnabled() && initialValue !== undefined) {
			setIsFetchEnabled(true);
			return initialValue;
		} else {
			return await fetcher(source, info);
		}
	};

	return createResource<T>(kangarooisedFetcher, { initialValue });
};

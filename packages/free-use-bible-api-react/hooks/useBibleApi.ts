import { FreeUseBibleApi, FreeUseBibleApiOptions } from 'free-use-bible-api';
import { useMemo } from 'react';

/**
 * Gets a memoized instance of the FreeUseBibleApi Client.
 * @param options The options to use for the FreeUseBibleApi Client.
 * @returns A memoized instance of the FreeUseBibleApi Client.
 */
export function useBibleApi(options?: FreeUseBibleApiOptions): FreeUseBibleApi {
    return useMemo(() => new FreeUseBibleApi(options), [options]);
}

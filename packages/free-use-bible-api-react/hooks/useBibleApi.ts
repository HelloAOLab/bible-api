import { Configuration, FreeUseBibleApi } from 'free-use-bible-api';
import { useMemo } from 'react';

/**
 * Gets a memoized instance of the FreeUseBibleApi Client.
 * @param configuration The configuration to use for the FreeUseBibleApi Client.
 * @returns A memoized instance of the FreeUseBibleApi Client.
 */
export function useBibleApi(configuration?: Configuration) {
    return useMemo(() => new FreeUseBibleApi(configuration), [configuration]);
}

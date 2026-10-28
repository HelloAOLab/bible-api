import type { ReadonlySignal } from '@preact/signals-core';
import { FreeUseBibleApi } from 'free-use-bible-api';
import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';
import {
    createBibleDataManager,
    type BibleDataManager,
} from './BibleDataManager.js';
import {
    createBibleReadingState,
    type BibleReadingOptions,
    type BibleReadingState,
} from './BibleReadingManager.js';

/**
 * Reads a signal's value and re-renders the component whenever it changes.
 */
export function useSignalValue<T>(source: ReadonlySignal<T>): T {
    const subscribe = useCallback(
        (onChange: () => void) => source.subscribe(() => onChange()),
        [source]
    );
    const getSnapshot = useCallback(() => source.peek(), [source]);
    return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

/**
 * Creates a `BibleDataManager` that lives as long as the component. Pass an
 * existing `FreeUseBibleApi` to use a custom endpoint; it is only read on the
 * first render.
 *
 * To share one cache between several readers, create the manager once with
 * `createBibleDataManager` and pass it down instead.
 */
export function useBibleDataManager(api?: FreeUseBibleApi): BibleDataManager {
    const [dataManager] = useState(() =>
        createBibleDataManager(api ?? new FreeUseBibleApi())
    );
    return dataManager;
}

/**
 * Creates a `BibleReadingState` that lives as long as the component, and
 * disposes it on unmount.
 *
 * `options` are only read when the state is created. To move the reader
 * afterwards, call its navigation methods (for example
 * `selectTranslationAndChapter`).
 */
export function useBibleReadingState(
    dataManager: BibleDataManager,
    options?: BibleReadingOptions
): BibleReadingState {
    const [readingState, setReadingState] = useState(() =>
        createBibleReadingState(dataManager, options)
    );

    useEffect(() => {
        // A disposed state shows up here in two cases: React's StrictMode
        // unmounting and remounting every effect once in development, and a new
        // `dataManager` (whose cleanup below disposed the old state). Either way,
        // swap in a fresh one rather than leave the reader dead.
        if (readingState.disposed) {
            setReadingState(createBibleReadingState(dataManager, options));
            return;
        }
        return () => readingState.dispose();
    }, [readingState, dataManager]);

    return readingState;
}

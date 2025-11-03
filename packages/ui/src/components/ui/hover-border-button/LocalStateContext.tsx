'use client'

/**
 * Local state context for individual button instances
 * Provides per-button state to Effect and Border subcomponents
 */

import { createSafeContext } from '@workspace/lib'
import type { HoverBorderLocalState } from './types'

/**
 * Provider, hook, and raw context for local button state
 * Each Button/Link component creates its own provider instance
 */
export const [LocalStateProvider, useLocalState, LocalStateContext] =
    createSafeContext<HoverBorderLocalState>('HoverBorderLocalState')

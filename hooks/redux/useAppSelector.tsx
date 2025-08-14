import { useSelector, TypedUseSelectorHook } from 'react-redux'
import type { RootState } from '@/store'

// Create a typed version of useSelector hook
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

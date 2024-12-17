import { timeBarOffsetReducer } from '@/atom/screen/linear';
import { timeBarOffsetState } from '@/atom/screen/linear';
import { useAtom } from 'jotai';

export const useTimeBarOffset = () => {
    const [state, setState] = useAtom(timeBarOffsetState);
    const dispatch = (action: { type: 'INCREMENT' | 'DECREMENT' | 'RESET' }) => {
        setState((prev) => timeBarOffsetReducer(prev, action));
    };

    return [state, dispatch] as const;
};

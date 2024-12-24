import { useAtom } from 'jotai';
import { mylistState, TMyListContents } from '@/atom/app';
import { ContentType } from '@/type/common';

type Props = {
    contentId: string;
    type: ContentType;
};

const useMyList = () => {
    const [state, setState] = useAtom(mylistState);

    const addMyList = ({ contentId, type }: Props) => {
        setState((prev: TMyListContents) => {
            return { ...prev, [type]: [...prev[type], contentId] };
        });
    };

    const removeMyList = ({ contentId, type }: Props) => {
        setState((prev: TMyListContents) => {
            return {
                ...prev,
                [type]: [...prev[type].filter((id) => id !== contentId)],
            };
        });
    };

    const exists = ({ contentId, type }: Props) => {
        return state[type]?.includes(contentId);
    };

    const toggleMyList = (content: Props) => {
        exists(content) ? removeMyList(content) : addMyList(content);
    };

    return { myLists: state, isMyList: exists, toggleMyList };
};

export default useMyList;

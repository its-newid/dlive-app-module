import { useMemo } from 'react';
import styled from 'styled-components';
import { TimeRange } from '@/component/ProgressBar';
import { useTranslation } from 'react-i18next';

type Props = {
    range: TimeRange;
};

export function ScheduleDuration({ range }: Props) {
    const { t, i18n } = useTranslation();

    const getLocaleTime = (millis: number) => {
        return t('time', {
            val: new Date(millis),
            formatParams: {
                val: { hour: 'numeric', minute: 'numeric', hour12: false },
            },
        });
    };

    const times = useMemo(() => {
        return {
            start: getLocaleTime(range.start),
            end: getLocaleTime(range.end),
        };
    }, [range, i18n.language]);

    return <Duration>{`${times.start} - ${times.end}`}</Duration>;
}

const Duration = styled.span`
    font: ${({ theme }) =>
        `${theme.fonts.weight.normal} 24rem/32rem ${theme.fonts.family.pretendard}`};
    color: ${({ theme }) => theme.colors.whiteAlpha89};
`;

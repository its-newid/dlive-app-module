import styled from 'styled-components';
import { IExtendableStyledComponent } from '@/type/common';
import { useTranslation } from 'react-i18next';

type Props = IExtendableStyledComponent & {
    leftMillis: number;
};

export function ScheduleRemainingTime({ className, leftMillis }: Props) {
    const { t } = useTranslation();
    const min = Math.floor(leftMillis / 1000 / 60);

    return (
        <TimeLeft className={className}>
            {t('detail_current_episode_left_minutes', {
                minute: min
            })}
        </TimeLeft>
    );
}

const TimeLeft = styled.span`
    font: ${({ theme }) =>
        `${theme.fonts.weight.normal} 24rem/32rem ${theme.fonts.family.pretendard}`};
    color: ${({ theme }) => theme.colors.whiteAlpha89};
`;

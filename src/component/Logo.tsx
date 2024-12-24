import styled from 'styled-components';
import { IExtendableStyledComponent } from '@/type/common';
import LogoWhite from '@/asset/icLogoWhite.png';
import LogoColor from '@/asset/icLogoColor.png';

export const LogoType = {
    DEFAULT: 'default',
    ONBOARDING: 'onboarding',
} as const;
export type LogoType = (typeof LogoType)[keyof typeof LogoType];

type LogoProps = IExtendableStyledComponent & {
    logoType?: LogoType;
    width?: number;
    height?: number;
};

const logoConfig = {
    [LogoType.DEFAULT]: {
        img: LogoWhite,
        width: 140,
        height: 48,
    },
    [LogoType.ONBOARDING]: {
        img: LogoColor,
        width: 210,
        height: 72,
    },
};

const Logo = ({
    logoType = LogoType.DEFAULT,
    width,
    height,
    ...rest
}: LogoProps) => {
    const {
        img,
        width: defaultWidth,
        height: defaultHeight,
    } = logoConfig[logoType];
    return (
        <LogoWrapper
            width={width || defaultWidth}
            height={height || defaultHeight}
            {...rest}
        >
            <Img src={img} alt='Logo' />
        </LogoWrapper>
    );
};

export default Logo;

const LogoWrapper = styled.div<{ width: number; height: number }>`
    width: ${({ width }) => width}rem;
    height: ${({ height }) => height}rem;
`;

const Img = styled.img`
    max-width: 100%;
    max-height: 100%;
    object-fit: cover;
`;

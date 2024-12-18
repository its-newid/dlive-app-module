import LogoProd from '@/asset/icLogo.svg?react';
import LogoDev from '@/asset/icLogoDev.svg?react';
import LogoLocal from '@/asset/icLogoLocal.svg?react';
import LogoErr from '@/asset/icLogoErr.svg?react';
import { ENV_MODE, ENV_TYPE } from '@/app/environment';
import { IExtendableStyledComponent } from '@/type/common';

export function Logo({ ...rest }: IExtendableStyledComponent) {
    if (!ENV_MODE) return;

    const Component = getLogo(ENV_MODE);
    return <Component {...rest} />;
}

const getLogo = (environmentName: string) => {
    switch (environmentName) {
        case ENV_TYPE.DEV:
            return LogoDev;
        case ENV_TYPE.LOCAL:
            return LogoLocal;
        case ENV_TYPE.ERROR_CASE:
            return LogoErr;
        default:
            return LogoProd;
    }
};

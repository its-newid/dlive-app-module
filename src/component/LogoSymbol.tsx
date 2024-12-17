import LogoProd from '@/asset/icSymbol.svg?react';
import LogoDev from '@/asset/icSymbolDev.svg?react';
import LogoLocal from '@/asset/icSymbolLocal.svg?react';
import LogoErr from '@/asset/icSymbolErr.svg?react';
import { ENV_MODE, EnvType } from '@/app/environment';
import { IExtendableStyledComponent } from '@/type/common';

export function LogoSymbol({ ...rest }: IExtendableStyledComponent) {
    if (!ENV_MODE) return;

    const Component = getLogo(ENV_MODE);
    return <Component {...rest} />;
}

const getLogo = (environmentName: string) => {
    switch (environmentName) {
        case EnvType.DEV:
            return LogoDev;
        case EnvType.LOCAL:
            return LogoLocal;
        case EnvType.ERROR_CASE:
            return LogoErr;
        default:
            return LogoProd;
    }
};

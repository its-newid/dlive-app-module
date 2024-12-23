import LogoProd from '@/asset/icLogo.svg';
import LogoDev from '@/asset/icLogoDev.svg';
import LogoLocal from '@/asset/icLogoLocal.svg';
import LogoErr from '@/asset/icLogoErr.svg';
import { ENV_MODE, EnvType } from '@/app/environment';
import { IExtendableStyledComponent } from '@/type/common';

interface LogoProps
    extends React.SVGProps<SVGSVGElement>,
        IExtendableStyledComponent {}

export function Logo({ ...rest }: LogoProps) {
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

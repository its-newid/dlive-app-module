import { useEffect, useState } from 'react';
import { useMigratePersistedData } from '@/hook/useMigratePersistedData';
// import { userAgent } from '../util/userAgent';
// import { useAtom } from 'jotai';
// import { uuidState } from '../atom/app';
// import { UUIDGeneratorWithV4 } from '../util/userAgent/uuid';
// import { UserAgentOS } from '../type/userAgent';

export const useSplash = () => {
    const { shouldMigrate } = useMigratePersistedData();
    const [showsSplash, setShowsSplash] = useState(shouldMigrate);

    useEffect(() => {
        if (!showsSplash) return;

        const timer = window.setTimeout(() => setShowsSplash(false), 3000);
        return () => window.clearTimeout(timer);
    }, [showsSplash]);

    return { showsSplash };
};

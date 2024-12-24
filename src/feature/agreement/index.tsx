import { useEffect, useMemo } from 'react';
import styled, { css } from 'styled-components';
import { useSetAtom } from 'jotai';
import Content from './Content';
import Menubar from './Menubar';
import { RoutePath } from '@/type/routePath';
import { useNavigate } from 'react-router';
import { ESCAPE } from '@/util/eventKey';
import { currentSelectedItemState, TLegalMenuItem } from '@/atom/onboarding';
import { isFirstLaunchState } from '@/atom/app';
import { LegalType } from '@/type/legal';
import useToast, { TOAST_ANIMATION } from '../screen/linear/hook/useToast';
import { closeApp } from '@/util/closeApp';
import { userAgent } from '@/util/userAgent';
import { AnimationType, Group } from '@/component/anim/Group';
import legal from '../../../legal.json';
import { t } from 'i18next';

function AgreementScreen() {
    const navigate = useNavigate();

    const setSelectedItemState = useSetAtom(currentSelectedItemState);
    const setIsFirstLaunch = useSetAtom(isFirstLaunchState);

    const legalItems: TLegalMenuItem[] = useMemo(() => {
        const getTitle = {
            [LegalType.TERMS]: t('onboarding_terms_of_use'),
            [LegalType.PRIVACY]: t('onboarding_privacy_policy'),
            [LegalType.SHARE]: t('onboarding_main_share'),
        };

        return Object.entries(LegalType).map(([, type]) => {
            return {
                type,
                title: getTitle[type],
                selected: false,
            };
        });
    }, [legal]);

    const legals = legalItems.map((item, idx) => {
        return idx === 0 ? { ...item, selected: true } : item;
    });

    const menuList = useMemo(() => {
        const getTitle = {
            [LegalType.TERMS]: t('onboarding_terms_of_use'),
            [LegalType.PRIVACY]: t('onboarding_privacy_policy'),
            [LegalType.SHARE]: t('onboarding_main_share'),
        };

        return legals.map((legal) => {
            return {
                ...legal,
                title: getTitle[legal.type],
            };
        });
    }, [legals]);

    const handleAgree = () => {
        setIsFirstLaunch(false);

        navigate(RoutePath.LIVE_SCREEN);
    };

    useEffect(() => {
        const initialFocusItem = menuList.find((menu) => menu.selected);
        initialFocusItem && setSelectedItemState(initialFocusItem);
    }, [menuList]);

    const EscapeToast = () => {
        const { isToastVisible, message, showToast } = useToast();

        useEffect(() => {
            function handleKeyDown(event: KeyboardEvent) {
                event.preventDefault();

                if (event.keyCode === ESCAPE) {
                    showToast('뒤로가기를 한 번 더 누르면 앱이 종료됩니다');
                }

                if (isToastVisible && event.keyCode === ESCAPE) {
                    closeApp(userAgent.type);
                }
            }

            window.addEventListener('keydown', handleKeyDown);
            return () => {
                window.removeEventListener('keydown', handleKeyDown);
            };
        }, [isToastVisible]);

        return (
            isToastVisible && (
                <Toast isVisible={isToastVisible} role={'status'}>
                    {message}
                </Toast>
            )
        );
    };

    return (
        <Container>
            <Menubar list={menuList} />
            <Content onAgree={handleAgree} />
            <EscapeToast />
        </Container>
    );
}
export default AgreementScreen;

const Container = styled.div`
    display: flex;
    flex-direction: row;
    background: ${({ theme }) => theme.colors.grey90};
    height: 100vh;
`;

const Toast = styled.div<{ isVisible: boolean }>`
    position: absolute;
    display: flex;
    bottom: 0;
    width: 100%;
    height: 128rem;
    align-items: center;
    justify-content: center;
    background: ${({ theme }) => theme.colors.main};
    font: ${({ theme }) =>
        `${theme.fonts.weight.bold} 38rem/46rem ${theme.fonts.family.pretendard}`};
    color: ${({ theme }) => theme.colors.blackAlpha100};

    ${({ isVisible }) =>
        isVisible &&
        css`
            animation:
                ${Group[AnimationType.SLIDE_IN]} ${TOAST_ANIMATION.DURATION}ms,
                ${Group[AnimationType.SLIDE_OUT]} ${TOAST_ANIMATION.DURATION}ms
                    ${TOAST_ANIMATION.DELAY}ms;
        `};
    animation-fill-mode: forwards;
`;

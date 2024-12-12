export function getTransformMatrixValues(element: HTMLElement) {
    const transformValue = window.getComputedStyle(element).getPropertyValue('transform');
    const matrixValues = transformValue.split(',');
    const translateX = Math.abs(Number(matrixValues[4].replace(/[()]/g, '')));
    const translateY = Math.abs(Number(matrixValues[5].replace(/[()]/g, '')));
    return [translateX, translateY];
}

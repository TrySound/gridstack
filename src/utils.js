export const orderBy = (array, get) => array.slice().sort((a, b) => {
    const da = get(a);
    const db = get(b);
    if (da < db) {
        return -1;
    }
    if (da > db) {
        return 1;
    }
    return 0;
});

export const isInterceptedVert = (a, b) =>
    !(a.y + a.height <= b.y || b.y + b.height <= a.y);

export const isInterceptedHorz = (a, b) =>
    !(a.x + a.width <= b.x || b.x + b.width <= a.x);

export const isIntercepted = (a, b) =>
    isInterceptedHorz(a, b) && isInterceptedVert(a, b);

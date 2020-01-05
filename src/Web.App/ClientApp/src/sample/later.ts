export const later = (delay: number, doit: () => void) => {
    let timer: NodeJS.Timer | number | undefined = undefined;
    let reject: () => void = () => {/**/};
    const promise = new Promise((resolve, _reject) => {
        reject = _reject;
        timer = setTimeout(() => { doit(); resolve(); }, delay);
    });
    return {
        get promise() { return promise; },
        cancel() {
            if (timer) {
                clearTimeout(timer as NodeJS.Timeout);
                timer = undefined;
                try {
                    reject();
                } catch { /* sometimes fails */ }
                reject = () => {/**/};
            }
        }
    };
};
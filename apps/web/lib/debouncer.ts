

export function debouncer(
    timer: NodeJS.Timeout | null,
    updateTimer: (timer: NodeJS.Timeout) => void,
    callback: () => void,
    delay: number
): void {
    if (timer) {
        // console.log("debounced", timer);
        clearTimeout(timer);
        // console.log("cleared a timer");
    }
    const newTimer = setTimeout(callback, delay);
    // console.log(newTimer);
    updateTimer(newTimer as NodeJS.Timeout);
}
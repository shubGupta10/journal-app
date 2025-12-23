export function getNextRunTimestamp(time: string): number {
    const [hours, minutes] = time.split(":").map(Number);

    const now = new Date();

    const nextRun = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        hours,
        minutes,
        0,
        0
    );

    if (now >= nextRun) {
        nextRun.setDate(nextRun.getDate() + 1);
    }

    return nextRun.getTime();
}

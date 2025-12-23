export function getNextRunTimestamp(time: string): number {
    const [hours, minutes] = time.split(":").map(Number);

    const now = new Date();
    const next = new Date();

    next.setHours(hours, minutes, 0, 0);

    if (now.getTime() >= next.getTime()) {
        next.setDate(next.getDate() + 1);
    }

    return next.getTime();
}

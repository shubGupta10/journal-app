/**
 * Returns a calm, honest reflection message based on the current streak.
 * No hype, no guilt, just gentle acknowledgment.
 */
export function getStreakReflection(currentStreak: number): string {
    // Day 0: Gentle restart
    if (currentStreak === 0) {
        return "Every streak starts somewhere. Today is as good a day as any.";
    }

    // Days 1-3: Early consistency
    if (currentStreak <= 3) {
        return "You're here again. That's what matters.";
    }

    // Days 4-7: Building rhythm
    if (currentStreak <= 7) {
        return "A few days in. You're finding your rhythm.";
    }

    // Days 8-14: Momentum
    if (currentStreak <= 14) {
        return "This is becoming part of your routine.";
    }

    // Days 15-30: Solid habit
    if (currentStreak <= 30) {
        return "Writing regularly is just something you do now.";
    }

    // Days 31+: Identity shift
    return "You've built something real here. This is who you are.";
}

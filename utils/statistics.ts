// utils/statistics.ts
export const MET: Record<string, number> = {
    walk: 3.8,
    run: 7,
    play: 4,
    eat: 1.5,
    sleep: 0.9,
};

export function getDayOfWeek(iso: string) {
    const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    return days[new Date(iso).getDay()];
}

export function getStartAndEnd(d: Date) {
    const mid = new Date(d);
    const start = new Date(mid);
    start.setDate(mid.getDate() - 3);
    const end = new Date(mid);
    end.setDate(mid.getDate() + 3);
    const toIso = (x: Date) => x.toISOString().split('T')[0];
    return { start: toIso(start), end: toIso(end) };
}

export function calcDurationHr(s: string, e: string) {
    const [sh, sm] = s.split(':').map(Number);
    const [eh, em] = e.split(':').map(Number);
    let min = eh * 60 + em - (sh * 60 + sm);
    if (min < 0) min += 1440;
    return min / 60;
}

export function calcCalories(type: string, weight: number, s: string, e: string) {
    return Math.round((MET[type] ?? 1) * weight * calcDurationHr(s, e));
}

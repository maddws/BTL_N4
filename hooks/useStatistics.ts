import { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { getDayOfWeek, calcCalories, calcDurationHr } from '@/utils/statistics';

export function useWeightHistory(petId: string, start: string, end: string) {
    const [labels, setLabels] = useState<string[]>([]);
    const [data, setData] = useState<number[]>([]);

    useEffect(() => {
        if (!petId) return;
        (async () => {
            const lbs: string[] = [],
                dt: number[] = [];
            const ref = collection(db, 'HealthLogs');
            for (let d = new Date(start); d <= new Date(end); d.setDate(d.getDate() + 1)) {
                const iso = d.toISOString();
                const snap = await getDocs(
                    query(ref, where('petId', '==', petId), where('date', '==', iso))
                );
                if (snap.empty) {
                    lbs.push(getDayOfWeek(iso) + '*');
                    dt.push(0);
                } else {
                    snap.forEach((s) => {
                        lbs.push(getDayOfWeek(iso));
                        dt.push(s.data().weight);
                    });
                }
            }
            console.log(lbs, dt);
            setLabels(lbs);
            setData(dt);
        })();
    }, [petId, start, end]);

    return {
        labels: labels.length != 0 ? labels : ['N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A'],
        data: data.length != 0 ? data : [0, 0, 0, 0, 0, 0, 0],
    };
}

export function useActivityStats(petId: string, weight: number, start: string, end: string) {
    const [labels, setLabels] = useState<string[]>([]);
    const [kcal, setKcal] = useState<number[]>([]);
    const [time, setTime] = useState<number[]>([]);

    useEffect(() => {
        if (!petId) return;
        (async () => {
            const ref = collection(db, 'ActivityLogs');
            const lbs: string[] = [],
                kc: number[] = [],
                tm: number[] = [];
            for (let d = new Date(start); d <= new Date(end); d.setDate(d.getDate() + 1)) {
                const iso = d.toISOString().split('T')[0];
                const snap = await getDocs(
                    query(ref, where('petId', '==', petId), where('date', '==', new Date(iso)))
                );
                let k = 0,
                    t = 0;
                snap.forEach((s) => {
                    const { activity_name, start_time, end_time } = s.data() as any;
                    k += calcCalories(activity_name, weight, start_time, end_time);
                    t += Math.round(calcDurationHr(start_time, end_time));
                });
                lbs.push(snap.empty ? getDayOfWeek(iso) + '*' : getDayOfWeek(iso));
                kc.push(k);
                tm.push(t);
            }
            setLabels(lbs);
            setKcal(kc);
            setTime(tm);
        })();
    }, [petId, start, end, weight]);

    return {
        label: labels.length != 0 ? labels : ['N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A'],
        kcalData: kcal.length != 0 ? kcal : [0, 0, 0, 0, 0, 0, 0],
        timeData: time.length != 0 ? time : [0, 0, 0, 0, 0, 0, 0],
    };
}

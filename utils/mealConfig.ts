import { DateTime, Duration, Interval } from 'luxon';

export const mealOptions = {
    vegetarianMeal: {
        name: 'Vegetarian Meal',
        unit_cost: 500,
        max: 10
    },
    nonVegetarianMeal: {
        name: 'Non-Vegetarian Meal',
        unit_cost: 500,
        max: 10
    },
}

const blacklistedDates = [
    Interval.fromISO('2021-12-07T00:00:00/2022-01-03T00:00:00/') // Christmas break
]

function isDateBlacklisted(date: DateTime): boolean {
    const match = blacklistedDates.filter(blackListedPeriod => blackListedPeriod.contains(date));

    return match.length > 0;
}

interface MealDateConfig {
    date: DateTime;
    onSale: boolean;
    offSaleReason: string | null;
}

export function validMealDates(): MealDateConfig[] {
    const now = DateTime.now();
    const thisWeek = now.startOf('week');
    const nextWeek = thisWeek.plus({ weeks: 1 });

    const bookingBuffer = Duration.fromObject({ hours: 3 });

    const dates = [
        thisWeek.setZone('Europe/London').set({ weekday: 2, hour: 21, minute: 0 }), // Tues this week
        thisWeek.setZone('Europe/London').set({ weekday: 3, hour: 21, minute: 0 }), // Wed this week
        thisWeek.plus({ weeks: 1 }).setZone('Europe/London').set({ weekday: 2, hour: 21, minute: 0 }), // Tues next week
        thisWeek.plus({ weeks: 1 }).setZone('Europe/London').set({ weekday: 3, hour: 21, minute: 0 }), // Wed next week
        thisWeek.plus({ weeks: 2 }).setZone('Europe/London').set({ weekday: 2, hour: 21, minute: 0 }), // Tues next week
        thisWeek.plus({ weeks: 2 }).setZone('Europe/London').set({ weekday: 3, hour: 21, minute: 0 }), // Wed next week
    ];

    return dates
        // .filter(date => date > now.startOf('day'))
        .map(date => {

            let onSale = true;
            let offSaleReason = null;

            if (date < now.plus(bookingBuffer)) {
                onSale = false;
                offSaleReason = 'Too late';
            } else if (isDateBlacklisted(date)) {
                onSale = false;
                offSaleReason = 'Kitchen closed';
            }

            return {
                onSale,
                offSaleReason,
                date
            }
        });
}
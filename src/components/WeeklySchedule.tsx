type DayName = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

interface TimeBlock {
    startTime: string;
    endTime: string;
    activity: string;
    category: string;
    description: string;
}

interface DaySchedule {
    day: DayName;
    blocks: TimeBlock[];
}

export interface WeeklySchedule {
    schedule: DaySchedule[];
    notes: string[];
}

export function WeeklySchedule({ schedule }: { schedule: WeeklySchedule }) {
    return (
        <section>
            <h2 className="text-xl font-semibold mb-3">Weekly Schedule</h2>
            <div className="space-y-4">
                {schedule.schedule.map((day, index) => (
                    <div key={index} className="border rounded-lg p-4">
                        <h3 className="font-semibold mb-2">{day.day}</h3>
                        <div className="space-y-2">
                            {day.blocks.map((block, blockIndex) => (
                                <div key={blockIndex} className="pl-4 border-l-2 border-blue-500">
                                    <p className="font-medium">
                                        {block.startTime} - {block.endTime}: {block.activity}
                                    </p>
                                    <p className="text-sm text-gray-600">{block.description}</p>
                                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                        {block.category}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            {schedule.notes && schedule.notes.length > 0 && (
                <div className="mt-4">
                    <h3 className="font-semibold mb-2">Notes:</h3>
                    <ul className="list-disc list-inside space-y-1">
                        {schedule.notes.map((note, index) => (
                            <li key={index} className="text-gray-700">{note}</li>
                        ))}
                    </ul>
                </div>
            )}
        </section>
    );
} 
import { Activity } from '@prisma/client';

export default function ActivityCard({ activity }: { activity: Activity }) {
  return (
    <div className="p-4 border rounded-lg shadow-lg">
      <h3 className="text-xl font-bold">{activity.name}</h3>
      <p className="mt-2">{activity.description}</p>
      <div className="mt-2 flex gap-2">
        {activity.weather.map((w, i) => (
          <span key={i} className="px-2 py-1 bg-blue-100 rounded-full text-sm">
            {w}
          </span>
        ))}
      </div>
    </div>
  );
}


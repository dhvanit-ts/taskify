import {
  Timeline,
  TimelineContent,
  TimelineDate,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
} from "@/components/ui/timeline";
import Image from "next/image";

type Activity = {
  id: number;
  date: string;
  title: string;
  action: string;
  description: string;
  image: string;
};

export default function TimelineWrapper() {

  const activities: Activity[] = []

  return (
    <Timeline>
      {activities.map((activity) => (
        <TimelineItem
          key={activity.id}
          step={activity.id}
          className="group-data-[orientation=vertical]/timeline:ms-10 group-data-[orientation=vertical]/timeline:not-last:pb-8"
        >
          <TimelineHeader>
            <TimelineSeparator className="group-data-[orientation=vertical]/timeline:-left-7 group-data-[orientation=vertical]/timeline:h-[calc(100%-1.5rem-0.25rem)] group-data-[orientation=vertical]/timeline:translate-y-6.5" />
            <TimelineTitle className="mt-0.5">
              {activity.title}{" "}
              <span className="text-muted-foreground text-sm font-normal">
                {activity.action}
              </span>
            </TimelineTitle>
            <TimelineIndicator className="bg-primary/10 group-data-completed/timeline-activity:bg-primary group-data-completed/timeline-activity:text-primary-foreground flex size-6 activitys-center justify-center border-none group-data-[orientation=vertical]/timeline:-left-7">
              <Image
                width={40}
                height={40}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                src={activity.image}
                alt={activity.title}
                className="size-6 rounded-full"
              />
            </TimelineIndicator>
          </TimelineHeader>
          <TimelineContent className="text-foreground mt-2 rounded-lg border bg-zinc-100 border-zinc-300 shadow-lg px-4 py-3">
            {activity.description}
            <TimelineDate className="mt-1 mb-0">{activity.date}</TimelineDate>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
}

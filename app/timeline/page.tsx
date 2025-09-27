"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DatePicker } from "@/components/ui/date-picker";
import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

type Task = {
  id: string;
  title: string;
  description?: string;
  done: boolean;
  createdAt: Date;
  date?: string;
  startTime?: string;
  endTime?: string;
};

export default function Timeline() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/tasks');
      if (!res.ok) throw new Error('Failed to fetch tasks');
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const selectedDateStr = selectedDate.toISOString().split('T')[0];
  const dayTasks = tasks.filter(task => task.date && new Date(task.date).toISOString().split('T')[0] === selectedDateStr && task.startTime && task.endTime);

  const timeToMinutes = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const timelineHeight = 1200; // 24 hours * 50px per hour
  const pixelsPerMinute = timelineHeight / 1440; // 1440 minutes in 24 hours

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button asChild variant="outline">
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Tasks
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Timeline</h1>
        </div>
        <DatePicker
          date={selectedDate}
          onDateChange={(date) => date && setSelectedDate(date)}
        />
      </div>
      <div className="relative" style={{ height: timelineHeight }}>
        {/* Timeline line */}
        <div className="absolute left-20 top-0 bottom-0 w-0.5 bg-gray-300"></div>
        {/* Time labels */}
        {Array.from({ length: 48 }, (_, i) => {
          const minutes = i * 30;
          const hours = Math.floor(minutes / 60);
          const mins = minutes % 60;
          const timeStr = `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
          const top = minutes * pixelsPerMinute;
          return (
            <div key={i} className="absolute left-0" style={{ top: top - 10 }}>
              <span className="text-sm text-gray-500">{timeStr}</span>
            </div>
          );
        })}
        {/* Task cards */}
        {dayTasks.map((task) => {
          const startMinutes = timeToMinutes(task.startTime!);
          const endMinutes = timeToMinutes(task.endTime!);
          const top = startMinutes * pixelsPerMinute;
          const height = (endMinutes - startMinutes) * pixelsPerMinute;
          return (
            <Card key={task.id} className="absolute left-24 right-4" style={{ top, height: Math.max(height, 40) }}>
              <CardContent className="p-2">
                <h3 className="font-semibold text-sm">{task.title}</h3>
                {task.description && <p className="text-xs text-muted-foreground">{task.description}</p>}
                <p className="text-xs text-muted-foreground">{task.startTime} - {task.endTime}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DatePicker } from "@/components/ui/date-picker";
import { TimePicker } from "@/components/ui/time-picker";
import { useState, useEffect } from "react";
import { Plus, Calendar } from "lucide-react";
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

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newDate, setNewDate] = useState<Date | undefined>();
  const [newStartTime, setNewStartTime] = useState("");
  const [newEndTime, setNewEndTime] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editDate, setEditDate] = useState<Date | undefined>();
  const [editStartTime, setEditStartTime] = useState("");
  const [editEndTime, setEditEndTime] = useState("");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

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

  const addTask = async () => {
    if (!newTitle.trim() || !newDate) return;
    try {
      await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle, description: newDesc, date: newDate?.toISOString().split('T')[0], startTime: newStartTime, endTime: newEndTime }),
      });
       setNewTitle("");
       setNewDesc("");
       setNewDate(undefined);
       setNewStartTime("");
       setNewEndTime("");
      setIsCreateOpen(false);
      fetchTasks();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add task');
    }
  };

  const deleteTask = async (task: Task) => {
    try {
      await fetch(`/api/tasks/${task.id}`, { method: 'DELETE' });
      fetchTasks();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete task');
    }
  };

  const toggleDone = async (task: Task) => {
    try {
      await fetch(`/api/tasks/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: task.title, description: task.description, done: !task.done }),
      });
      fetchTasks();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task');
    }
  };

  const startEdit = (task: Task) => {
    setEditTask(task);
    setEditTitle(task.title);
    setEditDesc(task.description || "");
    setEditDate(task.date ? new Date(task.date) : undefined);
    setEditStartTime(task.startTime || "");
    setEditEndTime(task.endTime || "");
  };

  const saveEdit = async () => {
    if (!editTask) return;
    try {
      await fetch(`/api/tasks/${editTask.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editTitle, description: editDesc, date: editDate?.toISOString().split('T')[0], startTime: editStartTime, endTime: editEndTime, done: editTask.done }),
      });
      setIsEditOpen(false);
      setEditTask(null);
      fetchTasks();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save edit');
    }
  };

  const openTaskDetail = (task: Task) => {
    setSelectedTask(task);
    setIsDetailOpen(true);
  };

  const closeTaskDetail = () => {
    setIsDetailOpen(false);
    setSelectedTask(null);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Task Manager</h1>
        <div className="flex items-center space-x-2">
          <Button asChild variant="outline">
            <Link href="/timeline">
              <Calendar className="h-4 w-4 mr-2" />
              Timeline
            </Link>
          </Button>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button size="icon" variant="outline">
              <Plus className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
            </DialogHeader>
            <div className="space-y-2">
              <Input
                placeholder="Task Title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
              <Input
                placeholder="Description"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
              />
               <DatePicker
                 date={newDate}
                 onDateChange={setNewDate}
               />
               <TimePicker
                 value={newStartTime}
                 onChange={setNewStartTime}
                 placeholder="Start Time"
               />
               <TimePicker
                 value={newEndTime}
                 onChange={setNewEndTime}
                 placeholder="End Time"
               />
              <Button onClick={addTask}>Add Task</Button>
            </div>
           </DialogContent>
        </Dialog>
        </div>
      </div>
      <div className="space-y-2">
        {tasks.map((task) => (
          <Card key={task.id} onClick={() => openTaskDetail(task)} className="cursor-pointer">
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={task.done}
                  onCheckedChange={() => toggleDone(task)}
                  onClick={(e) => e.stopPropagation()}
                />
                <div>
                  <h3 className={task.done ? "line-through" : ""}>{task.title}</h3>
                  <p className="text-sm text-muted-foreground">{task.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {task.date ? new Date(task.date).toLocaleDateString() : ""}
                    {task.startTime && ` ${task.startTime}`}
                    {task.endTime && ` - ${task.endTime}`}
                  </p>
                </div>
              </div>
              <div className="space-x-2">
                 <Button
                   variant="outline"
                   onClick={(e) => {
                     e.stopPropagation();
                     startEdit(task);
                     setIsEditOpen(true);
                   }}
                 >
                   Edit
                 </Button>

                <Button
                  variant="destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteTask(task);
                  }}
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Dialog
        open={isEditOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsEditOpen(false);
            setEditTask(null);
            setEditTitle("");
            setEditDesc("");
            setEditDate(undefined);
            setEditStartTime("");
            setEditEndTime("");
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Task Title"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
          />
          <Input
            placeholder="Description"
            value={editDesc}
            onChange={(e) => setEditDesc(e.target.value)}
            className="mt-2"
          />
          <DatePicker
            date={editDate}
            onDateChange={setEditDate}
            className="mt-2"
          />
          <TimePicker
            value={editStartTime}
            onChange={setEditStartTime}
            placeholder="Start Time"
            className="mt-2"
          />
          <TimePicker
            value={editEndTime}
            onChange={setEditEndTime}
            placeholder="End Time"
            className="mt-2"
          />
          <Button onClick={saveEdit}>Save</Button>
        </DialogContent>
      </Dialog>
      <Dialog
        open={isDetailOpen}
        onOpenChange={(open) => {
          if (!open) {
            closeTaskDetail();
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedTask?.title ?? "Task Details"}</DialogTitle>
          </DialogHeader>
          {selectedTask && (
            <div className="max-h-64 overflow-y-auto whitespace-pre-wrap text-sm text-muted-foreground">
              {selectedTask.description?.trim() ? selectedTask.description : "No description"}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

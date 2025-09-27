"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState, useEffect } from "react";

type Task = {
  id: string;
  title: string;
  description?: string;
  done: boolean;
  createdAt: Date;
  date: Date;
  startTime?: string;
  endTime?: string;
};

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newStartTime, setNewStartTime] = useState("");
  const [newEndTime, setNewEndTime] = useState("");
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editStartTime, setEditStartTime] = useState("");
  const [editEndTime, setEditEndTime] = useState("");

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
        body: JSON.stringify({ title: newTitle, description: newDesc, date: newDate, startTime: newStartTime, endTime: newEndTime }),
      });
      setNewTitle("");
      setNewDesc("");
      setNewDate("");
      setNewStartTime("");
      setNewEndTime("");
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
    setEditDate(task.date ? task.date.toISOString().split('T')[0] : "");
    setEditStartTime(task.startTime || "");
    setEditEndTime(task.endTime || "");
  };

  const saveEdit = async () => {
    if (!editTask) return;
    try {
      await fetch(`/api/tasks/${editTask.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editTitle, description: editDesc, date: editDate, startTime: editStartTime, endTime: editEndTime, done: editTask.done }),
      });
      setEditTask(null);
      fetchTasks();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save edit');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Task Manager</h1>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Add New Task</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Task Title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <Input
            placeholder="Description"
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            className="mt-2"
          />
          <Input
            type="date"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            className="mt-2"
          />
          <Input
            type="time"
            placeholder="Start Time"
            value={newStartTime}
            onChange={(e) => setNewStartTime(e.target.value)}
            className="mt-2"
          />
          <Input
            type="time"
            placeholder="End Time"
            value={newEndTime}
            onChange={(e) => setNewEndTime(e.target.value)}
            className="mt-2"
          />
          <Button onClick={addTask} className="mt-2">Add Task</Button>
        </CardContent>
      </Card>
      <div className="space-y-2">
        {tasks.map((task) => (
          <Card key={task.id}>
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={task.done}
                  onCheckedChange={() => toggleDone(task)}
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
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" onClick={() => startEdit(task)}>Edit</Button>
                  </DialogTrigger>
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
                    <Input
                      type="date"
                      value={editDate}
                      onChange={(e) => setEditDate(e.target.value)}
                      className="mt-2"
                    />
                    <Input
                      type="time"
                      placeholder="Start Time"
                      value={editStartTime}
                      onChange={(e) => setEditStartTime(e.target.value)}
                      className="mt-2"
                    />
                    <Input
                      type="time"
                      placeholder="End Time"
                      value={editEndTime}
                      onChange={(e) => setEditEndTime(e.target.value)}
                      className="mt-2"
                    />
                    <Button onClick={saveEdit}>Save</Button>
                  </DialogContent>
                </Dialog>
                <Button variant="destructive" onClick={() => deleteTask(task)}>Delete</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

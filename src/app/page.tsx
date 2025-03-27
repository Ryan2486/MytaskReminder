import TaskPlanner from "@/components/task-planner"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-8">
      <TaskPlanner />
    </main>
  )
}


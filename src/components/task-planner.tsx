"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Plus, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface Task {
  id: number
  title: string
  startTime: string
  endTime: string
  duration: string
  color: "red" | "blue" | "yellow"
  date: string // Format: "YYYY-MM-DD"
  completed?: boolean
  swiping?: boolean
}

export default function TaskPlanner() {
  // Utiliser la date actuelle comme date par défaut
  const today = new Date()
  const [currentDate, setCurrentDate] = useState(today)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isMonthPickerOpen, setIsMonthPickerOpen] = useState(false)
  const [isYearPickerOpen, setIsYearPickerOpen] = useState(false)
  const [newTask, setNewTask] = useState({
    title: "",
    startTime: "10:00 AM",
    endTime: "11:00 AM",
    color: "blue" as "red" | "blue" | "yellow",
  })

  // Fonction pour formater la date au format "YYYY-MM-DD"
  const formatDate = (date: Date): string => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
  }

  // Générer les jours de la semaine actuelle
  const generateWeekDays = (date: Date) => {
    const firstDayOfWeek = new Date(date)
    firstDayOfWeek.setDate(date.getDate() - date.getDay()) // Dimanche comme premier jour

    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(firstDayOfWeek)
      day.setDate(firstDayOfWeek.getDate() + i)
      return {
        date: day,
        dayOfMonth: day.getDate(),
        dayOfWeek: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][day.getDay()],
        isToday: isSameDay(day, today),
      }
    })
  }

  // Vérifier si deux dates sont le même jour
  const isSameDay = (date1: Date, date2: Date): boolean => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    )
  }

  const [days, setDays] = useState(generateWeekDays(currentDate))

  // État pour stocker les tâches
  const [allTasks, setAllTasks] = useState<Task[]>([
    // Exemple de tâches pour aujourd'hui
    {
      id: 1,
      title: "Daily work briefing / meeting",
      startTime: "10:00 AM",
      endTime: "11:00 AM",
      duration: "01 Hour",
      color: "red",
      date: formatDate(today),
    },
    {
      id: 2,
      title: "Job Finder app wireframe creation",
      startTime: "12:00 PM",
      endTime: "02:00 PM",
      duration: "02 Hours",
      color: "blue",
      date: formatDate(today),
    },
  ])

  // Filtrer les tâches pour la date sélectionnée
  const tasks = allTasks.filter((task) => task.date === formatDate(currentDate))

  const timeSlots = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "01:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM",
    "06:00 PM",
    "07:00 PM",
  ]

  // Générer les mois de l'année
  const months = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ]

  // Générer une liste d'années (10 ans avant et après l'année actuelle)
  const currentYear = currentDate.getFullYear()
  const years = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i)

  const handlePrevWeek = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(currentDate.getDate() - 7)
    setCurrentDate(newDate)
    setDays(generateWeekDays(newDate))
  }

  const handleNextWeek = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(currentDate.getDate() + 7)
    setCurrentDate(newDate)
    setDays(generateWeekDays(newDate))
  }

  const handleDayClick = (day: Date) => {
    setCurrentDate(day)
  }

  const handleMonthSelect = (monthIndex: number) => {
    const newDate = new Date(currentDate)
    newDate.setMonth(monthIndex)
    setCurrentDate(newDate)
    setDays(generateWeekDays(newDate))
    setIsMonthPickerOpen(false)
  }

  const handleYearSelect = (year: number) => {
    const newDate = new Date(currentDate)
    newDate.setFullYear(year)
    setCurrentDate(newDate)
    setDays(generateWeekDays(newDate))
    setIsYearPickerOpen(false)
  }

  const getColorClass = (color: Task["color"]) => {
    switch (color) {
      case "red":
        return "bg-red-500"
      case "blue":
        return "bg-blue-500"
      case "yellow":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  const calculateDuration = (start: string, end: string): string => {
    const parseTime = (time: string): number => {
      const [hourStr, minuteStr] = time.split(":")
      let hour = Number.parseInt(hourStr)
      const minute = Number.parseInt(minuteStr)

      if (time.includes("PM") && hour < 12) {
        hour += 12
      } else if (time.includes("AM") && hour === 12) {
        hour = 0
      }

      return hour * 60 + minute
    }

    const startMinutes = parseTime(start.replace(" AM", ":00").replace(" PM", ":00"))
    const endMinutes = parseTime(end.replace(" AM", ":00").replace(" PM", ":00"))

    const durationMinutes = endMinutes - startMinutes
    const hours = Math.floor(durationMinutes / 60)
    const minutes = durationMinutes % 60

    if (minutes === 0) {
      return `${String(hours).padStart(2, "0")} Hours`
    } else if (hours === 0) {
      return `${minutes} Min`
    } else {
      return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")} Hours`
    }
  }

  const handleAddTask = () => {
    const duration = calculateDuration(newTask.startTime, newTask.endTime)

    const task: Task = {
      id: allTasks.length + 1,
      title: newTask.title,
      startTime: newTask.startTime,
      endTime: newTask.endTime,
      duration,
      color: newTask.color,
      date: formatDate(currentDate),
    }

    setAllTasks([...allTasks, task])
    setIsModalOpen(false)

    // Réinitialiser le formulaire
    setNewTask({
      title: "",
      startTime: "10:00 AM",
      endTime: "11:00 AM",
      color: "blue",
    })
  }

  const handleCompleteTask = (taskId: number) => {
    // Marquer la tâche comme en cours de swipe
    setAllTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === taskId ? { ...task, swiping: true, completed: true } : task)),
    )

    // Supprimer la tâche après l'animation
    setTimeout(() => {
      setAllTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId))
    }, 500) // Durée de l'animation
  }

  return (
    <Card className="w-full max-w-md md:max-w-2xl p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          {/* Sélecteur de mois */}
          <Popover open={isMonthPickerOpen} onOpenChange={setIsMonthPickerOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" className="font-bold text-xl hover:bg-gray-100">
                {currentDate.toLocaleString("default", { month: "long" })}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-2">
              <div className="grid grid-cols-3 gap-2">
                {months.map((month, index) => (
                  <Button
                    key={month}
                    variant={currentDate.getMonth() === index ? "default" : "outline"}
                    className={currentDate.getMonth() === index ? "bg-[#f87c67]" : ""}
                    onClick={() => handleMonthSelect(index)}
                  >
                    {month}
                  </Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          <span className="text-xl font-bold">|</span>

          {/* Sélecteur d'année */}
          <Popover open={isYearPickerOpen} onOpenChange={setIsYearPickerOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" className="font-bold text-xl hover:bg-gray-100">
                {currentDate.getFullYear()}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 h-72 overflow-y-auto p-2">
              <div className="grid grid-cols-3 gap-2">
                {years.map((year) => (
                  <Button
                    key={year}
                    variant={currentDate.getFullYear() === year ? "default" : "outline"}
                    className={currentDate.getFullYear() === year ? "bg-[#f87c67]" : ""}
                    onClick={() => handleYearSelect(year)}
                  >
                    {year}
                  </Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrevWeek}
            className="h-8 w-8 rounded-full bg-gray-100 hover:bg-gray-200"
            title="Semaine précédente"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleNextWeek}
            className="h-8 w-8 rounded-full bg-gray-100 hover:bg-gray-200"
            title="Semaine suivante"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-6">
        {days.map((day) => (
          <button
            key={`${day.date.getFullYear()}-${day.date.getMonth()}-${day.dayOfMonth}`}
            className={cn(
              "flex flex-col items-center justify-center p-2 rounded-md transition-colors",
              isSameDay(day.date, currentDate) && !day.isToday
                ? "bg-[#f87c67] text-white"
                : day.isToday
                  ? "bg-orange-400 text-white"
                  : "hover:bg-gray-100",
            )}
            onClick={() => handleDayClick(day.date)}
          >
            <span className="text-sm">{day.date.getDate()}</span>
            <span className="text-xs">{day.dayOfWeek}</span>
          </button>
        ))}
      </div>

      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">
          {currentDate.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
        </h3>
        <Button size="sm" className="bg-[#f87c67] hover:bg-[#e76b56]" onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4 mr-1" />
          Ajouter
        </Button>
      </div>

      {tasks.length === 0 ? (
        <div className="py-8 text-center text-gray-500">Aucune tâche planifiée pour cette journée</div>
      ) : (
        <div className="space-y-4">
          {timeSlots.map((time) => {
            const tasksAtTime = tasks.filter((task) => task.startTime === time)
            if (tasksAtTime.length === 0) return null

            return (
              <div key={time} className="flex items-start gap-3">
                <div className="w-16 text-sm text-gray-500">{time}</div>

                <div className="flex-1">
                  {tasksAtTime.map((task) => (
                    <div
                      key={task.id}
                      className={cn(
                        "flex mb-2 transition-all duration-500 ease-in-out relative overflow-hidden",
                        task.swiping ? "transform translate-x-full opacity-0" : "",
                      )}
                    >
                      <div className={cn("w-1 rounded-full mr-2", getColorClass(task.color))}></div>
                      <div
                        className={cn(
                          "flex-1 bg-gray-50 p-2 rounded-md cursor-pointer relative transition-all duration-300",
                          task.completed ? "bg-green-50" : "",
                          "hover:shadow-md",
                        )}
                        onClick={() => handleCompleteTask(task.id)}
                      >
                        {task.completed && (
                          <div className="absolute inset-0 flex items-center justify-center bg-green-100 bg-opacity-70 rounded-md">
                            <Check className="text-green-600 h-6 w-6" />
                          </div>
                        )}
                        <h3 className="font-medium text-sm">{task.title}</h3>
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>
                            {task.startTime} - {task.endTime}
                          </span>
                          <span>{task.duration}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal pour ajouter une tâche */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Ajouter une tâche</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Titre</Label>
              <Input
                id="title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                placeholder="Titre de la tâche"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="startTime">Heure de début</Label>
                <Select
                  value={newTask.startTime}
                  onValueChange={(value) => setNewTask({ ...newTask, startTime: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Heure de début" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="endTime">Heure de fin</Label>
                <Select value={newTask.endTime} onValueChange={(value) => setNewTask({ ...newTask, endTime: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Heure de fin" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Catégorie</Label>
              <RadioGroup
                value={newTask.color}
                onValueChange={(value) => setNewTask({ ...newTask, color: value as "red" | "blue" | "yellow" })}
                className="flex space-x-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="red" id="color-red" className="sr-only" />
                  <Label
                    htmlFor="color-red"
                    className={cn(
                      "w-8 h-8 rounded-full cursor-pointer border-2",
                      newTask.color === "red" ? "border-black" : "border-transparent",
                      "bg-red-500",
                    )}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="blue" id="color-blue" className="sr-only" />
                  <Label
                    htmlFor="color-blue"
                    className={cn(
                      "w-8 h-8 rounded-full cursor-pointer border-2",
                      newTask.color === "blue" ? "border-black" : "border-transparent",
                      "bg-blue-500",
                    )}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yellow" id="color-yellow" className="sr-only" />
                  <Label
                    htmlFor="color-yellow"
                    className={cn(
                      "w-8 h-8 rounded-full cursor-pointer border-2",
                      newTask.color === "yellow" ? "border-black" : "border-transparent",
                      "bg-yellow-500",
                    )}
                  />
                </div>
              </RadioGroup>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              onClick={handleAddTask}
              disabled={!newTask.title}
              className="bg-[#f87c67] hover:bg-[#e76b56]"
            >
              Ajouter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Styles pour l'animation */}
      <style jsx global>{`
        @keyframes swipeRight {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(100%);
            opacity: 0;
          }
        }
        
        .task-swiping {
          animation: swipeRight 0.5s ease-in-out forwards;
        }
      `}</style>
    </Card>
  )
}


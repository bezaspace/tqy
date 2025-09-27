import * as React from "react"
import { cn } from "@/lib/utils"

interface TimePickerProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  className?: string
}

export function TimePicker({ value, onChange, placeholder = "Select time", className }: TimePickerProps) {
  const [hours, setHours] = React.useState("")
  const [minutes, setMinutes] = React.useState("")

  React.useEffect(() => {
    if (value) {
      const [h, m] = value.split(":")
      setHours(h || "")
      setMinutes(m || "")
    } else {
      setHours("")
      setMinutes("")
    }
  }, [value])



  const hourOptions = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0"))
  const minuteOptions = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0"))

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <select
        value={hours}
        onChange={(e) => {
          const newHours = e.target.value;
          setHours(newHours);
          const newValue = newHours && minutes ? `${newHours}:${minutes}` : "";
          onChange?.(newValue);
        }}
        className={cn(
          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-popover text-popover-foreground px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:cursor-not-allowed disabled:opacity-50",
        )}
      >
        <option value="" className="text-muted-foreground">{placeholder}</option>
        {hourOptions.map((hour) => (
          <option key={hour} value={hour} className="bg-popover text-popover-foreground">
            {hour}
          </option>
        ))}
      </select>
      <span>:</span>
      <select
        value={minutes}
        onChange={(e) => {
          const newMinutes = e.target.value;
          setMinutes(newMinutes);
          const newValue = hours && newMinutes ? `${hours}:${newMinutes}` : "";
          onChange?.(newValue);
        }}
        className={cn(
          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-popover text-popover-foreground px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:cursor-not-allowed disabled:opacity-50",
        )}
      >
        <option value="" className="text-muted-foreground">{placeholder}</option>
        {minuteOptions.map((minute) => (
          <option key={minute} value={minute} className="bg-popover text-popover-foreground">
            {minute}
          </option>
        ))}
      </select>
    </div>
  )
}
"use client";

import * as React from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";

interface DatePickerProps {
  value: string; // YYYY-MM-DD
  onChange: (date: string) => void;
  disabledDates: string[];
}

export function DatePicker({ value, onChange, disabledDates }: DatePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const popoverRef = React.useRef<HTMLDivElement>(null);

  const selectedDate = value ? new Date(value) : undefined;

  // Cek jika klik diluar popover
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const disabledDays = [
    { before: new Date(new Date().setHours(0,0,0,0)) }, // Disable past dates
    ...disabledDates.map((dateStr) => {
      const parts = dateStr.split("-");
      if (parts.length === 3) {
        return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      }
      return new Date(dateStr);
    })
  ];

  return (
    <div className="relative w-full" ref={popoverRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-primary-500 text-gray-900 transition-all flex items-center gap-3 text-left"
      >
        <CalendarIcon className="w-5 h-5 text-gray-400" />
        <span className={value ? "text-gray-900 font-medium" : "text-gray-400"}>
          {value ? format(selectedDate!, "EEEE, dd MMMM yyyy", { locale: id }) : "Pilih tanggal keberangkatan"}
        </span>
      </button>

      {isOpen && (
        <div className="absolute z-50 top-full mt-2 left-0 md:left-auto md:right-0 bg-white rounded-3xl p-5 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200 w-[320px]">
          <style>{`
            .rdp-root {
              --rdp-accent-color: #2563eb;
              --rdp-accent-background-color: #eff6ff;
              --rdp-background-color: transparent;
              margin: 0;
            }
            .rdp-day_selected, .rdp-day_selected:focus-visible, .rdp-day_selected:hover {
              background-color: var(--rdp-accent-color) !important;
              color: white !important;
              font-weight: bold;
              border-radius: 12px;
            }
            .rdp-day_disabled {
              text-decoration: line-through;
              color: #ef4444;
              opacity: 0.6;
            }
            .rdp-day_today:not(.rdp-day_outside) {
              font-weight: bold;
              color: var(--rdp-accent-color);
            }
            .rdp-nav_button {
              width: 32px;
              height: 32px;
              border-radius: 8px;
            }
            .rdp-nav_button:hover {
              background-color: #f3f4f6;
            }
          `}</style>
          
          <div className="mb-2 px-2 text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center justify-between">
            <span>Pilih Jadwal</span>
            <span className="text-red-500 lowercase">* dicoret = penuh</span>
          </div>

          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              if (date) {
                // Adjust to local timezone format to avoid off-by-one errors
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, "0");
                const day = String(date.getDate()).padStart(2, "0");
                onChange(`${year}-${month}-${day}`);
                setIsOpen(false);
              }
            }}
            locale={id}
            disabled={disabledDays}
            className="mx-auto"
          />
        </div>
      )}
    </div>
  );
}

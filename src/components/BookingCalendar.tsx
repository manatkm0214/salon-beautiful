"use client";

import { useMemo, useState } from "react";

type BookingCalendarProps = {
  value: string;
  onChange: (value: string) => void;
};

type SavedBooking = { scheduledAt?: string; status?: string };

const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];
const OPENING_HOURS = ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

function dateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isBookable(date: Date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const candidate = new Date(date);
  candidate.setHours(0, 0, 0, 0);
  return candidate >= today && candidate.getDay() !== 1;
}

export default function BookingCalendar({ value, onChange }: BookingCalendarProps) {
  const initialDate = value ? new Date(value) : new Date();
  const [displayMonth, setDisplayMonth] = useState(
    new Date(initialDate.getFullYear(), initialDate.getMonth(), 1),
  );
  const selectedDate = value ? value.slice(0, 10) : "";
  const selectedTime = value ? value.slice(11, 16) : "";
  const [reservedSlots] = useState(() => {
    if (typeof window === "undefined") return [] as string[];
    try {
      const saved = JSON.parse(localStorage.getItem("local_bookings") || "[]") as SavedBooking[];
      return saved
        .filter((booking) => booking.status !== "CANCELLED" && typeof booking.scheduledAt === "string")
        .map((booking) => booking.scheduledAt as string);
    } catch {
      return [] as string[];
    }
  });

  const days = useMemo(() => {
    const firstDay = new Date(displayMonth.getFullYear(), displayMonth.getMonth(), 1);
    const start = new Date(firstDay);
    start.setDate(1 - firstDay.getDay());
    return Array.from({ length: 42 }, (_, index) => {
      const day = new Date(start);
      day.setDate(start.getDate() + index);
      return day;
    });
  }, [displayMonth]);

  const chooseDate = (day: Date) => {
    if (!isBookable(day)) return;
    const nextTime = selectedTime || OPENING_HOURS[0];
    onChange(`${dateKey(day)}T${nextTime}`);
  };

  const chooseTime = (time: string) => {
    if (!selectedDate) return;
    onChange(`${selectedDate}T${time}`);
  };

  const monthLabel = new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "long",
  }).format(displayMonth);

  return (
    <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between">
        <button
          aria-label="前の月"
          className="grid size-9 place-items-center rounded-full border border-stone-200 bg-white text-lg transition hover:border-amber-700 disabled:cursor-not-allowed disabled:opacity-35"
          disabled={displayMonth.getFullYear() === new Date().getFullYear() && displayMonth.getMonth() === new Date().getMonth()}
          onClick={() => setDisplayMonth(new Date(displayMonth.getFullYear(), displayMonth.getMonth() - 1, 1))}
          type="button"
        >
          ‹
        </button>
        <h3 className="font-semibold text-stone-800">{monthLabel}</h3>
        <button
          aria-label="次の月"
          className="grid size-9 place-items-center rounded-full border border-stone-200 bg-white text-lg transition hover:border-amber-700"
          onClick={() => setDisplayMonth(new Date(displayMonth.getFullYear(), displayMonth.getMonth() + 1, 1))}
          type="button"
        >
          ›
        </button>
      </div>

      <div className="mb-1 grid grid-cols-7 text-center text-xs text-stone-500">
        {WEEKDAYS.map((weekday) => <span key={weekday}>{weekday}</span>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const key = dateKey(day);
          const inMonth = day.getMonth() === displayMonth.getMonth();
          const selectable = inMonth && isBookable(day);
          const selected = key === selectedDate;
          return (
            <button
              key={key}
              aria-pressed={selected}
              className={`aspect-square rounded-lg text-sm transition ${selected ? "bg-amber-800 font-semibold text-white shadow-sm" : selectable ? "bg-white text-stone-800 hover:bg-amber-100" : "cursor-not-allowed text-stone-300"}`}
              disabled={!selectable}
              onClick={() => chooseDate(day)}
              type="button"
            >
              {day.getDate()}
            </button>
          );
        })}
      </div>

      <div className="mt-5 border-t border-stone-200 pt-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-medium text-stone-800">時間を選択</p>
          <span className="text-xs text-stone-500">月曜定休・最終受付 17:00</span>
        </div>
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
          {OPENING_HOURS.map((time) => (
            (() => {
              const reserved = reservedSlots.includes(`${selectedDate}T${time}`);
              return <button
              key={time}
              className={`rounded-lg border px-2 py-2 text-sm transition ${selectedTime === time ? "border-amber-800 bg-amber-800 text-white" : selectedDate && !reserved ? "border-stone-200 bg-white text-stone-700 hover:border-amber-700" : "cursor-not-allowed border-stone-200 bg-stone-100 text-stone-400"}`}
              disabled={!selectedDate || reserved}
              onClick={() => chooseTime(time)}
              type="button"
            >
              {reserved ? "満席" : time}
            </button>;
            })()
          ))}
        </div>
      </div>
    </div>
  );
}

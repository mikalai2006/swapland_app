import dayjs from "@/utils/dayjs";
import { useEffect, useMemo, useState } from "react";

export type TimerProps = {
  startTime?: string;
  durationDays: number;
};
export type TimerData = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function getObjectTime(ms: number) {
  const checkNum = (num: number) => {
    return num < 0 ? 0 : num;
  };

  const daysMs = ms % (24 * 60 * 60 * 1000);
  const hoursMs = ms % (60 * 60 * 1000);
  const minutesMs = ms % (60 * 1000);

  const days = checkNum(Math.floor(ms / (24 * 60 * 60 * 1000)));
  const hours = checkNum(Math.floor(daysMs / (60 * 60 * 1000)));
  const minutes = checkNum(Math.floor(hoursMs / (60 * 1000)));
  const seconds = checkNum(Math.floor(minutesMs / 1000));

  return {
    days,
    hours,
    minutes,
    seconds,
  };
}

const useTimer = ({ startTime, durationDays }: TimerProps) => {
  //   console.log("timer");

  const [time, setTime] = useState<TimerData>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  if (!startTime) {
    startTime = new Date().toISOString();
  }

  if (!durationDays) {
    durationDays = 10;
  }
  const future = dayjs(startTime).add(durationDays, "days"); //, "YYYY-MM-DD HH:mm Z"
  const setDate = () => {
    const now = dayjs(new Date());
    const diff = future.diff(now);
    const diffTime = getObjectTime(diff);
    setTime(diffTime);
  };

  useEffect(() => {
    let interval = setInterval(setDate, 1000);

    return () => clearInterval(interval);
  }, []);

  const hours = useMemo(
    () => (time ? (time?.hours > 9 ? time?.hours : "0" + time?.hours) : ""),
    [time?.hours]
  );
  const minutes = useMemo(
    () =>
      time ? (time?.minutes > 9 ? time?.minutes : "0" + time?.minutes) : "",
    [time?.minutes]
  );
  const seconds = useMemo(
    () =>
      time ? (time?.seconds > 9 ? time?.seconds : "0" + time?.seconds) : "",
    [time?.seconds]
  );
  const isTimerComplete = useMemo(
    () =>
      time.seconds === 0 &&
      time.days === 0 &&
      time.days === 0 &&
      time.hours === 0
        ? true
        : false,
    [time]
  );

  return {
    time,
    days: time.days,
    hours,
    minutes,
    seconds,
    isTimerComplete,
  };
};

export { useTimer };

'use client';

import React, { useState, useEffect } from 'react';
import { Play, Pause, Square, Timer, TrendingUp, AlertCircle } from 'lucide-react';

interface FocusModeProps {
  studentId: string;
  taskId?: string;
}

interface FocusSession {
  id: string;
  studentId: string;
  taskId?: string;
  startedAt: Date;
  endedAt?: Date;
  plannedDuration: number;
  actualDuration: number;
  distractionsCount: number;
  completedSuccessfully: boolean;
  focusScore: number;
  environmentSettings?: {
    soundscapeId?: string;
    timerDuration: number;
    strictMode: boolean;
  };
}

export function FocusMode({ studentId, taskId }: FocusModeProps) {
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentSession, setCurrentSession] = useState<FocusSession | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [duration, setDuration] = useState(25); // Default 25 minutes (Pomodoro)
  const [strictMode, setStrictMode] = useState(false);

  // Timer countdown
  useEffect(() => {
    if (!isActive || isPaused) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 0) {
          handleSessionComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, isPaused]);

  // Detect distractions (tab visibility)
  useEffect(() => {
    if (!isActive || !strictMode) return;

    const handleVisibilityChange = () => {
      if (document.hidden && currentSession) {
        recordDistraction('WINDOW_BLUR');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isActive, strictMode, currentSession]);

  const startSession = async () => {
    try {
      const response = await fetch('/api/focus/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId,
          taskId,
          plannedDuration: duration,
          environmentSettings: {
            timerDuration: duration,
            strictMode,
          },
        }),
      });

      const session = await response.json();
      setCurrentSession(session);
      setTimeRemaining(duration * 60); // Convert to seconds
      setIsActive(true);

      // Enable focus mode styling
      document.documentElement.classList.add('focus-mode-active');
    } catch (error) {
      console.error('Error starting focus session:', error);
    }
  };

  const pauseSession = () => {
    setIsPaused(!isPaused);
  };

  const stopSession = async () => {
    if (!currentSession) return;

    const actualMinutes = Math.floor((duration * 60 - timeRemaining) / 60);
    const focusScore = calculateFocusScore();

    try {
      await fetch(`/api/focus/sessions/${currentSession.id}/end`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          completedSuccessfully: false,
          actualDuration: actualMinutes,
          focusScore,
        }),
      });

      resetSession();
    } catch (error) {
      console.error('Error stopping session:', error);
    }
  };

  const handleSessionComplete = async () => {
    if (!currentSession) return;

    const focusScore = calculateFocusScore();

    try {
      await fetch(`/api/focus/sessions/${currentSession.id}/end`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          completedSuccessfully: true,
          actualDuration: duration,
          focusScore,
        }),
      });

      // Show completion celebration
      showCompletionNotification();
      resetSession();
    } catch (error) {
      console.error('Error completing session:', error);
    }
  };

  const recordDistraction = async (type: string) => {
    if (!currentSession) return;

    try {
      await fetch(`/api/focus/sessions/${currentSession.id}/distractions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          duration: 0,
        }),
      });

      setCurrentSession({
        ...currentSession,
        distractionsCount: currentSession.distractionsCount + 1,
      });
    } catch (error) {
      console.error('Error recording distraction:', error);
    }
  };

  const calculateFocusScore = (): number => {
    if (!currentSession) return 0;
    const baseScore = 100;
    const distractionPenalty = currentSession.distractionsCount * 5;
    return Math.max(0, baseScore - distractionPenalty);
  };

  const showCompletionNotification = () => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('🎉 Focus Session Complete!', {
        body: `Great job! You stayed focused for ${duration} minutes.`,
        icon: '/icons/trophy.png',
      });
    }
  };

  const resetSession = () => {
    setIsActive(false);
    setIsPaused(false);
    setCurrentSession(null);
    setTimeRemaining(0);
    document.documentElement.classList.remove('focus-mode-active');
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = currentSession
    ? ((duration * 60 - timeRemaining) / (duration * 60)) * 100
    : 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-md mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Timer className="w-6 h-6 text-blue-600" />
          Focus Mode
        </h2>
        {currentSession && (
          <span className="flex items-center gap-1 text-sm text-orange-600">
            <AlertCircle className="w-4 h-4" />
            {currentSession.distractionsCount} distractions
          </span>
        )}
      </div>

      {!isActive ? (
        <>
          {/* Setup Controls */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Session Duration (minutes)
              </label>
              <div className="flex gap-2">
                {[15, 25, 30, 45, 60].map((mins) => (
                  <button
                    key={mins}
                    onClick={() => setDuration(mins)}
                    className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      duration === mins
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {mins}m
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Strict Mode
              </label>
              <input
                type="checkbox"
                checked={strictMode}
                onChange={(e) => setStrictMode(e.target.checked)}
                className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <p className="text-xs text-gray-500">
              Strict mode detects distractions like tab switches
            </p>
          </div>

          <button
            onClick={startSession}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <Play className="w-5 h-5" />
            Start Focus Session
          </button>
        </>
      ) : (
        <>
          {/* Active Session */}
          <div className="mb-6">
            <div className="text-center mb-4">
              <div className="text-5xl font-bold text-gray-900 dark:text-white mb-2">
                {formatTime(timeRemaining)}
              </div>
              <div className="text-sm text-gray-500">
                {isPaused ? 'Paused' : 'Time remaining'}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-4">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all duration-1000"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Focus Score */}
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <TrendingUp className="w-4 h-4" />
              <span>Focus Score: {calculateFocusScore()}/100</span>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex gap-3">
            <button
              onClick={pauseSession}
              className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
              {isPaused ? 'Resume' : 'Pause'}
            </button>
            <button
              onClick={stopSession}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <Square className="w-5 h-5" />
              Stop
            </button>
          </div>
        </>
      )}

      {/* Tips */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">
          💡 Focus Tips
        </h3>
        <ul className="text-xs text-blue-800 dark:text-blue-400 space-y-1">
          <li>• Turn off notifications during your session</li>
          <li>• Keep water nearby to stay hydrated</li>
          <li>• Take a 5-minute break after each session</li>
          <li>• Minimize distractions in your environment</li>
        </ul>
      </div>
    </div>
  );
}

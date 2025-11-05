'use client';

import React, { useState } from 'react';
import {
  useAccessibility,
  AccessibilityFont,
} from '@/contexts/AccessibilityContext';
import {
  Type,
  ZoomIn,
  Eye,
  Volume2,
  Focus,
  RotateCcw,
  Settings,
  X,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export function AccessibilityToolbar() {
  const { settings, updateSettings, resetSettings } = useAccessibility();
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'font' | 'display' | 'audio' | 'focus'>('font');

  const fontOptions = [
    { value: AccessibilityFont.DEFAULT, label: 'Default' },
    { value: AccessibilityFont.OPENDYSLEXIC, label: 'OpenDyslexic' },
    { value: AccessibilityFont.COMIC_SANS, label: 'Comic Sans' },
    { value: AccessibilityFont.ARIAL, label: 'Arial' },
  ];

  const backgroundColors = [
    { value: '#ffffff', label: 'White' },
    { value: '#fefae0', label: 'Cream' },
    { value: '#e0f7fa', label: 'Light Blue' },
    { value: '#f1f8e9', label: 'Light Green' },
    { value: '#f0f0f0', label: 'Light Gray' },
    { value: '#000000', label: 'Black' },
  ];

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="fixed bottom-4 right-4 z-50 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
        aria-label="Toggle accessibility toolbar"
      >
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          <span className="font-medium">Accessibility</span>
          {isExpanded ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronUp className="w-4 h-4" />
          )}
        </div>
      </button>

      {/* Toolbar Panel */}
      {isExpanded && (
        <div className="fixed bottom-20 right-4 z-50 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Accessibility Settings
            </h2>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              aria-label="Close toolbar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab('font')}
              className={`flex-1 px-4 py-2 text-sm font-medium ${
                activeTab === 'font'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              <Type className="w-4 h-4 inline mr-1" />
              Font
            </button>
            <button
              onClick={() => setActiveTab('display')}
              className={`flex-1 px-4 py-2 text-sm font-medium ${
                activeTab === 'display'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              <Eye className="w-4 h-4 inline mr-1" />
              Display
            </button>
            <button
              onClick={() => setActiveTab('audio')}
              className={`flex-1 px-4 py-2 text-sm font-medium ${
                activeTab === 'audio'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              <Volume2 className="w-4 h-4 inline mr-1" />
              Audio
            </button>
            <button
              onClick={() => setActiveTab('focus')}
              className={`flex-1 px-4 py-2 text-sm font-medium ${
                activeTab === 'focus'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              <Focus className="w-4 h-4 inline mr-1" />
              Focus
            </button>
          </div>

          {/* Content */}
          <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
            {activeTab === 'font' && (
              <>
                {/* Font Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Font Family
                  </label>
                  <select
                    value={settings.font}
                    onChange={(e) =>
                      updateSettings({ font: e.target.value as AccessibilityFont })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    {fontOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Font Size */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Font Size: {settings.fontSize}%
                  </label>
                  <input
                    type="range"
                    min="50"
                    max="200"
                    step="10"
                    value={settings.fontSize}
                    onChange={(e) =>
                      updateSettings({ fontSize: parseInt(e.target.value) })
                    }
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Small (50%)</span>
                    <span>Normal (100%)</span>
                    <span>Large (200%)</span>
                  </div>
                </div>

                {/* Line Spacing */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Line Spacing: {settings.lineSpacing}%
                  </label>
                  <input
                    type="range"
                    min="100"
                    max="250"
                    step="10"
                    value={settings.lineSpacing}
                    onChange={(e) =>
                      updateSettings({ lineSpacing: parseInt(e.target.value) })
                    }
                    className="w-full"
                  />
                </div>
              </>
            )}

            {activeTab === 'display' && (
              <>
                {/* Background Color */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Background Color
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {backgroundColors.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => updateSettings({ backgroundColor: color.value })}
                        className={`px-3 py-2 rounded-md border-2 text-sm ${
                          settings.backgroundColor === color.value
                            ? 'border-blue-500'
                            : 'border-gray-300'
                        }`}
                        style={{ backgroundColor: color.value }}
                      >
                        <span
                          className={
                            color.value === '#000000' ? 'text-white' : 'text-gray-900'
                          }
                        >
                          {color.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* High Contrast */}
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    High Contrast Mode
                  </label>
                  <input
                    type="checkbox"
                    checked={settings.highContrast}
                    onChange={(e) => updateSettings({ highContrast: e.target.checked })}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Magnifier */}
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Screen Magnifier
                  </label>
                  <input
                    type="checkbox"
                    checked={settings.magnifierEnabled}
                    onChange={(e) =>
                      updateSettings({ magnifierEnabled: e.target.checked })
                    }
                    className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {settings.magnifierEnabled && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Magnification: {settings.magnification}x
                    </label>
                    <input
                      type="range"
                      min="1.0"
                      max="3.0"
                      step="0.5"
                      value={settings.magnification}
                      onChange={(e) =>
                        updateSettings({ magnification: parseFloat(e.target.value) })
                      }
                      className="w-full"
                    />
                  </div>
                )}

                {/* Reduce Animations */}
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Reduce Animations
                  </label>
                  <input
                    type="checkbox"
                    checked={settings.reduceAnimations}
                    onChange={(e) =>
                      updateSettings({ reduceAnimations: e.target.checked })
                    }
                    className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </>
            )}

            {activeTab === 'audio' && (
              <>
                {/* Text-to-Speech */}
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Text-to-Speech
                  </label>
                  <input
                    type="checkbox"
                    checked={settings.textToSpeechEnabled}
                    onChange={(e) =>
                      updateSettings({ textToSpeechEnabled: e.target.checked })
                    }
                    className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {settings.textToSpeechEnabled && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Speech Rate: {settings.speechRate}x
                    </label>
                    <input
                      type="range"
                      min="0.5"
                      max="2.0"
                      step="0.1"
                      value={settings.speechRate}
                      onChange={(e) =>
                        updateSettings({ speechRate: parseFloat(e.target.value) })
                      }
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Slow (0.5x)</span>
                      <span>Normal (1.0x)</span>
                      <span>Fast (2.0x)</span>
                    </div>
                  </div>
                )}
              </>
            )}

            {activeTab === 'focus' && (
              <>
                {/* Focus Mode */}
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Focus Mode
                  </label>
                  <input
                    type="checkbox"
                    checked={settings.focusModeEnabled}
                    onChange={(e) =>
                      updateSettings({ focusModeEnabled: e.target.checked })
                    }
                    className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Hides distracting elements and simplifies the interface
                </p>

                {/* Reading Ruler */}
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Reading Ruler
                  </label>
                  <input
                    type="checkbox"
                    checked={settings.readingRulerEnabled}
                    onChange={(e) =>
                      updateSettings({ readingRulerEnabled: e.target.checked })
                    }
                    className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Highlights the current line while reading
                </p>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={resetSettings}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              <RotateCcw className="w-4 h-4" />
              Reset to Default
            </button>
          </div>
        </div>
      )}
    </>
  );
}

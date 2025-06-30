'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { X } from 'lucide-react';
import type { TimeSlot } from '../../types';

interface TimeSlotSelectorProps {
  timeSlots: TimeSlot[];
  onChange: (timeSlots: TimeSlot[]) => void;
  maxSlots?: number;
}

const DAYS = [
  'Lundi',
  'Mardi',
  'Mercredi',
  'Jeudi',
  'Vendredi',
  'Samedi',
  'Dimanche',
];

const TIME_OPTIONS = [
  '08:00',
  '08:30',
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '12:00',
  '12:30',
  '13:00',
  '13:30',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
  '16:30',
  '17:00',
  '17:30',
  '18:00',
  '18:30',
  '19:00',
  '19:30',
  '20:00',
  '20:30',
  '21:00',
  '21:30',
  '22:00',
];

export function TimeSlotSelector({
  timeSlots,
  onChange,
  maxSlots = 5,
}: TimeSlotSelectorProps) {
  const [newSlot, setNewSlot] = useState({
    day: '',
    startTime: '',
    endTime: '',
    isRecurring: true,
  });

  const addTimeSlot = () => {
    if (!newSlot.day || !newSlot.startTime || !newSlot.endTime) return;
    if (timeSlots.length >= maxSlots) return;

    const slot: TimeSlot = {
      id: `slot-${Date.now()}`,
      day: newSlot.day,
      startTime: newSlot.startTime,
      endTime: newSlot.endTime,
      isRecurring: newSlot.isRecurring,
    };

    onChange([...timeSlots, slot]);
    setNewSlot({ day: '', startTime: '', endTime: '', isRecurring: true });
  };

  const removeTimeSlot = (id: string) => {
    onChange(timeSlots.filter((slot) => slot.id !== id));
  };

  const updateRecurring = (id: string, isRecurring: boolean) => {
    onChange(
      timeSlots.map((slot) =>
        slot.id === id ? { ...slot, isRecurring } : slot
      )
    );
  };

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-base font-medium text-primary-text dark:text-dark-base-text">
          Créneaux de disponibilité ({timeSlots.length}/{maxSlots})
        </Label>
        <p className="text-sm text-primary-text/70 dark:text-dark-base-text/70 mb-4">
          Ajoutez vos créneaux de disponibilité (maximum {maxSlots})
        </p>
      </div>

      {/* Créneaux existants */}
      {timeSlots.length > 0 && (
        <div className="space-y-3">
          {timeSlots.map((slot) => (
            <div
              key={slot.id}
              className="bg-white dark:bg-blue-gray-dark rounded-lg shadow-lg p-4 border border-light-blue-gray/20 dark:border-royal-blue/30"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4">
                    <span className="font-medium text-primary-text dark:text-dark-base-text">
                      {slot.day}
                    </span>
                    <span className="text-primary-text/70 dark:text-dark-base-text/70">
                      {slot.startTime} - {slot.endTime}
                    </span>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`recurring-${slot.id}`}
                        checked={slot.isRecurring}
                        onCheckedChange={(checked) =>
                          updateRecurring(slot.id, checked as boolean)
                        }
                      />
                      <Label
                        htmlFor={`recurring-${slot.id}`}
                        className="text-sm text-primary-text dark:text-dark-base-text"
                      >
                        Récurrent
                      </Label>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeTimeSlot(slot.id)}
                  className="text-primary-text dark:text-dark-base-text hover:bg-royal-blue/10 dark:hover:bg-royal-blue/20"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Ajouter un nouveau créneau */}
      {timeSlots.length < maxSlots && (
        <div className="bg-white dark:bg-blue-gray-dark rounded-lg shadow-lg border border-light-blue-gray/20 dark:border-royal-blue/30">
          <div className="p-6 pb-2">
            <h3 className="text-lg font-semibold text-primary-text dark:text-dark-base-text">
              Ajouter un créneau
            </h3>
          </div>
          <div className="p-6 pt-2 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label
                  htmlFor="day"
                  className="text-primary-text dark:text-dark-base-text"
                >
                  Jour
                </Label>
                <Select
                  value={newSlot.day}
                  onValueChange={(value) =>
                    setNewSlot((prev) => ({ ...prev, day: value }))
                  }
                >
                  <SelectTrigger className="bg-white dark:bg-blue-gray-dark border-light-blue-gray/20 dark:border-royal-blue/30 text-primary-text dark:text-dark-base-text focus:border-royal-blue focus:ring-royal-blue/20">
                    <SelectValue placeholder="Choisir un jour" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-blue-gray-dark border-light-blue-gray/20 dark:border-royal-blue/30">
                    {DAYS.map((day) => (
                      <SelectItem
                        key={day}
                        value={day}
                        className="text-primary-text dark:text-dark-base-text hover:bg-royal-blue/10 dark:hover:bg-royal-blue/20 focus:bg-royal-blue/10 dark:focus:bg-royal-blue/20 data-[highlighted]:bg-royal-blue/10 dark:data-[highlighted]:bg-royal-blue/20"
                      >
                        {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label
                  htmlFor="startTime"
                  className="text-primary-text dark:text-dark-base-text"
                >
                  Heure de début
                </Label>
                <Select
                  value={newSlot.startTime}
                  onValueChange={(value) =>
                    setNewSlot((prev) => ({ ...prev, startTime: value }))
                  }
                >
                  <SelectTrigger className="bg-white dark:bg-blue-gray-dark border-light-blue-gray/20 dark:border-royal-blue/30 text-primary-text dark:text-dark-base-text focus:border-royal-blue focus:ring-royal-blue/20">
                    <SelectValue placeholder="Début" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-blue-gray-dark border-light-blue-gray/20 dark:border-royal-blue/30">
                    {TIME_OPTIONS.map((time) => (
                      <SelectItem
                        key={time}
                        value={time}
                        className="text-primary-text dark:text-dark-base-text hover:bg-royal-blue/10 dark:hover:bg-royal-blue/20 focus:bg-royal-blue/10 dark:focus:bg-royal-blue/20 data-[highlighted]:bg-royal-blue/10 dark:data-[highlighted]:bg-royal-blue/20"
                      >
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label
                  htmlFor="endTime"
                  className="text-primary-text dark:text-dark-base-text"
                >
                  Heure de fin
                </Label>
                <Select
                  value={newSlot.endTime}
                  onValueChange={(value) =>
                    setNewSlot((prev) => ({ ...prev, endTime: value }))
                  }
                >
                  <SelectTrigger className="bg-white dark:bg-blue-gray-dark border-light-blue-gray/20 dark:border-royal-blue/30 text-primary-text dark:text-dark-base-text focus:border-royal-blue focus:ring-royal-blue/20">
                    <SelectValue placeholder="Fin" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-blue-gray-dark border-light-blue-gray/20 dark:border-royal-blue/30">
                    {TIME_OPTIONS.map((time) => (
                      <SelectItem
                        key={time}
                        value={time}
                        className="text-primary-text dark:text-dark-base-text hover:bg-royal-blue/10 dark:hover:bg-royal-blue/20 focus:bg-royal-blue/10 dark:focus:bg-royal-blue/20 data-[highlighted]:bg-royal-blue/10 dark:data-[highlighted]:bg-royal-blue/20"
                      >
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="newRecurring"
                checked={newSlot.isRecurring}
                onCheckedChange={(checked) =>
                  setNewSlot((prev) => ({
                    ...prev,
                    isRecurring: checked as boolean,
                  }))
                }
              />
              <Label
                htmlFor="newRecurring"
                className="text-primary-text dark:text-dark-base-text"
              >
                Créneau récurrent (chaque semaine)
              </Label>
            </div>

            <Button
              onClick={addTimeSlot}
              disabled={!newSlot.day || !newSlot.startTime || !newSlot.endTime}
              className="w-full bg-royal-blue hover:bg-royal-blue/90 text-white"
            >
              Ajouter ce créneau
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

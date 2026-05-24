// ModeSelector component - Unified mode selection dropdown
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sparkles, Crown, Brain, Globe, Radio, Zap, Check, Code2, Hammer, GraduationCap, Rocket, Waves, ListOrdered,
  Smile, Heart, Flame, Star, Ghost, Skull, Bot, Search, BookOpen, Terminal, Footprints, Lightbulb, Compass, Gauge
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

const iconMap: Record<string, React.ElementType> = {
  Zap, Brain, Globe, Crown, Rocket, Hammer, GraduationCap, Radio, Sparkles, Waves, Smile, Heart, Flame, Star, Ghost, Skull,
  Bot, Search, BookOpen, Terminal, Footprints, Lightbulb, Compass, Gauge, Code2, ListOrdered,
};

export type ChatMode = 'auto' | 'normal' | 'pro' | 'deep' | 'web' | 'think' | 'rtm' | 'code' | 'builder' | 'study' | 'fast' | 'redwhale' | 'stepbystep';

interface CustomModeItem {
  id: string;
  name: string;
  icon: string;
  instructions: string;
}

interface ModeSelectorProps {
  selectedMode: ChatMode;
  onModeChange: (mode: ChatMode) => void;
  disabled?: boolean;
  customModes?: CustomModeItem[];
}

const modes = [
  {
    id: 'redwhale' as ChatMode,
    label: 'RW SUPER',
    icon: Waves,
    description: 'Unrestricted AI - No limits, no filters',
    color: 'text-red-500',
  },
  {
    id: 'auto' as ChatMode,
    label: 'AUTO',
    icon: Bot,
    description: 'Auto-detects best mode for your question',
    color: 'text-cyan-500',
  },
  {
    id: 'pro' as ChatMode,
    label: 'PRO',
    icon: Crown,
    description: 'Advanced detailed answers with expertise',
    color: 'text-amber-500',
  },
  {
    id: 'deep' as ChatMode,
    label: 'DEEP',
    icon: Search,
    description: 'Deep research and thorough analysis',
    color: 'text-violet-500',
  },
  {
    id: 'web' as ChatMode,
    label: 'WEB SECRET',
    icon: Globe,
    description: 'Hidden websites and secret platforms',
    color: 'text-green-500',
  },
  {
    id: 'code' as ChatMode,
    label: 'CODE',
    icon: Terminal,
    description: 'Expert coding and programming help',
    color: 'text-blue-500',
  },
  {
    id: 'builder' as ChatMode,
    label: 'HOW TO BUILD',
    icon: Hammer,
    description: 'Complete building guides step by step',
    color: 'text-orange-500',
  },
  {
    id: 'study' as ChatMode,
    label: 'STUDY',
    icon: BookOpen,
    description: 'Learn anything with smart tutoring',
    color: 'text-emerald-500',
  },
  {
    id: 'think' as ChatMode,
    label: 'PLANNING',
    icon: Brain,
    description: 'Strategic planning and deep thinking',
    color: 'text-indigo-500',
  },
  {
    id: 'stepbystep' as ChatMode,
    label: 'STEP BY STEP',
    icon: ListOrdered,
    description: 'Numbered steps only - no extra text',
    color: 'text-pink-500',
  },
  {
    id: 'rtm' as ChatMode,
    label: 'RTM',
    icon: Radio,
    description: 'Real-time mode for latest information',
    color: 'text-rose-500',
  },
  {
    id: 'fast' as ChatMode,
    label: 'FAST',
    icon: Gauge,
    description: 'Quick concise answers instantly',
    color: 'text-lime-500',
  },
  {
    id: 'normal' as ChatMode,
    label: 'NORMAL',
    icon: Sparkles,
    description: 'Standard balanced chat mode',
    color: 'text-slate-400',
  },
];

export function ModeSelector({ selectedMode, onModeChange, disabled, customModes = [] }: ModeSelectorProps) {
  const currentMode = modes.find(m => m.id === selectedMode) || modes[0];
  const customCurrent = customModes.find(m => m.id === selectedMode);
  const Icon = customCurrent ? (iconMap[customCurrent.icon] || Sparkles) : currentMode.icon;
  const displayColor = customCurrent ? 'text-primary' : currentMode.color;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          disabled={disabled}
          className="h-10 w-10 shrink-0 hover:bg-primary/10 rounded-xl transition-all"
        >
          <Icon className={cn("w-5 h-5 transition-all", displayColor)} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64 glass-panel rounded-3xl p-2 shadow-2xl">
        <DropdownMenuLabel className="px-3 py-2 text-xs font-black tracking-widest uppercase opacity-50">RED WHALE V1 MODEL</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-white/5" />
        <div className="grid gap-1 mt-1">
          {modes.map((mode) => {
            const ModeIcon = mode.icon;
            const isSelected = mode.id === selectedMode;
            
            return (
              <DropdownMenuItem
                key={mode.id}
                onClick={() => onModeChange(mode.id)}
                className={cn(
                  "cursor-pointer rounded-2xl p-3 transition-all duration-300",
                  isSelected ? "bg-primary/10 border-white/5 shadow-inner" : "hover:bg-white/5"
                )}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    <div className={cn("p-2 rounded-xl bg-background shadow-lg", mode.color)}>
                      <ModeIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className={cn("font-bold text-sm tracking-tight", isSelected ? "text-primary" : "text-foreground")}>{mode.label}</p>
                      <p className="text-[10px] text-muted-foreground/80 font-medium leading-tight">{mode.description}</p>
                    </div>
                  </div>
                  {isSelected && (
                    <motion.div layoutId="mode-check">
                      <Check className="w-4 h-4 text-primary" />
                    </motion.div>
                  )}
                </div>
              </DropdownMenuItem>
            );
          })}

          {customModes.length > 0 && (
            <>
              <DropdownMenuSeparator className="bg-white/5 my-1" />
              <DropdownMenuLabel className="px-3 py-1 text-[10px] font-black tracking-widest uppercase opacity-40">CUSTOM</DropdownMenuLabel>
            </>
          )}

          {customModes.map((mode) => {
            const CustomIcon = iconMap[mode.icon] || Sparkles;
            const isSelected = mode.id === selectedMode;
            return (
              <DropdownMenuItem
                key={mode.id}
                onClick={() => onModeChange(mode.id as ChatMode)}
                className={cn(
                  "cursor-pointer rounded-2xl p-3 transition-all duration-300",
                  isSelected ? "bg-primary/10 border-white/5 shadow-inner" : "hover:bg-white/5"
                )}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-background shadow-lg text-primary">
                      <CustomIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className={cn("font-bold text-sm tracking-tight", isSelected ? "text-primary" : "text-foreground")}>{mode.name}</p>
                      <p className="text-[10px] text-muted-foreground/80 font-medium leading-tight">Custom mode</p>
                    </div>
                  </div>
                  {isSelected && (
                    <motion.div layoutId="mode-check">
                      <Check className="w-4 h-4 text-primary" />
                    </motion.div>
                  )}
                </div>
              </DropdownMenuItem>
            );
          })}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

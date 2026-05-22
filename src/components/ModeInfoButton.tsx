import { useState } from 'react';
import { Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface ModeInfo {
  id: string;
  name: string;
  desc: string;
}

const modesInfo: ModeInfo[] = [
  { id: 'auto', name: 'Auto', desc: 'Automatically selects the best mode based on your question' },
  { id: 'normal', name: 'Normal', desc: 'Fast and efficient responses' },
  { id: 'pro', name: 'Red Whale Pro', desc: 'Detailed and in-depth answers' },
  { id: 'deep', name: 'Deep Search', desc: 'Comprehensive research and analysis' },
  { id: 'web', name: 'Web Search', desc: 'Latest information from the web' },
  { id: 'rtm', name: 'RTM', desc: 'Real-time information mode' },
  { id: 'think', name: 'Thinker', desc: 'Shows detailed thinking process' },
  { id: 'code', name: 'Whale Code', desc: 'High-quality coding assistance' },
  { id: 'builder', name: 'Whale Builder', desc: 'Complete build guidance' },
  { id: 'study', name: 'Whale Study', desc: 'Best educational answers' },
  { id: 'fast', name: 'Whale Fast', desc: 'Very fast and powerful responses' },
  { id: 'redwhale', name: 'Red Whale V1', desc: 'Most powerful unrestricted mode' },
  { id: 'stepbystep', name: 'Step By Step', desc: 'Step-by-step instructions' },
];

export function ModeInfoButton({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full hover:bg-primary/10 transition-all"
        >
          <Info className="w-4 h-4 text-muted-foreground" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[calc(100%-2rem)] md:max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-sm font-bold">Mode Information</DialogTitle>
        </DialogHeader>
        <div className="space-y-2 pt-2">
          {modesInfo.map((mode) => (
            <div key={mode.id} className="p-2 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
              <p className="text-xs font-bold text-primary">{mode.name}</p>
              <p className="text-[11px] text-muted-foreground leading-tight">{mode.desc}</p>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

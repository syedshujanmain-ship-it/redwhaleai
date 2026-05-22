import { Logo } from '@/components/Logo';

export function TypingIndicator() {
  return (
    <div className="flex gap-3 mb-6 items-start px-2">
      <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center">
        <Logo size="xs" fit />
      </div>
      <div className="flex flex-col gap-1.5 mt-0.5">
        <div className="flex items-center gap-1.5 h-5">
          <div className="relative">
            <span className="inline-block w-2 h-2 rounded-full bg-primary animate-[typing-pulse_1.4s_ease-in-out_infinite]" style={{ animationDelay: '0ms' }} />
            <span className="absolute inset-0 inline-block w-2 h-2 rounded-full bg-primary animate-[typing-glow_1.4s_ease-in-out_infinite]" style={{ animationDelay: '0ms' }} />
          </div>
          <div className="relative">
            <span className="inline-block w-2 h-2 rounded-full bg-primary animate-[typing-pulse_1.4s_ease-in-out_infinite]" style={{ animationDelay: '200ms' }} />
            <span className="absolute inset-0 inline-block w-2 h-2 rounded-full bg-primary animate-[typing-glow_1.4s_ease-in-out_infinite]" style={{ animationDelay: '200ms' }} />
          </div>
          <div className="relative">
            <span className="inline-block w-2 h-2 rounded-full bg-primary animate-[typing-pulse_1.4s_ease-in-out_infinite]" style={{ animationDelay: '400ms' }} />
            <span className="absolute inset-0 inline-block w-2 h-2 rounded-full bg-primary animate-[typing-glow_1.4s_ease-in-out_infinite]" style={{ animationDelay: '400ms' }} />
          </div>
        </div>
        <p className="text-[11px] text-muted-foreground/60 font-medium tracking-wide">
          Red Whale is thinking
          <span className="inline-block w-4 text-left">
            <span className="animate-[typing-dots_1.5s_steps(4)_infinite]">...</span>
          </span>
        </p>
      </div>
    </div>
  );
}

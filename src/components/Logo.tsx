export const LOGO_URL = '';

type LogoSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface LogoProps {
  className?: string;
  size?: LogoSize;
  fit?: boolean;
}

const sizeMap: Record<LogoSize, string> = {
  xs: 'text-[8px] leading-none',
  sm: 'text-xs leading-none',
  md: 'text-2xl leading-none',
  lg: 'text-4xl leading-none',
  xl: 'text-6xl leading-none',
};

export function Logo({ className = '', size = 'md', fit = false }: LogoProps) {
  const textSize = sizeMap[size] || sizeMap.md;
  return (
    <span className={`font-black tracking-tighter select-none inline-block ${textSize} ${className}`}>
      <span className={fit ? 'text-red-500 scale-[0.7] inline-block' : 'text-red-500'}>R</span>
      <span className={fit ? 'text-blue-500 scale-[0.7] inline-block' : 'text-blue-500'}>W</span>
    </span>
  );
}

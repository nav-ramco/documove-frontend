import { Link } from 'react-router-dom'
import { FileText, ArrowRight, Home } from 'lucide-react'

interface LogoProps {
  variant?: 'dark' | 'light'
  size?: 'sm' | 'md' | 'lg'
  linkTo?: string
}

export default function Logo({ variant = 'dark', size = 'md', linkTo = '/' }: LogoProps) {
  const textColor = variant === 'dark' ? 'text-gray-900' : 'text-white'
  const accentColor = variant === 'dark' ? 'text-primary' : 'text-white/80'
  const iconColor = variant === 'dark' ? 'text-primary' : 'text-white'

  const sizeClasses = {
    sm: { text: 'text-xl', icon: 'w-4 h-4', gap: 'gap-1' },
    md: { text: 'text-2xl', icon: 'w-5 h-5', gap: 'gap-1.5' },
    lg: { text: 'text-3xl', icon: 'w-6 h-6', gap: 'gap-2' },
  }

  const s = sizeClasses[size]

  return (
    <Link to={linkTo} className={`inline-flex items-center ${s.gap} hover:opacity-80 transition-opacity`}>
      <div className={`flex items-center ${s.gap} ${iconColor}`}>
        <FileText className={s.icon} />
        <ArrowRight className={s.icon} />
        <Home className={s.icon} />
      </div>
      <span className={`${s.text} font-bold ${textColor}`}>documove</span>
      <span className={`${s.text} font-bold ${accentColor}`}>.co.uk</span>
    </Link>
  )
}

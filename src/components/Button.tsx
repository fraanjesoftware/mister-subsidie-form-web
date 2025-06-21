import { ReactNode, MouseEventHandler } from 'react'

interface ButtonProps {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'outline'
  onClick?: MouseEventHandler<HTMLButtonElement>
  className?: string
}

const Button = ({ children, variant = 'primary', onClick, className = '' }: ButtonProps) => {
  const baseStyles = 'font-semibold py-2 px-4 rounded transition duration-200'
  
  const variants = {
    primary: 'bg-blue-500 hover:bg-blue-600 text-white',
    secondary: 'bg-gray-500 hover:bg-gray-600 text-white',
    outline: 'bg-transparent hover:bg-gray-100 text-gray-700 border border-gray-300'
  }

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export default Button
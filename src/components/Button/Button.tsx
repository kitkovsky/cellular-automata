import cn from 'classnames'

export interface ButtonProps
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  className?: string
}

export const Button = (props: ButtonProps): JSX.Element => {
  const { children, className, ...rest } = props

  return (
    <button
      className={cn(
        className,
        'rounded-lg bg-gray80 px-4 py-2 text-white transition-colors hover:bg-white hover:text-gray60',
      )}
      {...rest}
    >
      {children}
    </button>
  )
}

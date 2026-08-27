// src/components/Button.jsx
// One button primitive for the whole page. Renders an <a> when given href so
// links stay links (and keyboard/middle-click behaviour is preserved).

import './Button.css'

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  href,
  icon,
  iconRight,
  className = '',
  ...rest
}) {
  const Tag = href ? 'a' : 'button'
  const sizeClass = size === 'md' ? '' : `btn--${size}`

  // External links get the usual safety attributes.
  const linkProps =
    href && /^https?:/.test(href) ? { target: '_blank', rel: 'noreferrer noopener' } : {}

  return (
    <Tag
      href={href}
      className={`btn btn--${variant} ${sizeClass} ${className}`}
      {...linkProps}
      {...rest}
    >
      {icon ? <span className="btn__icon">{icon}</span> : null}
      <span>{children}</span>
      {iconRight ? <span className="btn__icon btn__icon--shift">{iconRight}</span> : null}
    </Tag>
  )
}

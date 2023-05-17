import * as React from 'react'

const Curve = (props) => {
  const { length, coor } = props
  return (
    <svg width={length} height={60}>
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#70b2d9" />
          <stop offset="100%" stopColor="#39e5b6" />
        </linearGradient>
      </defs>
      {Object.entries(coor).map(([key, c], id) => {
        if (c.current) {
          const L = c.current.offsetLeft + 40
          return (
            <path
              key={id}
              d={`M 50 0 L 50 10 Q 50 30 70 30 L ${L - 20} 30 Q ${L} 30 ${L} 60 L ${L + 20} 80`}
              stroke="url(#gradient)"
              strokeWidth="4"
              fill="none"
            />
          )
        } else {
          return (
            <path
            />
          )
        }
      })}
    </svg>
  )
}
export default Curve

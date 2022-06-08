import { Timeline } from '../../dist'
import * as React from 'react'
import FavoriteIcon from '@mui/icons-material/Favorite'
import makeStyles from '@mui/styles/makeStyles'
import cn from 'classnames'
import { ExampleComponentFactory, ExampleEvent, ExampleProps } from './types'

const backgroundColor = 'white'
const foregroundColor = 'rgb(233, 30, 99, 0.5)'

const useStyles = makeStyles({
  background: {
    color: backgroundColor,
    fill: backgroundColor,
    stroke: backgroundColor,
    strokeWidth: 2,
  },
  foreground: {
    color: foregroundColor,
    fill: foregroundColor,
    stroke: foregroundColor,
    strokeWidth: 2,
  },
  selected: {
    stroke: 'grey',
    strokeDasharray: '4',
  },
  pinned: {
    stroke: 'black',
  },
})

export const CustomizedTimeline = (props: ExampleProps) => {
  const classes = useStyles()

  // Often, it is useful to draw events semi-transparently, such that 'event accumulations' become visible
  // This raises the issue of grid-lines shining through
  // To give you the possibility to draw opaque event marks in the background and semi-transparent events in the
  // foreground, the eventComponent factory is invoked twice (with the 'role' parameter distinguishing the calls)

  const eventComponent: ExampleComponentFactory = (e: ExampleEvent, role, timeScale, y) => {
    const className =
      role === 'background'
        ? classes.background
        : cn(classes.foreground, e.isSelected ? classes.selected : '', e.isPinned ? classes.pinned : '')
    const size = 24
    const startX = timeScale(e.startTimeMillis)!
    if (e.endTimeMillis === undefined) {
      const iconTranslate = `translate(${startX - size / 2}, ${y - size / 2})`
      return (
        <g transform={`${iconTranslate}`}>
          <FavoriteIcon className={className} width={size} height={size} />
        </g>
      )
    } else {
      const endX = timeScale(e.endTimeMillis)!
      const width = endX - startX
      return (
        <g>
          <rect className={className} x={startX} y={y - size / 2} width={width} height={size} rx={5} />
        </g>
      )
    }
  }

  return <Timeline {...props} eventComponent={eventComponent} />
}

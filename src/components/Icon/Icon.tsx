import React, { useMemo } from 'react'
import { ReactComponent as AccommodationIcon } from '../../assets/icons/accommodation.svg'
import { ReactComponent as AlertIcon } from '../../assets/icons/alert.svg'
import { ReactComponent as ArrowDownIcon } from '../../assets/icons/arrow-down.svg'
import { ReactComponent as ArrowLeftIcon } from '../../assets/icons/arrow-left.svg'
import { ReactComponent as ArrowRightIcon } from '../../assets/icons/arrow-right.svg'
import { ReactComponent as ArrowUpIcon } from '../../assets/icons/arrow-up.svg'
import { ReactComponent as BinIcon } from '../../assets/icons/bin.svg'
import { ReactComponent as BratislavaLogoIcon } from '../../assets/icons/bratislava-logo.svg'
import { ReactComponent as CalendarIcon } from '../../assets/icons/calendar.svg'
import { ReactComponent as CastleIcon } from '../../assets/icons/castle.svg'
import { ReactComponent as CaretDownIcon } from '../../assets/icons/caret-down.svg'
import { ReactComponent as ChangingRoomIcon } from '../../assets/icons/changing-room.svg'
import { ReactComponent as ChangingRoomsIcon } from '../../assets/icons/changing_rooms.svg'
import { ReactComponent as CheckmarkIcon } from '../../assets/icons/checkmark.svg'
import { ReactComponent as ChevronIcon } from '../../assets/icons/chevron.svg'
import { ReactComponent as CloseIcon } from '../../assets/icons/close.svg'
import { ReactComponent as CreditCardIcon } from '../../assets/icons/credit-card.svg'
import { ReactComponent as DownloadIcon } from '../../assets/icons/download.svg'
import { ReactComponent as DownloadFileIcon } from '../../assets/icons/download-file.svg'
import { ReactComponent as EuroCoinIcon } from '../../assets/icons/euro-coin.svg'
import { ReactComponent as FacebookLogoIcon } from '../../assets/icons/facebook-logo.svg'
import { ReactComponent as FoodIcon } from '../../assets/icons/food.svg'
import { ReactComponent as FootballIcon } from '../../assets/icons/football.svg'
import { ReactComponent as GroupsIcon } from '../../assets/icons/groups.svg'
import { ReactComponent as HashtagIcon } from '../../assets/icons/hashtag.svg'
import { ReactComponent as InfoIcon } from '../../assets/icons/info.svg'
import { ReactComponent as InstagramLogoIcon } from '../../assets/icons/instagram-logo.svg'
import { ReactComponent as LoginIcon } from '../../assets/icons/login.svg'
import { ReactComponent as MailIcon } from '../../assets/icons/mail.svg'
import { ReactComponent as MenuIcon } from '../../assets/icons/menu.svg'
import { ReactComponent as NavigateIcon } from '../../assets/icons/navigate.svg'
import { ReactComponent as ParkingIcon } from '../../assets/icons/parking.svg'
import { ReactComponent as PencilIcon } from '../../assets/icons/pencil.svg'
import { ReactComponent as PlaygroundIcon } from '../../assets/icons/playground.svg'
import { ReactComponent as PlusIcon } from '../../assets/icons/plus.svg'
import { ReactComponent as ProfileIcon } from '../../assets/icons/profile.svg'
import { ReactComponent as QuestionMarkIcon } from '../../assets/icons/question-mark.svg'
import { ReactComponent as RestaurantIcon } from '../../assets/icons/restaurant.svg'
import { ReactComponent as RetryIcon } from '../../assets/icons/retry.svg'
import { ReactComponent as SendIcon } from '../../assets/icons/send.svg'
import { ReactComponent as ShowerIcon } from '../../assets/icons/shower.svg'
import { ReactComponent as SpinnerIcon } from '../../assets/icons/spinner.svg'
import { ReactComponent as SwimmingManIcon } from '../../assets/icons/swimming-man.svg'
import { ReactComponent as ThreeDotsIcon } from '../../assets/icons/three-dots.svg'
import { ReactComponent as TicketsIcon } from '../../assets/icons/tickets.svg'
import { ReactComponent as TicketsBlackIcon } from '../../assets/icons/tickets-black.svg'
import { ReactComponent as UserIcon } from '../../assets/icons/user.svg'
import { ReactComponent as UploadIcon } from '../../assets/icons/upload.svg'
import { ReactComponent as VolleyballIcon } from '../../assets/icons/volleyball.svg'
import { ReactComponent as WarningIcon } from '../../assets/icons/warning.svg'
import { ReactComponent as WavesIcon } from '../../assets/icons/waves.svg'
import { ReactComponent as YoutubeLogoIcon } from '../../assets/icons/youtube-logo.svg'

import './Icon.css'

const iconMap = {
  accommodation: AccommodationIcon,
  alert: AlertIcon,
  // add other icons here, using the format "file-name: IconComponent"
  'arrow-down': ArrowDownIcon,
  'arrow-left': ArrowLeftIcon,
  'arrow-right': ArrowRightIcon,
  'arrow-up': ArrowUpIcon,
  bin: BinIcon,
  'bratislava-logo': BratislavaLogoIcon,
  calendar: CalendarIcon,
  castle: CastleIcon,
  'caret-down': CaretDownIcon,
  'changing-room': ChangingRoomIcon,
  changing_rooms: ChangingRoomsIcon,
  checkmark: CheckmarkIcon,
  chevron: ChevronIcon,
  close: CloseIcon,
  'credit-card': CreditCardIcon,
  download: DownloadIcon,
  'download-file': DownloadFileIcon,
  'euro-coin': EuroCoinIcon,
  'facebook-logo': FacebookLogoIcon,
  food: FoodIcon,
  football: FootballIcon,
  groups: GroupsIcon,
  hashtag: HashtagIcon,
  info: InfoIcon,
  'instagram-logo': InstagramLogoIcon,
  login: LoginIcon,
  mail: MailIcon,
  menu: MenuIcon,
  navigate: NavigateIcon,
  parking: ParkingIcon,
  pencil: PencilIcon,
  playground: PlaygroundIcon,
  plus: PlusIcon,
  profile: ProfileIcon,
  'question-mark': QuestionMarkIcon,
  restaurant: RestaurantIcon,
  retry: RetryIcon,
  send: SendIcon,
  shower: ShowerIcon,
  spinner: SpinnerIcon,
  'swimming-man': SwimmingManIcon,
  'three-dots': ThreeDotsIcon,
  tickets: TicketsIcon,
  'tickets-black': TicketsBlackIcon,
  user: UserIcon,
  upload: UploadIcon,
  volleyball: VolleyballIcon,
  warning: WarningIcon,
  waves: WavesIcon,
  'youtube-logo': YoutubeLogoIcon,
}

export type IconName = keyof typeof iconMap

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: IconName
  color?: 'primary' | 'secondary' | 'white' | 'fontBlack' | 'blueish'
  className?: string
}

const Icon = ({ name, color, className = '', ...rest }: IconProps) => {
  const IconComponent = useMemo(() => iconMap[name], [name])

  return (
    <div className={`icon ${className} ${color}`}>
      <IconComponent {...rest} />
    </div>
  )
}

export default Icon

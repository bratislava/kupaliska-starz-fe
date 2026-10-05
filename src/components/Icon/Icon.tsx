import { SVGProps, useMemo } from 'react'

import AccommodationIcon from '@/assets/icons/accommodation.svg'
import AlertIcon from '@/assets/icons/alert.svg'
import ApplePayIcon from '@/assets/icons/apple-pay.svg'
import ArrowDownIcon from '@/assets/icons/arrow-down.svg'
import ArrowLeftIcon from '@/assets/icons/arrow-left.svg'
import ArrowRightIcon from '@/assets/icons/arrow-right.svg'
import ArrowUpIcon from '@/assets/icons/arrow-up.svg'
import BinIcon from '@/assets/icons/bin.svg'
import BratislavaLogoIcon from '@/assets/icons/bratislava-logo.svg'
import CalendarIcon from '@/assets/icons/calendar.svg'
import CaretDownIcon from '@/assets/icons/caret-down.svg'
import CastleIcon from '@/assets/icons/castle.svg'
import ChangingRoomsIcon from '@/assets/icons/changing_rooms.svg'
import ChangingRoomIcon from '@/assets/icons/changing-room.svg'
import CheckmarkIcon from '@/assets/icons/checkmark.svg'
import ChevronIcon from '@/assets/icons/chevron.svg'
import CloseIcon from '@/assets/icons/close.svg'
import CreditCardIcon from '@/assets/icons/credit-card.svg'
import DownloadIcon from '@/assets/icons/download.svg'
import DownloadFileIcon from '@/assets/icons/download-file.svg'
import EuroCoinIcon from '@/assets/icons/euro-coin.svg'
import FacebookLogoIcon from '@/assets/icons/facebook-logo.svg'
import FoodIcon from '@/assets/icons/food.svg'
import FootballIcon from '@/assets/icons/football.svg'
import GooglePayIcon from '@/assets/icons/google-pay.svg'
import GroupsIcon from '@/assets/icons/groups.svg'
import HashtagIcon from '@/assets/icons/hashtag.svg'
import InfoIcon from '@/assets/icons/info.svg'
import InstagramLogoIcon from '@/assets/icons/instagram-logo.svg'
import LoginIcon from '@/assets/icons/login.svg'
import MailIcon from '@/assets/icons/mail.svg'
import MenuIcon from '@/assets/icons/menu.svg'
import MinusIcon from '@/assets/icons/minus.svg'
import NavigateIcon from '@/assets/icons/navigate.svg'
import ParkingIcon from '@/assets/icons/parking.svg'
import PencilIcon from '@/assets/icons/pencil.svg'
import PlaygroundIcon from '@/assets/icons/playground.svg'
import PlusIcon from '@/assets/icons/plus.svg'
import ProfileIcon from '@/assets/icons/profile.svg'
import QuestionMarkIcon from '@/assets/icons/question-mark.svg'
import RestaurantIcon from '@/assets/icons/restaurant.svg'
import RetryIcon from '@/assets/icons/retry.svg'
import SendIcon from '@/assets/icons/send.svg'
import ShowerIcon from '@/assets/icons/shower.svg'
import SpinnerIcon from '@/assets/icons/spinner.svg'
import StarzLogoIcon from '@/assets/icons/starz_logo.svg'
import SwimmingManIcon from '@/assets/icons/swimming-man.svg'
import ThreeDotsIcon from '@/assets/icons/three-dots.svg'
import TicketsIcon from '@/assets/icons/tickets.svg'
import TicketsBlackIcon from '@/assets/icons/tickets-black.svg'
import UploadIcon from '@/assets/icons/upload.svg'
import UserIcon from '@/assets/icons/user.svg'
import VolleyballIcon from '@/assets/icons/volleyball.svg'
import WarningIcon from '@/assets/icons/warning.svg'
import WavesIcon from '@/assets/icons/waves.svg'
import YoutubeLogoIcon from '@/assets/icons/youtube-logo.svg'

const iconMap = {
  accommodation: AccommodationIcon,
  alert: AlertIcon,
  // add other icons here, using the format "file-name: IconComponent"
  'apple-pay': ApplePayIcon,
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
  'google-pay': GooglePayIcon,
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
  minus: MinusIcon,
  profile: ProfileIcon,
  'question-mark': QuestionMarkIcon,
  restaurant: RestaurantIcon,
  retry: RetryIcon,
  send: SendIcon,
  shower: ShowerIcon,
  spinner: SpinnerIcon,
  'starz-logo': StarzLogoIcon,
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

interface IconProps extends SVGProps<SVGSVGElement> {
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

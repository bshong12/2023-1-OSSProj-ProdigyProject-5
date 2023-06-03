import Link from "next/link"
import tw from "twin.macro"
import { SvgLogo, Img, StyledLink } from "../components"
import SEO from "../next-seo.config"

const Logo = ({ url, showName, name }) => {
  const currLink = url || "/buildings"
  const title = name || SEO.defaultTitle
  return (
    <Link href={currLink} passHref>
        <StyledLink className="nav-title" tw="font-hero text-neutral-9 inline-flex items-center ">
          <SvgLogo width={120} />
          {showName && <span>{title}</span>}
        </StyledLink>
    </Link>
  )
}
export default Logo

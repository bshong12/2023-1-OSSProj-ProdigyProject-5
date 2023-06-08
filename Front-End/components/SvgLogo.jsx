const SvgLogo = (props) => ( //로고 기본 스타일 지정
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    viewBox="0 0 432 288"
    style={{
      enableBackground: "new 0 0 432 288",
    }}
    xmlSpace="preserve"
    {...props}
  >
    <image
      style={{
        overflow: "visible",
      }}
      width={850}
      height={300}
      xlinkHref="/logo.svg"
      transform="translate(16 78.783) scale(.4348)"
    />
  </svg>
)

export default SvgLogo

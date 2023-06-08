const ExternalLink = ({ href, children }) => ( //외부 링크 컴포넌트
  <a target="_blank" rel="noopener noreferrer" href={href}>
    {children}
  </a>
)

export default ExternalLink

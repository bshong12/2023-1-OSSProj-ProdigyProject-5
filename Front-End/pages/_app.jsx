import GlobalStyles from "/baseCSS"
import { DefaultSeo } from "next-seo"
import { ThemeProvider } from "next-themes"
import SEO from "../next-seo.config"
import { createWrapper } from "next-redux-wrapper"
import store from "../redux/store"

//페이지의 전역 스타일 지정
function App({ Component, pageProps }) {
  return (
    <ThemeProvider
      defaultTheme="light"
      enableSystem={true}
      enableColorScheme={true}
      themes={["light", "dark"]}
      forcedTheme={Component.theme || null}
      disableTransitionOnChange
    >
      <DefaultSeo {...SEO} />
      <GlobalStyles />
      <Component {...pageProps} />
    </ThemeProvider>
  )
}

//리덕스를 사용하기 위한 처리
const wrapper = createWrapper(() => store);

export default wrapper.withRedux(App);
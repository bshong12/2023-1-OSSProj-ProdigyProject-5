import GlobalStyles from "/baseCSS"
import { DefaultSeo } from "next-seo"
import { ThemeProvider } from "next-themes"
import SEO from "../next-seo.config"
import { createWrapper } from "next-redux-wrapper"
import store from "../redux/store"

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

const wrapper = createWrapper(() => store);

export default wrapper.withRedux(App);
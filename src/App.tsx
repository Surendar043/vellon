import { CodeShowcase } from './components/CodeShowcase'
import { Cta } from './components/Cta'
import { Faq } from './components/Faq'
import { Features } from './components/Features'
import { Footer } from './components/Footer'
import { Hero } from './components/Hero'
import { LogoStrip } from './components/LogoStrip'
import { Nav } from './components/Nav'
import { Playground } from './components/Playground'
import { Pricing } from './components/Pricing'
import { Stats } from './components/Stats'
import { Testimonial } from './components/Testimonial'
import { ValueProps } from './components/ValueProps'
import { useTheme } from './hooks/useTheme'

export default function App() {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="page">
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <Nav theme={theme} onToggleTheme={toggleTheme} />

      <main id="main">
        <Hero />
        <LogoStrip />
        <ValueProps />
        <Features />
        <Playground />
        <CodeShowcase />
        <Stats />
        <Pricing />
        <Testimonial />
        <Faq />
        <Cta />
      </main>

      <Footer />
    </div>
  )
}

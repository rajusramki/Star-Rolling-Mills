import { useScrollAnimations } from './hooks/useScrollAnimations'
import { Header } from './components/sections/Header'
import { HeroSection } from './components/sections/HeroSection'
import { IndustrialImageSection } from './components/sections/IndustrialImageSection'
import { StatisticsBar } from './components/sections/StatisticsBar'
import { AboutSection } from './components/sections/AboutSection'
import { CapabilitiesSection } from './components/sections/CapabilitiesSection'
import { InfrastructureSection } from './components/sections/InfrastructureSection'
import { ProductsSection } from './components/sections/ProductsSection'
import { ApplicationsSection } from './components/sections/ApplicationsSection'
import { IndustriesSection } from './components/sections/IndustriesSection'
import { ProcessSection } from './components/sections/ProcessSection'
import { HistoryTimeline } from './components/sections/HistoryTimeline'
import { ContactCTA } from './components/sections/ContactCTA'
import { ContactSection } from './components/sections/ContactSection'
import { Footer } from './components/sections/Footer'

export default function App() {
  useScrollAnimations()

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Header />
      <main id="main">
        <HeroSection />
        <IndustrialImageSection />
        <StatisticsBar />
        <AboutSection />
        <CapabilitiesSection />
        <InfrastructureSection />
        <ProductsSection />
        <ApplicationsSection />
        <IndustriesSection />
        <ProcessSection />
        <HistoryTimeline />
        <ContactCTA />
        <ContactSection />
      </main>
      <Footer />
    </>
  )
}

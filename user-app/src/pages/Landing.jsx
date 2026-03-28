import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { HiArrowRight, HiShieldCheck, HiLightningBolt, HiChartBar, HiTrendingUp, HiGlobe, HiCurrencyDollar, HiUserGroup } from 'react-icons/hi';
import api from '../lib/api';
import PortfolioCard from '../components/portfolio/PortfolioCard';
import { CardSkeleton } from '../components/ui/LoadingSkeleton';

export default function Landing() {
  const { data: featured, isLoading } = useQuery({
    queryKey: ['featured-portfolios'],
    queryFn: () => api.get('/portfolios/featured').then(r => r.data.data.portfolios),
  });

  return (
    <div className="min-h-screen noise-bg">
      {/* Hero */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        {/* Mesh gradient background */}
        <div className="absolute inset-0">
          <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-cyan-500/[0.07] rounded-full blur-[120px] anim-glow" />
          <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-violet-500/[0.05] rounded-full blur-[120px] anim-glow" style={{ animationDelay: '1.5s' }} />
          <div className="absolute top-[40%] left-[50%] w-[400px] h-[400px] bg-emerald-500/[0.04] rounded-full blur-[100px]" />
        </div>
        {/* Grid lines */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="max-w-3xl">
            <div className="anim-fade-up inline-flex items-center gap-2.5 bg-white/[0.04] backdrop-blur-sm rounded-full px-5 py-2 mb-8 border border-white/[0.06]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
              </span>
              <span className="text-sm text-gray-400 font-medium">Institutional-Grade Trading Portfolios</span>
            </div>

            <h1 className="anim-fade-up d1 text-[3.5rem] md:text-[4.5rem] lg:text-[5.5rem] font-extrabold leading-[1.05] tracking-tight mb-8">
              <span className="text-white">Invest in</span><br />
              <span className="gradient-text">Expert-Curated</span><br />
              <span className="text-white">Portfolios</span>
            </h1>

            <p className="anim-fade-up d2 text-lg md:text-xl text-gray-400 mb-10 max-w-xl leading-relaxed">
              Access verified trading strategies from professional partners. Transparent performance, real-time analytics, one platform.
            </p>

            <div className="anim-fade-up d3 flex flex-col sm:flex-row gap-4 mb-16">
              <Link to="/portfolios" className="btn-primary text-center text-base group inline-flex items-center justify-center gap-2">
                Explore Portfolios
                <HiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/register" className="btn-secondary text-center text-base">
                Create Account
              </Link>
            </div>

            {/* Metrics */}
            <div className="anim-fade-up d4 flex gap-12">
              {[
                { value: '$2.4M+', label: 'Trading Volume' },
                { value: '150+', label: 'Portfolios' },
                { value: '99.9%', label: 'Uptime' },
              ].map((m, i) => (
                <div key={i}>
                  <p className="text-2xl md:text-3xl font-bold text-white">{m.value}</p>
                  <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-medium">{m.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-28 relative">
        <div className="absolute inset-0 mesh-gradient" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-20">
            <p className="anim-fade-up text-cyan-400 text-sm font-semibold uppercase tracking-[0.2em] mb-4">Why Osvald</p>
            <h2 className="anim-fade-up d1 text-4xl md:text-5xl font-bold text-white mb-5">Built for Serious Investors</h2>
            <p className="anim-fade-up d2 text-gray-400 max-w-2xl mx-auto text-lg">Professional-grade infrastructure meets elegant simplicity.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: HiShieldCheck, title: 'Verified Partners', desc: 'Every portfolio manager undergoes rigorous vetting and compliance checks.', color: 'cyan' },
              { icon: HiChartBar, title: 'Live Analytics', desc: 'Real-time performance tracking with transparent historical data.', color: 'emerald' },
              { icon: HiLightningBolt, title: 'Instant Access', desc: 'Purchase and unlock portfolio strategies immediately.', color: 'violet' },
              { icon: HiTrendingUp, title: 'Multi-Market', desc: 'Stocks, crypto, forex, commodities — diversify across markets.', color: 'amber' },
            ].map((f, i) => {
              const colors = { cyan: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20', emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', violet: 'text-violet-400 bg-violet-500/10 border-violet-500/20', amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20' };
              return (
                <div key={i} className={`anim-fade-up d${i + 1} card-hover p-7 group`}>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 border ${colors[f.color]} group-hover:scale-110 transition-transform duration-500`}>
                    <f.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-white mb-2 text-lg">{f.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Portfolios */}
      <section className="py-28 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-14">
            <div>
              <p className="text-cyan-400 text-sm font-semibold uppercase tracking-[0.2em] mb-4">Curated Selection</p>
              <h2 className="text-4xl font-bold text-white">Featured Portfolios</h2>
            </div>
            <Link to="/portfolios" className="btn-ghost hidden sm:flex items-center gap-2 group">
              View All <HiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {isLoading ? Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />) :
              featured?.length > 0 ? featured.slice(0, 4).map((p, i) => (
                <div key={p._id} className={`anim-fade-up d${i + 1}`}><PortfolioCard portfolio={p} /></div>
              )) : (
                <div className="col-span-full text-center py-20">
                  <p className="text-gray-500 text-lg">No portfolios available yet.</p>
                  <p className="text-gray-600 text-sm mt-2">Check back soon for expert-curated strategies.</p>
                </div>
              )}
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="py-20 border-y border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: HiGlobe, stat: '24/7', label: 'Market Coverage', desc: 'Global markets monitored continuously' },
              { icon: HiCurrencyDollar, stat: '0%', label: 'Hidden Fees', desc: 'Transparent pricing on every portfolio' },
              { icon: HiUserGroup, stat: '100%', label: 'Verified', desc: 'Every partner is rigorously vetted' },
            ].map((item, i) => (
              <div key={i} className={`anim-fade-up d${i + 1} flex items-center gap-5 p-6 rounded-2xl hover:bg-white/[0.02] transition-all duration-500`}>
                <div className="w-14 h-14 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{item.stat} <span className="text-sm font-medium text-gray-500">{item.label}</span></p>
                  <p className="text-sm text-gray-500 mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-28 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/[0.06] rounded-full blur-[150px]" />
        </div>
        <div className="max-w-3xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to Start?</h2>
          <p className="text-xl text-gray-400 mb-10">Join investors who trust Osvald for professional portfolio management.</p>
          <Link to="/register" className="btn-primary text-lg py-4 px-10 inline-flex items-center gap-2 group">
            Create Free Account
            <HiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
}

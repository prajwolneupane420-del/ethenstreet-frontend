import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchHomeHero } from '../services/productService';

const Hero = () => {
  const [hero, setHero] = useState({
    imageUrl: '',
    title: 'Futuristic streetwear built for every drop day.',
    subtitle: 'Anime heat, superhero staples and bold silhouettes crafted for the next-gen wardrobe.',
    badge: 'Since 2019',
    hotImageUrl: '',
    hotTitle: 'Anime tees under Rs. 599'
  });

  useEffect(() => {
    fetchHomeHero().then(setHero).catch(() => {});
  }, []);

  return (
    <section className="container-shell pt-8">
      <div className="relative overflow-hidden rounded-[2rem] shadow-soft">
        {hero.imageUrl ? (
          <img src={hero.imageUrl} alt={hero.title} className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#ffffff44,transparent_35%),linear-gradient(135deg,#1b4b88,#0a1730)]" />
        )}
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative grid min-h-[28rem] md:grid-cols-[1.2fr_0.8fr]">
          <div className="m-4 rounded-[1.75rem] border border-white/20 bg-white/10 p-8 text-white backdrop-blur-md sm:m-6 sm:p-10 lg:m-8 lg:p-14">
            <p className="mb-4 inline-flex rounded-full bg-white/20 px-4 py-2 text-xs uppercase tracking-[0.2em]">{hero.badge}</p>
            <h1 className="max-w-xl font-heading text-4xl font-extrabold leading-tight sm:text-5xl">{hero.title}</h1>
            <p className="mt-5 max-w-lg text-sm text-slate-200 sm:text-base">{hero.subtitle}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/shop" className="btn-primary bg-white text-brand-navy">Shop Now</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

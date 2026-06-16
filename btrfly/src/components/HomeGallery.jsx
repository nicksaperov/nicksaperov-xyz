import { ArrowRight } from 'lucide-react';
import Nav from './Nav';

export default function HomeGallery() {
  return (
    <div className="min-h-dvh bg-white pb-8 font-sans text-black selection:bg-black selection:text-white">
      <Nav activeNav="who" />

      <main className="mx-auto max-w-[1600px] px-4 pt-8 md:px-8 md:pt-16">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-12">
          <div className="flex flex-col gap-12 md:gap-24">
            <div className="flex flex-col gap-2">
              <div className="group relative aspect-[4/5] w-full overflow-hidden bg-gray-100">
                <img
                  src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop"
                  alt="Portrait BW"
                  className="h-full w-full object-cover grayscale transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <span className="text-[10px] font-bold tracking-widest text-gray-400 md:text-xs">
                <span className="md:hidden">03</span>
                <span className="hidden md:inline">01</span>
              </span>
            </div>
            <span className="mt-8 text-[10px] font-bold tracking-widest text-gray-400 md:mt-0 md:text-xs">
              <span className="md:hidden">08</span>
              <span className="hidden md:inline">07</span>
            </span>
          </div>

          <div className="flex flex-col gap-12 md:gap-24 md:pt-12">
            <span className="hidden text-[10px] font-bold tracking-widest text-gray-400 md:block md:text-xs">
              02
            </span>
            <div className="flex flex-col gap-2">
              <div className="group relative aspect-[4/5] w-full overflow-hidden bg-gray-100">
                <img
                  src="https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=800&auto=format&fit=crop"
                  alt="Kid"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <span className="text-[10px] font-bold tracking-widest text-gray-400 md:text-xs">
                <span className="md:hidden">01</span>
                <span className="hidden md:inline">03</span>
              </span>
            </div>
            <span className="mt-8 text-[10px] font-bold tracking-widest text-gray-400 md:hidden md:text-xs">
              09
            </span>
            <span className="mt-12 hidden text-[10px] font-bold tracking-widest text-gray-400 md:block md:text-xs">
              08
            </span>
          </div>

          <div className="flex flex-col gap-12 md:gap-24">
            <div className="hidden w-full justify-between md:flex">
              <span className="text-[10px] font-bold tracking-widest text-gray-400 md:text-xs">
                04
              </span>
              <span className="text-[10px] font-bold tracking-widest text-gray-400 md:text-xs">
                05
              </span>
            </div>
            <span className="mt-12 hidden text-[10px] font-bold tracking-widest text-gray-400 md:block md:text-xs">
              09
            </span>
            <div className="flex flex-col gap-2 md:mt-24">
              <div className="group relative aspect-[3/4] w-full overflow-hidden bg-gray-100 md:w-4/5">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop"
                  alt="Portrait Girl BW"
                  className="h-full w-full object-cover grayscale transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <span className="text-[10px] font-bold tracking-widest text-gray-400 md:text-xs">
                <span className="md:hidden">05</span>
                <span className="hidden md:inline">10</span>
              </span>
            </div>
          </div>

          <div className="hidden flex-col gap-12 pt-8 md:flex md:gap-24">
            <div className="flex flex-col gap-2">
              <div className="group relative aspect-[4/5] w-full overflow-hidden bg-gray-100">
                <img
                  src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=800&auto=format&fit=crop"
                  alt="Forest Portrait"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <span className="text-[10px] font-bold tracking-widest text-gray-400 md:text-xs">
                06
              </span>
            </div>
            <span className="mt-12 text-[10px] font-bold tracking-widest text-gray-400 md:text-xs">
              11
            </span>
            <span className="mt-12 text-[10px] font-bold tracking-widest text-gray-400 md:text-xs">
              12
            </span>
          </div>
        </div>

        <div className="mt-24 flex flex-col items-start justify-between gap-16 md:mt-40 md:flex-row md:items-end md:gap-8">
          <div className="max-w-xl md:max-w-2xl">
            <p className="mb-8 text-[17px] font-medium leading-[1.3] tracking-tight text-black md:mb-10 md:text-[22px] md:leading-[1.25]">
              You are a presence woven from connections and collaborations as well as
              intertwined with hundreds of stories and experiences making you an
              inseparable part of this space where we are fellow travelers alongside
              researchers and designers and visionaries who do not simply showcase work
              but rather open up our inner worlds to ignite a shared wave so look closely
              at those around you and find your resonance.
            </p>
            <a
              href="#co-create"
              className="flex w-max items-center gap-2 text-sm font-bold uppercase text-brand transition-all duration-300 hover:gap-4 hover:opacity-80 md:text-base"
            >
              <ArrowRight size={18} strokeWidth={2.5} /> CO-CREATE
            </a>
          </div>
        </div>

        <div className="mt-24 flex flex-col-reverse items-start justify-between overflow-hidden pt-8 md:mt-32 md:flex-row md:items-end">
          <p className="mt-8 pb-2 text-sm font-semibold tracking-tight text-gray-500 md:mt-0 md:pb-6 md:text-xl">
            A space for collaboration &amp; community
          </p>
          <h1 className="-mb-2 select-none text-[25vw] font-black uppercase leading-[0.75] tracking-tighter md:-mb-5 md:-mr-4 md:text-[18vw]">
            BTRFLY
            <sup className="relative -ml-2 align-top text-[8vw] font-bold md:-ml-4 md:top-[2vw] md:text-[4vw]">
              ®
            </sup>
          </h1>
        </div>
      </main>
    </div>
  );
}

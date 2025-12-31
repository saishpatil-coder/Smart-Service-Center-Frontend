import { ArrowRight } from "lucide-react";

export default function CTA() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto bg-blue-600 rounded-[3rem] p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl shadow-blue-200">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

        <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-none mb-8">
          Ready to digitize your workshop?
        </h2>
        <p className="text-blue-100 text-lg mb-12 max-w-xl mx-auto font-medium">
          Join 500+ service centers managing their workforce and inventory with
          our smart system.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="bg-white text-blue-600 px-10 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2">
            Start Free Trial <ArrowRight size={18} />
          </button>
          <button className="bg-blue-700 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-800 transition-all">
            Contact Sales
          </button>
        </div>
      </div>
    </section>
  );
}

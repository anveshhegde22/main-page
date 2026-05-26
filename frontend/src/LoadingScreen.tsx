interface LoadingScreenProps {
  dark?: boolean;
}

export default function LoadingScreen({ dark }: LoadingScreenProps) {
  return (
    <div className={`core-fixed core-inset-0 core-z-[999] core-flex core-flex-col core-items-center core-justify-center core-transition-colors core-duration-500 ${dark ? 'core-bg-[#15132b]' : 'core-bg-page-light'} core-backdrop-blur-xl`}>
      <div className="core-relative core-flex core-flex-col core-items-center core-animate-in core-fade-in core-zoom-in core-duration-700">
        <div className="core-w-20 core-h-20 core-mb-6 core-rounded-3xl core-bg-gradient-to-br core-from-indigo-500 core-via-purple-500 core-to-rose-500 core-flex core-items-center core-justify-center core-shadow-[0_0_40px_rgba(99,102,241,0.4)] core-relative core-overflow-hidden">
          <div className="core-absolute core-inset-0 core-bg-gradient-to-br core-from-white/20 core-to-transparent core-opacity-50" />
          <svg className="core-w-10 core-h-10 core-text-white core-animate-spin" style={{ animationDuration: '3s' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
          </svg>
        </div>
        <h6 id="pm-bold" className="core-text-2xl core-tracking-tight core-text-transparent core-bg-clip-text core-bg-gradient-to-r core-from-indigo-600 core-via-purple-600 core-to-rose-600 dark:core-from-indigo-400 dark:core-via-purple-400 dark:core-to-rose-400 core-animate-pulse">
          pFirst <span className="core-text-indigo-500">2.0</span>
        </h6>
        <p className="core-text-sm core-font-medium core-text-textMuted-light dark:core-text-textMuted-dark core-animate-pulse" style={{ animationDuration: '2s' }}>
          Initializing workspace...
        </p>
        <div className="core-mt-8 core-w-56 core-h-1.5 core-bg-black/5 dark:core-bg-white/5 core-rounded-full core-overflow-hidden core-shadow-inner">
          <div className="core-h-full core-bg-gradient-to-r core-from-indigo-500 core-via-purple-500 core-to-rose-500 core-rounded-full" style={{
            animation: 'pfirst-v2-loader-shimmer 1.5s ease-in-out infinite',
          }} />
        </div>
      </div>
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes pfirst-v2-loader-shimmer {
          0% { transform: translateX(-100%); width: 30%; }
          50% { width: 50%; }
          100% { transform: translateX(350%); width: 30%; }
        }
      `}} />
    </div>
  );
}

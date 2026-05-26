export default function ProfileDetails() {
  return (
    <div className="core-animate-in core-fade-in core-slide-in-from-bottom-4 core-duration-500 core-space-y-4">
      <div className="core-rounded-2xl core-p-6 sm:core-p-8 core-shadow-xl core-bg-card-light dark:core-bg-card-dark core-border core-border-borderBase-light dark:core-border-borderBase-dark core-relative core-overflow-hidden">
        <div className="core-absolute core-top-0 core-left-0 core-w-full core-h-32 core-bg-gradient-to-r core-from-indigo-600 core-to-purple-600" />
        <div className="core-relative core-mt-12 core-flex core-flex-col sm:core-flex-row core-gap-6 core-items-center sm:core-items-start">
          <div className="core-w-24 core-h-24 core-rounded-full core-border-4 core-border-white dark:core-border-[#1a1730] core-bg-gradient-to-br core-from-indigo-400 core-to-purple-500 core-flex core-items-center core-justify-center core-text-white core-text-3xl core-font-bold core-shadow-xl">AH</div>
          <div className="core-text-center sm:core-text-left core-flex-1">
            <div className="core-flex core-items-center core-justify-center sm:core-justify-start core-gap-3">
              <h2 className="core-text-2xl core-font-black core-text-textPrimary-light dark:core-text-textPrimary-dark">Anvesh Hegde</h2>
              <span className="core-px-2 core-py-0.5 core-rounded core-bg-emerald-500/10 core-text-[10px] core-font-bold core-uppercase core-text-emerald-600 dark:core-text-emerald-400">Online</span>
            </div>
            <p className="core-text-sm core-font-medium core-text-indigo-600 dark:core-text-indigo-400 core-mt-1">Senior Software Engineer</p>
            <p className="core-text-sm core-text-textMuted-light dark:core-text-textMuted-dark core-mt-3 core-max-w-xl">
              Passionate about building scalable frontend architectures and crafting intuitive user experiences. Currently leading UI modernization efforts across internal platforms.
            </p>
            <div className="core-flex core-flex-wrap core-justify-center sm:core-justify-start core-gap-3 core-mt-5">
              {[
                { label: "React", color: "indigo" },
                { label: "TypeScript", color: "purple" },
                { label: "Tailwind CSS", color: "sky" },
              ].map(({ label, color }) => (
                <span key={label} className={`core-px-3 core-py-1.5 core-rounded-lg core-bg-${color}-500/10 core-text-[12px] core-font-semibold core-text-${color}-600 dark:core-text-${color}-400`}>{label}</span>
              ))}
            </div>
          </div>
          <button className="core-px-4 core-py-2 core-rounded-xl core-bg-indigo-600 hover:core-bg-indigo-700 core-text-white core-font-semibold core-text-sm core-transition-colors core-shadow-lg core-shadow-indigo-500/25">Edit Profile</button>
        </div>
      </div>
    </div>
  );
}

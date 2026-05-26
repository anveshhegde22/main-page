import { IconMessage, IconStarFilled } from "@tabler/icons-react";

interface FeedbackProps {
  onSubmit: () => void;
}

export default function Feedback({ onSubmit }: FeedbackProps) {
  return (
    <div className="core-animate-in core-fade-in core-slide-in-from-bottom-4 core-duration-500 core-space-y-4">
      <div className="core-rounded-2xl core-p-6 sm:core-p-8 core-shadow-xl core-bg-card-light dark:core-bg-card-dark core-border core-border-borderBase-light dark:core-border-borderBase-dark core-max-w-2xl core-mx-auto">
        <div className="core-text-center core-mb-8">
          <div className="core-w-16 core-h-16 core-mx-auto core-rounded-2xl core-bg-gradient-to-br core-from-rose-400 core-to-purple-500 core-flex core-items-center core-justify-center core-text-white core-shadow-lg core-shadow-rose-500/30 core-mb-4">
            <IconMessage size={28} />
          </div>
          <h2 className="core-text-2xl core-font-black core-text-textPrimary-light dark:core-text-textPrimary-dark">Share Your Feedback</h2>
          <p className="core-text-sm core-text-textMuted-light dark:core-text-textMuted-dark core-mt-2">We value your input to make pFirst 2.0 better.</p>
        </div>
        <div className="core-space-y-5">
          <div>
            <label className="core-block core-text-[12px] core-font-semibold core-text-textPrimary-light dark:core-text-textPrimary-dark core-mb-1.5">How would you rate your experience?</label>
            <div className="core-flex core-items-center core-gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} type="button" className="core-text-slate-300 dark:core-text-slate-600 hover:core-text-yellow-400 dark:hover:core-text-yellow-400 core-transition-colors">
                  <IconStarFilled size={24} />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="core-block core-text-[12px] core-font-semibold core-text-textPrimary-light dark:core-text-textPrimary-dark core-mb-1.5">What can we improve?</label>
            <textarea
              className="core-w-full core-rounded-xl core-border core-px-4 core-py-3 core-bg-inputBg-light dark:core-bg-inputBg-dark core-border-indigo-500/15 dark:core-border-indigo-500/22 core-text-sm core-outline-none focus:core-border-indigo-500/50 core-transition-all core-resize-none core-h-32 core-text-textPrimary-light dark:core-text-textPrimary-dark"
              placeholder="Tell us about your experience, report a bug, or suggest a new feature..."
            />
          </div>
          <button
            type="button"
            onClick={onSubmit}
            className="core-w-full core-py-3 core-rounded-xl core-bg-gradient-to-r core-from-indigo-600 core-to-purple-600 hover:core-from-indigo-700 hover:core-to-purple-700 core-text-white core-font-bold core-text-sm core-transition-all core-shadow-lg core-shadow-indigo-500/25"
          >
            Submit Feedback
          </button>
        </div>
      </div>
    </div>
  );
}

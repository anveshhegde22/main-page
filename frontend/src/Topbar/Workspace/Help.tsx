import { useEffect } from "react";
import { IconChevronDown, IconHelp } from "@tabler/icons-react";
import { useFaqData } from "../../shared/api/useWorkspaceData";

export default function Help() {
  const { faqs, loading, fetchFaqs } = useFaqData({ skipInitialFetch: true });

  useEffect(() => {
    fetchFaqs();
  }, [fetchFaqs]);

  return (
    <div className="core-animate-in core-fade-in core-slide-in-from-bottom-4 core-duration-500 core-space-y-4">
      <div className="core-rounded-2xl core-p-6 sm:core-p-8 core-shadow-xl core-bg-card-light dark:core-bg-card-dark core-border core-border-borderBase-light dark:core-border-borderBase-dark">
        <div className="core-flex core-items-center core-gap-4 core-mb-6">
          <div className="core-w-12 core-h-12 core-rounded-xl core-bg-indigo-500/10 core-flex core-items-center core-justify-center">
            <IconHelp size={24} className="core-text-indigo-600 dark:core-text-indigo-400" />
          </div>
          <div>
            <h2 className="core-text-2xl core-font-black core-text-textPrimary-light dark:core-text-textPrimary-dark">Help Center</h2>
            <p className="core-text-sm core-text-textMuted-light dark:core-text-textMuted-dark core-mt-1">Find answers to common questions</p>
          </div>
        </div>
        <div className="core-space-y-3">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="core-h-12 core-rounded-xl core-bg-slate-100 dark:core-bg-white/5 core-animate-pulse" />
            ))
          ) : (
            faqs.map((faq, index) => (
              <details key={index} className="core-group core-bg-slate-50 dark:core-bg-black/20 core-rounded-xl core-border core-border-borderBase-light dark:core-border-borderBase-dark core-overflow-hidden">
                <summary className="core-flex core-items-center core-justify-between core-p-4 core-font-semibold core-cursor-pointer core-text-textPrimary-light dark:core-text-textPrimary-dark core-select-none">
                  {faq.q}
                  <IconChevronDown size={16} className="core-text-textMuted-light dark:core-text-textMuted-dark core-transition-transform core-group-open:core-rotate-180" />
                </summary>
                <div className="core-p-4 core-pt-0 core-text-sm core-text-textMuted-light dark:core-text-textMuted-dark core-leading-relaxed">{faq.a}</div>
              </details>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

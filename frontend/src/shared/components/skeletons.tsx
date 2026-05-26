import { memo } from "react";

interface SkeletonBlockProps {
  className?: string;
}

export const SkeletonBlock = memo(function SkeletonBlock({ className = "" }: SkeletonBlockProps) {
  return (
    <div
      className={`core-animate-pulse core-rounded-xl core-bg-gradient-to-r core-from-slate-200 core-to-slate-100 dark:core-from-white/10 dark:core-to-white/5 ${className}`}
    />
  );
});

export const GeneralSkeleton = memo(function GeneralSkeleton() {
  return (
    <div className="core-h-full core-p-6 core-space-y-4 core-bg-page-light dark:core-bg-page-dark">
      <SkeletonBlock className="core-h-12 core-w-64" />
      <SkeletonBlock className="core-h-40 core-w-full" />
      <SkeletonBlock className="core-h-40 core-w-full" />
    </div>
  );
});

export const AppSummarySkeleton = memo(function AppSummarySkeleton() {
  return (
    <div className="core-flex core-h-full core-flex-col core-bg-page-light dark:core-bg-page-dark core-animate-in core-zoom-in-95 core-duration-300">
      <header className="core-flex core-flex-wrap core-items-start core-justify-between core-gap-3 core-px-4 sm:core-px-6 md:core-px-8 core-py-1.5 sm:core-py-2 core-border-b core-border-borderBase-light dark:core-border-borderBase-dark core-bg-white/50 dark:core-bg-black/20 core-backdrop-blur-md">
        <div className="core-flex core-items-center core-gap-3 core-mr-2">
          <SkeletonBlock className="core-w-7 core-h-7 core-rounded-lg" />
          <div className="core-flex core-flex-col core-gap-1">
            <SkeletonBlock className="core-h-4 core-w-36" />
            <SkeletonBlock className="core-h-3 core-w-24" />
          </div>
        </div>
        <div className="core-flex core-gap-1 core-p-1">
          <SkeletonBlock className="core-w-24 core-h-8 core-rounded-lg" />
          <SkeletonBlock className="core-w-24 core-h-8 core-rounded-lg" />
        </div>
        <div className="core-flex-1" />
        <div className="core-hidden sm:core-flex core-items-center core-gap-6">
          <div className="core-flex core-items-center core-gap-2.5">
            <SkeletonBlock className="core-w-7 core-h-7 core-rounded-lg" />
            <div className="core-flex core-flex-col core-gap-1">
              <SkeletonBlock className="core-h-2.5 core-w-16" />
              <SkeletonBlock className="core-h-3 core-w-8" />
            </div>
          </div>
          <div className="core-w-px core-h-6 core-bg-borderBase-light dark:core-bg-borderBase-dark"></div>
          <div className="core-flex core-items-center core-gap-2.5">
            <SkeletonBlock className="core-w-7 core-h-7 core-rounded-lg" />
            <div className="core-flex core-flex-col core-gap-1">
              <SkeletonBlock className="core-h-2.5 core-w-16" />
              <SkeletonBlock className="core-h-3 core-w-8" />
            </div>
          </div>
        </div>
        <div className="core-relative core-ml-2">
          <SkeletonBlock className="core-w-full sm:core-w-64 core-h-[34px] core-rounded-xl" />
        </div>
        <SkeletonBlock className="core-w-28 core-h-[34px] core-rounded-xl" />
      </header>
      <div className="core-flex-1 core-min-h-0 core-p-4 md:core-p-6">
        <div className="core-h-full core-min-h-0 core-rounded-2xl core-border core-border-borderBase-light dark:core-border-borderBase-dark core-overflow-hidden core-flex core-flex-col core-bg-card-light dark:core-bg-card-dark">
          <div className="core-w-full core-h-11 core-border-b core-border-borderBase-light dark:core-border-borderBase-dark core-flex core-items-center core-px-4 core-gap-4">
            <SkeletonBlock className="core-h-4 core-w-10" />
            <SkeletonBlock className="core-h-4 core-w-10" />
            <SkeletonBlock className="core-h-4 core-w-32" />
            <SkeletonBlock className="core-h-4 core-w-48" />
            <SkeletonBlock className="core-h-4 core-w-16" />
            <SkeletonBlock className="core-h-4 core-w-20" />
          </div>
          <div className="core-w-full core-h-9 core-border-b core-border-borderBase-light dark:core-border-borderBase-dark core-flex core-items-center core-px-4 core-gap-4">
             {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonBlock key={i} className="core-h-3 core-w-16" />
             ))}
          </div>
          <div className="core-flex-1 core-flex core-flex-col">
            {Array.from({ length: 15 }).map((_, i) => (
              <div key={i} className="core-w-full core-h-[45px] core-flex core-items-center core-px-4 core-gap-4 core-border-b core-border-borderBase-light dark:core-border-borderBase-dark">
                <SkeletonBlock className="core-h-3 core-w-6" />
                <SkeletonBlock className="core-h-3 core-w-6" />
                <SkeletonBlock className="core-h-3 core-w-32" />
                <SkeletonBlock className="core-h-3 core-w-48" />
                <SkeletonBlock className="core-h-3 core-w-8" />
                <SkeletonBlock className="core-h-3 core-w-12" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

export const DrawerSkeleton = memo(function DrawerSkeleton() {
  return (
    <div className="core-flex core-h-full core-flex-col core-p-5 core-space-y-4">
      <div className="core-flex core-items-center core-gap-3">
        <SkeletonBlock className="core-h-9 core-w-9" />
        <div className="core-space-y-2">
          <SkeletonBlock className="core-h-4 core-w-32" />
          <SkeletonBlock className="core-h-3 core-w-24" />
        </div>
      </div>
      <SkeletonBlock className="core-h-10 core-w-full core-rounded-full" />
      <div className="core-space-y-3">
        {Array.from({ length: 7 }, (_, index) => (
          <SkeletonBlock key={index} className="core-h-14 core-w-full" />
        ))}
      </div>
    </div>
  );
});

export const WorkspaceProfileSkeleton = memo(function WorkspaceProfileSkeleton() {
  return (
    <div className="core-space-y-4">
      <div className="core-rounded-2xl core-p-6 sm:core-p-8 core-shadow-xl core-bg-card-light dark:core-bg-card-dark core-border core-border-borderBase-light dark:core-border-borderBase-dark core-overflow-hidden">
        <SkeletonBlock className="core-h-28 core-w-full core-rounded-2xl" />
        <div className="core-relative core--mt-10 core-flex core-flex-col sm:core-flex-row core-gap-6 core-items-center sm:core-items-start">
          <SkeletonBlock className="core-w-24 core-h-24 core-rounded-full core-flex-shrink-0" />
          <div className="core-flex-1 core-w-full core-space-y-3">
            <SkeletonBlock className="core-h-7 core-w-44" />
            <SkeletonBlock className="core-h-4 core-w-36" />
            <SkeletonBlock className="core-h-3 core-w-full" />
            <SkeletonBlock className="core-h-3 core-w-5/6" />
          </div>
        </div>
      </div>
    </div>
  );
});

export const WorkspaceListSkeleton = memo(function WorkspaceListSkeleton() {
  return (
    <div className="core-space-y-4">
      <div className="core-flex core-items-center core-justify-between core-gap-4 core-flex-wrap">
        <div className="core-space-y-2">
          <SkeletonBlock className="core-h-6 core-w-32" />
          <SkeletonBlock className="core-h-3 core-w-56" />
        </div>
        <SkeletonBlock className="core-h-11 core-w-full sm:core-w-80 core-rounded-full" />
      </div>
      <div className="core-rounded-2xl core-overflow-hidden core-shadow-lg core-bg-card-light dark:core-bg-card-dark core-border core-border-borderBase-light dark:core-border-borderBase-dark">
        <div className="core-space-y-1 core-p-3">
          {Array.from({ length: 5 }, (_, index) => (
            <div key={index} className="core-flex core-items-center core-gap-3 core-px-2 core-py-3">
              <SkeletonBlock className="core-w-8 core-h-8 core-rounded-full core-flex-shrink-0" />
              <div className="core-flex-1 core-space-y-2">
                <SkeletonBlock className="core-h-3 core-w-32" />
                <SkeletonBlock className="core-h-2.5 core-w-48" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

export const WorkspaceGridSkeleton = memo(function WorkspaceGridSkeleton() {
  return (
    <div className="core-space-y-4">
      <div className="core-flex core-items-center core-justify-between core-gap-4 core-flex-wrap">
        <div className="core-space-y-2">
          <SkeletonBlock className="core-h-6 core-w-32" />
          <SkeletonBlock className="core-h-3 core-w-60" />
        </div>
        <SkeletonBlock className="core-h-11 core-w-full sm:core-w-80 core-rounded-full" />
      </div>
      <div className="core-grid core-grid-cols-1 md:core-grid-cols-2 lg:core-grid-cols-3 core-gap-4">
        {Array.from({ length: 6 }, (_, index) => (
          <SkeletonBlock key={index} className="core-h-36 core-w-full core-rounded-2xl" />
        ))}
      </div>
    </div>
  );
});

export const WorkspaceHelpSkeleton = memo(function WorkspaceHelpSkeleton() {
  return (
    <div className="core-space-y-4">
      <SkeletonBlock className="core-h-20 core-w-full core-rounded-2xl" />
      {Array.from({ length: 4 }, (_, index) => (
        <SkeletonBlock key={index} className="core-h-16 core-w-full core-rounded-xl" />
      ))}
    </div>
  );
});

export const WorkspaceFeedbackSkeleton = memo(function WorkspaceFeedbackSkeleton() {
  return (
    <div className="core-space-y-4 core-max-w-2xl core-mx-auto">
      <SkeletonBlock className="core-h-20 core-w-full core-rounded-2xl" />
      <SkeletonBlock className="core-h-40 core-w-full core-rounded-xl" />
      <SkeletonBlock className="core-h-12 core-w-full core-rounded-xl" />
    </div>
  );
});

export const MaximizedAppsSkeleton = memo(function MaximizedAppsSkeleton() {
  return (
    <div className="core-flex core-h-full core-flex-col core-bg-page-light dark:core-bg-page-dark core-animate-in core-zoom-in-95 core-duration-300">
      <header className="core-flex core-flex-wrap core-items-start core-justify-between core-gap-3 core-px-4 sm:core-px-6 core-py-1.5 sm:core-py-2 core-border-b core-border-borderBase-light dark:core-border-borderBase-dark core-bg-white/50 dark:core-bg-black/20 core-backdrop-blur-md">
        <div className="core-flex core-min-w-0 core-flex-1 core-items-center core-gap-3">
          <SkeletonBlock className="core-w-8 core-h-8 core-rounded-lg" />
          <SkeletonBlock className="core-h-5 core-w-48" />
        </div>
        <SkeletonBlock className="core-w-28 core-h-9 core-rounded-xl" />
      </header>
      <div className="core-flex-1 core-min-h-0 core-p-4 sm:core-p-6 lg:core-p-8 core-overflow-y-auto">
        <div className="core-space-y-4 sm:core-space-y-6">
          <div className="core-flex core-flex-col lg:core-flex-row lg:core-items-center lg:core-justify-between core-gap-4">
            <SkeletonBlock className="core-w-full lg:core-max-w-md core-h-10 core-rounded-xl" />
            <div className="core-flex core-flex-wrap core-items-center core-gap-2">
              <SkeletonBlock className="core-w-24 core-h-9 core-rounded-lg" />
              <SkeletonBlock className="core-w-24 core-h-9 core-rounded-lg" />
            </div>
          </div>
          <div className="core-grid core-grid-cols-1 sm:core-grid-cols-2 lg:core-grid-cols-3 core-gap-6">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="core-bg-card-light dark:core-bg-card-dark core-rounded-2xl core-p-5 core-border core-border-borderBase-light dark:core-border-borderBase-dark core-flex core-flex-col core-h-[180px]">
                <div className="core-flex core-items-center core-justify-between core-mb-4">
                  <SkeletonBlock className="core-w-12 core-h-12 core-rounded-xl" />
                  <div className="core-flex core-items-center core-gap-2">
                    <SkeletonBlock className="core-w-8 core-h-8 core-rounded-lg" />
                    <SkeletonBlock className="core-w-16 core-h-8 core-rounded-lg" />
                    <SkeletonBlock className="core-w-8 core-h-8 core-rounded-lg" />
                  </div>
                </div>
                <SkeletonBlock className="core-h-4 core-w-3/4 core-mb-2" />
                <SkeletonBlock className="core-h-3 core-w-1/2" />
                <div className="core-mt-auto core-pt-4">
                  <div className="core-h-px core-bg-borderBase-light dark:core-bg-borderBase-dark core-mb-4" />
                  <SkeletonBlock className="core-w-full core-h-8 core-rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

export const MaximizedWorkflowSkeleton = memo(function MaximizedWorkflowSkeleton() {
  return (
    <div className="core-flex core-h-full core-flex-col core-bg-page-light dark:core-bg-page-dark core-animate-in core-zoom-in-95 core-duration-300">
      <header className="core-flex core-flex-wrap core-items-start core-justify-between core-gap-3 core-px-4 sm:core-px-6 core-py-1.5 sm:core-py-2 core-border-b core-border-borderBase-light dark:core-border-borderBase-dark core-bg-white/50 dark:core-bg-black/20 core-backdrop-blur-md">
        <div className="core-flex core-min-w-0 core-flex-1 core-items-center core-gap-3">
          <SkeletonBlock className="core-w-8 core-h-8 core-rounded-lg" />
          <SkeletonBlock className="core-h-5 core-w-64" />
        </div>
        <SkeletonBlock className="core-w-28 core-h-9 core-rounded-xl" />
      </header>
      <div className="core-flex-1 core-min-h-0 core-p-4 sm:core-p-6 lg:core-p-8 core-overflow-y-auto">
        <div className="core-bg-card-light dark:core-bg-card-dark core-rounded-3xl core-overflow-hidden core-shadow-2xl core-border core-border-borderBase-light dark:core-border-borderBase-dark">
          <div className="core-p-4 sm:core-p-6 core-border-b core-border-borderBase-light dark:core-border-borderBase-dark core-flex core-flex-col xl:core-flex-row xl:core-items-center xl:core-justify-between core-gap-4">
            <div className="core-flex core-min-w-0 core-items-center core-gap-4">
              <SkeletonBlock className="core-w-12 core-h-12 core-rounded-2xl" />
              <div className="core-space-y-2">
                <SkeletonBlock className="core-h-5 core-w-40" />
                <SkeletonBlock className="core-h-3 core-w-32" />
              </div>
            </div>
            <div className="core-flex core-w-full xl:core-w-auto core-flex-col sm:core-flex-row core-items-stretch sm:core-items-center core-gap-3">
              <SkeletonBlock className="core-w-full sm:core-w-64 core-h-10 core-rounded-xl" />
              <SkeletonBlock className="core-w-24 core-h-10 core-rounded-xl" />
            </div>
          </div>
          <div className="core-overflow-x-auto">
            <div className="core-w-full core-min-w-[800px]">
              <div className="core-bg-slate-50 dark:core-bg-white/5 core-flex core-items-center core-px-6 core-py-4 core-gap-4 core-border-b core-border-borderBase-light dark:core-border-borderBase-dark">
                <SkeletonBlock className="core-h-3 core-w-8" />
                <SkeletonBlock className="core-h-3 core-w-24" />
                <SkeletonBlock className="core-h-3 core-w-24" />
                <SkeletonBlock className="core-h-3 core-w-20" />
                <SkeletonBlock className="core-h-3 core-w-16" />
                <SkeletonBlock className="core-h-3 core-w-20" />
                <SkeletonBlock className="core-h-3 core-w-16" />
              </div>
              <div className="core-divide-y core-divide-borderBase-light dark:core-divide-borderBase-dark">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="core-flex core-items-center core-px-6 core-py-5 core-gap-4">
                    <SkeletonBlock className="core-h-4 core-w-16" />
                    <div className="core-flex core-items-center core-gap-3 core-w-48">
                      <SkeletonBlock className="core-w-8 core-h-8 core-rounded-lg" />
                      <SkeletonBlock className="core-h-4 core-w-24" />
                    </div>
                    <SkeletonBlock className="core-h-4 core-w-32" />
                    <SkeletonBlock className="core-h-6 core-w-16 core-rounded-full" />
                    <SkeletonBlock className="core-h-6 core-w-20 core-rounded-full" />
                    <SkeletonBlock className="core-h-4 core-w-24" />
                    <SkeletonBlock className="core-h-4 core-w-16" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export const MaximizedChartSkeleton = memo(function MaximizedChartSkeleton() {
  return (
    <div className="core-flex core-h-full core-flex-col core-bg-page-light dark:core-bg-page-dark core-animate-in core-zoom-in-95 core-duration-300">
      <header className="core-flex core-flex-wrap core-items-start core-justify-between core-gap-3 core-px-4 sm:core-px-6 core-py-1.5 sm:core-py-2 core-border-b core-border-borderBase-light dark:core-border-borderBase-dark core-bg-white/50 dark:core-bg-black/20 core-backdrop-blur-md">
        <div className="core-flex core-min-w-0 core-flex-1 core-items-center core-gap-3">
          <SkeletonBlock className="core-w-8 core-h-8 core-rounded-lg" />
          <SkeletonBlock className="core-h-5 core-w-48" />
        </div>
        <SkeletonBlock className="core-w-28 core-h-9 core-rounded-xl" />
      </header>
      <div className="core-flex-1 core-min-h-0 core-p-4 sm:core-p-6 lg:core-p-8 core-overflow-y-auto">
        <div className="core-bg-card-light dark:core-bg-card-dark core-rounded-3xl core-overflow-hidden core-shadow-2xl core-border core-border-borderBase-light dark:core-border-borderBase-dark core-flex core-flex-col core-h-full core-min-h-[500px]">
          <div className="core-p-4 sm:core-p-6 core-border-b core-border-borderBase-light dark:core-border-borderBase-dark core-flex core-flex-col xl:core-flex-row xl:core-items-center xl:core-justify-between core-gap-4">
            <div className="core-flex core-min-w-0 core-items-center core-gap-4">
              <SkeletonBlock className="core-w-12 core-h-12 core-rounded-2xl" />
              <div className="core-space-y-2">
                <SkeletonBlock className="core-h-5 core-w-40" />
                <SkeletonBlock className="core-h-3 core-w-32" />
              </div>
            </div>
            <div className="core-flex core-items-center core-gap-3">
              <SkeletonBlock className="core-w-32 core-h-10 core-rounded-xl" />
              <SkeletonBlock className="core-w-32 core-h-10 core-rounded-xl" />
            </div>
          </div>
          <div className="core-flex-1 core-p-6 core-flex core-items-center core-justify-center">
             <SkeletonBlock className="core-w-full core-h-full core-max-h-[400px] core-rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
});

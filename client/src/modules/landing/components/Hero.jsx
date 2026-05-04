import { CheckCircle2, FileSearch, LineChart, MessageSquareText, Sparkles, Video } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-[92vh] flex items-center px-4 pt-32 pb-20 overflow-hidden animate-slide-up sm:pt-28 sm:pb-14">
      <div className="container grid grid-cols-[minmax(0,0.82fr)_minmax(540px,1.18fr)] items-center gap-12 max-[1050px]:grid-cols-1 max-[1050px]:gap-10">
        <div className="max-w-2xl max-[1050px]:text-center max-[1050px]:mx-auto">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-semibold text-[var(--text-muted)] shadow-[var(--shadow-soft)]">
            <Sparkles size={16} className="text-[var(--primary)]" />
            AI learning, evaluation, and career readiness
          </div>

          <h1 className="text-[clamp(2.35rem,4.4vw,4.25rem)] font-bold mb-6 tracking-normal leading-[1.05] max-sm:text-[clamp(2.15rem,11vw,3.35rem)]">
            <span className="block whitespace-nowrap">SkillSphere AI</span>
            <span className="block">
              turns skills into <span className="text-gradient">career proof.</span>
            </span>
        </h1>

          <p className="text-lg text-[var(--text-muted)] mb-10 max-w-[42rem] leading-relaxed max-[1050px]:mx-auto sm:text-base sm:mb-8">
            Learn in live classrooms, analyze resumes against real roles, practice
            interviews, and track progress in one full-stack AI platform for
            students, tutors, and recruiters.
          </p>

          <div className="mt-8 grid grid-cols-3 gap-3 max-w-xl max-[1050px]:mx-auto max-sm:grid-cols-1">
            {["Live classes", "ATS scoring", "Mock interviews"].map((item) => (
              <div key={item} className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm font-medium text-[var(--text-muted)]">
                <CheckCircle2 size={16} className="text-[var(--secondary)]" />
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="relative justify-self-end hero-demo-grid w-full max-w-[760px] rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-soft)] overflow-hidden max-[1050px]:justify-self-center">
          <div className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-5">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-base font-semibold text-[var(--text-main)]">Career cockpit</p>
                <p className="text-sm text-[var(--text-muted)]">From learning signal to hiring readiness</p>
              </div>
              <div className="hidden rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-xs font-semibold text-[var(--secondary)] animate-pulse-soft sm:block">
                AI active
              </div>
            </div>

            <div className="grid grid-cols-[0.72fr_1.28fr] gap-5 max-sm:grid-cols-1">
              <div className="space-y-3">
                {[
                  { icon: Video, label: "Learn", value: "Live class running" },
                  { icon: FileSearch, label: "Evaluate", value: "Resume parsed" },
                  { icon: MessageSquareText, label: "Practice", value: "Interview feedback" },
                ].map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.label}
                      className="animate-float-panel rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow-soft)]"
                      style={{ animationDelay: `${index * 0.45}s` }}
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-[var(--surface-soft)] text-[var(--primary)]">
                          <Icon size={20} />
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-[var(--text-main)]">{item.label}</p>
                          <p className="text-xs text-[var(--text-muted)]">{item.value}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="relative min-h-[390px] rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5 overflow-hidden max-sm:min-h-[340px]">
                <div className="absolute left-0 right-0 top-0 h-12 bg-gradient-to-b from-[var(--surface-soft)] to-transparent" />
                <div className="animate-scan-line absolute left-4 right-4 top-10 h-1 rounded-full bg-[var(--secondary)] opacity-70 shadow-[0_0_22px_var(--secondary)]" />
                <div className="relative z-10 space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-[var(--text-main)]">AI match engine</p>
                      <p className="text-xs text-[var(--text-muted)]">Resume, role, and interview signals combined</p>
                    </div>
                    <LineChart size={20} className="text-[var(--secondary)]" />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {[
                      ["ATS", "86"],
                      ["Role fit", "92%"],
                      ["Growth", "+18%"],
                    ].map(([label, value]) => (
                      <div key={label} className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-3 text-center">
                        <p className="text-lg font-bold text-[var(--text-main)]">{value}</p>
                        <p className="text-[0.7rem] font-semibold uppercase text-[var(--text-muted)]">{label}</p>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3">
                    {[
                      ["React", "92%"],
                      ["Node.js", "84%"],
                      ["Communication", "78%"],
                    ].map(([label, value], index) => (
                      <div key={label}>
                        <div className="mb-1 flex justify-between text-xs text-[var(--text-muted)]">
                          <span>{label}</span>
                          <span>{value}</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-[var(--surface-soft)]">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] animate-flow-across"
                            style={{ width: value, animationDelay: `${index * 0.35}s` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-4">
                    <p className="text-xs font-semibold uppercase text-[var(--text-muted)]">Suggested next step</p>
                    <p className="mt-2 text-sm font-semibold text-[var(--text-main)]">Practice behavioral interview round</p>
                    <div className="mt-4 grid grid-cols-[1fr_auto] items-center gap-3">
                      <div className="h-2 overflow-hidden rounded-full bg-[var(--surface-soft)]">
                        <span className="block h-full w-3/4 rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] animate-flow-across" />
                      </div>
                      <span className="rounded-lg bg-[var(--surface-soft)] px-3 py-2 text-xs font-bold text-[var(--text-main)]">
                        Start
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

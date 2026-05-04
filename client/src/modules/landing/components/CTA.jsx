import { useSelector } from "react-redux";
import { ArrowRight } from "lucide-react";
import Button from "../../../shared/landing/Button";

const CTA = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const isRecruiter = user?.role === "recruiter";
  const cta = isAuthenticated
    ? {
        label: isRecruiter ? "Manage Jobs" : "Open Dashboard",
        path: isRecruiter ? "/recruiter/jobs" : "/dashboard",
      }
    : {
        label: "Create Free Account",
        path: "/register",
      };

  return (
    <section className="px-4 py-16 pb-32 sm:py-10 sm:pb-16 max-sm:py-6 max-sm:pb-12">
      <div className="container">
        <div
          className="relative border border-[var(--border)] rounded-lg py-20 px-8 text-center overflow-hidden shadow-[var(--shadow-soft)]
          sm:py-12 sm:px-6 max-sm:py-8 max-sm:px-4"
          style={{
            background:
              "linear-gradient(135deg, color-mix(in srgb, var(--primary) 14%, transparent) 0%, color-mix(in srgb, var(--secondary) 10%, transparent) 100%)",
          }}
        >

          <h2 className="relative z-10 text-[clamp(1.5rem,4vw,3rem)] font-bold mb-4 leading-tight">
            {isAuthenticated ? "Continue building your career signal." : "Ready to transform your journey?"}
          </h2>
          <p className="relative z-10 text-[var(--text-muted)] text-xl mb-10 max-w-[650px] mx-auto leading-relaxed
            sm:text-base sm:mb-6 max-sm:text-[0.95rem] max-sm:mb-5">
            {isAuthenticated
              ? "Jump back into your dashboard, review progress, analyze a resume, or keep moving toward your next role."
              : "Join students, tutors, and recruiters using SkillsSphere AI to connect learning outcomes with hiring readiness."}
          </p>
          <div className="relative z-10 flex justify-center">
            <Button variant="primary" size="lg" to={cta.path}
              className="max-sm:w-full max-sm:max-w-[300px]">
              {cta.label} <ArrowRight size={20} />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;

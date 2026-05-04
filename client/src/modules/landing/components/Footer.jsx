import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)] px-4 py-6">
      <div className="container flex items-center justify-between gap-4 text-sm text-[var(--text-muted)] md:flex-row max-sm:flex-col max-sm:items-start">
        <Link to="/" className="font-heading text-lg font-extrabold tracking-normal text-[var(--text-main)]">
          <span className="text-gradient">SkillSphere</span>&nbsp;AI
        </Link>

        <nav className="flex flex-wrap items-center gap-5">
          <Link to="/resume-analyzer" className="font-medium transition-colors hover:text-[var(--text-main)]">
            Resume Analyzer
          </Link>
          <Link to="/dashboard" className="font-medium transition-colors hover:text-[var(--text-main)]">
            Dashboard
          </Link>
          <Link to="/login" className="font-medium transition-colors hover:text-[var(--text-main)]">
            Login
          </Link>
        </nav>

        <p>(c) 2026 SkillSphere AI</p>
      </div>
    </footer>
  );
};

export default Footer;

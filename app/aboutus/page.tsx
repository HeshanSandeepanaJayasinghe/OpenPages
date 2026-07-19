import { Users, Mail, Code, Feather, BookOpen, Quote } from "lucide-react";

interface TeamMember {
  name: string;
  fullName: string;
  role: string;
  bio: string;
  img: string;
  email?: string;
  github?: string;
}

const team: TeamMember[] = [
  {
    name: "Heshan Sandeepana",
    fullName: "Heshan Sandeepana Jayasinghe",
    role: "Project Lead & Lead Developer",
    bio: "Lead architect who drives the project timeline, database schema, and core server actions of OpenPages.",
    img: "/profilepics/heshan.jpg",
    email: "heshansandeepanajayasinghe@gmail.com",
    github: "HeshanSandeepanaJayasinghe"
  },
  {
    name: "Praveen Seneviratne",
    fullName: "Praveen Tharuka Seneviratne",
    role: "Lead Frontend Architect",
    bio: "Visual designer who conceptualized the gorgeous tactile 'matte paper' theme and typography layouts.",
    img: "/profilepics/praveen.jpeg",
    email: "praveentharuka1234@gmail.com",
    github: "PraveenTharuka"
  },
  {
    name: "Yasas Chamod",
    fullName: "Yasas Chamod",
    role: "Security & Authentication Engineer",
    bio: "Manages session security, secure authentication middleware, and database access controls.",
    img: "/profilepics/yasas.jpeg",
    email: "yasaschamod1234@gmail.com",
    github: "YasasChamod"
  },
  {
    name: "Pasindu",
    fullName: "Pasindu",
    role: "Backend & Database Engineer",
    bio: "Focuses on query optimization, server actions, data persistence, and development mock setups.",
    img: "/profilepics/pasindu.jpeg",
    email: "passbudd@gmail.com",
    github: "passbudd"
  },
  {
    name: "Nishanthan N.",
    fullName: "V. Nishanthan",
    role: "UI Specialist & Frontend Engineer",
    bio: "Refines responsiveness, animations, layout consistency, and interactive states.",
    img: "/profilepics/nishanthan.jpeg",
    email: "vepusanan@gmail.com",
    github: "vepusanan"
  },
  {
    name: "Ijaz",
    fullName: "Ijaz",
    role: "DevOps & Environment Specialist",
    bio: "Responsible for setting up live deployment environments, database linking, and build pipelines.",
    img: "/profilepics/ijaz.jpeg",
    email: "ijaz@example.com",
    github: "ijaz"
  },
  {
    name: "Rasindu",
    fullName: "Rasindu",
    role: "Product Manager & QA Specialist",
    bio: "Maintains platform requirements, manages content categories, and coordinates quality checks.",
    img: "/profilepics/rasindu.jpeg",
    email: "rasindu@example.com",
    github: "rasindu"
  }
];

export default function AboutUs() {
  return (
    <main className="min-h-screen py-16 px-4 md:px-8 max-w-7xl mx-auto flex flex-col items-center">
      {/* Hero Header */}
      <div className="text-center mb-16 max-w-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent-ink/20 bg-accent-ink/5 text-accent-ink text-xs font-semibold uppercase tracking-wider mb-4 animate-fade-in">
          <Users size={12} />
          The Minds Behind the Pages
        </div>
        <h1 className="book-title text-4xl sm:text-5xl font-bold text-ink mb-6">
          Meet the Creators
        </h1>
        <p className="text-ink-gray book-body text-lg leading-relaxed">
          We are a team of software engineering students building a minimalist, content-focused publishing platform. 
          OpenPages is designed to feel like a physical notebook—tactile, clean, and completely distraction-free.
        </p>
      </div>

      <div className="w-full h-[1px] bg-paper-border mb-16"></div>

      {/* Team Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 w-full mb-20 justify-center">
        {team.map((member, index) => (
          <div 
            key={index}
            className="paper-card rounded-xl overflow-hidden flex flex-col h-full hover:-translate-y-1 hover:shadow-paper-lg transition-all border border-paper-border bg-paper"
          >
            <div className="aspect-[4/5] w-full relative overflow-hidden bg-paper-dark/30 border-b border-paper-border flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={member.img}
                alt={member.fullName}
                className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-500 hover:scale-103"
              />
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="book-title text-lg font-bold text-ink mb-0.5" title={member.fullName}>
                  {member.name}
                </h3>
                <p className="text-[10px] font-bold text-accent-ink uppercase tracking-wider mb-3">
                  {member.role}
                </p>
                <p className="text-xs text-ink-gray book-body leading-relaxed mb-4">
                  {member.bio}
                </p>
              </div>
              <div className="pt-4 border-t border-paper-border/60 flex items-center gap-3 text-ink-gray">
                {member.email && (
                  <a 
                    href={`mailto:${member.email}`} 
                    className="hover:text-accent-ink transition-colors" 
                    title={`Email ${member.name}`}
                  >
                    <Mail size={15} />
                  </a>
                )}
                {member.github && (
                  <a 
                    href={`https://github.com/${member.github}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="hover:text-accent-ink transition-colors" 
                    title={`${member.name} on GitHub`}
                  >
                    <Code size={15} />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Philosophy Section styled as a paper sheet */}
      <section className="paper-sheet p-8 md:p-12 rounded-xl max-w-4xl w-full mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="book-title text-2xl font-bold text-ink mb-4 flex items-center gap-2">
              <Feather size={18} className="text-accent-ink" />
              Our Vision
            </h2>
            <p className="text-ink-gray book-body text-sm leading-relaxed mb-4">
              In an era dominated by algorithmic feeds and visual noise, OpenPages is a return to form. We wanted to build a sanctuary for pure writing and reading.
            </p>
            <p className="text-ink-gray book-body text-sm leading-relaxed">
              Inspired by the tactile feel of physical notebooks, typewriter keys, and rich fountain pen ink, the platform strips away distraction. No ads, no likes, just words.
            </p>
          </div>
          <div>
            <h2 className="book-title text-2xl font-bold text-ink mb-4 flex items-center gap-2">
              <BookOpen size={18} className="text-accent-ink" />
              Tactile Design
            </h2>
            <p className="text-ink-gray book-body text-sm leading-relaxed mb-4">
              Every shade, font choice, and spacing value has been curated. Our warm matte paper background reduces eye strain, and the Playfair Display and Lora font pairing honors classical printing press tradition.
            </p>
            <p className="text-ink-gray book-body text-sm leading-relaxed">
              From book reviews to midnight shower thoughts, OpenPages is designed to house the fleeting and the profound alike.
            </p>
          </div>
        </div>
      </section>

      {/* Quote Banner */}
      <div className="text-center max-w-xl mx-auto">
        <Quote className="mx-auto text-accent-ink/20 mb-4" size={30} />
        <p className="book-title text-lg italic text-ink mb-3">
          &ldquo;Thank you for being part of our journey. Happy reading and writing!&rdquo;
        </p>
        <div className="h-[1px] w-12 bg-accent-ink/40 mx-auto"></div>
      </div>
    </main>
  );
}
import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { 
  GraduationCap, 
  BookOpen, 
  Users, 
  Award, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Mail, 
  Phone, 
  MapPin, 
  Play, 
  Maximize2,
  Code,
  Palette,
  Laptop,
  ShieldCheck,
  Send
} from 'lucide-react';

import Navbar from '../components/Navbar';
import LoginModal from '../components/LoginModal';
import CourseModal from '../components/CourseModal';
import GalleryLightbox from '../components/GalleryLightbox';
import AdmissionForm from '../components/AdmissionForm';
import Chatbot from '../components/Chatbot';

import mediaList from '../assets/media-list.json';

const Home = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  
  const [galleryFilter, setGalleryFilter] = useState('All');
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const [courseFilter, setCourseFilter] = useState('All');
  const [preselectedCourseTitle, setPreselectedCourseTitle] = useState('');

  const videoRef = useRef(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  const heroVideos = [
    '/institute-assets/hero.mp4',
    '/institute-assets/AQOf07I3qMTSgYUfyfrwyF2BeCGig7FT0UG6bacQ6J5PBr5xhL2Zd_W0Pt78riYud__G3PH2PPVUVr_BTyWfC2MhW_apKHXM1D_L96aCsT_keQ.mp4'
  ];

  const handleVideoEnd = () => {
    setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % heroVideos.length);
  };

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(e => console.log("Video auto-play blocked", e));
    }
  }, [currentVideoIndex]);

  // Specific Institute Courses Dataset with dedicated course banner graphics
  const coursesData = [
    {
      id: 1,
      title: 'DIT (Diploma in Information Technology)',
      category: 'Diploma',
      duration: '1 Year (2 Semesters)',
      certification: 'Sindh Board (SBTE) Certified',
      description: 'Official 1-Year Diploma program recognized by the Sindh Board of Technical Education. Master IT fundamentals, office automation, programming, and web design.',
      fullDescription: 'The Diploma in Information Technology (DIT) is our premier 1-year flagship program certified by SBTE. Designed for students seeking recognized government & corporate qualifications in computer science, software applications, and database administration.',
      image: '/course-assets/dit_course_banner.jpg',
      badge: 'Board Certified',
      modules: [
        'Semester 1: Operating Systems & Hardware Architecture',
        'Semester 1: Advanced MS Office Automation & InPage',
        'Semester 1: C++ & Object Oriented Programming',
        'Semester 2: HTML5, CSS3 & Web Designing Fundamentals',
        'Semester 2: Relational Databases (MySQL & Access)',
        'Semester 2: E-Commerce, Networking & Security'
      ],
      careerRoles: 'Computer Operator, Data Entry Supervisor, IT Specialist, Government IT Jobs'
    },
    {
      id: 2,
      title: 'AI (Artificial Intelligence) Course',
      category: 'Future Tech',
      duration: '3 Months',
      certification: 'SYMECS AI Specialist Cert',
      description: 'Master Artificial Intelligence tools, ChatGPT prompting, Python for AI, Machine Learning basics, and AI-driven automation skills.',
      fullDescription: 'Unleash the power of Artificial Intelligence. This intensive 3-month course covers generative AI tools, prompt engineering, Python AI libraries (OpenAI API, Pandas, Scikit-learn), AI graphics generation, and workflow automation.',
      image: '/course-assets/ai_course_banner.jpg',
      badge: 'Trending Skill',
      modules: [
        'Generative AI & Advanced Prompt Engineering',
        'Python Programming for Data & AI',
        'OpenAI APIs & Custom GPT Builder',
        'AI Image & Visual Content Generation',
        'Machine Learning & Data Analysis Fundamentals',
        'Building AI Workflows for Business Automation'
      ],
      careerRoles: 'AI Prompt Engineer, Automation Specialist, Digital Assistant Consultant'
    },
    {
      id: 3,
      title: 'CIT Advance Course',
      category: 'Diploma',
      duration: '6 Months',
      certification: 'Advance Certificate',
      description: 'Advance Certificate in Information Technology. Includes deep dives into office automation, advanced Excel data modeling, graphics, and web development.',
      fullDescription: 'The 6-Month Advance CIT course is tailored for students wanting complete practical computer proficiency. Covers intermediate software development, advanced graphic design, financial Excel spreadsheets, and web management.',
      image: '/course-assets/cit_advance_banner.jpg',
      badge: 'Advance Skill',
      modules: [
        'Advanced MS Office (Word, Financial Excel, PPT)',
        'Urdu InPage Document Publishing',
        'Photoshop Image Editing & Graphics',
        'HTML5 & CSS3 Web Architecture',
        'Hardware Maintenance & Troubleshooting',
        'Computer Networking & Internet Security'
      ],
      careerRoles: 'Advance Office Manager, IT Executive, Graphic & Web Associate'
    },
    {
      id: 4,
      title: 'CIT Basic Course',
      category: 'Certificate',
      duration: '6 Months',
      certification: 'Basic IT Certificate',
      description: 'Foundational 6-month computer certificate covering Windows, MS Word, Excel, PowerPoint, typing speed, and internet navigation.',
      fullDescription: 'Ideal for beginners and students starting their computer journey. Learn fundamental operating system navigation, document creation, data spreadsheet entry, presentation design, and online communication.',
      image: '/course-assets/cit_basic_banner.jpg',
      badge: 'Beginner Friendly',
      modules: [
        'Windows Operating System & File Management',
        'MS Word Document Formatting & Layouts',
        'MS Excel Data Entry & Basic Formulas',
        'MS PowerPoint Slide Show Creation',
        'Urdu InPage Typing & Printing',
        'Internet Browsing, Emailing & Cyber Safety'
      ],
      careerRoles: 'Junior Computer Operator, Data Entry Clerk, Front Desk Coordinator'
    },
    {
      id: 5,
      title: 'English Language Course',
      category: 'Language',
      duration: '6 Months',
      certification: 'Spoken English Cert',
      description: 'Master spoken English fluency, professional communication, grammar, vocabulary, public speaking, and workplace interview skills.',
      fullDescription: 'Comprehensive 6-month English Language & Personality Development course. Enhance your accent, conversational confidence, business letter writing, interview presentation, and interpersonal communication skills.',
      image: '/course-assets/english_course_banner.jpg',
      badge: 'Communication',
      modules: [
        'Basic to Advanced English Grammar Mastery',
        'Fluency & Accent Training Exercises',
        'Group Discussions & Public Speaking Sessions',
        'Professional Business Email & Letter Writing',
        'Job Interview Preparation & Mock Sessions',
        'Vocabulary Building & Listening Comprehension'
      ],
      careerRoles: 'Customer Relations Officer, Call Center Agent, Public Representative'
    },
    {
      id: 6,
      title: 'Full Stack Web & MERN Development',
      category: 'Development',
      duration: '6 Months',
      certification: 'Full Stack Specialist',
      description: 'Build modern full-stack web applications using React.js, Node.js, Express, MongoDB, Tailwind CSS, and GitHub.',
      fullDescription: 'Master modern full-stack web development with JavaScript. Learn frontend development using React and Tailwind CSS, and backend API development using Node.js, Express, and MongoDB database.',
      image: '/course-assets/web_dev_banner.jpg',
      badge: 'High Demand',
      modules: [
        'Modern HTML5 & CSS3 Flex/Grid Layouts',
        'Tailwind CSS UI Component Systems',
        'JavaScript ES6+ & Async Programming',
        'React.js Components & State Management',
        'Node.js & Express RESTful APIs',
        'MongoDB & Database Security'
      ],
      careerRoles: 'Frontend Developer, MERN Developer, Web Freelancer'
    },
    {
      id: 7,
      title: 'Graphic Design & UI/UX Masterclass',
      category: 'Design',
      duration: '3 Months',
      certification: 'Professional Graphics Cert',
      description: 'Unleash your creativity with Photoshop, Illustrator, and Figma. Learn logo design, branding, vector graphics, and UI layouts.',
      fullDescription: 'Tailored for aspiring creative designers wanting to master commercial graphics and digital UI design. Create real client brand identities, social media campaigns, and Figma web prototypes.',
      image: '/course-assets/graphic_design_banner.jpg',
      badge: 'Creative Skill',
      modules: [
        'Adobe Photoshop Photo Editing & Composition',
        'Adobe Illustrator Vector Art & Logos',
        'Figma Digital Product UI Prototyping',
        'Social Media Marketing Banner Designs',
        'Print Media Architecture (Flex, Cards, Posters)'
      ],
      careerRoles: 'Graphic Designer, UI Artist, Brand Designer'
    }
  ];

  const filteredCourses = courseFilter === 'All' 
    ? coursesData 
    : coursesData.filter(c => c.category === courseFilter);

  // Gallery Dataset mapping real media
  const galleryItems = mediaList
    .filter(item => item.Name !== 'hero.mp4')
    .map((item, idx) => {
      const isVideo = item.Name.endsWith('.mp4');
      let cat = 'Campus & Labs';
      if (idx % 3 === 1) cat = 'Tech Events';
      if (idx % 3 === 2) cat = 'Student Life';

      return {
        id: idx,
        src: `/institute-assets/${item.Name}`,
        type: isVideo ? 'video' : 'image',
        category: cat,
        title: isVideo ? `SYMECS Tech Video Highlights #${idx + 1}` : `Institute Practical Session #${idx + 1}`,
        description: 'Hands-on training, computer lab sessions, and student activities at SYMECS Institute Mirpurkhas.'
      };
    });

  const filteredGallery = galleryFilter === 'All'
    ? galleryItems
    : galleryItems.filter(item => item.category === galleryFilter);

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  const handlePrevLightbox = () => {
    setLightboxIndex((prev) => (prev > 0 ? prev - 1 : filteredGallery.length - 1));
  };

  const handleNextLightbox = () => {
    setLightboxIndex((prev) => (prev < filteredGallery.length - 1 ? prev + 1 : 0));
  };

  const openCourseDetail = (course) => {
    setSelectedCourse(course);
    setIsCourseModalOpen(true);
  };

  const handleEnrollCourse = (courseTitle) => {
    setPreselectedCourseTitle(courseTitle);
    const admissionSection = document.getElementById('admission');
    if (admissionSection) {
      admissionSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950">
      
      {/* Navigation Bar Header */}
      <Navbar 
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onOpenAdmission={() => {
          const el = document.getElementById('admission');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center pt-28 sm:pt-32 lg:pt-36 pb-16 overflow-hidden">
        {/* Background Video */}
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover scale-105"
          src={heroVideos[currentVideoIndex]}
          autoPlay
          muted
          playsInline
          onEnded={handleVideoEnd}
        />
        
        {/* Dark Glassmorphism Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/75 to-slate-950"></div>
        
        {/* Ambient Glow Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none animate-pulse-slow"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          
          {/* Badge */}
          <div data-aos="fade-down" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/90 border border-cyan-500/30 text-cyan-300 text-xs sm:text-sm font-semibold mb-6 backdrop-blur-md shadow-lg shadow-cyan-500/10">
            <Sparkles size={16} className="text-cyan-400" />
            <span>Sardar Yaseen Malik Institute of Information Technology</span>
          </div>

          {/* Main Headline */}
          <h1 data-aos="fade-up" data-aos-delay="100" className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-tight sm:leading-none max-w-5xl mx-auto">
            Empowering Mirpurkhas with <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              Next-Gen IT Skills & Education
            </span>
          </h1>

          {/* Subheading */}
          <p data-aos="fade-up" data-aos-delay="200" className="mt-6 text-base sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Master DIT 1-Year Diploma, AI 3-Month Course, CIT Advance & Basic, English Language, and Web Development with certified expert instructors.
          </p>

          {/* Dual Action CTA Buttons */}
          <div data-aos="zoom-in" data-aos-delay="300" className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <a
              href="#courses"
              className="w-full sm:w-auto px-8 py-4 text-base font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-2xl shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <BookOpen size={20} />
              <span>Explore Courses</span>
            </a>

            <a
              href="#admission"
              className="w-full sm:w-auto px-8 py-4 text-base font-bold text-white bg-slate-900/90 border border-slate-700/80 rounded-2xl hover:bg-slate-800 hover:border-slate-500 backdrop-blur-md shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <GraduationCap size={20} className="text-cyan-400" />
              <span>Apply for Admission</span>
              <ArrowRight size={18} />
            </a>
          </div>

          {/* Feature Highlights Pill Row */}
          <div data-aos="fade-up" data-aos-delay="400" className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80 backdrop-blur-md flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 shrink-0">
                <ShieldCheck size={22} />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-white">SBTE Affiliated</p>
                <p className="text-[11px] text-slate-400">Recognized Diploma</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80 backdrop-blur-md flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 shrink-0">
                <Laptop size={22} />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-white">Modern Labs</p>
                <p className="text-[11px] text-slate-400">1:1 PC Availability</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80 backdrop-blur-md flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0">
                <Users size={22} />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-white">Expert Faculty</p>
                <p className="text-[11px] text-slate-400">Industry Instructors</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80 backdrop-blur-md flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 shrink-0">
                <Award size={22} />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-white">Job Assistance</p>
                <p className="text-[11px] text-slate-400">Career Placement</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 relative bg-slate-900/50 border-y border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Left Content */}
            <div data-aos="fade-right">
              <span className="px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold uppercase tracking-wider">
                About SYMECS Institute
              </span>
              <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
                Pioneering Quality IT Education in Sindh
              </h2>
              <p className="mt-5 text-slate-300 text-base sm:text-lg leading-relaxed">
                Sardar Yaseen Malik Institute of Information Technology (SYMECS Institute) is a premier educational hub dedicated to training future tech innovators, web developers, graphic artists, and IT professionals.
              </p>
              <p className="mt-4 text-slate-400 text-sm leading-relaxed">
                Situated in Mirpurkhas, Sindh, our institute delivers hands-on practical training, comprehensive SBTE diploma courses, and specialized IT certifications. Under the guidance of our Head of Department, Usama Ali, and dedicated faculty, we foster critical thinking and practical skills for career success.
              </p>

              {/* Key Stats Counter Grid */}
              <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
                  <h3 className="text-3xl font-black text-cyan-400">1,500+</h3>
                  <p className="text-xs text-slate-400 font-medium mt-1">Graduated Students</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
                  <h3 className="text-3xl font-black text-blue-400">15+</h3>
                  <p className="text-xs text-slate-400 font-medium mt-1">Certified Courses</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
                  <h3 className="text-3xl font-black text-emerald-400">20+</h3>
                  <p className="text-xs text-slate-400 font-medium mt-1">Expert Faculty</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
                  <h3 className="text-3xl font-black text-purple-400">98%</h3>
                  <p className="text-xs text-slate-400 font-medium mt-1">Success Rate</p>
                </div>
              </div>
            </div>

            {/* Right Showcase Image Card */}
            <div data-aos="fade-left" className="relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 via-cyan-400 to-emerald-400 rounded-3xl blur-xl opacity-30"></div>
              <div className="relative rounded-3xl overflow-hidden border border-slate-700/80 shadow-2xl bg-slate-900">
                <img 
                  src="/institute-assets/629095193_122200849520381984_1789562988725298159_n.jpg" 
                  alt="SYMECS Institute Campus" 
                  className="w-full h-[400px] sm:h-[480px] object-cover hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 backdrop-blur-md">
                  <p className="text-sm font-bold text-white">Practical Computer Lab Sessions</p>
                  <p className="text-xs text-slate-400">Equipped with latest hardware & high-speed fiber internet</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Courses Section */}
      <section id="courses" className="py-24 relative bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16" data-aos="fade-up">
            <span className="px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold uppercase tracking-wider">
              Specialized Programs
            </span>
            <h2 className="mt-4 text-3xl sm:text-5xl font-extrabold text-white">
              Explore Our Professional Courses
            </h2>
            <p className="mt-4 text-slate-400 text-sm sm:text-base">
              Click on any course card below to view detailed syllabus, duration, and direct application options.
            </p>

            {/* Course Category Filter Tabs */}
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {['All', 'Diploma', 'Future Tech', 'Certificate', 'Language', 'Development', 'Design'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCourseFilter(cat)}
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                    courseFilter === cat
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-cyan-500/20'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course, idx) => (
              <div
                key={course.id}
                data-aos="fade-up"
                data-aos-delay={(idx % 6) * 100}
                onClick={() => openCourseDetail(course)}
                className="group relative bg-slate-900/70 border border-slate-800/90 hover:border-cyan-400/60 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-cyan-500/15 transition-all duration-300 flex flex-col transform hover:-translate-y-2 cursor-pointer"
              >
                {/* Course Banner Image */}
                <div className="relative h-52 overflow-hidden bg-slate-950">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent"></div>
                  
                  <span className="absolute top-4 left-4 px-3 py-1 text-[11px] font-bold rounded-full bg-cyan-500/90 text-slate-950 backdrop-blur-md shadow-md">
                    {course.badge}
                  </span>

                  <span className="absolute top-4 right-4 px-3 py-1 text-[11px] font-semibold rounded-full bg-slate-950/85 text-cyan-300 border border-cyan-500/30 backdrop-blur-md">
                    {course.duration}
                  </span>
                </div>

                {/* Card Body */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors leading-snug">
                      {course.title}
                    </h3>
                    <p className="mt-3 text-xs text-slate-400 line-clamp-3 leading-relaxed">
                      {course.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
                    <span
                      className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 transition"
                    >
                      <span>View Details & Syllabus</span>
                      <ArrowRight size={14} />
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEnrollCourse(course.title);
                      }}
                      className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 rounded-xl shadow-md transition"
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-24 relative bg-slate-900/60 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16" data-aos="fade-up">
            <span className="px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold uppercase tracking-wider">
              Life at SYMECS
            </span>
            <h2 className="mt-4 text-3xl sm:text-5xl font-extrabold text-white">
              Campus Photo & Video Gallery
            </h2>
            <p className="mt-4 text-slate-400 text-sm sm:text-base">
              Take a tour of our computer laboratories, workshops, tech events, and student achievements.
            </p>

            {/* Gallery Category Filters */}
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {['All', 'Campus & Labs', 'Tech Events', 'Student Life'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setGalleryFilter(cat)}
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                    galleryFilter === cat
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-cyan-500/20'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Media Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGallery.map((item, index) => (
              <div
                key={item.id}
                data-aos="fade-up"
                data-aos-delay={(index % 6) * 100}
                onClick={() => openLightbox(index)}
                className="group relative h-64 rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 hover:border-cyan-500/50 cursor-pointer shadow-lg hover:shadow-2xl hover:shadow-cyan-500/10 transition-all duration-300 transform hover:-translate-y-1.5"
              >
                {item.type === 'video' ? (
                  <div className="relative w-full h-full">
                    <video
                      src={item.src}
                      muted
                      loop
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-950/40 group-hover:bg-slate-950/20 transition">
                      <div className="w-14 h-14 rounded-full bg-cyan-500/90 text-slate-950 flex items-center justify-center shadow-xl group-hover:scale-110 transition">
                        <Play size={24} className="ml-1" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <img
                    src={item.src}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                )}

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6 flex flex-col justify-end">
                  <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider mb-1">
                    {item.category}
                  </span>
                  <h4 className="text-sm font-bold text-white">{item.title}</h4>
                  <div className="mt-2 flex items-center gap-1 text-xs text-slate-300">
                    <Maximize2 size={14} />
                    <span>Click to view full screen</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Admission Section */}
      <section id="admission" className="py-24 relative bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AdmissionForm preselectedCourse={preselectedCourseTitle} />
        </div>
      </section>

      {/* Contact Us Section */}
      <section id="contact" className="py-24 relative bg-slate-900/40 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16" data-aos="fade-up">
            <span className="px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold uppercase tracking-wider">
              Get in Touch
            </span>
            <h2 className="mt-4 text-3xl sm:text-5xl font-extrabold text-white">
              Contact SYMECS Institute
            </h2>
            <p className="mt-4 text-slate-400 text-sm sm:text-base">
              Have questions regarding admissions, fees, or course schedules? Our team is here to assist you.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Phone Info */}
            <div data-aos="fade-up" data-aos-delay="100" className="p-8 rounded-3xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 transition text-center group">
              <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition">
                <Phone size={30} />
              </div>
              <h3 className="text-lg font-bold text-white">Call / WhatsApp</h3>
              <p className="text-xs text-slate-400 mt-1">Mon - Sat (9:00 AM - 8:00 PM)</p>
              <a href="tel:03123795549" className="inline-block mt-4 text-base font-bold text-cyan-400 hover:underline">
                03123795549
              </a>
            </div>

            {/* Email Info */}
            <div data-aos="fade-up" data-aos-delay="200" className="p-8 rounded-3xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 transition text-center group">
              <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition">
                <Mail size={30} />
              </div>
              <h3 className="text-lg font-bold text-white">Email Address</h3>
              <p className="text-xs text-slate-400 mt-1">Official Inquiry Email</p>
              <a href="mailto:symecsmalik@gmail.com" className="inline-block mt-4 text-base font-bold text-cyan-400 hover:underline">
                symecsmalik@gmail.com
              </a>
            </div>

            {/* Location Info */}
            <div data-aos="fade-up" data-aos-delay="300" className="p-8 rounded-3xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 transition text-center group">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition">
                <MapPin size={30} />
              </div>
              <h3 className="text-lg font-bold text-white">Campus Location</h3>
              <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                Malik Jamat Khana 2nd floor,<br />
                dholnabad Mirpurkhas, Sindh
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 pt-16 pb-12 text-slate-400 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            
            {/* Col 1: Institute Intro */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img src="/institute_logo.jpg" alt="SYMECS Logo" className="w-10 h-10 rounded-full border border-cyan-500/40" />
                <span className="text-xl font-bold text-white">SYMECS Institute</span>
              </div>
              <p className="text-xs leading-relaxed text-slate-400">
                Sardar Yaseen Malik Institute of Information Technology, Mirpurkhas. Delivering Sindh Board certified IT diplomas and cutting-edge skill development.
              </p>
            </div>

            {/* Col 2: Quick Links */}
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Quick Links</h4>
              <ul className="space-y-2 text-xs">
                <li><a href="#home" className="hover:text-cyan-400 transition">Home</a></li>
                <li><a href="#about" className="hover:text-cyan-400 transition">About Us</a></li>
                <li><a href="#courses" className="hover:text-cyan-400 transition">All Courses</a></li>
                <li><a href="#gallery" className="hover:text-cyan-400 transition">Campus Gallery</a></li>
                <li><a href="#admission" className="hover:text-cyan-400 transition">Apply for Admission</a></li>
                <li><button onClick={() => setIsLoginModalOpen(true)} className="hover:text-cyan-400 transition text-left">Student/Admin Login</button></li>
              </ul>
            </div>

            {/* Col 3: Popular Programs */}
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Popular Programs</h4>
              <ul className="space-y-2 text-xs">
                <li><a href="#courses" className="hover:text-cyan-400 transition">DIT 1-Year SBTE Diploma</a></li>
                <li><a href="#courses" className="hover:text-cyan-400 transition">AI (Artificial Intelligence) 3 Months</a></li>
                <li><a href="#courses" className="hover:text-cyan-400 transition">CIT Advance 6 Months</a></li>
                <li><a href="#courses" className="hover:text-cyan-400 transition">CIT Basic 6 Months</a></li>
                <li><a href="#courses" className="hover:text-cyan-400 transition">English Language 6 Months</a></li>
              </ul>
            </div>

            {/* Col 4: Contact & Social */}
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Connect With Us</h4>
              <p className="text-xs mb-4">Follow SYMECS Institute on official social media platforms:</p>
              
              <div className="flex items-center gap-3">
                {/* Facebook SVG */}
                <a
                  href="https://www.facebook.com/profile.php?id=61561459540966"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-blue-600 hover:border-blue-600 transition"
                  aria-label="Facebook Page"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                
                {/* WhatsApp SVG */}
                <a
                  href="https://wa.me/923123795549"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-emerald-500 hover:border-emerald-500 transition"
                  aria-label="WhatsApp Contact"
                >
                  <Phone size={18} />
                </a>

                {/* Instagram SVG */}
                <a
                  href="#social"
                  onClick={(e) => { e.preventDefault(); alert("Follow us on Instagram: SYMECS Institute"); }}
                  className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-pink-600 hover:border-pink-600 transition"
                  aria-label="Instagram"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>

                {/* LinkedIn SVG */}
                <a
                  href="#social"
                  onClick={(e) => { e.preventDefault(); alert("Follow us on LinkedIn: SYMECS Institute"); }}
                  className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-blue-500 hover:border-blue-500 transition"
                  aria-label="LinkedIn"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                </a>
              </div>
            </div>

          </div>

          <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <p>&copy; {new Date().getFullYear()} Sardar Yaseen Malik Institute of Information Technology. All rights reserved.</p>
            <p className="text-slate-400">
              Developed by <span className="text-cyan-400 font-semibold">Usama Ali</span>, HOD SYMECS Institute
            </p>
          </div>

        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/923123795549"
        target="_blank"
        rel="noopener noreferrer"
        title="Chat with SYMECS Admissions on WhatsApp"
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-2xl hover:scale-110 hover:bg-emerald-400 transition-all duration-300 group"
      >
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-cyan-400 animate-ping"></span>
        <Phone size={26} />
      </a>

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />

      {/* Course Detail Modal */}
      <CourseModal
        course={selectedCourse}
        isOpen={isCourseModalOpen}
        onClose={() => setIsCourseModalOpen(false)}
        onEnroll={handleEnrollCourse}
      />

      {/* Gallery Lightbox */}
      <GalleryLightbox
        item={filteredGallery[lightboxIndex]}
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        onPrev={handlePrevLightbox}
        onNext={handleNextLightbox}
      />

      {/* AI Assistant Chatbot */}
      <Chatbot />

    </div>
  );
};

export default Home;

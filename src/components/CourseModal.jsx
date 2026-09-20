import React from 'react';
import { X, Clock, Award, BookOpen, CheckCircle, Calendar, Users, GraduationCap } from 'lucide-react';

const CourseModal = ({ course, isOpen, onClose, onEnroll }) => {
  if (!isOpen || !course) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-modal">
      <div 
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Course Banner Header */}
        <div className="relative h-48 sm:h-56 overflow-hidden">
          <img 
            src={course.image || '/institute-assets/618491874_122198996264381984_2156953569085640997_n.jpg'} 
            alt={course.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-950/70 text-slate-300 hover:text-white hover:bg-slate-900 backdrop-blur-md transition"
          >
            <X size={20} />
          </button>

          {/* Badge & Title */}
          <div className="absolute bottom-4 left-6 right-6">
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 backdrop-blur-md inline-block mb-2">
              {course.category}
            </span>
            <h3 className="text-2xl font-bold text-white leading-tight">
              {course.title}
            </h3>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          
          {/* Quick Meta Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-slate-950/60 border border-slate-800 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                <Clock size={20} />
              </div>
              <div>
                <p className="text-[11px] text-slate-400 uppercase font-semibold">Duration</p>
                <p className="text-sm font-bold text-white">{course.duration}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
                <Award size={20} />
              </div>
              <div>
                <p className="text-[11px] text-slate-400 uppercase font-semibold">Certification</p>
                <p className="text-sm font-bold text-white">{course.certification || 'Board Certified'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 col-span-2 sm:col-span-1">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                <Users size={20} />
              </div>
              <div>
                <p className="text-[11px] text-slate-400 uppercase font-semibold">Format</p>
                <p className="text-sm font-bold text-white">In-Person Labs</p>
              </div>
            </div>
          </div>

          {/* Overview */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-cyan-400 mb-2">Course Overview</h4>
            <p className="text-sm text-slate-300 leading-relaxed">
              {course.fullDescription || course.description}
            </p>
          </div>

          {/* Modules / Syllabus Covered */}
          {course.modules && course.modules.length > 0 && (
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-cyan-400 mb-3 flex items-center gap-2">
                <BookOpen size={18} />
                <span>Key Modules & Topics Covered</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {course.modules.map((mod, index) => (
                  <div key={index} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-950/40 border border-slate-800/80">
                    <CheckCircle size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-xs text-slate-200 font-medium">{mod}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Career Opportunities */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-cyan-400 mb-2">Career Prospects</h4>
            <p className="text-xs text-slate-300">
              Upon completion, students are qualified for roles such as: <span className="text-white font-semibold">{course.careerRoles || 'IT Specialist, Software Trainee, Graphic Artist, Web Developer'}</span>.
            </p>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-6 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between gap-4">
          <div>
            <span className="text-xs text-slate-400 block">Admissions Status</span>
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Open for Batch 2026
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onEnroll(course.title);
              }}
              className="px-6 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-400 rounded-xl shadow-lg shadow-cyan-500/20 hover:opacity-95 active:scale-95 transition flex items-center gap-2"
            >
              <GraduationCap size={16} />
              <span>Apply for this Course</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CourseModal;

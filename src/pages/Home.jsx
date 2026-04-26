import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './Home.css';
import mediaList from '../assets/media-list.json';

const Home = () => {
  // Filter media for the gallery
  const galleryMedia = mediaList.filter(item => item.Name !== 'hero.mp4');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const videoRef = useRef(null);

  const heroVideos = [
    '/institute-assets/hero.mp4',
    '/institute-assets/AQOf07I3qMTSgYUfyfrwyF2BeCGig7FT0UG6bacQ6J5PBr5xhL2Zd_W0Pt78riYud__G3PH2PPVUVr_BTyWfC2MhW_apKHXM1D_L96aCsT_keQ.mp4'
  ];

  const handleVideoEnd = () => {
    setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % heroVideos.length);
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(e => console.log("Video auto-play blocked", e));
    }
  }, [currentVideoIndex]);

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMenu = () => setIsMobileMenuOpen(false);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }, []);

  return (
    <div className="home-container">
      {/* Navbar */}
      <nav className="home-navbar" data-aos="fade-down">
        <div className="nav-logo">
          <img src="/institute_logo.jpg" alt="SYMECS Logo" className="header-logo" />
          <h1>Symecs<span>.</span></h1>
        </div>
        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#gallery">Gallery</a>
          <a href="#contact">Contact</a>
          <Link to="/login" className="login-btn">Login</Link>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="hamburger-btn" onClick={toggleMenu}>
          {isMobileMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          )}
        </div>

        {/* Mobile Menu */}
        <div className={`mobile-nav ${isMobileMenuOpen ? 'open' : ''}`}>
          <a href="#home" onClick={closeMenu}>Home</a>
          <a href="#about" onClick={closeMenu}>About</a>
          <a href="#gallery" onClick={closeMenu}>Gallery</a>
          <a href="#contact" onClick={closeMenu}>Contact</a>
          <Link to="/login" className="login-btn mobile-login-btn" onClick={closeMenu}>Login</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="hero-section">
        <video 
          ref={videoRef}
          className="hero-video-bg" 
          src={heroVideos[currentVideoIndex]} 
          autoPlay 
          muted 
          playsInline
          onEnded={handleVideoEnd}
        />
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <span className="hero-label" data-aos="fade-down" data-aos-delay="200">Best Education Platform</span>
          <h2 data-aos="fade-right" data-aos-delay="400">Sardar Yaseen Malik Institute of Information Technology Mirpurkhas</h2>
          <p data-aos="fade-up" data-aos-delay="600">
            Empowering students with excellent education, modern facilities, 
            and a track record of success. Join us to build your bright future.
          </p>
          <a href="#gallery" className="cta-btn pulse-animation" data-aos="zoom-in" data-aos-delay="800">Explore Our Campus</a>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about-section">
        <div className="about-content" data-aos="fade-right">
          <h2>Learn From The Best Instructors</h2>
          <p>
            Sardar Yaseen Malik Institute of Information Technology Mirpurkhas provides high-quality education tailored to modern needs. 
            Our comprehensive curriculum and expert instructors ensure that every student 
            receives the best guidance. We foster an environment of creativity, 
            critical thinking, and hands-on learning to prepare you for the challenges 
            of tomorrow.
          </p>
          <div className="stats-container">
            <div className="stat-item" data-aos="fade-up" data-aos-delay="200">
              <h3>50+</h3>
              <p>Expert Teachers</p>
            </div>
            <div className="stat-item" data-aos="fade-up" data-aos-delay="400">
              <h3>1000+</h3>
              <p>Active Students</p>
            </div>
          </div>
        </div>
        <div className="about-image" data-aos="fade-left">
          <img 
            src="/institute-assets/629095193_122200849520381984_1789562988725298159_n.jpg" 
            alt="About Symecs" 
            className="float-animation"
          />
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="gallery-section">
        <h2 className="section-title" data-aos="zoom-in">Our Gallery & Courses</h2>
        <div className="gallery-grid">
          {galleryMedia.map((media, index) => {
            const isVideo = media.Name.endsWith('.mp4');
            const mediaUrl = `/institute-assets/${media.Name}`;
            // Stagger animations based on index (up to a max delay)
            const delay = (index % 6) * 100;
            
            return (
              <div key={index} className="gallery-item hover-smooth" data-aos="fade-up" data-aos-delay={delay}>
                {isVideo ? (
                  <video 
                    src={mediaUrl} 
                    muted 
                    loop 
                    onMouseOver={(e) => e.target.play()} 
                    onMouseOut={(e) => e.target.pause()}
                  />
                ) : (
                  <img src={mediaUrl} alt={`Gallery ${index}`} loading="lazy" />
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact-section">
        <h2 className="section-title" data-aos="fade-up">Contact Us</h2>
        <div className="contact-cards">
          <div className="contact-card" data-aos="fade-up" data-aos-delay="100">
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            <h3>Email</h3>
            <a href="mailto:symecsmalik@gmail.com">symecsmalik@gmail.com</a>
          </div>
          <div className="contact-card" data-aos="fade-up" data-aos-delay="200">
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
            <h3>Phone</h3>
            <a href="tel:03123795549">03123795549</a>
          </div>
          <div className="contact-card" data-aos="fade-up" data-aos-delay="300">
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
            <h3>Facebook</h3>
            <a href="https://www.facebook.com/profile.php?id=61561459540966" target="_blank" rel="noopener noreferrer">
              Visit our Page
            </a>
          </div>
          <div className="contact-card" data-aos="fade-up" data-aos-delay="400">
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            <h3>Address</h3>
            <p>Malik Jamat Khana 2nd floor<br/>dholnabad Mirpurkhas, Sindh</p>
          </div>
        </div>
      </section>

      {/* WhatsApp Floating Button */}
      <a 
        href="https://wa.me/923123795549" 
        className="whatsapp-float" 
        target="_blank" 
        rel="noopener noreferrer"
        title="Chat with us on WhatsApp"
        data-aos="zoom-in"
        data-aos-anchor-placement="bottom-bottom"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="currentColor" viewBox="0 0 16 16">
          <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
        </svg>
      </a>

      {/* Footer */}
      <footer className="home-footer">
        <p>&copy; {new Date().getFullYear()} Sardar Yaseen Malik Institute of Information Technology. All rights reserved.</p>
        <p style={{ marginTop: '10px', fontSize: '0.85rem', opacity: 0.8 }}>
          Developed by Usama Ali, HOD Symecs Institute
        </p>
      </footer>
    </div>
  );
};

export default Home;

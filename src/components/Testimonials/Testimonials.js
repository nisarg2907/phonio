'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import '@/styles/testimonials.css';
const testimonials = [
    {
      name: "Nicola Romai",
      image: <Image src="https://cdn.prod.website-files.com/673ca620b98035f221528ad1/6783a0aec9a42a48f43d9321_avatar-nicola.avif" loading="lazy" alt="Nicola Romei" className="image round" width={50} height={50} />,
      testimonial: "Osmo has revolutionized the way we manage our projects. The intuitive interface and powerful features make it a must-have for any team. It has streamlined our workflow and increased our productivity significantly.",
      designation: "Frontend Developer at TechCorp"
    },
    {
      name: "Jason Harvey",
      image: <Image src="https://cdn.prod.website-files.com/673ca620b98035f221528ad1/6783a10a476c5bccbe81904a_avatar-jason.avif" loading="lazy" alt="Jason Harvey" className="image round" width={50} height={50} />,
      testimonial: "The efficiency and ease of use that Osmo provides are unparalleled. It has significantly improved our workflow. The features are intuitive and the support team is always ready to assist, making our tasks much easier.",
      designation: "Backend Developer at InnovateX"
    },
    {
      name: "Flayks",
      image: <Image src="https://cdn.prod.website-files.com/673ca620b98035f221528ad1/6783a0df9eec5d3a505f4f98_avatar-flayks.avif" loading="lazy" alt="Flayks" className="image round" width={50} height={50} />,
      testimonial: "Osmo is a game-changer. The features are incredibly useful and the support team is always there to help. It has made our design process more efficient and enjoyable, allowing us to focus on creativity.",
      designation: "UI/UX Designer at CreativeWorks"
    },
    {
      name: "Huy (By Huy)",
      image: <Image src="https://cdn.prod.website-files.com/673ca620b98035f221528ad1/6783a09b5ee17587313b233f_avatar-huy.avif" loading="lazy" alt="Huy (by Huy)" className="image round" width={50} height={50} />,
      testimonial: "I can't imagine going back to our old tools after using Osmo. It's simply the best SaaS product we've ever used. The continuous updates and new features keep us ahead of the competition.",
      designation: "Product Manager at NextGen"
    },
    {
      name: "Cassie Evans",
      image: <Image src="https://cdn.prod.website-files.com/673ca620b98035f221528ad1/67855eafecb30f50080eed23_cassie-square.avif" loading="lazy" alt="Cassie Evans" className="image round" width={50} height={50} />,
      testimonial: "Osmo's user-friendly design and robust features have made our team more productive than ever. The seamless integration with our existing tools has been a huge plus, enhancing our overall efficiency.",
      designation: "Software Engineer at DevSolutions"
    },
    {
      name: "Jesper Landberg",
      image: <Image src="https://cdn.prod.website-files.com/673ca620b98035f221528ad1/6785136cdeca199d875404fc_avatar-jesper.avif" loading="lazy" alt="Jesper Landberg" className="image round" width={50} height={50} />,
      testimonial: "The seamless integration and powerful tools that Osmo offers have transformed our business operations. It has enabled us to streamline our processes and improve our project management significantly.",
      designation: "CTO at FutureTech"
    },
    {
      name: "Jordan Gilroy",
      image: <Image src="https://cdn.prod.website-files.com/673ca620b98035f221528ad1/6783a0524abfb70a07a94438_avatar-jordan.avif" loading="lazy" alt="Jordan Gilroy" className="image round" width={50} height={50} />,
      testimonial: "Osmo is an essential tool for our team. The support and continuous updates keep us ahead of the curve. It has become an indispensable part of our daily operations, enhancing our productivity.",
      designation: "DevOps Engineer at CloudNet"
    },
    {
      name: "Erwin Luijendijk",
      image: <Image src="https://cdn.prod.website-files.com/673ca620b98035f221528ad1/6783a062df79162cd72c1cf8_avatar-erwin.avif" loading="lazy" alt="Erwin Luijendijk" className="image round" width={50} height={50} />,
      testimonial: "Osmo's features are exactly what we needed to streamline our processes and improve collaboration. The intuitive interface and powerful tools have made a significant impact on our workflow.",
      designation: "Full Stack Developer at WebWorks"
    },
    {
      name: "Bimo Tri",
      image: <Image src="https://cdn.prod.website-files.com/673ca620b98035f221528ad1/6783a0d3775c4bdf9c69ef50_avatar-bimo.avif" loading="lazy" alt="Bimo Tri" className="image round" width={50} height={50} />,
      testimonial: "The flexibility and power of Osmo have made it an indispensable part of our toolkit. It has enhanced our development process, making it more efficient and enjoyable for the entire team.",
      designation: "Tech Lead at CodeMasters"
    },
    {
      name: "Dylan Brouwer",
      image: <Image src="https://cdn.prod.website-files.com/673ca620b98035f221528ad1/67839d2f3846acf48375bb7b_avatar-dylan.avif" loading="lazy" alt="Dylan Brouwer" className="image round" width={50} height={50} />,
      testimonial: "Osmo has significantly improved our team's efficiency and collaboration. We highly recommend it. The user-friendly design and robust features have made a noticeable difference in our productivity.",
      designation: "Project Manager at AgileWorks"
    }
  ];
  export default function Testimonials() {
    const [activeIndex, setActiveIndex] = useState(1);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const carouselRef = useRef(null);
    const avatarsRef = useRef(null);
  
    useEffect(() => {
      const interval = setInterval(() => {
        if (!isDragging) {
          setActiveIndex((prev) => (prev + 1) % testimonials.length);
        }
      }, 3000);
  
      return () => clearInterval(interval);
    }, [isDragging]);
  
    useEffect(() => {
      if (carouselRef.current) {
        const itemWidth = carouselRef.current.scrollWidth / testimonials.length;
        carouselRef.current.scrollLeft = activeIndex * itemWidth - (carouselRef.current.offsetWidth / 2) + (itemWidth / 2);
      }
      
      if (avatarsRef.current) {
        const avatarWidth = 50;
        const containerWidth = avatarsRef.current.offsetWidth;
        const scrollPosition = (activeIndex * avatarWidth) - (containerWidth / 2) + (avatarWidth / 2);
        avatarsRef.current.scrollLeft = scrollPosition;
      }
    }, [activeIndex]);
  
    const handleMouseDown = (e) => {
      setIsDragging(true);
      setStartX(e.pageX - carouselRef.current.offsetLeft);
      setScrollLeft(carouselRef.current.scrollLeft);
    };
  
    const handleMouseLeave = () => {
      setIsDragging(false);
    };
  
    const handleMouseUp = () => {
      setIsDragging(false);
      
      if (carouselRef.current) {
        const itemWidth = carouselRef.current.scrollWidth / testimonials.length;
        const newIndex = Math.round(carouselRef.current.scrollLeft / itemWidth);
        setActiveIndex(newIndex);
      }
    };
  
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      e.preventDefault();
      
      const x = e.pageX - carouselRef.current.offsetLeft;
      const walk = (x - startX) * 2;
      carouselRef.current.scrollLeft = scrollLeft - walk;
    };
  
    const handleAvatarClick = (index) => {
      setActiveIndex(index);
    };
  
    return (
      <div className="testimonials-section">
        <div className="hero-heading">
          <h1>We built Osmo to help creative developers work smarter, faster, and better.</h1>
        </div>
        
        <div className="trusted-by">
          <p>Trusted by:</p>
          <div className="avatars-container" ref={avatarsRef}>
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className={`avatar-wrapper ${activeIndex === index ? 'active' : ''}`}
                onClick={() => handleAvatarClick(index)}
              >
                <div className="avatar">
                  {testimonial.image}
                </div>
                {activeIndex === index && (
                  <div className="avatar-name">{testimonial.name}</div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div 
          className="testimonials-carousel" 
          ref={carouselRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
        >
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className={`testimonial-card ${activeIndex === index ? 'active' : ''}`}
            >
              <div className="testimonial-content">
                <p>{testimonial.testimonial}</p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">
                  {testimonial.image}
                </div>
                <div className="author-info">
                  <h4>{testimonial.name}</h4>
                  <p>{testimonial.designation}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
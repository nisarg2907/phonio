'use client';

import { useState, useEffect, useRef } from 'react';
import '@/styles/testimonials.css';
import { testimonials } from '@/lib/testimonials';

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [velocity, setVelocity] = useState(0);
  const [lastX, setLastX] = useState(0);
  const [lastTimestamp, setLastTimestamp] = useState(0);
  const [animationFrameId, setAnimationFrameId] = useState(null);
  const carouselRef = useRef(null);
  const avatarsRef = useRef(null);
  const testimonialsLength = testimonials.length;
  
  const getVirtualIndex = (realIndex) => {
    return ((realIndex % testimonialsLength) + testimonialsLength) % testimonialsLength;
  };
  
  // Create an infinite array of testimonials for display
  const createInfiniteTestimonials = () => {
    // Add items before and after to create the infinite effect
    return [
      // Last item (for wrapping to the left)
      {...testimonials[testimonialsLength - 1], virtualIndex: -1},
      // Current items
      ...testimonials.map((item, index) => ({...item, virtualIndex: index})),
      // First item (for wrapping to the right)
      {...testimonials[0], virtualIndex: testimonialsLength}
    ];
  };
  
  const infiniteTestimonials = createInfiniteTestimonials();
  
  // Scroll to the card and ensure it's centered
  const scrollToCard = (index, smooth = true) => {
    if (!carouselRef.current) return;

    const normalizedIndex = getVirtualIndex(index);
    
    // Add 1 to account for the prepended item
    const targetIndex = normalizedIndex + 1;
    
    const cardWidth = carouselRef.current.querySelector('.testimonial-card').offsetWidth;
    const containerWidth = carouselRef.current.offsetWidth;
    
    // Calculate position to center the card
    const centerPosition = (targetIndex * cardWidth) - (containerWidth / 2) + (cardWidth / 2);
    
    carouselRef.current.scrollTo({
      left: centerPosition,
      behavior: smooth ? 'smooth' : 'auto'
    });
    
    // Center the avatar
    updateAvatarScroll(normalizedIndex);
  };

  // Update which cards are active/adjacent
  const updateCardClasses = () => {
    if (!carouselRef.current) return;
    
    const cards = Array.from(carouselRef.current.querySelectorAll('.testimonial-card'));
    
    const normalizedActiveIndex = getVirtualIndex(activeIndex);
    const prevIndex = getVirtualIndex(activeIndex - 1);
    const nextIndex = getVirtualIndex(activeIndex + 1);
    
    cards.forEach(card => {
      const virtualIndex = parseInt(card.dataset.virtualIndex);
      card.classList.remove('active', 'adjacent-left', 'adjacent-right');
      
      // Handle special case for the wrapped items
      if (virtualIndex === -1 && normalizedActiveIndex === testimonialsLength - 1) {
        card.classList.add('active');
      } else if (virtualIndex === testimonialsLength && normalizedActiveIndex === 0) {
        card.classList.add('active');
      } else if (virtualIndex === normalizedActiveIndex) {
        card.classList.add('active');
      } else if (virtualIndex === prevIndex || (virtualIndex === testimonialsLength - 1 && normalizedActiveIndex === 0)) {
        card.classList.add('adjacent-left');
      } else if (virtualIndex === nextIndex || (virtualIndex === 0 && normalizedActiveIndex === testimonialsLength - 1)) {
        card.classList.add('adjacent-right');
      }
    });
  };

  // Auto rotation with interval
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isDragging) {
        const nextIndex = getVirtualIndex(activeIndex + 1);
        setActiveIndex(nextIndex);
      }
    }, 6000);

    return () => clearInterval(interval);
  }, [isDragging, activeIndex]);

  // Update scroll position and classes when active index changes
  useEffect(() => {
    updateCardClasses();
    scrollToCard(activeIndex, !isDragging);
  }, [activeIndex, isDragging]);

  // Handle avatar click
  const handleAvatarClick = (index) => {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      setAnimationFrameId(null);
    }
    
    setActiveIndex(index);
  };

  // Handle card click
  const handleCardClick = (index) => {
    const virtualIndex = parseInt(index);
    
    // Handle the special cases for the first and last (repeated) items
    if (virtualIndex === -1) {
      setActiveIndex(testimonialsLength - 1);
    } else if (virtualIndex === testimonialsLength) {
      setActiveIndex(0);
    } else if (virtualIndex !== getVirtualIndex(activeIndex)) {
      setActiveIndex(virtualIndex);
    }
  };

  // Mouse events for dragging
  const handleMouseDown = (e) => {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      setAnimationFrameId(null);
    }
    
    setIsDragging(true);
    setStartX(e.pageX);
    setLastX(e.pageX);
    setLastTimestamp(Date.now());
    setScrollLeft(carouselRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    
    const currentX = e.pageX;
    const currentTime = Date.now();
    const deltaTime = Math.max(currentTime - lastTimestamp, 10);
    
    const dx = currentX - lastX;
    const newVelocity = dx / deltaTime * 10;
    
    setVelocity(velocity * 0.7 + newVelocity * 0.3);
    
    carouselRef.current.scrollLeft = scrollLeft - (currentX - startX) * 1.5;
    
    setLastX(currentX);
    setLastTimestamp(currentTime);
  };

  // Handle end of drag with momentum and snap-to
  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    let currentVelocity = velocity * 25;
    let lastTimestamp = Date.now();
    
    const animateMomentum = () => {
      const now = Date.now();
      const deltaTime = now - lastTimestamp;
      lastTimestamp = now;
      
      const scrollDelta = currentVelocity * deltaTime / 16.7;
      carouselRef.current.scrollLeft -= scrollDelta;
      
      currentVelocity *= Math.pow(0.96, deltaTime / 16.7);
      
      if (Math.abs(currentVelocity) < 0.5) {
        const cardWidth = carouselRef.current.querySelector('.testimonial-card').offsetWidth;
        const containerCenter = carouselRef.current.offsetWidth / 2;
        const scrollPosition = carouselRef.current.scrollLeft + containerCenter;
        
        // Find the closest card based on scroll position
        let closestIndex = Math.round(scrollPosition / cardWidth) - 1; // -1 to account for prepended item
        
        // Handle the special cases
        if (closestIndex < 0) {
          closestIndex = testimonialsLength - 1;
        } else if (closestIndex >= testimonialsLength) {
          closestIndex = 0;
        }
        
        setActiveIndex(closestIndex);
        return;
      }
      
      const id = requestAnimationFrame(animateMomentum);
      setAnimationFrameId(id);
    };
    
    animateMomentum();
  };

  // Touch events (mobile)
  const handleTouchStart = (e) => {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      setAnimationFrameId(null);
    }
    
    setIsDragging(true);
    setStartX(e.touches[0].pageX);
    setLastX(e.touches[0].pageX);
    setLastTimestamp(Date.now());
    setScrollLeft(carouselRef.current.scrollLeft);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    
    const currentX = e.touches[0].pageX;
    const currentTime = Date.now();
    const deltaTime = Math.max(currentTime - lastTimestamp, 10);
    
    const dx = currentX - lastX;
    const newVelocity = dx / deltaTime * 10;
    
    setVelocity(velocity * 0.7 + newVelocity * 0.3);
    
    carouselRef.current.scrollLeft = scrollLeft - (currentX - startX) * 1.5;
    
    setLastX(currentX);
    setLastTimestamp(currentTime);
  };

  const handleTouchEnd = handleMouseUp;

  // Scroll the avatar to center the selected one
  const updateAvatarScroll = (index) => {
    if (avatarsRef.current && index !== null) {
      const avatarElements = avatarsRef.current.children;
      if (avatarElements[index]) {
        const avatarElement = avatarElements[index];
        const containerWidth = avatarsRef.current.offsetWidth;
        const avatarLeft = avatarElement.offsetLeft;
        const avatarWidth = avatarElement.offsetWidth;
        
        avatarsRef.current.scrollTo({
          left: avatarLeft - (containerWidth / 2) + (avatarWidth / 2),
          behavior: 'smooth'
        });
      }
    }
  };

  // Ensure avatar scrolls when active index changes
  useEffect(() => {
    updateAvatarScroll(getVirtualIndex(activeIndex));
  }, [activeIndex]);

  // Handle window resize to recalculate positions
  useEffect(() => {
    const handleResize = () => {
      scrollToCard(activeIndex, false);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeIndex]);

  // Initial setup after component mounts
  useEffect(() => {
    // Initial scroll to center the initial active card
    if (carouselRef.current) {
      setTimeout(() => {
        scrollToCard(activeIndex, false);
      }, 100);
    }
  }, []);

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
        onMouseLeave={() => setIsDragging(false)}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {infiniteTestimonials.map((testimonial, index) => {
          const virtualIndex = testimonial.virtualIndex;
          return (
            <div
              key={index}
              className="testimonial-card"
              onClick={() => handleCardClick(virtualIndex)}
              data-virtual-index={virtualIndex}
            >
              {activeIndex === virtualIndex && (
                <>
                  <div className="top-left-corner"></div>
                  <div className="top-right-corner"></div>
                  <div className="bottom-left-corner"></div>
                  <div className="bottom-right-corner"></div>
                </>
              )}
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
          );
        })}
      </div>
    </div>
  );
}
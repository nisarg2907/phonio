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
  
  // Create a wrapped array of testimonials to create the illusion of infinite scrolling
  // This adds the last testimonial at the beginning and the first testimonial at the end
  const getVirtualIndex = (realIndex) => {
    return ((realIndex % testimonialsLength) + testimonialsLength) % testimonialsLength;
  };
  
  // Calculate the position to scroll to for a given index
  const scrollToCard = (index, smooth = true) => {
    if (!carouselRef.current) return;

    // Normalize the index to ensure it's within bounds
    const normalizedIndex = getVirtualIndex(index);
    
    const cardWidth = 450;
    const gapWidth = 2;
    const activeCardExtraMargin = 5;
    const totalWidth = cardWidth + gapWidth + activeCardExtraMargin;
    
    const containerWidth = carouselRef.current.offsetWidth;
    const centerPosition = (normalizedIndex * totalWidth) - (containerWidth / 2) + (cardWidth / 2);
    
    carouselRef.current.scrollTo({
      left: centerPosition,
      behavior: smooth ? 'smooth' : 'auto'
    });
    
    // Update the active avatar
    updateAvatarScroll(normalizedIndex);
  };

  // Update which cards have the adjacent-left and adjacent-right classes
  const updateAdjacentCards = () => {
    if (!carouselRef.current) return;
    
    const cards = Array.from(carouselRef.current.children);
    cards.forEach((card, index) => {
      card.classList.remove('adjacent-left', 'adjacent-right');
      
      const prevIndex = getVirtualIndex(activeIndex - 1);
      const nextIndex = getVirtualIndex(activeIndex + 1);
      
      if (getVirtualIndex(index) === prevIndex) {
        card.classList.add('adjacent-left');
      } else if (getVirtualIndex(index) === nextIndex) {
        card.classList.add('adjacent-right');
      }
    });
  };

  // Circular auto-scrolling with slower transition (8000ms)
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isDragging) {
        const nextIndex = getVirtualIndex(activeIndex + 1);
        setActiveIndex(nextIndex);
        scrollToCard(nextIndex);
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [isDragging, activeIndex]);

  useEffect(() => {
    updateAdjacentCards();
    scrollToCard(activeIndex, !isDragging);
  }, [activeIndex, isDragging]);

  // When clicking on an avatar, immediately focus that testimonial
  const handleAvatarClick = (index) => {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      setAnimationFrameId(null);
    }
    
    setActiveIndex(index);
    scrollToCard(index);
  };

  const handleCardClick = (index) => {
    if (getVirtualIndex(index) !== activeIndex) {
      handleAvatarClick(getVirtualIndex(index));
    }
  };

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
        const cardWidth = 450;
        const gapWidth = 2;
        const activeCardExtraMargin = 5;
        const totalCardWidth = cardWidth + gapWidth + activeCardExtraMargin;
        
        const containerCenter = carouselRef.current.offsetWidth / 2;
        const scrollPosition = carouselRef.current.scrollLeft + containerCenter;
        
        let closestIndex = Math.round(scrollPosition / totalCardWidth);
        
        // Ensure circular behavior by wrapping the index
        closestIndex = getVirtualIndex(closestIndex);
        
        setActiveIndex(closestIndex);
        scrollToCard(closestIndex);
        return;
      }
      
      const id = requestAnimationFrame(animateMomentum);
      setAnimationFrameId(id);
    };
    
    animateMomentum();
  };

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

  // Function to scroll avatar container to show active avatar
  const updateAvatarScroll = (index) => {
    if (avatarsRef.current && index !== null) {
      const avatarElements = avatarsRef.current.children;
      if (avatarElements[index]) {
        const avatarElement = avatarElements[index];
        const containerWidth = avatarsRef.current.offsetWidth;
        const avatarLeft = avatarElement.offsetLeft;
        const avatarWidth = avatarElement.offsetWidth;
        
        avatarsRef.current.scrollLeft = avatarLeft - (containerWidth / 2) + (avatarWidth / 2);
      }
    }
  };

  // Scroll avatar container to show active avatar
  useEffect(() => {
    updateAvatarScroll(activeIndex);
  }, [activeIndex]);

  // Function to create duplicate testimonials at the beginning and end
  // This creates the illusion of infinite scrolling
  const createInfiniteTestimonialsList = () => {
    const lastIndex = testimonialsLength - 1;
    
    // Create a new array with duplicated items at beginning and end
    return [
      ...testimonials.map((testimonial, index) => ({
        ...testimonial,
        virtualIndex: index,
      })),
    ];
  };

  // Get the infinite list of testimonials
  const infiniteTestimonials = createInfiniteTestimonialsList();

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
        {/* Add the last testimonial at the beginning for infinite scrolling */}
        <div
          key="last-clone"
          className={`testimonial-card ${activeIndex === testimonialsLength - 1 ? 'active' : ''} ${activeIndex === 0 ? 'adjacent-left' : ''}`}
          onClick={() => handleCardClick(testimonialsLength - 1)}
          data-index={testimonialsLength - 1}
        >
          {activeIndex === testimonialsLength - 1 && (
            <>
              <div className="top-left-corner"></div>
              <div className="top-right-corner"></div>
              <div className="bottom-left-corner"></div>
              <div className="bottom-right-corner"></div>
            </>
          )}
          <div className="testimonial-content">
            <p>{testimonials[testimonialsLength - 1].testimonial}</p>
          </div>
          <div className="testimonial-author">
            <div className="author-avatar">
              {testimonials[testimonialsLength - 1].image}
            </div>
            <div className="author-info">
              <h4>{testimonials[testimonialsLength - 1].name}</h4>
              <p>{testimonials[testimonialsLength - 1].designation}</p>
            </div>
          </div>
        </div>
        
        {/* Original testimonials */}
        {testimonials.map((testimonial, index) => {
          const isPrev = (index === getVirtualIndex(activeIndex - 1));
          const isNext = (index === getVirtualIndex(activeIndex + 1));
          const adjacentClass = isPrev ? 'adjacent-left' : (isNext ? 'adjacent-right' : '');
          
          return (
            <div
              key={index}
              className={`testimonial-card ${activeIndex === index ? 'active' : ''} ${adjacentClass}`}
              onClick={() => handleCardClick(index)}
              data-index={index}
            >
              {activeIndex === index && (
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
        
        {/* Add the first testimonial at the end for infinite scrolling */}
        <div
          key="first-clone"
          className={`testimonial-card ${activeIndex === 0 ? 'active' : ''} ${activeIndex === testimonialsLength - 1 ? 'adjacent-right' : ''}`}
          onClick={() => handleCardClick(0)}
          data-index={0}
        >
          {activeIndex === 0 && (
            <>
              <div className="top-left-corner"></div>
              <div className="top-right-corner"></div>
              <div className="bottom-left-corner"></div>
              <div className="bottom-right-corner"></div>
            </>
          )}
          <div className="testimonial-content">
            <p>{testimonials[0].testimonial}</p>
          </div>
          <div className="testimonial-author">
            <div className="author-avatar">
              {testimonials[0].image}
            </div>
            <div className="author-info">
              <h4>{testimonials[0].name}</h4>
              <p>{testimonials[0].designation}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

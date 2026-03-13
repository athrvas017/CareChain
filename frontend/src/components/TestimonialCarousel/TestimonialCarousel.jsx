import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import styles from './TestimonialCarousel.module.css';

const testimonials = [
  {
    id: 1,
    name: "Sarah Jenkins",
    role: "Regular Donor",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
    quote: "CareChain gives me peace of mind. I can track exactly where my money goes and see the real impact it has through field worker verifications."
  },
  {
    id: 2,
    name: "Rajesh Kumar",
    role: "NGO Partner",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
    quote: "The milestone-based funding model has helped our NGO build trust with major donors. The transparency is unmatched in the philanthropic sector."
  },
  {
    id: 3,
    name: "Amina Yusuf",
    role: "Beneficiary",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150",
    quote: "Thanks to the campaign on CareChain, my community finally has access to clean drinking water. The process was transparent and fast."
  }
];

const TestimonialCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={styles.carouselContainer}>
      <div 
        className={styles.slidesWrapper} 
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className={styles.slide}>
            <div className={`glass-card ${styles.testimonialCard}`}>
              <Quote size={40} className={styles.quoteIcon} />
              <p className={styles.quoteText}>"{testimonial.quote}"</p>
              
              <div className={styles.authorInfo}>
                <img src={testimonial.image} alt={testimonial.name} className={styles.authorImage} />
                <div>
                  <h4 className={styles.authorName}>{testimonial.name}</h4>
                  <span className={styles.authorRole}>{testimonial.role}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.controls}>
        <button onClick={prevSlide} className={styles.controlBtn} aria-label="Previous testimonial">
          <ChevronLeft size={24} />
        </button>
        <div className={styles.indicators}>
          {testimonials.map((_, index) => (
            <button
              key={index}
              className={`${styles.indicator} ${index === currentIndex ? styles.activeIndicator : ''}`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
        <button onClick={nextSlide} className={styles.controlBtn} aria-label="Next testimonial">
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
};

export default TestimonialCarousel;

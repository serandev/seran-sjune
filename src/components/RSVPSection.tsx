import React, { useEffect, useRef, useState } from 'react';

const RSVPSection: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [attending, setAttending] = useState<boolean | null>(null);
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fadeIn');
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For demonstration purposes, we'll just set submitted to true
    // In a real app, you'd send this data to a server
    setSubmitted(true);
  };

  return (
    <section 
      ref={sectionRef}
      className="py-24 bg-secondary/5 opacity-0"
      id="rsvp"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto bg-background rounded-lg shadow-lg p-8 md:p-12">
          <h2 className="font-serif text-3xl md:text-4xl text-primary mb-8 text-center">
            {submitted ? 'Thank You!' : 'RSVP'}
          </h2>
          
          {submitted ? (
            <div className="text-center">
              <p className="text-secondary text-lg mb-6">
                Your response has been received. We appreciate your warm wishes!
              </p>
              <div className="w-20 h-20 mx-auto mb-6 bg-accent/10 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-accent" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <button
                onClick={() => setSubmitted(false)}
                className="inline-block bg-secondary/10 text-secondary py-2 px-4 rounded-full mt-4 hover:bg-secondary/20 transition-colors"
              >
                Edit Response
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-secondary font-medium mb-2">Name</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-accent/50"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-secondary font-medium mb-2">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-accent/50"
                  required
                />
              </div>
              
              <div>
                <p className="block text-secondary font-medium mb-2">Will you be attending?</p>
                <div className="flex space-x-4">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="attending"
                      checked={attending === true}
                      onChange={() => setAttending(true)}
                      className="sr-only"
                    />
                    <span className={`w-5 h-5 inline-block mr-2 rounded-full border border-gray-300 ${attending === true ? 'bg-accent border-accent' : 'bg-white'}`}>
                      {attending === true && (
                        <span className="block w-5 h-5 rounded-full bg-accent scale-50 transform"></span>
                      )}
                    </span>
                    <span>Yes, I'll be there</span>
                  </label>
                  
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="attending"
                      checked={attending === false}
                      onChange={() => setAttending(false)}
                      className="sr-only"
                    />
                    <span className={`w-5 h-5 inline-block mr-2 rounded-full border border-gray-300 ${attending === false ? 'bg-accent border-accent' : 'bg-white'}`}>
                      {attending === false && (
                        <span className="block w-5 h-5 rounded-full bg-accent scale-50 transform"></span>
                      )}
                    </span>
                    <span>Sorry, I can't make it</span>
                  </label>
                </div>
              </div>
              
              <div>
                <label htmlFor="message" className="block text-secondary font-medium mb-2">Message (Optional)</label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-accent/50"
                ></textarea>
              </div>
              
              <div className="text-center">
                <button
                  type="submit"
                  className="inline-block bg-accent text-white py-3 px-8 rounded-full shadow-md transition-transform hover:scale-105"
                >
                  Send RSVP
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default RSVPSection;
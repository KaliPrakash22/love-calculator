
import React, { useMemo } from 'react';

const FloatingHearts: React.FC = () => {
  const hearts = useMemo(() => {
    return Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: Math.random() * (30 - 10) + 10,
      duration: Math.random() * (15 - 5) + 5,
      delay: Math.random() * 10,
      opacity: Math.random() * 0.5 + 0.2,
      color: ['text-pink-300', 'text-rose-300', 'text-red-300', 'text-pink-400'][Math.floor(Math.random() * 4)]
    }));
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className={`heart-particle ${heart.color}`}
          style={{
            left: `${heart.left}%`,
            fontSize: `${heart.size}px`,
            animationDuration: `${heart.duration}s`,
            animationDelay: `${heart.delay}s`,
            opacity: heart.opacity
          }}
        >
          ❤️
        </div>
      ))}
    </div>
  );
};

export default FloatingHearts;

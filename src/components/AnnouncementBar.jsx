import { useEffect, useState } from "react";

const messages = [
  "Use ETHEN10 for 10% off",
  "Welcome to Ethen Street",
  "Sale is Going On - Hurry Up!!!",
  "Limited Stocks!!"
];

const AnnouncementBar = () => {
  const [index, setIndex] = useState(0);
  const [animate, setAnimate] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimate(false);

      setTimeout(() => {
        setIndex((prev) => (prev + 1) % messages.length);
        setAnimate(true);
      }, 200); // small reset gap

    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-brand-navy text-white text-center text-sm py-2 overflow-hidden">
      <div
  key={index}
  className="animate-slide text-center"
      >
        {messages[index]}
      </div>
    </div>
  );
};

export default AnnouncementBar;
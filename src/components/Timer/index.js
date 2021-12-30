import React, { useEffect } from 'react';

const Timer = ({ setListening, setRunTimer, timeLeft, setTimeLeft }) => {

  useEffect(() => {

    const timerID = setInterval(() => {
      if (timeLeft === 0) {
        setTimeLeft(30);
        DZ.player.pause();
        setListening(false);
        clearInterval(timerID);
        setRunTimer(false);
      } else {
        setTimeLeft(timeLeft--);
      };
    }, 1000);

    return () => {
      clearInterval(timerID);
      setTimeLeft(timeLeft--);

      if (timeLeft === 0) {
        setTimeLeft(30);
      };

    };
  }, []);

  return (
    <>
      {/* just an empty component for a timer who can clear itself */}
    </>
  );
};

export default Timer;
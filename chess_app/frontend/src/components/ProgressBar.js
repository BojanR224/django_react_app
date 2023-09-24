import React, { useState, useEffect } from "react";

const ProgressBar = (props) => {
  const [progress, setProgress] = useState(props.progress);

  useEffect(() => {
    setProgress(props.progress);
  }, [props.progress]);

  return (
    <div
      className="progress_main_bar"
      role="progressbar"
      aria-valuenow="35"
      aria-valuemin="0"
      aria-valuemax="100"
    >
      <div
        className="progress_bar"
        style={{ transform: `translateY(${progress - 100}%)` }}
      ></div>
    </div>
  );
};

export default ProgressBar;

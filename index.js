const isElementInViewport = (el) => {
  const rect = el.getBoundingClientRect();

  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth) 
  );
}

const hasTurnedVisible = (el, callback) => {
  let visibility = false;
  return () => {
    if (visibility) {
      return;
    }

    const isVisible = isElementInViewport(el);

    if (isVisible) {
      visibility = true;
      callback();
    }
  }
}

const applyAnimationStyles = (element, duration = '1s', delay = '0') => {
  element.style = `
    animation: draw ${duration} ease-in forwards ${delay};
    stroke-dasharray: 1;
    stroke-dashoffset: 1px;
  `;
}

const animatePathsById = (pathId, numberOfPaths, animateSpeedMultiplier = 1) => {
  let accumulatedDelay = 0;
  for (let i = 1; i <= numberOfPaths; i++) {
    const id = `${pathId}${i}`;
    const element = document.getElementById(id);
    
    const pathLength = element.getTotalLength() * animateSpeedMultiplier;
    const duration = `${pathLength}ms`;
    const delay = `${accumulatedDelay}ms`;
    
    const handler = hasTurnedVisible(element, () => applyAnimationStyles(element, duration, delay));
    
    handler();
    window.addEventListener('scroll', handler);
  
    accumulatedDelay = pathLength + accumulatedDelay + 100; // add 100ms to add small pause between drawing strokes
  }
}

animatePathsById('pawn', 14, 1);
animatePathsById('bishop', 21, 1);
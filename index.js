const isElementInViewport = (el) => {
  const rect = el.getBoundingClientRect();

  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth) 
  );
}

const hasTurnedVisible = (pathId, numberOfPaths, callback) => {
  let visibility = false;

  const elements = [];
  for (let i = 1; i <= numberOfPaths; i++) {
    const id = `${pathId}${i}`;
    const element = document.getElementById(id);
    elements.push(element);
  }

  return () => {
    if (visibility) {
      return;
    }
    
    const isVisible = elements.every((el) => isElementInViewport(el));

    if (isVisible) {
      visibility = true;
      callback(elements);
    }
  }
}

const applyAnimationStyles = (elements, animationSpeed = 1) => {
  let accumulatedDelay = 0;
  elements.forEach((element) => {
    const delay = `${accumulatedDelay}ms`;

    if (element.dataset.highlight) {
      element.style = `
        animation: appear 200ms ease-in forwards ${delay};
      `;

      accumulatedDelay = 200 + accumulatedDelay + 100; // add 100ms to add small pause between drawing strokes
    } else {
      const pathLength = element.getTotalLength() * animationSpeed;
      const duration = `${pathLength}ms`;
      const delay = `${accumulatedDelay}ms`;
      
      element.style = `
        stroke-dasharray: 1;
        stroke-dashoffset: 1px;
        stroke-opacity: 0;
        animation: draw ${duration} ease-out forwards ${delay};
      `;
    
      accumulatedDelay = pathLength + accumulatedDelay + 100; // add 100ms to add small pause between drawing strokes
    }
  });

  // apply additional animations with timeout, so they only start after draw animation
  elements.forEach((element) => {
    if (element.dataset.jitter) {
      setTimeout(() => {
        element.style = `
          animation: jitter 1500ms infinite step-end;
        `;
      }, accumulatedDelay);
    } else if (element.parentElement.id.startsWith('arrow')) {
      setTimeout(() => {
        element.parentElement.style = `
          animation: jitter-arrow 1500ms infinite step-end;
        `;
      }, accumulatedDelay);
    }
  });

  // applay trumpet animation & sound effect
  if (elements[elements.length - 1].parentElement.id.startsWith('sound')){
    const soundLeftSubElement = elements.find((element) => element.parentElement.id.startsWith('sound left'));
    const soundRightSubElement = elements.find((element) => element.parentElement.id.startsWith('sound right'));
    setTimeout(() => {
      soundLeftSubElement.parentElement.style = `
      animation: trumpet 3000ms forwards step-end;
      `;
      soundRightSubElement.parentElement.style = `
      animation: trumpet 3000ms forwards step-end;
      `;
      
      new Audio('./trumpet.mp3').play();
    }, accumulatedDelay);
  }
}

const animatePathsById = (pathId, numberOfPaths, animationSpeed) => {
  const handler = hasTurnedVisible(pathId, numberOfPaths, (elements) => 
    applyAnimationStyles(elements, animationSpeed)
  );
  
  handler();
  window.addEventListener('scroll', handler);
}

// baseId, numberOfPaths, animationSpeed
const svgsToAnimate = [
  ['intro_', 16, 0.5],
  ['step_1_', 11, 0.7],
  ['step_2_', 26, 0.5],
  ['step_2_black_', 6, 0.7],
  ['step_3_', 22, 0.5],
  ['step_3_black_', 6, 0.7],
  ['step_4_', 43, 0.3],
  ['arrow_5_', 2, 0.7],
  ['arrow_6_', 2, 0.7],
  ['defense_', 21, 0.5],
  ['footer_line_', 1, 0.7],
];

// hide all elements in the beginning
// will be overriden by animation
const svgIds = svgsToAnimate.map((params) => params[0]);
Array.from(document.getElementsByTagName('path')).forEach(element => {
  if (svgIds.some((id) => element.id.startsWith(id))) {
    element.style = 'opacity: 0';
  }
});

svgsToAnimate.forEach((params) => {
  animatePathsById(...params);
});

// prevent flickering on load
window.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('svg-root');
  root.style = "opacity: 1";
});
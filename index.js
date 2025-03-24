const isElementInViewport = (el) => {
  const rect = el.getBoundingClientRect();

  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth) 
  );
}

const hasTurnedVisible = (pathId, numberOfPaths, ignoredVisibilityChecks = [], callback) => {
  let visibility = false;

  const elements = [];
  const ignoreVisibility = [];
  for (let i = 1; i <= numberOfPaths; i++) {
    const id = `${pathId}${i}`;
    const element = document.getElementById(id);
    elements.push(element);

    if (ignoredVisibilityChecks.includes(i)) {
      ignoreVisibility.push(id);
    }
  }

  return () => {
    if (visibility) {
      return;
    }
    
    const isVisible = elements
      .filter((el) => !ignoreVisibility.includes(el.id))
      .every((el) => isElementInViewport(el));

    if (isVisible) {
      visibility = true;
      callback(elements);
    }
  }
}

const applyAnimationStyles = (elements, animateSpeedMultiplier = 1) => {
  let accumulatedDelay = 0;
  elements.forEach((element) => {
    const pathLength = element.getTotalLength() * animateSpeedMultiplier;
    const duration = `${pathLength}ms`;
    const delay = `${accumulatedDelay}ms`;
    
    element.style = `
      animation: draw ${duration} ease-in forwards ${delay};
      stroke-dasharray: 1;
      stroke-dashoffset: 1px;
    `;
  
    accumulatedDelay = pathLength + accumulatedDelay + 100; // add 100ms to add small pause between drawing strokes
  });
}

const animatePathsById = (pathId, numberOfPaths, animateSpeedMultiplier, ignoredVisibilityChecks) => {
  const handler = hasTurnedVisible(pathId, numberOfPaths, ignoredVisibilityChecks, (elements) => 
    applyAnimationStyles(elements, animateSpeedMultiplier)
  );
  
  handler();
  window.addEventListener('scroll', handler);
}

// baseId, numberOfPaths, animationSpeedMultiplier, ids which are ignored for visibility checks
const svgsToAnimate = [
  ['pawn', 14, 1, [1, 2, 3, 4, 5, 6, 7, 8]],
  ['bishop', 21, 1, []],
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
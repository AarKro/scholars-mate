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

const getAnimationStyles = (duration) => `
  animation: draw ${duration} ease-in forwards;
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
`;

// const testEl = document.getElementById('test');

// const handler = hasTurnedVisible(testEl, () => {
//   console.log('visible!');
// });

// handler();
// window.addEventListener('scroll', handler);
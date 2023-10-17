const IMPRESSION_DURATION_THRESHOLD = 1000;
const INTERSECTION_RATIO = 0.5;
const impressedItems = [];
const isAlreadyImpressedItem = (id) => impressedItems.includes(id);
let eventCount = 0;

const sendEvent = () => {
  console.log(`event sent 💌 count: ${++eventCount}`);
};

const changeStatusImpressed = (targetElement, targetId) => {
  targetElement.style.backgroundColor = "lightgreen";
  impressedItems.push(targetId);
};

const changeStatusOnImpressing = (targetElement) => {
  targetElement.style.backgroundColor = "lightcoral";
};

const changeStatusNotOnImpressing = (targetElement) => {
  targetElement.style.backgroundColor = "skyblue";
};

const createCallback = () => {
  let timeoutId = null;

  return function callback(intersectionObserverEntries) {
    intersectionObserverEntries.forEach((entry) => {
      const { intersectionRatio, target } = entry;
      const { id } = target;

      if (isAlreadyImpressedItem(id) || !entry.isIntersecting) {
        return;
      }

      if (intersectionRatio >= INTERSECTION_RATIO) {
        changeStatusOnImpressing(target, id);

        if (timeoutId) {
          return;
        }

        timeoutId = setTimeout(() => {
          changeStatusImpressed(target, id);
          sendEvent();
          timeoutId = null;
          clearInterval(intervalId);
        }, IMPRESSION_DURATION_THRESHOLD);

        return;
      }

      clearTimeout(timeoutId);
      timeoutId = null;
      changeStatusNotOnImpressing(target, id);
    });
  };
};

const options = {
  root: document.querySelector("#scrollArea"),
  rootMargin: "10px",
  threshold: [...Array(1000)].map((_, index) => index / 1000),
};

document.querySelectorAll(".list-item").forEach((item) => {
  const observer = new IntersectionObserver(createCallback(), options);

  observer.observe(item);
});

const IMPRESSION_DURATION_THRESHOLD = 1000;
const impressedItems = [];
const isAlreadyImpressedItem = (id) => impressedItems.includes(id);
let letEventCount = 0;

const sendEvent = () => {
  console.log(`event sent 💌 count: ${++letEventCount}`);
};

const changeStatusImpressed = (targetElement, targetId) => {
  targetElement.style.backgroundColor = "lightgreen";
  impressedItems.push(targetId);
};

const changeStatusOnImpressing = (targetElement, targetId) => {
  targetElement.style.backgroundColor = "lightcoral";
};

const changeStatusNotOnImpressing = (targetElement, targetId) => {
  targetElement.style.backgroundColor = "skyblue";
};

const createCallback = () => {
  let timeoutId = null;
  /** just for visualization */
  let intervalId = null;
  let clockCount = 0;

  return function callback(intersectionObserverEntries, intersectionObserver) {
    intersectionObserverEntries.forEach((entry) => {
      const { intersectionRatio, target } = entry;
      const { id } = target;

      if (isAlreadyImpressedItem(id) || !entry.isIntersecting) {
        return;
      }

      /** just for visualization */
      target.querySelectorAll(".ratio").forEach((item) => {
        item.textContent = `intersection ratio: ${(
          intersectionRatio * 100
        ).toFixed(2)}%`;
      });

      if (intersectionRatio >= 0.5) {
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

        /** just for visualization */
        intervalId = setInterval(() => {
          clockCount += 0.1;
          target.querySelectorAll(".count").forEach((item) => {
            item.textContent = clockCount.toFixed(1);
          });
        }, 10);
      } else {
        clearTimeout(timeoutId);
        timeoutId = null;
        changeStatusNotOnImpressing(target, id);

        /** just for visualization */
        clearInterval(intervalId);
        intervalId = null;
        clockCount = 0;
        target.querySelectorAll(".count").forEach((item) => {
          item.textContent = clockCount;
        });
      }
    });
  };
};

const options = {
  root: document.querySelector("#scrollArea"),
  /** for this, it's root's padding */
  rootMargin: "10px",
  threshold: [...Array(1000)].map((_, index) => index / 1000),
};

document.querySelectorAll(".list-item").forEach((item) => {
  const observer = new IntersectionObserver(createCallback(), options);

  observer.observe(item);
});

// 'use strict';
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');
const header = document.querySelector('.header');
const allSections = document.querySelectorAll('.section');
const imgTargets = document.querySelectorAll('img[data-src]');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const slides = document.querySelectorAll('.slide');
const slider = document.querySelector('.slider');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const dotContainer = document.querySelector('.dots');

///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// ///////////////////////////////////////
// // Button Scrolling
btnScrollTo.addEventListener('click', function (e) {
  section1.scrollIntoView({
    behavior: 'smooth',
  });
});

// ///////////////////////////////////////
// // Page Navigation
// document.querySelectorAll('.nav__link').forEach(function(el){
//   el.addEventListener('click', function(e){
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     console.log(id);
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth'});
//   })
// });

// 1. Add Event Listener to common parent Element
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  // console.log(e.target);

  // 2. Determine what element Originated the event
  //3. Matching Strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

// ///////////////////////////////////////
// // Building a Tabbed Component

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  // Guard Clause
  if (!clicked) return;

  // Remove Active Classes
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  // Activate Tab
  clicked.classList.add('operations__tab--active');

  // Activate Content Area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

// ///////////////////////////////////////
// // Menu Fade Animation - Passing Arguments to Event Handlers
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(element => {
      if (element !== link) element.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

// The bind method returns a new function and the 'this' keyword becomes the value of the argument
nav.addEventListener('mouseover', handleHover.bind(0.5));

nav.addEventListener('mouseout', handleHover.bind(1));

// ///////////////////////////////////////
// // Sticky Navigation: Intersection Observer API
const navHeight = nav.getBoundingClientRect().height;
console.log(navHeight);

const stickyNav = function (entries) {
  // We are selecting the first element(via threshold)
  // same as entries[0]
  const [entry] = entries;
  // console.log(entry);

  // IF the header is not intersecting the viewport add the 'sticky' class
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

// The rootMargin will add a margin of 90px that will be applied outside the target element(header) in our case -${navHeight}px so it will be inside the target element
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);

// ///////////////////////////////////////
// // Revealing Sections on scroll
const revealSection = function (entries, observer) {
  const [entry] = entries;
  console.log(entry);

  // Guard Clause
  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  // To stop the observer
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  // section.classList.add('section--hidden');
});

// ///////////////////////////////////////
// // Lazy Loading Images
const loadImg = function (entries, observer) {
  const [entry] = entries;

  //Guard Clause
  if (!entry.isIntersecting) return;

  // Replace src with data-src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
});
imgTargets.forEach(img => imgObserver.observe(img));

// ///////////////////////////////////////
// // Slider Component
const mySlider = function () {
  let currentSlide = 0;
  const maxSlide = slides.length;

  // Functions
  const createDots = function () {
    // The '_' is used to throw away an argument we don't need
    slides.forEach(function (_, index) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${index}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, index) =>
        (s.style.transform = `translateX(${100 * (index - slide)}%)`)
    );
  };

  const nextSlide = function () {
    if (currentSlide === maxSlide - 1) {
      //Reset the loop
      currentSlide = 0;
    } else {
      //Becomes 1
      currentSlide++;
    }

    goToSlide(currentSlide);
    activateDot(currentSlide);
  };

  const previousSlide = function () {
    if (currentSlide === 0) {
      currentSlide = maxSlide - 1;
    } else {
      currentSlide--;
    }

    goToSlide(currentSlide);
    activateDot(currentSlide);
  };

  const init = function () {
    goToSlide(0);
    createDots();
    activateDot(0);
  };

  init();

  // Event Handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', previousSlide);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') previousSlide();
    if (e.key === 'ArrowRight') nextSlide();
  });

  // Move slider with Dots button
  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const slide = e.target.dataset.slide;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
mySlider();
// Selecting Elements
// console.log(document.documentElement);

// console.log(document.head);

// console.log(document.body);

document.querySelector('.section');

// const allSections = document.querySelectorAll('.section');
// console.log(allSections);

// document.getElementById('section--1');

// const allButtons = document.getElementsByTagName('button');
// console.log(allButtons);

// console.log(document.getElementsByClassName('btn'));

// Creating and Inserting Elements
// const message = document.createElement('div');

// message.classList.add('cookie-message');

// message.innerHTML='The best day to join Bankist was one year ago.<br> The second best is today!<button class="btn btn--close-cookie">Got It!</button>';

// header.append(message);

// To use both the Append and Prepend methods
// header.prepend(message.cloneNode(true));
// header.prepend(message);
// header.before(message);
// header.after(message);

// Deleting Elements
// document.querySelector('.btn--close-cookie').addEventListener('click', function(){
//   message.remove();
// });

// Styles, Attributes and Classes

// STYLES
// message.style.backgroundColor = '#37383d';
// message.style.width = '120%';

// console.log(message.style.color);
// console.log(message.style.backgroundColor);

// console.log(getComputedStyle(message).color);
// console.log(getComputedStyle(message).height);

// message.style.height = Number.parseInt(getComputedStyle(message).height, 10) + 50 + 'px';

// document.documentElement.style.setProperty('--color-primary', 'orangered');

// ATTRIBUTES
// const logo = document.querySelector('.nav__logo');
// console.log(logo.alt);
// console.log(logo.src);
// console.log(logo.className);

// logo.alt = 'WestWorld';

// Non Standard
// console.log(logo.getAttribute('designer'));

// logo.setAttribute('company', 'Bankist');

// console.log(logo.getAttribute('src'));

// const link = document.querySelector('.nav__link--btn');
// console.log(link.href);
// console.log(link.getAttribute('href'));

// DATA ATTRIBUTES
// console.log(logo.dataset.foodAge);

// CLASSES
// logo.classList.add();
// logo.classList.remove();
// logo.classList.toggle();
// logo.classList.contains();

// DONT DO THIS
// logo.className = 'Donald';
// logo.className = 'Donald';

// Tyes OF Events and Event Handlers
// const h1 = document.querySelector('h1');

// const aleartH1 = function(e){
//   alert('addEventListener: We have found the heading');
// }

// h1.addEventListener('mouseenter', aleartH1);

// setTimeout(() => h1.removeEventListener('mouseenter', aleartH1), 3000);

// h1.onmouseenter = function(e){
//   alert('Onmouseenter event!')
// }

// Event Propagation, Bubbling and Capturing

// const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
// const randomColor = () => `rgb(${randomInt(0, 255)}, ${randomInt(0, 255)}, ${randomInt(0, 255)})`;
// // console.log(randomColor());

// document.querySelector('.nav__link').addEventListener('click', function(e){
//   this.style.backgroundColor = randomColor();
//   console.log('LINK', e.target, e.currentTarget);
//   console.log(e.currentTarget === this);

//   // Stop Propagation

//   // e.stopPropagation();
// });

// document.querySelector('.nav__links').addEventListener('click', function(e){
//   this.style.backgroundColor = randomColor();
//   console.log('CONTAINER', e.target, e.currentTarget);
// })

// document.querySelector('.nav').addEventListener('click', function(e){
//   this.style.backgroundColor = randomColor();
//   console.log('NAV', e.target, e.currentTarget);
// })

// DOM Traversing
// const h1 = document.querySelector('h1');

// Going downwars: child elements
// console.log(h1.querySelectorAll('.highlight'));
// console.log(h1.childNodes);
// console.log(h1.children);
// h1.firstElementChild.style.color = 'white';
// h1.lastElementChild.style.color = 'yellow';

// Going Upwards: parent elements
// console.log(h1.parentNode);
// console.log(h1.parentElement);
// h1.closest('.header').style.background = 'var(--gradient-secondary)';
// h1.closest('h1').style.background = 'var(--gradient-primary)';

//Going sideways: sibling elements
// console.log(h1.previousElementSibling);
// console.log(h1.nextElementSibling);
// console.log(h1.previousSibling);
// console.log(h1.nextSibling);
// console.log(h1.parentElement.children);

// // An Iterable can be spread into an array
// [...h1.parentElement.children].forEach(function(el){
//   // Style all the siblings except the element itself
//   if(el !== h1) el.style.transform = 'scale(0.5)';
// });

// ///////////////////////////////////////
// // Sticky Navigation
// const initialCoords = section1.getBoundingClientRect();
// console.log(initialCoords)

// window.addEventListener('scroll', function(){

//   if(window.scrollY > initialCoords.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });

// ///////////////////////////////////////
// // Intersection Observer API

// The Intersection Observer API allows our code to observe changes to a way a target element intersects another element or the way it intersects the viewport.

// Our Callback function will be called each time our target element is intersecting the viewport at the threshold
const obsCallback = function (entries, observer) {
  entries.forEach(entry => {
    // console.log(entry);
  });
};

// The root is the element that the target is intersecting

// When null is used as the as value the root. It will enable us to observe our target element intersect the entire viewport

// The Threshold is the percentage of intersection at which the observer callback function will be called

// Simply put The Threshold is simply when a part of the setion becomes visible

// The Threshold can accept an array

// 0% means that our callback function will be triggered each time the target element moves completely out of the viewport AND AS SOON AS IT ENTERS THE VIEWPORT!

// **If we pass 1 in the threshold [0, 1, 0.2] the callback will only be called when 100% of the target is visible in the viewport in section1 it's impossible bacuse the section is bigger than the viewport**

const obsOptions = {
  root: null,
  threshold: [0, 0.2],
};

// Will accept a callback function and an object
const observer = new IntersectionObserver(obsCallback, obsOptions);

// 'section1' is the target
observer.observe(section1);



// ///////////////////////////////////////
// // Lifecycle DOM Events
// Compiles only HTML, CSS and JS. Doesn't wait for images
document.addEventListener('DOMContentLoaded', function (e) {
  console.log('HTML parsed and DOM tree built!', e);
});


// Waits for everything to compile
// window.addEventListener('load', function (e) {
//   console.log('Page fully loaded', e);
// });

window.addEventListener('beforeunload', function (e) {
  e.preventDefault();
  console.log(e);
  e.returnValue = '';
});



// Efficient Script Loading_ defer and async
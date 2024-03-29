// Служебные переменные
const d = document;
const body = document.querySelector("body");

// Служебные функции
function find(selector) {
  return document.querySelector(selector);
}

function findAll(selectors) {
  return document.querySelectorAll(selectors);
}

// Удаляет у всех элементов items класс itemClass
function removeAll(items, itemClass) {
  if (typeof items == "string") {
    items = document.querySelectorAll(items);
  }
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    item.classList.remove(itemClass);
  }
}

// Получаем все соседние элементы
function getSiblings(elem) {
  var siblings = [];
  var sibling = elem;
  while (sibling.previousSibling) {
    sibling = sibling.previousSibling;
    sibling.nodeType == 1 && siblings.push(sibling);
  }

  sibling = elem;
  while (sibling.nextSibling) {
    sibling = sibling.nextSibling;
    sibling.nodeType == 1 && siblings.push(sibling);
  }

  return siblings;
}

// Расстояния между элементом и верхней границей страницы
function offsetPage(elem) {
  var rect = elem.getBoundingClientRect(),
    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  return { top: rect.top + scrollTop, left: rect.left + scrollLeft };
}

function bodyLock(con) {
  if (con === true) {
    body.classList.add("_lock");
  } else if (con === false) {
    body.classList.remove("_lock");
  } else if (con === undefined) {
    if (!body.classList.contains("_lock")) {
      body.classList.add("_lock");
    } else {
      body.classList.remove("_lock");
    }
  } else {
    console.error("Неопределенный аргумент у функции bodyLock()");
  }
}

const popups = [".search", ".menu"];

window.addEventListener("click", (e) => {
  // Смена языка
  if (e.target.classList.contains("modal-lang__link")) changeLang(e);

  if (
    (find(".menu._show") &&
      find(".search._found") &&
      (e.target.classList.contains("textfield_search-header") ||
        e.target.closest(".textfield_search-header"))) ||
    (find(".menu._show") &&
      !(e.target.classList.contains("header") || e.target.closest(".header")))
  ) {

    find(".burger").classList.remove("_close");
    find(".menu").classList.remove("_show");
    find(".menu-bg").classList.remove("_show");
  }

  if (
    find(".search._show") &&
    !(
      e.target.classList.contains("search") ||
      e.target.closest(".search") ||
      e.target.classList.contains("textfield_search-header") ||
      e.target.closest(".textfield_search-header")
    )
  ) {
    find(".search").classList.remove("_show");
    if (!find(".menu").classList.contains("_show")) {
      find(".menu-bg").classList.remove("_show");
    }
  }
});

// Отступ Раздела с контентом на расстояние равное ширине расширенного фильтра
// indentContentListAD(window.innerWidth)
// window.addEventListener('resize', () => indentContentListAD(window.innerWidth))

// function indentContentListAD(width) {
//   const content = find(".ofr-content");
//   if (content === null) return

//   const advancedFilter = find(".advanced-filter");
//   const widthDisplay = width < 1280 ? 31 : 50;

// 	if (window.innerWidth > 1280) {
//     content.style.width = `calc(100% - ${advancedFilter.offsetWidth + widthDisplay}px)`
// 	}
// 	else {
//     content.style.width = '100%'
// 	}
// }

// Текстовым полям, которые имеют класс clear-by-cross, будет добавлена кнопка, кликнув по которой, содержимое инпута очиститься
clearByCross();

function clearByCross() {
  const textfieldElems = findAll(".clear-by-cross");

  for (let i = 0; i < textfieldElems.length; i++) {
    const textfield = textfieldElems[i];
    const input = textfield.querySelector("input, textarea");
    const btn = document.createElement("div");

    btn.classList.add("textfield__clear");
    btn.innerHTML = `<svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.5 0C4.97 0 0.5 4.47 0.5 10C0.5 15.53 4.97 20 10.5 20C16.03 20 20.5 15.53 20.5 10C20.5 4.47 16.03 0 10.5 0Z" fill="#B4B4BF"/><path d="M14.0833 13.5835C13.7583 13.9085 13.2333 13.9085 12.9083 13.5835L10.4999 11.1752L8.09159 13.5835C7.76659 13.9085 7.24159 13.9085 6.91659 13.5835C6.76055 13.4278 6.67285 13.2164 6.67285 12.996C6.67285 12.7756 6.76055 12.5642 6.91659 12.4085L9.32492 10.0002L6.91659 7.59185C6.76055 7.43615 6.67285 7.22478 6.67285 7.00435C6.67285 6.78391 6.76055 6.57254 6.91659 6.41685C7.24159 6.09185 7.76659 6.09185 8.09159 6.41685L10.4999 8.82518L12.9083 6.41685C13.2333 6.09185 13.7583 6.09185 14.0833 6.41685C14.4083 6.74185 14.4083 7.26685 14.0833 7.59185L11.6749 10.0002L14.0833 12.4085C14.3999 12.7252 14.3999 13.2585 14.0833 13.5835Z" fill="white"/></svg>`;

    textfield.append(btn);

    btn.addEventListener("click", (e) => {
      input.value = "";
      input.focus();
      input.classList.remove("_full");
      btn.classList.remove("_show");

      if (btn.closest(".select-search")) {
        btn.closest(".select-search").classList.remove("_open");
        btn
          .closest(".select-search")
          .querySelectorAll(".select-dropdown__checkbox-input")
          .forEach((el) => {
            el.checked = false;
          });
      }

      if (btn.parentElement.querySelector("textarea")) {
        const textarea = btn.parentElement.querySelector("textarea");
        textarea.style.height = "auto";
      }

      if (btn.closest("[data-form-valid=submit-disabled]")) {
        const form = btn.closest("[data-form-valid=submit-disabled]");
        btnSubmitDisabled(form, form.querySelector("[type=submit]"));
      }
    });

    if (input.value != "") {
      btn.classList.add("_show");
    } else {
      btn.classList.remove("_show");
    }

    input.addEventListener("input", (e) => {
      if (input.value != "") {
        btn.classList.add("_show");
      } else {
        btn.classList.remove("_show");
      }
    });
  }
}

// Текстовым полям, которые имеют класс show-pass-by-eye, будет добавлена кнопка, кликнув по которой, пароль будет показан
showPassword();

function showPassword() {
  const textfieldElems = findAll(".show-pass-by-eye");

  for (let i = 0; i < textfieldElems.length; i++) {
    const textfield = textfieldElems[i];
    const input = textfield.querySelector("input");
    const btn = document.createElement("div");

    btn.classList.add("textfield__show-pass");
    btn.innerHTML =
      "<svg class='eye-show'><use href='./img/sprite.svg#eye-show'></use></svg><svg class='eye-hide'><use href='./img/sprite.svg#eye-hide'></use></svg>";

    textfield.append(btn);

    input.classList.add("_hide-pass");
    btn.addEventListener("click", (e) => {
      input.classList.toggle("_hide-pass");
      input.classList.toggle("_show-pass");
      btn.classList.toggle("_active");

      if (input.classList.contains("_show-pass")) {
        input.type = "text";
      } else {
        input.type = "password";
      }

      input.focus();
    });

    input.addEventListener("input", (e) => {
      if (input.value != "") {
        btn.classList.add("_show");
      } else {
        btn.classList.remove("_show");
      }
    });
  }
}

// Добавление выбора локации в мобильное меню
addLocationToMobMenu();

function addLocationToMobMenu() {
  if (window.innerWidth <= 920) {
    const location = find(".location_several-cities");
    const menuBlock = find(".mob-menu__location");

    menuBlock.innerHTML = location.innerHTML;
    location.remove();
  }
}

// Поиск по сайту
siteSearch();

function siteSearch() {
  const form = find(".textfield_search-header");
  const input = form.querySelector("input");
  const clear = form.querySelector(".textfield__clear");
  const search = find(".search");
  const menu = find(".menu");
  const burger = find(".burger");
  const menuBg = find(".menu-bg");
  const loader = find(".search__result-loading");
  const notFound = find(".search__result-not-found");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    siteSearchPopup(input);
    showLoader();

    if (find(".menu._show")) {
      find(".menu").classList.remove("_show");
      burger.classList.remove("_close");
    }

    // Имитация загрузки результатов поиска
    setTimeout((e) => {
      siteSearchData(input);
    }, 1500);
  });
  input.addEventListener("focus", (e) => {
    siteSearchFocus(input);
  });
  clear.addEventListener("click", (e) => {
    siteSearchPopup(input);
  });

  function siteSearchFocus(input) {
    if (input.value != "") {
      search.classList.add("_show");
      menuBg.classList.add("_show");

      if (find(".menu._show")) {
        find(".menu").classList.remove("_show");
        burger.classList.remove("_close");
      }
    }
  }

  function siteSearchPopup(input) {
    const value = input.value;

    if (value != "") {
      search.classList.add("_show");
      menuBg.classList.add("_show");
      clear.classList.add("_show");
    } else {
      search.classList.remove("_show");
      menuBg.classList.remove("_show");
      clear.classList.remove("_show");
    }
  }

  function showLoader() {
    const cardsShow = findAll(".search__result-list .s-result-card");

    for (let i = 0; i < cardsShow.length; i++) {
      const card = cardsShow[i];
      card.remove();
    }

    notFound.classList.remove("_show");
    loader.classList.add("_show");
  }

  async function siteSearchData(input) {
    const value = input.value;
    const result = find(".search__result-list");

    // Поиск в бд запроса поиска
    let response = await fetch("../db.json");

    if (response.ok) {
      let data = await response.json();
      const dataArr = [];

      data.forEach((elem) => {
        if (elem["title"].toLowerCase() === value.toLowerCase())
          dataArr.push(elem["category"]);
      });

      if (dataArr.length === 0) {
        loader.classList.remove("_show");
        notFound.classList.add("_show");
        notFound.querySelector(
          ".search__result-not-found-text span"
        ).innerText = value;
      } else {
        const quantityCat = dataArr.reduce((arr, elem) => {
          arr[elem] = (arr[elem] || 0) + 1;
          return arr;
        }, {});

        loader.classList.remove("_show");

        for (const [title, quantity] of Object.entries(quantityCat)) {
          const card = document.createElement("a");
          card.setAttribute("href", "#");
          card.classList.add("link", "s-result-card");
          card.innerHTML = `
                        <div class="s-result-card__wrap">
                            <div class="s-result-card__text">
                                <h4 class="s-result-card__title">${value}</h4>
                                <span class="s-result-card__cat">${title}</span>
                            </div>
                            <span class="s-result-card__quantity">${quantity}</span>
                        </div>
                    `;

          result.append(card);
        }
      }
    } else {
      console.log("Error" + response.status);
    }
  }
}

// Мобильное меню
menu();

function menu() {
  const burger = find(".burger");
  const menu = find(".menu");
  const menuMob = find("#mob-menu");
  const menuBg = find(".menu-bg");

  burger.addEventListener("click", (e) => {
    if (window.innerWidth > 920) {
      burger.classList.toggle("_close");
      menu.classList.toggle("_show");

      if (menu.classList.contains("_show")) {
        menuBg.classList.add("_show");
      } else {
        menuBg.classList.remove("_show");
      }
    } else {
      openModal(menuMob);
      window.location.hash = "mob-menu";
    }
  });
}

// Фиксация шапки
// fixHeader()
function fixHeader() {
  const header = find(".header");
  const wrapper = find(".wrapper");
  const headerBottom = find(".header__bottom");

  wrapper.style.marginTop = header.clientHeight + "px";
  window.addEventListener("scroll", (e) => {
    if (window.scrollY > 200) {
      headerBottom.classList.add("_hide");
    } else {
      headerBottom.classList.remove("_hide");
    }
  });
}

// Отображение ссылок при наведении на соответствующую категорию в меню
catLinksMenu();

function catLinksMenu() {
  const catElems = findAll(".menu__left-item");

  for (let i = 0; i < catElems.length; i++) {
    const cat = catElems[i];

    cat.addEventListener("mouseenter", (e) => {
      const catData = cat.dataset.menuCat;
      const catLinks = find(`[data-menu-links=${catData}]`);

      // Показываем ссылки по категории
      find(".menu__right._show").classList.remove("_show");
      catLinks.classList.add("_show");

      // Присваеваем активный класс ссылке категории
      find(".menu__left-item._active").classList.remove("_active");
      cat.classList.add("_active");
    });
  }
}

const sliderRecent = new Swiper(".s-recent__slider", {
  spaceBetween: 24, // Расстояние между слайдами

  breakpoints: {
    // 1920: {
		// 	spaceBetween: 29,
		// },
    // 1440: {
		// 	spaceBetween: 24,
		// },
    1025: {
      slidesPerView: 4,
    },
    768: {
      slidesPerView: 3,
      allowTouchMove: false,
    },
    0: {
      slidesPerView: 2,
      spaceBetween: 12,
      allowTouchMove: true,
    },
  },

  navigation: {
    nextEl: ".s-recent__arrow-next",
    prevEl: ".s-recent__arrow-prev",
  },
});
sliderRecent.on('slideChange', function() {
  const MOVED_CLASS = 's-recent__slider--moved';
  if (!this.el.classList.contains(MOVED_CLASS)) {
    this.el.classList.add(MOVED_CLASS)
  }
})

// Адаптивная ширина слайдера
//if (window.innerWidth <= 768) adaptiveWidthSliderMACard()
// window.addEventListener('resize', e => {
//     adaptiveWidthSliderMACard()
// })
function adaptiveWidthSliderMACard() {
  const sliderElems = findAll(".ma-card__slider");

  for (let i = 0; i < sliderElems.length; i++) {
    const slider = sliderElems[i];
    const card = slider.closest(".ma-card");
    const cardWidth = card.offsetWidth;

    slider.style.width = cardWidth + "px";
  }
}

function updateFraction(slider) {
  if (slider.$el[0].children[1].children.length <= 1) {
    slider.$el[0].children[1].remove();
  }
}

const sliderMACard = new Swiper(".ma-card__slider", {
  spaceBetween: 0, // Расстояние между слайдами
  observer: true,
  on: {
    init: function () {
      setTimeout(() => updateFraction(this), 0);
    },
  },
  pagination: {
    el: ".ma-card__pagination",
    clickable: true,
  },
});

function rowContainer() {
  document.querySelectorAll(".la-card__wrap").forEach((card) => {
    card.closest(".list-ofr__card-list").classList.add("list-ofr__card-row");

    let cloneHeader = card.querySelector(".la-card__header").cloneNode(true);
    let cloneContent = card.querySelector(".la-card__content").cloneNode(true);
    let cloneFooter = card.querySelector(".la-card__footer").cloneNode(true);
    let cloneOptions = card.querySelector(".la-card__options").cloneNode(true);

    card.classList.add("_active-row");
    card.querySelector(".la-card__content").insertAdjacentHTML(
      "beforebegin",
      '<div class="la-card__row-container"></div>'
    );
    card.querySelector(".la-card__row-container").insertAdjacentHTML(
      "beforeend",
      cloneHeader.outerHTML
    );
    card.querySelector(".la-card__row-container").insertAdjacentHTML(
      "beforeend",
      cloneContent.outerHTML
    );
    card.querySelector(".la-card__row-container").insertAdjacentHTML(
      "beforeend",
      cloneFooter.outerHTML
    );
    card.querySelector(".la-card__row-container").insertAdjacentHTML(
      "beforeend",
      cloneOptions.outerHTML
    );
    // card.querySelector(".la-card__slider").style.height =
    //   card.querySelector(".la-card__row-container").offsetHeight + "px";
  });
}
let htmlListAd = document.querySelector(".list-ofr__card-list") !== null ? document.querySelector(".list-ofr__card-list").innerHTML : "";

function changeGrid(button) {
  const filterGrid = button.dataset.gridFilter

  if (window.innerWidth >= 768) {
    document.querySelectorAll(".ofr-filter__grid-list button").forEach((i) => i.classList.remove("_active"));
    button.classList.add("_active");

    if (filterGrid === 'box') {
      localStorage.setItem('grid-filter', 'box')
      document.querySelector(".list-ofr__card-list").innerHTML = htmlListAd;

      new Swiper(".la-card__all-swiper-big .la-card__slider", {
        spaceBetween: 4,
        slidesPerView: 1.25,
        observer: true,
        observeParents: true,
        breakpoints: {
          768: {
            slidesPerView: "auto",
          },
        },
        on: {
          init: function () {
            setTimeout(() => updateFraction(this), 0);
          },
        },
        pagination: {
          el: ".la-card__all-swiper-big .ma-card__pagination",
          clickable: true,
        },
      });
      new Swiper(".la-card__all-swiper .la-card__slider", {
        spaceBetween: 4,
        slidesPerView: "auto",
        observer: true,
        observeParents: true,
        on: {
          init: function () {
            setTimeout(() => updateFraction(this), 0);
          },
        },

        pagination: {
          el: ".la-card__all-swiper .ma-card__pagination",
          clickable: true,
        },
      });

      document.querySelector(".list-ofr__card-list").classList.remove("list-ofr__card-row");
      document.querySelectorAll(".la-card[data-views-section]").forEach((card) => {
        card.setAttribute("data-views-section", "box");
      });
    }
    if (filterGrid === 'row') {
      localStorage.setItem('grid-filter', 'row')
      if (!document.querySelector(".list-ofr__card-list").classList.contains("list-ofr__card-row")) {
        document.querySelectorAll(".la-card[data-views-section]").forEach((card) => {
          card.setAttribute("data-views-section", "row");
        });
        rowContainer();
      }
    }
  } else {
    document.querySelectorAll(".ofr-filter__grid-list button").forEach((button) => button.classList.remove("_active"));
    button.classList.add("_active");

    if (filterGrid === 'box') {
      localStorage.setItem('grid-filter', 'box')
      document.querySelector(".list-ofr__card-list").classList.remove("list-ofr__card-row");
      document.querySelectorAll(".la-card[data-views-section]").forEach((card) => {
        card.setAttribute("data-views-section", "box");
      });
    }
    if (filterGrid === 'row') {
      localStorage.setItem('grid-filter', 'row')
      document.querySelector(".list-ofr__card-list").classList.add("list-ofr__card-row");
      document.querySelectorAll(".la-card[data-views-section]").forEach((card) => {
        card.setAttribute("data-views-section", "row");
      });
    }
  }

  find(".ma-tab__preload").classList.remove("_show");
  findAll(".la-card").forEach((card) => card.classList.remove("_hide-card"));
  openModalWhenClickingOnBtn();
}

const filterGridFromLocalStorage = localStorage.getItem('grid-filter')
let filterGrid

if (document.querySelector('.ofr-filter')) {
  if (filterGridFromLocalStorage) {
    filterGrid = filterGridFromLocalStorage
  } else {
    filterGrid = 'row'
  }

  document.querySelectorAll(`.ofr-filter__grid-list button[data-grid-filter=${filterGrid}]`).forEach(button => {
    changeGrid(button);
  })

  document.querySelectorAll(".ofr-filter__grid-list button").forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      changeGrid(button);
    });
  });
}

if (find(".list-ofr__filter-mob-list")) {
  find(".list-ofr__filter-mob-list")
    .querySelector(".ofr-filter__grid-btn-row")
    .classList.add("_active");
}

const sliderLACard = new Swiper(".la-card__all-swiper .la-card__slider", {
  spaceBetween: 4,
  slidesPerView: "auto",
  observer: true,
  observeParents: true,

  on: {
    init: function () {
      setTimeout(() => updateFraction(this), 0);
    },
  },

  pagination: {
    el: ".la-card__all-swiper .ma-card__pagination",
    clickable: true,
  },
});

const sliderLACard_1 = new Swiper(".la-card__all-swiper-big .la-card__slider", {
  spaceBetween: 4,
  slidesPerView: 1.25,
  observer: true,
  observeParents: true,
  breakpoints: {
    768: {
      slidesPerView: "auto",
    },
  },
  on: {
    init: function () {
      setTimeout(() => updateFraction(this), 0);
    },
  },
  pagination: {
    el: ".la-card__all-swiper-big .ma-card__pagination",
    clickable: true,
  },
});

setTimeout((e) => {
  const sliderInsideRecentCard = new Swiper(".recent-card__slider", {
    spaceBetween: 4,
    slidesPerView: "auto",

    breakpoints: {
      1440: {},
      768: {},
      500: {
        slidesPerView: "auto",
        spaceBetween: 4,
      },
      0: {
        slidesPerView: 1,
        spaceBetween: 0,
        allowTouchMove: false,
      },
    },

    navigation: {
      nextEl: ".recent-card__slider-arrow_next",
      prevEl: ".recent-card__slider-arrow_prev",
    },
  });
}, 500);

const sliderNews = new Swiper(".s-news__slider", {
  spaceBetween: 24,

  breakpoints: {
    1025: {
      slidesPerView: 4,
    },
    768: {
      slidesPerView: 3,
      allowTouchMove: false,
    },
    500: {
      slidesPerView: 2,
      allowTouchMove: true,
    },
    0: {
      slidesPerView: 1.3,
    },
  },

  navigation: {
    nextEl: ".s-news__arrow-next",
    prevEl: ".s-news__arrow-prev",
  },
});
sliderNews.on('slideChange', function() {
  const MOVED_CLASS = 's-news__slider--moved';
  if (!this.el.classList.contains(MOVED_CLASS)) {
    this.el.classList.add(MOVED_CLASS)
  }
})

const sliderShops = new Swiper(".s-shops__slider", {
  spaceBetween: 24,

  breakpoints: {
    1025: {
      slidesPerView: 4,
    },
    768: {
      slidesPerView: 3,
      allowTouchMove: false,
    },
    425: {
      slidesPerView: 2,
      allowTouchMove: true,
    },
    0: {
      slidesPerView: 1,
      spaceBetween: 12,
    },
  },

  navigation: {
    nextEl: ".s-shops__arrow-next",
    prevEl: ".s-shops__arrow-prev",
  },
});
sliderShops.on('slideChange', function() {
  const MOVED_CLASS = 's-shops__slider--moved';
  if (!this.el.classList.contains(MOVED_CLASS)) {
    this.el.classList.add(MOVED_CLASS)
  }
})

// Функции для модальных окон
// Открытие модальных окон при клике по кнопке
openModalWhenClickingOnBtn();

function openModalWhenClickingOnBtn() {
  const btnsOpenModal = document.querySelectorAll("[data-modal-open]");

  for (let i = 0; i < btnsOpenModal.length; i++) {
    const btn = btnsOpenModal[i];

    btn.addEventListener("click", (e) => {
      const dataBtn = btn.dataset.modalOpen;
      const modal = document.querySelector(`#${dataBtn}`);

      openModal(modal);
      window.location.hash = dataBtn;
    });
  }
}

// Открытие модального окна, если в url указан его id
openModalHash();

function openModalHash() {
  if (window.location.hash) {
    const hash = window.location.hash.substring(1);
    const modal = document.querySelector(`.modal#${hash}`);

    if (modal) openModal(modal);
  }
}

// Показываем/убираем модальное окно при изменения хеша в адресной строке
checkHash();

function checkHash() {
  window.addEventListener("hashchange", (e) => {
    const hash = window.location.hash;
    const modal = document.querySelector(`.modal${hash}`);

    if (find(".modal._show")) find(".modal._show").classList.remove("_show");
    if (modal && hash != "") openModal(modal);
  });
}

// Закрытие модального окна при клике по заднему фону
closeModalWhenClickingOnBg();

function closeModalWhenClickingOnBg() {
  document.addEventListener("click", (e) => {
    const target = e.target;
    const modal = document.querySelector(".modal._show");

    if (
      modal &&
      !modal.classList.contains("modal-auth") &&
      target.classList.contains("modal__wrap")
    )
      closeModal();
  });
}

// Закрытие модальных окон при клике по крестику
closeModalWhenClickingOnCross();

function closeModalWhenClickingOnCross() {
  const modalElems = document.querySelectorAll(".modal");

  for (let i = 0; i < modalElems.length; i++) {
    const modal = modalElems[i];
    const closerArr = modal.querySelectorAll('.modal__close, [data-modal-close]')

    for (const closer of closerArr) {
      closer.addEventListener("click", () => {
        closeModal(modal);
      });
    }
  }
}

// Закрытие модальных окон при нажатии по клавише ESC
closeModalWhenClickingOnESC();

function closeModalWhenClickingOnESC() {
  const modalElems = document.querySelectorAll(".modal");
  for (let i = 0; i < modalElems.length; i++) {
    const modal = modalElems[i];

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeModal(modal);
    });
  }
}

// Сброс id модального окна в url
function resetHash() {
  const windowTop = window.pageYOffset;
  window.location.hash = "";
  window.scrollTo(0, windowTop);
}

// Открытие модального окна
function openModal(modal) {
  if (find(".modal._show")) {
    find(".modal._show").classList.remove("_show");
  }

  modal.classList.add("_show");
  bodyLock(true);
}

// Закрытие модального окна
function closeModal(modal) {
  if (modal == undefined) {
    modal = find(".modal._show");

    if (!modal) return;
  }
  modal.classList.remove("_show");
  bodyLock(false);
  resetHash();
}

// Лайк поста
liked();
function liked() {
  document.addEventListener('click', e => {
    const target = e.target

    if (target.hasAttribute('data-like') || target.closest('[data-like]')) {
      const btn = target.hasAttribute('data-like') ? target : target.closest('[data-like]')

      btn.classList.toggle('_liked')
    }
  })
}

// Смена языка
// Если при клике осуществляется переход на страницу с другим языком, то эту функцию нужно удалить.
function changeLang(e) {
  const target = e.target;
  const langTitleElems = findAll(".change-lang__title");

  for (let i = 0; i < langTitleElems.length; i++) {
    const langTitle = langTitleElems[i];

    langTitle.innerText = target.innerText;
  }
  find(".modal-lang__link._active").classList.remove("_active");
  target.classList.add("_active");
  closeModal();
}

// функционал чекбоксов
selectAllModalCountry();

function selectAllModalCountry() {
  const mRegions = find(".modal-regions__countries");
  if (!mRegions) return
  const selectAll = mRegions.querySelector(
    ".regions-checkbox_select-all input"
  );
  const checkboxElems = mRegions.querySelectorAll(
    ".regions-checkbox input:not(.regions-checkbox_select-all input)"
  );
  const checkboxRegionsElems = findAll(
    ".modal-regions__regions .regions-checkbox input"
  );

  selectAll.addEventListener("change", (e) => {
    for (let i = 0; i < checkboxRegionsElems.length; i++) {
      const checkbox = checkboxRegionsElems[i];

      checkbox.checked = false;
    }

    if (selectAll.checked) {
      for (let i = 0; i < checkboxElems.length; i++) {
        const checkbox = checkboxElems[i];
        checkbox.checked = true;
      }
    } else {
      for (let i = 0; i < checkboxElems.length; i++) {
        const checkbox = checkboxElems[i];
        checkbox.checked = false;
      }
    }

    selectedCountry();
  });

  for (let i = 0; i < checkboxElems.length; i++) {
    const checkbox = checkboxElems[i];

    checkbox.addEventListener("click", (e) => {
      let cond = true;

      if (selectAll.checked) {
        selectAll.checked = false;
      }

      for (let i = 0; i < checkboxElems.length; i++) {
        const checkbox = checkboxElems[i];

        if (!checkbox.checked) {
          cond = false;
        }
      }

      if (cond === true) {
        selectAll.checked = true;
      }

      selectedCountry();
    });
  }
}

// Выбранные чекбоксы
function selectedCountry() {
  let selectedC = findAll(
    ".modal-regions__countries .regions-checkbox input:checked:not(.modal-regions__countries .regions-checkbox_select-all input:checked)"
  );
  const oneCountry = find(".modal-regions__one-country");
  const chipsBlock = find(".modal-regions__chips");
  const chipsList = find(".modal-regions__chips-list");
  const showAll = find(".modal-regions__show-all");
  const checkboxRegionsElems = findAll(
    ".modal-regions__regions .regions-checkbox input"
  );
  const moreTitle = find(".modal-regions__more-title");
  const btnReset = find(".modal-regions__reset");
  const selectAll = find(".regions-checkbox_select-all input");

  if (selectedC.length === 1) {
    oneCountry.classList.add("_show");
    oneCountry.querySelector(".modal-regions__one-country-text").innerText =
      selectedC[0].value;
  } else {
    oneCountry.classList.remove("_show");
  }

  if (selectedC.length >= 1) {
    btnReset.classList.add("_show");
    moreTitle.classList.add("_show");
    moreTitle.innerText = "Другие страны";
  } else {
    btnReset.classList.remove("_show");
    moreTitle.classList.remove("_show");
    moreTitle.innerText = "";
  }

  if (selectedC.length > 1) {
    chipsBlock.classList.add("_show");
    chipsList.innerHTML = "";

    for (let i = 0; i < selectedC.length; i++) {
      const checkbox = selectedC[i];

      if (
        (i < 5 && showAll.classList.contains("_text-show")) ||
        showAll.classList.contains("_text-hide")
      ) {
        const chips = document.createElement("button");

        chips.classList.add("regions-chips");
        chips.innerHTML = `<span class="regions-chips__title">${checkbox.value}</span>`;

        chipsList.append(chips);
      }
    }

    // Сохраняем страны в localStorage
    // localStorage.setItem('country', JSON.stringify(arrC))

    if (selectedC.length > 5) {
      showAll.querySelector(
        ".modal-regions__show-all-quantity span"
      ).innerText = selectedC.length - 5;
      showAll.classList.add("_show");
    } else {
      showAll.classList.remove("_show");
    }

    const chipsElems = chipsList.querySelectorAll(".regions-chips");

    for (let i = 0; i < chipsElems.length; i++) {
      const chips = chipsElems[i];

      chips.addEventListener("click", (e) => {
        chips.remove();
        selectedC[i].checked = false;
        selectAll.checked = false;

        if (chipsList.querySelectorAll(".regions-chips").length === 0) {
          chipsBlock.classList.remove("_show");
        }

        selectedCountry();
      });
    }
  } else {
    chipsBlock.classList.remove("_show");
    chipsList.innerHTML = "";
  }
}

// Показать все карточки городов
showAllCities();

function showAllCities() {
  const showAll = find(".modal-regions__show-all");
  if (!showAll) return

  showAll.addEventListener("click", (e) => {
    if (showAll.classList.contains("_text-show")) {
      showAll.classList.add("_text-hide");
      showAll.classList.remove("_text-show");
    } else {
      showAll.classList.add("_text-show");
      showAll.classList.remove("_text-hide");
    }

    if (find(".modal-regions__acc-body .regions-checkbox input:checked")) {
      selectedRegions();
    } else {
      selectedCountry();
    }
  });
}

// Выбрать регионы страны
activeRegion();

function activeRegion() {
  const btn = find(".modal-regions__one-country");
  if (!btn) return
  const title = find(".modal-regions__title");
  const blockCountries = find(".modal-regions__countries");
  const blockRegions = find(".modal-regions__regions");
  const moreTitle = find(".modal-regions__more-title");

  btn.addEventListener("click", (e) => {
    btn.classList.toggle("_active");

    if (btn.classList.contains("_active")) {
      blockCountries.classList.remove("_show");
      blockRegions.classList.add("_show");
      title.innerText = "Регион поиска";
      moreTitle.innerText = "Все регионы";
    } else {
      blockCountries.classList.add("_show");
      blockRegions.classList.remove("_show");
      title.innerText = "Страна поиска";
      moreTitle.innerText = "Другие страны";
    }
  });
}

// Чекбоксы регионов
checkboxesRegions();

function checkboxesRegions() {
  const accElems = findAll(".modal-regions__acc");

  for (let i = 0; i < accElems.length; i++) {
    const acc = accElems[i];
    const selectAll = acc.querySelector(".regions-checkbox input");
    const checkboxElems = acc.querySelectorAll(
      ".modal-regions__acc-body .regions-checkbox input"
    );

    selectAll.addEventListener("click", (e) => {
      if (selectAll.checked === true) {
        for (let i = 0; i < checkboxElems.length; i++) {
          checkboxElems[i].checked = true;
        }
      } else {
        for (let i = 0; i < checkboxElems.length; i++) {
          checkboxElems[i].checked = false;
        }
      }

      selectedRegions();
    });

    for (let i = 0; i < checkboxElems.length; i++) {
      const checkbox = checkboxElems[i];

      checkbox.addEventListener("click", (e) => {
        for (let i = 0; i < checkboxElems.length; i++) {
          const checkbox = checkboxElems[i];
          let cond = true;

          if (checkbox.checked === false) cond = false;

          if (cond === false) selectAll.checked = false;
        }

        selectedRegions();
      });
    }
  }
}

// Выбранные регионы
function selectedRegions() {
  const selectedC = findAll(
    ".modal-regions__acc-body .regions-checkbox input:checked"
  );
  const chipsBlock = find(".modal-regions__chips");
  const chipsList = find(".modal-regions__chips-list");
  const showAll = find(".modal-regions__show-all");

  if (selectedC.length > 0) {
    chipsBlock.classList.add("_show");
    chipsList.innerHTML = "";

    for (let i = 0; i < selectedC.length; i++) {
      const checkbox = selectedC[i];

      if (
        (i < 5 && showAll.classList.contains("_text-show")) ||
        showAll.classList.contains("_text-hide")
      ) {
        const chips = document.createElement("button");

        chips.classList.add("regions-chips");
        chips.innerHTML = `<span class="regions-chips__title">${checkbox.value}</span>`;

        chipsList.append(chips);
      }
    }

    // Сохраняем города в localStorage
    // localStorage.setItem('regions', JSON.stringify(arrC))
  } else {
    chipsBlock.classList.remove("_show");
    chipsList.innerHTML = "";
  }

  if (selectedC.length > 5) {
    showAll.querySelector(".modal-regions__show-all-quantity span").innerText =
      selectedC.length - 5;
    showAll.classList.add("_show");
  } else {
    showAll.classList.remove("_show");
  }

  const chipsElems = chipsList.querySelectorAll(".regions-chips");

  for (let i = 0; i < chipsElems.length; i++) {
    const chips = chipsElems[i];

    chips.addEventListener("click", (e) => {
      chips.remove();
      selectedC[i].checked = false;
      selectedC[i]
        .closest(".modal-regions__acc")
        .querySelector("input").checked = false;

      if (chipsList.querySelectorAll(".regions-chips").length === 0) {
        chipsBlock.classList.remove("_show");
      }

      selectedRegions();
    });
  }
}

// Сбросить настройки
resetSettingsPlaces();

function resetSettingsPlaces() {
  const modal = find("#regions");
  const btnElems = findAll(".location__reset");
  const title = find(".modal-regions__title");
  const blockC = find(".modal-regions__countries");
  const blockR = find(".modal-regions__regions");
  const oneCountry = find(".modal-regions__one-country");

  for (let i = 0; i < btnElems.length; i++) {
    const btn = btnElems[i];

    btn.addEventListener("click", (e) => {
      const checkboxElems = modal.querySelectorAll(".regions-checkbox input");

      for (let i = 0; i < checkboxElems.length; i++) {
        const checkbox = checkboxElems[i];

        checkbox.checked = false;
      }

      blockC.classList.add("_show");
      blockR.classList.remove("_show");
      oneCountry.classList.remove("_active");

      title.innerText = "Страна поиска";

      selectedCountry();
      selectedRegions();

      const countryElems = findAll(
        '.regions-checkbox__input[data-space="country"]:checked'
      );
      const regionElems = findAll(
        '.regions-checkbox__input[data-space="region"]:checked'
      );

      localStorage.setItem(
        "country",
        JSON.stringify(
          [...countryElems].map((e) => {
            return e.value;
          })
        )
      );
      localStorage.setItem(
        "regions",
        JSON.stringify(
          [...regionElems].map((e) => {
            return e.value;
          })
        )
      );

      settingsPopupPlaces();
    });
  }
}

// Применить настройки городов и регионов
applySettingsPlaces();

function applySettingsPlaces() {
  const btn = find(".modal-regions__apply");
  if (!btn) return

  btn.addEventListener("click", (e) => {
    const countryElems = findAll(
      '.regions-checkbox__input[data-space="country"]:checked'
    );
    const regionElems = findAll(
      '.regions-checkbox__input[data-space="region"]:checked'
    );

    localStorage.setItem(
      "country",
      JSON.stringify(
        [...countryElems].map((e) => {
          return e.value;
        })
      )
    );
    localStorage.setItem(
      "regions",
      JSON.stringify(
        [...regionElems].map((e) => {
          return e.value;
        })
      )
    );
    settingsPopupPlaces();

    closeModal();
  });
}

// Настройка всплывашки
settingsPopupPlaces();

function settingsPopupPlaces() {
  const countries = find(".location__select_countries");
  const countriesList = find(
    ".location__select_countries .location__countries"
  );
  const regions = find(".location__select_regions");
  const regionsList = find(".location__select_regions .location__countries");
  const empty = find(".location__select_empty");
  const radius = find(".location__radius");
  const radiusInput = radius.querySelector('input[type="range"]');
  const footer = find(".location__body-footer");

  const places = find(".location__places");
  const distance = find(".location__distance");
  const quantity = find(".location__quantity");

  const countryArr = localStorage.getItem("country")
    ? JSON.parse(localStorage.getItem("country"))
    : [];
  const regionsArr = localStorage.getItem("regions")
    ? JSON.parse(localStorage.getItem("regions"))
    : [];

  // Выбрано 0 стран и 0 регионов
  if (regionsArr.length === 0 && countryArr.length === 0) {
    removeAllBlocksToPopup();
    empty.classList.add("_show");
    changeBtnPlace();
  }

  // Выбрано несколько стран
  if (countryArr.length > 1) {
    showCountries();
    changeBtnPlace();
  }

  // Выбрана 1 страна и/или несколько городов
  if (countryArr.length === 1) {
    showCountries();
    showRegions();
    changeBtnPlace();
  }

  function showCountries() {
    removeAllBlocksToPopup();
    countries.classList.add("_show");
    footer.classList.add("_show");

    countriesList.innerHTML = "";
    for (let i = 0; i < countryArr.length; i++) {
      const country = countryArr[i];

      if (i < 5) {
        const elem = document.createElement("span");
        elem.innerText = country;

        countriesList.append(elem);
      }
    }

    if (countryArr.length > 5) {
      const elem = document.createElement("span");
      elem.innerText = `+${countryArr.length - 5}`;

      countriesList.append(elem);
    }
  }

  function showRegions() {
    if (regionsArr.length === 1) {
      const elem = document.createElement("span");

      regions.classList.add("_show");
      radius.classList.add("_show");

      regionsList.innerHTML = "";
      elem.innerText = regionsArr[0];
      regionsList.append(elem);
    }

    if (regionsArr.length > 0) {
      regions.classList.add("_show");

      regionsList.innerHTML = "";
      for (let i = 0; i < regionsArr.length; i++) {
        const region = regionsArr[i];

        if (i < 5) {
          const elem = document.createElement("span");
          elem.innerText = region;

          regionsList.append(elem);
        }
      }

      if (regionsArr.length > 5) {
        const elem = document.createElement("span");
        elem.innerText = `+${regionsArr.length - 5}`;
        regionsList.append(elem);
      }
    }
  }

  function changeBtnPlace() {
    if (regionsArr.length === 0 && countryArr.length === 0) {
      quantity.classList.remove("_show");
    }

    // Если выбран 1 регион
    if (regionsArr.length === 1) {
      places.innerText = regionsArr[0];
      distance.classList.add("_show");
      quantity.classList.remove("_show");
      distance.querySelector("span").innerText = radiusInput.value;
    }

    // Если выбрана 1 страна
    if (countryArr.length === 1 && regionsArr.length === 0) {
      places.innerText = countryArr[0];
      distance.classList.remove("_show");
      quantity.classList.remove("_show");
    }

    // Если выбрано больше 2 регионов
    if (regionsArr.length >= 2) {
      if (regionsArr.length > 2) {
        quantity.classList.add("_show");
        quantity.querySelector("span").innerText = regionsArr.length - 2;
      } else {
        quantity.classList.remove("_show");
      }
      distance.classList.remove("_show");

      places.innerHTML = "";
      for (let i = 0; i < regionsArr.length; i++) {
        if (i < 2) {
          const elem = document.createElement("span");
          elem.innerText = regionsArr[i];

          places.append(elem);
        }
      }
    }

    // Если выбрано больше 2 стран
    if (countryArr.length >= 2) {
      if (countryArr.length > 2) {
        quantity.classList.add("_show");
        quantity.querySelector("span").innerText = countryArr.length - 2;
      } else {
        quantity.classList.remove("_show");
      }
      distance.classList.remove("_show");

      places.innerHTML = "";
      for (let i = 0; i < countryArr.length; i++) {
        if (i < 2) {
          const elem = document.createElement("span");
          elem.innerText = countryArr[i];

          places.append(elem);
        }
      }
    }
  }

  function removeAllBlocksToPopup() {
    const arrBlocks = [countries, regions, empty, radius, footer];

    for (let i = 0; i < arrBlocks.length; i++) {
      const elem = arrBlocks[i];

      elem.classList.remove("_show");
    }
  }

  function removeAllBlocksToBtn() {
    const arrBlocks = [places, distance, quantity];

    for (let i = 0; i < arrBlocks.length; i++) {
      const elem = arrBlocks[i];

      elem.classList.remove("_show");
    }
  }
}

// Показать всплывашку
showPopupPlaces();

function showPopupPlaces() {
  const location = find(".location");

  if (window.innerWidth <= 920) {
    location.addEventListener("mouseleave", (e) => {
      location.classList.remove("_show-popup");
    });

    location.addEventListener("click", (e) => {
      location.classList.toggle("_show-popup");
    });
  } else {
    location.addEventListener("mouseenter", (e) => {
      location.classList.add("_show-popup");
    });

    location.addEventListener("mouseleave", (e) => {
      location.classList.remove("_show-popup");
    });
  }
}

// Сохранить данные в всплывашке
savePopupPlaces();

function savePopupPlaces() {
  const save = find(".location__body-footer-btn-save");
  const location = find(".location");
  const range = find(".location__radius-range input");
  const distanceBtn = find(".location__distance span");
  const menuMob = find("#mob-menu");

  if (localStorage.getItem("distance")) {
    distanceBtn.innerText = localStorage.getItem("distance");
    range.setAttribute("value", localStorage.getItem("distance"));
  }

  save.addEventListener("click", (e) => {
    location.classList.remove("_show-popup");
    distanceBtn.innerText = range.value;
    localStorage.setItem("distance", range.value);

    if (menuMob.classList.contains("_show")) {
      closeModal();
    }
  });
}

// Выделение чекбоксов, значение value которых совпадает с элементом массива в localStorage
loadCheckedFromLocalStorage();

function loadCheckedFromLocalStorage() {
  const countryArr = localStorage.getItem("country")
    ? JSON.parse(localStorage.getItem("country"))
    : [];
  const regionsArr = localStorage.getItem("regions")
    ? JSON.parse(localStorage.getItem("regions"))
    : [];

  for (let i = 0; i < countryArr.length; i++) {
    const nameC = countryArr[i];
    const checkbox = find(`[data-space="country"][value="${nameC}"]`);

    checkbox.checked = true;
  }

  for (let i = 0; i < regionsArr.length; i++) {
    const nameR = regionsArr[i];
    const checkbox = find(`[data-space="region"][value="${nameR}"]`);

    checkbox.checked = true;
  }

  selectedCountry();
  selectedRegions();
}

// Открытие нужного блока при клике "Странам" и "Регионам" в всплывашке
openDefiniteBlock();

function openDefiniteBlock() {
  const btnC = find(".location__select_countries");
  const btnR = find(".location__select_regions");

  const oneCountry = find(".modal-regions__one-country");
  const title = find(".modal-regions__title");
  const blockC = find(".modal-regions__countries");
  const blockR = find(".modal-regions__regions");
  const moreTitle = find(".modal-regions__more-title");

  btnC.addEventListener("click", (e) => {
    oneCountry.classList.remove("_active");
    blockC.classList.add("_show");
    blockR.classList.remove("_show");
    title.innerText = "Страна поиска";
    moreTitle.innerText = "Другие страны";
  });

  btnR.addEventListener("click", (e) => {
    oneCountry.classList.add("_active");
    blockC.classList.remove("_show");
    blockR.classList.add("_show");
    title.innerText = "Регион поиска";
    moreTitle.innerText = "Все регионы";
  });
}

// Выбор региона
selectRegion();

function selectRegion() {
  const btn = find(".modal-regions__one-country");
  const parent = btn.parentElement;

  btn.addEventListener("click", (e) => {
    parent.classList.toggle("_regions");
  });
}

// Аккордеоны
accordions();

function accordions() {
  const hiddenSiblingAcc = false; // Скрывать соседние аккордеоны. false если не нужно.
  const accOpenElems = document.querySelectorAll(".acc-open");

  for (let i = 0; i < accOpenElems.length; i++) {
    const accOpen = accOpenElems[i];

    accOpen.addEventListener("click", (e) => {
      const container = !accOpen.closest(".acc-body")
        ? accOpen.parentElement.parentElement
        : accOpen.closest(".acc-body");
      const parent = accOpen.closest(".acc");
      const accBody = accOpen.closest(".acc-header").nextElementSibling;

      parent.classList.toggle("_show");
      accOpen.classList.toggle("_show");

      if (accBody.style.maxHeight) {
        accBody.style.maxHeight = null;
        parent.classList.remove("_show");
        accOpen.classList.remove("_show");
      } else {
        const adjacentElems = getSiblings(parent);

        if (hiddenSiblingAcc) {
          for (let i = 0; i < adjacentElems.length; i++) {
            const elem = adjacentElems[i];
            const elemHeader = elem.querySelector(".acc-open");
            const elemBody = elem.querySelector(".acc-body");

            elem.classList.remove("_show");
            elemHeader.classList.remove("_show");
            elemBody.style.maxHeight = null;
          }
        }

        accBody.style.maxHeight = accBody.scrollHeight + "px";
        container.style.maxHeight =
          parseInt(container.scrollHeight) + accBody.scrollHeight + "px";
      }
    });
  }
}

// Слайдер диапазона
rangeChangeCities();

function rangeChangeCities() {
  const range = find(".location__radius-range input");
  const distance = find(".location__radius-value span");

  rangesliderJs.create(range, {
    onSlide: (e) => {
      distance.innerText = e;
    },
  });

  distance.innerText = range.value;
}

// Отступ у footer__top на планшете и ниже
paddingFooterTopMobile();

function paddingFooterTopMobile() {
  if (window.innerWidth <= 920) {
    const footerTop = find(".footer__top");
    const footerApp = find(".footer-app:not(.footer-app.mob-menu__footer)");
    window.addEventListener("load", (e) => {
      footerTop.style.paddingTop = footerApp.clientHeight + 20 + "px";
    });
  }
}

// Поиск в мобильном меню
searchMobMenu();

function searchMobMenu() {
  const mobMenu = find("#mob-menu");
  const mobMenuHeader = mobMenu.querySelector(".mob-menu__header");
  const mobMenuBody = mobMenu.querySelector(".mob-menu__body");
  const search = mobMenu.querySelector(".mob-search");
  const searchArea = mobMenu.querySelector(".search-area_mob-menu");
  const cancelSearch = mobMenu.querySelector(".mob-menu__cancel-search");

  searchArea.addEventListener("submit", (e) => {
    e.preventDefault();
    search.classList.add("_show");
    mobMenuHeader.classList.add("_search");
    mobMenuBody.style.maxHeight = 0;
  });

  cancelSearch.addEventListener("click", (e) => {
    search.classList.remove("_show");
    mobMenuHeader.classList.remove("_search");
    mobMenuBody.style.maxHeight = mobMenuBody.scrollHeight + "px";
  });
}

// Маска телефона
window.addEventListener("DOMContentLoaded", function () {
  [].forEach.call(
    document.querySelectorAll(".mask-phone input"),
    function (input) {
      input.addEventListener("focus", (e) => {
        if (input.value === "") {
          input.value = "+";
        }
      });

      input.addEventListener("blur", (e) => {
        if (input.value === "+") {
          input.value = "";
        }
      });
    }
  );
});

// Показать больше пунктов списка
showMoreList();

function showMoreList() {
  const listElems = findAll("[data-list]");

  for (let i = 0; i < listElems.length; i++) {
    const list = listElems[i];
    const more = list.nextElementSibling;
    const itemElems = list.querySelectorAll(".na-brand__item");

    more.addEventListener("click", (e) => {
      if (!more.classList.contains("_show")) {
        const moreTitle = more.querySelector(".na-more__title");
        let newMoreTitle;

        for (let i = 0; i < itemElems.length; i++) {
          const item = itemElems[i];
          item.style.display = "block";
        }

        switch (moreTitle.innerHTML) {
          case "Все марки":
            newMoreTitle = "Популярные марки";
          case "Все модели":
            newMoreTitle = "Популярные модели";
        }

        moreTitle.innerHTML = newMoreTitle;
        more.classList.add("_show");
      }
    });
  }
}

// Наполнение сайдбара пунктами с названиями блоков для заполнения
if (document.getElementById("na-sidebar")) naSidebar();

function naSidebar() {
  const sidebar = document.getElementById("na-sidebar");
  const list = sidebar.querySelector(".na-sidebar__list");
  const blockElems = findAll("[data-type][data-title]");

  for (let i = 0; i < blockElems.length; i++) {
    const block = blockElems[i];
    const title = block.dataset.title;
    const type = block.dataset.type;

    list.innerHTML =
      list.innerHTML +
      `<li class="na-sidebar__item na-sidebar__item-${type}">${title}</li>`;
  }
}

// Активация пунктов сайдбара, если блоки не пустые
activeItemSidebar();

function activeItemSidebar() { }

// Создание текстового поля у селекта для дальнейшего его прослушивания
selectCreateInput();

function selectCreateInput() {
  const selectElems = findAll(".select:not(.select-search)");

  for (let i = 0; i < selectElems.length; i++) {
    const select = selectElems[i];
    const input = document.createElement("input");
    input.type = "text";

    select.prepend(input);
  }
}

// Выбор города
selectCity();

function selectCity() {
  const selectElems = findAll(".select-city");

  for (let i = 0; i < selectElems.length; i++) {
    const select = selectElems[i];
    const input = select.querySelector(".textfield input");
    const clear = select.querySelector(".textfield__clear");

    input.addEventListener("input", (e) => {
      if (input.value != "") {
        select.classList.add("_open");

        // Отправляем запрос в БД, получаем и выводим список городов, в которых есть строка, введенная в текстовое поле
      } else {
        select.classList.remove("_open");
      }
    });

    clear.addEventListener("click", (e) => {
      select.classList.remove("_open");
    });

    // Выбор города
    const itemElems = select.querySelectorAll(".select-city-dropdown__item");

    for (let i = 0; i < itemElems.length; i++) {
      const item = itemElems[i];

      item.addEventListener("click", (e) => {
        const city = item.querySelector(".select-city-dropdown__city");

        input.value = city.innerText;
        select.classList.add("_valid");
      });
    }
  }

  // Отчистить список городов
  function clearList(select) {
    const list = select.querySelector(".select-city-dropdown__list");
    list.innerHTML = "";
  }
}

// Списки выбора
select();

function select() {
  // Проверяем есть ли выбранные элементы при загрузке страницы. Если есть, то селект заполняется
  const selectedItemElems = document.querySelectorAll(
    ".select-dropdown__item._selected"
  );

  for (let i = 0; i < selectedItemElems.length; i++) {
    const selectedItem = selectedItemElems[i];
    const select = selectedItem.closest(".select");
    const sTitle = select.querySelector(".select-input__title");
    const sInput = select.querySelector("input");

    sTitle.innerText = selectedItem.innerHTML.trim();
    sInput.value = selectedItem.innerText;
    sInput.classList.add("_full");
    select.classList.add("_valid");
  }

  // Если пользователь кликнул по селекту, то он открывается/закрывается. Также он закроется если кликнуть вне его области
  window.addEventListener("click", (e) => {
    const target = e.target;

    // Если пользователь кликнул вне зоны селекта
    if (
      !target.classList.contains("select") &&
      !target.closest(".select._open")
    ) {
      if (find(".select._open")) {
        find(".select._open").classList.remove("_open");
      }

      // для селекта с выбором городов
      if (find(".select-city._open")) {
        find(".select-city._open").classList.remove("_open");
      }
    }

    // Если пользователь кликнул по шапке селекта
    if (target.classList.contains("select-input")) {
      if (!target.parentElement.classList.contains("select-search")) {
        target.parentElement.classList.toggle("_open");
      }
    }

    // Если пользователь выбрал пункт из списка селекта
    if (target.classList.contains("select-dropdown__item")) {
      const select = target.closest(".select");
      const sTitle = select.querySelector(".select-input__title");
      const sInput = select.querySelector("input");
      const neighbourTargets = target.parentElement.querySelectorAll(
        ".select-dropdown__item"
      );
      const strack = target.closest(".list-ofr__form-track");

      sTitle.innerText = target.innerText;
      sInput.value = target.innerText;
      sInput.classList.add("_full");

      removeAll(neighbourTargets, "_selected");
      target.classList.add("_selected");

      select.classList.remove("_open");
      select.classList.add("_valid");

      if (document.querySelector(".placeholder_error")) {
        field_validation(e);
      }

      if (select.closest("[data-form-valid=submit-disabled]")) {
        const form = select.closest("[data-form-valid=submit-disabled]");
        const btnSubmit = form.querySelector("[type=submit]");

        if (checkValidTextfields(form)) {
          btnSubmit.disabled = false;
        } else {
          btnSubmit.disabled = true;
        }
      }
    }

    if (target.classList.contains("select-dropdown__all")) {
      target
        .closest(".select-dropdown")
        .querySelectorAll(".select-dropdown__checkbox-input")
        .forEach((i) => {
          i.checked = false;
        });
      target
        .closest(".select")
        .querySelector(".select-input__title").innerText = target.innerText;
      target
        .closest(".select")
        .querySelector(".select-input__title")
        .setAttribute("data-title", target.innerText);
      target
        .closest(".select")
        .querySelector(".select-input__title")
        .classList.add("_active_drop");
      target.closest(".select").children[0].value = target.innerText;
    }

    if (
      target.closest(".color-radio") &&
      target.closest(".select-dropdown__colors")
    ) {
      if (target.closest(".color-radio").querySelector("input").checked) {
        target
          .closest(".select")
          .querySelector(".select-input__title").innerText = "";
      }
    }

    if (
      target.classList.contains("select-dropdown__checkbox-box") ||
      target.closest(".select-dropdown__checkbox-box")
    ) {
      if (target.closest(".select-dropdown__checkbox-box")) {
        let textDrop = target
          .closest(".select-dropdown__checkbox-box")
          .querySelector(".select-dropdown__checkbox-text");
        let textTitle = target
          .closest(".select")
          .querySelector(".select-input__title");
        let textInput = target.closest(".select").children[0];
        if (
          target
            .closest(".select-dropdown__checkbox-box")
            .querySelector(".select-dropdown__checkbox-input").checked
        ) {
          if (
            textTitle.innerText === "Не выбрано" ||
            textTitle.innerText === textTitle.getAttribute("data-title")
          ) {
            textTitle.innerHTML = "";
            textTitle.insertAdjacentHTML("beforeend", textDrop.innerText);
            textInput.value = "";
            textInput.value = textDrop.innerText;
          } else {
            textTitle.insertAdjacentHTML(
              "beforeend",
              ", " + textDrop.innerText
            );
            textInput.value += ", " + textDrop.innerText;
          }

          target
            .closest(".select")
            .querySelector(".select-input__title")
            .classList.add("_active_drop");
        } else {
          let text_arr = [];
          text_arr.push(textTitle.innerText.split(","));

          let arr_stroke = text_arr.join(",");

          let str = arr_stroke;

          let text_push =
            text_arr[0].length > 1
              ? ", " + textDrop.innerText
              : textDrop.innerText;

          if (
            text_arr[0].indexOf(textDrop.innerText) === 0 &&
            text_arr[0].length > 1
          ) {
            text_push = textDrop.innerText + ", ";
          }

          let rExp = new RegExp(text_push, "g");

          textTitle.innerText = str.replace(rExp, "");
          textInput.value = str.replace(rExp, "");
          if (textTitle.innerText === "") {
            textTitle.innerText = "Не выбрано";
            textInput.value = "";
            target
              .closest(".select")
              .querySelector(".select-input__title")
              .classList.remove("_active_drop");
          }
        }
      }
    }
  });
}

function add_clear_btn(element) {
  const btn = document.createElement("div");
  btn.classList.add("textfield__clear");
  btn.innerHTML = `<svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.5 0C4.97 0 0.5 4.47 0.5 10C0.5 15.53 4.97 20 10.5 20C16.03 20 20.5 15.53 20.5 10C20.5 4.47 16.03 0 10.5 0Z" fill="#B4B4BF"/><path d="M14.0833 13.5835C13.7583 13.9085 13.2333 13.9085 12.9083 13.5835L10.4999 11.1752L8.09159 13.5835C7.76659 13.9085 7.24159 13.9085 6.91659 13.5835C6.76055 13.4278 6.67285 13.2164 6.67285 12.996C6.67285 12.7756 6.76055 12.5642 6.91659 12.4085L9.32492 10.0002L6.91659 7.59185C6.76055 7.43615 6.67285 7.22478 6.67285 7.00435C6.67285 6.78391 6.76055 6.57254 6.91659 6.41685C7.24159 6.09185 7.76659 6.09185 8.09159 6.41685L10.4999 8.82518L12.9083 6.41685C13.2333 6.09185 13.7583 6.09185 14.0833 6.41685C14.4083 6.74185 14.4083 7.26685 14.0833 7.59185L11.6749 10.0002L14.0833 12.4085C14.3999 12.7252 14.3999 13.2585 14.0833 13.5835Z" fill="white"/></svg>`;
  element.append(btn);

  btn.addEventListener("click", (e) => {
    element.querySelector(".select-input__title").innerText = "Не выбрано";
    element.querySelector(".textfield__clear").remove();
  });
}

// Плейсхолдер текстовых полей
labelTextfield();

function labelTextfield() {
  const textfieldElems = document.querySelectorAll(".textfield");

  for (let i = 0; i < textfieldElems.length; i++) {
    const textfield = textfieldElems[i];
    const input = textfield.querySelector("input, textarea");
    const label = textfield.querySelector("label");

    if (input.value != "") {
      label.classList.add("_change-label");
    }

    input.addEventListener("focus", (e) => {
      label.classList.add("_change-label");
    });

    input.addEventListener("blur", (e) => {
      if (input.value === "") {
        label.classList.remove("_change-label");
      }
    });
  }
}

// Проверка инпутов на пустоту
emptyInput();

function emptyInput() {
  const inputElems = findAll("input");

  for (let i = 0; i < inputElems.length; i++) {
    const input = inputElems[i];

    input.addEventListener("input", (e) => {
      if (input.value != "") {
        input.classList.add("_full");
      } else {
        input.classList.remove("_full");
      }
    });
  }
}

// Валидация текстовых полей
validTextfield();

function validTextfield() {
  const textfieldElems = document.querySelectorAll(".textfield");

  for (let i = 0; i < textfieldElems.length; i++) {
    const textfield = textfieldElems[i];
    const input = textfield.querySelector("input, textarea");

    input.addEventListener("change", (e) => {
      if (input.type === "email") {
        if (validateEmail(input.value)) {
          textfield.classList.add("_valid");
        } else {
          textfield.classList.remove("_valid");
        }
      }
    });
  }

  // Валидность email
  function validateEmail(email) {
    var pattern =
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return pattern.test(email);
  }
}

// В инпуте могут быть только цифры если у textfield есть класс only-digit
onlyDigit();

function onlyDigit() {
  const textfieldElems = document.querySelectorAll(".only-digit");

  for (let i = 0; i < textfieldElems.length; i++) {
    const input = textfieldElems[i].querySelector("input");

    input.addEventListener("keypress", function (e) {
      const inputValue = e.charCode;

      if (
        !(inputValue >= 48 && inputValue <= 57) &&
        inputValue != 43 &&
        inputValue != 0 &&
        inputValue != 40 &&
        inputValue != 41 &&
        inputValue != 45
      ) {
        e.preventDefault();
      }
    });
  }
}

// changeRangeInputCities()
function changeRangeInputCities() {
  const block = find(".location__radius");
  const elemValue = block.querySelector(".location__radius-value span");
  const range = block.querySelector(".location__radius-range input");

  range.addEventListener("input", (e) => {
    elemValue.innerText = range.value;
  });
}

// Валидация формы. У кнопки удаляется disabled если все поля заполнены
validFormChangeDisabledSubmit();

function validFormChangeDisabledSubmit() {
  const formElems = findAll("[data-form-valid=submit-disabled]");

  for (let i = 0; i < formElems.length; i++) {
    const form = formElems[i];
    const inputElems = form.querySelectorAll("input");
    const btnSubmit = form.querySelector("[type=submit]");

    for (let i = 0; i < inputElems.length; i++) {
      const input = inputElems[i];

      input.addEventListener("input", (e) => {
        btnSubmitDisabled(form, btnSubmit);
      });
    }
  }
}

// Установка или удаление атрибута disabled
function btnSubmitDisabled(form, btnSubmit) {
  if (checkValidTextfields(form)) {
    btnSubmit.disabled = false;
  } else {
    btnSubmit.disabled = true;
  }
}

function checkValidTextfields(form) {
  const inputElems = form.querySelectorAll("input");
  let valid = true;

  for (let i = 0; i < inputElems.length; i++) {
    const input = inputElems[i];

    if (!input.classList.contains("_full")) {
      valid = false;
    }
  }

  return valid;
}

// Изменение размера текстового поля textarea
resizeHeightTextarea();

function resizeHeightTextarea() {
  var observe;
  if (window.attachEvent) {
    observe = function (element, event, handler) {
      element.attachEvent("on" + event, handler);
    };
  } else {
    observe = function (element, event, handler) {
      element.addEventListener(event, handler, false);
    };
  }

  function init(maxH) {
    var textElems = findAll("[data-resize-height]");

    for (let i = 0; i < textElems.length; i++) {
      const text = textElems[i];
      var maxHeight = maxH;
      var oldHeight = text.scrollHeight;
      var newHeight;

      function resize() {
        text.style.height = "auto";
        newHeight = text.scrollHeight;
        if (newHeight > oldHeight && newHeight > maxHeight) {
          text.style.height = oldHeight + "px";
        } else {
          text.style.height = newHeight + "px";
          oldHeight = text.scrollHeight;
        }

        console.log(text.scrollHeight)
      }

      function delayedResize() {
        setTimeout(resize, 0);
      }
      observe(text, "change", resize);
      observe(text, "cut", delayedResize);
      observe(text, "paste", delayedResize);
      observe(text, "drop", delayedResize);
      observe(text, "keydown", delayedResize);

      resize();
    }
  }
  init(2000);
}

// Табы на странице "Мои объявления"
tabsMineAd();

function tabsMineAd() {
  const btnElems = findAll("[data-tab-btn]");

  for (let i = 0; i < btnElems.length; i++) {
    const btn = btnElems[i];

    btn.addEventListener("click", (e) => {
      if (btn.classList.contains("_active")) return;
      const data = btn.dataset.tabBtn;
      const cardElems = findAll(`[data-tab-card=${data}]`);
      const preload = find(".ma-tab__preload");

      removeAll("[data-tab-card]._show", "_show");
      preload.classList.add("_show");

      setTimeout((e) => {
        preload.classList.remove("_show");

        for (let i = 0; i < cardElems.length; i++) {
          const card = cardElems[i];

          setTimeout((e) => {
            card.classList.add("_show");
            sliderMACard.forEach((i) => {
              i.update();
            });
            add_masonry();
          }, (i + 1) * 100);
        }
      }, 1000);

      removeAll(btnElems, "_active");
      btn.classList.add("_active");
    });
  }
}

// Открытие плашки при нажатии на кнопку "Управление" на странице "Мои объявления" на разрешении меньше 768px
if (window.innerWidth <= 768) openModalSettingsOnAdaptiveMineAd();

function openModalSettingsOnAdaptiveMineAd() {
  window.addEventListener("click", (e) => {
    if (e.target.getAttribute("data-open-settings") != null) {
      if (!document.querySelector(".ma-card__settings")) {
        const btnSettings = e.target;
        const offsetPageBtn = offsetPage(btnSettings);
        const popup = document.createElement("div");

        popup.classList.add("ma-card__settings");
        popup.innerHTML = `
                    <div class="ma-card__settings-list">
                        <button class="btn btn_icon btn_icon-left btn_icon-info ma-card__setting-btn">Информация</button>
                        <button class="btn btn_icon btn_icon-left btn_icon-edit ma-card__setting-btn">Редактировать</button>
                        <button class="btn btn_icon btn_icon-left btn_icon-remove-public ma-card__setting-btn">Снять с публикации</button>
                        <button class="btn btn_icon btn_icon-left btn_icon-promote ma-card__setting-btn">Продвинуть</button>
                    </div>
                `;
        popup.style.left = offsetPageBtn.left + "px";
        popup.style.top = offsetPageBtn.top + "px";
        document.body.append(popup);
      }
    }

    if (e.target.getAttribute("data-open-filter") != null) {
      e.target.nextElementSibling.classList.toggle("_active");
    }

    if (
      e.target.classList.contains("ma-tab__button") ||
      e.target.closest(".ma-tab__button")
    ) {
      const text = e.target.closest(".ma-tab__button")
        ? e.target.innerText
        : e.target.querySelector(".ma-tab__button-title").innerText;
      e.target
        .closest(".ma-tab__header")
        .querySelector("[data-open-filter]").innerText = text;
      e.target
        .closest(".ma-tab__header")
        .querySelector(".ma-tab__filter-btn")
        .classList.add("_active_color");
      e.target.closest(".ma-tab__header-list").classList.toggle("_active");
    }
  });
}

window.addEventListener("click", function (e) {
  if (e.target.classList.contains("modal-publication__not")) {
    closeModal();
  }

  if (e.target.classList.contains("btn-filter__list")) {
    e.target
      .closest(".list-ofr")
      .querySelector(".ofr-filter")
      .classList.toggle("_active-filter");
  }

  if (
    e.target.closest(".ofr-tab") &&
    e.target.closest(".ofr-tab").getAttribute("data-tab-filter")
  ) {
    let tab = e.target.closest(".ofr-tab").getAttribute("data-tab-filter");
    document
      .querySelector(`.ofr-filter__body._active-tab`)
      .classList.remove("_active-tab");
    document
      .querySelector(`.ofr-filter__body[data-tab-content=${tab}]`)
      .classList.add("_active-tab");
    document
      .querySelectorAll(".error_input")
      .forEach((el) => el.classList.remove("error_input"));
    document
      .querySelectorAll(".placeholder_error")
      .forEach((el) => el.remove("placeholder_error"));
  }

  if (
    e.target.classList.contains("na-submit") ||
    e.target.classList.contains("ofr-filter__show-btn") ||
    e.target.classList.contains("advanced-filter__show-btn")
  ) {
    field_validation(e);
  }

  if (
    e.target.classList.contains("modal-payment-method__content-list-item") ||
    e.target.closest(".modal-payment-method__content-list-item")
  ) {
    e.target
      .closest(".modal-payment-method__content-list")
      .querySelector(".modal-payment-method__content-list-item._active-payment")
      .classList.remove("_active-payment");
    e.target
      .closest(".modal-payment-method__content-list-item")
      .classList.add("_active-payment");
  }

  if (e.target.classList.contains("modal-show-rate__content-item-btn")) {
    let attrParent = e.target
      .closest(".modal-show-rate__content-item")
      .getAttribute("data-tab-info");
    document
      .querySelector(".modal-payment-method__content-line._active-line")
      .classList.remove("_active-line");
    document
      .querySelector(
        `.modal-payment-method__content-line[data-line=${attrParent}]`
      )
      .classList.add("_active-line");
    openModal(document.querySelector("#payment-method"));
  }
});

// Запрет на ввод букв
document.body.addEventListener("input", function (e) {
  if (
    e.target.classList.contains("number-input") ||
    (e.target.tagName === "INPUT" &&
      e.target.closest(".list-ofr__form-section") &&
      !e.target.closest(".select-search"))
  ) {
    e.target.value = e.target.value.replace(/[^0-9\.\,]/g, "");
  }

  if (
    e.target.closest(".select-search") &&
    e.target.tagName === "INPUT" &&
    !e.target.closest(".select-dropdown__checkbox-input")
  ) {
    if (e.target.value.length > 0) {
      e.target.parentElement.classList.add("_open");
    } else {
      e.target.parentElement.classList.remove("_open");
    }
    if (e.target.value === "") {
      e.target
        .closest(".select")
        .querySelector(".select-input__title").innerText = "Не выбрано";
      e.target
        .closest(".select")
        .querySelector(".select-input__title")
        .classList.remove("_active_drop");
    }
  }

  if (
    e.target.tagName === "INPUT" ||
    e.target.tagName === "TEXTAREA" ||
    e.target.classList.contains("placeholder")
  ) {
    if (document.querySelector(".placeholder_error")) {
      field_validation(e);
    }
  }
});

function add_masonry(tab) {
  if (window.innerWidth <= 768) {
    if (document.querySelector(".ma-tab__body")) {
      let active_btn = document
        .querySelector(".ma-tab__button._active")
        .getAttribute("data-tab-btn");
      let numb = 0;
      document
        .querySelectorAll(`.ma-card[data-tab-card=${active_btn}]`)
        .forEach((i, index) => {
          if (index % 2 === 0) {
            numb += i.offsetHeight;
          }
        });
      let result_masonry = numb + 40;
      document.querySelector(".ma-tab__body").style.height =
        result_masonry + "px";
      document.querySelector(".ma-tab__body").classList.add("_active_masonry");
      sliderMACard.forEach((i) => {
        i.update();
      });
    }
  }
}

window.addEventListener("load", function () {
  add_masonry();
  if (document.querySelector(".ma-card")) {
    if (window.innerWidth <= 768) {
      document.querySelectorAll(".ma-card").forEach((i) => {
        i.style.width =
          document.querySelector(".swiper-slide").offsetWidth + "px";
      });
    }
  }
});

window.addEventListener("resize", function () {
  add_masonry();
});

function field_validation(e) {
  document.querySelectorAll(".placeholder").forEach((i) => {
    if (i.type === "radio") {
      let temporary_class = i
        .closest(".na-row__block-radio")
        .querySelectorAll(".placeholder");

      if (i.closest(".na-row-color__list")) {
        for (let j = 0; j < temporary_class.length; j++) {
          if (!temporary_class[j].checked) {
            if (
              !i
                .closest(".section_placeholder")
                .querySelector(".placeholder_error")
            ) {
              i.closest(".section_placeholder").insertAdjacentHTML(
                "beforeend",
                '<div class="placeholder_error">Необходимо выбрать цвет</div>'
              );
              i.closest(".na-margin")
                ? i.closest(".na-margin").classList.add("na-block-padding")
                : "";
            }
          } else {
            if (
              i
                .closest(".section_placeholder")
                .querySelector(".placeholder_error")
            ) {
              i.closest(".section_placeholder")
                .querySelector(".placeholder_error")
                .remove();
              i.closest(".na-margin")
                ? i.closest(".na-margin").classList.remove("na-block-padding")
                : "";
            }
            return false;
          }
        }
      } else {
        for (let j = 0; j < temporary_class.length; j++) {
          if (!temporary_class[j].checked) {
            if (
              !i
                .closest(".section_placeholder")
                .querySelector(".placeholder_error")
            ) {
              i.closest(".section_placeholder").insertAdjacentHTML(
                "beforeend",
                '<div class="placeholder_error">Необходимо выбрать вариант</div>'
              );
              i.closest(".na-margin")
                ? i.closest(".na-margin").classList.add("na-block-padding")
                : "";
            }
          } else {
            if (
              i
                .closest(".section_placeholder")
                .querySelector(".placeholder_error")
            ) {
              i.closest(".section_placeholder")
                .querySelector(".placeholder_error")
                .remove();
              i.closest(".na-margin")
                ? i.closest(".na-margin").classList.remove("na-block-padding")
                : "";
            }
            return false;
          }
        }
      }
    } else {
      if (!i.classList.contains("select-input")) {
        if (i.value === "") {
          i.classList.add("error_input");
          if (
            !i
              .closest(".section_placeholder")
              .querySelector(".placeholder_error")
          ) {
            i.closest(".section_placeholder").insertAdjacentHTML(
              "beforeend",
              '<div class="placeholder_error">Необходимо заполнить поле</div>'
            );
            i.closest(".na-margin")
              ? i.closest(".na-margin").classList.add("na-block-padding")
              : "";
          }
        } else {
          i.classList.remove("error_input");
          if (
            i
              .closest(".section_placeholder")
              .querySelector(".placeholder_error")
          ) {
            i.closest(".section_placeholder")
              .querySelector(".placeholder_error")
              .remove();
            i.closest(".na-margin")
              ? i.closest(".na-margin").classList.remove("na-block-padding")
              : "";
          }
        }
      }

      if (i.classList.contains("select-input")) {
        if (
          i.querySelector(".select-input__title").innerText === "Не выбрано"
        ) {
          i.classList.add("error_input");
          if (
            !i
              .closest(".section_placeholder")
              .querySelector(".placeholder_error")
          ) {
            i.closest(".section_placeholder").insertAdjacentHTML(
              "beforeend",
              '<div class="placeholder_error">Необходимо заполнить поле</div>'
            );
            i.closest(".na-margin")
              ? i.closest(".na-margin").classList.add("na-block-padding")
              : "";
          }
        } else {
          i.classList.remove("error_input");
          if (
            i
              .closest(".section_placeholder")
              .querySelector(".placeholder_error")
          ) {
            i.closest(".section_placeholder")
              .querySelector(".placeholder_error")
              .remove();
            i.closest(".na-margin")
              ? i.closest(".na-margin").classList.remove("na-block-padding")
              : "";
          }
        }
      }

      if (i.classList.contains("select-input-colors")) {
      }
    }
  });

  if (document.querySelector(".placeholder_error")) {
    e.preventDefault();
  }
}

if (document.querySelector(".mine-ad__favorites")) {
  document
    .querySelectorAll(".mine-ad__favorites .ma-card__slider")
    .forEach((i) => {
      i.style.height =
        i.closest(".ma-card__wrap").querySelector(".ma-card__content")
          .offsetHeight + "px";
    });
}

if (document.querySelector(".modal-show-rate")) {
  document
    .querySelector(".modal-show-rate")
    .addEventListener("mouseover", function (e) {
      if (
        e.target.classList.contains("modal-show-rate__content-item") ||
        e.target.closest(".modal-show-rate__content-item")
      ) {
        let tab_attr = e.target
          .closest(".modal-show-rate__content-item")
          .getAttribute("data-tab-info");
        e.target
          .closest(".modal-show-rate__content-list")
          .querySelector(".modal-show-rate__content-item._item-active")
          .classList.remove("_item-active");
        e.target
          .closest(".modal-show-rate__content-item")
          .classList.add("_item-active");
        e.target
          .closest(".modal-show-rate__content")
          .querySelector(".modal-show-rate__content-info-item._item-active")
          .classList.remove("_item-active");
        e.target
          .closest(".modal-show-rate__content")
          .querySelector(
            `.modal-show-rate__content-info-item[data-content-info=${tab_attr}]`
          )
          .classList.add("_item-active");
      }
    });
}

if (document.querySelector(".mine-ofr-view__user-favorites-line-left")) {
  let textFavorites, textFavoritesAdd, textFavoritesMake;
  if (window.innerWidth <= 1265) {
    textFavoritesAdd = "В избранном";
    textFavorites = "В избранное";
    textFavoritesMake = "Подать жалобу";
    find(".mine-ofr-view__user-favorites-line-text").innerText = textFavorites;
  } else {
    textFavoritesAdd = "Добавлено в избранное";
    textFavorites = "Добавить в избранное";
    textFavoritesMake = "Пожаловаться на объявление";
  }

  document
    .querySelector(".mine-ofr-view__user-favorites-line-left")
    .addEventListener("click", function (e) {
      if (this.querySelector(".like")) {
        if (this.querySelector(".like").classList.contains("_liked")) {
          this.closest(".mine-ofr-view__user-favorites-line").querySelector(
            ".mine-ofr-view__user-favorites-line-text"
          ).innerText = textFavoritesAdd;
          this.closest(".mine-ofr-view__user-favorites-line-left").classList.add(
            "_active-line"
          );
        } else {
          this.closest(".mine-ofr-view__user-favorites-line").querySelector(
            ".mine-ofr-view__user-favorites-line-text"
          ).innerText = textFavorites;
          this.closest(
            ".mine-ofr-view__user-favorites-line-left"
          ).classList.remove("_active-line");
        }
      }

      if (this.closest("._active_complain")) {
        this.closest("._active_complain")
          .querySelector(
            ".mine-ofr-view__user-favorites-line-complain .complain-line-active"
          )
          .remove();
        this.closest("._active_complain").classList.remove("_active_complain");
      }
    });

  document
    .querySelector(".mine-ofr-view__user-favorites-line-complain")
    .addEventListener("click", function (e) {
      if (
        !this.closest(".mine-ofr-view__user-favorites-line").classList.contains(
          "_active_complain"
        )
      ) {
        this.closest(".mine-ofr-view__user-favorites-line").classList.add(
          "_active_complain"
        );
        this.insertAdjacentHTML(
          "beforeend",
          `<p class="complain-line-active">${textFavoritesMake}</p>`
        );
      }
    });
}

const snacks = [...document.querySelectorAll(".snack")];
if (snacks.length) {
  snacks.forEach((snack) => {
    const close = snack.querySelector(".snack__close");
    const eventResize = new Event("resize")

    close.addEventListener("click", () => {
      snack.classList.remove("_show");
      window.dispatchEvent(eventResize)
    });
  });
}


/**
 * ===================
 * Чат
 * ===================
 */
// Функционал чата (смена окон "Создать диалог" и "Список чатов")
swapSidebarChat()
function swapSidebarChat() {
  const chatWrap = document.querySelector('.chat-wrap')
  if (!chatWrap) return

  const btnSearch = chatWrap.querySelector('.chat-sidebar__search-icon')
  const btnNewDialog = chatWrap.querySelector('.chat-sidebar__new-dialog')
  const sidebarChatList = chatWrap.querySelector('[data-sidebar=chat-list]')
  const sidebarNewDialog = chatWrap.querySelector('[data-sidebar=new-dialog]')

  btnSearch.addEventListener('click', e => {
    sidebarNewDialog.classList.remove('is-show')
    sidebarChatList.classList.add('is-show')
  })

  btnNewDialog.addEventListener('click', e => {
    sidebarChatList.classList.remove('is-show')
    sidebarNewDialog.classList.add('is-show')
  })
}

// Фиксация поля ввода
fixToolsChat()
function fixToolsChat() {
  const chatWrap = document.querySelector('.chat-wrap')
  if (!chatWrap) return

  const chat = chatWrap.querySelector('.chat')
  const chatContent = chat.querySelector('.chat-content')
  const tools = chatWrap.querySelector('.chat-tools')
  const sidebarContentAll = chatWrap.querySelectorAll('.chat-sidebar__content')

  const fix = () => {
    const windowHeight = window.innerHeight
    const chatRect = chat.getBoundingClientRect()
    const windowIndentBottom = chatRect.y + chatRect.height - windowHeight

    if (windowIndentBottom < 0) {
      if (sidebarContentAll.length !== 0) {
        sidebarContentAll.forEach(sidebarContent => {
          sidebarContent.style.marginBottom = null
        })
      }
      if (chatContent) {
        chatContent.style.marginBottom = null
      }

      tools.style.width = null
      tools.style.position = 'static'
      tools.style.bottom = null
    } else {
      if (sidebarContentAll.length !== 0) {
        sidebarContentAll.forEach(sidebarContent => {
          sidebarContent.style.marginBottom = windowIndentBottom + 'px'
        })
      }
      if (chatContent) {
        chatContent.style.marginBottom = tools.clientHeight + windowIndentBottom + 'px'
      }

      tools.style.width = chat.clientWidth + 'px'
      tools.style.position = 'fixed'
      tools.style.bottom = 0
    }
  }

  fix()
  window.addEventListener('scroll', fix)
  window.addEventListener('resize', fix)
}

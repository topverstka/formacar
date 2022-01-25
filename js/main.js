
// Служебные переменные
const d = document;
const body = document.querySelector('body');

// Служебные функции
function find(selector) {
	return document.querySelector(selector)
}

function findAll(selectors) {
	return document.querySelectorAll(selectors)
}

// Удаляет у всех элементов items класс itemClass
function removeAll(items,itemClass) {   
    if (typeof items == 'string') {
      items = document.querySelectorAll(items)
    }
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      item.classList.remove(itemClass)
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

function bodyLock(con) {
    if (con === true) {
        body.classList.add('_lock');
    } else if (con === false) {
        body.classList.remove('_lock');
    } else if (con === undefined) {
		if (!body.classList.contains('_lock')) {
			body.classList.add('_lock');
		}
		else {
			body.classList.remove('_lock')
		}
	} else {
		console.error('Неопределенный аргумент у функции bodyLock()')
	}
}

const popups = ['.search', '.menu']

window.addEventListener('click', e => {
    // Смена языка
    if (e.target.classList.contains('modal-lang__link')) changeLang(e)
    if (find('.menu._show') && (e.target.classList.contains('search-area') || e.target.closest('.search-area'))) {
        console.log('is search')

        // const burger = find('.burger')
        // const menu = find('.menu')
        // const menuBg = find('.menu-bg')
        
		// burger.classList.remove('_close')
		// menu.classList.remove('_show')
        // menuBg.classList.remove('_show')
    }
    if (
        (find('.menu._show') && find('.search._found') && (e.target.classList.contains('search-area') || e.target.closest('.search-area'))) ||
        (find('.menu._show') && !(e.target.classList.contains('header') || e.target.closest('.header')))
    ) {
        console.log('menu close')
        
        const burger = find('.burger')
        const menu = find('.menu')
        const menuBg = find('.menu-bg')
        
		burger.classList.remove('_close')
		menu.classList.remove('_show')
        menuBg.classList.remove('_show')
    }
})

// Валидация формы
function validationForm() {
    const name = find('#user_name')
    const phone = find('#user_phone')
    const email = find('#user_email')

    let con = true

    for (let i = 0; i < [name, phone, email].length; i++) {
        const elem = [name, phone, email][i];
        const elemValue = elem.value.trim()

        if (elemValue === '') {
            elem.classList.add('_error')
            con = false
        } else {
            elem.classList.remove('_error')
            con = true
        }
    }

    return con
}

// Отправка формы
// sumbitForm()
function sumbitForm() {
    const form = find('.modal__form')

    form.addEventListener('submit', async e => {
        const modal = find('.modal._show')
        const btnSend = form.querySelector('[type=submit]')
        btnSend.classList.add('send-preloader')

        e.preventDefault()
        
        let con = validationForm()

        if (con === true) {
            const formData = new FormData()
            const action = form.getAttribute('action')
    
            let response = await fetch(action, {
                method: 'POST',
                body: formData
            })
            
            // settimeout здесь для того, чтобы показать работу отправки формы. В дальнейшем это нужно убрать
            setTimeout(() => {
                if (response.ok) {
                    console.log('Successful')
                    form.reset()
    
                    modal.classList.remove('_show')
                    find('#send-done').classList.add('_show')
                    btnSend.classList.remove('send-preloader')
                }
                else {
                    console.log('Error')
                    form.reset()
    
                    modal.classList.remove('_show')
                    find('#send-error').classList.add('_show')
                    btnSend.classList.remove('send-preloader')
                }
            }, 2000)

        }
    })
}

// Мобильное меню
menu()
function menu() {
	const burger = find('.burger')
	const menu = find('.menu');
    const menuWrap = menu.querySelector('.menu__wrap')
    const menuBg = find('.menu-bg')

	burger.addEventListener('click', (e) => {
		burger.classList.toggle('_close')
		menu.classList.toggle('_show')
        menuBg.classList.toggle('_show')

		// bodyLock()
	})
}

// Поиск по сайту
siteSearch()
function siteSearch() {
    const form = find('.search-area')
    const input = find('.search-area__input')
    const clear = find('.search-area__clear')
    const search = find('.search')
    const menu = find('.menu')
    const burger = find('.burger')
    const menuBg = find('.menu-bg')
    const loader = find('.search__result-loading')
    const notFound = find('.search__result-not-found')

    form.addEventListener('submit', e => {
        e.preventDefault()
        siteSearchPopup(input)
        showLoader()

        if (find('.menu._show')) {
            find('.menu').classList.remove('_show')
            burger.classList.remove('_close')
        }
        
        // Имитация загрузки результатов поиска
        setTimeout(e => { 
            siteSearchData(input)   
        }, 1500)
    })
    input.addEventListener('input', e => {
        if (input.value != '') { 
            clear.classList.add('_show')
        }
    })
    input.addEventListener('focus', e => {
        siteSearchFocus(input)
    })
    input.addEventListener('blur', e => {
        siteSearchBlur(input)
    })
    clear.addEventListener('click', e => {
        // if (clear.classList.contains('_show')) {
            e.preventDefault()
            input.value = ''
            input.focus()
            siteSearchPopup(input)
            // siteSearchData(input)
        // }
    })

    function siteSearchFocus(input) {
        if (input.value != '') {
            search.classList.add('_show')
            menuBg.classList.add('_show')

            if (find('.menu._show')) {
                find('.menu').classList.remove('_show')
                burger.classList.remove('_close')
            }
        }
    }

    function siteSearchBlur(input) {
        search.classList.remove('_show')
        menuBg.classList.remove('_show')
    }

    function siteSearchPopup(input) {
        const value = input.value
    
        if (value != '') {
            search.classList.add('_show')
            menuBg.classList.add('_show')
            clear.classList.add('_show')
        }
        else {
            search.classList.remove('_show')
            menuBg.classList.remove('_show')
            clear.classList.remove('_show')
        }

    }

    function showLoader() {
        const cardsShow = findAll('.search__result-list .s-result-card')
        
        for (let i = 0; i < cardsShow.length; i++) {
            const card = cardsShow[i];
            card.remove()
        }

        notFound.classList.remove('_show')
        loader.classList.add('_show')
    }
    
    async function siteSearchData(input) {
        const value = input.value
        const result = find('.search__result-list')

        // Поиск в бд запроса поиска
        let response = await fetch('../db.json')

        if (response.ok) {
            let data = await response.json()
            const dataArr = []

            console.log(data.length)
            
            data.forEach(elem => { if (elem['title'].toLowerCase() === value.toLowerCase()) dataArr.push(elem['category']) })
            
            if (dataArr.length === 0) {
                loader.classList.remove('_show')
                notFound.classList.add('_show')
                notFound.querySelector('.search__result-not-found-text span').innerText = value
            }
            else {
                const quantityCat = dataArr.reduce((arr, elem) => {
                    arr[elem] = (arr[elem] || 0) + 1
                    return arr
                }, {})
    
                // console.log(value, data, quantityCat)
                loader.classList.remove('_show')
    
                for (const [title, quantity] of Object.entries(quantityCat)) {
                    const card = document.createElement('a')
                    card.setAttribute('href', '#')
                    card.classList.add('link', 's-result-card')
                    card.innerHTML = 
                    `
                        <div class="s-result-card__wrap">
                            <div class="s-result-card__text">
                                <h4 class="s-result-card__title">${value}</h4>
                                <span class="s-result-card__cat">${title}</span>
                            </div>
                            <span class="s-result-card__quantity">${quantity}</span>
                        </div>
                    `
    
                    result.append(card)
                }
            }

        }
        else {
            console.log('Error' + response.status)
        }
    }
}

// Плейсхолдер поиска
labelSearch()
function labelSearch() {
    const searchElems = document.querySelectorAll('.search-area')

    for (let i = 0; i < searchElems.length; i++) {
        const parent = searchElems[i];
        const input = parent.querySelector('input')
        const label = parent.querySelector('label')

        input.addEventListener('input', e => {
            if (input.value != '') {
                label.classList.add('_change-label')
            }
        })

        input.addEventListener('blur', e => {
            if (input.value === '') {
                label.classList.remove('_change-label')
            }
        })
    }
}

// changeRangeInputCities()
function changeRangeInputCities() {
    const block = find('.location__radius')
    const elemValue = block.querySelector('.location__radius-value span')
    const range = block.querySelector('.location__radius-range input')

    range.addEventListener('input', e => {
        elemValue.innerText = range.value
    })
}

// Слайдер диапазона
rangeChangeCities()
function rangeChangeCities() {
    const range = find('.location__radius-range input')
    const elemValue = find('.location__radius-value span')
    
    rangesliderJs.create(range, {
        onSlide: e => elemValue.innerText = e
    })
}

// Фиксация шапки
// fixHeader()
function fixHeader() {
    const header = find('.header')
    const wrapper = find('.wrapper')
    const headerBottom = find('.header__bottom')

    wrapper.style.marginTop = header.clientHeight + 'px'
    window.addEventListener('scroll', e => {
        if (window.scrollY > 200) {
            headerBottom.classList.add('_hide')
        }
        else {
            headerBottom.classList.remove('_hide')
        }
    })
}

// Отображение ссылок при наведении на соответствующую категорию в меню
catLinksMenu()
function catLinksMenu() {
    const catElems = findAll('.menu__left-item')

    for (let i = 0; i < catElems.length; i++) {
        const cat = catElems[i];
        
        cat.addEventListener('mouseenter', e => {
            const catData = cat.dataset.menuCat
            const catLinks = find(`[data-menu-links=${catData}]`)

            // Показываем ссылки по категории
            find('.menu__right._show').classList.remove('_show')
            catLinks.classList.add('_show')

            // Присваеваем активный класс ссылке категории
            find('.menu__left-item._active').classList.remove('_active')
            cat.classList.add('_active')
        })
    }
}

const swiper = new Swiper('.recent-card__slider', {
  
  slidesPerView: 2, // Кол-во показываемых слайдов
  spaceBetween: 4, // Расстояние между слайдами
//   loop: true, // Бесконечный слайдер
//   freeMode: true, // Слайдеры не зафиксированны
//   centeredSlides: false, // Размещать слайдеры по центру

//   autoplay: { // автопрокрутка
//       delay: 5000, // задержка
//   },

  breakpoints: {
    1440: {
        slidesPerView: 2,
    },
    700: {

    },
    400: {

    }
  },

  navigation: {
    nextEl: '.recent-card__slider-arrow_next',
    prevEl: '.recent-card__slider-arrow_prev',
  },

//   scrollbar: {
//     el: '.swiper-scrollbar',
//   },
});

// Функции для модальных окон
// modal()
// function modal() {
    
// Открытие модальных окон при клике по кнопке
openModalWhenClickingOnBtn()
function openModalWhenClickingOnBtn() {
    const btnsOpenModal = document.querySelectorAll('[data-modal-open]');

    for (let i = 0; i < btnsOpenModal.length; i++) {
        const btn = btnsOpenModal[i];

        btn.addEventListener('click', (e) => {
            const dataBtn = btn.dataset.modalOpen;
            const modal = document.querySelector(`#${dataBtn}`)

            openModal(modal)
            window.location.hash = dataBtn
        });
    }
}

// Открытие модального окна, если в url указан его id
openModalHash()
function openModalHash() {
    if (window.location.hash) {
        const hash = window.location.hash.substring(1)
        const modal = document.querySelector(`.modal#${hash}`)

        if (modal) openModal(modal)
    }
}

// Показываем/убираем модальное окно при изменения хеша в адресной строке
checkHash()
function checkHash() {
    window.addEventListener('hashchange', e => {
        const hash = window.location.hash
        const modal = document.querySelector(`.modal${hash}`)

        if (find('.modal._show')) find('.modal._show').classList.remove('_show')
        if (modal && hash != '') openModal(modal)
    })
}

// Закрытие модального окна при клике по заднему фону
closeModalWhenClickingOnBg()
function closeModalWhenClickingOnBg() {
    document.addEventListener('click', (e) => {
        const target = e.target
        const modal = document.querySelector('.modal._show')

        if (modal && target.classList.contains('modal__wrap')) closeModal(modal)
    })
}

// Закрытие модальных окон при клике по крестику
closeModalWhenClickingOnCross()
function closeModalWhenClickingOnCross() {
    const modalElems = document.querySelectorAll('.modal')
    for (let i = 0; i < modalElems.length; i++) {
        const modal = modalElems[i];
        const closeThisModal = modal.querySelector('.modal__close')

        if (closeThisModal) {
            closeThisModal.addEventListener('click', () => {
                closeModal(modal)
            })
        }
    }
}

// Закрытие модальных окон при нажатии по клавише ESC
closeModalWhenClickingOnESC()
function closeModalWhenClickingOnESC() {
    const modalElems = document.querySelectorAll('.modal')
    for (let i = 0; i < modalElems.length; i++) {
        const modal = modalElems[i];

        document.addEventListener('keydown', e => {
            if (e.key === 'Escape') closeModal(modal)
        })
    }
}

// Сброс id модального окна в url
function resetHash() {
    const windowTop = window.pageYOffset
    window.location.hash = ''
    window.scrollTo(0, windowTop)
}

// Открытие модального окна
function openModal(modal) {
    modal.classList.add('_show')
    bodyLock(true)
}

// Закрытие модального окна
function closeModal(modal) {
    if (modal == undefined) modal = find('.modal._show')
    modal.classList.remove('_show')
    bodyLock(false)
    resetHash()
}
// }

// Лайк поста
liked()
function liked() {
    const likeElems = findAll('.like')
    
    for (let i = 0; i < likeElems.length; i++) {
        const elem = likeElems[i]
        elem.addEventListener('click', e => elem.classList.toggle('_liked'))
    }
}

// Смена языка
// Если при клике осуществляется переход на страницу с другим языком, то эту функцию нужно удалить.
function changeLang(e) {
    const target = e.target
    const langTitle = find('.change-lang__title')
    
    e.preventDefault()
    langTitle.innerText = target.innerText
    find('.modal-lang__link._active').classList.remove('_active')
    target.classList.add('_active')
    closeModal()
}

// функционал чекбоксов
selectAllModalRegions()
function selectAllModalRegions() {
    const mRegions = find('#regions')
    const selectAll = mRegions.querySelector('.regions-checkbox_select-all input')
    const checkboxElems = mRegions.querySelectorAll('.regions-checkbox input:not(.regions-checkbox_select-all input)')

    selectAll.addEventListener('change', e => {
        if (selectAll.checked) {
            for (let i = 0; i < checkboxElems.length; i++) {
                const checkbox = checkboxElems[i];
                checkbox.checked = true
            }
        }
        else {
            for (let i = 0; i < checkboxElems.length; i++) {
                const checkbox = checkboxElems[i];
                checkbox.checked = false
            }
        }
    })

    for (let i = 0; i < checkboxElems.length; i++) {
        const checkbox = checkboxElems[i];
        
        checkbox.addEventListener('click', e => {
            if (selectAll.checked) {
                selectAll.checked = false
            }
        })
    }
}

// Выбор региона
selectRegion()
function selectRegion() {
    const btn = find('.modal-regions__country')
    const parent = btn.parentElement

    btn.addEventListener('click', e => {
        parent.classList.toggle('_regions')
    })
}

// Аккордеон
accFAQ()
function accFAQ() {
  const hiddenSiblingAcc = true // Скрывать соседние аккордеоны. false если не нужно.
  const accHeaderElems = document.querySelectorAll('.acc-open')
  
  for (let i = 0; i < accHeaderElems.length; i++) {
    const accHeader = accHeaderElems[i]
    
    accHeader.addEventListener('click', e => {
      const container = (!accHeader.closest('.acc-body')) ? accHeader.parentElement.parentElement : accHeader.closest('.acc-body')
      const parent = accHeader.closest('.modal-regions__acc')
      const accBody = accHeader.closest('.modal-regions__acc-header').nextElementSibling

      parent.classList.toggle('_show') 
      accHeader.classList.toggle('_show') 
      
      if (accBody.style.maxHeight) { 
        accBody.style.maxHeight = null
        parent.classList.remove('_show') 
        accHeader.classList.remove('_show') 
      }
      else {
        const adjacentElems = getSiblings(parent)
        console.log(parent, adjacentElems)
        
        if (hiddenSiblingAcc) {
          for (let i = 0; i < adjacentElems.length; i++) {
            const elem = adjacentElems[i]
            const elemHeader = elem.querySelector('.acc-open')
            const elemBody = elem.querySelector('.acc-body')
            console.log(elem, elemBody  )

            elem.classList.remove('_show') 
            elemHeader.classList.remove('_show')  
            elemBody.style.maxHeight = null
          }
        }
        
        accBody.style.maxHeight = accBody.scrollHeight + 'px'
        container.style.maxHeight = parseInt(container.scrollHeight) + accBody.scrollHeight + 'px'
      }
    })
  }
}


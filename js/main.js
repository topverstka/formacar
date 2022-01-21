
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

window.addEventListener('click', e => {
    // Смена языка
    if (e.target.classList.contains('modal-lang__link')) changeLang(e)

    // 
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

	burger.addEventListener('click', (e) => {
		burger.classList.toggle('_close')
		menu.classList.toggle('_show')
        menuBg.classList.toggle('_show')

		// bodyLock()
	})
}

// Что закрывается при клике по заднему фону
clickOnMenuBg()
function clickOnMenuBg() {
    const menuBg = find('.menu-bg')

    menuBg.addEventListener('click', e => {
		burger.classList.remove('_close')
		menu.classList.remove('_show')
        menuBg.classList.remove('_show')
    })
}

// Поиск по сайту
siteSearch()
function siteSearch() {
    const input = find('.search-area__input')
    const clear = find('.search-area__clear')

    input.addEventListener('input', e => {
        siteSearchData(input)
    })
    clear.addEventListener('click', e => {
        input.value = ''
        siteSearchData(input)
    })
}

function siteSearchData(input) {
    const search = find('.search')
    const menuBg = find('.menu-bg')
    const clear = find('.search-area__clear')
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
    
            closeThisModal.addEventListener('click', () => {
                closeModal(modal)
            })
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
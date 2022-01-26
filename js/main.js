
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
        
		find('.burger').classList.remove('_close')
		find('.menu').classList.remove('_show')
        find('.menu-bg').classList.remove('_show')
    }

    if (find('.search._show') && !(e.target.classList.contains('search') || e.target.closest('.search') || e.target.classList.contains('search-area_header') || e.target.closest('.search-area_header'))) {
        find('.search').classList.remove('_show')
        if (!find('.menu').classList.contains('_show')) {
            find('.menu-bg').classList.remove('_show')
        }
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
    // input.addEventListener('blur', e => {
    //     siteSearchBlur(input)
    // })
    clear.addEventListener('click', e => {
        // if (clear.classList.contains('_show')) {
            // e.preventDefault()
            // input.value = ''
            // input.focus()
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

    // function siteSearchBlur(input) {
    //     search.classList.remove('_show')
    //     menuBg.classList.remove('_show')
    // }

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

            // console.log(data.length)
            
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

// Показать крестик у поиска
siteSearchShowClear()
function siteSearchShowClear() {
    const searchElems = findAll('.search-area')
    for (let i = 0; i < searchElems.length; i++) {
        const search = searchElems[i];
        const clear = search.querySelector('.search-area__clear')
        const input = search.querySelector('.search-area__input')
        
        input.addEventListener('input', e => {
            if (input.value != '') {
                clear.classList.add('_show')
            }
            else {
                clear.classList.remove('_show')
            }
        })

        clear.addEventListener('click', e => {
            e.preventDefault()
            input.value = ''
            input.focus()
        })
    }
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

        if (menu.classList.contains('_show')) {
            menuBg.classList.add('_show')
            console.log('add')
        }
        else {
            menuBg.classList.remove('_show')
            console.log('remove')
        }
	})
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
  
  slidesPerView: 'auto', // Кол-во показываемых слайдов
  spaceBetween: 4, // Расстояние между слайдами
//   loop: true, // Бесконечный слайдер
//   freeMode: true, // Слайдеры не зафиксированны
//   centeredSlides: false, // Размещать слайдеры по центру

//   autoplay: { // автопрокрутка
//       delay: 5000, // задержка
//   },

  breakpoints: {
    1440: {
        // slidesPerView: 'auto',
    },
    700: {

    },
    400: {

    }
  },

  navigation: {
    nextEl: '.recent-card__slider-arrow_next',
    prevEl: '.recent-card__slider-arrow_prev',
  }
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
selectAllModalCountry()
function selectAllModalCountry() {
    const mRegions = find('.modal-regions__countries')
    const selectAll = mRegions.querySelector('.regions-checkbox_select-all input')
    const checkboxElems = mRegions.querySelectorAll('.regions-checkbox input:not(.regions-checkbox_select-all input)')
    const checkboxRegionsElems = findAll('.modal-regions__regions .regions-checkbox input')

    selectAll.addEventListener('change', e => {
        for (let i = 0; i < checkboxRegionsElems.length; i++) {
            const checkbox = checkboxRegionsElems[i];
            
            checkbox.checked = false
        }

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

        selectedCountry()
    })

    for (let i = 0; i < checkboxElems.length; i++) {
        const checkbox = checkboxElems[i];
        
        checkbox.addEventListener('click', e => {
            let cond = true

            if (selectAll.checked) {
                selectAll.checked = false
            }

            for (let i = 0; i < checkboxElems.length; i++) {
                const checkbox = checkboxElems[i];
                
                if (!checkbox.checked) {
                    cond = false
                }
            }

            if (cond === true) {
                selectAll.checked = true
            }

            selectedCountry()
        })
    }
}

// Выбранные чекбоксы
function selectedCountry() {
    let selectedC = findAll('.modal-regions__countries .regions-checkbox input:checked:not(.modal-regions__countries .regions-checkbox_select-all input:checked)')
    const oneCountry = find('.modal-regions__one-country')
    const chipsBlock = find('.modal-regions__chips')
    const chipsList = find('.modal-regions__chips-list')
    const showAll = find('.modal-regions__show-all')
    const checkboxRegionsElems = findAll('.modal-regions__regions .regions-checkbox input')
    const moreTitle = find('.modal-regions__more-title')
    const btnReset = find('.modal-regions__reset')
    const selectAll = find('.regions-checkbox_select-all input')

    // for (let i = 0; i < checkboxRegionsElems.length; i++) {
    //     const checkbox = checkboxRegionsElems[i];
        
    //     checkbox.checked = false
    // }

    if (selectedC.length === 1) {
        oneCountry.classList.add('_show')
        oneCountry.querySelector('.modal-regions__one-country-text').innerText = selectedC[0].value

        // Сохраняем страны в localStorage
        // localStorage.setItem('country', JSON.stringify(Array(selectedC[0].value)))
    }
    else {
        oneCountry.classList.remove('_show')
    }

    if (selectedC.length >= 1) {
        btnReset.classList.add('_show')
        moreTitle.classList.add('_show')
        moreTitle.innerText = 'Другие страны'
    }
    else {
        btnReset.classList.remove('_show')
        moreTitle.classList.remove('_show')
        moreTitle.innerText = ''
    }

    if (selectedC.length > 1) {
        // let arrC = []
        chipsBlock.classList.add('_show')
        chipsList.innerHTML = ''

        for (let i = 0; i < selectedC.length; i++) {
            const checkbox = selectedC[i];

            if (i < 5 && showAll.classList.contains('_text-show') || showAll.classList.contains('_text-hide')) {
                const chips = document.createElement('button')
                
                chips.classList.add('regions-chips')
                chips.innerHTML = `<span class="regions-chips__title">${checkbox.value}</span>`
                
                chipsList.append(chips)
                // arrC.push(checkbox.value)
            }
        }

        // Сохраняем страны в localStorage
        // localStorage.setItem('country', JSON.stringify(arrC))

        if (selectedC.length > 5) {
            showAll.querySelector('.modal-regions__show-all-quantity span').innerText = selectedC.length - 5
            showAll.classList.add('_show')
        }
        else {
            showAll.classList.remove('_show')
        }

        const chipsElems = chipsList.querySelectorAll('.regions-chips')

        for (let i = 0; i < chipsElems.length; i++) {
            const chips = chipsElems[i];

            chips.addEventListener('click', e => {
                chips.remove()
                selectedC[i].checked = false
                selectAll.checked = false

                if (chipsList.querySelectorAll('.regions-chips').length === 0) {
                    chipsBlock.classList.remove('_show')
                }

                selectedCountry()
            })
        }
    }
    else {
        chipsBlock.classList.remove('_show')
        chipsList.innerHTML = ''
    }

}

// Показать все карточки городов
showAllCities()
function showAllCities() {
    const showAll = find('.modal-regions__show-all')

    showAll.addEventListener('click', e => {
        if (showAll.classList.contains('_text-show')) {
            showAll.classList.add('_text-hide')
            showAll.classList.remove('_text-show')
        }
        else {
            showAll.classList.add('_text-show')
            showAll.classList.remove('_text-hide')
        }
    
        if (find('.modal-regions__acc-body .regions-checkbox input:checked')) {
            selectedRegions()
            // console.log('selectedRegions')
        }
        else {
            selectedCountry()
            // console.log('selectedCountry')
        }
    })
}

// Выбрать регионы страны
activeRegion()
function activeRegion() {
    const btn = find('.modal-regions__one-country')
    const title = find('.modal-regions__title')
    const blockC = find('.modal-regions__countries')
    const blockR = find('.modal-regions__regions')
    const moreTitle = find('.modal-regions__more-title')

    btn.addEventListener('click', e => {
        btn.classList.toggle('_active')

        if (btn.classList.contains('_active')) {
            blockC.classList.remove('_show')
            blockR.classList.add('_show')
            title.innerText = 'Регион поиска'
            moreTitle.innerText = 'Все регионы'
        }
        else {
            blockC.classList.add('_show')
            blockR.classList.remove('_show')
            title.innerText = 'Страна поиска'
            moreTitle.innerText = 'Другие страны'
        }
    })
}

// Чекбоксы регионов
checkboxesRegions()
function checkboxesRegions() {
    const accElems = findAll('.modal-regions__acc')

    for (let i = 0; i < accElems.length; i++) {
        const acc = accElems[i];
        const selectAll = acc.querySelector('.regions-checkbox input')
        const checkboxElems = acc.querySelectorAll('.modal-regions__acc-body .regions-checkbox input')
        
        selectAll.addEventListener('click', e => {

            if (selectAll.checked === true) {
                for (let i = 0; i < checkboxElems.length; i++) {                    
                    checkboxElems[i].checked = true
                }
            }
            else {
                for (let i = 0; i < checkboxElems.length; i++) {                    
                    checkboxElems[i].checked = false
                }
            }

            selectedRegions()
        })

        for (let i = 0; i < checkboxElems.length; i++) {
            const checkbox = checkboxElems[i];
            
            checkbox.addEventListener('click', e => {

                for (let i = 0; i < checkboxElems.length; i++) {
                    const checkbox = checkboxElems[i];
                    let cond = true

                    if (checkbox.checked === false) cond = false

                    if (cond === false) selectAll.checked = false
                }

                selectedRegions()
            })
        }
    }
}

// Выбранные регионы
function selectedRegions() {
    const selectedC = findAll('.modal-regions__acc-body .regions-checkbox input:checked')
    const chipsBlock = find('.modal-regions__chips')
    const chipsList = find('.modal-regions__chips-list')
    const showAll = find('.modal-regions__show-all')

    if (selectedC.length > 0) {
        // let arrC = []
        chipsBlock.classList.add('_show')
        chipsList.innerHTML = ''

        for (let i = 0; i < selectedC.length; i++) {
            const checkbox = selectedC[i];
            
            if (i < 5 && showAll.classList.contains('_text-show') || showAll.classList.contains('_text-hide')) {
                const chips = document.createElement('button')
                
                chips.classList.add('regions-chips')
                chips.innerHTML = `<span class="regions-chips__title">${checkbox.value}</span>`
                
                chipsList.append(chips)
            }

            // arrC.push(checkbox.value)
        }

        // Сохраняем города в localStorage
        // localStorage.setItem('regions', JSON.stringify(arrC))
    }
    else {
        chipsBlock.classList.remove('_show')
        chipsList.innerHTML = ''
    }
    
    if (selectedC.length > 5) {
        showAll.querySelector('.modal-regions__show-all-quantity span').innerText = selectedC.length - 5
        showAll.classList.add('_show')
    }
    else {
        showAll.classList.remove('_show')
    }

    const chipsElems = chipsList.querySelectorAll('.regions-chips')

    for (let i = 0; i < chipsElems.length; i++) {
        const chips = chipsElems[i];

        chips.addEventListener('click', e => {
            chips.remove()
            selectedC[i].checked = false
            selectedC[i].closest('.modal-regions__acc').querySelector('input').checked = false

            if (chipsList.querySelectorAll('.regions-chips').length === 0) {
                chipsBlock.classList.remove('_show')
            }

            selectedRegions()
        })
    }
}

// Сбросить настройки
resetSettingsPlaces()
function resetSettingsPlaces() {
    const modal = find('#regions')
    const btnElems = findAll('.location__reset')
    const title = find('.modal-regions__title')
    const blockC = find('.modal-regions__countries')
    const blockR = find('.modal-regions__regions')
    const oneCountry = find('.modal-regions__one-country')
    
    for (let i = 0; i < btnElems.length; i++) {
        const btn = btnElems[i];
        
        btn.addEventListener('click', e => {
            const checkboxElems = modal.querySelectorAll('.regions-checkbox input')

            for (let i = 0; i < checkboxElems.length; i++) {
                const checkbox = checkboxElems[i];
                
                checkbox.checked = false
            }
            
            blockC.classList.add('_show')
            blockR.classList.remove('_show')
            oneCountry.classList.remove('_active')

            title.innerText = 'Страна поиска'
        
            selectedCountry()
            selectedRegions()
            
            const countryElems = findAll('.regions-checkbox__input[data-space="country"]:checked')
            const regionElems = findAll('.regions-checkbox__input[data-space="region"]:checked')
            
            localStorage.setItem('country', JSON.stringify([...countryElems].map(e => { return e.value })))
            localStorage.setItem('regions', JSON.stringify([...regionElems].map(e => { return e.value })))

            settingsPopupPlaces()
        })
    }    
}

// Применить настройки городов и регионов
applySettingsPlaces()
function applySettingsPlaces() {
    const btn = find('.modal-regions__apply')

    btn.addEventListener('click', e => {
        const countryElems = findAll('.regions-checkbox__input[data-space="country"]:checked')
        const regionElems = findAll('.regions-checkbox__input[data-space="region"]:checked')
        
        localStorage.setItem('country', JSON.stringify([...countryElems].map(e => { return e.value })))
        localStorage.setItem('regions', JSON.stringify([...regionElems].map(e => { return e.value })))
        closeModal()
        settingsPopupPlaces()
    })
}

// Настройка всплывашки
settingsPopupPlaces()
function settingsPopupPlaces() {
    const countries = find('.location__select_countries')
    const countriesList = find('.location__select_countries .location__countries')
    const regions = find('.location__select_regions')
    const regionsList = find('.location__select_regions .location__countries')
    const empty = find('.location__select_empty')
    const radius = find('.location__radius')
    const radiusInput = radius.querySelector('input[type="range"]')
    const footer = find('.location__body-footer')

    const places = find('.location__places')
    const distance = find('.location__distance')
    const quantity = find('.location__quantity')

    const countryArr = localStorage.getItem('country') ? JSON.parse(localStorage.getItem('country')) : []
    const regionsArr = localStorage.getItem('regions') ? JSON.parse(localStorage.getItem('regions')) : []

    // Выбрано 0 стран и 0 регионов
    if (regionsArr.length === 0 && countryArr.length === 0) {
        removeAllBlocksToPopup()
        empty.classList.add('_show')
        changeBtnPlace()
    }

    // Выбрано несколько стран
    if (countryArr.length > 1) {
        showCountries()
        changeBtnPlace()
    }

    // Выбрана 1 страна и/или несколько городов
    if (countryArr.length === 1) {
        showCountries()
        showRegions()
        changeBtnPlace()
    }

    function showCountries() {
        removeAllBlocksToPopup()
        countries.classList.add('_show')
        footer.classList.add('_show')

        countriesList.innerHTML = ''
        for (let i = 0; i < countryArr.length; i++) {
            const country = countryArr[i];

            if (i < 5) {
                const elem = document.createElement('span')
                elem.innerText = country
    
                countriesList.append(elem)
            }
        }

        if (countryArr.length > 5) {
            const elem = document.createElement('span')
            elem.innerText = `+${countryArr.length - 5}`

            countriesList.append(elem)
        }
    }

    function showRegions() {
        if (regionsArr.length === 1) {
            const elem = document.createElement('span')

            regions.classList.add('_show')
            radius.classList.add('_show')

            regionsList.innerHTML = ''
            elem.innerText = regionsArr[0]
            regionsList.append(elem)
        }

        if (regionsArr.length > 0) {
            regions.classList.add('_show')

            regionsList.innerHTML = ''
            for (let i = 0; i < regionsArr.length; i++) {
                const region = regionsArr[i];

                if (i < 5) {
                    const elem = document.createElement('span')
                    elem.innerText = region
        
                    regionsList.append(elem)
                }
            }
            
            if (regionsArr.length > 5) {
                const elem = document.createElement('span')
                elem.innerText = `+${regionsArr.length - 5}`
                regionsList.append(elem)
            }
        }
    }
    
    function changeBtnPlace() {

        if (regionsArr.length === 0 && countryArr.length === 0) {
            places.innerText = 'По всему миру'
            distance.classList.remove('_show')
            quantity.classList.remove('_show')
        }

        // Если выбран 1 регион
        if (regionsArr.length === 1) {
            places.innerText = regionsArr[0]
            distance.classList.add('_show')
            quantity.classList.remove('_show')
            distance.querySelector('span').innerText = radiusInput.value
        }

        // Если выбрана 1 страна
        if (countryArr.length === 1 && regionsArr.length === 0) {
            places.innerText = countryArr[0]
            distance.classList.remove('_show')
            quantity.classList.remove('_show')
            // distance.querySelector('span').innerText = radiusInput.value
        }

        // Если выбрано больше 2 регионов
        if (regionsArr.length >= 2) {

            if (regionsArr.length > 2) {
                quantity.classList.add('_show')
                quantity.querySelector('span').innerText = regionsArr.length - 2
            }
            else {
                quantity.classList.remove('_show')
            }
            distance.classList.remove('_show')

            places.innerHTML = ''
            for (let i = 0; i < regionsArr.length; i++) {
                
                if (i < 2) {
                    const elem = document.createElement('span')
                    elem.innerText = regionsArr[i]

                    places.append(elem)
                }
            }
        }

        // Если выбрано больше 2 стран
        if (countryArr.length >= 2) {

            if (countryArr.length > 2) {
                quantity.classList.add('_show')
                quantity.querySelector('span').innerText = countryArr.length - 2
            }
            else {
                quantity.classList.remove('_show')
            }
            distance.classList.remove('_show')

            places.innerHTML = ''
            for (let i = 0; i < countryArr.length; i++) {
                
                if (i < 2) {
                    const elem = document.createElement('span')
                    elem.innerText = countryArr[i]

                    places.append(elem)
                }
            }
        }
    }

    function removeAllBlocksToPopup() {
        const arrBlocks = [countries, regions, empty, radius, footer]

        for (let i = 0; i < arrBlocks.length; i++) {
            const elem = arrBlocks[i];
            
            elem.classList.remove('_show')
        }
    }
    
    function removeAllBlocksToBtn() {
        const arrBlocks = [places, distance, quantity]

        for (let i = 0; i < arrBlocks.length; i++) {
            const elem = arrBlocks[i];
            
            elem.classList.remove('_show')
        }
    }
}

// Показать всплывашку
showPopupPlaces()
function showPopupPlaces() {
    const location = find('.location')

    location.addEventListener('mouseenter', e => {
        location.classList.add('_show-popup')
    })

    location.addEventListener('mouseleave', e => {
        location.classList.remove('_show-popup')
    })
}

// Сохранить данные в всплывашке
savePopupPlaces()
function savePopupPlaces() {
    const save = find('.location__body-footer-btn-save')
    const location = find('.location')
    const range = find('.location__radius-range input')
    const distanceBtn = find('.location__distance span')

    if (localStorage.getItem('distance')) {
        distanceBtn.innerText = localStorage.getItem('distance')
        range.setAttribute('value', localStorage.getItem('distance'))
    }

    save.addEventListener('click', e => {
        location.classList.remove('_show-popup')
        distanceBtn.innerText = range.value
        localStorage.setItem('distance', range.value)
    })
}

// Выделение чекбоксов, значение value которых совпадает с элементом массива в localStorage
loadCheckedFromLocalStorage()
function loadCheckedFromLocalStorage() {
    const countryArr = localStorage.getItem('country') ? JSON.parse(localStorage.getItem('country')) : []
    const regionsArr = localStorage.getItem('regions') ? JSON.parse(localStorage.getItem('regions')) : []    

    for (let i = 0; i < countryArr.length; i++) {
        const nameC = countryArr[i];
        const checkbox = find(`[data-space="country"][value="${nameC}"]`)

        checkbox.checked = true
    }
    
    for (let i = 0; i < regionsArr.length; i++) {
        const nameR = regionsArr[i];
        const checkbox = find(`[data-space="region"][value="${nameR}"]`)
        console.log(checkbox)
        checkbox.checked = true
    }

    selectedCountry()
    selectedRegions()
}

// Открытие нужного блока при клике "Странам" и "Регионам" в всплывашке
openDefiniteBlock()
function openDefiniteBlock() {
    const btnC = find('.location__select_countries')
    const btnR = find('.location__select_regions')
    
    const oneCountry = find('.modal-regions__one-country')
    const title = find('.modal-regions__title')
    const blockC = find('.modal-regions__countries')
    const blockR = find('.modal-regions__regions')
    const moreTitle = find('.modal-regions__more-title')

    btnC.addEventListener('click', e => {
        oneCountry.classList.remove('_active')
        blockC.classList.add('_show')
        blockR.classList.remove('_show')
        title.innerText = 'Страна поиска'
        moreTitle.innerText = 'Другие страны'
    })

    btnR.addEventListener('click', e => {
        oneCountry.classList.add('_active')
        blockC.classList.remove('_show')
        blockR.classList.add('_show')
        title.innerText = 'Регион поиска'
        moreTitle.innerText = 'Все регионы'
    })
}

// Показать все карточки городов
// showAllRegions()
// function showAllRegions() {
//     const showAllReg = find('.modal-regions__show-all')

//     showAllReg.addEventListener('click', e => {
//         console.log(showAllReg)
//         if (showAllReg.classList.contains('_text-show')) {
//             showAllReg.classList.add('_text-hide')
//             showAllReg.classList.remove('_text-show')
//         }
//         else {
//             showAllReg.classList.add('_text-show')
//             showAllReg.classList.remove('_text-hide')
//         }
    
//         selectedRegions()
//     })
// }

// Выбор региона
selectRegion()
function selectRegion() {
    const btn = find('.modal-regions__one-country')
    const parent = btn.parentElement

    btn.addEventListener('click', e => {
        parent.classList.toggle('_regions')
    })
}

// Аккордеон
accFAQ()
function accFAQ() {
  const hiddenSiblingAcc = false // Скрывать соседние аккордеоны. false если не нужно.
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
        
        if (hiddenSiblingAcc) {
          for (let i = 0; i < adjacentElems.length; i++) {
            const elem = adjacentElems[i]
            const elemHeader = elem.querySelector('.acc-open')
            const elemBody = elem.querySelector('.acc-body')

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

// Слайдер диапазона
rangeChangeCities()
function rangeChangeCities() {
    const range = find('.location__radius-range input')
    const distance = find('.location__radius-value span')
    // const distanceBtn = find('.location__distance span')
    
    rangesliderJs.create(range, {
        onSlide: e => { distance.innerText = e }
    })

    distance.innerText = range.value
}
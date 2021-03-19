document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector('.header');
  const map = document.querySelector('.address__map');

  function disableBgsOnMobile() {
    if (window.innerWidth >= 768) {
      const sale = document.querySelector('.sale');
      sale.dataset.src = "img/3/sale-bg.webp";
      sale.classList.add('b-lazy');

      const request = document.querySelector('.request');
      request.dataset.src = "img/7/request-bg.webp";
      request.classList.add('b-lazy');
    }
  }

  function modalInit() {
    //Таргеты для открытия модальных окон
    const headerOrder = document.querySelector('.header-info__order');
    const saleButton = document.querySelector('.sale-form__button');
    const requestButton = document.querySelector('.request-form__button');
    const formOrderButtons = document.querySelectorAll('.form__button');

    const modals = document.querySelectorAll('.modal');
    const modalFormOrder = document.querySelector('#form-order');
    const modalThankYou = document.querySelector('#thank-you');

    //анимация формы
    const FORM_ANIMATION_MS = 500
    let isLocked = false; //для запрещения кликать пока идет анимация
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    const clickBlocker = () => {
      return new Promise((resolve) => {
        if (isLocked) {
          return;
        }
        else {
          isLocked = true;
          resolve();
        }
      });
    }

    const bodyLock = () => {
      document.body.classList.add('_lock');
      document.body.style.paddingRight = scrollbarWidth + "px";
    }
    const bodyUnlock = () => {
      document.body.classList.remove('_lock');
      document.body.style.paddingRight = '';
    }

    let lastFocusedElement = null; //чтобы возвращать фокус кнопкам, с помощью которых была вызвана модалка

    const openModal = (event) => {
      if (event.target.classList.contains('form__button') || event.target.classList.contains("request-form__button")) {
        const input = event.target.form.phone_number;

        if (input.value && !input.validity.patternMismatch) {
          clickBlocker().then(() => {
            bodyLock();
            event.preventDefault();

            //если кнопка из формы модалки, то не записывать его в lastFocusedElement
            if (!event.target.closest('.modal')) {
              lastFocusedElement = event.target;
            }

            if (modalFormOrder.classList.contains('active')) {
              modalFormOrder.classList.remove('active');
              modalFormOrder.tabIndex = '';

              setTimeout(() => {
                modalThankYou.classList.add('active');
                modalThankYou.tabIndex = '0';
                input.form.reset();
                isLocked = false;

                setTimeout(() => {
                  modalThankYou.focus();
                }, FORM_ANIMATION_MS)
              }, FORM_ANIMATION_MS);

            } else {
              modalThankYou.classList.add('active');
              modalThankYou.tabIndex = '0';
              input.form.reset();

              setTimeout(() => {
                isLocked = false;
                modalThankYou.focus();
              }, FORM_ANIMATION_MS);
            }
          });

        } else return;

      } else {
        clickBlocker().then(() => {
          bodyLock();
          event.preventDefault();
          modalFormOrder.classList.add('active');
          modalFormOrder.tabIndex = '0';

          lastFocusedElement = event.target;

          setTimeout(() => {
            modalFormOrder.focus();
            isLocked = false;
            modalFormOrder.querySelector('.form__input').focus();
          }, FORM_ANIMATION_MS);
        });
      }
    }

    const closeModal = event => {
      if (event.target.classList.contains('modal') || event.target.closest(".modal__close")) {
        clickBlocker().then(() => {
          const modal = event.target.closest(".modal");
          modal.classList.remove('active');
          modal.tabIndex = '';

          setTimeout(() => {
            bodyUnlock();
            isLocked = false;
            lastFocusedElement.focus();
          }, FORM_ANIMATION_MS);
        });
      }
    }

    headerOrder.addEventListener('click', openModal);
    saleButton.addEventListener('click', openModal);
    requestButton.addEventListener('click', openModal);
    formOrderButtons.forEach(btn => btn.addEventListener('click', openModal));

    modals.forEach(modal => modal.addEventListener('click', closeModal));
  }

  modalInit();
  disableBgsOnMobile();

  window.addEventListener('resize', disableBgsOnMobile);

  let isLoaded = false;
  window.addEventListener('scroll', () => {
    if (document.documentElement.scrollTop >= document.documentElement.clientHeight) {
      if (window.oldY > pageYOffset) {
        header.classList.remove('hide');
      } else {
        header.classList.add('hide');
      }
      window.oldY = pageYOffset;
    } else {
      header.classList.contains('hide') ? header.classList.remove("hide") : void 0;
    }

    if (!isLoaded) {
      if (pageYOffset >= 2400) {
        isLoaded = true;
        const script = document.createElement('script');
        script.src = "https://api-maps.yandex.ru/services/constructor/1.0/js/?um=constructor%3A74187c33f5f8c79e595b0316d1110f57e06e5b8205f517e5b89859963505883b&amp;width=100%&amp;height=320&amp;lang=ru_RU&amp;scroll=true";
        script.type = "text/javascript";
        map.append(script);
      }
    }
  });


  function testWebP(callback) {
    var webP = new Image();
    webP.onload = webP.onerror = function () {
      callback(webP.height == 2);
    };
    webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
  }

  testWebP(function (support) {

    if (support == true) {
      document.querySelector('body').classList.add('webp');
    } else {
      document.querySelector('body').classList.add('no-webp');
    }
  });
});

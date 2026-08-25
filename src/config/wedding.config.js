// Единая точка настройки шаблона.
// Покупатель шаблона правит только этот файл, чтобы персонализировать сайт.

export const weddingConfig = {
  couple: {
    groom: {
      name: { en: 'Abdylas', ru: 'Абдылас', kg: 'Абдылас' },
      initial: 'A',
    },
    bride: {
      name: { en: 'Ayana', ru: 'Аяна', kg: 'Аяна' },
      initial: 'A',
    },
    // Отдельно — «декоративное» написание, которое идёт в hero крупным рукописным шрифтом
    display: {
      en: 'Abdylas & Ayana',
      ru: 'Abdylas & Ayana',
      kg: 'Abdylas & Ayana',
    },
  },

  // ISO без таймзоны — трактуется как локальное время в браузере гостя
  date: '2026-09-25T17:00:00',

  venue: {
    name: {
      en: 'Banquet Hall “EGO”',
      ru: 'Банкетный холл «EGO»',
      kg: 'Банкетный холл «EGO»',
    },
    address: {
      en: 'Bishkek, Aaly Tokombaeva str. 43',
      ru: 'Бишкек, ул. Аалы Токомбаева, 43',
      kg: 'Бишкек шаары, Аалы Токомбаева көчөсү 43',
    },
    coords: { lat: 42.827267, lng: 74.609416 },
    mapCenter: { lat: 42.827267, lng: 74.609416, zoom: 16 },
    externalMapUrl:
      'https://2gis.kg/bishkek/firm/70000001058831394?m=74.609416%2C42.827267%2F17.41',
    // Провайдер embed-карты: "osm" (без ключа, работает всегда), "yandex" (без ключа, СНГ)
    // или "google" (требует API-ключ в googleApiKey ниже)
    mapProvider: 'osm',
    googleApiKey: '',
  },

  // Родители-хозяева торжества («той ээлери»)
  parents: {
    groom: {
      en: 'Sultan & Cholpon',
      ru: 'Султан & Чолпон',
      kg: 'Султан & Чолпон',
    },
    bride: null,
  },

  // Приветственный блок (Present)
  greeting: {
    title: {
      en: 'Dear guests!',
      ru: 'Дорогие гости!',
      kg: 'Урматтуу коноктор!',
    },
    intro: {
      en: 'Our children',
      ru: 'Наши дети',
      kg: 'Сиздердин балдарыбыз',
    },
    body: {
      en: 'invite you to share our special day — the wedding celebration — and honor our table with your blessing.',
      ru: 'приглашают вас разделить с нами особенный день — свадебное торжество — и почтить наш стол своим благословением.',
      kg: 'үйлөнүү үлпөт тоюна арналган салтанатка келип, кадырлуу коногубуз болуп, дасторкон үстүндө ак батаңызды берип кетүүгө чакырабыз!',
    },
  },

  // Стих/пожелание внизу секции календаря
  poem: {
    en: "Pure wishes, noble goal on our way — we've decided to build a family. Hand in hand into a lifetime together. Come and join our sacred wedding day!",
    ru: 'С чистыми мечтами и благородной целью мы решили создать семью. Рука об руку — на всю жизнь вместе. Приходите на наш священный праздник!',
    kg: 'Аруу тилек, асыл максат жолубузда, Баш кошуп, турмуш куруу оюбузда. Өмүргө бирге аттандык кол кармашып, Келиңиздер ак никелүү тоюбузга!',
  },

  // Расписание дня (Timeline). Время в формате HH:mm.
  timeline: [
    {
      time: '17:00',
      title: {
        en: 'Guests welcome',
        ru: 'Встреча гостей',
        kg: 'Конокторду тосуу',
      },
    },
    {
      time: '18:00',
      title: {
        en: 'Ceremony',
        ru: 'Церемония',
        kg: 'Нике кыюу',
      },
    },
    {
      time: '19:00',
      title: {
        en: 'Banquet',
        ru: 'Банкет',
        kg: 'Дасторкон',
      },
    },
    {
      time: '21:00',
      title: {
        en: 'First dance',
        ru: 'Первый танец',
        kg: 'Биринчи бий',
      },
    },
    {
      time: '00:00',
      title: {
        en: 'After-party',
        ru: 'После-вечеринка',
        kg: 'Кечки бий',
      },
    },
  ],

  rsvp: {
    // Приоритет отправки: Telegram (если настроен) → Formspree → демо-режим.
    //
    // Telegram: ОДИН бот переиспользуется на всех сайтах-приглашениях,
    // для каждой свадьбы создаётся отдельная группа:
    //   1) Бот создаётся один раз через @BotFather → botToken (одинаковый на всех сайтах).
    //   2) Для новой свадьбы: создать группу и добавить в неё бота.
    //   3) Узнать chatId группы: открыть
    //      https://api.telegram.org/bot<botToken>/getUpdates
    //      и найти "chat":{"id":-100...} (у групп id отрицательный).
    //      Если ответ пустой — написать в группу сообщение с упоминанием
    //      @имя_бота и обновить страницу getUpdates.
    telegram: {
      botToken: '8824376739:AAFnNF7BTzaX10lBPrsEMZ0kAZllnStFxm4',
      chatId: '-1004341630358', // группа «Свадьба Абдылас & Аяна»
    },
    // Запасной вариант: https://formspree.io -> New form -> ID из endpoint
    formspreeId: 'YOUR_FORMSPREE_ID',
  },

  audio: {
    src: '/audio/mus.mp3',
  },

  // Фотогалерея (карусель с фото пары) в секции календаря. false — блок скрыт.
  gallery: {
    enabled: false,
  },

  defaultLocale: 'kg',
  availableLocales: ['kg', 'ru', 'en'],
};

// Единая точка настройки шаблона.
// Покупатель шаблона правит только этот файл, чтобы персонализировать сайт.

export const weddingConfig = {
  couple: {
    groom: {
      name: { en: 'Tariel', ru: 'Тариел', kg: 'Тариел' },
      initial: 'T',
    },
    bride: {
      name: { en: 'Tattybubu', ru: 'Таттыбубу', kg: 'Таттыбубу' },
      initial: 'T',
    },
    // Отдельно — «декоративное» написание, которое идёт в hero крупным рукописным шрифтом
    display: {
      en: 'Tariel & Tattybubu',
      ru: 'Тариел & Таттыбубу',
      kg: 'Tariel & Tattybubu',
    },
  },

  // ISO без таймзоны — трактуется как локальное время в браузере гостя
  date: '2026-10-12T16:00:00',

  venue: {
    name: {
      en: 'Restaurant AYAR',
      ru: 'Ресторан «AYAR»',
      kg: 'Ресторан «AYAR»',
    },
    address: {
      en: 'Bishkek, Frunze str. 133',
      ru: 'Бишкек, ул. Фрунзе 133',
      kg: 'Бишкек шаары, Фрунзе көчөсү 133',
    },
    coords: { lat: 42.87586, lng: 74.500521 },
    mapCenter: { lat: 42.875671, lng: 74.500478, zoom: 16 },
    externalMapUrl:
      'https://2gis.kg/bishkek/firm/70000001090743355/74.500521,42.87586?m=74.500478,42.875671/16',
    // Провайдер embed-карты: "osm" (без ключа, работает всегда), "yandex" (без ключа, СНГ)
    // или "google" (требует API-ключ в googleApiKey ниже)
    mapProvider: 'osm',
    googleApiKey: '',
  },

  // Родители-хозяева торжества («той ээлери»)
  parents: {
    groom: {
      en: 'Kaldarbek & Aigul',
      ru: 'Калдарбек & Айгүл',
      kg: 'Калдарбек & Айгүл',
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
      time: '15:00',
      title: {
        en: 'Guests welcome',
        ru: 'Встреча гостей',
        kg: 'Конокторду тосуу',
      },
    },
    {
      time: '16:00',
      title: {
        en: 'Ceremony',
        ru: 'Церемония',
        kg: 'Нике кыюу',
      },
    },
    {
      time: '17:00',
      title: {
        en: 'Banquet',
        ru: 'Банкет',
        kg: 'Дасторкон',
      },
    },
    {
      time: '19:00',
      title: {
        en: 'First dance',
        ru: 'Первый танец',
        kg: 'Биринчи бий',
      },
    },
    {
      time: '22:00',
      title: {
        en: 'After-party',
        ru: 'После-вечеринка',
        kg: 'Кечки бий',
      },
    },
  ],

  rsvp: {
    // Замените на свой Formspree ID: https://formspree.io -> New form -> копируем ID из endpoint xxxx/xxxxxxx
    formspreeId: 'YOUR_FORMSPREE_ID',
  },

  audio: {
    src: '/audio/mus.mp3',
  },

  defaultLocale: 'kg',
  availableLocales: ['kg', 'ru', 'en'],
};

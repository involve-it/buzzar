/**
 * Created by douson on 13.07.15.
 */

var ru;

ru = {
  //Global
  APP_NAME: 'Светлячки',
  CONTENT_READ_MORE_TITLE: 'Подробнее',
  CONTACT_US:'Свяжитесь с нами',
  CONTACT_SEND_MESSAGE: 'Отправить сообщение',
  YES: 'Да',
  NO: 'Нет',
  COMMENTS:'Комментарии',
  RATING: 'Рейтинг',
  REVIEW_HELP_TEXT: 'Оставьте свой комменрарий здесь',
  CHOOSE_RATING: 'Выберите рейтинг',
  SUBMIT: 'Отправить',

  //Buttons
  BUTTON_CHECK: 'Проверить',

  //Menu
  MENU_HOME_PAGE: 'Главная',
  MENU_ABOUT_US: 'О нас',
  MENU_CONTACTS: 'Контакты',
  MENU_OR_SPLIT: 'или',
  MENU_MAP: 'Карта',
  MENU_MAIN_PAGES_TITLE: 'Основные страницы',
  MENU_HASHES_TITLE: 'Хэштеги',
  MENU_MY_POSTS: 'Посты',
  MENU_MY_PROFILE: 'Профайл',
  MENU_MY_MESSAGES: 'Сообщения',
  MENU_BUTTON_NEW_POST: 'Создать',
  MENU_SIGN_IN: 'Вход',
  MENU_SIGN_OUT: 'Выход',
  MENU_SIGN_UP: 'Регистрация',
    
  getAllUsers:         'Все пользователи системы',
  getContactUsers:     'Найденные контакты',
  status:              'Статус',
  active:              'Активные',
  inactive:            'Завершенные',
  SEEN_TODAY: 'Сегодня',
  SEEN_ALL: 'Всего',
  SEEN_TOTAL: 'Итого',
  left:                'Осталось',
  POST_STATUS: 'Объявление закрыто',
  
  //home:
  //headliner:           'Мгновенные объявления, привязанные к месту',
  //headliner:           'Виртуальные данные, привязанные к месту',
  headliner:           'Вокруг тебя',
  SEARCH_DISTANCE_TITLE: 'Расстояние',
  SEARCH_DISTANCE_MILE: '1 миля',
  SEARCH_DISTANCE_MILES_5: '5 миль',
  SEARCH_DISTANCE_MILES_20: '20 миль',
  SEARCH_DISTANCE_FT_200: '200 футов',
  SEARCH_DISTANCE_EVERYWHERE: 'Везде',
  MOST_POPULAR_TITLE: 'Популярные',
  ABOUT_US_TITLE: 'О нас',

  AROUND_YOU_TITLE: 'Срочное рядом',
  LOOKING_FOR_TEXT: 'Искать ЧТО, ГДЕ, КОГДА',

  //Location
  LOCATION_SET_YOUR_LOCATION: 'Настройка метоположения',
  LOCATION_YOUR_MOST_RECENT_LOCATIONS: 'Ваши последние места: ',
  LOCATION_BUTTON_SET_LOCATION: 'Установить',
  LOCATION_MY_CURRENT_LOCATION: 'Определить текущее местоположение',
  MY_LOCATION_TEXT: 'Мое Положение',

  //New post
  NEW_POST_NEWTYPE_BEACON_TITLE: 'Выберите подходящий маячок',
  NEW_POST_IMPORT_FROM_WEB: 'Взять из интернета',
  NEW_POST_IMPORT_FROM_WEB_OPTIONAL: 'необязательно',
  NEW_POST_IMPORT_FROM_WEB_URL_PLACEHOLDER: 'Url адрес объявления в интернете',
  NEW_POST_IMPORT_FROM_WEB_URL_PLACEHOLDER_TOOLTIP_TEXT: 'Добавьте адрес вашего объявления с другого ресурса, чтобы не заполнять информацию снова. Мы это сделаем за вас.',
  NEW_POST_ADD_PHOTO_BTN: '+ Добавить Фото',
  NEW_POST_CHARACTERS_LEFT: 'символов осталось',
  NEW_POST_CREATE_NEW_POST: 'Новое объявление',
  NEW_POST_WHAT: 'Что',
  NEW_POST_MAIN_INFORMATION_MUTED: 'Информация из этой секции будет использоваться при поиске вашего объявления. Пожалуйста, указывайте точные сведения, чтобы найти подходящий вариант.',
  NEW_POST_WHERE: 'Где',
  NEW_POST_WHEN: 'Когда',
  NEW_POST_DURATION: 'Продолжительность',
  NEW_POST_DURATION_MUTED: 'Установите время, в течении которого ваше объявление будет активным.',
  NEW_POST_LOCATION_MUTED: 'Выберите надстройку для вашего объявления. С помощью этих данных пользователям Buzzar найдут объявления в подходящем для них месте.',
  NEW_POST_GALLERY_PHOTOS: 'Фотографии',
  NEW_POST_GALLERY_PHOTOS_MUTED: 'Добавьте фотографии для объявления. Вы всегда можете вернуться к сохраненному объявлению и добавить новые фотографии.',
  NEW_POST_TITLE: 'Название объявления',
  NEW_POST_TITLE_PLACEHOLDER: 'Название должно быть конкретным.',
  NEW_POST_TITLE_TOOLTIP_TEXT: 'Встречают по одежке. Уделите названию должное внимание, чтобы привлечь клиента.',
  NEW_POST_DESCRIPTION: 'Описание',
  NEW_POST_DESCRIPTION_PLACEHOLDER: 'Расскажите немного о вашем объявлении.',
  NEW_POST_DESCRIPTION_PLACEHOLDER_TOOLTIP_TEXT: 'Описание создает представление о вашем объявлении. Опишите, что вы считаете самым главным.',
  NEW_POST_SELECT_TYPE: 'Тип объявления',
  NEW_POST_DESCRIBE: 'Характер объявления',
  NEW_POST_DESCRIBE_LOST_MY_PET: 'Потерялся питомец',
  NEW_POST_DESCRIBE_LOST_MY_PET_TOOLTIP_TEXT: 'Если вдруг вы потеряли домашнего любимца, выберите это значение.',
  NEW_POST_DESCRIBE_NEED_MONEY_FOR_FOOD: 'Нужны деньги на еду',
  NEW_POST_DESCRIBE_NEED_MONEY_FOR_FOOD_TOOLTIP_TEXT: 'Нет денег на продукты? Выберите этот пункт, чтобы обратиться за помощью к добрым людям.',
  NEW_POST_DESCRIBE_EMERGENCY_SITUATION: 'Чрезвычайная ситуация',
  NEW_POST_DESCRIBE_EMERGENCY_SITUATION_TOOLTIP_TEXT: 'Мы сожалеем, что это случилось. Опишите свою проблемы и выберите этот пункт, чтобы отметить это объявление как важное.',
  NEW_POST_DESCRIBE_OTHER: 'Другое',
  NEW_POST_DESCRIBE_OTHER_TOOLTIP_TEXT: 'Не нашли подходящий для вас тип объявления? Тогда этот пункт для вас.',
  NEW_POST_PRICE: 'Цена',
  NEW_POST_I_AM_LOOKING_FOR: 'Я ищу',
  NEW_POST_I_AM_LOOKING_FOR_ARTISTS: 'Артистов или просто креатвных людей',
  NEW_POST_I_AM_LOOKING_FOR_FRIENDSHIP: 'Дружба и общение',
  NEW_POST_I_AM_LOOKING_FOR_SPORT_ACTIVITIES: 'Занятия спортом',
  NEW_POST_I_AM_LOOKING_FOR_PROFESSIONALS: 'Профессионалов своего дела',
  NEW_POST_I_AM_LOOKING_FOR_OTHER: 'Другое',
  NEW_POST_POSITION: 'Должность',
  NEW_POST_LOOKING_FOR: 'Ищу',
  NEW_POST_ROOMMATES: 'Соседей по комнате',
  NEW_POST_RENTING: 'Снять',
  NEW_POST_RENTING_OUT: 'Сдать в аренду',
  NEW_POST_BUYING_A_HOUSE: 'Купить дом',
  NEW_POST_SELLING_A_HOUSE: 'Продать дома',
  NEW_POST_INCOGNITO_MODE: 'Режим инкогнито',
  NEW_POST_HASHES: 'Хэштеги',
  NEW_POST_CREATE_BTN: 'Установить Светлячок',
  NEW_POST_SET_LOCATION_BTN: 'Выберите Местоположение',
  //New Memo
  NEW_MEMO_CREATE_NEW_MEMO: 'Новое напоминание',
  NEW_MEMO_TITLE_TOOLTIP_TEXT: 'Добавьте название для вашего напоминания.',
  NEW_MEMO_DESCRIPTION_PLACEHOLDER_TOOLTIP_TEXT: 'Точное описание поможет сориентироваться в списке созданных напоминаний.',
  NEW_MEMO_WHAT_MUTED: 'Информация из этой секции содержит сведения, которые будут испольоваться для отображения и поиска вашего напоминания. Пожалуйста, указывайте точные сведения, для корректного поиска.',
  NEW_MEMO_WHERE_MUTED: 'С помощью настроек определите, в каком месте ваше напоминание станет активным.',
  NEW_MEMO_CHOOSE_TIME_LIMIT: 'Выберите срок действия напоминания',

  
  //Post details
  POST_DETAILS_REVIEWS_FIRST: 'Вы будете первый',
  POST_DETAILS_VIEWS: 'Просмотров',
  POST_DETAILS_TODAY: 'Сегодня',
  POST_DETAILS_STATUS: 'Статус',
  POST_DETAILS_DISTANCE: 'Дистанция',
  POST_DETAILS_ALL: 'Всего',
  POST_DETAILS_LIKES: 'Нравится',
  POST_DETAILS_TYPE: 'Тип',
  POST_DETAILS_PRICE: 'Цена',
  POST_DETAILS_LIKE: 'Нравится',
  POST_DETAILS_LEFT: 'Осталось',
  POST_DETAILS_DYNAMIC:'Динамический',
  POST_DETAILS_STATIC:'Статический',
  POST_DETAILS_VIEW_MAP:'Показать на карте',
  POST_DETAILS_DETAILS: 'Детали',
  
  //Profile
  PROFILE_USER_DETAILS :'Профиль пользователя',
  PROFILE_PERSONAL_SETTINGS :'Личные настройки',
  PROFILE_EDIT_PROFILE: 'Редактировать',
  PROFILE_ADDITIONAL_LINKS: 'Внешние ссылки',
  PROFILE_FACEBOOK_URL: 'Facebook',
  PROFILE_USER_LANGUAGE: 'Язык',
  PROFILE_USER_PHONE: 'Телефон',
  PROFILE_USER_SKYPE: 'Skype',
  PROFILE_USER_STATUS: 'Статус',
  PROFILE_PROFILE_URL: 'URL профиля',

  //Profile - edit
  PROFILE_EDIT_USER_AVATAR: 'Настройки аватара',
  PROFILE_EDIT_PERSONAL_SETTINGS: 'Редактирование личных настроек',
  PROFILE_SAVE_AND_UPDATE: 'Сохранить',
  PROFILE_USERNAME: 'Имя пользователя',
  PROFILE_USER_FIRST_NAME: 'Имя',
  PROFILE_USER_LAST_NAME: 'Фамилия',
  PROFILE_USER_PHONE_NUMBER: 'Номер телефона',
  PROFILE_USER_SKYPE_LOGIN : 'Логин Skype',
  PROFILE_USER_SECURITY_SETTINGS : 'Настройки безопасности',

  //Error
  ERROR_INVALID_FIELD: 'Это поле обязательно для заполнения'
  
};

T9n.map('ru', ru);
bz.help.makeNamespace('bz.language.i18n.ru', ru);
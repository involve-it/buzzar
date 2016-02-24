/**
 * Created by douson on 13.07.15.
 */

var ru;

ru = {
  //Global
  ADD: 'Добавить',
  APP_NAME: 'Светлячки',
  CONTENT_READ_MORE_TITLE: 'Подробнее',
  CONTACT_US:'Свяжитесь с нами',
  SEND_MESSAGE: 'Отправить сообщение',
  YES: 'Да',
  NO: 'Нет',
  COMMENTS:'Комментарии',
  RATING: 'Рейтинг',
  REVIEW_HELP_TEXT: 'Оставьте свой комментарий здесь',
  CHOOSE_RATING: 'Выберите рейтинг',
  SUBMIT: 'Отправить',
  CANCEL: 'Отмена',
  OR:'ИЛИ',
  READ_MORE:'Подробнее',
  NEW_POST: 'Новый пост',
  CREATE_POST: 'Создать пост',

  //No posts around
  NO_ITEMS_AROUND_YOU: 'У вас нету постов рядом',
  YOU_CAN_CREATE_POST: 'Вы могли бы добавить объявление, чтобы другие пользователи могли им воспользоваться. Для этого нажмите на кнопку ниже',

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
  MENU_MY_POSTS: 'Мои Посты',
  MENU_MY_PROFILE: 'Профайл',
  MENU_MY_MESSAGES: 'Сообщения',
  MENU_BUTTON_NEW_POST: 'Создать',
  MENU_SIGN_IN: 'Вход',
  MENU_SIGN_OUT: 'Выход',
  MENU_SIGN_UP: 'Регистрация',
  MENU_SIGNED_IN_AS: 'Вы вошли как ',

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
  
  headliner:           'Вокруг тебя',
  siteTitleElement: 'instant post, bound to location',

  SEARCH_DISTANCE_TITLE: 'Расстояние',
  SEARCH_DISTANCE_MILE: '1 миля',
  SEARCH_DISTANCE_MILES_5: '5 миль',
  SEARCH_DISTANCE_MILES_20: '20 миль',
  SEARCH_DISTANCE_FT_200: '200 футов',
  SEARCH_DISTANCE_EVERYWHERE: 'Везде',
  SEARCH_LOOKING_FOR_TEXT: 'Искать ЧТО, ГДЕ, КОГДА',

  MOST_POPULAR_TITLE: 'Популярные',
  ABOUT_US_TITLE: 'О нас',

  AROUND_YOU_TITLE: 'Срочное рядом',

  //Location
  LOCATION_SET_YOUR_LOCATION: 'Настройка метоположения',
  LOCATION_YOUR_MOST_RECENT_LOCATIONS: 'Ваши последние места: ',
  LOCATION_BUTTON_SET_LOCATION: 'Установить',
  LOCATION_MY_CURRENT_LOCATION: 'Определить текущее местоположение',
  MY_LOCATION_TEXT: 'Мое Положение',

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
  PROFILE_USER_DETAILS_POSTS: 'Публикации',
  PROFILE_USER_VK: 'Вконтакте',
  PROFILE_USER_FACEBOOK: 'Facebook',
  PROFILE_USER_TWITTER: 'Twitter',
  PROFILE_USER_TOWN: 'Город',
  PROFILE_CANCEL: 'Отмена',

  //Another user profile details
  PROFILE_ANOTHER_USER_DETAILS_PERSONAL_DATA: 'Личные данные',


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

  //Image select
  IMAGE_SELECT_UPLOAD_PHOTO: 'Загрузить фото',
  IMAGE_SELECT_IMAGE_FROM_URL: 'Указать URL картинки',
  IMAGE_SELECT_RANDOM_IMAGE: 'Случайное изображение',
  IMAGE_SELECT_MY_IMAGES: 'Мои картинки',
  IMAGE_SELECT_TAKE_PHOTO:'Сделать фото',
  IMAGE_SELECT_IMAGE_URL:'URL изображения',
  IMAGE_SELECT_CHECK_IMAGE:'Проверить картинку',
  IMAGE_SELECT_PASTE_FROM_CLIPBOARD:'Вставить из буфера обмена',
  IMAGE_SELECT_DONE: 'Применить',
  IMAGE_SELECT_UPLOAD_NEW_PROFILE_IMAGE: 'Загрузить новый профиль изображения',
  IMAGE_SELECT_CHOOSE_IMAGE: 'Выбрать картинку',

  //Error
  ERROR_INVALID_FIELD: 'Это поле обязательно для заполнения',
  ERROR_INVALID_INTEGER_PATTERN: 'Это поле обязательно и только цифры',

  COMMON_IMAGE_GET_RANDOM: 'Загрузить случайное фото'
  
};

T9n.map('ru', ru);
bz.help.makeNamespace('bz.language.i18n.ru', ru);
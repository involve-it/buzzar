/**
 * Created by douson on 13.07.15.
 */

var en;

en = {
  //Global
  APP_NAME: 'Buzzar',
  CONTENT_READ_MORE_TITLE: 'Read more...',
  CONTACT_US:'Contact us',
  CONTACT_SEND_MESSAGE: 'Send message',
  YES: 'Yes',
  NO: 'No',
  
  //Buttons
  BUTTON_CHECK: 'Check',
  
  //Menu
  MENU_HOME_PAGE: 'Home',
  MENU_ABOUT_US: 'About us',
  MENU_CONTACTS: 'Contacts',
  MENU_OR_SPLIT: 'or',
  MENU_MAP: 'Map',
  MENU_MAIN_PAGES_TITLE: 'Main pages',
  MENU_HASHES_TITLE: 'Hashes',
  MENU_MY_POSTS: 'My posts',
  MENU_MY_PROFILE: 'My profile',
  MENU_MY_MESSAGES: 'Messages',
  MENU_BUTTON_NEW_POST: 'Create',
  MENU_SIGN_IN: 'Sign in',
  MENU_SIGN_OUT: 'Sign out',
  MENU_SIGN_UP: 'Sign up',
  
  getAllUsers: 'Get all system users',
  getContactUsers: 'Contacts found',
  status: 'Status',
  active: 'Active',
  inactive: 'Inactive',
  views: 'Views',
  left: 'Left',
  
  //sitewise:
  siteTitleElement: 'instant post, bound to location',
  
  // home page:
  headliner: 'instant post, bound to location',
  SEARCH_DISTANCE_TITLE: 'Distance',
  SEARCH_DISTANCE_MILE: '1 ml',
  SEARCH_DISTANCE_MILES_5: '5 ml',
  SEARCH_DISTANCE_MILES_20: '20 ml',
  SEARCH_DISTANCE_FT_200: '200 ft',
  SEARCH_DISTANCE_EVERYWHERE: 'Everywhere',
  MOST_POPULAR_TITLE: 'Most Popular',
  ABOUT_US_TITLE: 'About us',
  
  //Location
  LOCATION_SET_YOUR_LOCATION: 'Set your location',
  LOCATION_YOUR_MOST_RECENT_LOCATIONS: 'Your most recent locations: ',
  LOCATION_BUTTON_SET_LOCATION: 'Set',
  LOCATION_MY_CURRENT_LOCATION: 'My current location',

  //New post
  NEW_POST_IMPORT_FROM_WEB: 'Import from Web',
  NEW_POST_IMPORT_FROM_WEB_OPTIONAL: 'optional',
  NEW_POST_IMPORT_FROM_WEB_URL_PLACEHOLDER: 'Original Post Url',
  NEW_POST_IMPORT_FROM_WEB_URL_PLACEHOLDER_TOOLTIP_TEXT: 'Добавьте адрес вашего объявления с другого ресурса, чтобы не заполнять информацию снова. Мы это сделаем за вас.',
  NEW_POST_ADD_PHOTO_BTN: '+ Add Photo',
  NEW_POST_CHARACTERS_LEFT: 'character(s) left',
  NEW_POST_CREATE_NEW_POST: 'Create new Ad',
  NEW_POST_WHAT: 'What',
  NEW_POST_MAIN_INFORMATION_MUTED: 'Информация из этой секции будет использоваться при поиске вашего объявления. Пожалуйста, указывайте точные сведения, чтобы найти подходящий вариант.',
  NEW_POST_WHERE: 'Where',
  NEW_POST_WHEN: 'When',
  NEW_POST_LOCATION_MUTED: 'Выберите надстройку для вашего объявления. С помощью этих данных пользователям Buzzar найдут объявления в подходящем для них месте.',
  NEW_POST_GALLERY_PHOTOS: 'Photos',
  NEW_POST_GALLERY_PHOTOS_MUTED: 'Please add photos for the post.',
  NEW_POST_TITLE: 'Title',
  NEW_POST_TITLE_PLACEHOLDER: 'The title should be clear and descriptive.',
  NEW_POST_TITLE_TOOLTIP_TEXT: 'Встречают по одежке. Уделите названию должное внимание, чтобы привлечь клиента.',
  NEW_POST_DESCRIPTION: 'Description',
  NEW_POST_DESCRIPTION_PLACEHOLDER: 'Tell us a little about your Ad.',
  NEW_POST_DESCRIPTION_PLACEHOLDER_TOOLTIP_TEXT: 'Описание создает представление о вашем объявлении. Опишите, что вы считаете самым главным.',
  NEW_POST_SELECT_TYPE: 'Type Ad',
  NEW_POST_DESCRIBE: 'Describe',
  NEW_POST_DESCRIBE_LOST_MY_PET: 'Lost my pet',
  NEW_POST_DESCRIBE_LOST_MY_PET_TOOLTIP_TEXT: 'Если вдруг вы потеряли домашнего любимца, выберите это значение.',
  NEW_POST_DESCRIBE_NEED_MONEY_FOR_FOOD: 'Need money for food',
  NEW_POST_DESCRIBE_NEED_MONEY_FOR_FOOD_TOOLTIP_TEXT: 'Нет денег на продукты? Выберите этот пункт, чтобы обратиться за помощью к добрым людям.',
  NEW_POST_DESCRIBE_EMERGENCY_SITUATION: 'Emergency situation',
  NEW_POST_DESCRIBE_EMERGENCY_SITUATION_TOOLTIP_TEXT: 'Мы сожалеем, что это случилось. Опишите свою проблемы и выберите этот пункт, чтобы отметить это объявление как важное.',
  NEW_POST_DESCRIBE_OTHER: 'Other',
  NEW_POST_DESCRIBE_OTHER_TOOLTIP_TEXT: 'Не нашли подходящий для вас тип объявления? Тогда этот пункт для вас.',
  NEW_POST_PRICE: 'Цена',
  NEW_POST_I_AM_LOOKING_FOR: 'I am looking for',
  NEW_POST_I_AM_LOOKING_FOR_ARTISTS: 'Artists and other creative people',
  NEW_POST_I_AM_LOOKING_FOR_FRIENDSHIP: 'Friendship',
  NEW_POST_I_AM_LOOKING_FOR_SPORT_ACTIVITIES: 'Sport activities',
  NEW_POST_I_AM_LOOKING_FOR_PROFESSIONALS: 'Professionals',
  NEW_POST_I_AM_LOOKING_FOR_OTHER: 'Other',
  NEW_POST_POSITION: 'Position',
  NEW_POST_LOOKING_FOR: 'Looking for',
  NEW_POST_ROOMMATES: 'Roommates',
  NEW_POST_RENTING: 'Renting',
  NEW_POST_RENTING_OUT: 'Renting out',
  NEW_POST_BUYING_A_HOUSE: 'Buying a house',
  NEW_POST_SELLING_A_HOUSE: 'Selling a house',
  NEW_POST_INCOGNITO_MODE: 'Incognito mode',
  NEW_POST_HASHES: 'Hashes',
  
  //New Memo
  NEW_MEMO_CREATE_NEW_MEMO: 'Create new Memo',
  NEW_MEMO_TITLE_TOOLTIP_TEXT: 'Добавьте название для вашего напоминания.',
  NEW_MEMO_DESCRIPTION_PLACEHOLDER_TOOLTIP_TEXT: 'Точное описание поможет сориентироваться в списке созданных напоминаний.',
  NEW_MEMO_WHAT_MUTED: 'Информация из этой секции содержит сведения, которые будут испольоваться для отображения и поиска вашего напоминания. Пожалуйста, указывайте точные сведения, для корректного поиска.',
  NEW_MEMO_WHERE_MUTED: 'С помощью настроек определите, в каком месте ваше напоминание станет активным.',
  
  //Profile
  PROFILE_USER_DETAILS :'User profile details',
  PROFILE_PERSONAL_SETTINGS :'Your personal settings',
  PROFILE_EDIT_PROFILE: 'Edit your profile',
  PROFILE_ADDITIONAL_LINKS: 'Your external link',
  PROFILE_FACEBOOK_URL: 'Facebook',
  PROFILE_USER_LANGUAGE: 'Language',
  PROFILE_USER_PHONE: 'Phone',
  PROFILE_USER_SKYPE: 'Skype',
  PROFILE_USER_STATUS: 'Status',
  PROFILE_PROFILE_URL: 'Profile URL',

  //Profile - edit
  PROFILE_EDIT_USER_AVATAR: 'Edit user avatar',
  PROFILE_EDIT_PERSONAL_SETTINGS: 'Edit your personal settings',
  PROFILE_SAVE_AND_UPDATE: 'Save',
  PROFILE_USERNAME: 'Username',
  PROFILE_USER_FIRST_NAME: 'First name',
  PROFILE_USER_LAST_NAME: 'Last name',
  PROFILE_USER_PHONE_NUMBER: 'Phone number',
  PROFILE_USER_SKYPE_LOGIN: 'Skype username',
  PROFILE_USER_SECURITY_SETTINGS: 'Security settings',
  
  //Error
  ERROR_INVALID_FIELD: 'This field is required'
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
};

T9n.map('en', en);
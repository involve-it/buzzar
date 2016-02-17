/**
 * Created by douson on 13.07.15.
 */

var en;

en = {
  //Global
  APP_NAME: 'Shiners',
  CONTENT_READ_MORE_TITLE: 'Read more...',
  CONTACT_US:'Contact us',
  SEND_MESSAGE: 'Send message',
  YES: 'Yes',
  NO: 'No',
  COMMENTS:'Comments',
  RATING: 'Rating',
  REVIEW_HELP_TEXT: 'Put your review here',
  CHOOSE_RATING: 'Choose rating',
  SUBMIT: 'Submit',
  CANCEL: 'Cancel',
  OR:'OR',
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
  MENU_MY_POSTS: 'My Posts',
  MENU_MY_PROFILE: 'Profile',
  MENU_MY_MESSAGES: 'Messages',
  MENU_BUTTON_NEW_POST: 'Create',
  MENU_SIGN_IN: 'Sign in',
  MENU_SIGN_OUT: 'Sign out',
  MENU_SIGN_UP: 'Sign up',
  MENU_SIGNED_IN_AS: 'Signed in as ',
  
  getAllUsers: 'Get all system users',
  getContactUsers: 'Contacts found',
  status: 'Status',
  active: 'Active',
  inactive: 'Inactive',
  SEEN_TODAY: 'Today',
  SEEN_ALL: 'All',
  SEEN_TOTAL: 'Total',
  left: 'Left',
  POST_STATUS: 'Post close',
  
  //sitewise:
  siteTitleElement: 'instant post, bound to location',

  // search:
  SEARCH_DISTANCE_TITLE: 'Distance',
  SEARCH_DISTANCE_MILE: '1 ml',
  SEARCH_DISTANCE_MILES_5: '5 ml',
  SEARCH_DISTANCE_MILES_20: '20 ml',
  SEARCH_DISTANCE_FT_200: '200 ft',
  SEARCH_DISTANCE_EVERYWHERE: 'Everywhere',
  SEARCH_LOOKING_FOR_TEXT: 'Your WHAT or WHERE or WHEN you\'re looking for',

  // home page:
  headliner: 'instant post, bound to location',
  MOST_POPULAR_TITLE: 'Most Popular',
  ABOUT_US_TITLE: 'About us',
  AROUND_YOU_TITLE: 'Buzz Around you',

  //Location
  LOCATION_SET_YOUR_LOCATION: 'Set your location',
  LOCATION_YOUR_MOST_RECENT_LOCATIONS: 'Your most recent locations: ',
  LOCATION_BUTTON_SET_LOCATION: 'Set',
  LOCATION_MY_CURRENT_LOCATION: 'My current location',
  MY_LOCATION_TEXT: 'My Location',

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
  PROFILE_USER_DETAILS_POSTS: 'Posts',
  PROFILE_USER_VK: 'Vkontakte',
  PROFILE_USER_FACEBOOK: 'Facebook',
  PROFILE_USER_TWITTER: 'Twitter',
  PROFILE_USER_TOWN: 'Town',
  PROFILE_CANCEL: 'Cancel',

  //Another user profile details
  PROFILE_ANOTHER_USER_DETAILS_PERSONAL_DATA: 'Personal data',
  PROFILE_ANOTHER_USER_ADDITIONAL_LINKS: 'External link',

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

  //Image select
  IMAGE_SELECT_UPLOAD_PHOTO: 'Upload Photo',
  IMAGE_SELECT_IMAGE_FROM_URL: 'Image from Url',
  IMAGE_SELECT_RANDOM_IMAGE: 'Random Image',
  IMAGE_SELECT_MY_IMAGES: 'My Images',
  IMAGE_SELECT_TAKE_PHOTO:'Take Photo',
  IMAGE_SELECT_IMAGE_URL:'image url',
  IMAGE_SELECT_CHECK_IMAGE:'Check Image',
  IMAGE_SELECT_PASTE_FROM_CLIPBOARD:'Paste from clipboard',
  IMAGE_SELECT_DONE: 'Done',
  IMAGE_SELECT_UPLOAD_NEW_PROFILE_IMAGE: 'Upload New Profile Image with File Picker',
  IMAGE_SELECT_CHOOSE_IMAGE: 'Choose image',
  COMMON_IMAGE_GET_RANDOM: 'Get random image',

  //Error
  ERROR_INVALID_FIELD: 'This field is required',
  ERROR_INVALID_INTEGER_PATTERN: 'This field is required and must be an integer',

};
T9n.map('en', en);
bz.help.makeNamespace('bz.language.i18n.en', en);
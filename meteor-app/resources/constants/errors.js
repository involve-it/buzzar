/**
 * Created by xvolkx48 on 05.05.2016.
 */
bz.help.makeNamespace('bz.const.errors');
bz.const.errors={
  //for usersHandler
  users: {
    badProfileDetails: {errorId: 1},
    badEmail: {errorId: 2},
    badImageUrl: {errorId: 3}
  },
  //for postsHandler
  posts:{
    badRequestTypePost:{errorId: 4},
    badRequestPageNumber:{errorId: 5},
    badRequestPostData:{errorId: 6},
    foulLanguageInTitle:{errorId: 7},
    emptyTitle:{errorId:8},
    foulLanguageInDescription:{errorId: 9},
    emptyDescription:{errorId:10},
    emptyDetails:{errorId:11},
    emptyPostLocations:{errorId:12},
    emptyTimestamp:{errorId:13},
    emptyEndDatePost:{errorId:14},
    notSpecifiedIdPost:{errorId:16}
  },
  //for commentsHandler
  comments:{
    textWithFoulLanguage:{errorId: 18},
    emptyCommentText:{errorId: 19},
    commentedPostNotFound:{errorId:20}
  },
  //for imagesHandler
  images:{
    badImageUrl:{errorId:21}
  },
  //for messagesChatsHandler
  messagesChats:{
    lastMessageCountNotEqualChatsCount:{errorId: 22},
    noOtherUsers:{errorId:23},
    userNotMemberThisChat:{errorId:24},
    destinationUserNotFound:{errorId:25},
    emptyTextMessage:{errorId:26},
    foulLanguageInMessage:{errorId:27},
    chatNotFoundOrNotCreated:{errorId:28}
  },
  //for locationsHandler
  locations:{
    invalidPlaceType:{errorId:29},
    invalidName:{errorId:30},
    invalidCoords:{errorId:31}
  },
  //global errors
  global:{
    dataNotFound:{errorId: 404},
    notLogged:{errorId:996},
    userNotAuthor:{errorId: 997},
    errorWriteInDb:{errorId:998},
    internalError:{errorId:999}
  }
};
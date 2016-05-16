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
    foulLanguageInTittle:{errorId: 7},
    emptyTittle:{errorId:8},
    foulLanguageInDescription:{errorId: 9},
    emptyDescription:{errorId:10},
    emptyDetails:{errorId:11},
    emptyPostLocations:{errorId:12},
    emptyTimestamp:{errorId:13},
    emptyEndDatePost:{errorId:14}
  },
  //global errors
  global:{
    dataNotFound:{errorId: 404},
    internalError:{errorId:999}
  }
};
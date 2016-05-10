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

  },
  //global errors
  global:{
    dataNotFound:{errorId: 404},
    internalError:{errorId:999}
  }
};
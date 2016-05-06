/**
 * Created by xvolkx48 on 06.05.2016.
 */

bz.bus.postsHandler = {
  getPost: function (requestedPostId) {
    var post,
      postDb=bz.cols.posts.findOne({_id: requestedPostId})
    if (postDb){
      post={
        _id: postDb._id,
        type: postDb.type,
        details:{
          locations: postDb.details.locations,
          url: postDb.details.url,
          title: postDb.details.title,
          description: postDb.details.description,
          price: postDb.details.price,
          photos: postDb.details.photos,
          tags: postDb.details.tags
        },
        status: postDb.status,
        timestamp:postDb.timestamp,
        endDate:postDb.endDate,
        stats: {
          seenToday: postDb.stats.seenToday,
          seenTotal: postDb.stats.seenTotal
        },
        social:postDb.social
      };
      if (!postDb.details.anonymousPost) {
        post.user = bz.bus.usersHandler.getUser(postDb.userId, Meteor.userId());
      }
      post.comments=bz.bus.commentsHandler.getComments(postDb._id);
    }
    return post;
  }
};
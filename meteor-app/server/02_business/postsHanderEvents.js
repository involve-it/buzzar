bz.bus.postsHandlerEvents = {
    getAttending: function(userId, postId) {
        var res = false, post, user;
        if (!userId || !postId){
            res = false;
            throw new Meteor.Error(403, "Не указаны данные");

        } else {
            post = bz.cols.posts.findOne(postId);
            user = Meteor.users.findOne(userId);
            if (post && user && post.attendees) {
                res = (post.attendees.indexOf(userId) !== -1);

            }
        }
        return res;
    },
    setAttending: function(userId, postId) {
        var res = false, post, user;
        if (!userId || !postId){
            res = false;
        } else {
            post = bz.cols.posts.findOne(postId);
            user = Meteor.users.findOne(userId);
            if (post && user) {
                !post.attendees && (post.attendees = []);
                if (post.userId !== userId) {
                    post.attendees.push(userId);
                    bz.cols.posts.update(postId, {$set: { attendees: post.attendees}});
                    res = true;
                }
            }
        }
        return res;
    }
}
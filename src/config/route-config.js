module.exports = {
    init(app){
        const staticRoutes = require("../routes/static");
        const postRoutes = require('../routes/posts');
        const userRoutes = require('../routes/users');
        const commentRoutes = require('../routes/comments');
        const voteRoutes = require('../routes/votes');
        const favoriteRoutes = require('../routes/favorites');
        const topicRoutes = require('../routes/topics');
        const advertisementRoutes = require('../routes/advertisements');
        const flairRoutes = require('../routes/flairs');

        if(process.env.NODE_ENV === "test") {
            const mockAuth = require('../../spec/support/mock-auth.js');
            mockAuth.fakeIt(app);
        }
        
        app.use(staticRoutes);
        app.use(postRoutes);
        app.use(userRoutes);
        app.use(commentRoutes);
        app.use(voteRoutes);
        app.use(favoriteRoutes)
        app.use(topicRoutes);
        app.use(advertisementRoutes);
        app.use(flairRoutes);
    }
}
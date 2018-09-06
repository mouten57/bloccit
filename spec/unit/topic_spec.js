const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require('../../src/db/models').Topic;
const Post = require("../../src/db/models").Post;

describe('Topic', () => {

    beforeEach((done) => {

        this.topic;
        this.post;
        sequelize.sync({forc: true}).then((res) => {
            Topic.create({
                title: 'Expeditions to Alpha Centauri',
                description: 'A compilation of reports from recent visits to the star system.'
            })
            .then((topic) => {
                this.topic = topic;

                Post.create({
                    title: 'My first visit to Proxima Centauri b',
                    body: 'I saw some rocks.',

                    topicId: this.topic.id
                })
                .then((post) => {
                    this.post = post;
                    done();
                });
            })
            .catch((err) => {
                console.log(err);
                done();
            });
        });
        describe("#create()", () => {
            it("should create a topic object with a title and description", (done) => {
              Topic.create({
                title: "Expeditions to ...",
                description: "A compilation of reports from recent visits to the somewhere."
              })
              .then((topic) => {
                expect(topic.title).toBe("Expeditions to ...");
                expect(topic.description).toBe("A compilation of reports from recent visits to the somewhere.");
                done();
              })
              .catch((err) => {
                console.log(err);
                done();
              });
            });
            it("should not create a topic with missing title or description", (done) => {
              Topic.create({
                title: "Expeditions to Somewhere Else"
              })
              .then((post) => {
                done();
              })
              .catch((err) => {
                expect(err.message).toContain("Topic.description cannot be null");
                done();
              });
            });
          });
        
          describe("#getPosts()", () => {
            it("should add a post to a topic, and return posts", (done) => {
              Post.create({
                title: "test",
                body: "this is a test",
                topicId: this.topic.id
              })
              .then((post) => {
                this.topic.getPosts()
                .then((posts) => {
                  expect(this.topic.id).toBe(post.topicId);
                  expect(this.topic.id).toBe(posts[1].topicId);
                  done();
                });
              })
              .catch((err) => {
                console.log(err);
                done();
              });
            });
          });
    });
});

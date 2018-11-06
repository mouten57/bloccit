const sequelize = require('../../src/db/models/index').sequelize;
const Topic = require('../../src/db/models').Topic;
const Post = require('../../src/db/models').Post;
const User = require('../../src/db/models').User;

describe('Topic', () => {
  beforeEach(done => {
    this.topic;
    this.post;
    this.user;

    sequelize.sync({ force: true }).then(res => {
      User.create({
        email: 'starman@tesla.com',
        password: 'Trekkie4lyfe'
      }).then(user => {
        this.user = user;

        Topic.create(
          {
            title: 'Expeditions to Alpha Centauri',
            description:
              'A compilation of reports from recent visits to the star system.',
            posts: [
              {
                title: 'My first visit to Proxima Centauri b',
                body: 'I saw some rocks.',
                userId: this.user.id
              }
            ]
          },
          {
            include: {
              model: Post,
              as: 'posts'
            }
          }
        )
          .then(topic => {
            this.topic = topic;
            this.post = topic.posts[0];
            done();
          })
          .catch(err => {
            console.log(err);
            done();
          });
      });
    });
  });
  describe('#create()', () => {
    it('should create a topic object with a title and description', done => {
      Topic.create({
        title: 'JS Frameworks',
        description: 'There are a lot of them'
      })
        .then(topic => {
          expect(topic.title).toBe('JS Frameworks');
          expect(topic.description).toBe('There are a lot of them');
          done();
        })
        .catch(err => {
          console.log(err);
          done();
        });
    });
    it('should not create a topic with missing title or description', done => {
      Topic.create({
        title: 'Angular is Better than React'
      })
        .then(topic => {
          //this code block will not be evaluated
          done();
        })
        .catch(err => {
          expect(err.message).toContain('Topic.description cannot be null');
          done();
        });
    });
  });
  describe('#show()', () => {
    it('should show all the topics', done => {
      Topic.findById(1)
        .then(topic => {
          expect(topic.title).toBe('Expeditions to Alpha Centauri');
          expect(topic.description).toBe(
            'A compilation of reports from recent visits to the star system.'
          );
          console.log('this is my topic from test', topic);
          done();
        })
        .catch(err => {
          console.log(err);
          done();
        });
    });
  });
  describe('#getPosts()', () => {
    it('should return the associated posts', done => {
      this.topic.getPosts().then(posts => {
        expect(posts[0].title).toBe('My first visit to Proxima Centauri b');
        done();
      });
    });
  });
});

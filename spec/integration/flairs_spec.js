const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/flairs/";

const sequelize = require("../../src/db/models/index").sequelize;
const Flair = require("../../src/db/models").Flair;

describe("routes : flairs", () => {

  beforeEach((done) => {
    this.flair;

    sequelize.sync({force: true}).then((res) => {

      Flair.create({
        name: "Recent",
        color: "green"
      })
      .then((flair) => {
        this.flair = flair;
        done();
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });
  });

  describe("GET /flairs", () => {
    it("should return a status code 200 and all flairs", (done) => {
      request.get(base, (err, res, body) => {
        expect(res.statusCode).toBe(200);
        expect(err).toBeNull();
        expect(body).toContain("Flairs");
        expect(body).toContain("Recent");
        done();
      });
    });
  });
  describe("GET /flairs/new", () => {
    it("should render a new flair form", (done) => {
      request.get(`${base}new`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("New Flair");
        done();
      });
    });
  });
  describe("POST /flairs/create", () => {
    const options = {
      url: `${base}create`,
      form: {
        name: "Hot",
        color: "orange"
      }
    };
    it("should create a new flair and redirect", (done) => {
      request.post(options, (err, res, body) => {
        Flair.findOne({where: {name: "Hot"}})
        .then((flair) => {
          expect(res.statusCode).toBe(303);
          expect(flair.name).toBe("Hot");
          expect(flair.color).toBe("orange");
          done();
        })
        .catch((err) => {
          console.log(err);
          done();
        });
      });
    });
  });
  describe("GET /flairs/:id", () => {
    it("should render a view with the selected flair", (done) => {
      request.get(`${base}${this.flair.id}`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("Recent");
        done();
      });
    });
  });
  describe("POST /flairs/:id/destroy", () => {
    it("should delete the flair with the associated ID", (done) => {
      Flair.all()
      .then((flairs) => {
        const flairCountBeforeDelete = flairs.length;
        expect(flairCountBeforeDelete).toBe(1);
        request.post(`${base}${this.flair.id}/destroy`, (err, res, body) => {
          Flair.all()
          .then((flairs) => {
            expect(err).toBeNull();
            expect(flairs.length).toBe(flairCountBeforeDelete - 1);
            done();
          });
        });
      });
    });
  });
  describe("GET /flairs/:id/edit", () => {
    it("should render a view with an edit flair form", (done) => {
      request.get(`${base}${this.flair.id}/edit`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("Edit Flair");
        expect(body).toContain("Recent");
        done();
      });
    });
  });
  describe("POST /flairs/:id/update", () => {
    it("should update the flair with the given values", (done) => {
      const options = {
        url: `${base}${this.flair.id}/update`,
        form: {
          name: "Controversial",
          color: "yellow"
        }
      };
      request.post(options, (err, res, body) => {
        expect(err).toBeNull();
        Flair.findOne({
          where: { id: this.flair.id }
        })
        .then((flair) => {
          expect(flair.name).toBe("Controversial");
          done();
        });
      });
    });
  });
});

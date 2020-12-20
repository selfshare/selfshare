import app from '../src/app';
import chai from 'chai';
import chaiHttp from 'chai-http';
import 'mocha';

const {expect} = chai;
chai.use(chaiHttp);

// WARNING: put and post tests will modify your database entries
describe("selfshare backend", () => {
    it("should display general information", done => {
        chai
            .request(app)
            .get("/general")
            .end((err: any, res: any) => {
                expect(res).to.have.status(200);
                expect(res.body).to.not.equal(null);
                expect(res.body.title).to.not.equal(null);
                expect(res.body.description).to.not.equal(null);
                expect(res.body.theme).to.not.equal(null);
                done();
            });
    });
    it("should update general information", done => {
        chai
            .request(app)
            .put("/general")
            .send({"title": "selfshare", "description": "description", "theme": "flatly"})
            .end((err: any, res: any) => {
                expect(res).to.have.status(200);
                chai
                    .request(app)
                    .get("/general")
                    .end((err1: any, res1: any) => {
                        expect(res1).to.have.status(200);
                        expect(res1.body).to.not.equal(null);
                        expect(res1.body.title).to.equal('selfshare');
                        expect(res1.body.description).to.equal('description');
                        expect(res1.body.theme).to.equal('flatly');
                        done();
                    });
            });
    });

    it("should display about information", done => {
        chai
            .request(app)
            .get("/about")
            .end((err: any, res: any) => {
                expect(res).to.have.status(200);
                expect(res.body).to.not.equal(null);
                expect(res.body.name).to.not.equal(null);
                expect(res.body.description).to.not.equal(null);
                expect(res.body.picture).to.not.equal(null);
                expect(res.body.email).to.not.equal(null);
                done();
            });
    });
    it("should update about information", done => {
        chai
            .request(app)
            .put("/about")
            .send({
                "name": "selfshareMan",
                "description": "description",
                "picture": "something",
                "email": "test@selfshare.com"
            })
            .end((err: any, res: any) => {
                expect(res).to.have.status(200);
                chai
                    .request(app)
                    .get("/about")
                    .end((err1: any, res1: any) => {
                        expect(res1.body).to.not.equal(null);
                        expect(res1.body.name).to.equal('selfshareMan');
                        expect(res1.body.description).to.equal('description');
                        expect(res1.body.picture).to.equal('something');
                        expect(res1.body.email).to.equal('test@selfshare.com');
                        done();
                    });
            });
    });

    it("should display disclaimer", done => {
        chai
            .request(app)
            .get("/disclaimer")
            .end((err: any, res: any) => {
                expect(res).to.have.status(200);
                expect(res.body).to.not.equal(null);
                expect(res.body.code).to.equal(200);
                expect(res.body.body).to.not.equal(null);
                done();
            });
    });
    it("should update disclaimer", done => {
        chai
            .request(app)
            .put("/disclaimer")
            .send({"body": "hello", "code": 200})
            .end((err: any, res: any) => {
                expect(res).to.have.status(200);
                chai
                    .request(app)
                    .get("/disclaimer")
                    .end((err1: any, res1: any) => {
                        expect(res1.body).to.not.equal(null);
                        expect(res1.body.body).to.equal('hello');
                        expect(res1.body.code).to.equal(200);
                        done();
                    });
            });
    });
});
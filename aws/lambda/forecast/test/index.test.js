const LambdaTester = require('lambda-tester');
const mockery = require('mockery');
const forecastHandler = require('../index').handler;
const expect = require( 'chai' ).expect;

describe('forecast handler', function() {

  before(function (){
    mockery.enable();
  })

  after(function (){
    mockery.enable();
  })

  it('London coordinates returns forecast', function() {
    return LambdaTester(forecastHandler)
      .event({
        queryStringParameters: {
          latitude: '51.4624171',
          longitude: '-0.1054934'
        }
      })
      .expectResult((result) => {
        expect(result.statusCode).to.equal(200);
        expect(result.body).to.be.a('string');

        var body = JSON.parse(result.body);

        expect(body.summary).to.be.a('string');
        expect(body).to.have.property('data').with.lengthOf(60);

        body.data.forEach((item) => {
          expect(item.time).to.be.a('number');
          expect(item.precipIntensity).to.be.a('number');
          expect(item.precipProbability).to.be.a('number');
        });
      });
  });
});
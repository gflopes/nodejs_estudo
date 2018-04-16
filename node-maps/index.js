const restify = require('restify');

const server = restify.createServer({
  name: 'myapp',
  version: '1.0.0'
});

const knex = require('knex')({
    client: 'mysql',
    connection: {
      host : '127.0.0.1',
      user : 'root',
      password : 'root',
      database : 'dbspa'
    }
});

var googleMapsClient = require('@google/maps').createClient({
    key: 'AIzaSyC8OulDaTpAqZNsztnAlfvSvxN-5VH_HLs',
    Promise: Promise
});

server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

server.listen(8080, function () {
  console.log('%s listening at %s', server.name, server.url);
});

server.get('/all', function (req, res, next) {
    knex('places')
        .then((dados) =>{
        res.send(dados);
    }, next);
});

server.get('/geocode', function(req, res, next) {
    googleMapsClient.geocode({address: '1600 Amphitheatre Parkway, Mountain View, CA'}).asPromise()
        .then((response) => {
            const address = response.json.results[0].formatted_address;
            const place_id = response.json.results[0].place_id;
            res.send({place_id, address});
        })
        .catch((err) => {
            res.send(err);
        });
});
const restify = require('restify');

const errors = require('restify-errors');

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

server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

server.listen(8080, function () {
  console.log('%s listening at %s', server.name, server.url);

});

server.get('/', restify.plugins.serveStatic({
   directory: './dist',
   file: 'index.html'
}));

server.get('/read', function (req, res, next) {
    knex('rest')
        .then((dados) =>{
        res.send(dados);
    }, next);
});

server.get('/show/:id', function (req, res, next) {
    const { id } = req.params;
    knex('rest')
        .where('id', id)
        .first()
        .then((dados) =>{
            if (!dados) return res.send(new errors.BadRequestError('Nenhum registro encontrado'));
            res.send(dados);
    }, next);
});

server.put('/update/:id', function (req, res, next) {
    const { id } = req.params;
    knex('rest')
        .where('id', id)
        .update(req.body)
        .then((dados) =>{
            if (!dados) return res.send(new errors.BadRequestError('Nenhum registro atualizado'));
            res.send('Registro atualizado com sucesso');
    }, next);
});

server.del('/delete/:id', function (req, res, next) {
    const { id } = req.params;
    knex('rest')
        .where('id', id)
        .delete()
        .then((dados) =>{
            if (!dados) return res.send(new errors.BadRequestError('Nenhum registro excluído'));
            res.send('Registro excluído com sucesso');
    }, next);
});

server.post('/create', function (req, res, next) {
    knex('rest')
        .insert(req.body)
        .then((dados) =>{
            res.send(dados);
        }, next);
});
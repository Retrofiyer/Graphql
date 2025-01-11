const express = require('express');
const { createHandler } = require('graphql-http/lib/use/express');
const schema = require('../graphql/schema/schema');
const resolvers = require('../graphql/resolvers/resolvers');
const expressPlayground = require('graphql-playground-middleware-express').default;

const router = express.Router();

router.use('/', createHandler({ schema, rootValue: resolvers }));

router.get('/playground', expressPlayground({ endpoint: '/graphql' }));

module.exports = router;
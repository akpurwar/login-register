const postResolvers = require('./post');
const userResolver = require('./user');
const musicResolver = require('./music');

module.exports = {
Query :{
    ...postResolvers.Query,
    ...musicResolver.Query
},
Mutation:{
   ...userResolver.Mutation
}
}
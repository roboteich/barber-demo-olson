var express = require('express');
var app = module.exports = express();
var Account = require('../models/account');

function attachSmsUser(request, response, next){

  //if a user is already attached to the request
  if(request.session.account) {
    return next();
  }

  var senderPhone = request.body.From;
  // find account for phone
  Account.one(senderPhone, function(err, account){

    if(err) return next(err);

    // if there's a matching account set it to the session and move on
    if(account) {

      request.session.account = account;
      next();

    // else create a new account
    } else {

      Account.create(
        {
          id:senderPhone,
          phone:senderPhone
        },
        function(err, newAccount) {
          if(err) return next(err);
          // set the new account to the session and move on
          request.session.account = newAccount;
          next();
        }
      );
    }
  });
}

// Twilio SMS webhook route
app.post('/sms', attachSmsUser, function(request, response){

  var sess = request.session;
  var phone = request.session.account.phone;
  var message = 'Sure thing ' + phone;

  response.type('text/xml');
  response.render('twiml', {
    message: message
  });

});


// // promises
// var converse, updateProfile, getIntent, searchMovies, getMovieInformation = null;
//
// // train the service and create the promises with the result
// training.train(function(err) {
// 	if (err){
//     log('ERROR:', err.error);
//   }
//
//   apis = require('./api/services');
//
//   converse = Q.nfbind(apis.dialog.conversation.bind(apis.dialog));
//   updateProfile = Q.nfbind(apis.dialog.updateProfile.bind(apis.dialog));
//   getIntent = Q.nfbind(apis.classifier.classify.bind(apis.classifier));
//   searchMovies = Q.nfbind(apis.movieDB.searchMovies.bind(apis.movieDB));
//   getMovieInformation = Q.nfbind(apis.movieDB.getMovieInformation.bind(apis.movieDB));
// });
//
// // create the conversation
// app.post('/api/create_conversation', function(req, res, next) {
//   converse(req.body)
//   .then(function(result){
//     res.json(result[0]);
//   })
//   .catch(next);
// });
//
// // converse
// app.post('/api/conversation', function(req, res, next) {
//   log('--------------------------');
//   log('1. classifying user intent');
//   getIntent({ text: req.body.input })
//   .then(function(result) {
//     log('2. updating the dialog profile with the user intent');
//     var classes = result[0].classes;
//     var profile = {
//       client_id: req.body.client_id,
//       name_values: [
//         { name:'Class1', value: classes[0].class_name },
//         { name:'Class1_Confidence', value: classes[0].confidence },
//         { name:'Class2', value: classes[1].class_name },
//         { name:'Class2_Confidence', value: classes[1].confidence }
//       ]
//     };
//     return updateProfile(profile);
//   })
//   .catch(function(error ){
//     log('2.', error.description || error);
//   })
//   .then(function() {
//     log('3. calling dialog.conversation()');
//     return converse(req.body)
//     .then(function(result) {
//       var conversation = result[0];
//       if (searchNow(conversation.response.join(' '))) {
//         log('4. dialog thinks we have information enough to search for movies');
//         var searchParameters = parseSearchParameters(conversation);
//         conversation.response = conversation.response.slice(0, 1);
//         log('5. searching for movies in themoviedb.com');
//         return searchMovies(searchParameters)
//         .then(function(searchResult) {
//           log('6. updating the dialog profile with the result from themoviedb.com');
//           var profile = {
//             client_id: req.body.client_id,
//             name_values: [
//               { name:'Current_Index', value: searchResult.curent_index },
//               { name:'Total_Pages', value: searchResult.total_pages },
//               { name:'Num_Movies', value: searchResult.total_movies }
//             ]
//           };
//           return updateProfile(profile)
//           .then(function() {
//             log('7. calling dialog.conversation()');
//             var params = extend({}, req.body);
//             if (['new','repeat'].indexOf(searchParameters.page) !== -1)
//               params.input = PROMPT_MOVIES_RETURNED;
//             else
//               params.input = PROMPT_CURRENT_INDEX;
//
//             return converse(params)
//             .then(function(result) {
//               res.json(extend(result[0], searchResult));
//             });
//           });
//         });
//       } else {
//         log('4. not enough information to search for movies, continue the conversation');
//         res.json(conversation);
//       }
//     });
//   })
//   .catch(next);
// });
//
// function searchNow(message) {
//   return message.toLowerCase().indexOf('search_now') !== -1;
// }
//
// function parseSearchParameters(conversation) {
//   var params = conversation.response[1].toLowerCase().slice(1, -1);
//   params = params.replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2": ');
//   return JSON.parse(params);
// }
//
// app.get('/api/movies', function(req, res, next) {
//   getMovieInformation(req.query)
//   .then(function(movie){
//     var profile = {
//       client_id: req.body.client_id,
//       name_values: [
//         { name:'Selected_Movie', value: movie.movie_name },
//         { name:'Popularity_Score', value: movie.popularity * 10 }
//       ]
//     };
//     return updateProfile(profile)
//     .then(function() {
//       var params = {
//         client_id: req.query.client_id,
//         conversation_id: req.query.conversation_id,
//         input: PROMPT_MOVIE_SELECTED
//       };
//       return converse(params)
//       .then(function(result) {
//         res.json(extend(result[0], { movies: [movie]}));
//       });
//     });
//   })
//   .catch(next);
// });
//
//
// /**
//  * Returns the classifier_id and dialog_id to the user.
//  */
// app.get('/api/services', function(req, res) {
//   res.json({
//     dialog_id: apis ? apis.dialog_id : 'Unknown',
//     classifier_id: apis ? apis.classifier_id : 'Unknown'
//   });
// });

const knex = require('knex')(require('../knexfile'));
// game = {
// 	userChoice: 'black/white',
// 	display: 'user1',
//  session_id: 'xxxx'
// }


const newGame = (game) => {
  if (game.userChoice == 'white') {
    knex.insert({
      white: game.display,
      black: null,
      result: null,
      rounds: 0,
			// session_id: game.session_id
      rounds: 0,   
    }).into('games').then((req, res) => {
      console.log(res);
    });
  } else {
    knex.insert({
      white: null,
      black: game.display,
      result: null,
      rounds: 0,
			// session_id: game.session_id
    }).into('games').then((req, res) => {
      console.log(res);
    });
  }

  knex('profiles').where({ display: game.display }).increment(
		'total_games', 1
	).then((req, res) => {
  console.log(res);
});
};


// // game = {
// // 	id: 'game_id',
// // 	display: 'user2',
// // 	color: 'black / white'
// // }

const joinGame = (game) => {
  if (game.color == 'black') {
    knex('games').where({ game: game.id }).update({
      black: game.display,
    }).then((req, res) => {
      console.log(res);
    });
  } else {
    knex('games').where({ game: game.id }).update({
      white: game.display,
    }).then((req, res) => {
 			 console.log(res);
    });
  }
 			 console.log(res)
    });
  }

  knex('profiles').where({ display: game.display }).increment(
		'total_games', 1
	).then((req, res) => 
  console.log(res)
	)
};


// // game = {
// // 	id: 'game_id',
// // 	action: 'string of movement',
//      round: 5

		 // capture: true,
		 // target: 'queen',
		 // targetColor: 'white',

// // }

const saveMove = (game) => {
  knex('games').where({ game: game.id })
	.increment('rounds', 1)
	.then((req, res) =>
  console.log(res)
	)

  knex('game_moves').insert({
    action: game.action,
    game: game.id,
    round: game.round,
    capture: game.capture,
  }).then((req, res) =>
  console.log(res)
	)

  if (game.capture === true) {
    knex('game_pieces').insert({
      piece_type: game.target,
      game: game.id,
      color: game.targetColor,
      round: game.round,
    }).then((req, res) =>
  console.log(res)
	);
  }
// // 	move: 'string of movement',
// // }



// // game = {
// // 	id: 'game_id'
// // 	result: 'name'
// // 	user1: 'name',
// // 	user2: 'name2',
// // }

const finishGame = (game) => {
  if (game.result == 'draw') {
    knex('games').where({ game: game.id }).update({
      result: 'Draw',
    }).then((req, res) =>
  console.log(res)
	);

    knex('profiles').where({ display: game.user1 }).increment('draw', 1)
		.then((req, res) =>
  console.log(res)
	);

    knex('profiles').where({ display: game.user2 }).increment('draw', 1)
		.then((req, res) =>
  console.log(res)
	);

    knex('profiles').where({ display: game.user1 }).increment('total_games', 1)
		.then((req, res) =>
  console.log(res)
	);

    knex('profiles').where({ display: game.user2 }).increment('total_games', 1)
		.then((req, res) =>
  console.log(res)
	);
  } else {
    knex('games').where({ game: game.id }).update({
      result: game.result,
    }).then((req, res) =>
  console.log(res)
	);

    knex('profiles').where({ display: game.result }).increment('win', 1)
	.then((req, res) =>
  console.log(res)
	);

    knex('profiles').where({ display: game.result }).increment('total_games', 1)
	.then((req, res) =>
// // 	win: 'name of winner' || 'draw',
// // 	lose: 'name of loser' || 'draw',
// // 	user1: null,
// // 	user2: null,
// // }

const finishGame = (game) => {
   if (game.result == 'draw') {
     knex('games').where({ game: game.id }).update({
       result: 'Draw',
     }).then((req, res) =>
   console.log(res)
 	);
 
     knex('profiles').where({ display: game.user1 }).increment('draw', 1)
 		.then((req, res) =>
   console.log(res)
 	);
 
     knex('profiles').where({ display: game.user2 }).increment('draw', 1)
 		.then((req, res) =>
   console.log(res)
 	);
 
     knex('profiles').where({ display: game.user1 }).increment('total_games', 1)
 		.then((req, res) =>
   console.log(res)
 	);
 
     knex('profiles').where({ display: game.user2 }).increment('total_games', 1)
 		.then((req, res) =>
   console.log(res)
 	);
   } else {
     knex('games').where({ game: game.id }).update({
       result: game.result,
     }).then((req, res) =>
   console.log(res)
 	);
 
     knex('profiles').where({ display: game.result }).increment('win', 1)
 	.then((req, res) =>
   console.log(res)
 	);
 
     knex('profiles').where({ display: game.result }).increment('total_games', 1)
 	.then((req, res) =>
   console.log(res)
 	);
 
 	// select user that is not result
     if (game.result == game.user1) {
       knex('profiles').where({ display: game.user2 }).increment('loss', 1)
 			.then((req, res) =>
   console.log(res)
 	);
 
       knex('profiles').where({ display: game.user2 }).increment('total_games', 1)
 	.then((req, res) =>
   console.log(res)
 	);
     } else {
       knex('profiles').where({ display: game.user1 }).increment('loss', 1)
 						.then((req, res) =>
 				console.log(res)
 				);
 
      knex('profiles').where({ display: game.user1 }).increment('total_games', 1)
 				.then((req, res) =>
 				console.log(res)
 				);
     }
   }
 };


const requestClient = (user) => {
  knex('profiles').where('display', user.display).then((req, res) =>
  console.log(req)
	);
};

const requestGame = (game) => {
  knex('games').where('game', game.id).then((req, res) => {
    console.log(req)
  });
};

const requestGameMoves = (game) => {
  knex('game_moves').where('game', game.id).then((req, res) =>
  console.log(req)
	);
};

const requestCapturedPieces = (game) => {
  knex('game_pieces').where('game', game.id).then((req, res) => {
    console.log(req)
  });
};
		

// // user = {
// // 	display: 'users name'
// // }

// const requestInfo = (user) => {
// 	knex('profiles').where('display', user.display)
// }


// // game = {
// // 	id: 'game_id',
// // 	round: 'integer'
// // }

// const rewind = (game) => {
// 	knex('games').where('game_id', game.id).select('game_log')[game.round]
// }



// module.exports = newGame;
// module.exports = joinGame;
// module.exports = saveMove;
// module.exports = finishGame;
// module.exports = requestClient;
// module.exports = requestGame;
// module.exports = requestGameMoves;
// module.exports = requestCapturedPieces;
// module.exports = requestInfo;
// module.exports = rewind;
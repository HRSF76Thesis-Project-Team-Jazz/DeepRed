const knex = require('knex')(require('../knexfile'));
// game = {
// 	userChoice: 'black/white',
// 	display: 'user1',
<<<<<<< HEAD
//  session_id: 'xxxx'
// }

const newGame = (game) => {
  console.log('new game!');
=======
// }

const newGame = (game) => {
	console.log('new game!')
>>>>>>> DB scheme / DB routes
  if (game.userChoice == 'white') {
    knex.insert({
      white: game.display,
      black: null,
      result: null,
<<<<<<< HEAD
      rounds: 0,
			// session_id: game.session_id
=======
      rounds: 0,   
>>>>>>> DB scheme / DB routes
    }).into('games').then((req, res) => {
      console.log(res);
    });
  } else {
    knex.insert({
      white: null,
      black: game.display,
      result: null,
      rounds: 0,
<<<<<<< HEAD
			// session_id: game.session_id
=======
>>>>>>> DB scheme / DB routes
    }).into('games').then((req, res) => {
      console.log(res);
    });
  }
<<<<<<< HEAD
=======

  knex('profiles').where({ display: game.display }).increment(
		'total_games', 1
	).then((req, res) => {
  console.log(res);
});
>>>>>>> DB scheme / DB routes
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
<<<<<<< HEAD
 			 console.log(res);
    });
  }
=======
 			 console.log(res)
    });
  }

  knex('profiles').where({ display: game.display }).increment(
		'total_games', 1
	).then((req, res) => 
  console.log(res)
	)
>>>>>>> DB scheme / DB routes
};


// // game = {
// // 	id: 'game_id',
<<<<<<< HEAD
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
=======
// // 	move: 'string of movement',
// // }

const saveMove = (game) => {
	knex('games').where({ game: game.id })
	.increment( 'rounds' , 1 )
	.then((req, res) => 
  console.log(res)
	)

	knex('game_moves').insert({
		action: game.action,
		game: game.id
	}).then((req, res) => 
  console.log(res)
	)
>>>>>>> DB scheme / DB routes
};


// // game = {
// // 	id: 'game_id'
<<<<<<< HEAD
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
=======
// // 	win: 'name of winner' || 'draw',
// // 	lose: 'name of loser' || 'draw',
// // 	user1: null,
// // 	user2: null,
// // }

const finishGame = (game) => {

	if (game.result == 'draw'){
		knex('games').where({game: game.id}).update({
			result: 'Draw'
		}).then((req, res) => 
  console.log(res)
	);

		knex('profiles').where({display: game.user1}).increment('draw', 1)
		.then((req, res) => 
  console.log(res)
	);

		knex('profiles').where({display: game.user2}).increment('draw', 1)
		.then((req, res) => 
  console.log(res)
	);

	} else {

	knex('games').where({game: game.id}).update({
		result: game.result
	}).then((req, res) => 
  console.log(res)
	);

	knex('profiles').where({display: game.result}).increment('win', 1)
	.then((req, res) => 
>>>>>>> DB scheme / DB routes
  console.log(res)
	);

	// select user that is not result
<<<<<<< HEAD
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
=======
		if (game.result == game.user1){
			knex('profiles').where({display: game.user2}).increment('loss', 1)
			.then((req, res) => 
  console.log(res)
	);
		} else {
			knex('profiles').where({display: game.user1}).increment('loss', 1)
			.then((req, res) => 
  console.log(res)
	);
		}
	}
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

>>>>>>> DB scheme / DB routes

// module.exports = newGame;
// module.exports = joinGame;
// module.exports = saveMove;
<<<<<<< HEAD
// module.exports = finishGame;
// module.exports = requestClient;
// module.exports = requestGame;
// module.exports = requestGameMoves;
// module.exports = requestCapturedPieces;
=======
module.exports = finishGame;
// module.exports = requestInfo;
// module.exports = rewind;
>>>>>>> DB scheme / DB routes

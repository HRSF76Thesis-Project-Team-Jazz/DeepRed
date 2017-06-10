# Deep Red

Deep Red is an online, real-time chess platform with options for:
1. 2 player virtual play
2. Player against an artificially intelligent computer
3. AI vs. AI players

### Deep Red: Chess Engine
Deep Red is a computer that has been programmed with all the rules of chess.  At any given board and game state, Deep Red is able to evaluate all available moves for a given player.

###Machine Learning / AI: Reinforcement Learning
Deep Red improves its performance with game training experience from various sources:
- Seeded historical game data
- Player vs. player games completed on the platform
- AI vs. AI games completed

For addition information on Deep Red's machine learning capabilities, click here: [Overview of Deep Red: Chess Master](DeepRed.md).


## Team

- Ryan Chow
- Shawn Feng
- Carlo P. Las Marias
- Jason Yu

## Roadmap

View the project roadmap [here](LINK_TO_DOC)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.

# Table of Contents

1. [Usage](#Usage)
1. [Requirements](#requirements)
1. [Development](#development)
    1. [Installing Dependencies](#installing-dependencies)
    1. [Tasks](#tasks)

## Usage

> Some usage instructions

## Requirements

- Node 6.9.x
- Redis 3.2.x
- Postgresql 9.6.x
- etc

## Development

### Installing System Dependencies

```
brew install yarn
brew install redis
brew install postgresql
```

Yarn is a replacement for npm. It's faster and *guarantees* consistency -- as you deploy your code in various environments, you won't run the risk of slight variations in what gets installed.

### Install Project Dependencies

```
yarn global add grunt-cli knex eslint
```

## Database Initialization

IMPORTANT: ensure `postgres` is running before performing these steps.

### Database Creation:

Use grunt to create a new database for your development and test environments:

Development envronment: `grunt pgcreatedb:default`

Other environments, specify like so: `NODE_ENV=test grunt pgcreatedb:default`

### Run Migrations & Data Seeds

In terminal, from the root directory:

`knex migrate:latest --env NODE_ENV`

`knex migrate:rollback --env NODE_ENV`

`knex seed:run --env NODE_ENV`

Note: `--env NODE_ENV` may be omitted for development. For example, `knex migrate:latest` will run all migrations in the development environment, while `knex migrate:latest --env test` will migrate in the test environment.

## Running the App

To run webpack build: `yarn run build`

To run server: `yarn run start`

To run tests: `yarn run test`

To run your redis server for the session store `redis-server`

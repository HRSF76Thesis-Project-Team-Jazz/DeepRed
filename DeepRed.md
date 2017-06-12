# DeepRed: Machine Learning Chess Computer

# Overview of Deep Red
- Deep Red is a chess computer that learns to play chess and improve its performance through experience
- Initially, Deep Red's only capability is to evaluate all legal and valid moves given a current board state
  - Deep Red has no experience and no preference or bias as to which move it will choose
- Deep Red begins creating a bias/preference from experience through various sources:
  1. Deep Red may be seeded with some previous chess games
  2. Humans playing against Deep Red (player vs. computer mode)
  3. Humans playing against other humans (game histories and outcomes stored for games played in Player vs Player mode)
  4. Computer vs. computer mode (Deep Red vs. Deep Red or 3rd party chess APIs)

# Move Decisions (from Experience / Known Choices)
- **Deep Red chooses its move based on its experience**: Deep Red chooses the previously known / learned move that has resulted in the best possible outcome
  - Best possible outcome is measured by how many times a particular choice or path has resulted in a favorable win / loss ratio
  - Win loss ratio is based on aggregate amount of wins and losses for that entire subtree

![](images/deepRed-decisions.png?raw=true)


# Machine Learning: Building Experience & Reinforcement Learning
- When Deep Red encounters previously unknown board states, it randomly chooses valid chess moves
- At the completion of such game, outcome is determined and used to update Deep Red's experience

![](images/deepRed-learning.png?raw=true)

# Data / Knowledge Representation
- Deep Red's knowledge base is stored as a tree, where each node represents a chess move
- A full game consist of a full path from root to terminal node, with each node representing each sequential move of that game
- Existing child nodes represent previously "experienced" or known nodes of possible moves
- Terminal nodes (leaves) represent final moves that determined the outcome of the game
- Each node keeps a store of the summary of all the outcomes (leaves) for that particular sub tree
- Upon completion of a game, if any unknown moves were encountered, new nodes and a new path will be created in the tree, with each node in the path of the full game being updated to reflect the new experience

# Deep Red Move Notation
- Deep Red generates an object of all available moves based on an input board and game state.

  **Example of Available Moves**

  ```js
  { '17': [],
    '30': [ [ 2, 0 ] ],
    '70': [ [ 6, 0 ], [ 5, 0 ], [ 4, 0 ], [ 7, 1 ], [ 7, 2 ], [ 7, 3 ] ],
    '74': [ [ 6, 3 ], [ 6, 5 ], [ 6, 4 ], [ 7, 3 ], [ 7, 5 ] ],
    '77': [ [ 6, 7 ], [ 5, 7 ], [ 4, 7 ], [ 3, 7 ], [ 2, 7 ], [ 7, 6 ], [ 7, 5 ] ],
    specialMoves:
    [ { move: 'castle', color: 'W', side: 'O-O' },
      { move: 'castle', color: 'W', side: 'O-O-O' },
      { move: 'enpassant', from: '30', to: '21', captured: '31' },
      { move: 'pawnPromotion', from: '17', to: '07', newPiece: 'WQ' },
      { move: 'pawnPromotion', from: '17', to: '07', newPiece: 'WR' },
      { move: 'pawnPromotion', from: '17', to: '07', newPiece: 'WB' },
      { move: 'pawnPromotion', from: '17', to: '07', newPiece: 'WN' },
      { move: 'pawnPromotion', from: '17', to: '06', newPiece: 'WQ' },
      { move: 'pawnPromotion', from: '17', to: '06', newPiece: 'WR' },
      { move: 'pawnPromotion', from: '17', to: '06', newPiece: 'WB' },
      { move: 'pawnPromotion', from: '17', to: '06', newPiece: 'WN' } ] }
  ```

- **Normal moves:** represented as an array of to and from coordinates: `[from, to]`
  - Example above for pawn advance: `['30', [2,0]]`
- **Special moves:** fall into the object key = `specialMoves` and represented as an object with relevant information for such moves:
  - Example of castling: `{ move: 'castle', color: 'W', side: 'O-O' }`

# Data Normalization and Importing
- One initial source of experience for Deep Red is to import previously played games outside of Deep Red.  The standard convention for recording historical chess games are as follows:

  **Portable Game Notation**

  ```
  1.e4 e5 2.Nf3 Nc6 3.Bb5 Nf6 4.O-O Bd6 5.Bxc6 dxc6 6.d4 Bg4
  7.Qd3 Bxf3 8.gxf3 Nh5 9.Nc3 exd4 10.Ne2 Qh4 11.Ng3 O-O 12.Qxd4
  Rfd8 13.Qc3 Nxg3 14.fxg3 Bxg3 15.hxg3 Qxg3+ 16.Kh1 Rd6 17.Qe1
  Qh3+ 18.Kg1 Rg6+ 19.Kf2 Rg2+ 20.Ke3 f5 21.e5 Rxc2 22.Bd2 Rd8
  23.Bc3 f4 24.Kxf4 Qh6+ 25.Ke4 Qg6+ 26.Kf4 Qh6+ 27.Ke4 Rh2
  28.Rd1 Rh4+ 29.f4 Qg6+ 30.Ke3 Rh3+ 31.Rf3 Rxf3+ 32.Kxf3 Rxd1
  33.Qe2 Rd3+ 0-1
  ```

  **Deep Red: Move Notation**
  - PGN: `1. e4`
  - Deep Red Notation: `[ '64', '44' ]`
  - Board Representation: 

| a | b | c | d | e | f | g | h |
| --|---|---|---|:---:|---|---|---|
| BR  |  BN  |  BB  |  BQ  |  BK  |  BB  |  BN  |  BR  |
| BP  |  BP  |  BP  |  BP  |  BP  |  BP  |  BP  |  BP  |
| --  |  --  |  --  |  --  |  --  |  --  |  --  |  --  |
| --  |  --  |  --  |  --  |  --  |  --  |  --  |  --  |
| --  |  --  |  --  |  --  |`*WP*`|  --  |  --  |  --  |
| --  |  --  |  --  |  --  |  --  |  --  |  --  |  --  |
| WP  |  WP  |  WP  |  WP  |  --  |  WP  |  WP  |  WP  |
| WR  |  WN  |  WB  |  WQ  |  WK  |  WB  |  WN  |  WR  |

  - Another example: castling
  - PGN: `O-O`
  - Deep Red Notation: `{ move: 'castle', color: 'W', side: 'O-O' }`
  - Board Representation: 

**Before Move**

 a | b | c | d | e | f | g | h 
 --|---|---|---|:---:|---|---|---
 BR  |  --  |  BB  |  BQ  |  BK  |  BB  |  --  |  BR 
 BP  |  BP  |  BP  |  BP  |  --  |  BP  |  BP  |  BP 
 --  |  --  |  BN  |  --  |  --  |  BN  |  --  |  -- 
 --  |  WB  |  --  |  --  |  BP  |  --  |  --  |  -- 
 --  |  --  |  --  |  --  |  WP  |  --  |  --  |  -- 
 --  |  --  |  --  |  --  |  --  |  WN  |  --  |  -- 
 WP  |  WP  |  WP  |  WP  |  --  |  WP  |  WP  |  WP 
 WR  |  WN  |  WB  |  WQ  |  `WK`  |  --  |  --  |  `WR` 
---

**After Move**

 a | b | c | d | e | f | g | h 
 --|---|---|---|:---:|---|---|---
 BR  |  --  |  BB  |  BQ  |  BK  |  BB  |  --  |  BR 
 BP  |  BP  |  BP  |  BP  |  --  |  BP  |  BP  |  BP 
 --  |  --  |  BN  |  --  |  --  |  BN  |  --  |  -- 
 --  |  WB  |  --  |  --  |  BP  |  --  |  --  |  -- 
 --  |  --  |  --  |  --  |  WP  |  --  |  --  |  -- 
 --  |  --  |  --  |  --  |  --  |  WN  |  --  |  -- 
 WP  |  WP  |  WP  |  WP  |  --  |  WP  |  WP  |  WP 
 WR  |  WN  |  WB  |  WQ  |  --  |  `WR`  |  `WK`  |  -- 
---

-- In order to save game data to its database, Deep Red parses historical game information in PGN format and processes it into Deep Red notation format.

# Database: Game State/Board Notation

- In order to maximize efficiency of Deep Red's database, historical games and moves are transcribed into standardized format which is minimized for storage.

### Board Representation
- Boards are transcribed into a 64 character string that represents the board spaces and pieces occupying those spaces:

**Starting Board**

```js
board = [
    ['BR', 'BN', 'BB', 'BQ', 'BK', 'BB', 'BN', 'BR'],
    ['BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP'],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ['WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP'],
    ['WR', 'WN', 'WB', 'WQ', 'WK', 'WB', 'WN', 'WR'],
  ];
```

**Transcribe Pieces**
- Pieces/empty positions are represented by pseudo hexadecimal characters

Piece: | Empty | WP | WN | WB | WR | WQ | WK 
---|---|---|---|---|---|---|---
Character: | 0 | 1 | 2 | 3 | 4 | 5 | 6 

Piece: | BP | BN | BB | BR | BQ | BK
---|---|---|---|---|---|---
Character: | a | b | c | d | e | f

**Example Board String: Starting Position**

```js
storedBoard = 'dbcefcbdaaaaaaaa000000000000000000000000000000001111111142356324';
```

**Example Database Entry**

Field | Value
--- | ---
UUID | 1
Previous Board State (Parent Node) | dbcefcbdaaaaaaaa000000000000000000000000000000001111111142356324
New Board State (Child Node) | dbcefcbdaaaaaaaa000000000000000000001000000000001111011142356324
Player | W
White Wins | 100
Black Wins | 50
Stalemate | 25

**Database Key:**
- Each database entry represents a possible move that takes a game from a `Parent Board State` to a `New Board State`

Field | Description
--- | ---
UUID | Unique move identifier created by database
Previous Board State | [64] digit string representing parent board state
New Board State | [64] digit string representing paorent board state
Player | W/B: player whose turn moves the game from previous to new board state
White Wins | cumulative number of white wins in the subtree of this move
Black Wins | (same as above for black)
Statements | (same as above, for stalemates)




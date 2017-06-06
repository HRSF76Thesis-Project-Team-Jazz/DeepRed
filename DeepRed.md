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
  - Best possible outcome is measured by how may times a particular choice or path has resulted in a favorable win / loss ratio
  - Win loss ratio is based on aggregate amount of wins and losses for that entire subtree

![](images/deepRed-decisions.png?raw=true)


# Machine Learning: Building Experience
- When Deep Red encounters previously unknown board states, it randomly chooses valid chess moves
- At the completion of such game, outcome is determined and used to update Deep Red's experience

![](images/deepRed-learning.png?raw=true)

# Data / Knowledge Representation
- Deep Red's knowledge base is stored as a tree, where each node represents a chess move
- A full game consist of a full path from root to terminal node, with each node representing each sequential move of that game
- Existing child nodes represent previously "experienced" or known nodes of possible moves
- Terminal nodes (leaves) represent final moves that determined the outcome of the game
- Each node keeps a store of the summary of all the outcomes (leaves) for that particular sub tree
- Upon completion of a game, if any unknown moves were encountered, new nodes and a new path will be created in a tree, which each node in the path of the full game being update to reflect the new experience
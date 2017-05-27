import React, { Component } from 'react';

import './css/Board.css';

class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {
      board: [
        ['BR', 'BN', 'BB', 'BK', 'BQ', 'BB', 'BN', 'BR'],
        ['BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP'],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        ['WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP'],
        ['WR', 'WN', 'WB', 'WK', 'WQ', 'WB', 'WN', 'WR'],
      ],
      message: '  ',
      selectedPosition: '',
      selectedPiece: '',
      originDestCoord: [],
    };

    this.onClick = this.onClick.bind(this);
  }

  componentDidMount() {
  }

  getImage(CP) {
    return <img className="piece-img" src={`/assets/${CP}.png`} />;
  }

  onClick(coordinates) {
    const x = coordinates[0];
    const y = coordinates[1];
    const selection = this.state.board[x][y];
    if (this.state.selectedPiece === '') {
      if (selection === null) {
        this.setState({ message: 'Invalid selection' });
      } else {
        this.setState({
          originDestCoord: [x, y],
          message: `${selection} selected`,
          selectedPosition: coordinates,
          selectedPiece: selection,
        });
      }
    } else if (selection !== null) {
      this.setState({
        message: 'Invalid selection',
        selectedPosition: '',
        selectedPiece: '',
      });
    } else {
        if (this.state.originDestCoord) {
          const coord = this.state.originDestCoord;
          this.setState({
            originDestCoord: coord + ',' + [x, y],
          })
        }
      this.props.checkLegalMove(this.state.originDestCoord);
      const board = this.state.board;
      board[x][y] = this.state.selectedPiece;
      board[this.state.selectedPosition[0]][this.state.selectedPosition[1]] = null;
      this.setState({
        board,
        message: '  ',
        selectedPosition: '',
        selectedPiece: '',
        originDestCoord: [],
      });
    }
  }

  render() {
    const board = [...Array(8).keys()];

    return (
      <div className="board">
        {this.state.board.map((row, rowIndex) => {
          return (<div key={Math.random()} className="board-row">
            {row.map((col, colIndex) =>
              (<div
                className={((rowIndex + colIndex) % 2 === 0) ? 'board-col dark' : 'board-col light'}
                key={rowIndex.toString() + colIndex.toString()}
                onClick={() => this.onClick([rowIndex, colIndex])}
              >
                {(col) ? this.getImage(col) : ''}
              </div>),
            )}
          </div>);
        })}
        <p className="board-message">{this.state.message}</p>
      </div>
    );
  }

}

export default Board;

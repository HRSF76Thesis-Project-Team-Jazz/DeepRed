import React, { Component } from 'react';
import { connect } from 'react-redux';
import io from 'socket.io-client';
import Paper from 'material-ui/Paper';
import { List, ListItem } from 'material-ui/List';
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';

import { updateBoard, resetBoard, updateCapturedPieces, updateGameSummary,
  clearCapturedPieces, hideAIButton, showAIButton } from '../store/actions';

// Components
import Header from '../components/Header';
import AIBoard from './AIBoard';
import AIDialog from '../components/AIDialog';
import CapturedPieces from '../components/CapturedPieces';
import './css/App.css';

class AIvAI extends Component {
  constructor(props) {
    super(props);
    this.startSocket = this.startSocket.bind(this);
    this.handleStartAIvAI = this.handleStartAIvAI.bind(this);
  }

  componentDidMount() {
    this.startSocket();
  }

  startSocket() {
    const { dispatch } = this.props;
    dispatch(resetBoard());
    this.socket = io.connect();

    this.socket.on('connect', () => {
      console.log('client side socket connected!');
    });
    this.socket.on('startAIvAIResults', (games, gameSummary) => {
      Promise.all(games.map(game =>
        game.map((boardState, i) =>
          new Promise(
            () => setTimeout(() => {
              dispatch(updateBoard(boardState.board));
              dispatch(updateCapturedPieces(boardState.blackCapPieces,
              boardState.whiteCapPieces));
            }, 100 * i),
          ),
        ),
      ))
      .then(() => {
        dispatch(updateGameSummary(gameSummary));
        dispatch(showAIButton());
      });
    });
  }

  handleStartAIvAI() {
    const { dispatch } = this.props;
    dispatch(resetBoard());
    dispatch(clearCapturedPieces());
    dispatch(hideAIButton());
    this.socket.emit('startAIvAI', this.socket.id, 1);
  }
  render() {
    const { games, capturedPiecesBlack, capturedPiecesWhite,
      isAIButtonDisabled, whiteWins, blackWins, castleKing, castleQueen,
      pawnPromotion, enPassant, averageMovesPerGame } = this.props;
    return (
      <div className="site-wrap">
        <AIDialog shouldOpen={isAIButtonDisabled} />
        <Header />
        <div className="content">
          <div className="flex-row">
            <Paper
              zDepth={2}
              style={{ backgroundColor: '#78909C' }}
              className="flex-col capt-col"
            >
              <div className="flex-col capt-black-col">
                <CapturedPieces
                  color="Black"
                  capturedPieces={capturedPiecesWhite}
                  player="DeepRed-Black"
                />
              </div>
              <div className="flex-col capt-black-col">
                <CapturedPieces
                  color="White"
                  capturedPieces={capturedPiecesBlack}
                  player="DeepRed-White"
                />
              </div>
            </Paper>
            <div className="flex-col">
              <AIBoard />
            </div>
            <Paper className="flex-col right-col" zDepth={2}>
              <RaisedButton
                label="Find Checkmate Game"
                style={{ fontSize: '1.5vw', margin: 12 }}
                backgroundColor="#F44336"
                labelColor="white"
                disabled={isAIButtonDisabled}
                onTouchTap={this.handleStartAIvAI}
              />
              <Divider />
              <List>
                <ListItem style={{ fontSize: '1.25vw' }} primaryText={`Games Played: ${games}`} />
                <ListItem style={{ fontSize: '1.25vw' }} primaryText={`White Wins: ${whiteWins}`} />
                <ListItem style={{ fontSize: '1.25vw' }} primaryText={`Black Wins: ${blackWins}`} />
                <ListItem style={{ fontSize: '1.25vw' }} primaryText={`Stalemates: ${games - (whiteWins + blackWins)}`} />
                <ListItem style={{ fontSize: '1.25vw' }} primaryText={`Pawn Promotions: ${pawnPromotion}`} />
                <ListItem style={{ fontSize: '1.25vw' }} primaryText={`Castling: ${castleKing + castleQueen}`} />
                <ListItem style={{ fontSize: '1.25vw' }} primaryText={`enPassant: ${enPassant}`} />
                <ListItem style={{ fontSize: '1.25vw' }} primaryText={`Moves Per Game: ${averageMovesPerGame}`} />
              </List>
            </Paper>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { gameState, boardState, aiState } = state;
  const { capturedPiecesBlack, capturedPiecesWhite } = gameState;
  const { board } = boardState;
  const { game, isAIButtonDisabled, aiSpinner, games, whiteWins, blackWins,
    stalemateByMoves, stalemateByPieces, stalemateNoWhiteMoves,
    stalemateNoBlackMoves, end100moves, castleKing, castleQueen, pawnPromotion,
    enPassant, averageMovesPerGame } = aiState;
  return {
    aiSpinner,
    capturedPiecesBlack,
    capturedPiecesWhite,
    game,
    board,
    isAIButtonDisabled,
    games,
    whiteWins,
    blackWins,
    stalemateByMoves,
    stalemateByPieces,
    stalemateNoWhiteMoves,
    stalemateNoBlackMoves,
    end100moves,
    castleKing,
    castleQueen,
    pawnPromotion,
    enPassant,
    averageMovesPerGame,
  };
}

export default connect(mapStateToProps)(AIvAI);

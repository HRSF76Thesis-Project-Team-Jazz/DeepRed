import React, { Component } from 'react';
import { connect } from 'react-redux';
import io from 'socket.io-client';
import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';

// import RaisedButton from 'material-ui/RaisedButton';
import { updateBoard, resetBoard, updateCapturedPieces, updateGameSummary,
  clearCapturedPieces, hideAIButton, showAIButton } from '../store/actions';

// Components
import Header from '../components/Header';
import AIBoard from './AIBoard';
import AIDialog from '../components/AIDialog';
import CapturedPieces from '../components/CapturedPieces';
// import MoveHistory from '../components/MoveHistory';
import PlayerName from '../components/PlayerName';
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
    this.socket = io.connect();

    this.socket.on('connect', () => {
      console.log('client side socket connected!');
    });

    this.socket.on('startAIvAIResults', (games, gameSummary) => {
      games.forEach((game) => {
        game.forEach((boardState, i) => {
          setTimeout(() => {
            dispatch(updateBoard(boardState.board));
            // dispatch(updateGameSummary(gameSummary));
            dispatch(updateCapturedPieces(boardState.blackCapPieces,
              boardState.whiteCapPieces));
          }, 100 * i);
        });
        dispatch(showAIButton());
      });
      // dispatch(updateAllRooms(allRooms));
        // setInterval(() => dispatch(updateBoard(data[i])), 1000);
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
    const { capturedPiecesBlack, capturedPiecesWhite, isAIButtonDisabled } = this.props;
    return (
      <div className="site-wrap">
        <AIDialog shouldOpen={isAIButtonDisabled} />
        <Header />
        <div className="content">
          <div className="flex-row">
            <Paper className="flex-col left-col" zDepth={2}>
              <div className="left-col-row">
                <div className="player-top">
                  <FlatButton
                    label="Start"
                    primary
                    disabled={isAIButtonDisabled}
                    onTouchTap={this.handleStartAIvAI}
                  />
                  <PlayerName
                    color="Black"
                    player="DeepRed-Black"
                    position="top"
                  />
                </div>
                <div className="move-history">
                  {/* <MoveHistory
                    moveHistory={moveHistory}
                  /> */}
                </div>
                <div className="player-bot">
                  <PlayerName
                    color="White"
                    player="DeepRed-White"
                    position="bot"
                  />
                </div>
              </div>
            </Paper>
            <Paper
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
  const { game, isAIButtonDisabled } = aiState;
  return { capturedPiecesBlack,
    capturedPiecesWhite,
    game,
    board,
    isAIButtonDisabled,
  };
}

export default connect(mapStateToProps)(AIvAI);

import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

import { updateLoserList } from '../store/actions';

// Components
import Header from '../components/Header';
import './css/ShameBoard.css';

class ShameBoard extends Component {
  constructor(props) {
    super(props);
    this.getLoserList = this.getLoserList.bind(this);
    this.sortLoserList = this.sortLoserList.bind(this);
  }

  componentDidMount() {
    this.getLoserList();
  }

  getLoserList() {
    const { dispatch } = this.props;
    axios.get('api/game/getLoserList')
      .then((response) => {
        // console.log(this.sortLoserList(response.data));
        dispatch(updateLoserList(this.sortLoserList(response.data)));
      })
      .catch((err) => {
        console.error('failed to obtain lost users\' information from the database', err);
      });
  }

  sortLoserList(list) {
    const result = list.sort((a, b) => {
      if (a.count >= b.count) {
        return -1;
      }
      if (a.count < b.count) {
        return 1;
      }
      return null;
    });
    return result;
  }

  render() {
    const { loserList } = this.props;
    return (
      <div>
        <div className="shame-board-header">
          <Header />
        </div>
        <div className="shame-board-title">
          <Paper zDepth={4}>
            <p className="title">DeepRed's victory</p>
          </Paper>
        </div>
        <div className="shame-board">
          <Paper zDepth={4}>
            <Table>
              <TableHeader displaySelectAll={false} adjustForCheckbox={false} >
                <TableRow>
                  <TableHeaderColumn>#</TableHeaderColumn>
                  <TableHeaderColumn>Fullname</TableHeaderColumn>
                  <TableHeaderColumn>Lost game count</TableHeaderColumn>
                </TableRow>
              </TableHeader>
              <TableBody displayRowCheckbox={false} >
                {
                loserList.map((person, rowIndex) => (
                  <TableRow key={Math.random()} >
                    <TableRowColumn>{rowIndex + 1}</TableRowColumn>
                    <TableRowColumn>{person.name}</TableRowColumn>
                    <TableRowColumn>{person.count}</TableRowColumn>
                  </TableRow>
                  ),
                )
                }
              </TableBody>
            </Table>
          </Paper>
        </div>
      </div>


    );
  }
}

function mapStateToProps(state) {
  const { infoState } = state;
  const {
    loserList,
  } = infoState;
  return {
    loserList,
  };
}

export default connect(mapStateToProps)(ShameBoard);

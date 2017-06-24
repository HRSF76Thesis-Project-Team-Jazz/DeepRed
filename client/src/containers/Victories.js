import React, { Component } from 'react';
import { connect } from 'react-redux';
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
import './css/Victories.css';

class Victories extends Component {
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

    const options = {
      method: 'GET',
      // headers: {
      //   Accept: 'application/json',
      //   'Content-Type': 'application/json',
      // },
    };

    fetch('api/game/getLoserList', options)
      .then(result => result.json())
      .then((response) => {
        dispatch(updateLoserList(this.sortLoserList(response)));
      })
      .catch(err => console.error('failed to obtain lost users\' information from the database', err));
  }

  sortLoserList(list) {
    return list.sort((a, b) => b.count - a.count);
  }

  render() {
    const { loserList } = this.props;
    return (
      <div>
        <div className="victories-board-header">
          <Header />
        </div>
        <div className="victories-board-title">
          <Paper zDepth={4}>
            <p className="title">DeepRed Victories</p>
            <p className="victories-message">Thank you to all players and supporters who have helped to train and validate Deep Red.</p>
          </Paper>
        </div>
        <div className="victories-board">
          <Paper zDepth={4}>
            <Table>
              <TableHeader displaySelectAll={false} adjustForCheckbox={false} >
                <TableRow>
                  <TableHeaderColumn>#</TableHeaderColumn>
                  <TableHeaderColumn>Name</TableHeaderColumn>
                  <TableHeaderColumn>Losses</TableHeaderColumn>
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

export default connect(mapStateToProps)(Victories);

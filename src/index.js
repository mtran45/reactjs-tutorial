import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return <Square 
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}/>;
  }

  render() {
    const boardRows = [];
    for (let i = 0; i < 3; i++) {
      let squares = [];
      for (let j = 0; j < 3; j++) {
        squares.push(this.renderSquare(3*i+j));
      }
      boardRows.push(<div className="board-row">{squares}</div>);
    }
    return <div>{boardRows}</div>;
  }
}

class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      history: [{
        move: null,
        squares: Array(9).fill(null),
      }],
      sortMovesDesc: true,
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    // make a copy of the array to avoid data mutation (immutability)
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        move: i,
        squares: squares
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) ? false : true,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const player = (move % 2) ? 'X' : 'O';
      const location = getLocation(step.move);
      const desc = move ? player + ' ' + location : 'Game start';
      const selected = this.state.stepNumber === move ?
                            'selected' : '';
      return (
        <li key={move}>
          <a href="#" className={selected} onClick={() => this.jumpTo(move)}>{desc}</a>
        </li>
      );
    })

    const sortOrder = <button onClick={() => 
            this.setState({sortMovesDesc: !this.state.sortMovesDesc})}>
      {'Sort (' + (this.state.sortMovesDesc ? '^' : 'v') + ')'}
    </button>

    const sortedMoves = this.state.sortMovesDesc ? 
                            moves.reverse() : moves;

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <br />
          <div>{sortOrder}</div>
          <ol>{sortedMoves}</ol>
        </div>
      </div>
    );
  }
}

function getLocation(index) {
  const x = Math.floor(index / 3) + 1;
  const y = (index % 3) + 1;
  return '(' + x + ', ' + y + ')';
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
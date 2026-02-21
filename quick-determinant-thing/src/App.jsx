import { useState, useEffect } from 'react'
import './App.css'

function TextInput({ text, setText, maximum }) {
  const handleChange = (event) => {
    const value = event.target.value;
    if (value === '' || (Number(value) >= 1 && Number(value) <= maximum)) {
      setText(value);
    }else{
      setText(maximum);
    }
  }
  return (
    <div>
      <input type="text" value={text} onChange={handleChange} className="textInput" />
    </div>
  )
}

function ReturnMatrix({ matrix, setMatrix, grid }) {
  const handleChange = (event, row, col) => {
    const newMatrix = matrix.map((r, i) => 
      r.map((c, j) => 
        (i === row && j === col ? event.target.value : c)
      )
    );
    setMatrix(newMatrix);
  }
  return (
    <div className="matrixContainer">
      {matrix.map((row, i) => (
        <div key={i} className="matrixRow">
          {row.map((value, j) => (
            <input
              key={j} type="text" value={value}
              onChange={(event) => handleChange(event, i, j)} className="matrixInput" />
          ))}
        </div>
      ))}
    </div>
  )
}

function CalculateDeterminant(matrix) {
  if (matrix.length === 2) {
    return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
  }else{
    let min = matrix.length + 1;
    let row = 0;
    for(let i = 0; i < matrix.length; i++){
      let zeros = 0;
      for(let j = 0; j < matrix.length; j++){
        if(matrix[i][j] === 0){
          zeros++;
        }
      }
      if(zeros < min){
        min = zeros;
        row = i;
      }
    }
    let determinant = 0;
    for(let i = 0; i < matrix.length; i++){
      if(matrix[row][i] !== 0){
        let subMatrix = matrix.filter((_, index) => index !== row).map(r => r.filter((_, index) => index !== i));//gets rid of rows
        let newVal = ((row + i) % 2 === 0 ? 1 : -1) * matrix[row][i] * CalculateDeterminant(subMatrix);
        determinant += newVal;
      }
    }
    return determinant;
  }
}

function DisplayDeterminant({ matrix }) {
  const determinant = CalculateDeterminant(matrix);
  return (
    <div>
      <p> determinant: {determinant} </p>
    </div>
  )
}

function App() {
  const [grid, setGrid] = useState(3);
  const [matrix, setMatrix] = useState(() => {
    return Array.from({ length: grid }, () => Array.from({ length: grid }, () => 0));
  });

  useEffect(() => {
    setMatrix(Array.from({ length: grid }, () => Array.from({ length: grid }, () => 0)));
  }, [grid]);

  const matrixZeros = Array.from({ length: grid }, () => Array.from({ length: grid }, () => 0));

  const [matrixRandom, setMatrixRandom] = useState(() => {
    return Array.from({ length: grid }, () => Array.from({ length: grid }, () => Math.floor(Math.random() * 20 - 10)));
  });

  useEffect(() => {
    setMatrixRandom(Array.from({ length: grid }, () => Array.from({ length: grid }, () => Math.floor(Math.random() * 20 - 10))));
  }, [matrix]);
    
  // console.log(grid);
  console.log(matrix);
  return (
    <div>
      <h1> determinants </h1>
      <p style = {{paddingBottom: "0.2em"}}> grid size: {grid} by {grid} </p>
      <p style={{ fontSize: "0.4em", paddingBottom: "1em", paddingTop: "0em"}}> (max grid size is 10 by 10) </p>
      <TextInput text={grid} setText={setGrid} maximum={10} />
      <br />
      <div className = "center_div">
        <ReturnMatrix matrix={matrix} setMatrix={setMatrix} grid={grid} />
      </div>
      <br />
      <div className = "center_div">
        <button onClick={() => setMatrix(matrixZeros)}> zero the matrix </button>
        <button onClick={() => setMatrix(matrixRandom)}> randomize the matrix </button>
      </div>
      <DisplayDeterminant matrix={matrix} />
    </div>
  )
}

export default App

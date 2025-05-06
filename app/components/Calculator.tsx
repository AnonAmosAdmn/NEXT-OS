import { useState } from 'react';
import { Rnd } from 'react-rnd'; // Importing Rnd for draggable

const Calculator = () => {
  const [input, setInput] = useState('');

  const handleButtonClick = (value: string) => {
    setInput((prev) => prev + value);
  };

  const handleClear = () => {
    setInput('');
  };

  const handleEvaluate = () => {
    try {
      setInput(eval(input).toString());
    } catch {
      setInput('Error');
    }
  };

  return (
    <Rnd
      default={{
        x: 100, // Starting position of the calculator
        y: 100,
        width: 320, // Initial width of the calculator
        height: 400, // Initial height of the calculator
      }}
      minWidth={250} // Minimum width for resizing
      minHeight={350} // Minimum height for resizing
      bounds="window" // Ensures the calculator stays within the window
      dragHandleClassName="drag-handle" // Only allows dragging from a specific handle
    >
      <div className="w-full p-4 border rounded-lg shadow-lg bg-white">
        {/* Drag handle */}
        <div className="drag-handle p-4 bg-white rounded-tl-lg rounded-tr-lg cursor-move">
          <span></span> {/* This is the text or element that the user will click to drag */}
        </div>
        
        <div className="mb-4">
          <input
            type="text"
            value={input}
            readOnly
            className="w-full p-2 text-xl text-right border rounded-lg focus:outline-none"
          />
        </div>
        <div className="grid grid-cols-4 gap-2">
          <button
            className="p-4 bg-gray-200 rounded-lg hover:bg-gray-300"
            onClick={() => handleButtonClick('1')}
          >
            1
          </button>
          <button
            className="p-4 bg-gray-200 rounded-lg hover:bg-gray-300"
            onClick={() => handleButtonClick('2')}
          >
            2
          </button>
          <button
            className="p-4 bg-gray-200 rounded-lg hover:bg-gray-300"
            onClick={() => handleButtonClick('3')}
          >
            3
          </button>
          <button
            className="p-4 bg-gray-200 rounded-lg hover:bg-gray-300"
            onClick={() => handleButtonClick('+')}
          >
            +
          </button>

          <button
            className="p-4 bg-gray-200 rounded-lg hover:bg-gray-300"
            onClick={() => handleButtonClick('4')}
          >
            4
          </button>
          <button
            className="p-4 bg-gray-200 rounded-lg hover:bg-gray-300"
            onClick={() => handleButtonClick('5')}
          >
            5
          </button>
          <button
            className="p-4 bg-gray-200 rounded-lg hover:bg-gray-300"
            onClick={() => handleButtonClick('6')}
          >
            6
          </button>
          <button
            className="p-4 bg-gray-200 rounded-lg hover:bg-gray-300"
            onClick={() => handleButtonClick('-')}
          >
            -
          </button>

          <button
            className="p-4 bg-gray-200 rounded-lg hover:bg-gray-300"
            onClick={() => handleButtonClick('7')}
          >
            7
          </button>
          <button
            className="p-4 bg-gray-200 rounded-lg hover:bg-gray-300"
            onClick={() => handleButtonClick('8')}
          >
            8
          </button>
          <button
            className="p-4 bg-gray-200 rounded-lg hover:bg-gray-300"
            onClick={() => handleButtonClick('9')}
          >
            9
          </button>
          <button
            className="p-4 bg-gray-200 rounded-lg hover:bg-gray-300"
            onClick={() => handleButtonClick('*')}
          >
            *
          </button>

          <button
            className="p-4 bg-gray-200 rounded-lg hover:bg-gray-300"
            onClick={() => handleButtonClick('0')}
          >
            0
          </button>
          <button
            className="p-4 bg-gray-200 rounded-lg hover:bg-gray-300"
            onClick={() => handleButtonClick('.')}
          >
            .
          </button>
          <button
            className="p-4 bg-gray-200 rounded-lg hover:bg-gray-300"
            onClick={handleEvaluate}
          >
            =
          </button>
          <button
            className="p-4 bg-gray-200 rounded-lg hover:bg-gray-300"
            onClick={() => handleButtonClick('/')}
          >
            /
          </button>

          <button
            className="col-span-4 p-4 bg-red-500 text-white rounded-lg hover:bg-red-600"
            onClick={handleClear}
          >
            C
          </button>
        </div>
      </div>
    </Rnd>
  );
};

export default Calculator;

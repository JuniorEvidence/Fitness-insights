import React from 'react';
import axios from "axios";

const DataInputFormWireframe = () => {

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Data Input Form Wireframe</h2>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="input1">
          Input 1
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="input1"
          type="text"
          placeholder="Enter input 1"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="input2">
          Input 2
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="input2"
          type="text"
          placeholder="Enter input 2"
        />
      </div>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
        Submit
      </button>
    </div>
  );
};

export default DataInputFormWireframe;
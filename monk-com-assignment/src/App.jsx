import React, { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import ProductList from "./components/ProductList";

const App = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-4  max-w-3xl mx-auto">
        <ProductList />
      </div>
    </DndProvider>
  );
};

export default App;

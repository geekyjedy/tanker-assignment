// REACT IMPORTS
import { useState, useEffect } from "react";

// THIRDPARTY IMPORTS
import { evaluate } from 'mathjs';

// COMPONENT IMPORTS
import Button from "./components/Button";

// ICON IMPORTS
import { IoBackspaceOutline } from "react-icons/io5";
import { RxHamburgerMenu } from "react-icons/rx";
import { RiDeleteBinLine } from "react-icons/ri";

function App() {
  const [inputValue, setInputValue] = useState("0");
  const [temporaryResult, setTemporaryResult] = useState("");
  const [history, setHistory] = useState([]);
  const [memory, setMemory] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("history");
  const [isAfterEqual, setIsAfterEqual] = useState(false);

  // toggling hamburger
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);


  const handleUpdateInput = (value) => {
    if (isAfterEqual) {
      // after pressing '=', treat any input as a fresh start
      setInputValue(value);
      setTemporaryResult("");
      setIsAfterEqual(false); // reset after new input
    } else {
      setInputValue((prev) => {
        const updatedInput = prev === "0" ? value : prev + value;
        // update temporary result with the live calculation
        try {
          const sanitizedInput = updatedInput.replace(/[^0-9+\-*/().]/g, '');
          const result = evaluate(sanitizedInput);
          setTemporaryResult(result);
        } catch (error) {
          setTemporaryResult(prev); // operation sign not disply on temporary variabel
        }
        return updatedInput;
      });
    }
  };

  //clear input values
  const handleClearInput = () => {
    setInputValue("0");
    setTemporaryResult("");
  };

  // handle backspace
  const handleBackspace = () => {
    setInputValue((prev) => {
      const updatedInput = prev.length > 1 ? prev.slice(0, -1) : "0";
      // update temporary result with the live calculation
      try {
        const sanitizedInput = updatedInput.replace(/[^0-9+\-*/().]/g, '');
        const result = evaluate(sanitizedInput);
        setTemporaryResult(result);
      } catch (error) {
        setTemporaryResult(""); // clear on error
      }
      return updatedInput;
    });
  };

  // handle equal
  const handleEqual = () => {
    try {
      const result = evaluate(inputValue);
      setInputValue(result);

      // saving operation in history
      const operation = `${inputValue} = ${result}`;
      const updatedHistory = [...history, operation];
      setHistory(updatedHistory);
      localStorage.setItem("history", JSON.stringify(updatedHistory));

      // setting flag to indicate "=" was pressed, so next input is fresh
      setIsAfterEqual(true);
    } catch (error) {
      setInputValue(prev);
    }
  };

  // handle memory clear
  const handleMemoryClear = () => {
    setMemory(null);
    localStorage.removeItem("memory");
  };

  // handle memory recall
  const handleMemoryRecall = () => {
    if (memory !== null) {
      setInputValue(memory.toString());
      setTemporaryResult("")
    }
  };

  // adding value to memory
  const handleMemoryAdd = () => {
    const newMemory =
      memory !== null
        ? memory + parseFloat(inputValue)
        : parseFloat(inputValue);
    setMemory(newMemory);
    localStorage.setItem("memory", newMemory);
  };

  // subtraction value to memory and updating to new value
  const handleMemorySubtract = () => {
    const newMemory =
      memory !== null
        ? memory - parseFloat(inputValue)
        : -parseFloat(inputValue);
    setMemory(newMemory);
    localStorage.setItem("memory", newMemory);
  };

  // set value in new memory
  const handleMemoryStore = () => {
    setMemory(parseFloat(inputValue));
    localStorage.setItem("memory", inputValue);
  };

  // get the values when component mounts
  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem("history")) || [];
    const storedMemory = localStorage.getItem("memory")
      ? parseFloat(localStorage.getItem("memory"))
      : null;
    setHistory(storedHistory);
    setMemory(storedMemory);
  }, []);

  // buttons
  const staticButtons = [
    // { label: "MC", onClick: handleMemoryClear },
    { label: "MR", onClick: handleMemoryRecall },
    { label: "M+", onClick: handleMemoryAdd },
    { label: "M-", onClick: handleMemorySubtract },
    { label: "MS", onClick: handleMemoryStore },
    { label: "CE", onClick: handleClearInput },
    { label: "C", onClick: handleClearInput },
    { label: <IoBackspaceOutline />, onClick: handleBackspace },
    { label: "÷", onClick: () => handleUpdateInput("/") },
    { label: "7", onClick: () => handleUpdateInput("7") },
    { label: "8", onClick: () => handleUpdateInput("8") },
    { label: "9", onClick: () => handleUpdateInput("9") },
    { label: "x", onClick: () => handleUpdateInput("*") },
    { label: "4", onClick: () => handleUpdateInput("4") },
    { label: "5", onClick: () => handleUpdateInput("5") },
    { label: "6", onClick: () => handleUpdateInput("6") },
    { label: "-", onClick: () => handleUpdateInput("-") },
    { label: "1", onClick: () => handleUpdateInput("1") },
    { label: "2", onClick: () => handleUpdateInput("2") },
    { label: "3", onClick: () => handleUpdateInput("3") },
    { label: "+", onClick: () => handleUpdateInput("+") },
    { label: "0", onClick: () => handleUpdateInput("0") },
    { label: ".", onClick: () => handleUpdateInput(".") },
    { label: "=", onClick: handleEqual },
  ];


  return (

    <div className=" flex justify-center items-center min-h-screen bg-gray-100  px-8">
      <div className="w-full max-w-sm p-4">

        {/* hamburger */}
        <div className="self-start p-4">
          <RxHamburgerMenu className="text-3xl" onClick={toggleMenu} />
        </div>

        {/* dispaly */}
        <div className="w-full max-w-xs min-h-24 bg-white text-right text-4xl font-semibold border rounded-lg mb-6 px-4 py-2 shadow-md">
          {inputValue}
          {temporaryResult && <div className="text-gray-500 text-xl">{temporaryResult}</div>}
        </div>

        {/* btns */}
        <div>
          <Button
            label='MC'
            onClick={handleMemoryClear}
            className={`text-xl py-6 rounded-lg bg-gray-200 hover:bg-gray-300 transition duration-200 px-6 mb-3`}
          />
          <div className="grid grid-cols-4 gap-3">
            {staticButtons.map((button, index) => (
              <Button
                key={index}
                label={button.label}
                onClick={button.onClick}
                className={`text-xl py-6 rounded-lg bg-gray-200 hover:bg-gray-300
                   transition duration-200 ${button.label === '0' && "col-span-2"} ${button.label === '=' && "bg-sky-500 text-white"} flex justify-center items-cente`}
              />
            ))}
          </div>
        </div>

        {/* panel section */}
        {isMenuOpen && (
          <div className="fixed top-0 right-0 bg-white w-60 h-full shadow-md p-4">
            {/* toggle div */}
            <div className="flex justify-around mb-4">
              <button
                onClick={() => setSelectedTab("history")}
                className={`text-xl ${selectedTab === "history" ? "font-bold underline" : ""}`}
              >
                History
              </button>
              <button
                onClick={() => setSelectedTab("memory")}
                className={`text-xl ${selectedTab === "memory" ? "font-bold underline" : ""}`}
              >
                Memory
              </button>
            </div>

            {/* history tab */}
            {selectedTab === "history" && (
              <div className="mb-4 max-h-64 overflow-y-auto">
                {history.length > 0 ? (
                  history.map((entry, index) => <div key={index}>{index + 1}) {entry}</div>)
                ) : (
                  <div>No history</div>
                )}
                <RiDeleteBinLine onClick={() => {
                  setHistory([]);
                  localStorage.removeItem("history");
                }} size={28} />
              </div>
            )}

            {/* memory tab */}
            {selectedTab === "memory" && (
              <>
                <div>{memory !== null ? `${memory}` : "No Memory"}</div>
                <RiDeleteBinLine onClick={handleMemoryClear} size={28} />
              </>
            )}

          </div>
        )}
      </div>
    </div>
  );
}

export default App;

'use client';

import { useState } from 'react';
import { X, Copy } from 'lucide-react';

interface CalculatorProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Calculator({ isOpen, onClose }: CalculatorProps) {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(num);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const inputOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue: number, secondValue: number, operation: string) => {
    let result: number;
    switch (operation) {
      case '+':
        result = firstValue + secondValue;
        break;
      case '-':
        result = firstValue - secondValue;
        break;
      case '×':
        result = firstValue * secondValue;
        break;
      case '÷':
        result = firstValue / secondValue;
        break;
      case '=':
        result = secondValue;
        break;
      default:
        result = secondValue;
    }
    return Math.round(result * 100) / 100;
  };

  const performCalculation = () => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation);
      setDisplay(String(newValue));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForOperand(true);
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(display);
    } catch (err) {
      console.error('Erreur lors de la copie:', err);
    }
  };

/*   const pasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const number = parseFloat(text);
      if (!isNaN(number)) {
        setDisplay(String(number));
        setWaitingForOperand(false);
      }
    } catch (err) {
      console.error('Erreur lors du collage:', err);
    }
  }; */

  console.log('Calculator isOpen:', isOpen); // Debug
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-base-300/20 backdrop-blur-sm flex items-center justify-center z-[9999]">
      <div className="bg-base-100 rounded-lg p-6 w-80 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Calculatrice</h2>
          <button onClick={onClose} className="btn btn-ghost btn-sm">
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <div className="bg-base-200 p-4 rounded mb-4">
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <button onClick={copyToClipboard} className="btn btn-ghost btn-xs" title="Copier">
                <Copy className="w-4 h-4" />
              </button>
            </div>
            <div className="text-right text-2xl font-mono">{display}</div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2">
          <button onClick={clear} className="btn btn-error col-span-2">C</button>
          <button onClick={() => inputOperation('÷')} className="btn btn-primary">÷</button>
          <button onClick={() => inputOperation('×')} className="btn btn-primary">×</button>
          
          <button onClick={() => inputNumber('7')} className="btn">7</button>
          <button onClick={() => inputNumber('8')} className="btn">8</button>
          <button onClick={() => inputNumber('9')} className="btn">9</button>
          <button onClick={() => inputOperation('-')} className="btn btn-primary">-</button>
          
          <button onClick={() => inputNumber('4')} className="btn">4</button>
          <button onClick={() => inputNumber('5')} className="btn">5</button>
          <button onClick={() => inputNumber('6')} className="btn">6</button>
          <button onClick={() => inputOperation('+')} className="btn btn-primary">+</button>
          
          <button onClick={() => inputNumber('1')} className="btn">1</button>
          <button onClick={() => inputNumber('2')} className="btn">2</button>
          <button onClick={() => inputNumber('3')} className="btn">3</button>
          <button onClick={performCalculation} className="btn btn-success row-span-2">=</button>
          
          <button onClick={() => inputNumber('0')} className="btn col-span-2">0</button>
          <button onClick={() => inputNumber('.')} className="btn">.</button>
        </div>
      </div>
    </div>
  );
}
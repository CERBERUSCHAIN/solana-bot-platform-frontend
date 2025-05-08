// CERBERUS Bot - Strategy Canvas Component
// Created: 2025-05-06 21:53:14 UTC
// Author: CERBERUSCHAIN

import React, { useState, useRef, useEffect, useCallback } from 'react';
// Use dynamic import for React-Konva components rather than type imports
// In a real app, you would install the dependency with: npm install react-konva konva
import {
  Strategy,
  StrategyElementUnion,
  StrategyElementType,
  LogicElement
} from '../../types/strategy';
import { useStrategy } from '../../contexts/StrategyContext';

interface StrategyCanvasProps {
  strategy: Strategy;
  onElementSelect: (element: StrategyElementUnion) => void;
  validationResults?: {
    isValid: boolean;
    errors: Array<{ elementId: string; error: string; }>;
    warnings: Array<{ elementId: string; warning: string; }>;
  } | null;
}

interface ElementPosition {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: StrategyElementType;
}

// Define a more generic type for the stage ref
interface StageRef {
  scaleX(): number;
  scale(opts: { x: number; y: number }): void;
  x(): number;
  y(): number;
  position(pos: { x: number; y: number }): void;
  getPointerPosition(): { x: number; y: number } | null;
}

// Create a proper React component for the element card
interface ElementCardProps {
  elementId: string;
  element: StrategyElementUnion;
  position: ElementPosition;
  isSelected: boolean;
  stageScale: number;
  stagePos: { x: number; y: number };
  onSelect: (elementId: string) => void;
  onDragMove: (elementId: string, x: number, y: number) => void;
  onDragEnd: (elementId: string) => void;
  validationResults?: StrategyCanvasProps['validationResults'];
}

// Element Card component - now hooks can be used correctly
const ElementCard: React.FC<ElementCardProps> = ({
  elementId,
  element,
  position,
  isSelected,
  stageScale,
  stagePos,
  onSelect,
  onDragMove,
  onDragEnd,
  validationResults
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Get error status
  const getErrorStatus = () => {
    if (!validationResults) return null;
    
    const error = validationResults.errors.find(e => e.elementId === elementId);
    if (error) return { type: 'error', message: error.error };
    
    const warning = validationResults.warnings.find(w => w.elementId === elementId);
    if (warning) return { type: 'warning', message: warning.warning };
    
    return null;
  };
  
  // Get element colors
  const getElementColor = (type: StrategyElementType) => {
    // Trigger elements
    if ([
      StrategyElementType.PRICE_MOVEMENT,
      StrategyElementType.TIME_TRIGGER,
      StrategyElementType.INDICATOR_CROSS,
      StrategyElementType.VOLUME_SPIKE,
      StrategyElementType.PRICE_THRESHOLD
    ].includes(type)) {
      return {
        fill: 'bg-blue-500 bg-opacity-20',
        stroke: 'border-blue-500',
        text: 'text-blue-300'
      };
    }
    
    // Condition elements
    if ([
      StrategyElementType.HIGHER_THAN,
      StrategyElementType.LOWER_THAN,
      StrategyElementType.BETWEEN,
      StrategyElementType.OUTSIDE,
      StrategyElementType.EQUALS
    ].includes(type)) {
      return {
        fill: 'bg-amber-500 bg-opacity-20',
        stroke: 'border-amber-700',
        text: 'text-amber-300'
      };
    }
    
    // Indicator elements
    if ([
      StrategyElementType.MOVING_AVERAGE,
      StrategyElementType.RSI,
      StrategyElementType.MACD,
      StrategyElementType.BOLLINGER_BANDS,
      StrategyElementType.STOCHASTIC
    ].includes(type)) {
      return {
        fill: 'bg-purple-500 bg-opacity-20',
        stroke: 'border-purple-500',
        text: 'text-purple-300'
      };
    }
    
    // Action elements
    if ([
      StrategyElementType.BUY,
      StrategyElementType.SELL,
      StrategyElementType.ALERT,
      StrategyElementType.SWAP,
      StrategyElementType.LIMIT_ORDER,
      StrategyElementType.STOP_LOSS,
      StrategyElementType.TAKE_PROFIT
    ].includes(type)) {
      return {
        fill: 'bg-green-500 bg-opacity-20',
        stroke: 'border-green-600',
        text: 'text-green-300'
      };
    }
    
    // Logic elements
    if ([
      StrategyElementType.AND,
      StrategyElementType.OR,
      StrategyElementType.NOT,
      StrategyElementType.IF_THEN,
      StrategyElementType.IF_THEN_ELSE
    ].includes(type)) {
      return {
        fill: 'bg-indigo-500 bg-opacity-20',
        stroke: 'border-indigo-500',
        text: 'text-indigo-300'
      };
    }
    
    // Default
    return {
      fill: 'bg-gray-500 bg-opacity-20',
      stroke: 'border-gray-600',
      text: 'text-gray-300'
    };
  };
  
  // Get summary text
  const getElementSummary = (): string => {
    switch (element.type) {
      case StrategyElementType.MOVING_AVERAGE:
      case StrategyElementType.RSI:
        // Type-safe way to check for properties
        if ('parameters' in element && element.parameters?.period) {
          return `Period: ${element.parameters.period}`;
        }
        return 'Period: N/A';
        
      case StrategyElementType.BUY:
      case StrategyElementType.SELL:
        // Type-safe way to check for properties
        if ('parameters' in element && element.parameters?.amount) {
          return `Amount: ${element.parameters.amount}`;
        }
        return 'Amount: N/A';
        
      case StrategyElementType.AND:
      case StrategyElementType.OR:
        // Type-safe way to check for properties
        if ('childIds' in element) {
          return `${element.childIds.length} conditions`;
        }
        return '';
        
      default:
        return '';
    }
  };

  // Setup dragging functionality
  const onMouseDown = useCallback((e: React.MouseEvent) => {
    onSelect(elementId);
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
    
    // Add global event listeners for drag handling
    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (isDragging) {
        const newX = moveEvent.clientX - dragOffset.x;
        const newY = moveEvent.clientY - dragOffset.y;
        onDragMove(elementId, newX, newY);
      }
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
      onDragEnd(elementId);
      // Remove event listeners
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [elementId, isDragging, dragOffset, onSelect, onDragMove, onDragEnd, position.x, position.y]);

  const errorStatus = getErrorStatus();
  const colors = getElementColor(element.type);

  return (
    <div 
      className={`absolute rounded-lg shadow-md cursor-pointer border-2 ${colors.fill} ${colors.stroke} ${colors.text} ${
        isSelected ? 'ring-2 ring-indigo-500' : ''
      }`}
      style={{
        left: position.x,
        top: position.y,
        width: position.width,
        height: position.height,
        transform: `scale(${stageScale}) translate(${stagePos.x/stageScale}px, ${stagePos.y/stageScale}px)`
      }}
      onClick={() => onSelect(elementId)}
      onMouseDown={onMouseDown}
    >
      <div className="font-bold mb-1 text-center py-2">{element.name}</div>
      <div className="text-xs text-gray-400 text-center">{element.type.toString().replace('_', ' ')}</div>
      <div className="text-xs text-gray-300 mt-1 text-center">{getElementSummary()}</div>
      
      {errorStatus && (
        <div 
          className={`absolute top-2 right-2 w-3 h-3 rounded-full ${
            errorStatus.type === 'error' ? 'bg-red-500' : 'bg-amber-500'
          }`}
        />
      )}
    </div>
  );
};

export const StrategyCanvas: React.FC<StrategyCanvasProps> = ({ 
  strategy, 
  onElementSelect,
  validationResults 
}) => {
  const { updateStrategyElement } = useStrategy();
  const [positions, setPositions] = useState<Record<string, ElementPosition>>({});
  const [connections, setConnections] = useState<Array<{
    from: { id: string; point: { x: number; y: number } };
    to: { id: string; point: { x: number; y: number } };
  }>>([]);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [stageScale, setStageScale] = useState<number>(1);
  const [stagePos, setStagePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [canvasSize, setCanvasSize] = useState<{ width: number; height: number }>({ width: 1000, height: 800 });
  const stageRef = useRef<StageRef | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Define calculatePositions before using it in useEffect
  const calculatePositions = useCallback(() => {
    // This is a simplified layout algorithm
    // In a real implementation, you'd want a more sophisticated approach
    // like a hierarchical or force-directed graph layout
    
    const layout: Record<string, ElementPosition> = {};
    const newConnections: Array<{
      from: { id: string; point: { x: number; y: number } };
      to: { id: string; point: { x: number; y: number } };
    }> = [];
    
    const elementWidth = 180;
    const elementHeight = 80;
    const horizontalPadding = 100;
    const verticalPadding = 120;
    
    // Start with the root element
    const rootElement = strategy.elements[strategy.rootElementId];
    if (!rootElement) return;
    
    // Position the root element
    layout[rootElement.id] = {
      id: rootElement.id,
      x: canvasSize.width / 2 - elementWidth / 2,
      y: 50,
      width: elementWidth,
      height: elementHeight,
      type: rootElement.type
    };
    
    // Helper function for recursive layout
    const positionChildren = (
      parentId: string,
      childIds: string[],
      level: number,
      horizontalOffset = 0
    ) => {
      if (childIds.length === 0) return { width: 0, centerX: layout[parentId].x + elementWidth / 2 };
      
      const y = level * verticalPadding + 50;
      const totalWidth = childIds.length * (elementWidth + horizontalPadding) - horizontalPadding;
      const startX = canvasSize.width / 2 - totalWidth / 2 + horizontalOffset;
      
      let childrenCenterX = 0;
      
      childIds.forEach((childId, index) => {
        const child = strategy.elements[childId];
        if (!child) return;
        
        const x = startX + index * (elementWidth + horizontalPadding);
        layout[childId] = {
          id: childId,
          x,
          y,
          width: elementWidth,
          height: elementHeight,
          type: child.type
        };
        
        // Add connection from parent to child
        newConnections.push({
          from: {
            id: parentId,
            point: {
              x: layout[parentId].x + elementWidth / 2,
              y: layout[parentId].y + elementHeight
            }
          },
          to: {
            id: childId,
            point: {
              x: x + elementWidth / 2,
              y
            }
          }
        });
        
        // If this is a logic element, recursively position its children
        if ('childIds' in child) {
          const logicElement = child as LogicElement;
          positionChildren(childId, logicElement.childIds, level + 1, 0);
        }
        
        childrenCenterX += x + elementWidth / 2;
      });
      
      return {
        width: totalWidth,
        centerX: childIds.length > 0 ? childrenCenterX / childIds.length : layout[parentId].x + elementWidth / 2
      };
    };
    
    // Position all elements starting from the root
    if ('childIds' in rootElement) {
      const logicRoot = rootElement as LogicElement;
      positionChildren(rootElement.id, logicRoot.childIds, 1);
    }
    
    setPositions(layout);
    setConnections(newConnections);
  }, [strategy, canvasSize]);
  
  // Calculate element positions and connections on strategy changes
  useEffect(() => {
    calculatePositions();
  }, [strategy, calculatePositions]);
  
  // Adjust canvas size on container resize
  useEffect(() => {
    if (containerRef.current) {
      const updateSize = () => {
        setCanvasSize({
          width: containerRef.current?.offsetWidth || 1000,
          height: containerRef.current?.offsetHeight || 800
        });
      };
      
      updateSize();
      
      const observer = new ResizeObserver(updateSize);
      // Fix stale ref issue by capturing current value
      const currentContainer = containerRef.current;
      observer.observe(currentContainer);
      
      return () => {
        observer.unobserve(currentContainer);
      };
    }
  }, []);
  
  const handleElementDragMove = (elementId: string, newX: number, newY: number) => {
    setPositions(prev => ({
      ...prev,
      [elementId]: {
        ...prev[elementId],
        x: newX,
        y: newY
      }
    }));
    
    // Update connections
    setConnections(prev => prev.map(conn => {
      if (conn.from.id === elementId) {
        return {
          ...conn,
          from: {
            id: elementId,
            point: {
              x: newX + positions[elementId].width / 2,
              y: newY + positions[elementId].height
            }
          }
        };
      } else if (conn.to.id === elementId) {
        return {
          ...conn,
          to: {
            id: elementId,
            point: {
              x: newX + positions[elementId].width / 2,
              y: newY
            }
          }
        };
      }
      return conn;
    }));
  };
  
  const handleElementDragEnd = async (elementId: string) => {
    // Save the position to the backend or local state
    console.log(`Element ${elementId} moved to:`, positions[elementId]);
    
    try {
      const element = strategy.elements[elementId];
      const updatedElement = {
        ...element,
        // Store position data in a way that works for all element types
        _position: {
          x: positions[elementId].x,
          y: positions[elementId].y
        }
      };
      
      await updateStrategyElement(strategy.id, elementId, updatedElement);
    } catch (error) {
      console.error('Error saving element position:', error);
    }
  };
  
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    
    const scaleBy = 1.1;
    const stage = stageRef.current;
    if (!stage) return;
    
    const oldScale = stage.scaleX();
    
    const pointerPosition = stage.getPointerPosition();
    if (!pointerPosition) return;
    
    const mousePointTo = {
      x: (pointerPosition.x - stage.x()) / oldScale,
      y: (pointerPosition.y - stage.y()) / oldScale,
    };
    
    const newScale = e.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;
    
    // Limit zoom level
    if (newScale < 0.1 || newScale > 3) return;
    
    stage.scale({ x: newScale, y: newScale });
    
    const newPos = {
      x: pointerPosition.x - mousePointTo.x * newScale,
      y: pointerPosition.y - mousePointTo.y * newScale,
    };
    stage.position(newPos);
    
    setStageScale(newScale);
    setStagePos(newPos);
  };
  
  const handleElementClick = (elementId: string) => {
    setSelectedElementId(elementId);
    onElementSelect(strategy.elements[elementId]);
  };
  
  return (
    <div ref={containerRef} className="h-full w-full overflow-hidden bg-gray-900 relative">
      <div 
        className="w-full h-full bg-grid-pattern"
        style={{
          backgroundImage: 'linear-gradient(#1f2937 1px, transparent 1px), linear-gradient(90deg, #1f2937 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
        onWheel={handleWheel}
      >
        {/* Draw connections */}
        <svg 
          className="absolute inset-0 w-full h-full z-0"
          viewBox={`0 0 ${canvasSize.width} ${canvasSize.height}`}
        >
          {connections.map((conn, idx) => (
            <line
              key={`connection-${idx}`}
              x1={conn.from.point.x}
              y1={conn.from.point.y}
              x2={conn.to.point.x}
              y2={conn.to.point.y}
              stroke="#4b5563"
              strokeWidth="2"
            />
          ))}
        </svg>
        
        {/* Render elements with proper component */}
        {Object.keys(positions).map(elementId => (
          <ElementCard
            key={elementId}
            elementId={elementId}
            element={strategy.elements[elementId]}
            position={positions[elementId]}
            isSelected={selectedElementId === elementId}
            stageScale={stageScale}
            stagePos={stagePos}
            onSelect={handleElementClick}
            onDragMove={handleElementDragMove}
            onDragEnd={handleElementDragEnd}
            validationResults={validationResults}
          />
        ))}
      </div>
        
      {/* Empty State */}
      {Object.keys(positions).length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center text-center p-4">
          <div>
            <svg className="mx-auto h-12 w-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-300">No elements</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by dragging elements from the palette
            </p>
          </div>
        </div>
      )}
      
      {/* Zoom Controls */}
      <div className="absolute bottom-4 right-4 bg-gray-800 rounded-lg shadow p-2 flex space-x-2">
        <button
          className="w-8 h-8 flex items-center justify-center bg-gray-700 hover:bg-gray-600 rounded-md text-gray-300"
          onClick={() => {
            const newScale = Math.min(stageScale * 1.2, 3);
            setStageScale(newScale);
          }}
          aria-label="Zoom in"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
        </button>
        
        <button
          className="w-8 h-8 flex items-center justify-center bg-gray-700 hover:bg-gray-600 rounded-md text-gray-300"
          onClick={() => {
            const newScale = Math.max(stageScale / 1.2, 0.1);
            setStageScale(newScale);
          }}
          aria-label="Zoom out"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 12H6"></path>
          </svg>
        </button>
        
        <button
          className="w-8 h-8 flex items-center justify-center bg-gray-700 hover:bg-gray-600 rounded-md text-gray-300"
          onClick={() => {
            setStageScale(1);
            setStagePos({ x: 0, y: 0 });
          }}
          aria-label="Reset view"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5"></path>
          </svg>
        </button>
      </div>
    </div>
  );
};
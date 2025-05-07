// CERBERUS Bot - Strategy Canvas Component
// Created: 2025-05-06 21:53:14 UTC
// Author: CERBERUSCHAINYou coding has frozen, StrategyCanvas.tsx is NOT complete

import React, { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Rect, Group, Text, Arrow, Circle, Line } from 'react-konva';
import {
  Strategy,
  StrategyElementUnion,
  StrategyElementType,
  LogicElement,
  ActionElement,
  ConditionElement,
  TriggerElement,
  IndicatorElement
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
  const stageRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Calculate element positions and connections on strategy changes
  useEffect(() => {
    calculatePositions();
  }, [strategy]);
  
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
      observer.observe(containerRef.current);
      
      return () => {
        if (containerRef.current) {
          observer.unobserve(containerRef.current);
        }
      };
    }
  }, [containerRef]);
  
  const calculatePositions = () => {
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
      let startX = canvasSize.width / 2 - totalWidth / 2 + horizontalOffset;
      
      let totalChildWidth = 0;
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
        
        totalChildWidth += elementWidth;
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
  };
  
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
    // In a real implementation, you might want to store element positions
    console.log(`Element ${elementId} moved to:`, positions[elementId]);
    
    // For this example, we're just updating the element's properties with position data
    // This isn't part of the standard Strategy interface, but you could extend it
    try {
      await updateStrategyElement(strategy.id, elementId, {
        ...strategy.elements[elementId],
        // Store position as a custom parameter
        parameters: {
          ...(strategy.elements[elementId].parameters || {}),
          _position: {
            x: positions[elementId].x,
            y: positions[elementId].y
          }
        }
      });
    } catch (error) {
      console.error('Error saving element position:', error);
    }
  };
  
  const handleWheel = (e: any) => {
    e.evt.preventDefault();
    
    const scaleBy = 1.1;
    const stage = stageRef.current;
    const oldScale = stage.scaleX();
    
    const pointerPosition = stage.getPointerPosition();
    const mousePointTo = {
      x: (pointerPosition.x - stage.x()) / oldScale,
      y: (pointerPosition.y - stage.y()) / oldScale,
    };
    
    const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;
    
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
  
  const handleDragStart = (e: any) => {
    const id = e.target.id();
    if (id) {
      setSelectedElementId(id);
      onElementSelect(strategy.elements[id]);
    }
  };
  
  const handleElementClick = (elementId: string) => {
    setSelectedElementId(elementId);
    onElementSelect(strategy.elements[elementId]);
  };
  
  const getElementErrorStatus = (elementId: string) => {
    if (!validationResults) return null;
    
    const error = validationResults.errors.find(e => e.elementId === elementId);
    if (error) return { type: 'error', message: error.error };
    
    const warning = validationResults.warnings.find(w => w.elementId === elementId);
    if (warning) return { type: 'warning', message: warning.warning };
    
    return null;
  };
  
  const getElementColor = (type: StrategyElementType) => {
    // Trigger elements
    if (
      type === StrategyElementType.PRICE_MOVEMENT ||
      type === StrategyElementType.TIME_TRIGGER ||
      type === StrategyElementType.INDICATOR_CROSS ||
      type === StrategyElementType.VOLUME_SPIKE ||
      type === StrategyElementType.PRICE_THRESHOLD
    ) {
      return {
        fill: 'rgba(59, 130, 246, 0.2)',
        stroke: '#3b82f6',
        text: '#93c5fd'
      };
    }
    
    // Condition elements
    if (
      type === StrategyElementType.HIGHER_THAN ||
      type === StrategyElementType.LOWER_THAN ||
      type === StrategyElementType.BETWEEN ||
      type === StrategyElementType.OUTSIDE ||
      type === StrategyElementType.EQUALS
    ) {
      return {
        fill: 'rgba(251, 191, 36, 0.2)',
        stroke: '#d97706',
        text: '#fcd34d'
      };
    }
    
    // Indicator elements
    if (
      type === StrategyElementType.MOVING_AVERAGE ||
      type === StrategyElementType.RSI ||
      type === StrategyElementType.MACD ||
      type === StrategyElementType.BOLLINGER_BANDS ||
      type === StrategyElementType.STOCHASTIC
    ) {
      return {
        fill: 'rgba(139, 92, 246, 0.2)',
        stroke: '#8b5cf6',
        text: '#c4b5fd'
      };
    }
    
    // Action elements
    if (
      type === StrategyElementType.BUY ||
      type === StrategyElementType.SELL ||
      type === StrategyElementType.ALERT ||
      type === StrategyElementType.SWAP ||
      type === StrategyElementType.LIMIT_ORDER ||
      type === StrategyElementType.STOP_LOSS ||
      type === StrategyElementType.TAKE_PROFIT
    ) {
      return {
        fill: 'rgba(16, 185, 129, 0.2)',
        stroke: '#10b981',
        text: '#6ee7b7'
      };
    }
    
    // Logic elements
    if (
      type === StrategyElementType.AND ||
      type === StrategyElementType.OR ||
      type === StrategyElementType.NOT ||
      type === StrategyElementType.IF_THEN ||
      type === StrategyElementType.IF_THEN_ELSE
    ) {
      return {
        fill: 'rgba(99, 102, 241, 0.2)',
        stroke: '#6366f1',
        text: '#a5b4fc'
      };
    }
    
    // Default
    return {
      fill: 'rgba(107, 114, 128, 0.2)',
      stroke: '#6b7280',
      text: '#d1d5db'
    };
  };
  
  const renderElement = (elementId: string) => {
    const element = strategy.elements[elementId];
    const position = positions[elementId];
    
    if (!element || !position) return null;
    
    const colors = getElementColor(element.type);
    const errorStatus = getElementErrorStatus(elementId);
    const strokeWidth = selectedElementId === elementId ? 2 : 1;
    
    return (
      <Group
        key={elementId}
        id={elementId}
        x={position.x}
        y={position.y}
        width={position.width}
        height={position.height}
        draggable
        onDragMove={(e) => handleElementDragMove(elementId, e.target.x(), e.target.y())}
        onDragEnd={() => handleElementDragEnd(elementId)}
        onDragStart={handleDragStart}
        onClick={() => handleElementClick(elementId)}
      >
        {/* Element Rectangle */}
        <Rect
          width={position.width}
          height={position.height}
          fill={colors.fill}
          stroke={errorStatus?.type === 'error' ? '#ef4444' : 
                errorStatus?.type === 'warning' ? '#f59e0b' : colors.stroke}
          strokeWidth={strokeWidth}
          cornerRadius={8}
          shadowColor="black"
          shadowBlur={5}
          shadowOpacity={0.3}
          shadowOffset={{ x: 2, y: 2 }}
        />
        
        {/* Element Title */}
        <Text
          text={element.name}
          width={position.width}
          height={20}
          y={10}
          align="center"
          fill={colors.text}
          fontStyle="bold"
        />
        
        {/* Element Type */}
        <Text
          text={element.type.toString().replace('_', ' ')}
          width={position.width}
          height={20}
          y={30}
          align="center"
          fill="#9ca3af"
          fontSize={12}
        />
        
        {/* Element Value or Parameters Summary */}
        <Text
          text={getElementSummary(element)}
          width={position.width}
          height={20}
          y={50}
          align="center"
          fill="#d1d5db"
          fontSize={11}
          ellipsis={true}
        />
        
        {/* Error Indicator */}
        {errorStatus && (
          <Circle
            x={position.width - 10}
            y={10}
            radius={6}
            fill={errorStatus.type === 'error' ? '#ef4444' : '#f59e0b'}
          />
        )}
      </Group>
    );
  };
  
  const getElementSummary = (element: StrategyElementUnion): string => {
    switch (element.type) {
      case StrategyElementType.MOVING_AVERAGE:
        return `Period: ${(element as IndicatorElement).parameters?.period || 'N/A'}`;
      case StrategyElementType.RSI:
        return `Period: ${(element as IndicatorElement).parameters?.period || 'N/A'}`;
      case StrategyElementType.BUY:
      case StrategyElementType.SELL:
        return `Amount: ${(element as ActionElement).parameters?.amount || 'N/A'}`;
      case StrategyElementType.AND:
      case StrategyElementType.OR:
        return `${(element as LogicElement).childIds.length} conditions`;
      default:
        return '';
    }
  };
  
  return (
    <div ref={containerRef} className="h-full w-full overflow-hidden bg-gray-900">
      <Stage
        ref={stageRef}
        width={canvasSize.width}
        height={canvasSize.height}
        onWheel={handleWheel}
        draggable
        onDragEnd={(e) => {
          setStagePos({ x: e.target.x(), y: e.target.y() });
        }}
        scaleX={stageScale}
        scaleY={stageScale}
        x={stagePos.x}
        y={stagePos.y}
      >
        <Layer>
          {/* Grid Background */}
          {Array.from({ length: Math.ceil(canvasSize.width / 40) + 1 }).map((_, i) => (
            <Line
              key={`vgrid-${i}`}
              points={[i * 40, 0, i * 40, canvasSize.height]}
              stroke="#1f2937"
              strokeWidth={1}
            />
          ))}
          
          {Array.from({ length: Math.ceil(canvasSize.height / 40) + 1 }).map((_, i) => (
            <Line
              key={`hgrid-${i}`}
              points={[0, i * 40, canvasSize.width, i * 40]}
              stroke="#1f2937"
              strokeWidth={1}
            />
          ))}
          
          {/* Connections */}
          {connections.map((conn, idx) => (
            <Arrow
              key={`connection-${idx}`}
              points={[
                conn.from.point.x,
                conn.from.point.y,
                conn.to.point.x,
                conn.to.point.y
              ]}
              stroke="#4b5563"
              strokeWidth={2}
              fill="#4b5563"
              pointerLength={5}
              pointerWidth={5}
            />
          ))}
          
          {/* Elements */}
          {Object.keys(positions).map(elementId => renderElement(elementId))}
        </Layer>
      </Stage>
      
      {/* Drop Zone Indicator for Drag & Drop (if needed) */}
      {/* This would be implemented here to show where elements can be dropped */}
      
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
            stageRef.current.scale({ x: newScale, y: newScale });
          }}
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
            stageRef.current.scale({ x: newScale, y: newScale });
          }}
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
            stageRef.current.scale({ x: 1, y: 1 });
            stageRef.current.position({ x: 0, y: 0 });
          }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5"></path>
          </svg>
        </button>
      </div>
    </div>
  );
};


import React, { useRef, useCallback } from 'react';
import AuthService from "components/Auth/AuthService.js";
//ReactFlow imports
import {
    ReactFlow,
    ReactFlowProvider,
    addEdge,
    useNodesState,
    useEdgesState,
    Controls,
    useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import './index.css';

import Sidebar from './Sidebar';
import nodesData from './Nodes'
import './nodes.css';

const initialNodes = [
    {
        id: '1',
        type: 'input',
        data: { label: 'input node' },
        position: { x: 250, y: 5 },
    },
];

let id = 0;
const getId = () => `node_${id++}`;

const Draft = () => {
    const reactFlowWrapper = useRef(null);
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const { screenToFlowPosition } = useReactFlow();

    const nodeTypes = {};
    for (var key in nodesData) {
        if (nodesData.hasOwnProperty(key)) {
            nodeTypes[key] = nodesData[key].node;
        }
    }
    console.log('nodeTypes: ', nodeTypes);

    const Auth = React.useContext(AuthService.Context);

    const onConnect = useCallback(
        (params) => setEdges((eds) => addEdge(params, eds)),
        [],
    );

    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback(
        (event) => {
            event.preventDefault();

            const type = event.dataTransfer.getData('application/reactflow');

            // check if the dropped element is valid
            if (typeof type === 'undefined' || !type) {
                return;
            }

            // project was renamed to screenToFlowPosition
            // and you don't need to subtract the reactFlowBounds.left/top anymore
            // details: https://reactflow.dev/whats-new/2023-11-10
            const position = screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });
            const newNode = {
                id: getId(),
                type,
                position,
                data: { label: `${type} node` },
            };

            setNodes((nds) => nds.concat(newNode));
        },
        [screenToFlowPosition],
    );

    return (
        <div className="flow">
            <div className="reactflow-wrapper" ref={reactFlowWrapper}>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    nodeTypes={nodeTypes}
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                    fitView
                >
                    <Controls />
                </ReactFlow>
            </div>
            <Sidebar nodeTypes={Object.values(nodesData) } />
        </div>
    );
};

export default () => (
    <ReactFlowProvider>
        <Draft />
    </ReactFlowProvider>
);

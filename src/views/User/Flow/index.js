import React, { useRef, useCallback, useState, useEffect } from 'react';
import { useParams } from 'react-router';
import Services from "Services";
import DeployModal from "./DeployModal.js";
//ReactFlow imports
import {
    ReactFlow,
    ReactFlowProvider,
    addEdge,
    useNodesState,
    useEdgesState,
    Controls,
    useReactFlow,
    Panel,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import './index.css';
import {
    Flex,
    Button,
    ButtonGroup,
    useDisclosure,
} from "@chakra-ui/react";

import Sidebar from './Sidebar';
import Console from './Console';
import nodesData from './Nodes'
import './nodes.css';
import StrategyService from '../../../Services/Strategy/index.js';

const Mode = {
    view: 'view',
    edit: 'edit'
}

const nodeTypes = {};
for (var key in nodesData) {
    if (nodesData.hasOwnProperty(key)) {
        nodeTypes[key] = nodesData[key].node;
    }
}
console.log('nodeTypes: ', nodeTypes);

const Edit = (props) => {
    const { id } = props;

    const initialNodes = [];
    let nodeId = 0;
    const getId = () => `node_${nodeId++}`;
    const flowKey = 'draft';

    const reactFlowWrapper = useRef(null);
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const { screenToFlowPosition } = useReactFlow();
    const [rfInstance, setRfInstance] = useState(null);
    const { setViewport } = useReactFlow();

    useEffect(() => {
        const editFlow = async (id) => {
            try {
                var flow = JSON.parse(await Services.strategy.editStrategy(id));
                console.log('restoreFlow flow: ', flow);
                if (flow) {
                    setNodes(flow.nodes || []);
                    setEdges(flow.edges || []);
                }
            } catch (err) {
                console.log(err);
            }
        };
        console.log('restoreFlow id: ', id);
        if (id != 'new' & Number.parseInt(id) >= 0) editFlow(id);
    }, []);

    const { isOpen, onOpen, onClose } = useDisclosure() //For modal control

    const onConnect = useCallback(
        (params) => setEdges((eds) => addEdge(params, eds)),
        [setEdges],
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
                data: {
                    label: `${type} node`,
                    parameters: {},
                },
                isEditable: true,
            };

            setNodes((nds) => nds.concat(newNode));
        },
        [screenToFlowPosition],
    );

    const onSave = useCallback(() => {
        if (rfInstance) {
            const flow = rfInstance.toObject();
            console.log('flow: ', flow);
            localStorage.setItem(flowKey, JSON.stringify(flow));
        }
    }, [rfInstance]);

    const onRestore = useCallback(() => {
        const restoreFlow = async () => {
            const flow = JSON.parse(localStorage.getItem(flowKey));
            console.log('flow: ', flow);

            if (flow) {
                const { x = 0, y = 0, zoom = 1 } = flow.viewport;
                setNodes(flow.nodes || []);
                setEdges(flow.edges || []);
                setViewport({ x, y, zoom });
            }
        };

        restoreFlow();
    }, [setNodes, setViewport]);

    const onDeploy = async(formData) => {
        const flow = rfInstance.toObject();
        formData.flow = flow;
        await Services.strategy.deploy(formData);
    };

    return (
        <div className="flow">
            <DeployModal isOpen={isOpen} onClose={onClose} onSubmit={onDeploy} />
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
                    onInit={setRfInstance}
                    fitView
                >
                    <Controls />
                    <Panel position="top-right">
                        <ButtonGroup size='xs' isAttached variant='outline'>
                            <Button onClick={onSave}>Save</Button>
                            <Button onClick={onRestore}>Restore</Button>
                            <Button onClick={onOpen}>Deploy</Button>
                        </ButtonGroup>
                    </Panel>
                </ReactFlow>
            </div>
            <Sidebar nodeTypes={Object.values(nodesData) } />
        </div>
    );
};
const View = (props) => {
    const { id } = props;
    const reactFlowWrapper = useRef(null);

    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    const nodeTypes = {};
    for (var key in nodesData) {
        if (nodesData.hasOwnProperty(key)) {
            nodeTypes[key] = nodesData[key].node;
        }
    }
    useEffect(() => {
        const loadFlow = async (id) => {
            try {
                var flow = JSON.parse(await Services.strategy.viewStrategy(id));
                console.log('flow: ', flow);
                if (flow) {
                    setNodes(flow.nodes || []);
                    setEdges(flow.edges || []);
                }
            } catch (e) {
                console.log(e);
            }
        };

        if (id) loadFlow(id);
    }, []);

    const ws = useRef(null);
    const websocketUrl = 'ws://localhost:8080';
    useEffect(() => {
        // Initialize WebSocket connection
        ws.current = new WebSocket(websocketUrl);

        ws.current.onopen = () => {
            console.log('Connected to the WebSocket server');
            // Send the authentication message with the token and ID
            var payload = { type: 'authenticate', token: Services.auth.getToken(), strategyId: id };
            ws.current.send(JSON.stringify(payload));
        };

        ws.current.onmessage = (event) => {
            console.log('Received event:', event);
            const message = JSON.parse(event.data);
            console.log('Received message:', message);
            // Update logs
            if (message.type == 'log') window.addConsoleMessage(message.data);
        };

        ws.current.onclose = () => {
            console.log('Disconnected from the WebSocket server');
        };

        ws.current.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        // Clean up the WebSocket connection on component unmount
        return () => {
            ws.current.close();
        };
    }, []);


    const onStart = async () => {
        Services.strategy.start(id);
        //auth.stopStrategy(id);
    };
    const onStop = async () => {
        //auth.startStrategy(id);
    };

    return (
        <Flex flexDirection='column'>
        <div className="flow">
            <div className="reactflow-wrapper" ref={reactFlowWrapper}>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    nodeTypes={nodeTypes}
                    fitView
                    elementsSelectable={false}
                    nodesConnectable={false}
                    nodesDraggable={false}
                >
                    <Controls />
                    <Panel position="bottom-right">
                        <ButtonGroup size='xs' isAttached variant='outline'>
                            <Button onClick={onStart}>Start</Button>
                            <Button onClick={onStop}>Stop</Button>
                        </ButtonGroup>
                    </Panel>
                </ReactFlow>
            </div>
            </div>
            <Console />
        </Flex>
    );
};

export default () => {
    const params = useParams();
    console.log('params: ', params);
    return (
        <Flex flexDirection='column' pt={{ base: "120px", md: "75px" }}>
            <ReactFlowProvider>
                {params.mode == Mode.edit ? (<Edit id={params.id} />) : (<View id={params.id} />)}
            </ReactFlowProvider>
        </Flex>)
};

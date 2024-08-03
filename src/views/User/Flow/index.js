import React, { useRef, useCallback, useState, useEffect, useMemo, memo } from 'react';
import { BrowserRouter, Route, Switch, Redirect, useParams } from "react-router-dom";
const { v4: uuidv4 } = require('uuid');
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
import { useToast } from '@chakra-ui/react';

import Sidebar from './Sidebar';
import Console from './Console';
import nodesData from './Nodes'
import './nodes.css';

const nodeTypes = {};
for (var key in nodesData) {
    if (nodesData.hasOwnProperty(key)) {
        nodeTypes[key] = nodesData[key].node;
    }
}
console.log('nodeTypes: ', nodeTypes);

const View = () => {
    const { id } = useParams();
    const reactFlowWrapper = useRef(null);
    const toast = useToast();

    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    const [data, setData] = useState(null);
    const [state, setState] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const nodeTypes = {};
    for (var key in nodesData) {
        if (nodesData.hasOwnProperty(key)) {
            nodeTypes[key] = nodesData[key].node;
        }
    }
    useEffect(() => {
        async function loadFlow(id) {
            try {
                var res = await Services.strategy.view(id);
                const { owner, flow, state, access } = res;
                const parsedFlow = JSON.parse(flow);
                console.log('loadFlow res: ', res);
                setIsLoading(false);
                setNodes(parsedFlow.nodes || []);
                setEdges(parsedFlow.edges || []);
                setData({ owner: owner, access: access });
                setState(state);
                console.log('state: ', state);
            } catch (error) {
                setIsLoading(false);
                setError(error.message);
                toast({
                    title: 'Error.',
                    description: error.message,
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            }
        };
        if (id) loadFlow(id);
    }, [state]);

    const ws = useRef(null);
    const websocketUrl = 'ws://localhost:8080';
    useEffect(() => {
        // Initialize WebSocket connection
        ws.current = new WebSocket(websocketUrl);
        //TO-DO: Add reconnection after onClose. Ping/pong?
        ws.current.onopen = () => {
            console.log('Connected to the WebSocket server');
            // Send the authentication message with the token and ID
            var payload = { type: 'authenticate', token: Services.auth.getToken(), strategyId: id };
            ws.current.send(JSON.stringify(payload));
        };

        ws.current.onmessage = (event) => {
            const eventData = JSON.parse(event.data);
            console.log('Received message:', eventData);
            // Update logs
            const { action, from, data, message, timestamp, logLevel } = eventData;
            var log = `[${new Date(timestamp).toLocaleString()}]: ${from} => ${action} ${data} ${message} (${logLevel})`;
            window.addConsoleMessage(log);
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

    const onStart = () => {
        const startToast = toast({
            title: "Starting strategy...",
            description: "Please wait",
            status: "loading",
        });
        Services.strategy.start(id)
            .then((res) => {
                console.log('onStart res: ', res);
                setState('live');
                toast.close(startToast);
                toast({
                    title: "Success",
                    description: res,
                    status: "success",
                });
            })
            .catch((error) => {
                toast.close(startToast);
                toast({
                    title: "Error",
                    description: error.message,
                    status: "error",
                });
            });
    };
    const onTick = () => {
        const ticktToast = toast({
            title: "Ticking strategy...",
            description: "Please wait",
            status: "loading",
        });
        Services.strategy.tick(id)
            .then((res) => {
                console.log('onStart res: ', res);
                setState('live');
                toast.close(ticktToast);
                toast({
                    title: "Success",
                    description: res,
                    status: "success",
                });
            })
            .catch((error) => {
                toast.close(ticktToast);
                toast({
                    title: "Error",
                    description: error.message,
                    status: "error",
                });
            });
    };
    const onStop = () => {
        const stopToast = toast({
            title: "Stopping strategy...",
            description: "Please wait",
            status: "loading",
        });
        Services.strategy.stop(id)
            .then((res) => {
                console.log('onStop res: ', res);
                setState('idle');
                toast.close(stopToast);
                toast({
                    title: "Success",
                    description: res,
                    status: "success",
                });
            })
            .catch((error) => {
                toast.close(stopToast);
                toast({
                    title: "Error",
                    description: error.message,
                    status: "error",
                });
            });
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
                                <Button isDisabled={state && state == 'live'} onClick={onStart}>Start</Button>
                                <Button isDisabled={state && state != 'live'} onClick={onTick}>Tick</Button>
                                <Button isDisabled={state && state == 'idle'} onClick={onStop}>Stop</Button>
                        </ButtonGroup>
                    </Panel>
                </ReactFlow>
                </div>
            </div>
            <Console />
        </Flex>
    );
};
const Edit = () => {
    const { id } = useParams();
    const toast = useToast();

    const [flow, setFlow] = useState(null);
    const [data, setData] = useState(null);
    const [state, setState] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const getId = () => `node_${uuidv4()}`;

    const reactFlowWrapper = useRef(null);
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const { setViewport } = useReactFlow();
    const { screenToFlowPosition } = useReactFlow();
    const [rfInstance, setRfInstance] = useState(null);

    const { isOpen, onOpen, onClose } = useDisclosure() //For modal control

    function loadFlow() {
        var loadToast = toast({
            title: 'Loading...',
            description: 'Please wait.',
            status: 'loading',
            isClosable: false,
        });
        Services.strategy.view(id)
            .then(({ owner, flow, state, access }) => {
                const parsedFlow = JSON.parse(flow);
                console.log('loadFlow parsedFlow: ', parsedFlow);
                if (!parsedFlow) {
                    toast.close(loadToast);
                    toast({
                        title: 'Error.',
                        description: 'Invalid flow.',
                        status: 'error',
                        duration: 3000,
                        isClosable: true,
                    });
                }
                setIsLoading(false);
                setData({ owner: owner, access: access });
                setState(state);
                setFlow(parsedFlow);
                toast.close(loadToast);
                toast({
                    title: 'Success.',
                    description: 'Flow loaded.',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
            })
            .catch((error) => {
                setIsLoading(false);
                setError(error);
                toast.close(loadToast);
                toast({
                    title: 'Error.',
                    description: error.message,
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            });
    };
    useEffect(() => {
        if (id) loadFlow();
    }, []);


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
        if (!rfInstance) return;
        var saveToast = toast({
            title: 'Saving...',
            description: 'Please wait.',
            status: 'loading',
            isClosable: false,
        });
        const saveFlow = rfInstance.toObject();
        console.log('Flow -> Edit -> onSave -> saveFlow: ', saveFlow);
        Services.strategy.edit(id, saveFlow)
            .then((data) => {
                toast.close(saveToast);
                toast({
                    title: 'Success.',
                    description: data,
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
            })
            .catch((error) => {
                toast.close(saveToast);
                setIsLoading(false);
                setError(error);
                toast({
                    title: 'Error.',
                    description: error.message,
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            });
    }, [rfInstance]);

    const onReload = () => {
        if (!flow) return;
        console.log('restoreFlow flow: ', flow);
        const { x = 0, y = 0, zoom = 1 } = flow.viewport;
        setNodes(flow.nodes || []);
        setEdges(flow.edges || []);
        setViewport({ x, y, zoom });
    };

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
                    onInit={setRfInstance}
                    fitView
                >
                    <Controls />
                    <Panel position="top-right">
                        <ButtonGroup size='xs' isAttached variant='outline'>
                            <Button onClick={onSave}>Save</Button>
                            <Button onClick={onReload}>Reload</Button>
                        </ButtonGroup>
                    </Panel>
                </ReactFlow>
            </div>
            <Sidebar nodeTypes={Object.values(nodesData) } />
        </div>
    );
};
const Create = () => {
    const { id } = useParams();
    const toast = useToast();

    const [data, setData] = useState(null);
    const [state, setState] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const initialNodes = [];
    let nodeId = 0;
    const getId = () => `node_${uuidv4()}`;
    const flowKey = 'draft';

    const reactFlowWrapper = useRef(null);
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const { screenToFlowPosition } = useReactFlow();
    const [rfInstance, setRfInstance] = useState(null);
    const { setViewport } = useReactFlow();

    useEffect(() => {
        async function loadFlow(id) {
            try {
                var res = await Services.strategy.view(id);
                const { owner, flow, state, access } = res;
                const parsedFlow = JSON.parse(flow);
                console.log('loadFlow res: ', res);
                if (!parsedFlow) {
                    toast({
                        title: 'Error.',
                        description: 'Invalid flow.',
                        status: 'error',
                        duration: 3000,
                        isClosable: true,
                    });
                }
                setIsLoading(false);
                setNodes(parsedFlow.nodes || []);
                setEdges(parsedFlow.edges || []);
                setData({ owner: owner, access: access });
                setState(state);
                console.log('state: ', state);
            } catch (error) {
                setIsLoading(false);
                setError(error.message);
                toast({
                    title: 'Error.',
                    description: error,
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            }
        };
        if (id) loadFlow(id);
    }, [state]);

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

    const onDeploy = async (formData) => {
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
            <Sidebar nodeTypes={Object.values(nodesData)} />
        </div>
    );
};

export default () => {
    return (
        <Flex flexDirection='column' pt={{ base: "120px", md: "75px" }}>
            <ReactFlowProvider>
                    <Switch>
                        <Route path="/app/user/flow/view/:id" component={View}/>
                        <Route path="/app/user/flow/edit/:id" component={Edit}/>
                        <Route path="/app/user/flow/create" component={Create} />
                    <Redirect from='/app/user/flow' to='/app/user/flow/create'/>
                    </Switch>
            </ReactFlowProvider>
        </Flex>)
};

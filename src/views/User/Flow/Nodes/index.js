import React, { memo, useState, useEffect } from 'react';
import { Handle, Position } from '@xyflow/react';
import {
    Input,
    InputGroup,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    InputLeftAddon,
    Select,
    Text,
    Heading,
    Tooltip,
    Flex,
    Spacer,
    Wrap
} from '@chakra-ui/react';
import { InfoOutlineIcon } from '@chakra-ui/icons';
import './index.css';

const NumberNode = memo((props) => {
    //{ data, isConnectable = true, isEditable = true }
    const { id, data, isConnectable, isEditable = true } = props;
    const [number, setNumber] = useState(data.parameters.number || 0);
    const [runMode, setRunMode] = useState(data.parameters.runMode || 'onStrategyStart');

    const handleOnNumberChange = (val) => {
        setNumber(Number.parseFloat(val));
    }
    const handleOnRunModeChange = (e) => {
        console.log('handleOnRunModeChange: ', e);
        setRunMode(e.target.value);
    }

    useEffect(() => {
        data.parameters.number = number;
        data.parameters.runMode = runMode;
    }, [number, runMode]);

    return (
        <div class={ id } >
            <Flex m='5px'>
                <Wrap spacing='5px'>
                    <Heading size='sm'>
                        Number
                    </Heading>
                    <Text>({id})</Text>
                </Wrap>
                <Spacer />
                <Tooltip label='Outputs a custom number.' fontSize='md'>
                    <InfoOutlineIcon />
                </Tooltip>
            </Flex>
            {isEditable ? (
                <>
                    <Flex align='center' mb='18px'>
                        <InputGroup>
                            <InputLeftAddon >Run Mode</InputLeftAddon>
                            <Select id='runMode' defaultValue={runMode} onChange={handleOnRunModeChange}>
                                <option value='onStrategyStart'>On Strategy Start</option>
                                <option value='onStrategyTick'>On Strategy Tick</option>
                                <option value='onInputsReady'>On Inputs Ready</option>
                                <option value='onEventTrigger'>On Event Trigger</option>
                            </Select>
                        </InputGroup>
                    </Flex>
                    <NumberInput
                    className="nodrag"
                    defaultValue={number}
                        onChange={handleOnNumberChange}
                    w='min'>
                    <InputGroup>
                        <InputLeftAddon >number</InputLeftAddon>
                        <NumberInputField
                            type="number"
                            placeholder='number'
                            minW='100px'
                        />
                    </InputGroup>
                    <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                        </NumberInputStepper>
                    </NumberInput>
                </>
            ) : (
                    <Text>number : {data.parameters.number }</Text>
            )}
            
            <Handle
                type="source"
                position={Position.Right}
                id="number"
                style={{ top: 10, background: '#555' }}
                isConnectable={isConnectable}
            />
        </div>
    );
});

const DelayNode = memo(({ id, data, isConnectable, isEditable = true }) => {
    const handleOnMillisecondsChange = (val) => {
        data.parameters.milliseconds = Number.parseInt(val);
    }
    return (
        <div classnname={id}>
            <Handle
                type="target"
                position={Position.Left}
                id="data"
                style={{ top: 10, background: '#555' }}
                isConnectable={isConnectable}
            />
            <Flex m='5px'>
                <Wrap spacing='5px'>
                    <Heading size='sm'>
                        Delay
                    </Heading>
                    <Text>({id})</Text>
                </Wrap>
                <Spacer />
                <Tooltip label='Outputs the data delayed by a custom set milliseconds.' fontSize='md'>
                    <InfoOutlineIcon />
                </Tooltip>
            </Flex>
            {isEditable ? (
                <NumberInput className="nodrag"
                defaultValue={data.parameters.milliseconds ? data.parameters.milliseconds : 0}
                    w='min'
                    onChange={handleOnMillisecondsChange}
            >
                <InputGroup>
                    <InputLeftAddon>milliseconds</InputLeftAddon>
                    <NumberInputField
                        type="number"
                        placeholder='milliseconds'
                        minW='100px'
                    />
                </InputGroup>
                <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                </NumberInputStepper>
                </NumberInput>
            ) : (
                    <Text>milliseconds: {data.parameters.milliseconds }</Text>
            )}
            
            <Handle
                type="source"
                position={Position.Right}
                id="delayed"
                style={{ top: 10, background: '#555' }}
                isConnectable={isConnectable}
            />
        </div>
    );
});
const LogNode = memo(({ id, data, isConnectable, isEditable = true }) => {
    const [format, setFormat] = useState(data.parameters.format || `{data}`);

    const handleFormatChange = (e) => {
        console.log('handleOnRunModeChange: ', e);
        setFormat(e.target.value);
    }

    useEffect(() => {
        data.parameters.format = format;
    }, [format]);
    return (
        <div classnname={id}>
            <Handle
                type="target"
                position={Position.Left}
                id="data"
                style={{ top: 10, background: '#555' }}
                isConnectable={isConnectable}
            />
            <Flex m='5px'>
                <Wrap spacing='5px'>
                    <Heading size='sm'>
                        Log
                    </Heading>
                    <Text>({id})</Text>
                </Wrap>
                <Spacer />
                <Tooltip label='Logs data to the console. For a custom format use {data} tag.' fontSize='md'>
                    <InfoOutlineIcon />
                </Tooltip>
            </Flex>
            {isEditable ? (
                <InputGroup>
                    <InputLeftAddon>format</InputLeftAddon>
                    <Input
                        placeholder='format'
                        className="nodrag"
                        type="text"
                        onChange={handleFormatChange}
                        defaultValue={format}
                        w='min'
                        minW='200px'
                    />
                </InputGroup>
            ) : (
                    <Text>format: {format}</Text>
            )}
        </div>
    );
});
export default {
    Number: {
        node: NumberNode,
        id: 'Number',
        class: 'input',
        text: 'Number Input',
    },
    Delay: {
        node: DelayNode,
        id: 'Delay',
        class: '',
        text: 'Delay',
    },
    Log: {
        node: LogNode,
        id: 'Log',
        class: 'output',
        text: 'Log',
    }
}
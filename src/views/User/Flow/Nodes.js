import React, { memo } from 'react';
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
    Text,
    Heading,
    Tooltip,
    Flex,
    Spacer
} from '@chakra-ui/react';
import { InfoOutlineIcon } from '@chakra-ui/icons';

const NumberNode = memo((props) => {
    //{ data, isConnectable = true, isEditable = true }
    const { data, isConnectable, isEditable = true } = props;
    const handleOnNumberChange = (val) => {
        data.parameters.number = Number.parseFloat(val) ;
    }
    return (
        <div classnname ='node'>
            <Flex m='5px'>
                <Heading size='sm'>
                    Number
                </Heading>
                <Spacer />
                <Tooltip label='Outputs a custom number.' fontSize='md'>
                    <InfoOutlineIcon />
                </Tooltip>
            </Flex>
            {isEditable ? (
                <NumberInput
                className="nodrag"
                defaultValue={data.parameters.number ? data.parameters.number : 0}
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

const DelayNode = memo(({ data, isConnectable, isEditable = true }) => {
    const handleOnMillisecondsChange = (val) => {
        data.parameters.milliseconds = Number.parseInt(val);
    }
    return (
        <div classnname='node'>
            <Handle
                type="target"
                position={Position.Left}
                id="data"
                style={{ top: 10, background: '#555' }}
                isConnectable={isConnectable}
            />
            <Flex m='5px'>
                <Heading size='sm'>
                    Delay
                </Heading>
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
const LogNode = memo(({ data, isConnectable, isEditable = true }) => {
    return (
        <div classnname='node'>
            <Handle
                type="target"
                position={Position.Left}
                id="data"
                style={{ top: 10, background: '#555' }}
                isConnectable={isConnectable}
            />
            <Flex m='5px'>
                <Heading size='sm'>
                    Log
                </Heading>
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
                        onChange={(e) => {
                            data.parameters.format = e.target.value;
                            console.log('data: ', data);
                        }}
                        defaultValue={data.parameters.format ? data.parameters.format : '{data}'}
                        w='min'
                        minW='200px'
                    />
                </InputGroup>
            ) : (
                    <Text>format: {data.parameters.format}</Text>
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
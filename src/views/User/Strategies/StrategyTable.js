import React, { useCallback } from 'react';
import { useHistory } from "react-router-dom";
import {
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
    Button,
    IconButton,
    ButtonGroup,
    Tooltip
} from '@chakra-ui/react';
import {
    EditIcon,
    ViewIcon,
} from '@chakra-ui/icons';

const ActionButton = (props) => {
    const { text, onClick, id, isDisabled } = props;
    return (
        <Tooltip label='Can not edit idle strategy.' isDisabled={!isDisabled}>
            <Button isDisabled={isDisabled} id={id} onClick={onClick.bind(id)} aria-label='{text}' size='xs' >{text}</Button>
        </Tooltip>
    );
}

export default (props) => {
    console.log('props: ', props);
    const { headers, rows } = props;
    let navigate = useHistory();

    const onView = (e) => {
        e.preventDefault();
        console.log(`Viewving strategy id #${e.target.id}`);
        let path = `/app/user/flow/view/${e.target.id}`;
        navigate.push(path);
    };
    const onEdit = (e) => {
        e.preventDefault();
        console.log(`Editing strategy id #${e.target.id}`);
        let path = `/app/user/flow/edit/${e.target.id}`;
        navigate.push(path);
    };

    return (
        <TableContainer>
            <Table size='sm'>
                <Thead>
                    <Tr align='center'>
                        {headers.map(header => (
                            <Th>{header}</Th>
                        ))}
                        <Th>Actions</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {rows.map(row => (
                        <Tr key={row.id}>
                            {headers.map((header) => 
                                    (
                                        <Td key={header}>{row[header]}</Td>
                                    )
                                )}
                            <Td>
                                <ButtonGroup gap='1'>
                                    <ActionButton text='Edit' onClick={onEdit} id={row && row.id} isDisabled={row && row.state == 'live'} />
                                    <Button id={row.id} onClick={onView.bind(row.id)} aria-label='View' size='xs' >View</Button>
                                    <Button size='xs'>Start</Button>
                                    <Button size='xs'>Stop</Button>
                                </ButtonGroup>
                            </Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </TableContainer>
    )
};
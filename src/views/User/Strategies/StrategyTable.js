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
    ButtonGroup
} from '@chakra-ui/react';
import {
    EditIcon,
    ViewIcon,
} from '@chakra-ui/icons';

export default (props) => {
    console.log('props: ', props);
    const { headers, rows } = props;
    let navigate = useHistory();

    const onView = (e) => {
        e.preventDefault();
        console.log(e.target);
        console.log(`Viewving strategy id #${e.target.id}`);
        let path = `/app/user/flow/view/${e.target.id}`;
        navigate.push(path);
    };
    const onEdit = (e) => {
        e.preventDefault();
        console.log(e.target);
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
                        <Tr key={row.id }>
                            {Object.values(row).map(cell => (
                                <Td>{cell}</Td>
                            ))}
                            <Td>
                                <ButtonGroup gap='1'>
                                    <Button id={row.id} onClick={onEdit.bind(row.id)} aria-label='Edit' size='xs' >Edit</Button>
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
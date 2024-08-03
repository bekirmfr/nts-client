import React from 'react';

export default (props) => {
    const { nodeTypes } = props;
    const onDragStart = (event, nodeType) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };
    const getNodes = (nodes) => {
        return Object.values(nodes).map((node, index) => {
            var classData = node.class ? node.class : 'default';
            return (
                <div className={"node " + classData} onDragStart={(event) => onDragStart(event, node.id)} draggable key={index}>
                    {node.text}
                </div>
            );
        });
    }

    return (
        <aside>
            <div className="description">Drag to add new node.</div>
            {getNodes(nodeTypes) }
        </aside>
    );
}
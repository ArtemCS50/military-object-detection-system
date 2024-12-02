import React from 'react';
import { Table, Image } from 'react-bootstrap';
import LoadingMessage from "../message/LoadingMessage";


const labelIcons = {
    artillery: '/images/artillery.png',
    car: '/images/car.png',
    explosion: '/images/explosion.png',
    military_truck: '/images/military_truck.png',
    military_vehicle: '/images/military_vehicle.png',
    person: '/images/person.png',
    tank: '/images/tank.png',
    truck: '/images/truck.png',
};

function ObjectCountsTable({ objectCounts, loading }) {
    if (loading) {
        return <p>Підраховується завантаження об'єкта...</p>;
    }

    if (objectCounts.length === 0) {
        return <LoadingMessage message={"Очікується виведення даних"}/>;
    }

    return (
        <Table striped bordered hover responsive>
            <thead>
            <tr className="text-center">
                <th>Label</th>
                <th>Count</th>
                <th>Email</th>
            </tr>
            </thead>
            <tbody>
            {objectCounts.map(({ id, label, count, email }) => (
                <tr key={id} className="text-center">
                    <td className="d-flex align-items-center justify-content-center">
                        {labelIcons[label] && (
                            <Image
                                src={labelIcons[label]}
                                alt={label}
                                width="64"
                                height="64"
                                className="me-2"
                            />
                        )}
                        {label}
                    </td>
                    <td>{count}</td>
                    <td>{email}</td>
                </tr>
            ))}
            </tbody>
        </Table>
    );
}

export default ObjectCountsTable;

import React from 'react';
import { useParams } from 'react-router-dom';
import Room from './Room';

const RoomWrapper = (props) => {
  const { roomCode } = useParams();
  return <Room {...props} roomCode={roomCode} />;
};

export default RoomWrapper;

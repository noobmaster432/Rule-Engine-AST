import { ObjectId } from 'mongodb';

export interface Node {
  type: 'operator' | 'operand';
  value: string;
  left?: Node;
  right?: Node;
}

export interface Rule {
  _id?: ObjectId;
  name: string;
  ast: Node;
}
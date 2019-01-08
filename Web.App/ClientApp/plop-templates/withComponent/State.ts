import { {{name}} } from '../api/types/{{name}}';
import { AsyncData } from '../store/api';

export type {{name}}State = {
  readonly {{camelCase name}}: AsyncData<{{name}}[]>;
};
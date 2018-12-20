import { renderReact } from 'hypernova-react';
import { Sheep } from '../components/Sheep';

export default renderReact(
  'HypernovaSheep', // this file's name (or really any unique name)
  Sheep,
);
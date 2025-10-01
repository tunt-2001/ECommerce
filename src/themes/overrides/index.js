import { merge } from 'lodash-es';
import Chip from './Chip';

export default function ComponentsOverrides(theme) {
  return merge(Chip(theme));
}

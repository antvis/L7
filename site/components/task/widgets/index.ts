import { registerWidget } from '@antv/dipper-core';
import {
  CitySelect,
  ClassifyColor,
  DiscreteColor,
} from '@antv/dipper-widgets';
import { Activity } from './Activity';
import { ActivityTask } from './ActivityTask';
import { GridLayer } from './GridLayer';
import { MeshName } from './MeshName/index';
import { Save } from './Save';
import { SearchPerson } from './SearchPerson';
import { Send } from './Send';
import { Status } from './Status';
import { MeshTools } from './MeshTools';
import { MapExhibit } from './MapExhibit/index';

export function initWidgets() {
  registerWidget('citySelect', CitySelect);
  registerWidget('gridLayer', GridLayer);
  registerWidget('classifyColor', ClassifyColor);
  registerWidget('discreteColor', DiscreteColor);
  registerWidget('meshName', MeshName);
  registerWidget('meshTools',MeshTools)

  registerWidget('save', Save);
  registerWidget('publishbar', Send);
  registerWidget('activity', Activity);
  registerWidget('status',Status);
  registerWidget('mapExhibit', MapExhibit);
  registerWidget('searchPerson',SearchPerson)
  registerWidget('activityTask',ActivityTask)
}

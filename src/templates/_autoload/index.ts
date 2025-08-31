import 'reflect-metadata';
import { di } from '../../di';
import IApplication from '../../interfaces/IApplication';
import { TYPES } from '../../types';
import FixtureResetButton from '../../components/FixtureResetButton.tsx';

/** @type {IApplication} */
const app = di.get<IApplication>(TYPES.Application);

require(`../${app.config.template}/index`);
require(`../${app.config.template}/index.scss`);

FixtureResetButton();

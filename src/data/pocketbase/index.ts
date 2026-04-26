import { PocketBaseMenuRepository } from './menu-repo';
import { PocketBaseOrdersRepository } from './orders-repo';
import { PocketBaseSettingsRepository } from './settings-repo';
import { PocketBaseLeadsRepository } from './leads-repo';

export { pbClient } from './client';

export const menuRepository = new PocketBaseMenuRepository();
export const ordersRepository = new PocketBaseOrdersRepository();
export const settingsRepository = new PocketBaseSettingsRepository();
export const leadsRepository = new PocketBaseLeadsRepository();


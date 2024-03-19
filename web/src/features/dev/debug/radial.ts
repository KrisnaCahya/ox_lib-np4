import { debugData } from '../../../utils/debugData';
import type { RadialMenuItem } from '../../../typings';

export const debugRadial = () => {
  debugData<{ items: RadialMenuItem[]; sub?: boolean }>([
    {
      action: 'openRadialMenu',
      data: {
        items: [
          { icon: 'palette', label: 'Paint' },
          { iconWidth: 35, iconHeight: 35, icon: 'https://cdn.discordapp.com/attachments/1216774243262529639/1217822434162507898/GOLD-removebg-preview.png?ex=66056c86&is=65f2f786&hm=dc3688bbf812cd3c394758484401b5b8c5e1cd978948269ec113ec282ce42789&', label: 'External icon'},
          { icon: 'warehouse', label: 'Garage' },
          { icon: 'palette', label: 'Quite long  \ntext' },
          { icon: 'palette', label: 'Paint' },
          { icon: 'warehouse', label: 'Garage' },
        ],
      },
    },
  ]);
};

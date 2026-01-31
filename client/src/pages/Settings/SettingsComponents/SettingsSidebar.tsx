'use client';

import * as React from 'react';
import {
  BookOpen,
  Bot,
  Frame,
  Map,
  PieChart,
  UserPen,
  SlidersHorizontal,
} from 'lucide-react';

import { NavMain } from '@/pages/Settings/SettingsComponents/nav-main';
import { NavUser } from '@/pages/Settings/SettingsComponents/SettingsUser';
import { TeamSwitcher } from '@/pages/Settings/SettingsComponents/BackToPlaning';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';

// This is sample data.
const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  navMain2: [
    {
      title: 'Profile',
      url: '#',
      icon: SlidersHorizontal,
      isActive: true,
      items: [
        {
          title: 'Profile',
          url: '/settings/general',
        },
        {
          title: 'Subscription',
          url: '/settings/subscription',
        },
        /*{
          title: 'Personalization',
          url: '/settings/personalization',
        },*/
      ],
    },
  ],
  navMain: [
    {
      title: 'Components',
      url: '#',
      icon: SlidersHorizontal,
      isActive: true,
      items: [
        {
          title: 'Food and water table',
          url: '/settings/food-water',
        },
        {
          title: 'Interests',
          url: '/settings/interests',
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props} className="sticky top-0 h-155">
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain2} />
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

import { Outlet } from 'react-router-dom';
import { AppSidebar } from '@/pages/Settings/SettingsComponents/SettingsSidebar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';

export default function Page() {
  return (
    <div className="flex align-center m-0 justify-center overflow-hidden">
      <div className="relative m-0 rounded-md overflow-hidden w-full">
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset className="flex flex-col h-155">
            <header className="sticky top-0 z-10 bg-background flex h-auto py-3 shrink-0 items-center gap-2 border-b px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="#">
                      Building Your Application
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </header>

            <div className="flex-1 overflow-y-auto p-4 min-h-0">
              <Outlet />
            </div>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </div>
  );
}

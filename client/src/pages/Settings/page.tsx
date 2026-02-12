import { Outlet, useLocation } from 'react-router-dom';
import { AppSidebar } from '@/pages/Settings/SettingsComponents/SettingsSidebar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SaveContext } from './SaveContext';
import type { SaveContextType } from './SaveContext';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { useState } from 'react';

export default function Page() {
  const location = useLocation();
  const showSaveButton =
    location.pathname === '/settings/interests' ||
    location.pathname === '/settings/food-water' ||
    location.pathname === '/settings/flights';

  const [saveCallback, setSaveCallback] = useState<() => void>();
  const [dirty, setDirty] = useState(false); // 🟢 track unsaved changes

  return (
    <SaveContext.Provider value={{ save: saveCallback, setDirty }}>
      <div className="flex align-center m-0 justify-center overflow-hidden">
        <div className="relative m-0 rounded-md overflow-hidden w-full">
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset className="flex flex-col h-155">
              <header className="sticky top-0 z-10 bg-background flex h-auto py-3 shrink-0 items-center gap-2 border-b px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                {showSaveButton && (
                  <Button
                    className={`ml-auto transition-colors 
                      ${
                        dirty
                          ? 'bg-green-500 text-white hover:bg-green-600 cursor-pointer'
                          : 'cursor-not-allowed'
                      }`}
                    disabled={!dirty} // dugme ne može se kliknuti ako nema promjena
                    onClick={async () => {
                      if (saveCallback) {
                        await saveCallback();
                        setDirty(false); // reset nakon save
                      }
                    }}
                  >
                    Save Changes
                  </Button>
                )}
              </header>

              <div className="flex-1 overflow-y-auto p-4 min-h-0">
                <Outlet context={{ setSaveCallback, setDirty }} />
              </div>
            </SidebarInset>
          </SidebarProvider>
        </div>
      </div>
    </SaveContext.Provider>
  );
}

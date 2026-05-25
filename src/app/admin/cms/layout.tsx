import { AdminNav } from '@/components/admin/AdminNav';
import type { ReactNode } from 'react';

export default function CmsLayout({ children }: { children: ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <AdminNav />
      <div
        style={
          {
            flex: 1,
            overflow: 'auto',
            backgroundColor: '#ffffff',
            color: '#09090b',
            '--background': '#ffffff',
            '--foreground': '#09090b',
            '--card': '#ffffff',
            '--card-foreground': '#09090b',
            '--primary': '#18181b',
            '--primary-foreground': '#fafafa',
            '--muted': '#f4f4f5',
            '--muted-foreground': '#71717a',
            '--border': '#e4e4e7',
          } as React.CSSProperties
        }
      >
        {children}
      </div>
    </div>
  );
}

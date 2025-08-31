import React from 'react';
import { capabilities } from '../../lib/capabilities';
import { guarded } from '../../lib/guard';

export const revalidate = 0;

export default async function AdminPage() {
  const AdminApp = await guarded(
    capabilities.admin,
    () => import('./AdminApp'),
  );

  if (!AdminApp) {
    return <p>Access denied</p>;
  }

  return <AdminApp />;
}

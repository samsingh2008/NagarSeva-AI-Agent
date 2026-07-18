/**
 * Complaint Submission Page
 * Route: /complaint
 */

import ComplaintForm from '@/components/ComplaintForm';

export const metadata = {
  title: 'Report Complaint - NagarSeva',
  description: 'Report a civic complaint with photo and location details',
};

export default function ComplaintPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 py-12 px-4">
      <div className="container mx-auto">
        <ComplaintForm />
      </div>
    </main>
  );
}

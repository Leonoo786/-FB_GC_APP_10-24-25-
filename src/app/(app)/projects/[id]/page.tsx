import { redirect } from 'next/navigation';

// This remains a server component
export default function Page({ params }: { params: { id: string } })
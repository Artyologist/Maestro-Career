import type { Metadata } from 'next';
import ServicesClient from './ServicesClient';

export const metadata: Metadata = {
  title: "Services",
};

export default function Page() {
  return <ServicesClient />;
}

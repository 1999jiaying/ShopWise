'use server';

import { redirect } from 'next/navigation';

export async function analyzeShop(formData: FormData) {
  const shopName = formData.get('shopName') as string | null;
  const category = formData.get('category') as string | null;
  const address  = formData.get('address')  as string | null;
  const rating   = formData.get('rating')   as string | null;
  const reviews  = formData.get('reviews')  as string | null;
  const website  = formData.get('website')  as string | null;

  const params = new URLSearchParams();
  if (shopName) params.set('name', shopName);
  if (category) params.set('category', category);
  if (address)  params.set('address', address);
  if (rating)   params.set('rating', rating);
  if (reviews)  params.set('reviews', reviews);
  if (website)  params.set('website', website);

  redirect('/sample?' + params.toString());
}

-- Add payment-related columns to the profiles table
alter table public.profiles
add column if not exists selected_plan_id text,
add column if not exists payment_status text check (payment_status in ('paid', 'unpaid')) default 'unpaid',
add column if not exists payment_id text,
add column if not exists transaction_id text,
add column if not exists payment_token text,
add column if not exists psychometric_test_link text;

-- Add comment explaining the columns
comment on column public.profiles.payment_status is 'Status of the user''s plan payment';
comment on column public.profiles.payment_id is 'Razorpay Payment ID';
comment on column public.profiles.transaction_id is 'Razorpay Transaction/Order ID';
comment on column public.profiles.payment_token is 'Razorpay Signature/Token';

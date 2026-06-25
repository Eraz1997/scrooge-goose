drop table users;
drop table expenses;
drop table expense_borrowers;
drop table category;

create table if not exists expenses (
    id uuid default gen_random_uuid() primary key,
    lender_user_name text not null,
    title text not null,
    long_description text,
    category text,
    created_at timestamp not null default now()
);

create table if not exists expense_payments (
    id bigint primary key generated always as identity,
    expense_id uuid not null references expenses(id),
    amount_euros numeric(16,2) not null,
    borrower_user_name text not null
);

CREATE INDEX idx_expenses_category ON expenses (category);

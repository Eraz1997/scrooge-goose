create table if not exists users (
    id bigint primary key,
    username varchar(256) not null
);

create table if not exists expense_categories (
    id bigint primary key generated always as identity,
    title text not null
);

create table if not exists expenses (
    id bigint primary key generated always as identity,
    lender_user_id bigint not null references users(id),
    amount_euros numeric(16,2) not null,
    title text not null,
    long_description text,
    category_id bigint not null references expense_categories(id),
    created_at timestamp not null default now()
);

create table if not exists expense_borrowers (
    id bigint primary key generated always as identity,
    expense_id bigint not null references expenses(id),
    borrower_user_id bigint not null references users(id)
);

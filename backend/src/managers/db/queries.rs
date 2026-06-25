use uuid::Uuid;

use crate::{
    error::Error,
    managers::db::{
        DbManager,
        models::{Balance, Expense},
    },
};

impl DbManager {
    pub async fn get_all_expenses(&self) -> Result<Vec<Expense>, Error> {
        let client = self.connection_pool.get().await?;
        let statement = client
            .prepare_cached(
                "SELECT
                    expenses.id AS id,
                    expenses.lender_user_name AS lender_user_name,
                    expenses.title AS title,
                    expenses.long_description AS long_description,
                    expenses.category AS category,
                    expenses.created_at AS created_at,
                    COALESCE(
                        json_agg(
                            DISTINCT expense_payments(
                                'amount_euros', expense_payments.amount_euros,
                                'borrower_user_name', expense_payments.borrower_user_name
                            )
                        ),
                        '[]'
                    ) AS payments
                FROM expenses
                INNER JOIN expense_payments ON expenses.id = expense_payments.expense_id
                GROUP BY id
                ORDER BY created_at DESC",
            )
            .await?;
        let expenses: Result<Vec<Expense>, Error> = client
            .query(&statement, &[])
            .await?
            .into_iter()
            .map(Expense::try_from)
            .collect();

        expenses
    }

    pub async fn get_balance(&self) -> Result<Vec<Balance>, Error> {
        let client = self.connection_pool.get().await?;
        let statement = client
            .prepare_cached(
                "SELECT
                    user_name,
                    SUM(amount_euros) AS amount_euros
                FROM (
                    SELECT
                        expenses.lender_user_name AS user_name,
                        expense_payments.amount_euros AS amount_euros
                    FROM expenses
                    INNER JOIN expense_payments ON expenses.id = expense_payments.expense_id
                    UNION ALL SELECT
                        expense_payments.borrower_user_name AS user_name,
                        -1 * expense_payments.amount_euros AS amount_euros
                    FROM expense_payments
                ) GROUP BY user_name",
            )
            .await?;

        let balances: Result<Vec<Balance>, Error> = client
            .query(&statement, &[])
            .await?
            .into_iter()
            .map(Balance::try_from)
            .collect();

        balances
    }

    pub async fn get_expense(&self, id: &Uuid) -> Result<Option<Expense>, Error> {
        let client = self.connection_pool.get().await?;
        let statement = client
            .prepare_cached(
                "SELECT
                    expenses.id AS id,
                    expenses.lender_user_name AS lender_user_name,
                    expenses.title AS title,
                    expenses.long_description AS long_description,
                    expenses.category AS category,
                    expenses.created_at AS created_at,
                    COALESCE(
                        json_agg(
                            DISTINCT expense_payments(
                                'amount_euros', expense_payments.amount_euros,
                                'borrower_user_name', expense_payments.borrower_user_name
                            )
                        ),
                        '[]'
                    ) AS payments
                FROM expenses
                INNER JOIN expense_payments ON expenses.id = expense_payments.expense_id
                WHERE expenses.id = $1
                GROUP BY id",
            )
            .await?;
        let row = client.query_opt(&statement, &[&id]).await?;

        if let Some(row) = row {
            Ok(Some(Expense::try_from(row)?))
        } else {
            Ok(None)
        }
    }

    pub async fn add_expense(&self, expense: &Expense) -> Result<(), Error> {
        let mut client = self.connection_pool.get().await?;
        let transaction = client.transaction().await?;

        let statement = transaction
            .prepare_cached(
                "INSERTO INTO expenses (
                lender_user_name,
                title,
                long_description,
                category
            ) VALUES ($1, $2, $3, $4) RETURNING id",
            )
            .await?;
        let expense_id: Uuid = transaction
            .query_one(
                &statement,
                &[
                    &expense.lender_user_name,
                    &expense.title,
                    &expense.long_description,
                    &expense.category,
                ],
            )
            .await?
            .try_get("id")?;

        for payment in expense.payments.iter() {
            let statement = transaction
                .prepare_cached(
                    "INSERTO INTO expense_payments (
                    expense_id,
                    amount_euros,
                    borrower_user_name
                ) VALUES ($1, $2, $3)",
                )
                .await?;
            transaction
                .execute(
                    &statement,
                    &[
                        &expense_id,
                        &payment.amount_euros,
                        &payment.borrower_user_name,
                    ],
                )
                .await?;
        }

        transaction.commit().await?;
        Ok(())
    }

    pub async fn edit_expense(&self, expense: &Expense) -> Result<(), Error> {
        let mut client = self.connection_pool.get().await?;
        let transaction = client.transaction().await?;

        let statement = transaction
            .prepare_cached(
                "UPDATE expenses SET
                lender_user_name = $1
                title = $2
                long_description = $3
                category_id = $4
            WHERE id = $5",
            )
            .await?;
        transaction
            .execute(
                &statement,
                &[
                    &expense.lender_user_name,
                    &expense.title,
                    &expense.long_description,
                    &expense.category,
                    &expense.id,
                ],
            )
            .await?;

        let statement = transaction
            .prepare_cached("DELETE FROM expense_payments WHERE expense_id = $1")
            .await?;
        transaction.execute(&statement, &[&expense.id]).await?;

        for payment in expense.payments.iter() {
            let statement = transaction
                .prepare_cached(
                    "INSERTO INTO expense_payments (
                    expense_id,
                    amount_euros,
                    borrower_user_name
                ) VALUES ($1, $2, $3)",
                )
                .await?;
            transaction
                .execute(
                    &statement,
                    &[
                        &expense.id,
                        &payment.amount_euros,
                        &payment.borrower_user_name,
                    ],
                )
                .await?;
        }

        transaction.commit().await?;
        Ok(())
    }

    pub async fn delete_expense(&self, id: &Uuid) -> Result<(), Error> {
        let mut client = self.connection_pool.get().await?;
        let transaction = client.transaction().await?;

        let statement = transaction
            .prepare_cached("DELETE FROM expenses WHERE id = $1")
            .await?;
        transaction.execute(&statement, &[&id]).await?;

        let statement = transaction
            .prepare_cached("DELETE FROM expense_payments WHERE expense_id = $1")
            .await?;
        transaction.execute(&statement, &[&id]).await?;

        transaction.commit().await?;
        Ok(())
    }

    pub async fn get_all_user_names(&self) -> Result<Vec<String>, Error> {
        let client = self.connection_pool.get().await?;
        let statement = client
            .prepare_cached(
                "SELECT lender_user_name AS user_name FROM expenses
            UNION SELECT borrower_user_name AS user_name FROM expense_payments",
            )
            .await?;
        let users: Vec<String> = client
            .query(&statement, &[])
            .await?
            .into_iter()
            .map(|row| row.try_get::<&str, String>("user_name").unwrap_or_default())
            .collect();

        Ok(users)
    }

    pub async fn get_all_categories(&self) -> Result<Vec<String>, Error> {
        let client = self.connection_pool.get().await?;
        let statement = client
            .prepare_cached("SELECT DISTINCT category FROM expenses")
            .await?;
        let categories: Vec<String> = client
            .query(&statement, &[])
            .await?
            .into_iter()
            .map(|row| row.try_get::<&str, String>("category").unwrap_or_default())
            .collect();

        Ok(categories)
    }
}

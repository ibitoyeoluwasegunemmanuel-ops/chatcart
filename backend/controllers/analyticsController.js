const db = require("../db");

function getAnalyticsSummary(req, res) {
  const ownerId = req.accountOwnerId || req.user.id;
  const baseWhere = req.user.role === "vendor" ? "WHERE vendor_id = ?" : "";
  const bindValue = req.user.role === "vendor" ? [ownerId] : [];

  const productsRow = db
    .prepare(`SELECT COUNT(*) AS totalProducts FROM products ${baseWhere}`)
    .get(...bindValue);

  const ordersRow = db
    .prepare(`SELECT COUNT(*) AS totalOrders FROM orders ${baseWhere}`)
    .get(...bindValue);

  const revenueRow = db
    .prepare(`SELECT COALESCE(SUM(total_amount), 0) AS revenue FROM orders ${baseWhere}`)
    .get(...bindValue);

  const pendingRow = db
    .prepare(
      `SELECT COUNT(*) AS pendingOrders
       FROM orders ${baseWhere ? `${baseWhere} AND` : "WHERE"} status IN ('Pending', 'Processing')`
    )
    .get(...bindValue);

  const salesSeries = db
    .prepare(
      `SELECT substr(created_at, 1, 10) AS day, COALESCE(SUM(total_amount), 0) AS total
       FROM orders ${baseWhere}
       GROUP BY substr(created_at, 1, 10)
       ORDER BY day DESC
       LIMIT 7`
    )
    .all(...bindValue)
    .reverse();

  const orderSeries = db
    .prepare(
      `SELECT substr(created_at, 1, 10) AS day, COUNT(*) AS total
       FROM orders ${baseWhere}
       GROUP BY substr(created_at, 1, 10)
       ORDER BY day DESC
       LIMIT 7`
    )
    .all(...bindValue)
    .reverse();

  const growthSeries = salesSeries.map((item, index) => {
    if (index === 0) {
      return { day: item.day, total: 0 };
    }

    const previous = salesSeries[index - 1].total || 1;
    return {
      day: item.day,
      total: Number((((item.total - previous) / previous) * 100).toFixed(2))
    };
  });

  return res.json({
    totalProducts: productsRow.totalProducts,
    totalOrders: ordersRow.totalOrders,
    revenue: Number(revenueRow.revenue || 0),
    pendingOrders: pendingRow.pendingOrders,
    salesSeries,
    orderSeries,
    growthSeries
  });
}

module.exports = {
  getAnalyticsSummary
};

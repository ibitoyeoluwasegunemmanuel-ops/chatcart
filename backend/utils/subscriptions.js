const PLAN_LIMITS = {
  vendor_starter: { maxProducts: 10, maxStaff: 3 },
  vendor_growth: { maxProducts: 100, maxStaff: 15 },
  vendor_scale: { maxProducts: null, maxStaff: null },
  creator_starter: { maxMonthlyPosts: 30, maxMonthlyAiGenerations: 60, maxStaff: 2 },
  creator_pro: { maxMonthlyPosts: 200, maxMonthlyAiGenerations: 500, maxStaff: 10 },
  creator_studio: { maxMonthlyPosts: null, maxMonthlyAiGenerations: null, maxStaff: null }
};

const ROLE_PLAN_OPTIONS = {
  vendor: ["vendor_starter", "vendor_growth", "vendor_scale"],
  content_creator: ["creator_starter", "creator_pro", "creator_studio"]
};

function getPlanLimits(plan) {
  return PLAN_LIMITS[plan] || {};
}

function isLimitReached(limit, usage) {
  if (limit === null || limit === undefined) {
    return false;
  }

  return usage >= limit;
}

module.exports = {
  PLAN_LIMITS,
  ROLE_PLAN_OPTIONS,
  getPlanLimits,
  isLimitReached
};

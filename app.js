const API_URL = "http://127.0.0.1:8000";
const STORAGE_KEY = "shuttlefuel_user_database_v2";

// E-Commerce Platforms Configuration (Secondary feature)
const ECOMMERCE_PLATFORMS = {
  amazon: {
    name: "Amazon",
    baseUrl: "https://www.amazon.in/s?k=",
    icon: "🛒"
  },
  flipkart: {
    name: "Flipkart",
    baseUrl: "https://www.flipkart.com/search?q=",
    icon: "📦"
  },
  meesho: {
    name: "Meesho",
    baseUrl: "https://www.meesho.com/search?q=",
    icon: "👜"
  },
  bigbasket: {
    name: "BigBasket",
    baseUrl: "https://www.bigbasket.com/ps/?q=",
    icon: "🥕"
  },
  blinkit: {
    name: "Blinkit",
    baseUrl: "https://blinkit.com/search?search_text=",
    icon: "⚡"
  }
};

const mealDatabase = [
  {
    name: "Banana Oats Power Bowl",
    category: "pre_workout",
    diet: "vegetarian",
    calories: 430,
    protein: 16,
    carbs: 74,
    fat: 10,
    ingredients: "oats:80g;banana:1;milk:250ml;peanut butter:15g",
    tags: ["stamina", "energy", "weight gain"],
  },
  {
    name: "Peanut Butter Toast Sprint",
    category: "pre_workout",
    diet: "vegetarian",
    calories: 360,
    protein: 13,
    carbs: 48,
    fat: 14,
    ingredients: "whole wheat bread:2 slices;peanut butter:25g;banana:1",
    tags: ["energy", "quick"],
  },
  {
    name: "Green Smoothie Rally",
    category: "pre_workout",
    diet: "vegan",
    calories: 310,
    protein: 10,
    carbs: 58,
    fat: 6,
    ingredients: "banana:1;spinach:60g;oats:40g;soy milk:250ml",
    tags: ["hydration", "light", "fat loss"],
  },
  {
    name: "Chicken Rice Recovery Bowl",
    category: "post_workout",
    diet: "non-vegetarian",
    calories: 620,
    protein: 42,
    carbs: 78,
    fat: 14,
    ingredients: "chicken breast:180g;rice:220g;mixed vegetables:150g;olive oil:10ml",
    tags: ["recovery", "muscle", "strength"],
  },
  {
    name: "Paneer Rice Recovery Bowl",
    category: "post_workout",
    diet: "vegetarian",
    calories: 590,
    protein: 32,
    carbs: 70,
    fat: 20,
    ingredients: "paneer:160g;rice:220g;mixed vegetables:150g",
    tags: ["recovery", "muscle", "strength"],
  },
  {
    name: "Tofu Quinoa Recovery Bowl",
    category: "post_workout",
    diet: "vegan",
    calories: 540,
    protein: 30,
    carbs: 62,
    fat: 18,
    ingredients: "tofu:180g;quinoa:180g;mixed vegetables:180g",
    tags: ["recovery", "protein", "vegan"],
  },
  {
    name: "Eggs And Toast Rebuild",
    category: "post_workout",
    diet: "non-vegetarian",
    calories: 520,
    protein: 31,
    carbs: 46,
    fat: 22,
    ingredients: "eggs:3;whole wheat bread:2 slices;yogurt:150g",
    tags: ["protein", "recovery"],
  },
  {
    name: "High Carb Match Pasta",
    category: "match_day",
    diet: "vegetarian",
    calories: 680,
    protein: 24,
    carbs: 112,
    fat: 14,
    ingredients: "pasta:180g;tomato sauce:120g;paneer:80g;electrolyte drink:1 pack",
    tags: ["tournament", "stamina"],
  },
  {
    name: "Light Rice Banana Match Meal",
    category: "match_day",
    diet: "vegan",
    calories: 520,
    protein: 12,
    carbs: 105,
    fat: 5,
    ingredients: "rice:240g;banana:1;electrolyte drink:1 pack;dates:3",
    tags: ["quick", "tournament", "stamina"],
  },
  {
    name: "Salmon Omega Recovery Plate",
    category: "recovery",
    diet: "non-vegetarian",
    calories: 610,
    protein: 39,
    carbs: 52,
    fat: 24,
    ingredients: "salmon:170g;sweet potato:220g;salad:120g",
    tags: ["anti-inflammatory", "recovery", "injury"],
  },
  {
    name: "Dal Rice Mobility Dinner",
    category: "recovery",
    diet: "vegan",
    calories: 560,
    protein: 24,
    carbs: 88,
    fat: 12,
    ingredients: "dal:220g;rice:180g;vegetables:180g;salad:100g",
    tags: ["recovery", "stamina"],
  },
  {
    name: "Greek Yogurt Fruit Bowl",
    category: "snack",
    diet: "vegetarian",
    calories: 290,
    protein: 20,
    carbs: 36,
    fat: 6,
    ingredients: "greek yogurt:200g;berries:100g;honey:10g",
    tags: ["snack", "recovery"],
  },
  {
    name: "Chickpea Salad Fuel",
    category: "snack",
    diet: "vegan",
    calories: 340,
    protein: 18,
    carbs: 48,
    fat: 9,
    ingredients: "chickpeas:180g;salad:140g;olive oil:8ml",
    tags: ["snack", "protein", "fat loss"],
  },
];

const defaultProfile = {
  name: "Rahul",
  email: "",
  city: "",
  age: 18,
  gender: "Male",
  height_cm: 175,
  weight_kg: 68,
  playing_level: "Intermediate",
  training_hours_day: 2,
  training_time: "Evening",
  goal: "Increase stamina",
  dietary_preference: "Vegetarian",
  allergies: "",
  injuries: "",
  budget_weekly: 2450,
  platforms: ["amazon", "flipkart"],
};

const defaultPerformance = {
  energy_score: 8,
  recovery_score: 7,
  sleep_hours: 8,
  soreness_score: 4,
  match_performance: 84,
};

const state = loadDatabase();
state.activeFilter = "all";
state.dailyIntake = state.dailyIntake || {}; // Track daily meals

const screenTitles = {
  dashboard: "Dashboard",
  planner: "Meal Planner",
  cart: "My Meals",
  analytics: "Progress",
  settings: "Profile",
};

document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => switchScreen(tab.dataset.screen));
});

document.querySelectorAll(".chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    state.activeFilter = chip.dataset.filter;
    document.querySelectorAll(".chip").forEach((item) => item.classList.toggle("active", item === chip));
    renderMeals();
  });
});

document.getElementById("profileForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  await saveAndGenerate(profileFromForm(event.currentTarget), performanceFromForm(event.currentTarget));
});

document.getElementById("refreshBtn").addEventListener("click", async () => {
  await saveAndGenerate(profileFromForm(document.getElementById("profileForm")), performanceFromForm(document.getElementById("profileForm")));
});

document.getElementById("customMealForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  addDailyMeal(data.get("meal_name"), parseInt(data.get("calories")), parseInt(data.get("protein")));
  event.currentTarget.reset();
});

const resetButton = document.getElementById("resetDataBtn");
if (resetButton) {
  resetButton.addEventListener("click", () => {
    localStorage.removeItem(STORAGE_KEY);
    Object.assign(state, createDefaultDatabase(), { activeFilter: "all" });
    fillForm(state.profile, state.performance);
    renderAll();
  });
}

function loadDatabase() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved?.profile && saved?.plan) return saved;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
  }
  const database = createDefaultDatabase();
  database.plan = localPlan(database.profile, database.performance);
  return database;
}

function createDefaultDatabase() {
  return {
    profile: { ...defaultProfile },
    performance: { ...defaultPerformance },
    plan: {
      targets: {},
      readiness_score: 0,
      recommendations: [],
      meals: [],
      cart: [],
    },
    planHistory: [],
    dailyIntake: {},
  };
}

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    profile: state.profile,
    performance: state.performance,
    plan: state.plan,
    planHistory: state.planHistory.slice(-14),
    dailyIntake: state.dailyIntake,
  }));
}

async function saveAndGenerate(profile, performance) {
  state.profile = profile;
  state.performance = performance;
  await generatePlan(profile, performance);
  state.planHistory.push({
    date: new Date().toISOString(),
    weight: profile.weight_kg,
    readiness: state.plan.readiness_score,
    hydration: state.plan.targets.hydration_liters,
    protein: state.plan.targets.protein_g,
  });
  persist();
  renderAll();
  switchScreen("dashboard");
}

function switchScreen(screenId) {
  document.querySelectorAll(".tab").forEach((tab) => tab.classList.toggle("active", tab.dataset.screen === screenId));
  document.querySelectorAll(".screen").forEach((screen) => screen.classList.toggle("active", screen.id === screenId));
  document.getElementById("screenTitle").textContent = screenTitles[screenId];
  if (screenId === "analytics") drawChart();
}

function profileFromForm(form) {
  const data = new FormData(form);
  const platforms = [];
  Object.keys(ECOMMERCE_PLATFORMS).forEach(key => {
    if (data.get(`platform_${key}`)) platforms.push(key);
  });
  
  return {
    name: String(data.get("name") || "Athlete").trim(),
    email: String(data.get("email") || "").trim(),
    city: String(data.get("city") || "").trim(),
    age: clamp(Number(data.get("age")) || 18, 12, 80),
    gender: data.get("gender") || "Male",
    height_cm: clamp(Number(data.get("height_cm")) || 175, 120, 230),
    weight_kg: clamp(Number(data.get("weight_kg")) || 68, 35, 180),
    playing_level: data.get("playing_level") || "Intermediate",
    training_hours_day: clamp(Number(data.get("training_hours_day")) || 0, 0, 8),
    training_time: data.get("training_time") || "Evening",
    goal: data.get("goal") || "Increase stamina",
    dietary_preference: data.get("dietary_preference") || "Vegetarian",
    allergies: String(data.get("allergies") || "").trim(),
    injuries: String(data.get("injuries") || "").trim(),
    budget_weekly: clamp(Number(data.get("budget_weekly")) || 2000, 500, 20000),
    platforms: platforms.length > 0 ? platforms : ["amazon", "flipkart"],
  };
}

function performanceFromForm(form) {
  const data = new FormData(form);
  return {
    energy_score: clamp(Number(data.get("energy_score")) || 7, 1, 10),
    recovery_score: clamp(Number(data.get("recovery_score")) || 7, 1, 10),
    sleep_hours: clamp(Number(data.get("sleep_hours")) || 8, 0, 14),
    soreness_score: clamp(Number(data.get("soreness_score")) || 4, 1, 10),
    match_performance: clamp(Number(data.get("match_performance")) || 75, 0, 100),
  };
}

async function generatePlan(profile, performance) {
  setStatus("Updating...");
  try {
    const response = await fetch(`${API_URL}/generate-plan`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        profile: { ...profile, allergies: csvList(profile.allergies), injuries: csvList(profile.injuries) },
        performance,
      }),
    });
    if (!response.ok) throw new Error("API unavailable");
    state.plan = await response.json();
    state.plan = refinePlanForUser(state.plan, profile, performance);
    setStatus("Live AI plan");
  } catch {
    state.plan = localPlan(profile, performance);
    setStatus("Saved locally");
  }
}

function localPlan(profile, performance) {
  const targets = calculateTargets(profile);
  const meals = selectMeals(profile, targets);
  return {
    targets,
    readiness_score: readinessScore(profile, performance, targets),
    recommendations: buildRecommendations(profile, performance, targets, meals),
    meals,
    cart: cartFromMeals(meals),
  };
}

function refinePlanForUser(plan, profile, performance) {
  const local = localPlan(profile, performance);
  return {
    ...plan,
    meals: local.meals,
    cart: local.cart,
    recommendations: [...new Set([...(plan.recommendations || []), ...local.recommendations])].slice(0, 5),
    readiness_score: local.readiness_score,
  };
}

function calculateTargets(profile) {
  const weight = Number(profile.weight_kg);
  const height = Number(profile.height_cm);
  const age = Number(profile.age);
  const training = Number(profile.training_hours_day);
  const genderOffset = profile.gender === "Female" ? -161 : 5;
  const bmr = 10 * weight + 6.25 * height - 5 * age + genderOffset;
  const levelBoost = { Beginner: 1.35, Intermediate: 1.5, Professional: 1.68 }[profile.playing_level] || 1.45;
  const goal = profile.goal.toLowerCase();
  let calories = Math.round(bmr * (levelBoost + Math.min(training * 0.06, 0.35)));

  if (goal.includes("gain") || goal.includes("muscle") || goal.includes("strength")) calories += 260;
  if (goal.includes("loss") || goal.includes("fat") || goal.includes("weight management")) calories -= 220;
  if (goal.includes("stamina") || profile.tournament_mode) calories += 180;

  const proteinMultiplier = goal.includes("strength") || goal.includes("muscle") ? 1.9 : training >= 3 ? 1.8 : 1.6;
  const carbShare = profile.tournament_mode || goal.includes("stamina") ? 0.53 : 0.47;
  const protein = Math.round(weight * proteinMultiplier);
  const carbs = Math.round((calories * carbShare) / 4);
  const fat = Math.max(42, Math.round((calories - protein * 4 - carbs * 4) / 9));
  const hydration = Number((weight * 0.04 + Math.max(training - 1, 0) * 0.35).toFixed(1));

  return {
    calories,
    protein_g: protein,
    carbs_g: carbs,
    fat_g: fat,
    hydration_liters: hydration,
    meal_timing: [
      training > 0 ? `${profile.training_time} training: main meal 2-3 hours before court time` : "Start with a balanced breakfast",
      training > 0 ? "Fast carb snack 45-60 minutes before play" : "Keep snacks light and protein-forward",
      "Recovery meal within 45 minutes after intense play",
      "Dinner 2 hours before sleep with easy digestion",
    ],
  };
}

function selectMeals(profile, targets) {
  const allowedDiets = profile.dietary_preference === "Vegan"
    ? ["vegan"]
    : profile.dietary_preference === "Vegetarian"
      ? ["vegetarian", "vegan"]
      : ["non-vegetarian", "vegetarian", "vegan"];
  const blocked = csvList(profile.allergies).map((item) => item.toLowerCase());
  const goal = profile.goal.toLowerCase();
  const wantedCategories = ["pre_workout", "post_workout", "match_day", "recovery", "snack"];

  return wantedCategories.map((category) => {
    const options = mealDatabase
      .filter((meal) => meal.category === category)
      .filter((meal) => allowedDiets.includes(meal.diet))
      .filter((meal) => !blocked.some((allergy) => meal.ingredients.toLowerCase().includes(allergy) || meal.name.toLowerCase().includes(allergy)))
      .map((meal) => ({
        ...meal,
        score: Math.abs(meal.calories - targets.calories / 5) - meal.tags.filter((tag) => goal.includes(tag)).length * 45,
      }))
      .sort((a, b) => a.score - b.score);

    return options[0] || emergencyMeal(category, profile.dietary_preference);
  }).map(({ score, tags, ...meal }) => meal);
}

function emergencyMeal(category, diet) {
  return {
    name: `${formatCategory(category)} Custom Bowl`,
    category,
    diet: diet.toLowerCase(),
    calories: 420,
    protein: 18,
    carbs: 62,
    fat: 10,
    ingredients: "rice:180g;vegetables:150g;fruit:1;electrolyte drink:1 pack",
  };
}

function cartFromMeals(meals) {
  const cart = {};
  meals.forEach((meal) => {
    String(meal.ingredients).split(";").forEach((entry) => {
      const [rawName, quantity = "as needed"] = entry.split(":");
      const key = rawName.trim().toLowerCase();
      if (!cart[key]) {
        cart[key] = {
          item: titleCase(rawName.trim()),
          quantity: quantity.trim(),
          weekly_count: 0,
          purpose: formatCategory(meal.category),
        };
      }
      cart[key].weekly_count += 1;
    });
  });
  return Object.values(cart);
}

function buildRecommendations(profile, performance, targets, meals) {
  const tips = [];
  const goal = profile.goal.toLowerCase();
  const injuries = profile.injuries.toLowerCase();
  const allergies = csvList(profile.allergies);

  tips.push(`${profile.name}, your plan is tuned for ${profile.playing_level.toLowerCase()} badminton and ${profile.training_hours_day}h/day ${profile.training_time.toLowerCase()} training.`);
  if (goal.includes("strength") || goal.includes("muscle")) tips.push("Protein is pushed higher to support muscle repair after strength sessions.");
  if (goal.includes("loss") || goal.includes("fat")) tips.push("Meals are lighter but still carb-timed around training to protect performance.");
  if (performance.sleep_hours < 7) tips.push("Sleep is low, so keep dinner easy to digest and avoid heavy late snacks.");
  if (performance.soreness_score >= 6 || injuries) tips.push("Add recovery foods like berries, greens, dal, tofu, paneer, salmon or turmeric-based meals.");
  if (targets.hydration_liters >= 3) tips.push(`Aim for ${targets.hydration_liters}L water and add electrolytes during long sessions.`);
  if (allergies.length) tips.push(`Meals containing ${allergies.join(", ")} were avoided in your plan.`);
  if (profile.city) tips.push(`Shop smart on your preferred platforms to get all ingredients near ${profile.city}.`);
  if (meals.length < 5) tips.push("Add more preferred foods in the meal database to expand your plan options.");

  return tips.slice(0, 6);
}

function readinessScore(profile, performance, targets) {
  const energy = performance.energy_score * 7.5;
  const recovery = performance.recovery_score * 6.8;
  const sleep = Math.min(performance.sleep_hours, 9) * 3.2;
  const hydration = Math.min(targets.hydration_liters, 4) * 3.5;
  const sorenessPenalty = performance.soreness_score * 2.8;
  const levelBonus = profile.playing_level === "Professional" ? 3 : profile.playing_level === "Intermediate" ? 1 : 0;
  return clamp(Math.round(energy + recovery + sleep + hydration + levelBonus - sorenessPenalty), 1, 100);
}

function addDailyMeal(mealName, calories, protein) {
  const today = new Date().toISOString().split('T')[0];
  if (!state.dailyIntake[today]) {
    state.dailyIntake[today] = {
      meals: [],
      totalCalories: 0,
      totalProtein: 0,
    };
  }
  state.dailyIntake[today].meals.push({
    name: mealName,
    calories,
    protein,
    time: new Date().toLocaleTimeString(),
  });
  state.dailyIntake[today].totalCalories += calories;
  state.dailyIntake[today].totalProtein += protein;
  persist();
  renderDailyIntake();
}

function renderAll() {
  const profile = state.profile;
  const { targets } = state.plan;
  document.getElementById("readinessScore").textContent = state.plan.readiness_score;
  document.getElementById("caloriesTarget").textContent = targets.calories;
  document.getElementById("proteinTarget").textContent = `${targets.protein_g}g`;
  document.getElementById("waterTarget").textContent = `${targets.hydration_liters}L`;
  document.getElementById("trainingLabel").textContent = `${profile.training_hours_day}h`;
  document.getElementById("caloriesProgress").value = Math.min(100, Math.round((targets.calories / 3600) * 100));
  document.getElementById("proteinProgress").value = Math.min(100, Math.round((targets.protein_g / 170) * 100));
  document.getElementById("waterProgress").value = Math.min(100, Math.round((targets.hydration_liters / 4.5) * 100));
  document.getElementById("energyScore").textContent = `${state.performance.energy_score}/10`;
  document.getElementById("recoveryScore").textContent = `${state.performance.recovery_score}/10`;
  document.getElementById("sleepScore").textContent = `${state.performance.sleep_hours}h`;
  document.getElementById("sorenessScore").textContent = `${state.performance.soreness_score}/10`;
  document.getElementById("budget").textContent = currency(profile.budget_weekly);
  updateProfileCompleteness(profile);
  const profileSummary = document.getElementById("profileSummary");
  if (profileSummary) {
    profileSummary.textContent = `${profile.name} · ${profile.dietary_preference} · ${profile.goal}`;
  }

  renderRecommendations();
  renderTiming();
  renderMeals();
  renderCart();
  renderDailyIntake();
  drawChart();
}

function renderRecommendations() {
  const list = document.getElementById("recommendations");
  list.innerHTML = "";
  state.plan.recommendations.forEach((tip) => {
    const item = document.createElement("div");
    item.className = "recommendation";
    item.textContent = tip;
    list.appendChild(item);
  });
}

function renderTiming() {
  const list = document.getElementById("timingList");
  list.innerHTML = "";
  state.plan.targets.meal_timing.forEach((text) => {
    const item = document.createElement("div");
    item.className = "timing-item";
    item.textContent = text;
    list.appendChild(item);
  });
}

function renderMeals() {
  const list = document.getElementById("mealList");
  const meals = state.activeFilter === "all"
    ? state.plan.meals
    : state.plan.meals.filter((meal) => meal.category === state.activeFilter);
  list.innerHTML = "";

  if (!meals.length) {
    list.innerHTML = `<div class="empty-state">No meals match this filter yet.</div>`;
    return;
  }

  meals.forEach((meal) => {
    const card = document.createElement("article");
    card.className = "meal-card";
    card.innerHTML = `
      <header>
        <div>
          <h3>${meal.name}</h3>
          <p>${formatCategory(meal.category)} · ${meal.diet}</p>
        </div>
        <strong>${meal.calories}</strong>
      </header>
      <p>${ingredientPreview(meal.ingredients)}</p>
      <div class="macro-row">
        <span><b>${meal.protein}g</b>Protein</span>
        <span><b>${meal.carbs}g</b>Carbs</span>
        <span><b>${meal.fat}g</b>Fat</span>
        <span><b>${ingredientCount(meal.ingredients)}</b>Items</span>
      </div>
      <button class="add-meal-btn" data-meal='${JSON.stringify(meal)}'>+ Add Today</button>
    `;
    card.querySelector(".add-meal-btn").addEventListener("click", () => {
      addDailyMeal(meal.name, meal.calories, meal.protein);
    });
    list.appendChild(card);
  });
}

function renderCart() {
  const list = document.getElementById("cartList");
  list.innerHTML = "";
  const activePlatforms = state.profile.platforms || ["amazon", "flipkart"];
  
  state.plan.cart.forEach((item, index) => {
    const row = document.createElement("div");
    row.className = "cart-row";
    
    let platformLinks = "";
    activePlatforms.forEach(key => {
      const platform = ECOMMERCE_PLATFORMS[key];
      const query = encodeURIComponent(`${item.item} ${item.quantity}`.trim());
      const url = platform.baseUrl + query;
      platformLinks += `<a href="${url}" target="_blank" rel="noopener" title="${platform.name}">${platform.icon}</a>`;
    });

    row.innerHTML = `
      <label class="cart-check">
        <input type="checkbox" ${item.done ? "checked" : ""} />
        <span>
          <strong>${item.item}</strong>
          <small>${item.quantity} · ${item.purpose} · ${item.weekly_count}x/week</small>
        </span>
      </label>
      <div class="cart-actions">
        ${platformLinks}
        <button class="remove-btn" aria-label="Remove ${item.item}">×</button>
      </div>
    `;
    
    row.querySelector("input").addEventListener("change", (event) => {
      state.plan.cart[index].done = event.target.checked;
      persist();
    });
    
    row.querySelector(".remove-btn").addEventListener("click", () => {
      state.plan.cart.splice(index, 1);
      persist();
      renderCart();
    });
    
    list.appendChild(row);
  });
}

function renderDailyIntake() {
  const today = new Date().toISOString().split('T')[0];
  const todayIntake = state.dailyIntake[today] || { meals: [], totalCalories: 0, totalProtein: 0 };
  const { targets } = state.plan;
  
  const list = document.getElementById("dailyIntakeList");
  list.innerHTML = "";

  const caloriesPercent = Math.round((todayIntake.totalCalories / targets.calories) * 100);
  const proteinPercent = Math.round((todayIntake.totalProtein / targets.protein_g) * 100);

  const summary = document.createElement("div");
  summary.className = "intake-summary";
  summary.innerHTML = `
    <div class="intake-stat">
      <span>Calories</span>
      <strong>${todayIntake.totalCalories} / ${targets.calories}</strong>
      <progress value="${Math.min(caloriesPercent, 100)}" max="100"></progress>
    </div>
    <div class="intake-stat">
      <span>Protein</span>
      <strong>${todayIntake.totalProtein}g / ${targets.protein_g}g</strong>
      <progress value="${Math.min(proteinPercent, 100)}" max="100"></progress>
    </div>
  `;
  list.appendChild(summary);

  if (todayIntake.meals.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "No meals logged today. Browse meals and add some!";
    list.appendChild(empty);
    return;
  }

  todayIntake.meals.forEach((meal, index) => {
    const item = document.createElement("div");
    item.className = "intake-item";
    item.innerHTML = `
      <div>
        <strong>${meal.name}</strong>
        <small>${meal.time}</small>
      </div>
      <div class="meal-macros">
        <span>${meal.calories} cal</span>
        <span>${meal.protein}g pro</span>
        <button class="remove-meal" aria-label="Remove meal">×</button>
      </div>
    `;
    item.querySelector(".remove-meal").addEventListener("click", () => {
      todayIntake.meals.splice(index, 1);
      todayIntake.totalCalories -= meal.calories;
      todayIntake.totalProtein -= meal.protein;
      if (todayIntake.meals.length === 0) delete state.dailyIntake[today];
      persist();
      renderDailyIntake();
    });
    list.appendChild(item);
  });
}

function updateProfileCompleteness(profile) {
  const requiredFields = [
    "name",
    "email",
    "city",
    "age",
    "height_cm",
    "weight_kg",
    "playing_level",
    "training_hours_day",
    "goal",
    "dietary_preference",
    "budget_weekly",
  ];
  const complete = requiredFields.filter((field) => String(profile[field] ?? "").trim() !== "").length;
  const percent = Math.round((complete / requiredFields.length) * 100);
  const label = document.getElementById("profileCompleteness");
  if (label) label.textContent = `${percent}% complete`;
}

function drawChart() {
  const canvas = document.getElementById("performanceChart");
  const ctx = canvas.getContext("2d");
  const history = state.planHistory.length
    ? state.planHistory.slice(-7).map((entry) => entry.readiness)
    : [74, 78, 70, 82, 80, 86, state.plan.readiness_score];
  const values = history.length === 1 ? [history[0], history[0]] : history;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "rgba(255,255,255,0.14)";
  ctx.lineWidth = 1;
  for (let i = 0; i < 4; i += 1) {
    const y = 20 + i * 36;
    ctx.beginPath();
    ctx.moveTo(12, y);
    ctx.lineTo(canvas.width - 12, y);
    ctx.stroke();
  }
  ctx.strokeStyle = "#4cff8f";
  ctx.lineWidth = 4;
  ctx.beginPath();
  values.forEach((value, index) => {
    const x = 18 + index * ((canvas.width - 36) / (values.length - 1));
    const y = canvas.height - 18 - (value / 100) * (canvas.height - 36);
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();
  ctx.fillStyle = "#58d8ff";
  values.forEach((value, index) => {
    const x = 18 + index * ((canvas.width - 36) / (values.length - 1));
    const y = canvas.height - 18 - (value / 100) * (canvas.height - 36);
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
  });
}

function fillForm(profile, performance) {
  const form = document.getElementById("profileForm");
  Object.entries(profile).forEach(([key, value]) => {
    const field = form.elements[key];
    if (!field) return;
    if (field.type === "checkbox") field.checked = Boolean(value);
    else field.value = value;
  });
  Object.entries(performance).forEach(([key, value]) => {
    const field = form.elements[key];
    if (field) field.value = value;
  });
  initPlatformSelectors();
}

function initPlatformSelectors() {
  const platformsGrid = document.getElementById("platformsGrid");
  if (!platformsGrid) return;
  platformsGrid.innerHTML = "";
  Object.entries(ECOMMERCE_PLATFORMS).forEach(([key, platform]) => {
    const label = document.createElement("label");
    label.className = "platform-checkbox";
    const isSelected = state.profile.platforms?.includes(key);
    label.innerHTML = `
      <input type="checkbox" name="platform_${key}" ${isSelected ? "checked" : ""} />
      <span>${platform.icon} ${platform.name}</span>
    `;
    platformsGrid.appendChild(label);
  });
}

function setStatus(text) {
  document.getElementById("apiStatus").textContent = text;
}

function formatCategory(category) {
  return String(category).replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function ingredientCount(ingredients) {
  return String(ingredients).split(";").filter(Boolean).length;
}

function ingredientPreview(ingredients) {
  return String(ingredients)
    .split(";")
    .map((item) => item.replace(":", " "))
    .slice(0, 4)
    .join(" · ");
}

function csvList(value) {
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function titleCase(value) {
  return value.replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function currency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

fillForm(state.profile, state.performance);
if (!state.plan.targets.calories) state.plan = localPlan(state.profile, state.performance);
persist();
renderAll();

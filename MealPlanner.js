<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Dynamic Meal Planner</title>
<script src="https://cdn.jsdelivr.net/npm/papaparse@5.4.1/papaparse.min.js"></script>
<style>
  body { font-family: sans-serif; padding: 20px; max-width: 600px; margin: auto; }
  .meal { margin: 5px 0; padding: 10px; border: 1px solid #ccc; border-radius: 5px; display: flex; justify-content: space-between; }
  .healthy { color: green; font-weight: bold; }
  button { padding: 10px 20px; margin-top: 20px; width: 100%; font-size: 16px; }
  input[type="file"] { margin-top: 10px; }
</style>
</head>
<body>

<h1>Dynamic Weekly Meal Planner</h1>
<label>Upload your meal CSV:</label>
<input type="file" id="csvFile" accept=".csv">
<div id="meal-plan"></div>
<button onclick="generateMealPlan()">Generate Meal Plan</button>

<script>
  const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  let meals = []; // This will hold meals loaded from CSV

  // Parse CSV when file is uploaded
  document.getElementById("csvFile").addEventListener("change", function(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: function(results) {
        // Expect CSV columns: name,category,healthy (healthy: true/false)
        meals = results.data.map(row => ({
          name: row.name,
          category: row.category,
          healthy: row.healthy.toLowerCase() === 'true'
        }));
        alert("Meals loaded successfully!");
      }
    });
  });

  function generateMealPlan() {
    if (meals.length === 0) {
      alert("Please upload a meal CSV first!");
      return;
    }

    const mealPlanDiv = document.getElementById("meal-plan");
    mealPlanDiv.innerHTML = ""; // Clear previous plan

    let plan = [];
    let lastCategory = null;
    let healthyCount = 0;

    // Repeat until we get ≥70% healthy meals
    while (true) {
      plan = [];
      lastCategory = null;
      healthyCount = 0;

      for (let day of DAYS) {
        // Filter meals to avoid same category consecutively
        let options = meals.filter(m => m.category !== lastCategory);
        if (options.length === 0) options = meals; // fallback if all meals are same category

        let meal = options[Math.floor(Math.random() * options.length)];
        plan.push({ day, meal });
        lastCategory = meal.category;
        if (meal.healthy) healthyCount++;
      }

      if ((healthyCount / DAYS.length) >= 0.7) break; // Acceptable plan
    }

    // Display plan
    for (let entry of plan) {
      const div = document.createElement("div");
      div.className = "meal";
      div.innerHTML = `<span>${entry.day}: ${entry.meal.name} (${entry.meal.category})</span> <span class="${entry.meal.healthy ? 'healthy' : ''}">${entry.meal.healthy ? '✅' : ''}</span>`;
      mealPlanDiv.appendChild(div);
    }

    const feedback = document.createElement("div");
    feedback.style.marginTop = "10px";
    feedback.style.fontWeight = "bold";
    feedback.innerText = `Healthy meals this week: ${Math.round((healthyCount / DAYS.length) * 100)}%`;
    mealPlanDiv.appendChild(feedback);
  }
</script>

</body>
</html>

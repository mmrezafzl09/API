document.addEventListener("DOMContentLoaded", function () {

  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjUsImVtYWlsIjoidm90aWplNTYwMEBwdGlvbmcuY29tIiwicm9sZXMiOlsic3R1ZGVudCIsInRlYWNoZXIiXSwiaWF0IjoxNzQ3NTAyNjg5LCJleHAiOjE3NTAwOTQ2ODl9.qjJOAFADhu_R0qo1yHuvBs1oQ7eHdi6wZCT_II2-uAs"
  
  const select = document.getElementById("categorySelect")
  const loader = document.getElementById("loaderSpinner")

  select.addEventListener("click", loadCategories)

  async function loadCategories() {

    loader.classList.remove("hidden")
    select.classList.add("hide-select-arrow") 
    try {
      const res = await fetch("https://api.timetally.info/api/v1/category/all", {
        headers: {
          "Accept" : "application/json"
        }
      })
      document.getElementById("categorySelect").style = "-webkit-appearance: default"
      
      const json = await res.json()
      select.innerHTML = "" 
      
      json.data.forEach(cat => {
        const option = document.createElement("option")
        option.value = cat.documentId
        option.textContent = cat.name
        select.appendChild(option)
      })
  
    } catch (error) {
      select.innerHTML = "<option value=''>Failed to load categories</option>"
      console.error("Error loading categories:", error)
    } finally {
      loader.classList.add("hidden")
      select.classList.remove("hide-select-arrow")
    }
  }
  
  
  document.getElementById("courseForm").addEventListener("submit", async function(e) {
      e.preventDefault()
  
      const form = e.target
      const data = {
      name: form.name.value,
      description: form.description.value,
      shortDescription: form.shortDescription.value,
      price: Number(form.price.value),
      categoryDocId: form.categoryDocId.value,
      }
  
      const messageEl = document.getElementById("message")
  
      try {
      const res = await fetch("https://api.timetally.info/api/v1/course", {
          method: "POST",
          headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": "Bearer " + token,
          },
          body: JSON.stringify(data)
      })
  
      if (res.ok) {
          messageEl.textContent = "Course submitted successfully!"
          messageEl.className = "mt-4 text-center text-green-600 font-semibold"
          form.reset()
      } else {
          const errData = await res.json()
          messageEl.textContent = "Error: " + (errData.message || "Failed to submit course")
          messageEl.className = "mt-4 text-center text-red-600 font-semibold"
      }
      } catch (error) {
      messageEl.textContent = "Request error: " + error.message
      messageEl.className = "mt-4 text-center text-red-600 font-semibold"
      }
  });
})



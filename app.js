document.addEventListener("DOMContentLoaded", () => {
  const dropdown = document.getElementById("customDropdown")
  const dropdownBtn = dropdown.querySelector(".dropdown-btn")
  const dropdownList = dropdown.querySelector(".dropdown-list")
  const selectedText = dropdown.querySelector(".selected-text")
  const spinner = dropdown.querySelector(".spinner")
  const icon = dropdown.querySelector(".icon")

  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjUsImVtYWlsIjoidm90aWplNTYwMEBwdGlvbmcuY29tIiwicm9sZXMiOlsic3R1ZGVudCIsInRlYWNoZXIiXSwiaWF0IjoxNzQ3NTAyNjg5LCJleHAiOjE3NTAwOTQ2ODl9.qjJOAFADhu_R0qo1yHuvBs1oQ7eHdi6wZCT_II2-uAs"

  let isLoading = false
  let notLoading = false

  dropdownBtn.addEventListener("click", async (e) => {
    e.stopPropagation()
    
    if (dropdownList.classList.contains("hidden")) {
      dropdownList.classList.remove("hidden")

      if (!notLoading && !isLoading) {
        isLoading = true
        icon.classList.add("hidden")
        spinner.classList.remove("hidden")

        try {
          const res = await fetch("https://api.timetally.info/api/v1/category/all", {
            headers: {
              "Accept": "application/json",
            },
          })

          const json = await res.json()

          dropdownList.innerHTML = ""

          json.data.forEach((cat) => {
            const item = document.createElement("li")
            item.textContent = cat.name
            item.dataset.value = cat.documentId
            item.className =
              "px-4 py-2 hover:bg-blue-100 cursor-pointer transition"

            item.addEventListener("click", () => {
              selectedText.textContent = cat.name
              dropdownList.classList.add("hidden")
            })
            dropdownList.appendChild(item)
          })

          notLoading = true
        } catch (error) {
          dropdownList.innerHTML =
            "<li class='px-4 mt-2 py-2 text-red-500'>Error loading categories</li>"
          console.error("Load failed:", error)
        } finally {
          spinner.classList.add("hidden")
          icon.classList.remove("hidden")
          isLoading = false
        }
      }
    } else {
      dropdownList.classList.add("hidden")
    }
  })

  document.addEventListener("click", (e) => {
    if (!dropdown.contains(e.target)) {
      dropdownList.classList.add("hidden")
    }
  })
})

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
})


